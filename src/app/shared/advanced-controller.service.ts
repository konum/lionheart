import { Injectable } from '@angular/core';
import { AdvancedGameService } from './advanced-game.service';
import { SettingsService } from './settings.service';
import { Piece, King, Knight, Soldier, Archer, Peasant, Heavy, Mercenary } from '../model/pieces';
import { Cell } from '../model/cell';
import { Player, Game } from '../model/game';
import { environment } from 'src/environments/environment';
import { GameControllerService } from './game-controller.service';
import { soundwin, AudioService } from './audio.service';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AdvancedControllerService extends AdvancedGameService {

  deployBoard: Cell[][];
  isDeploying = true;
  pieceToDeploy: Piece;
  saveEnabled = true;
  constructor(public alertController: AlertController, 
    public audio: AudioService, 
    public settingsService: SettingsService) {
    super(settingsService);
  }

  playSoundSync(sound) {
    if (this.playSound) {
      this.audio.playSoundSync(sound);
    }
  }

  switchTurn() {
    super.switchTurn();
  }

  doAttack() {
    this.canUndo = false;
    this.clearHightligth();
    this.playSoundSync(this.selectedPiece.sound);
    const attackingPiece = this.selectedPiece;
    this.selectedPiece.attacking = true;
    this.selectedPiece = undefined;
    setTimeout((board, piece) => {
      this.actionDone(piece, this.performAttack(piece, board, this.selectedEnemyPiece));
      piece.modifiers = piece.modifiers.filter(p => p.name !== 'Flanking');
      piece.attacking = false;
    }, 500, this.board, attackingPiece);
  }
  killPiece(board, piece: Piece) {
    setTimeout((piece2) => {
      if (board[piece2.row][piece2.col].amount === 0) {
        board[piece2.row][piece2.col] = new Cell(piece2.row, piece2.col);
      }
    }, 2000, piece);
    setTimeout((piece2) => {
      if (board[piece2.row][piece2.col].amount !== 0) {
        this.addEvent(board[piece2.row][piece2.col], 'Destroyed!');
      }
    }, 200, piece);
    super.killPiece(board, piece);
  }

  endGame(winner: Player) {
    setTimeout(() => {
      localStorage.removeItem(this.battleName);
      this.playSoundSync(soundwin);
      this.gameFinished = true;
      this.winner = winner;
    }, 2000);
  }


  addEvent(cell, event: string) {
    cell.events.push(event);
    this.blocked = true;
    setTimeout((cell2) => {
      this.blocked = false;
      cell2.events.pop();
    }, 2000, cell);
  }


  saveBattle() {
    if (this.saveEnabled) {
      const game: Game = {
        board: this.board,
        players: this.players,
        turn: this.turn,
        actionsLeft: this.actionsLeft,
        log: this.log,
        rules: this.rules
      };
      localStorage.setItem(this.battleName, JSON.stringify(game));
    }
  }

  loadBattle() {
    const game = JSON.parse(localStorage.getItem(this.battleName)) as Game;
    this.board = game.board;
    this.turn = game.turn;
    this.actionsLeft = game.actionsLeft;
    this.log = game.log;
    this.players = game.players;
    this.rules = game.rules;
    this.selectedPiece = undefined;
    this.selectedEnemyPiece = undefined;
    this.clearHightligth();
    this.canUndo = false;
    this.isDeploying = false;
  }

  undo() {
    if (this.canUndo) {
      this.loadBattle();
    } else {
      this.cancel();
    }
  }


  initBattle() {
    this.setupNewBattle();
    if (!!localStorage.getItem(this.battleName)) {
      this.alertController.create({
        header: 'Load battle?',
        message: 'There is a previous saved battle. Load it?',
        buttons: [{ text: 'No', handler: () => { localStorage.removeItem(this.battleName); } },
        { text: 'Yes', handler: () => this.loadBattle() }]
      }).then(p => p.present());
    }
    this.audio.stopBackgroundMusic();
  }
  setupNewBattle() {
    this.board = [[]];
    this.winner = undefined;
    this.gameFinished = false;
    this.isDeploying = true;
    this.log = [];
    this.rules = this.settingsService.getRules();
    this.canUndo = false;
    for (let row = 0; row < 9; row++) {
      this.board[row] = [];
      for (let col = 0; col < 9; col++) {
        this.board[row][col] = new Cell(row, col);
      }
    }
    const player1: Player = {
      id: 1,
      name: 'Blue player',
      color: "blue",
      kingAlive: true,
      unitCount: 1,
      defaultOrientation: 'S',
      points: 164
    };
    const player2: Player = {
      id: 2,
      name: 'Yellow player',
      color: "gold",
      kingAlive: true,
      unitCount: 1,
      defaultOrientation: 'N',
      points: 164
    };
    this.players = [player1, player2];
    this.board[0][4] = new King(0, 4, player1.defaultOrientation, player1);
    this.board[8][4] = new King(8, 4, player2.defaultOrientation, player2);
    this.turn = player1;
    this.setActionsLeft();
    this.generateDeployBoard();
    if (!environment.production) {
      this.autoDeploy();
    }
  }

  autoDeploy() {
    let maxRow = 2;
    if (this.rules.advancedFrontLine) {
      maxRow = 3;
    }
    for (let row = 0; row < maxRow; row++) {
      for (let col = 2; col < 7; col++) {
        if (!(this.board[row][col].isPiece)) {
          this.selectToDeploy(this.selectRandomPieceToDeploy());
          this.selectPiece(this.board[row][col]);
        }
      }
    }
  }
  selectRandomPieceToDeploy(): Cell {
    let piece;
    while (piece === undefined) {
      piece = this.deployBoard[0][Math.floor(Math.random() * 10)];
      if (!!piece && !piece.isPiece) {
        piece = undefined;
      }
    }
    return piece;
  }
  startBattle() {
    this.isDeploying = false;
    this.turn = this.players[1];
    this.restoreBoardForNewTurn();
  }
  generateDeployBoard() {
    this.deployBoard = [[]];
    this.deployBoard[0].push(new Knight(0, 0, 'N', this.turn));
    this.deployBoard[0].push(new Knight(0, 0, 'N', this.turn));
    this.deployBoard[0].push(new Soldier(0, 0, 'N', this.turn));
    this.deployBoard[0].push(new Soldier(0, 0, 'N', this.turn));
    this.deployBoard[0].push(new Archer(0, 0, 'N', this.turn));
    this.deployBoard[0].push(new Archer(0, 0, 'N', this.turn));
    this.deployBoard[0].push(new Peasant(0, 0, 'N', this.turn));
    this.deployBoard[0].push(new Heavy(0, 0, 'N', this.turn));
    this.deployBoard[0].push(new Mercenary(0, 0, 'N', this.turn));
  }

  selectPiece(cell: Cell) {
    if (this.isDeploying && cell.highlight) {
      this.pieceToDeploy.orientation = this.turn.defaultOrientation;
      this.pieceToDeploy.row = cell.row;
      this.pieceToDeploy.col = cell.col;
      this.board[cell.row][cell.col] = this.pieceToDeploy;
      for (let index = 0; index < this.deployBoard[0].length; index++) {
        const piece = this.deployBoard[0][index];
        if (!!piece && piece.selected && !this.settingsService.getRules().customArmy) {
          this.deployBoard[0][index] = new Cell(0, index);
          break;
        }
      }
      this.clearHightligth();
      this.clearDeloyBoardHightligth();
      this.pieceToDeploy = undefined;
      this.turn.unitCount++;
      if (this.turn.unitCount === 10) {
        if (this.turn !== this.players[1]) {
          this.turn = this.players[1];
          for (let row = 0; row < 3; row++) {
            for (let col = 2; col < 7; col++) {
              this.board[row][col].visible = false;
            }
          }
          this.generateDeployBoard();
        } else {
          for (let row = 0; row < 3; row++) {
            for (let col = 2; col < 7; col++) {
              this.board[row][col].visible = true;
            }
          }
          this.startBattle();
        }
      }
    } else if (!this.isDeploying) {
      super.selectPiece(cell);
    }
  }

  selectToDeploy(piece) {
    if (!(piece.isPiece)) {
      return;
    }
    if (!!this.pieceToDeploy) {
      this.pieceToDeploy.selected = false;
      this.pieceToDeploy = undefined;
    }
    this.pieceToDeploy = JSON.parse(JSON.stringify(piece));
    piece.selected = true;
    let initRow = 0;
    let rows = 2;
    this.turn === this.players[0] ? initRow = 0 : initRow = 7;
    if (this.rules.advancedFrontLine) {
      this.turn === this.players[0] ? initRow = 0 : initRow = 6;
      rows = 3;
    }
    for (let row = 0; row < rows; row++) {
      for (let col = 2; col < 7; col++) {
        if (!(this.board[initRow + row][col].isPiece)) {
          this.board[initRow + row][col].highlight = true;
        }
      }
    }
  }

  clearDeloyBoardHightligth() {
    this.deployBoard.forEach(row => {
      row.forEach(cell => {
        cell.highlight = false;
        cell.target = false;
        cell.move = false;
        cell.rotate = false;
        cell.selected = false;
        cell.overlay = false;
      });
    });
  }
}

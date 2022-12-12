import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AudioService, soundwin } from './audio.service';
import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';
import { SettingsService } from './settings.service';
import { Game, Player, Rules } from '../model/game';
import { BasicGameService } from './basic-game.service';
import { King, Knight, Archer, Soldier, Piece } from '../model/pieces';
import { Cell } from '../model/cell';

@Injectable({
  providedIn: 'root'
})
export class GameControllerService extends BasicGameService {

  saveEnabled = true;
  constructor(public alertController: AlertController, public audio: AudioService, public nativeAudio: NativeAudio, public settingsService: SettingsService) {
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
    this.clearHightligth();
    this.canUndo = false;
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
      if (board[piece2.row][piece2.col].amount != 0) {
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
      cell2.events.pop();
      this.blocked = false;
    }, 2000, cell);
  }


  saveBattle() {
    if (this.saveEnabled) {
      localStorage.setItem(this.battleName, JSON.stringify(this.getGame()));
    }
  }

  loadBattle() {
    const game = JSON.parse(localStorage.getItem(this.battleName)) as Game;
    this.setGame(game);
    this.selectedPiece = undefined;
    this.selectedEnemyPiece = undefined;
    this.clearHightligth();
    this.canUndo = false;
  }

  undo() {
    if (this.canUndo) {
      this.loadBattle();
    } else {
      this.cancel();
    }
  }

  initBattle() {
    this.setupNewBattle(this.settingsService.getRules());
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

  public setupNewBattle(rules: Rules) {
    this.board = [[]];
    this.winner = undefined;
    this.gameFinished = false;
    this.p1Dices = [];
    this.p2Dices = [];
    this.log = [];
    this.canUndo = false;
    this.rules = rules;
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
      unitCount: 10,
      points: 160,
      defaultOrientation: 'S'
    };
    const player2: Player = {
      id: 2,
      name: 'Yellow player',
      color: "gold",
      kingAlive: true,
      unitCount: 10,
      points: 160,
      defaultOrientation: 'N'
    };
    this.players = [player1, player2];
    this.createArmy(player1, 0);
    this.createArmy(player2, 8);
    this.turn = this.players[1];
    this.setActionsLeft();
    this.restoreBoardForNewTurn();
    this.setPieceBonus();
  }

  createArmy(player, row) {
    const mod = player.defaultOrientation === 'S' ? 1 : -1;
    this.board[row][4] = new King(row, 4, player.defaultOrientation, player);
    this.board[row][3] = new Knight(row, 3, player.defaultOrientation, player);
    this.board[row][5] = new Knight(row, 5, player.defaultOrientation, player);
    this.board[row][2] = new Archer(row, 2, player.defaultOrientation, player);
    this.board[row][6] = new Archer(row, 6, player.defaultOrientation, player);
    for (let index = 2; index < 7; index++) {
      this.board[row + mod][index] = new Soldier(row + mod, index, player.defaultOrientation, player);
    }
  }
}

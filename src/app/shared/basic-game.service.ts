import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Cell } from '../model/cell';
import { Game, Player, Rules } from '../model/game';
import { Piece } from '../model/pieces';
import { soundclick, sounddie, soundhit, soundhorn, soundmarch, soundmiss, soundnegative } from './audio.service';
import { SettingsService } from './settings.service';
import { actionRotate, actionAttack, actionMove } from './ai/ai';

@Injectable({
  providedIn: 'root'
})
export class BasicGameService {

  battleName = 'basic';
  board: Cell[][];
  selectedPiece: Piece;
  selectedEnemyPiece: Piece;
  turn: Player;
  actionsLeft = 2;
  p1Dices = [];
  p2Dices = [];
  players: Player[];
  gameFinished = false;
  winner: Player;
  log = [];
  rules: Rules;
  canUndo = true;
  playSound = true;
  player1Dices: Subject<number[]> = new Subject();
  player2Dices: Subject<number[]> = new Subject();
  turnChange: Subject<Player> = new Subject();
  blocked = false;
  constructor(public settingsService: SettingsService) { }


  addEvent(cell, event: string) {
  }

  playSoundSync(audio) {
  }

  saveBattle() {
  }


  endGame(winner: Player) {
  }

  getGame(): Game {
    return {
      board: this.board,
      players: this.players,
      turn: this.turn,
      actionsLeft: this.actionsLeft,
      log: this.log,
      rules: this.rules
    };
  }

  setGame(game: Game) {
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
  }

  selectPiece(cell) {
    if (this.blocked || this.actionsLeft === 0) {
      this.cancel();
      return;
    }
    if (!this.selectedPiece && cell.isPiece && cell.owner.name === this.turn.name) {
      const piece = (cell as Piece);
      piece.selected = true;
      this.selectedPiece = piece;
      this.showPieceActions(this.board, piece);
      this.playSoundSync(soundclick);
      cell.events = [];
    } else if (!!this.selectedPiece && cell.highlight) {
      this.saveBattle();
      const cost = this.movePiece(this.selectedPiece, this.board, cell);
      this.canUndo = true;
      this.playSoundSync(soundmarch);
      this.actionDone(this.selectedPiece, cost);
      this.clearHightligth();
      this.setPieceBonus();
    } else if (!!this.selectedPiece && cell.target) {
      this.selectedEnemyPiece = cell;
      if (this.rules.flankingBonus && this.selectedPiece.flanking && this.selectedPiece.orientation !== this.getOpositeOrientation(cell.orientation)) {
        this.selectedPiece.modifiers.push({ modifier: 1, name: 'Flanking' });
      } else {
        this.selectedPiece.modifiers = this.selectedPiece.modifiers.filter(p => p.name !== 'Flanking');
      }
    } else if (!!this.selectedPiece && !cell.highlight && cell.isPiece && cell.owner.id === this.selectedPiece.owner.id) {
      this.playSoundSync(soundclick);
      this.clearHightligth();
      this.selectedPiece = cell;
      this.showPieceActions(this.board, cell);
    } else if (!!this.selectedPiece && !cell.highlight) {
      this.cancel();
    }
  }

  makeMovement(move) {
    if (!move) {
      return;
    }
    let piece = this.board[move.piece.row][move.piece.col];
    let target = this.board[move.target.row][move.target.col];
    this.selectPiece(piece);
    if (move.action === actionMove) {
      target.highlight = true;
      this.selectPiece(target);
    }
    if (move.action === actionAttack) {
      target.target = true;
      this.selectPiece(target);
      this.doAttack();
    }
    if (move.action === actionRotate) {
      this.rotatePiece(piece as Piece, this.board, target);
    }
  }

  cancel() {
    this.clearHightligth();
    if (!!this.selectedPiece) {
      this.selectedPiece.modifiers = this.selectedPiece.modifiers.filter(p => p.name !== 'Flanking');
    }
    this.selectedPiece = undefined;
    this.selectedEnemyPiece = undefined;
    this.playSoundSync(soundnegative);
  }

  doAttack() {
    this.clearHightligth();
    this.playSoundSync(this.selectedPiece.sound);
    const attackingPiece = this.selectedPiece;
    this.actionDone(this.selectedPiece, this.performAttack(this.selectedPiece, this.board, this.selectedEnemyPiece));
    this.canUndo = false;
    attackingPiece.attacking = false;
  }

  getOpositePLayer(player: Player) {
    return player.id === this.players[0].id ? this.players[1] : this.players[0];
  }

  actionDone(piece, actions) {
    if (this.turn.id === piece.owner.id) {
      this.actionsLeft -= actions;
    }
    piece.actionsLeft -= actions;
    this.selectedPiece = undefined;
    this.selectedEnemyPiece = undefined;
  }

  switchTurn() {
    this.turn = this.players.filter((p) => p.name !== this.turn.name)[0];
    this.clearHightligth();
    this.setActionsLeft();
    this.restoreBoardForNewTurn();
    this.setPieceBonus();
    this.canUndo = false;
    this.turnChange.next(this.turn);
  }

  setActionsLeft() {
    if (!this.rules.totalBattle) {
      this.actionsLeft = this.rules.actionsPerTurn;
    } else {
      this.actionsLeft = this.turn.unitCount * 2;
    }
  }

  restoreBoardForNewTurn() {
    this.selectedPiece = undefined;
    this.board.forEach(row => {
      row.forEach((cell: any) => {
        if (cell.isPiece) {
          cell.selected = false;
          cell.rotate = false;
          cell.target = false;
          cell.attacksLeft = cell.attacks;
          cell.actionsLeft = 0;
          cell.hasMoved = false;
          if (cell.owner.id === this.turn.id) {
            cell.actionsLeft = this.rules.totalBattle ? 2 : this.rules.actionsPerTurn;
          }
        }
      });
    });
  }

  performAttack(piece: Piece, board, cell: Piece): number {
    let toThrow = Math.min(4, piece.dicesPerUnit * piece.amount);
    let canPanic = true;
    piece.modifiers.forEach(mod => {
      toThrow += mod.modifier;
    });
    if (this.rules.forKing && this.isKingNear(board, piece, piece.owner)) {
      canPanic = false;
    }
    this.rollDices(piece, toThrow);
    let panic = false;
    let hits = this.calculateHits(piece);
    if (toThrow === 1 && hits === 1 && cell.hitPoints > 1 && piece.extraDice) {
      this.rollDices(piece, toThrow);
      hits += this.calculateHits(piece);
      if (hits === 2) {
        this.addEvent(piece, 'Lucky hit!');
      }
      if (this.getDices(piece)[1] === 1 && canPanic) {
        this.addEvent(piece, 'Panic!');
        panic = true;
        this.panic(board, piece, this.getOpositeOrientation(piece.orientation));
      }
    }
    if (this.getDices(piece).filter(p => p === 1).length === this.getDices(piece).filter(p => p !== 0).length && canPanic) {
      this.addEvent(piece, 'Panic!');
      panic = true;
      this.panic(board, piece, this.getOpositeOrientation(piece.orientation));
    }
    const loses = Math.floor(hits / cell.hitPoints);
    if (loses > 0) {
      this.addEvent(cell, '-' + loses * cell.hitPoints);
      this.playSoundSync(soundhit);
      cell.amount = cell.amount - loses;
      this.getOpositePLayer(piece.owner).points -= loses * (piece.importance / piece.initialAmount);
    }
    if (loses === 0 && !panic) {
      this.addEvent(piece, 'Miss');
      this.playSoundSync(soundmiss);
    }
    if (cell.amount <= 0) {
      this.killPiece(board, cell);
      if (this.isDefeated(cell.owner)) {
        this.endGame(piece.owner);
      }
    } else if (this.rules.battleBack && cell.orientation === this.getOpositeOrientation(piece.orientation) && !piece.ranged && piece.owner.name === this.turn.name) {
      this.performAttack(cell, board, piece);
    }
    piece.attacksLeft--;
    return 1;
  }

  getDices(piece): number[] {
    if (piece.owner.id === 1) {
      return this.p1Dices;
    }

    if (piece.owner.id === 2) {
      return this.p2Dices;
    }
  }


  rollDices(piece, toThrow) {
    const dices = [];
    for (let index = 0; index < toThrow; index++) {
      const dice = 1 + Math.floor(Math.random() * 6);
      dices.push(dice);
    }
    for (let index = dices.length; index < 4; index++) {
      dices.push(0);
    }
    if (piece.owner.name === this.players[0].name) {
      this.player1Dices.next(dices);
      this.p1Dices = dices;
    }
    if (piece.owner.name === this.players[1].name) {
      this.player2Dices.next(dices);
      this.p2Dices = dices;
    }
  }

  calculateHits(piece): number {
    let hits = 0;
    this.getDices(piece).forEach(dice => {
      if (piece.hitsWith.includes(dice) || this.battleName === 'sim') {
        hits++;
      }
    });
    return hits;
  }

  panic(board, piece: Piece, newOrientation) {
    if (!piece.panic) {
      return;
    }
    this.playSoundSync(soundhorn);
    let rowMod = 0, colMod = 0;
    piece.orientation = newOrientation;
    switch (piece.orientation) {
      case 'S':
        rowMod = 1;
        break;
      case 'N':
        rowMod = -1;
        break;
      case 'E':
        colMod = 1;
        break;
      case 'W':
        colMod = -1;
        break;
    }

    if (!this.validCell(board, piece.row + rowMod, piece.col + colMod)) {
      this.killPiece(board, piece); //off the board, kill unit
    } else {
      let cell = board[piece.row + rowMod][piece.col + colMod];
      if (cell.isPiece) {
        if (cell.owner.name !== piece.owner.name || !cell.panic) {
          this.killPiece(board, piece); //enemy unit or king behind.
        } else {
          cell.orientation = piece.orientation;
          this.panic(board, cell, newOrientation); //friendly unit. Panic.
          cell = board[piece.row + rowMod][piece.col + colMod];
          this.rotateAndMove(board, piece, newOrientation, cell);
        }
      } else {
        this.rotateAndMove(board, piece, newOrientation, cell);
      }
    }
  }

  rotateAndMove(board, piece, newOrientation, cell) {
    piece.orientation = newOrientation;
    this.movePiece(piece, board, cell);
  }


  killPiece(board, piece: Piece) {
    this.addEvent(piece, 'Destroyed!');
    this.playSoundSync(sounddie);
    piece.amount = 0;
    this.players[piece.owner.id - 1].unitCount--;
    if (piece.name === 'king') {
      this.players[piece.owner.id - 1].kingAlive = false;
      piece.owner.kingAlive = false;
    }
  }

  isSameDirection(piece: Piece, cell: Cell) {
    if (piece.orientation === 'S' && piece.col === cell.col && piece.row < cell.row) {
      return true;
    }
    if (piece.orientation === 'N' && piece.col === cell.col && piece.row > cell.row) {
      return true;
    }
    if (piece.orientation === 'E' && piece.row === cell.row && cell.col > piece.col) {
      return true;
    }
    if (piece.orientation === 'W' && piece.row === cell.row && cell.col < piece.col) {
      return true;
    }
    return false;
  }

  isDefeated(player: Player): boolean {
    if (!player.kingAlive || this.players[player.id - 1].unitCount === 1) {
      player.points = -1000;
      return true;
    }
    return false;
  }


  clearHightligth() {
    this.board.forEach(row => {
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

  setPieceBonus() {
    this.board.forEach(row => {
      row.forEach(cell => {
        if (cell.isPiece) {
          const piece = cell as Piece;
          piece.modifiers = [];
          if (this.rules.cavalryCharge && piece.hasMoved && piece.charge) {
            piece.modifiers.push({ modifier: 1, name: 'Charge' });
          }
          if (this.rules.forKing && this.isKingNear(this.board, piece, piece.owner)) {
            piece.modifiers.push({ modifier: 1, name: 'For the King' });
          }
        }
      });
    });
  }

  showPieceActions(board, piece) {
    this.showMovement(board, piece);
    this.showAttacks(board, piece);
    this.showTurns(board, piece);
  }

  showAttacks(board, piece) {
    if (piece.attacksLeft === 0) {
      return;
    }
    this.getUnitTargets(this.board, piece).forEach(target => {
      target.highlight = false;
      target.target = true;
    });
  }

  getUnitTargets(board, piece) {
    const targets = [];
    if (piece.orientation === 'S' || piece.orientation === 'N') {
      const mod = piece.orientation === 'S' ? 1 : -1;
      for (let index = -1; index < 2; index++) {
        if (this.isEnemyPiece(board, piece, piece.row + mod, piece.col + index)) {
          targets.push(board[piece.row + mod][piece.col + index]);
        }
      }
    }
    if (piece.orientation === 'E' || piece.orientation === 'W') {
      const mod = piece.orientation === 'E' ? 1 : -1;
      for (let index = -1; index < 2; index++) {
        if (this.isEnemyPiece(board, piece, piece.row + index, piece.col + mod)) {
          targets.push(board[piece.row + index][piece.col + mod]);
        }
      }
    }
    if (piece.name === 'archer') {
      let rows, cols;
      switch (piece.orientation) {
        case 'N':
          rows = [-3, -2, -1];
          cols = [-1, 0, 1];
          break;
        case 'S':
          rows = [3, 2, 1];
          cols = [-1, 0, 1];
          break;
        case 'E':
          rows = [-1, 0, 1];
          cols = [3, 2, 1];
          break;
        case 'W':
          rows = [-1, 0, 1];
          cols = [-3, -2, -1];
          break;
      }
      rows.forEach(row => {
        cols.forEach(col => {
          if (this.isEnemyPiece(board, piece, piece.row + row, piece.col + col)) {
            targets.push(board[piece.row + row][piece.col + col]);
          }
        });
      });
    }
    return targets;
  }

  showMovement(board, piece: Piece) {
    if (piece.movementCost > piece.actionsLeft || piece.movementCost > this.actionsLeft) {
      return;
    }
    if (piece.orientation === 'S' || piece.orientation === 'N') {
      const mod = piece.orientation === 'S' ? 1 : -1;
      for (let index: number = 1; index <= piece.movement; index++) {
        if (this.validCell(board, piece.row + (index * mod), piece.col)) {
          if (board[piece.row + (index * mod)][piece.col].isPiece) {
            break;
          }
          board[piece.row + (index * mod)][piece.col].highlight = true;
          board[piece.row + (index * mod)][piece.col].move = true;
        }
      }
      [-1, 1].forEach(element => {
        if (this.validCell(board, piece.row + mod, piece.col + element) && !board[piece.row + mod][piece.col + element].isPiece) {
          board[piece.row + mod][piece.col + element].highlight = true;
          board[piece.row + mod][piece.col + element].move = true;
        }
      });
    }
    if (piece.orientation === 'E' || piece.orientation === 'W') {
      const mod = piece.orientation === 'E' ? 1 : -1;
      for (let index: number = 1; index <= piece.movement; index++) {
        if (this.validCell(board, piece.row, piece.col + (index * mod))) {
          if (board[piece.row][piece.col + (index * mod)].isPiece) {
            break;
          }
          board[piece.row][piece.col + (index * mod)].highlight = true;
          board[piece.row][piece.col + (index * mod)].move = true;
        }
      }
      [-1, 1].forEach(element => {
        if (this.validCell(board, piece.row + element, piece.col + mod) && !board[piece.row + element][piece.col + mod].isPiece) {
          board[piece.row + element][piece.col + mod].highlight = true;
          board[piece.row + element][piece.col + mod].move = true;
        }
      });
    }
  }

  movePiece(piece: Piece, board, cell: Cell) {
    board[cell.row][cell.col] = piece;
    board[piece.row][piece.col] = new Cell(piece.row, piece.col);
    piece.col = cell.col;
    piece.row = cell.row;
    piece.hasMoved = true;
    return piece.movementCost;
  }

  rotateSelectedPiece(direction: number) {
    this.saveBattle();
    switch (this.selectedPiece.orientation) {
      case 'N':
        if (direction === 1) this.selectedPiece.orientation = 'E';
        if (direction === -1) this.selectedPiece.orientation = 'W';
        if (direction === 2) this.selectedPiece.orientation = 'S';
        break;
      case 'E':
        if (direction === 1) this.selectedPiece.orientation = 'S';
        if (direction === -1) this.selectedPiece.orientation = 'N';
        if (direction === 2) this.selectedPiece.orientation = 'W';
        break;
      case 'S':
        if (direction === 1) this.selectedPiece.orientation = 'W';
        if (direction === -1) this.selectedPiece.orientation = 'E';
        if (direction === 2) this.selectedPiece.orientation = 'N';
        break;
      case 'W':
        if (direction === 1) this.selectedPiece.orientation = 'N';
        if (direction === -1) this.selectedPiece.orientation = 'S';
        if (direction === 2) this.selectedPiece.orientation = 'E';
        break;
      default:
        break;
    }
    this.canUndo = true;
    this.playSoundSync(soundmarch);
    this.actionDone(this.selectedPiece, 1);
    this.clearHightligth();
  }

  showTurns(board, piece) {
    if (this.validCell(board, piece.row, piece.col + 1)) {
      board[piece.row][piece.col + 1].rotate = !this.isSameDirection(piece, board[piece.row][piece.col + 1]);
    }
    if (this.validCell(board, piece.row, piece.col - 1)) {
      board[piece.row][piece.col - 1].rotate = !this.isSameDirection(piece, board[piece.row][piece.col - 1]);
    }
    if (this.validCell(board, piece.row + 1, piece.col)) {
      board[piece.row + 1][piece.col].rotate = !this.isSameDirection(piece, board[piece.row + 1][piece.col]);
    }
    if (this.validCell(board, piece.row - 1, piece.col)) {
      board[piece.row - 1][piece.col].rotate = !this.isSameDirection(piece, board[piece.row - 1][piece.col]);
    }
  }

  rotatePiece(piece: Piece, board, cell: Cell) {
    if (cell.col > piece.col) {
      piece.orientation = 'E';
    }
    if (cell.col < piece.col) {
      piece.orientation = 'W';
    }
    if (cell.row < piece.row) {
      piece.orientation = 'N';
    }
    if (cell.row > piece.row) {
      piece.orientation = 'S';
    }
    this.actionDone(piece, 1);
    this.clearHightligth();
  }

  isKingNear(board, piece, owner) {
    let isKingNear = false;
    if (piece.name === 'king') {
      return false;
    }
    [-1, 0, 1].forEach(row => {
      [-1, 0, 1].forEach(col => {
        const ro = piece.row + row;
        const co = piece.col + col;
        if (this.validCell(board, ro, co) && board[ro][co].isPiece) {
          if (board[ro][co].owner.id === owner.id && board[ro][co].name === 'king') {
            isKingNear = true;
          }
        }
      });
    });
    return isKingNear;
  }

  //Returns true if owner king is target to some enemy unit
  isKingThreated(board, owner): boolean {
    let threat = false;
    board.forEach(row => {
      row.forEach(cell => {
        if (cell.isPiece) {
          const piece = cell as Piece;
          if (piece.owner.id !== owner.id && this.getUnitTargets(board, piece).filter(p => p.name === 'king').length === 1) {
            threat = true;
          }
        }
      });
    });
    return threat;
  }

  isEnemyPiece(board, piece, row, col): boolean {
    return this.validCell(board, row, col) && board[row][col].isPiece && board[row][col].owner.name !== piece.owner.name;
  }
  validCell(board, row, col) {
    return !!board[row] && !!board[row][col];
  }

  getOpositeOrientation(orientation: string) {
    switch (orientation) {
      case 'S':
        return 'N';
      case 'N':
        return 'S';
      case 'E':
        return 'W';
      case 'W':
        return 'E';
    }
    return 'E';
  }
}

import { Injectable } from '@angular/core';
import { Piece } from '../model/pieces';
import { Player} from '../model/game';
import { BasicGameService } from './basic-game.service';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class AdvancedGameService extends BasicGameService {

  battleName = 'advanced';

  constructor(public settingsService: SettingsService) {
    super(settingsService);
  }


  showAttacks(board, piece) {
    super.showAttacks(board, piece);
    if (piece.name === 'heavy' && piece.attacksLeft > 0) {
      for (let row = -1; row < 2; row++) {
        for (let col = -1; col < 2; col++) {
          if (this.isEnemyPiece(board, piece, piece.row + row, piece.col + col)) {
            board[piece.row + row][piece.col + col].target = true;
            board[piece.row + row][piece.col + col].highlight = false;
            board[piece.row + row][piece.col + col].rotate = false;
          }
        }
      }
    }
  }

  endGame(winner: Player) {
    super.endGame(winner);
    localStorage.removeItem(this.battleName);
  }

  actionDone(piece, actions) {
    super.actionDone(piece, actions);
    this.board.forEach(row => {
      row.forEach((cell: any) => {
        if (cell.name === 'mercenary') {
          const enemy = cell.owner.id === this.players[0].id ? this.players[1] : this.players[0];
          if (this.isKingNear(this.board, cell, enemy) && !this.isKingNear(this.board, cell, cell.owner)) {
            cell.owner = enemy;
            cell.actionsLeft = 2;
            this.players[enemy.id - 1].unitCount++;
          }
        }
      });
    });
  }

  performAttack(piece: Piece, board, cell: Piece) {
    super.performAttack(piece, board, cell);
    if (piece.name === 'mercenary') {
      this.getDices(piece).forEach(dice => {
        if (dice === 1 && cell.amount !== 0) {
          this.retreat(this.board, cell, piece.orientation);
        }
      });
    }
    if (piece.name === 'peasant') {
      let mod = 0;
      if (this.getDices(piece).filter(p => p === 1).length === this.getDices(piece).length) {
        mod = -1;
      }
      if (this.getDices(piece).filter(p => p === 1).length !== 0) {
        this.addEvent(piece, 'Panic');
        this.panicExtended(board, piece, this.getDices(piece).filter(p => p === 1).length + mod);
      }
    }
    if (cell.name === 'heavy' && this.rules.battleBack && cell.orientation !== this.getOpositeOrientation(piece.orientation) && !piece.ranged && piece.owner.name === this.turn.name) {
      this.performAttack(cell, board, piece);
    }
    return 1;
  }

  calculateHits(piece): number {
    let hits = super.calculateHits(piece);
    if (piece.name === 'peasant') {
      let axe = 0, arrow = 0;
      this.getDices(piece).forEach(dice => {
        if (dice > 1 && dice < 5) axe++;
        if (dice > 4) arrow++;
      });
      hits = Math.max(arrow, axe);
    }
    return hits;
  }


  panicExtended(board, piece, amount) {
    const orientation = this.getOpositeOrientation(piece.orientation);
    while (amount-- > 0) {
      if (piece.amount > 0) {
        this.panic(board, piece, orientation);
      }
    }
  }

  retreat(board, piece: Piece, direction) {
    if (!piece.panic) {
      return;
    }
    let rowMod = 0, colMod = 0;
    switch (direction) {
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
        colMod = +1;
        break;
    }
    const row = piece.row + rowMod;
    const col = piece.col + colMod;
    if (!this.validCell(board, row, col)) {
      this.killPiece(board, piece); //enemy unit or king behind.
    } else if ((board[row][col].isPiece)) {
      this.addEvent(piece, 'Panic');
      this.panic(board, piece, direction); //unit behind, panic unit.
    } else {
      this.addEvent(piece, 'Retreat');
      this.movePiece(piece, board, board[row][col]);
    }
  }


}

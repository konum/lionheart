
import { AI, actionMove, actionAttack, actionRotate } from './ai';
import { EasyAI } from './easyAI';
import { Piece, Movement } from 'src/app/model/pieces';
import { Cell } from 'src/app/model/cell';
import { BasicGameService } from '../basic-game.service';
import { Player, Game } from 'src/app/model/game';
import { Subject, Subscription } from 'rxjs';


export class BaseAIService {


  playing = true;
  myPlayerId = 1;
  scanDepth = 1;
  turnsToPlay = 4;
  movements: Movement[];
  game: BasicGameService;
  ai: AI;
  actionsLeft = 1;
  sub: Subscription;
  aiDone: Subject<true> = new Subject();
  constructor() {
    this.ai = new EasyAI();
  }

  setGame(game, playerId) {
    this.game = game;
    this.playing = true;
    this.myPlayerId = playerId;
    this.sub = this.game.turnChange.subscribe((player: Player) => {
      if (this.myPlayerId === player.id) {
        this.actionsLeft = this.game.actionsLeft;
        this.turnLoop();
      }
    });
  }


  endAI() {
    if (!!this.sub)
      this.sub.unsubscribe();
    this.playing = false;
  }

  turnLoop() {
    while (this.actionsLeft > 0) {
      this.makeMove();
      if (this.game.gameFinished) {
        break;
      }
      this.actionsLeft--;
    }
    if (!this.game.gameFinished) {
      this.game.switchTurn();
    } else if (!!this.sub) {
      this.sub.unsubscribe();
    }
  }

  makeMove() {
    this.calculateMovements();
    this.game.makeMovement(this.getBestMovement());
  }



  getBestMovement(): Movement {
    if (this.movements.length === 0) {
      return undefined;
    }
    if (this.scanDepth === 0 || this.myPlayerId !== 1) {
      return this.movements[0];
    }
    const myPoints = this.game.players[0].points;
    const enemyPoints = this.game.players[1].points;
    const kingThreat = this.game.isKingThreated(this.game.board, this.game.players[0]);
    const ai: BaseAIService = new BaseAIService();
    const ai2: BaseAIService = new BaseAIService();
    ai.myPlayerId = 1;
    ai2.myPlayerId = 2;
    ai.scanDepth = this.scanDepth - 1;
    ai2.scanDepth = this.scanDepth - 1;
    for (let index = 0; index < this.movements.length; index++) {
      const simulation = new BasicGameService(undefined);
      simulation.battleName = "sim";
      simulation.setGame(JSON.parse(JSON.stringify(this.game.getGame())));
      simulation.makeMovement(this.movements[index]);
      ai.game = simulation;
      ai2.game = simulation;
      this.turnsToPlay = 1;
      while (this.turnsToPlay-- > 0) {
        let actions = simulation.actionsLeft;
        while (actions-- > 0) {
          ai.makeMove();
        }
        simulation.switchTurn();
        actions = simulation.actionsLeft;
        while (actions-- > 0) {
          ai2.makeMove();
        }
        simulation.switchTurn();
      }
      const move = this.movements[index];
      //console.log(`Move ${move.action} ${move.piece.name} ${move.piece.row},${move.piece.col} to  ${move.target.row},${move.target.col} Hits: ${hits} Loses:${loses}`);
      this.movements[index].evaluation *= this.evaluateGame(simulation, myPoints, enemyPoints, kingThreat);
    }
    this.movements = this.movements.sort((b, a) => a.evaluation - b.evaluation);
    //console.log(`Best movements of turn ======================= `);
  /*   for (let index = 0; index < 6; index++) {
      const move = this.movements[index];
      console.log(`Move: ${move.evaluation} action: ${move.action} piece: ${move.piece.name}  row, col: ${move.piece.row}, ${move.piece.col}`)
    } */
    return this.movements[0];
  }

  evaluateGame(game: BasicGameService, p1points, p2points, isKingThreated): number {
/*     if (!game.players[0].kingAlive) {
      return -1;
    } */
    let base = 1;
    const kingThreat = game.isKingThreated(game.board, game.players[0]);
    const kingThreatEnemy = game.isKingThreated(game.board, game.players[1]);
    const loses = p1points - game.players[0].points;
    const hits = p2points - game.players[1].points;
    if (kingThreat && !isKingThreated) { //if king wasn't threated we don't want to put it in danger.
      base -=0.2;
    }
    if (isKingThreated && !kingThreat && loses === 0 && hits === 0){
      base +=0.5;
    }
    if (isKingThreated && !kingThreat && loses > 0 && hits === 0){
      base +=0.2;
    }
    if (isKingThreated && !kingThreat &&  (loses !== 0 && hits !== 0)){
      base +=0.3;
    }

    if (kingThreatEnemy){
      base +=0.2;
    }
    if (!game.players[1].kingAlive) {
      base +=1;
    }
    if (hits === 0 && loses > 0) {
      base -=0.1;
    }
    if (hits > 0 && loses === 0) {
      base +=0.3;
    }
    if (hits > loses) {
      base +=0.2;
    }

    if (loses > hits) {
      base -=0.1;
    }
    return base;
  }

  calculateMovements() {
    this.movements = [];
    const heatMap = this.generateHeatMap(this.game.board);
    this.game.playSound = false;
    this.game.board.forEach(row => {
      row.forEach(cell => {
        if (cell.isPiece) {
          const piece = cell as Piece;
          if (piece.owner.id === this.myPlayerId) {
            this.game.selectPiece(piece);
            this.movements = this.movements.concat(this.getPieceActions(this.game.board, piece, heatMap, this.game));
            this.game.cancel();
          }
        }
      });
    });
    this.movements = this.movements.sort((b, a) => a.evaluation - b.evaluation);
    this.game.playSound = true;
  }

  generateHeatMap(board): number[][] {
    const heatMap: number[][] = [[]];
    const radio = 9;
    for (let row = 0; row < 9; row++) {
      heatMap[row] = [];
      for (let col = 0; col < 9; col++) {
        heatMap[row].push(0);
      }
    }
    board.forEach(row => {
      row.forEach(cell => {
        if (cell.isPiece) {
          const piece = cell as Piece;
          if (piece.owner.id !== this.myPlayerId) {
            this.generateHeatForPiece(piece, heatMap, radio);
          }
        }
      });
    });
    return heatMap;
  }

  generateHeatForPiece(piece, heatMap, radio) {
    const distance = radio;
    for (let row = -distance; row <= distance; row++) {
      for (let col = -distance; col <= distance; col++) {
        if (heatMap[piece.row + row] !== undefined && heatMap[piece.row + row][piece.col + col] !== undefined) {
          let mod = 1;
          if (piece.col <= 1 || piece.col > 6) {
            mod = 2;
          }
          if (this.game.getUnitTargets(this.game.board, piece).filter(p => p.name === 'king').length === 1) {
            mod = 10;
          }
          heatMap[piece.row + row][piece.col + col] += mod * Math.floor((piece.importance * (9 - piece.row)) / (7 * (1 + Math.abs(piece.row - (piece.row + row)) + Math.abs(piece.col - (piece.col + col)))));
        }
      }
    }

  }

  getPieceActions(board: Cell[][], pieceToMove, heatMap, game): Movement[] {
    const moves: Movement[] = [];
    board.forEach(row => {
      row.forEach(cell => {
        if (cell.highlight) {
          moves.push({ action: actionMove, piece: pieceToMove, target: cell, evaluation: this.ai.evaluateMove(pieceToMove, cell, heatMap, actionMove, game) });
        }
        if (cell.target) {
          moves.push({ action: actionAttack, piece: pieceToMove, target: cell, evaluation: this.ai.evaluateMove(pieceToMove, cell, heatMap, actionAttack, game) });
        }
        if (cell.rotate) {
          moves.push({ action: actionRotate, piece: pieceToMove, target: cell, evaluation: this.ai.evaluateMove(pieceToMove, cell, heatMap, actionRotate, game) });
        }
      });
    });
    return moves;
  }

}

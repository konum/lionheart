import { Component, OnInit } from '@angular/core';
import { Cell } from '../model/cell';
import { Soldier, King, Archer, Piece, Knight } from '../model/pieces';
import { TutorialService } from '../shared/tutorial.service';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
})
export class TutorialPage implements OnInit {

  text: string;
  step = 0;
  showPieceActions = true;
  showPass = true;
  stepsText = [
    'In Lionheart Battles two kings confront their armies in the battle field. You must kill the enemy king or destroy his entire army.',
    'On each turn each player can perform these actions: move, rotate and attack.',
    'Each unit of the game has strength, resistance and special rules. See the Units help for info on each unit.',
    'This your king. Is your most important unit of your army. If he dies you lose. It is necessary at least 2 hits to kill him.',
    'Click on it to see the actions it can do.',
    'To rotate your unit use the buttons in your dash. You can use the Undo button to undo a rotation or movement. Hit Next when you are ready.',
    'Rotate a unit in any direction (even backwards) costs 1 action.',
    'Units can move forward and diagonal and move in any free cell in front of them. Cavalry units can move up to 4 cells in front of them. Select your king to show the movements.',
    'Now select one of the empty cells that are higlighted in front of your king.',
    'Moving a unit costs 1 action. Heavy infantry units cost 2 actions to move.',
    'Units can attack any unit in front of them. Select your soldier.',
    'All enemy units that are in range of your selected units will be marked in red. Selet one enemy unit.',
    'Your selected unit and the target unit will appear in your dash, showing statistics on each unit.',
    'For each Strength point, one dice is rolled. Melee units hits with swords and archers hit with arrows. Now press attack.',
    'To hurt units with Resistance 2 (Knights, King and Heavy Infantry) you need two hits in the same roll. Attack the Knight.',
    'Infantry, Archers and Mercenaries with Strengh 1 have a small chance of hitting units with Resistance 2, but be ware of panic! Press next.',
    'When a unit strength reaches 0 the unit dies and is removed from the game.',
    'Archers can hit far away. They can attack any unit in a 3x3 square in front of them.',
    'Archers hit with arrows. Destroy the enemy units.',
    'If an attack only rolls Panic, the attacking unit will flee one cell. Press next to see it.',
    'Press next.',
    'Watch out! Panic spreads to other units of your army. If a unit leaves the battlefield while fleeing it will be destroyed.',
    'Press next.',
    'If a fleeing unit encounters your king or an enemy unit it will be destroyed.',
    'Press next.',
    'Thats it! You know the basis of Lionheart Battles. Good luck!'
  ];
  steps = [
    undefined,
    undefined,
    undefined,
    this.kingAlone,
    undefined,
    undefined,
    undefined,
    this.kingAlone,
    undefined,
    undefined,
    this.combat,
    () => this.game.blocked = false,
    () => this.game.blocked = false,
    () => this.game.blocked = false,
    this.combatKnight,
    this.combatKnight2,
    this.combatKnight3,
    this.archer,
    () => this.game.blocked = false,
    this.panic1,
    this.panic2,
    this.panic3,
    this.panic4,
    this.panic5,
    this.panic6,
    () => this.game.blocked = true,
  ];
  constructor(public game: TutorialService) { }

  ngOnInit() {
    this.game.setupNewBattle({ actionsPerTurn: 2 });
    this.game.turn = this.game.players[1];
    this.game.blocked = true;
    this.game.board.forEach(row => {
      row.forEach(cell => {
        if (cell.isPiece) {
          (cell as any).actionsLeft = 0;
        }
      });
    });
  }

  switchTurn() {

  }

  undo() {
    this.game.undo();
  }

  rotate(dir) {
    this.game.rotateSelectedPiece(dir);
  }

  cancel() {
    this.game.cancel();
  }

  attack() {
    this.game.doAttack();
  }
  back() {
    this.step--;
    this.step < 0 ? this.step = 0 : '';
    if (!!this.steps[this.step]) {
      this.steps[this.step](this);
    }
  }

  next() {
    this.game.turn = this.game.players[1];
    if (!!this.game.selectedPiece) {
      this.game.clearHightligth();
      this.game.selectedPiece = undefined;
      this.game.selectedEnemyPiece = undefined;
    }

    this.game.actionsLeft = 2;
    this.step++;
    this.step === this.steps.length ? this.step = this.steps.length - 1 : '';
    if (!!this.steps[this.step]) {
      this.steps[this.step](this);
    }
  }

  selectPiece(cell: Cell) {
    this.game.turn = this.game.players[1];
    this.game.actionsLeft = 2;
    this.game.selectPiece(cell);
  }


  kingAlone(tutorial) {
    tutorial.game.blocked = false;
    tutorial.prepareBoard(tutorial, 9);
    tutorial.game.board[8][4] = new King(8, 4, 'N', tutorial.game.turn);
    tutorial.game.board[8][4].actionsLeft = 100;
  }

  combat(tutorial) {
    tutorial.game.blocked = false;
    tutorial.prepareBoard(tutorial, 9);
    tutorial.game.board[8][4] = new Soldier(8, 4, 'N', tutorial.game.turn);
    tutorial.game.board[8][4].actionsLeft = 100;
    tutorial.game.board[7][4] = new Soldier(7, 4, 'S', tutorial.game.players[0]);
    tutorial.game.board[7][3] = new Soldier(7, 3, 'S', tutorial.game.players[0]);
    tutorial.game.board[7][5] = new Soldier(7, 5, 'S', tutorial.game.players[0]);
  }

  combatKnight(tutorial) {
    tutorial.game.blocked = false;
    tutorial.prepareBoard(tutorial, 9);
    tutorial.game.board[8][4] = new Soldier(8, 4, 'N', tutorial.game.turn);
    tutorial.game.board[8][4].actionsLeft = 100;
    tutorial.game.board[7][4] = new Knight(7, 4, 'S', tutorial.game.players[0]);
  }
  combatKnight2(tutorial) {
    tutorial.game.blocked = true;
    tutorial.prepareBoard(tutorial, 9);
    tutorial.game.board[8][4] = new Soldier(8, 4, 'N', tutorial.game.turn);
    tutorial.game.board[8][4].amount = 1;
    tutorial.game.board[8][4].actionsLeft = 100;
    tutorial.game.board[7][4] = new Knight(7, 4, 'S', tutorial.game.players[0]);
    tutorial.game.selectPiece(tutorial.game.board[8][4]);
    tutorial.game.selectPiece(tutorial.game.board[7][4]);
  }
  combatKnight3(tutorial) {
    tutorial.game.blocked = true;
    tutorial.prepareBoard(tutorial, 9);
    tutorial.game.board[8][4] = new Soldier(8, 4, 'N', tutorial.game.turn);
    tutorial.game.board[8][4].amount = 1;
    tutorial.game.board[8][4].actionsLeft = 100;
    tutorial.game.board[7][4] = new Knight(7, 4, 'S', tutorial.game.players[0]);
    tutorial.game.board[7][4].amount = 2;
    tutorial.game.selectPiece(tutorial.game.board[8][4]);
    tutorial.game.selectPiece(tutorial.game.board[7][4]);
    tutorial.game.p2Dices = [2, 2, 0, 0];
    tutorial.game.player2Dices.next([2, 2, 0, 0]);
    tutorial.game.clearHightligth();
    tutorial.game.selectedPiece = undefined;
    tutorial.game.selectedEnemyPiece = undefined;
    tutorial.game.addEvent(tutorial.game.board[8][4], 'Lucky hit!');
    tutorial.game.addEvent(tutorial.game.board[7][4], '-2');
  }
  archer(tutorial) {
    tutorial.showPieceActions = true;
    tutorial.game.blocked = false;
    tutorial.showPass = true;
    tutorial.prepareBoard(tutorial, 9);
    tutorial.game.board[8][4] = new Archer(8, 4, 'N', tutorial.game.turn);
    tutorial.game.board[8][4].actionsLeft = 100;
    tutorial.game.board[5][3] = new Soldier(5, 3, 'S', tutorial.game.players[0]);
    tutorial.game.board[5][5] = new Soldier(5, 5, 'S', tutorial.game.players[0]);
    tutorial.game.board[7][5] = new Soldier(7, 5, 'S', tutorial.game.players[0]);
    tutorial.game.board[7][3] = new Soldier(7, 3, 'S', tutorial.game.players[0]);
  }

  panic1(tutorial) {
    tutorial.showPieceActions = false;
    tutorial.showPass = false;
    tutorial.game.blocked = false;
    tutorial.prepareBoard(tutorial, 9);
    tutorial.game.board[6][4] = new Soldier(6, 4, 'N', tutorial.game.turn);
    tutorial.game.board[6][4].actionsLeft = 1;
    tutorial.game.board[5][4] = new Soldier(5, 4, 'S', tutorial.game.players[0]);
    tutorial.selectPiece(tutorial.game.board[6][4]);
    tutorial.selectPiece(tutorial.game.board[5][4]);
    tutorial.game.blocked = true;
  }

  panic2(tutorial: TutorialPage) {
    tutorial.panic1(tutorial);
    tutorial.showPieceActions = true;
    tutorial.showPass = false;
    tutorial.game.blocked = true;
    tutorial.game.p2Dices = [1, 1, 1, 1];
    tutorial.game.player2Dices.next([1, 1, 1, 1]);
    tutorial.game.clearHightligth();
    tutorial.game.selectedPiece = undefined;
    tutorial.game.selectedEnemyPiece = undefined;
    tutorial.game.addEvent(tutorial.game.board[6][4], 'Panic');
    tutorial.game.panic(tutorial.game.board, tutorial.game.board[6][4] as Piece, 'S');
  }

  panic3(tutorial) {
    tutorial.game.blocked = false;
    tutorial.showPieceActions = true;
    tutorial.showPass = false;
    tutorial.prepareBoard(tutorial, 9);
    tutorial.game.board[6][4] = new Soldier(6, 4, 'N', tutorial.game.turn);
    tutorial.game.board[7][4] = new Soldier(7, 4, 'N', tutorial.game.turn);
    tutorial.game.board[6][4].actionsLeft = 1;
    tutorial.game.board[5][4] = new Soldier(5, 4, 'S', tutorial.game.players[0]);
    tutorial.game.blocked = true;
  }
  panic4(tutorial) {
    tutorial.panic3(tutorial);
    tutorial.showPieceActions = true;
    tutorial.showPass = false;
    tutorial.game.blocked = true;
    tutorial.game.dices = [1, 1, 1, 1];
    tutorial.game.player2Dices.next([1, 1, 1, 1]);
    tutorial.game.addEvent(tutorial.game.board[6][4], 'Panic');
    tutorial.game.panic(tutorial.game.board, tutorial.game.board[6][4] as Piece, 'S');
    tutorial.game.clearHightligth();
    tutorial.game.selectedPiece = undefined;
    tutorial.game.selectedEnemyPiece = undefined;
  }

  panic5(tutorial) {
    tutorial.game.blocked = false;
    tutorial.prepareBoard(tutorial, 9);
    tutorial.game.board[6][4] = new Soldier(6, 4, 'N', tutorial.game.turn);
    tutorial.game.board[7][4] = new King(7, 4, 'N', tutorial.game.turn);
    tutorial.game.board[5][4] = new Soldier(5, 4, 'S', tutorial.game.players[0]);
    tutorial.game.blocked = true;
  }

  panic6(tutorial) {
    tutorial.showPieceActions = true;
    tutorial.showPass = false;
    tutorial.panic5(tutorial);
    tutorial.game.blocked = true;
    tutorial.game.dices = [1, 1, 1, 1];
    tutorial.game.player2Dices.next([1, 1, 1, 1]);
    tutorial.game.addEvent(tutorial.game.board[6][4], 'Panic');
    tutorial.game.panic(tutorial.game.board, tutorial.game.board[6][4] as Piece, 'S');
    tutorial.game.clearHightligth();
    tutorial.game.selectedPiece = undefined;
    tutorial.game.selectedEnemyPiece = undefined;
  }


  prepareBoard(tutorial, size: number) {
    tutorial.game.board = [[]];
    for (let row = 0; row < size; row++) {
      tutorial.game.board[row] = [];
      for (let col = 0; col < size; col++) {
        tutorial.game.board[row][col] = new Cell(row, col);
      }
    }
  }
}

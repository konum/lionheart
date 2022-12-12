import { Component, OnInit } from '@angular/core';
import { TestService } from '../shared/test.service';
import { Cell } from '../model/cell';
import { Soldier, King, Knight, Archer, Piece, Mercenary } from '../model/pieces';
import { AsyncAIService } from '../shared/ai/async-ai.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {

  ai: AsyncAIService = new AsyncAIService();
  constructor(public game: TestService) { }

  ngOnInit() {
    this.game.setupNewBattle({ actionsPerTurn: 2 });
    this.ai.setGame(this.game, 1);
    this.game.turn = this.game.players[1];
    this.game.setActionsLeft();
    this.game.restoreBoardForNewTurn();
    this.game.setPieceBonus();

    //Player
    this.game.board[2][2] = new King(2, 2, 'S', this.game.players[1]);
    this.game.board[3][3] = new Mercenary(3, 3, 'S', this.game.players[1]);

    //AI
    this.game.board[7][2] = new King(7, 2, 'S', this.game.players[0]);
    this.game.board[7][0] = new Knight(7, 0, 'W', this.game.players[0]);/*
    this.game.board[2][4] = new Knight(2, 4, 'S', this.game.players[0]); */
  }

  switchTurn() {
    this.game.switchTurn();
  }

  cancel() {
    this.game.cancel();
  }

  attack() {
    this.game.doAttack();
  }
  undo() {
    this.game.undo();
  }

  rotate(dir) {
    this.game.rotateSelectedPiece(dir);
  }
  selectPiece(cell: Cell) {
    this.game.selectPiece(cell);
  }

}

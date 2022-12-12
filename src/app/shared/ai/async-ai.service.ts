import { Injectable } from '@angular/core';
import { AI, actionMove, actionAttack, actionRotate } from './ai';
import { EasyAI } from './easyAI';
import { Movement, Piece } from 'src/app/model/pieces';
import { Cell } from 'src/app/model/cell';
import { BasicGameService } from '../basic-game.service';
import { Player } from 'src/app/model/game';
import { Subject } from 'rxjs';
import { BaseAIService } from './base-ai.service';

export class AsyncAIService extends BaseAIService {

  myPlayerId = 1;
  scanDepth = 1;
  movements: Movement[];
  game: BasicGameService;
  ai: AI;
  actionsLeft = 1;

  aiDone: Subject<true> = new Subject();
  constructor() {
    super();
  }
  turnLoop() {
    if (!this.playing) {
      return;
    }
    setTimeout((ai) => {    //  call a 3s setTimeout when the loop is called
      ai.game.saveEnabled = false;
      ai.makeMove();
      ai.actionsLeft--;                     //  increment the counter
      if (ai.actionsLeft > 0 && !ai.game.gameFinished) {            //  if the counter < 10, call the loop function
        ai.turnLoop();             //  ..  again which will trigger another
      } else {
        if (!ai.game.gameFinished) {
          ai.game.saveEnabled = true;
          ai.game.switchTurn();
          ai.game.saveBattle();
        }
      }                        //  ..  setTimeout()
    }, 2700, this);
  }

}

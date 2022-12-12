import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdvancedPage } from '../advanced/advanced.page';
import { AdvancedControllerService } from '../shared/advanced-controller.service';
import { AsyncAIService } from '../shared/ai/async-ai.service';
import { Cell } from '../model/cell';

@Component({
  selector: 'app-solo-advanced',
  templateUrl: './solo-advanced.page.html',
  styleUrls: ['./solo-advanced.page.scss'],
})
export class SoloAdvancedPage extends AdvancedPage implements OnInit, OnDestroy {
  
  ai: AsyncAIService = new AsyncAIService();
  constructor(public game: AdvancedControllerService) {
    super(game);
   }

   ionViewWillEnter() {
    super.ionViewWillEnter();
    this.game.battleName = 'soloAdvanced';
    this.ai.setGame(this.game, 1);
    this.game.turn = this.game.players[0];
    this.game.autoDeploy();
    //this.switchTurn();
  }

  newBattle(){
    this.game.initBattle();
    this.game.battleName = 'soloAdvanced';
    this.ai.setGame(this.game, 1);
    this.game.turn = this.game.players[0];
    this.game.autoDeploy();
  }

  ngOnDestroy(){
    this.ai.endAI();
  }

  ionViewWillLeave(){
    this.ai.endAI();
  }

  selectPiece(cell: Cell) {
    if (this.game.turn.id !== 1) {
      this.game.selectPiece(cell);
    }
  }

}

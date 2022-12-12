import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { BasicPage } from '../basic/basic.page';
import { AsyncAIService } from '../shared/ai/async-ai.service';
import { Cell } from '../model/cell';
import { GameControllerService } from '../shared/game-controller.service';

const MAX_SCALE = 2.1;
const MIN_SCALE = 0.3;
const BASE_SCALE = 1;

@Component({
  selector: 'app-solo',
  templateUrl: './solo.page.html',
  styleUrls: ['./solo.page.scss'],
})
export class SoloPage extends BasicPage implements OnDestroy {
  @ViewChild('board',{static:false}) board: ElementRef;
  scale = BASE_SCALE;
  alreadyScaled = BASE_SCALE;

  isScaling = false;
  ai: AsyncAIService = new AsyncAIService();
  ai2: AsyncAIService = new AsyncAIService();
  constructor(basicGameService: GameControllerService) {
    super(basicGameService);
  }

  ionViewWillEnter() {
    super.ionViewWillEnter();
    this.init();


    //this.ai2.setGame(this.game, 2);
  }

  init(){
    this.ai.setGame(this.game, 1);
    this.game.turn = this.game.players[1];
    this.game.battleName = "solo";
    this.game.setActionsLeft();
    this.game.restoreBoardForNewTurn();
    this.game.setPieceBonus();
  }

  override newBattle() {
    this.ai.endAI();
    this.game.initBattle();
    this.init();
  }

  ngOnDestroy(){
    this.ai.endAI();
    //this.ai2.endAI();
  }

  ionViewWillLeave(){
    this.ai.endAI();
    //this.ai2.endAI();
  }


  override selectPiece(cell: Cell) {
    if (this.game.turn.id !== 1) {
      this.game.selectPiece(cell);
    }
  }
/* Pinch code for future reference. Poor performance.
  public onPinchStart(e) {

    // flag that sets the class to disable scrolling
    this.isScaling = true;
  }


  // called at (pinchend) and (pinchcancel)
  public onPinchEnd(e) {

    // flip the flag, enable scrolling
    this.isScaling = false;

    // adjust the amount we already scaled
    this.alreadyScaled = this.scale * this.alreadyScaled;

  }

  public onPinchMove(e) {

    // set the scale so we can track it globally
    this.scale = e.scale;

    console.log(`Event scale ${e.scale}`);
    // total amount we scaled
    let totalScaled = this.alreadyScaled * e.scale;

    // did we hit the max scale (pinch out)
    if (totalScaled >= MAX_SCALE) {

      // fix the scale by calculating it, don't use the e.scale
      // scenario: an insane quick pinch out will offset the this.scale
      this.scale = MAX_SCALE / this.alreadyScaled;
      totalScaled = MAX_SCALE;

      // did we hit the min scale (pinch in)
    } else if (totalScaled <= MIN_SCALE) {

      // fix the scale
      this.scale = MIN_SCALE / this.alreadyScaled;
      totalScaled = MIN_SCALE;

    }
    this.board.nativeElement.style.transform = `scale(${this.scale})`;
    console.log(this.scale)
  } */
}

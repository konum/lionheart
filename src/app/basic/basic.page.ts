import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Cell } from '../model/cell';
import { GameControllerService } from '../shared/game-controller.service';

@Component({
  selector: 'app-basic',
  templateUrl: './basic.page.html',
  styleUrls: ['./basic.page.scss'],
})
export class BasicPage implements OnInit {

  constructor(public game: GameControllerService) { }

  ngOnInit() {  
  }

  ionViewWillEnter() {
    this.game.initBattle();
  }

  newBattle() {
    this.game.initBattle();
  }
  /* ngAfterViewChecked() {
    var objDiv = document.getElementById("log");
    objDiv.scrollTop = objDiv.scrollHeight;
  } */

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

import { Component, OnInit } from '@angular/core';
import { Cell } from '../model/cell';
import { AdvancedControllerService } from '../shared/advanced-controller.service';

@Component({
  selector: 'app-advanced',
  templateUrl: './advanced.page.html',
  styleUrls: ['./advanced.page.scss'],
})
export class AdvancedPage implements OnInit {

  constructor(public game: AdvancedControllerService) { }

  ngOnInit(){
  }

  ionViewWillEnter() {
    this.game.initBattle();
  }

  newBattle(){
    this.game.initBattle();
  }

  selectPiece(cell: Cell) {
    this.game.selectPiece(cell);
  }

  selectToDeploy(cell) {
    this.game.selectToDeploy(cell);
  }

  switchTurn(){
    this.game.switchTurn();
  }

  cancel(){
    this.game.cancel();
  }

  undo(){
    this.game.undo();
  }

  rotate(dir){
    this.game.rotateSelectedPiece(dir);
  }
  attack(){
    this.game.doAttack();
  }
}

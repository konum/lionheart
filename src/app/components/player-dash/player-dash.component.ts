import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Player } from 'src/app/model/game';
import { Observable } from 'rxjs';
import { Piece } from 'src/app/model/pieces';

@Component({
  selector: 'app-player-dash',
  templateUrl: './player-dash.component.html',
  styleUrls: ['./player-dash.component.scss'],
})
export class PlayerDashComponent implements OnInit {

  @Input() dices: Observable<number[]>;
  @Input() player: Player;
  @Input() actionsLeft: number;
  @Input() myTurn: boolean;
  @Input() myPiece: Piece;
  @Input() enemyPiece: Piece;
  @Input() showPass = true;
  @Input() canUndo = true;
  @Input() showPieceActions = true;
  @Input() isRotated = false;
  @Output() pass: EventEmitter<true> = new EventEmitter();
  @Output() cancel: EventEmitter<true> = new EventEmitter();
  @Output() attack: EventEmitter<true> = new EventEmitter();
  @Output() rotate: EventEmitter<number> = new EventEmitter();
  @Output() undo: EventEmitter<true> = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  rotateBtn(dir) {
    this.rotate.emit(dir);
  }
  undoBtn() {
    if (this.myTurn) {
      this.undo.emit(true);
    }
  }
  passButn() {
    if (this.myTurn) {
      this.pass.emit(true);
    }
  }

  cancelBtn() {
    this.cancel.emit(true);
  }

  attackBtn() {
    this.attack.emit(true);
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { Piece } from 'src/app/model/pieces';

@Component({
  selector: 'app-piece-info',
  templateUrl: './piece-info.component.html',
  styleUrls: ['./piece-info.component.scss'],
})
export class PieceInfoComponent implements OnInit {

  @Input() piece: Piece;
  constructor() { }

  ngOnInit() {}

  getStrength(){
    let str = this.piece.amount * this.piece.dicesPerUnit;
    this.piece.modifiers.forEach(mod => {
      str += mod.modifier;
    });
    return str;
  }

}

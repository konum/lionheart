import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Piece } from 'src/app/model/pieces';
import { Cell } from 'src/app/model/cell';

@Component({
  selector: 'app-piece',
  templateUrl: './piece.component.html',
  styleUrls: ['./piece.component.scss'],
})
export class PieceComponent implements OnInit {

  @Input() cell: Piece; 
  @Input() staticShow = false;
  @Output() select: EventEmitter<Cell> = new EventEmitter();
  constructor() { }

  ngOnInit() {}

  selectPiece(){
    this.select.emit(this.cell);
  }

}

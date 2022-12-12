import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Cell } from 'src/app/model/cell';
import { Piece } from 'src/app/model/pieces';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {

  @Input() board: Cell[][];
  @Output() selectCell: EventEmitter<Cell> = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  selectPiece(cell){
    this.selectCell.emit(cell);
  }

  asPiece(cell):Piece{
    return cell as Piece;
  }
}

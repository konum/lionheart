export class Cell {
    name = 'default'
    image = 'default.png';
    highlight = false;
    move = false;
    rotate = false;
    target = false;
    row: number;
    col: number;
    orientation = 'N';
    isPiece = false;
    hasMoved = false;
    events: string[] = [];
    visible = true;
    selected = false;
    overlay = false;
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }

}

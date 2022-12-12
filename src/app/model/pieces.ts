import { Cell } from './cell';
import { Player } from './game';
import { soundsword, soundarrow } from '../shared/audio.service';


export class Movement {
    piece: Piece;
    action: number;
    target: Cell;
    evaluation: number;
  }

export class Piece extends Cell {
    name = 'none';
    isPiece = true;
    player: number;
    initialAmount = 1;
    amount = 1;
    hitPoints = 1;
    movement = 1;
    attacks = 1;
    dicesPerUnit = 1;
    hitsWith = [2, 3, 4];
    owner: Player;
    panic = true;
    movementCost = 1;
    extraDice = false;
    actionsLeft = 0;
    attacksLeft = 1;
    charge = false;
    flanking = true;
    ranged = false;
    attacking = false;
    sound = soundsword;
    special = '';
    modifiers: Modifier[] = [];
    importance = 20;
    constructor(row, col, orientation, owner: Player) {
        super(row, col);
        this.orientation = orientation;
        this.owner = owner;
    }
}

export interface Modifier {
    modifier: number;
    name: string;
}

export class King extends Piece {
    name = 'king';
    hitPoints = 2;
    movement = 4;
    dicesPerUnit = 2;
    panic = false;
    charge = true;
    special = 'Fearless, Move 4';
    importance = 100;
}

export class Knight extends Piece {
    name = 'knight';
    initialAmount = 2;
    amount = 2;
    hitPoints = 2;
    movement = 4;
    dicesPerUnit = 2;
    charge = true;
    special = 'Move 4';
    importance = 50;
}

export class Soldier extends Piece {
    name = 'soldier';
    initialAmount = 4;
    amount = 4;
    hitPoints = 1;
    extraDice = true;
}

export class Archer extends Piece {
    name = 'archer';
    initialAmount = 4;
    amount = 4;
    hitPoints = 1;
    hitsWith = [5, 6];
    extraDice = true;
    flanking = false;
    ranged = true;
    sound = soundarrow;
    special = 'Distance attack';
    importance = 40;
}

export class Heavy extends Piece {
    name = 'heavy';
    initialAmount = 2;
    amount = 2;
    hitPoints = 2;
    dicesPerUnit = 2;
    hitsWith = [2, 3, 4];
    movementCost = 2;
    attacks = 2;
    attacksLeft = 2;
    special = 'Slow, Poleaxe';
    importance = 40;
}

export class Peasant extends Piece {
    name = 'peasant';
    initialAmount = 4;
    amount = 4;
    hitPoints = 1;
    hitsWith = [2, 3, 4, 5, 6];
    special = 'Coward, Easy hit';
    importance = 20;
}

export class Mercenary extends Piece {
    name = 'mercenary';
    initialAmount = 4;
    amount = 4;
    hitPoints = 1;
    dicesPerUnit = 1;
    panic = false;
    extraDice = true;
    hitsWith = [2, 3, 4];
    special = 'Fearless, Scary, Mercenary';
    importance = 30;
}

import { Cell } from './cell';

export const eventTime = 2000;
export const boardSize = 9;


  

export class Player {
    id: number;
    name?: string;
    kingAlive?= true;
    unitCount?= 0;
    color?: string;
    points?: number;
    defaultOrientation?: string;
}

export class Game {
    board: Cell[][];
    players: Player[];
    turn: Player;
    log: string[];
    actionsLeft: number;
    rules: Rules;
}

export class Rules {
    actionsPerTurn?= 3;
    flankingBonus?= false;
    cavalryCharge?= false;
    advancedFrontLine?= false;
    battleBack?= false;
    forKing?= false;
    totalBattle?= false;
    customArmy?= false;
}

export class Settings {
    musicOn = true;
    soundOn = true;
}


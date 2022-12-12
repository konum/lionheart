import { Cell } from 'src/app/model/cell';

export const actionMove = 1;
export const actionAttack = 2;
export const actionRotate = 3;

export interface AI {
    evaluateMove(piece, cell, board, action, game);
}
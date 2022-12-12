
import { AI, actionAttack, actionMove, actionRotate } from './ai';
import { Cell } from 'src/app/model/cell';
import { Piece } from 'src/app/model/pieces';
import { BasicGameService } from '../basic-game.service';


const weightPos: any = [
    [1, 2, 3, 3, 3, 3, 3, 2, 2],
    [1, 2, 3, 3, 3, 3, 3, 2, 1],
    [3, 3, 4, 4, 4, 4, 4, 3, 3],
    [4, 3, 5, 3, 3, 3, 5, 4, 4],
    [4, 5, 6, 2, 2, 2, 6, 5, 4],
    [4, 3, 5, 5, 5, 5, 5, 3, 4],
    [3, 4, 4, 4, 4, 4, 4, 4, 3],
    [1, 2, 2, 2, 3, 4, 4, 2, 1],
    [1, 2, 2, 2, 3, 2, 2, 2, 1]
]

const weightPosArcher: any = [
    [1, 2, 2, 2, 3, 2, 2, 2, 2],
    [1, 1, 2, 3, 3, 3, 2, 1, 3],
    [-10, 2, 3, 4, 4, 4, 3, 4, -10],
    [-10, 2, 5, 0, 0, 5, 3, 3, -10],
    [-10, 2, 5, 0, 0, 5, 3, 3, -10],
    [-10, 1, 2, 2, 2, 2, 2, 1, -10],
    [-10, 1, 2, 2, 2, 2, 2, 1, -10],
    [-10, 1, 2, 2, 2, 2, 2, 1, -10],
    [1, 1, 2, 2, 2, 2, 2, 1, 2]
]

const weightPosKing: any = [
    [1, 2, 2, 2, 3, 2, 2, 2, 2],
    [1, 2, 3, 3, 10, 3, 3, 2, 1],
    [1, 2, 2, 2, 10, 2, 2, 2, 1],
    [1, 1, 2, 2, 2, 2, 2, 1, 1],
    [-30, -30, -30, -30, -30, -30, -30, -30, -30],
    [-30, -30, -30, -30, -30, -30, -30, -30, -30],
    [-30, -30, -30, -30, -30, -30, -30, -30, -30],
    [-30, -30, -30, -30, -30, -30, -30, -30, -30],
    [-30, -30, -30, -30, -30, -30, -30, -30, -30],
]

const weightPosKnight: any = [
    [1, 2, 2, 2, 3, 2, 2, 2, 2],
    [1, 2, 3, 1, 1, 1, 3, 2, 1],
    [1, 3, 4, 3, 2, 3, 4, 3, 1],
    [1, 4, 4, 3, 3, 3, 4, 4, 1],
    [2, 5, 5, 3, 3, 3, 5, 5, 2],
    [2, 3, 5, 5, 4, 5, 5, 3, 2],
    [1, 3, 4, 4, 4, 4, 4, 3, 1],
    [1, 1, 3, 3, 2, 3, 3, 1, 1],
    [1, 1, 1, 1, 0, 0, 0, 1, 1]
]

export class EasyAI implements AI {

    evaluateMove(piece: Piece, cell, heatMap, action, game: BasicGameService) {
        let moveMod = 1;
        switch (piece.amount * piece.dicesPerUnit) {
            case 1:
                moveMod = 0.6;
                break;
            case 2:
                moveMod = 0.8;
                break;
            case 3:
                moveMod = 0.9;
                break;
            default:
                moveMod = 1;
        }
        if (action === actionAttack) {
            return moveMod * this.evaluateAttack(piece, cell, heatMap);
        }
        if (action === actionMove) {
            let newPos = this.getPosWeight(piece, cell, heatMap);
            if (piece.name === 'king') {
                if (game.isKingThreated(game.board, piece.owner)) {
                    newPos = 10 * (heatMap[piece.row][piece.col] - heatMap[cell.row][cell.col]);
                }
            }
            const hasMoved = 30 * (piece.hasMoved ? 1 : 0);
            const hasAttacked = 80 * (piece.attacksLeft === 0 ? 1 : 0);
            const distanceFromCenter = 8 * (6 - weightPos[piece.row][piece.col]);
            const random = Math.floor(Math.random() * 10);
            return moveMod * newPos + random - hasMoved - hasAttacked + distanceFromCenter;
        }
        if (action === actionRotate) {
            if (piece.orientation === 'N' && piece.owner.defaultOrientation === 'S' && cell.row > piece.row) {
                return 40;
            }
            if (piece.orientation === 'S' && piece.owner.defaultOrientation === 'N' && cell.row < piece.row) {
                return 40;
            }
            if ((piece.orientation === 'E' || piece.orientation === 'W') && piece.owner.defaultOrientation === 'S' && cell.row > piece.row) {
                return 40;
            }
            if ((piece.orientation === 'E' || piece.orientation === 'W') && piece.owner.defaultOrientation === 'N' && cell.row < piece.row) {
                return 40;
            }
            const hasMoved = 30 * (piece.hasMoved ? 1 : 0);
            const hasAttacked = 80 * (piece.attacksLeft === 0 ? 1 : 0);
            const mod = cell.isPiece && piece.owner.id !== cell.owner.id ? 2 : 1;
            return moveMod * 1.2 * this.getPosWeight(piece, cell, heatMap) * mod - hasMoved - hasAttacked;
        }
    }

    evaluateAttack(piece: Piece, cell: Piece, heatMap): number {
        let mod = heatMap[cell.row][cell.col] / 8;
        return (3 * this.getPosWeight(piece, cell, heatMap)) / (5 - piece.amount * piece.dicesPerUnit);
    }

    getPosWeight(piece, cell, heatMap) {
        switch (piece.name) {
            case 'king':
                return weightPosKing[cell.row][cell.col] - heatMap[cell.row][cell.col];
            case 'archer':
                return weightPosArcher[cell.row][cell.col] + heatMap[cell.row][cell.col];
            case 'knight':
                return weightPosKnight[cell.row][cell.col] + heatMap[cell.row][cell.col];
            default:
                return weightPos[cell.row][cell.col] + heatMap[cell.row][cell.col];
        }
    }
}
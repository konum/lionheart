import { Injectable } from '@angular/core';
import { BasicGameService } from './basic-game.service';
import { AlertController } from '@ionic/angular';
import { AudioService } from './audio.service';
import { Piece } from '../model/pieces';
import { SettingsService } from './settings.service';
import { GameControllerService } from './game-controller.service';
import { Rules, Player } from '../model/game';
import { Cell } from '../model/cell';
import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';

@Injectable({
  providedIn: 'root'
})
export class TestService extends GameControllerService{
  battleName = 'tutorial';
  constructor(public alertController: AlertController, public audio: AudioService, public nativeAudio: NativeAudio,public settingsService: SettingsService) {
    super(alertController, audio, nativeAudio, settingsService);
  }

  setupNewBattle(rules: Rules){
    this.board = [[]];
    this.winner = undefined;
    this.gameFinished = false;
    this.p1Dices = [];
    this.p2Dices = [];
    this.log = [];
    this.canUndo = false;
    this.rules = rules;
    for (let row = 0; row < 9; row++) {
      this.board[row] = [];
      for (let col = 0; col < 9; col++) {
        this.board[row][col] = new Cell(row, col);
      }
    }
    const player1: Player = {
      id: 1,
      name: 'Blue player',
      color: "blue",
      kingAlive: true,
      unitCount: 10,
      points: 160,
      defaultOrientation: 'S'
    };
    const player2: Player = {
      id: 2,
      name: 'Yellow player',
      color: "gold",
      kingAlive: true,
      unitCount: 10,
      points: 160,
      defaultOrientation: 'N'
    };
    this.players = [player1, player2];
  }

  performAttack(piece: Piece, board, cell: Piece): number {
      super.performAttack(piece, board, cell);
      piece.attacksLeft = 1;
      return 1;
  }

  rollDices(piece, toThrow) {
    this.p2Dices = [];
    for (let index = 0; index < toThrow; index++) {
      const dice = 2 + Math.floor(Math.random() * 6);
      this.getDices(piece).push(dice);
    }
    for (let index = this.getDices(piece).length; index < 4; index++) {
      this.getDices(piece).push(0);
    }
    if (piece.owner.name === this.players[0].name) {
      this.player1Dices.next(this.getDices(piece));
    }
    if (piece.owner.name === this.players[1].name) {
      this.player2Dices.next(this.getDices(piece));
    }
  }
}

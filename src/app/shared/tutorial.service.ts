import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AudioService } from './audio.service';
import { Piece } from '../model/pieces';
import { SettingsService } from './settings.service';
import { GameControllerService } from './game-controller.service';
import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';

@Injectable({
  providedIn: 'root'
})
export class TutorialService extends GameControllerService{
  battleName = 'tutorial';
  constructor(public alertController: AlertController, public audio: AudioService, public nativeAudio: NativeAudio,public settingsService: SettingsService) {
    super(alertController, audio, nativeAudio, settingsService);
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

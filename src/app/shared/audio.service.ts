import { Injectable } from '@angular/core'
import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';
import { Platform } from '@ionic/angular';
import { SettingsService } from './settings.service';



const sourceArrow = 'assets/sound/bow.wav';
const sourceClick = 'assets/sound/click.wav';
const sourceDie = 'assets/sound/die.ogg';
const sourceHit = 'assets/sound/hit.wav';
const sourceMiss = 'assets/sound/miss.wav';
const sourceNegative = 'assets/sound/negative.wav';
const sourceSword = 'assets/sound/sword.wav';
const sourceHorn = 'assets/sound/horn.mp3';
const sourceMusic = 'assets/sound/music.mp3';
const sourceWin = 'assets/sound/win.mp3';
const sourceMarch = 'assets/sound/march.mp3';
const sourceStart = 'assets/sound/start.wav';



export const soundarrow = 'arrow';
export const soundclick = 'click';
export const sounddie = 'die';
export const soundmiss = 'miss';
export const soundhit = 'hit';
export const soundnegative = 'negative';
export const soundsword = 'sword';
export const soundhorn = 'horn';
export const soundmusic = 'music';
export const soundwin = 'win';
export const soundmarch = 'march';
export const soundstart = 'start';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  bgMusic:any;
  soundMap:Map<string,any>;
  constructor(private nativeAudio: NativeAudio, private settingsService: SettingsService,
    private platform: Platform) {

  }

  loadSound() {
    if (this.platform.is('android')) {
      console.log('loading sounds...');
      this.nativeAudio.preloadComplex(soundmusic, sourceMusic, 0.3, 1, 0).then(() => { }, (error) => { console.log(error) });
      this.nativeAudio.preloadSimple(soundarrow, sourceArrow).then(() => { }, (error) => { console.log(error) });
      this.nativeAudio.preloadSimple(soundclick, sourceClick).then(() => { }, (error) => { console.log(error) });
      this.nativeAudio.preloadComplex(sounddie, sourceDie, 0.6, 1, 0).then(() => { }, (error) => { console.log(error) });
      this.nativeAudio.preloadSimple(soundmiss, sourceMiss).then(() => { }, (error) => { console.log(error) });
      this.nativeAudio.preloadSimple(soundhit, sourceHit).then(() => { }, (error) => { console.log(error) });
      this.nativeAudio.preloadSimple(soundnegative, sourceNegative).then(() => { }, (error) => { console.log(error) });
      this.nativeAudio.preloadSimple(soundsword, sourceSword).then(() => { }, (error) => { console.log(error) });
      this.nativeAudio.preloadSimple(soundhorn, sourceHorn).then(() => { }, (error) => { console.log(error) });
      this.nativeAudio.preloadSimple(soundwin, sourceWin).then(() => { }, (error) => { console.log(error) });
      this.nativeAudio.preloadSimple(soundmarch, sourceMarch).then(() => { }, (error) => { console.log(error) });
      this.nativeAudio.preloadSimple(soundstart, sourceStart).then(() => { }, (error) => { console.log(error) });
    }
    if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
      this.soundMap = new Map();
      let audioArrow = new Audio();
      audioArrow.src = sourceArrow;
      this.soundMap.set(soundarrow,audioArrow);

      let audio1 = new Audio();
      audio1.src = sourceClick;
      this.soundMap.set(soundclick,audio1);

      let audio2 = new Audio();
      audio2.src = sourceDie;
      this.soundMap.set(sounddie,audio2);

      let audio3 = new Audio();
      audio3.src = sourceMiss;
      this.soundMap.set(soundmiss,audio3);

      let audio4 = new Audio();
      audio4.src = sourceHit;
      this.soundMap.set(soundhit,audio4);

      let audio5 = new Audio();
      audio5.src = sourceNegative;
      this.soundMap.set(soundnegative,audio5);

      let audio6 = new Audio();
      audio6.src = sourceSword;
      this.soundMap.set(soundsword,audio6);

      let audio7 = new Audio();
      audio7.src = sourceHorn;
      this.soundMap.set(soundhorn,audio7);

      let audio8 = new Audio();
      audio8.src = sourceMarch;
      this.soundMap.set(soundmarch,audio8);

      let audio9 = new Audio();
      audio9.src = sourceStart;
      this.soundMap.set(soundstart,audio9);

      this.bgMusic = new Audio();
      this.bgMusic.src = sourceMusic;
      this.bgMusic.loop =true;
    }
  }
  playBackgroundMusic() {
    if (this.settingsService.getSettings().musicOn) {
      if (this.platform.is('android')) {
        this.nativeAudio.loop(soundmusic).then(() => { console.log('playing bg music') }, (error) => { console.log(error) });
      }
      if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
        if (!!this.bgMusic){
          this.bgMusic.src = sourceMusic;
          this.bgMusic.play();
        }

      }
    }
  }

  stopBackgroundMusic() {
    if (this.platform.is('android')) {
      this.nativeAudio.stop(soundmusic).then(() => { console.log('stoping bg music') }, (error) => { console.log(error) });
    }
    if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
      if (!!this.bgMusic)
        this.bgMusic.src='';
    }
  }

  playSoundSync(sound: string) {
    if (this.settingsService.getSettings().soundOn) {
      if (this.platform.is('android')) {
        this.nativeAudio.play(sound).then(() => { }, (error) => { console.log(error) });
      }
      if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
        this.soundMap.get(sound).play();
      }
    }
  }

  playSoundAsync(sound: string, callback) {
    if (this.settingsService.getSettings().soundOn) {
      if (this.platform.is('android')) {
        return this.nativeAudio.play(sound, callback).then((error) => { console.log(error) });
      }
      if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
        this.soundMap.get(sound).play();
      }
    }
  }
}

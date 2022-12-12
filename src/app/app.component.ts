import { Component } from '@angular/core';

import { Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { AudioService } from './shared/audio.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    }, {
      title: '1 players',
      url: '/selecMode/1',
      icon: 'single'
    },
    {
      title: '2 players',
      url: '/selecMode/2',
      icon: 'multi'
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: 'settings'
    },
    {
      title: 'Tutorial',
      url: '/tutorial',
      icon: 'tutorial'
    },
    {
      title: 'Units',
      url: '/units',
      icon: 'info'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private audio: AudioService,
    private toast:ToastController,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.statusBar.hide();
      this.splashScreen.hide();
      this.audio.loadSound();
      this.audio.playBackgroundMusic();
      if (this.platform.is('mobileweb') || this.platform.is('desktop')){
        this.toast.create({
          message: 'Welcome to Lionheart Battles! Would you like some ambience music?',
          position: 'middle',
          buttons:[{
            text: 'Play music',
            handler:()=>{
              this.audio.playBackgroundMusic();
            }
          },
          {
            text: 'Dismis',
            role:'cancel'
          }]
        }).then(p=>p.present());
      }
    });
  }
}

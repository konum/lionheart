import { Component, ViewChild } from '@angular/core';
import { IonModal, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AudioService, soundclick } from '../shared/audio.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(IonModal) modal: IonModal;
  subscription: Subscription;
  constructor(private router: Router, private audio: AudioService, private platform: Platform) { }

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribe(() => { navigator['app'].exitApp(); });
  }

  nav(dir) {
    this.audio.playSoundSync(soundclick);
    this.router.navigate([dir]);
  }

  ionViewWillLeave() { this.subscription.unsubscribe(); }

  open(){
    this.modal.present();
  }
  close() {
    this.modal.dismiss(null, 'cancel');
  }

}

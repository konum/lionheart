import { Component, OnInit } from '@angular/core';
import { Rules, Settings } from '../model/game';
import { SettingsService } from '../shared/settings.service';
import { ToastController } from '@ionic/angular';
import { AudioService } from '../shared/audio.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  rules: Rules;
  settigns: Settings;
  constructor(private settingsService: SettingsService, public toastController: ToastController, private audio: AudioService) { }

  ngOnInit() {
    this.rules = this.settingsService.getRules();
    this.settigns = this.settingsService.getSettings();
  }

  saveSettings() {
    this.settingsService.saveSettings(this.settigns);
    if (!this.settigns.musicOn){
      this.audio.stopBackgroundMusic();
    }else {
      this.audio.playBackgroundMusic();
    }
    this.toastController.create({
      message: 'Your settings have been saved.',
      duration: 2000
    }).then(p => p.present());
  }

  saveRules() {
    this.settingsService.saveRules(this.rules);
    this.toastController.create({
      message: 'Your rules have been saved.',
      duration: 2000
    }).then(p => p.present());
  }
}

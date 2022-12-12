import { Injectable } from '@angular/core';
import { Settings, Rules } from '../model/game';
import { Peasant } from '../model/pieces';

const settingsKey = 'settings';
const rulesKey = 'rules';
@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor() { }

  public getSettings(): Settings {
    if (!!localStorage.getItem(settingsKey)) {
      return JSON.parse(localStorage.getItem(settingsKey));
    }
    else {
      return new Settings();
    }
  }

  public saveSettings(settings: Settings) {
    localStorage.setItem(settingsKey, JSON.stringify(settings));
  }

  public getRules(): Rules {
    if (!!localStorage.getItem(rulesKey)) {
      return JSON.parse(localStorage.getItem(rulesKey));
    }
    else {
      return new Rules();
    }
  }

  public saveRules(rules: Rules) {
    localStorage.setItem(rulesKey, JSON.stringify(rules));
  }
}

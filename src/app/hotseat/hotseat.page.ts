import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AudioService, soundclick } from '../shared/audio.service';
import { SettingsService } from '../shared/settings.service';

@Component({
  selector: 'app-hotseat',
  templateUrl: './hotseat.page.html',
  styleUrls: ['./hotseat.page.scss'],
})
export class HotseatPage implements OnInit {

  constructor(private router: Router, private audio: AudioService, private settings: SettingsService, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  classic() {
    this.audio.playSoundSync(soundclick);
    if (this.route.snapshot.paramMap.get('players') === '2') {
      this.router.navigate(['basic']);
    } else {
      this.router.navigate(['solo']);
    }
  }

  advanced() {
    this.audio.playSoundSync(soundclick);
    if (this.route.snapshot.paramMap.get('players') === '2') {
      this.router.navigate(['advanced']);
    } else {
      this.router.navigate(['solo-advanced']);
    }
  }
}

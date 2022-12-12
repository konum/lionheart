import { Component, OnInit } from '@angular/core';
import { King, Knight, Soldier, Archer, Heavy, Peasant, Mercenary } from '../model/pieces';

@Component({
  selector: 'app-units',
  templateUrl: './units.page.html',
  styleUrls: ['./units.page.scss'],
})
export class UnitsPage implements OnInit {

  constructor() { }

  king = new King(0, 0, 'N', { id: 1 });
  knight = new Knight(0, 0, 'N', { id: 1 });
  soldier = new Soldier(0, 0, 'N', { id: 1 });
  archer = new Archer(0, 0, 'N', { id: 1 });
  heavy = new Heavy(0, 0, 'N', { id: 1 });
  peasant = new Peasant(0, 0, 'N', { id: 1 });
  merc = new Mercenary(0, 0, 'N', { id: 1 });
  ngOnInit() {
    this.heavy.attacks = 2;
  }

}

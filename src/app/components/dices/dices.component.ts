import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-dices',
  templateUrl: './dices.component.html',
  styleUrls: ['./dices.component.scss'],
})
export class DicesComponent implements OnInit, OnDestroy{

  @Input() dices: Observable<number[]>;
  subs: Subscription;
  intDices: number[];
  constructor() { }

  ngOnInit() {
    this.intDices = [0, 0, 0, 0];
    this.subs = this.dices.subscribe(p => {
      this.intDices = p;
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}

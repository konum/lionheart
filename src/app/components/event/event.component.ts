import { Component, OnInit, Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
  animations: [
    transition('closed => open', [
      animate('1s')
    ]),
  ]
})
export class EventComponent implements OnInit {

  @Input() events: string[];
  @Input() orientation = 'N';
  constructor() { }

  ngOnInit() {}

}

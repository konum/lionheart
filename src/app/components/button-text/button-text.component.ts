import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-button-text',
  templateUrl: './button-text.component.html',
  styleUrls: ['./button-text.component.scss'],
})
export class ButtonTextComponent implements OnInit {

  @Input() icon: string;
  @Input() label: string;
  constructor() { }

  ngOnInit() {}

}

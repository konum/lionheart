import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-button-icon',
  templateUrl: './button-icon.component.html',
  styleUrls: ['./button-icon.component.scss'],
})
export class ButtonIconComponent implements OnInit {

  @Input() icon: string;
  @Input() disabled = false;
  col = 4;
  constructor() { }

  ngOnInit() {
    switch (this.icon) {
      case 'left':
        this.col = 1;
        break;
      case 'right':
        this.col = 1;
        break;
      case 'rotate':
        this.col = 4;
        break;
      case 'classic':
        this.col = 4;
        break;
      case 'tutorial':
        this.col = 2;
        break;
      case 'exit':
        this.col = 1;
        break;
      case 'save':
        this.col = 2;
        break;
      default:
        this.col = 5;
    }
  }

}

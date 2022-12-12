import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DiceComponent } from './dice.component';

describe('DiceComponent', () => {
  let component: DiceComponent;
  let fixture: ComponentFixture<DiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiceComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

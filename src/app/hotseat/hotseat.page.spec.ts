import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HotseatPage } from './hotseat.page';

describe('HotseatPage', () => {
  let component: HotseatPage;
  let fixture: ComponentFixture<HotseatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotseatPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HotseatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

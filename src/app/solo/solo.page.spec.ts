import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SoloPage } from './solo.page';

describe('SoloPage', () => {
  let component: SoloPage;
  let fixture: ComponentFixture<SoloPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoloPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SoloPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

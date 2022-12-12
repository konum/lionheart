import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SoloBasePage } from './solo-base.page';

describe('SoloBasePage', () => {
  let component: SoloBasePage;
  let fixture: ComponentFixture<SoloBasePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoloBasePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SoloBasePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

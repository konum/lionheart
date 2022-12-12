import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SoloAdvancedPage } from './solo-advanced.page';

describe('SoloAdvancedPage', () => {
  let component: SoloAdvancedPage;
  let fixture: ComponentFixture<SoloAdvancedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoloAdvancedPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SoloAdvancedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TutorialPageRoutingModule } from './tutorial-routing.module';

import { TutorialPage } from './tutorial.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TutorialPageRoutingModule
  ],
  declarations: [TutorialPage]
})
export class TutorialPageModule {}

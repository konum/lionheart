import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SoloPageRoutingModule } from './solo-routing.module';

import { SoloPage } from './solo.page';
import { ComponentsModule } from '../components/components.module';
import { DirectivesModule } from '../directive/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SoloPageRoutingModule,
    ComponentsModule,
    DirectivesModule
  ],
  declarations: [SoloPage]
})
export class SoloPageModule {}

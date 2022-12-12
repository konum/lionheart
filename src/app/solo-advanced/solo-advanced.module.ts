import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SoloAdvancedPageRoutingModule } from './solo-advanced-routing.module';

import { SoloAdvancedPage } from './solo-advanced.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SoloAdvancedPageRoutingModule,
    ComponentsModule
  ],
  declarations: [SoloAdvancedPage]
})
export class SoloAdvancedPageModule {}

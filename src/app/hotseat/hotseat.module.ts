import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HotseatPageRoutingModule } from './hotseat-routing.module';

import { HotseatPage } from './hotseat.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    HotseatPageRoutingModule
  ],
  declarations: [HotseatPage]
})
export class HotseatPageModule {}

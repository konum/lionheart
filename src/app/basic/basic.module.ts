import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BasicPageRoutingModule } from './basic-routing.module';

import { ComponentsModule } from '../components/components.module';

import { BasicPage } from './basic.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BasicPageRoutingModule,
    ComponentsModule,
  ],
  declarations: [BasicPage]
})
export class BasicPageModule {}

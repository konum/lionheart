
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { BoardComponent } from './board/board.component';
import { DicesComponent } from './dices/dices.component';
import { PlayerDashComponent } from './player-dash/player-dash.component';
import { DiceComponent } from './dice/dice.component';
import { EventComponent } from './event/event.component';
import { PieceInfoComponent } from './piece-info/piece-info.component';
import { PieceComponent } from './piece/piece.component';
import { ButtonIconComponent } from './button-icon/button-icon.component';
import { ButtonTextComponent } from './button-text/button-text.component';


@NgModule({ imports: [
    CommonModule,
    FormsModule,
    IonicModule
    ],
    declarations: [BoardComponent, DicesComponent, PlayerDashComponent, DiceComponent, EventComponent, PieceInfoComponent, PieceComponent, ButtonIconComponent, ButtonTextComponent],
    exports: [BoardComponent, DicesComponent, PlayerDashComponent, DiceComponent, EventComponent, PieceInfoComponent, PieceComponent, ButtonIconComponent, ButtonTextComponent],
    entryComponents: [],
    providers: []
})
export class ComponentsModule{}

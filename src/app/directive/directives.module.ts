import { NgModule } from '@angular/core';
import { PinchDirective } from './pinch/pinch';

@NgModule({
  imports: [
  ],
  declarations: [PinchDirective],
  exports:[PinchDirective]
})
export class DirectivesModule {}

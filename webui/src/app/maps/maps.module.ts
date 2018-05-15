import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';

import { MapsRoutingModule } from './maps-routing.module';
import { MapsComponent } from './maps.component';
import { StateMapComponent } from './state-map.component';

@NgModule({
  imports: [
    CommonModule,
    MapsRoutingModule
  ],
  declarations: [
    MapsComponent,
    StateMapComponent
  ],
  providers: [ ]
})
export class MapsModule {}

import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MapsComponent } from './maps.component';
import { StateMapComponent } from './state-map.component';

const mapRoutes: Routes = [
  { path: 'maps', component: MapsComponent },
  { path: 'maps/:state', component: StateMapComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(mapRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class MapsRoutingModule { }

import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MapsComponent } from './maps.component';

const mapRoutes: Routes = [
  { path: 'maps/:state', redirectTo: '/state-maps/:state' },
  { path: 'state-maps/:state', component: MapsComponent }
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

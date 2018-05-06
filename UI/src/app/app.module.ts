import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http'; 
import {HttpClientModule} from '@angular/common/http'
import { AppComponent } from './app.component';
import { MapsComponent } from './maps/maps.component';
import { ChartsComponent } from './charts/charts.component';

const appRoutes: Routes = [
  { path: 'maps',        component: MapsComponent },
  { path: 'charts',      component: ChartsComponent },
];


@NgModule({
  declarations: [
    AppComponent,
    MapsComponent,
    ChartsComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }
    )
  ],
  providers: [],
  bootstrap: [AppComponent]

})
export class AppModule { }

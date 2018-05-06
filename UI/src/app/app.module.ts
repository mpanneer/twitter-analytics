import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http'; 
import {HttpClientModule} from '@angular/common/http'
import { AppComponent } from './app.component';
import { MapsComponent } from './maps/maps.component';
import { ChartsComponent } from './charts/charts.component';
import { MapsModule } from './maps/maps.module';

const appRoutes: Routes = [
  { path: 'charts',      component: ChartsComponent },
];


@NgModule({
  declarations: [
    AppComponent,
    ChartsComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }
    ),
    MapsModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]

})
export class AppModule { }

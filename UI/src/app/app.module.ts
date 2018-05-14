import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http'; 
import {HttpClientModule} from '@angular/common/http'
import { AppComponent } from './app.component';
import { MapsComponent } from './maps/maps.component';
import { MapsModule } from './maps/maps.module';
import { ChartsModule } from './charts/charts.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

const appRoutes: Routes = [
  
];


@NgModule({
  declarations: [
    AppComponent
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
    ChartsModule,
    RouterModule,
    NgbModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]

})
export class AppModule { }

import { Component, OnInit } from '@angular/core';
import { } from '@types/googlemaps';
import { ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TwitteranalyticsService, StateInfo, SuburbFeature } from '../twitteranalytics.service';
import { Observable, of } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {

  ngOnInit() {
    
  }

}

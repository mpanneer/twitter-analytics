import { Component, OnInit } from '@angular/core';
import { } from '@types/googlemaps';
import { ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TwitteranalyticsService, StateInfo, SuburbFeature } from '../twitteranalytics.service';
import { Observable, of } from 'rxjs';
import {ChangeDetectorRef} from '@angular/core';


@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {

  state: string;
  gmap: google.maps.Map;
  @ViewChild('gmap') gmapElement: any;

  constructor(private route: ActivatedRoute, private _twitterAnalytics: TwitteranalyticsService) {
    
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.state = params['state'];
      this.showMap();
    });
  }

  showMap() {
    this._twitterAnalytics.getStateInfo(this.state).subscribe((data: StateInfo) => {
      let response = data['data'];
      let stateInfo = response['rows'];
      let stateLat = stateInfo[0].value.position.lat;
      let stateLong = stateInfo[0].value.position.long;

      let latLng = new google.maps.LatLng(stateLat, stateLong);
      var mapProp = {
        center: latLng,
        zoom: 10,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        panControl: false
      };
      
      var infoWindow = new google.maps.InfoWindow();
      this.gmap = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
      this.gmap.panTo(latLng);
      
      this._twitterAnalytics.getAllSuburbsFeatureByState(this.state).subscribe((data : SuburbFeature) => {
        let suburb = data['data'];
        let suburbs = suburb['rows'];
        suburbs.forEach(element => {
          let suburbFeature = element.value
          this.gmap.data.addGeoJson(suburbFeature);
        });
      });

      this.gmap.data.setStyle({ fillOpacity: 0.0, strokeWeight: 1.0 });

      this.gmap.data.addListener('click', function (event) {
        let data = event;
        let suburb = data.feature.f.Suburb_Name;
        infoWindow.setContent(suburb + "<br/>This is a test");
        infoWindow.setPosition(event.latLng);
        infoWindow.open(this.map);
      });
    });
  }

  addMarker(map, location) {
    new google.maps.Marker({
      position: location,
      map: map
    });
  }

}

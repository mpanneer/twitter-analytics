import { Component, OnInit } from '@angular/core';
import { } from '@types/googlemaps';
import { ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TwitteranalyticsService, CityInfo } from '../twitteranalytics.service';
import { Observable, of } from 'rxjs';
import {ChangeDetectorRef} from '@angular/core';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {

  city: string;

  @ViewChild('gmap') gmapElement: any;

  constructor(private route: ActivatedRoute, private _twitterAnalytics: TwitteranalyticsService, private cd : ChangeDetectorRef) {
    this.route.queryParams.subscribe(params => {
      this.city = params['city'];
    });
  }

  ngOnInit() {
    
    
    this._twitterAnalytics.getCityInfo(this.city).subscribe((data: CityInfo) => {
      let cityInfo = data['data'];
      let position = cityInfo['position'];
      let cityLat = position.lat;
      let cityLong = position.long;

      let latLng = new google.maps.LatLng(cityLat, cityLong);
      var mapProp = {
        center: latLng,
        zoom: 10,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        panControl: false
      };
      this.cd.detectChanges();
      var infoWindow = new google.maps.InfoWindow();
      let gmap = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
      gmap.panTo(latLng);
      gmap.data.loadGeoJson('/assets/' + this.city + '.json');
      gmap.data.setStyle({ fillOpacity: 0.0, strokeWeight: 1.0 });

      gmap.data.addListener('click', function (event) {
        let data = event;
        console.log(event);
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

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

    this._twitterAnalytics.getTopEmotionsSuburbsByState(this.state, 'happy').subscribe((data) => {
      let topsuburbs = data['data'].rows;
      let latLng = new google.maps.LatLng(-37, 143);
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
      

      topsuburbs.forEach(element => {
        
        let suburbName = element.key[1];
        let emotionPercent = element.value['happyPercent'];
        console.log(suburbName,emotionPercent);
        this._twitterAnalytics.getSuburbDetails(this.state, suburbName).subscribe((data) => {
          let rowData = data['data'].rows[0];
          if (rowData) {
          let mapFeature = {};
          mapFeature['type'] = 'Feature';
          mapFeature['geometry'] = rowData.doc.geometry;
          mapFeature['Suburb_Name'] = suburbName;
          mapFeature['opacity'] = emotionPercent/100;
          this.gmap.data.addGeoJson(mapFeature);
          this.gmap.data.setStyle(function(mapFeature) {
            var value = mapFeature.getProperty('opacity');
            var opacity = value;
            return {
              fillOpacity: opacity,
              fillColor: "red",
              strokeWeight: 1,
            };
          });
        } 
        });
    
      this.gmap.data.addListener('click', function (event) {
        let data = event;
        console.log(data);
        let suburb = data.feature.Suburb_Name;
        infoWindow.setContent(suburb + "<br/>This is a test");
        infoWindow.setPosition(event.latLng);
        infoWindow.open(this.map);
      });
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

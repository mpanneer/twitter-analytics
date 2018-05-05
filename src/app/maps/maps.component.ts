import { Component, OnInit } from '@angular/core';
import { } from '@types/googlemaps';
import { ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  city: string;
  cityInfos: any;
  cityLat: any;
  cityLong: any;

  constructor(private route: ActivatedRoute) { 
    this.cityInfos = [
      {'name': 'vic', 'position': {'lat': -37.813, 'long': 144.963} }, 
      {'name': 'nsw','position':{'lat': -33.865143, 'long': 151.209900} }
     ];
    this.route.queryParams.subscribe(params => {
      this.city = params['city'];
      let cityInfoHash = this.cityInfos.reduce((agg, e) => {
        agg[e.name] = e;
        return agg;
      }, {});

      this.cityLat = cityInfoHash[this.city].position.lat;
      this.cityLong = cityInfoHash[this.city].position.long;
      console.log(this.cityLat,this.cityLong);
    });
  }

  ngOnInit() {
      var mapProp = {
        center : new google.maps.LatLng(this.cityLat,this.cityLong),
		    zoom : 10,
		    zoomControl: true,
		    streetViewControl: false,
		    mapTypeControl: false,
		    panControl: false
      };
      var infoWindow = new google.maps.InfoWindow();
      this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp); 
      this.map.data.loadGeoJson('/assets/'+this.city+'.json');
      this.map.data.setStyle({fillOpacity: 0.0, strokeWeight: 1.0});
      this.map.data.addListener('click', function(event) {
        let data = event;
        console.log(event);
        let suburb = data.feature.f.Suburb_Name;
        infoWindow.setContent(suburb + "This is a test");
        infoWindow.setPosition(event.latLng);
        infoWindow.open(this.map);
    });
   
  }

  addMarker(map, location) {
    new google.maps.Marker({
      position: location,
      map: map
    });
  }

}

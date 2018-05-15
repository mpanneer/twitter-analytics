import { Component, OnInit } from '@angular/core';
import { } from '@types/googlemaps';
import { ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TwitteranalyticsService, StateInfo, SuburbFeature } from '../twitteranalytics.service';
import { Observable, of } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-maps',
  templateUrl: './state-map.component.html',
  styleUrls: ['./maps.component.css']
})
export class StateMapComponent implements OnInit {

  attributes = ['', 'income', 'literacy', 'employment', 'students'];
  emotions = ['', 'happy', 'sad', 'neutral', 'enthusiasm', 'worry', 'surprise', 'love', 'fun', 'hate', 'boredom', 'relief', 'anger'];
  emotionColorMap = {
    'happy': 'green',
    'sad': 'red',
    'neutral': 'yellow',
    'enthusiasm': 'blue',
    'worry': 'red',
    'suprise': 'brown',
    'love': 'yellow',
    'fun': 'orange',
    'hate': 'red',
    'boredom': 'grey',
    'relief': 'green',
    'anger': 'red'
  }
  attrColorMap = {
    'income': 'green',
    'employment': 'blue',
    'students': 'yellow',
    'literacy': 'red',
  }
  stateCoordinatesMap = {
    'vic': [-37.81, 144.96],
    'nsw': [-33.86, 151.20]
  }

  state: string;
  gmap: google.maps.Map;
  selectedEmotion: string;
  selectedAttr: string;
  @ViewChild('pac-input') gmapSearch: any;
  @ViewChild('gmap') gmapElement: any;
  markers = [];

  constructor(private route: ActivatedRoute, private _twitterAnalytics: TwitteranalyticsService) {

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.state = params['state'];
      this.showStateMap();
    });
  }

  emotionSelect(emotion) {
    console.log("Selected emotion is " + emotion);
    this.selectedEmotion = emotion;
    this.updateMapForEmotion();
  }

  attributeSelect(attr) {
    console.log("Selected attribute is " + attr);
    this.selectedAttr = attr;
    if (this.selectedAttr === 'students') {
      this.updateMapForAttributeStudents();
    } else if (this.selectedAttr === 'income') {
      this.updateMapForAttributeIncome();
    } else if (this.selectedAttr === 'employment') {
      this.updateMapForAttributeEmployment();
    } else if (this.selectedAttr === 'literacy') {
      this.updateMapForAttributeLiteracy();
    }
  }

  showStateMap() {
    let coordinates = this.stateCoordinatesMap[this.state];
    let latLng = new google.maps.LatLng(coordinates[0], coordinates[1]);
    var mapProp = {
      center: latLng,
      zoom: 11,
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      panControl: false
    };

    this.gmap = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
  }

  updateMapForEmotion() {
    this.clearFeatures();
    this.clearMarkers();
    this._twitterAnalytics.getTopEmotionsSuburbsByState(this.state, this.selectedEmotion).subscribe((data) => {
      console.log(data);
      let topsuburbs = data['data'].rows;
      var infoWindow = new google.maps.InfoWindow();
      topsuburbs.forEach((element, index) => {

        let suburbName = element.key[1];
        let emotionPercent = element.value[this.selectedEmotion + 'Percent'];
        let tweetCount = element.value.tweets;

        this._twitterAnalytics.getSuburbDetails(this.state, suburbName).subscribe((data) => {
          let rowData = data['data'].rows[0];
          if (rowData) {
            let mapFeature = {};
            mapFeature['type'] = 'Feature';
            mapFeature['geometry'] = rowData.doc.geometry;
            let props = {};
            props['fillOpacity'] = emotionPercent / 100;
            props['fillColor'] = this.emotionColorMap[this.selectedEmotion];
            props['Suburb_Name'] = rowData.doc.SSCName;
            props['tweets'] = tweetCount;
            props['emotionPercent'] = emotionPercent;
            props['emotionName'] = this.selectedEmotion;

            props['yearTwelvePassPercent'] = rowData.doc.yearTwelvePassPercent;
            props['uniStudentPercent'] = rowData.doc.uniStudentPercent;
            props['medianIncome'] = rowData.doc.medianIncome;
            props['percentEmployed'] = rowData.doc.percentEmployed;

            mapFeature['properties'] = props;
            this.gmap.data.addGeoJson(mapFeature);

            var bounds = new google.maps.LatLngBounds();
            rowData.doc.geometry.coordinates.forEach(function (path1) {
              path1.forEach(function (path2) {
                bounds.extend(new google.maps.LatLng(path2[1], path2[0]));
              });
            });
            let marker = new google.maps.Marker({
              position: bounds.getCenter(),
              map: this.gmap,
              label: '' + (index + 1)
            });
            this.markers.push(marker);
            marker.addListener('click', function (event) {
              let suburb = mapFeature['properties'].Suburb_Name;
              let emotionPercent = props['emotionPercent']

              let yearTwelvePassPercent = props['yearTwelvePassPercent'];
              let uniStudentPercent = props['uniStudentPercent'];
              let medianIncome = props['medianIncome'];
              let percentEmployed = props['percentEmployed'];
              let tweetCount = props['tweets'];
              let contentString = '<div>' +
                '<b><u>' + suburb + '</u></b>' +
                '<br/><br/>' +
                '<div align="left">' +
                '<i>Tweet Count</i>: <b>' + tweetCount + '</b><br/>' +
                '<br/>' +
                '<i><b>AURIN Attributes</b></i><br/>' +
                '<i>Year Twelve Pass%</i>: <b>' + yearTwelvePassPercent + '</b><br/>' +
                '<i>UniStudents %</i>: <b>' + uniStudentPercent + '</b><br/>' +
                '<i>Median Income</i>: <b>' + medianIncome + '</b><br/>' +
                '<i>Employment %</i>: <b>' + percentEmployed + '</b><br/>' +
                '</div>' +
                '</div>';
              infoWindow.setContent(contentString);
              infoWindow.setPosition(event.latLng);
              infoWindow.open(this.map);
            })

          }
        });

        this.gmap.data.setStyle(function (mapFeature) {
          let fillOpacity = mapFeature.getProperty('fillOpacity');
          let fillColor = mapFeature.getProperty('fillColor');
          return {
            fillOpacity: fillOpacity,
            fillColor: fillColor,
            strokeWeight: 1,
          };
        });

      });
    });
  }


  clearFeatures() {
    let map = this.gmap;
    this.gmap.data.forEach(function (feature) {
      // If you want, check here for some constraints.
      map.data.remove(feature);
    });
  }

  // Sets the map on all markers in the array.
  setMapOnAll(map) {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }

  // Removes the markers from the map, but keeps them in the array.
  clearMarkers() {
    this.setMapOnAll(null);
  }

  updateMapForAttributeIncome() {
    this.clearFeatures();
    this.clearMarkers();
    this._twitterAnalytics.getTopSalarySuburbsByState(this.state).subscribe((data) => {
      console.log(data);
      let topsuburbs = data['data'].rows;
      var infoWindow = new google.maps.InfoWindow();
      topsuburbs.forEach((element, index) => {

        let suburbName = element.doc.suburbName;
        let salary = element.key[1];
        let mapFeature = {};
        mapFeature['type'] = 'Feature';
        mapFeature['geometry'] = element.doc.geometry;
        let props = {};
        props['fillOpacity'] = salary / 100000;
        props['fillColor'] = 'green';
        mapFeature['properties'] = props;
        this.gmap.data.addGeoJson(mapFeature);
        var bounds = new google.maps.LatLngBounds();
        element.doc.geometry.coordinates.forEach(function (path1) {
          path1.forEach(function (path2) {
            bounds.extend(new google.maps.LatLng(path2[1], path2[0]));
          });
        });
        let marker = new google.maps.Marker({
          position: bounds.getCenter(),
          map: this.gmap,
          label: '' + (index + 1)
        });
        this.markers.push(marker);
        this._twitterAnalytics.getSuburbEmotionsByName(this.state, suburbName).subscribe((data) => {
          let rowData = data['data'].rows[0];
          console.log(rowData);
          if (rowData) {
            marker.addListener('click', function (event) {
              let suburb = mapFeature['properties'].Suburb_Name;
              let contentString = '<div>' +
                '<b><u>' + element.doc.SSCName + '</u></b>' +
                '<br/><br/>' +
                '<div align="left">' +
                '<i>Tweet Count</i>: <b>' + rowData.value.tweets + '</b><br/>' +
                '<br/>' +
                '<i><b>Tweets Sentiments</b></i><br/>' +
                '<i>Happy%</i>: <b>' + rowData.value.happyPercent + '</b><br/>' +
                '<i>Sad%</i>: <b>' + rowData.value.sadPercent + '</b><br/>' +
                '<i>Neutral%</i>: <b>' + rowData.value.neutralPercent + '</b><br/>' +
                '<i>Enthusiasm%</i>: <b>' + rowData.value.enthusiasmPercent + '</b><br/>' +
                '<i>Worry%</i>: <b>' + rowData.value.worryPercent + '</b><br/>' +
                '<i>Surprise%</i>: <b>' + rowData.value.surprisePercent + '</b><br/>' +
                '<i>Love%</i>: <b>' + rowData.value.lovePercent + '</b><br/>' +
                '<i>Fun%</i>: <b>' + rowData.value.funPercent + '</b><br/>' +
                '<i>Hate%</i>: <b>' + rowData.value.hatePercent + '</b><br/>' +
                '<i>Boredom%</i>: <b>' + rowData.value.boredomPercent + '</b><br/>' +
                '<i>Relief%</i>: <b>' + rowData.value.reliefPercent + '</b><br/>' +
                '<i>Anger%</i>: <b>' + rowData.value.angerPercent + '</b><br/>' +
                '</div>' +
                '</div>';
              infoWindow.setContent(contentString);
              infoWindow.setPosition(event.latLng);
              infoWindow.open(this.map);
            })

          }
        });

        this.gmap.data.setStyle(function (mapFeature) {
          let fillOpacity = mapFeature.getProperty('fillOpacity');
          let fillColor = mapFeature.getProperty('fillColor');
          return {
            fillOpacity: fillOpacity,
            fillColor: fillColor,
            strokeWeight: 1,
          };
        });

      });
    });
  }

  updateMapForAttributeStudents() {
    this.clearFeatures();
    this.clearMarkers();
    this._twitterAnalytics.getTopUniStudentsSuburbsByState(this.state).subscribe((data) => {
      console.log(data);
      let topsuburbs = data['data'].rows;
      var infoWindow = new google.maps.InfoWindow();
      topsuburbs.forEach((element, index) => {

        let suburbName = element.doc.suburbName;
        let students = element.key[1];
        let mapFeature = {};
        mapFeature['type'] = 'Feature';
        mapFeature['geometry'] = element.doc.geometry;
        let props = {};
        props['fillOpacity'] = students / 100;
        props['fillColor'] = 'yellow';
        mapFeature['properties'] = props;
        this.gmap.data.addGeoJson(mapFeature);
        var bounds = new google.maps.LatLngBounds();
        element.doc.geometry.coordinates.forEach(function (path1) {
          path1.forEach(function (path2) {
            bounds.extend(new google.maps.LatLng(path2[1], path2[0]));
          });
        });
        let marker = new google.maps.Marker({
          position: bounds.getCenter(),
          map: this.gmap,
          label: '' + (index + 1)
        });
        this.markers.push(marker);
        this._twitterAnalytics.getSuburbEmotionsByName(this.state, suburbName).subscribe((data) => {
          let rowData = data['data'].rows[0];
          console.log(rowData);
          if (rowData) {
            marker.addListener('click', function (event) {
              let suburb = mapFeature['properties'].Suburb_Name;
              let contentString = '<div>' +
                '<b><u>' + element.doc.SSCName + '</u></b>' +
                '<br/><br/>' +
                '<div align="left">' +
                '<i>Tweet Count</i>: <b>' + rowData.value.tweets + '</b><br/>' +
                '<br/>' +
                '<i><b>Tweets Sentiments</b></i><br/>' +
                '<i>Happy%</i>: <b>' + rowData.value.happyPercent + '</b><br/>' +
                '<i>Sad%</i>: <b>' + rowData.value.sadPercent + '</b><br/>' +
                '<i>Neutral%</i>: <b>' + rowData.value.neutralPercent + '</b><br/>' +
                '<i>Enthusiasm%</i>: <b>' + rowData.value.enthusiasmPercent + '</b><br/>' +
                '<i>Worry%</i>: <b>' + rowData.value.worryPercent + '</b><br/>' +
                '<i>Surprise%</i>: <b>' + rowData.value.surprisePercent + '</b><br/>' +
                '<i>Love%</i>: <b>' + rowData.value.lovePercent + '</b><br/>' +
                '<i>Fun%</i>: <b>' + rowData.value.funPercent + '</b><br/>' +
                '<i>Hate%</i>: <b>' + rowData.value.hatePercent + '</b><br/>' +
                '<i>Boredom%</i>: <b>' + rowData.value.boredomPercent + '</b><br/>' +
                '<i>Relief%</i>: <b>' + rowData.value.reliefPercent + '</b><br/>' +
                '<i>Anger%</i>: <b>' + rowData.value.angerPercent + '</b><br/>' +
                '</div>' +
                '</div>';
              infoWindow.setContent(contentString);
              infoWindow.setPosition(event.latLng);
              infoWindow.open(this.map);
            })

          }
        });

        this.gmap.data.setStyle(function (mapFeature) {
          let fillOpacity = mapFeature.getProperty('fillOpacity');
          let fillColor = mapFeature.getProperty('fillColor');
          return {
            fillOpacity: fillOpacity,
            fillColor: fillColor,
            strokeWeight: 1,
          };
        });

      });
    });
  }

  updateMapForAttributeEmployment() {
    this.clearFeatures();
    this.clearMarkers();
    this._twitterAnalytics.getTopemployedSuburbsByState(this.state).subscribe((data) => {
      console.log(data);
      let topsuburbs = data['data'].rows;
      var infoWindow = new google.maps.InfoWindow();
      topsuburbs.forEach((element, index) => {

        let suburbName = element.doc.suburbName;
        let employment = element.key[1];
        let mapFeature = {};
        mapFeature['type'] = 'Feature';
        mapFeature['geometry'] = element.doc.geometry;
        let props = {};
        props['fillOpacity'] = employment / 100;
        props['fillColor'] = 'blue';
        mapFeature['properties'] = props;
        this.gmap.data.addGeoJson(mapFeature);
        var bounds = new google.maps.LatLngBounds();
        element.doc.geometry.coordinates.forEach(function (path1) {
          path1.forEach(function (path2) {
            bounds.extend(new google.maps.LatLng(path2[1], path2[0]));
          });
        });
        let marker = new google.maps.Marker({
          position: bounds.getCenter(),
          map: this.gmap,
          label: '' + (index + 1)
        });
        this.markers.push(marker);
        this._twitterAnalytics.getSuburbEmotionsByName(this.state, suburbName).subscribe((data) => {
          let rowData = data['data'].rows[0];
          console.log(rowData);
          if (rowData) {
            marker.addListener('click', function (event) {
              let suburb = mapFeature['properties'].Suburb_Name;
              let contentString = '<div>' +
                '<b><u>' + element.doc.SSCName + '</u></b>' +
                '<br/><br/>' +
                '<div align="left">' +
                '<i>Tweet Count</i>: <b>' + rowData.value.tweets + '</b><br/>' +
                '<br/>' +
                '<i><b>Tweets Sentiments</b></i><br/>' +
                '<i>Happy%</i>: <b>' + rowData.value.happyPercent + '</b><br/>' +
                '<i>Sad%</i>: <b>' + rowData.value.sadPercent + '</b><br/>' +
                '<i>Neutral%</i>: <b>' + rowData.value.neutralPercent + '</b><br/>' +
                '<i>Enthusiasm%</i>: <b>' + rowData.value.enthusiasmPercent + '</b><br/>' +
                '<i>Worry%</i>: <b>' + rowData.value.worryPercent + '</b><br/>' +
                '<i>Surprise%</i>: <b>' + rowData.value.surprisePercent + '</b><br/>' +
                '<i>Love%</i>: <b>' + rowData.value.lovePercent + '</b><br/>' +
                '<i>Fun%</i>: <b>' + rowData.value.funPercent + '</b><br/>' +
                '<i>Hate%</i>: <b>' + rowData.value.hatePercent + '</b><br/>' +
                '<i>Boredom%</i>: <b>' + rowData.value.boredomPercent + '</b><br/>' +
                '<i>Relief%</i>: <b>' + rowData.value.reliefPercent + '</b><br/>' +
                '<i>Anger%</i>: <b>' + rowData.value.angerPercent + '</b><br/>' +
                '</div>' +
                '</div>';
              infoWindow.setContent(contentString);
              infoWindow.setPosition(event.latLng);
              infoWindow.open(this.map);
            })

          }
        });

        this.gmap.data.setStyle(function (mapFeature) {
          let fillOpacity = mapFeature.getProperty('fillOpacity');
          let fillColor = mapFeature.getProperty('fillColor');
          return {
            fillOpacity: fillOpacity,
            fillColor: fillColor,
            strokeWeight: 1,
          };
        });

      });
    });
  }

  updateMapForAttributeLiteracy() {
    this.clearFeatures();
    this.clearMarkers();
    this._twitterAnalytics.getTopIlliterateSuburbsByState(this.state).subscribe((data) => {
      console.log(data);
      let topsuburbs = data['data'].rows;
      var infoWindow = new google.maps.InfoWindow();
      topsuburbs.forEach((element, index) => {

        let suburbName = element.doc.suburbName;
        let literacy = element.key[1];
        let mapFeature = {};
        mapFeature['type'] = 'Feature';
        mapFeature['geometry'] = element.doc.geometry;
        let props = {};
        props['fillOpacity'] = literacy / 100;
        props['fillColor'] = 'red';
        mapFeature['properties'] = props;
        this.gmap.data.addGeoJson(mapFeature);
        var bounds = new google.maps.LatLngBounds();
        element.doc.geometry.coordinates.forEach(function (path1) {
          path1.forEach(function (path2) {
            bounds.extend(new google.maps.LatLng(path2[1], path2[0]));
          });
        });
        let marker = new google.maps.Marker({
          position: bounds.getCenter(),
          map: this.gmap,
          label: '' + (index + 1)
        });
        this.markers.push(marker);
        this._twitterAnalytics.getSuburbEmotionsByName(this.state, suburbName).subscribe((data) => {
          let rowData = data['data'].rows[0];
          console.log(rowData);
          if (rowData) {
            marker.addListener('click', function (event) {
              let suburb = mapFeature['properties'].Suburb_Name;
              let contentString = '<div>' +
                '<b><u>' + element.doc.SSCName + '</u></b>' +
                '<br/><br/>' +
                '<div align="left">' +
                '<i>Tweet Count</i>: <b>' + rowData.value.tweets + '</b><br/>' +
                '<br/>' +
                '<i><b>Tweets Sentiments</b></i><br/>' +
                '<i>Happy%</i>: <b>' + rowData.value.happyPercent + '</b><br/>' +
                '<i>Sad%</i>: <b>' + rowData.value.sadPercent + '</b><br/>' +
                '<i>Neutral%</i>: <b>' + rowData.value.neutralPercent + '</b><br/>' +
                '<i>Enthusiasm%</i>: <b>' + rowData.value.enthusiasmPercent + '</b><br/>' +
                '<i>Worry%</i>: <b>' + rowData.value.worryPercent + '</b><br/>' +
                '<i>Surprise%</i>: <b>' + rowData.value.surprisePercent + '</b><br/>' +
                '<i>Love%</i>: <b>' + rowData.value.lovePercent + '</b><br/>' +
                '<i>Fun%</i>: <b>' + rowData.value.funPercent + '</b><br/>' +
                '<i>Hate%</i>: <b>' + rowData.value.hatePercent + '</b><br/>' +
                '<i>Boredom%</i>: <b>' + rowData.value.boredomPercent + '</b><br/>' +
                '<i>Relief%</i>: <b>' + rowData.value.reliefPercent + '</b><br/>' +
                '<i>Anger%</i>: <b>' + rowData.value.angerPercent + '</b><br/>' +
                '</div>' +
                '</div>';
              infoWindow.setContent(contentString);
              infoWindow.setPosition(event.latLng);
              infoWindow.open(this.map);
            })

          }
        });

        this.gmap.data.setStyle(function (mapFeature) {
          let fillOpacity = mapFeature.getProperty('fillOpacity');
          let fillColor = mapFeature.getProperty('fillColor');
          return {
            fillOpacity: fillOpacity,
            fillColor: fillColor,
            strokeWeight: 1,
          };
        });

      });
    });
  }


}

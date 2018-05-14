import { Component, OnInit } from '@angular/core';
import { TwitteranalyticsService } from '../twitteranalytics.service';
import { Chart } from 'chart.js';
import { ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartComponent } from './chart.component';

@Component({
  selector: 'app-charts',
  templateUrl: './chart.component.html',
  styleUrls: ['./charts.component.css']
})
export class EmotionChartComponent extends ChartComponent implements OnInit {

  chart = [];

  constructor(private route: ActivatedRoute, private _twitterAnalytics: TwitteranalyticsService) {
    super();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let state = params['state'];
      let emotion = params['emotion'];
      this.drawTopEmotionSuburbs(state, emotion);
    });
  }

  drawTopEmotionSuburbs(stateName, emotion) {
    this._twitterAnalytics.getTopEmotionsSuburbsByState(stateName,emotion).subscribe((data) => {
      console.log(data);
      let suburbNames = data['data'].rows.map(rows => rows.key[1]);
      let emotionPercent = data['data'].rows.map(rows => rows.value[emotion+'Percent']);
      this.drawBarChart('Suburbs: '+emotion+'%', suburbNames, emotionPercent);
    });
  }

}
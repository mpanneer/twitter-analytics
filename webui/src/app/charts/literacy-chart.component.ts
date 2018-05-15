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
export class LiteracyChartComponent extends ChartComponent implements OnInit {

  chart = [];
  state: string;


  constructor(private route: ActivatedRoute, private _twitterAnalytics: TwitteranalyticsService) {
    super();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.state = params['state'];
      this.drawTopIlliterateSuburbs(this.state);
      this.chartName = 'Top 10 '+ this.state.toUpperCase()+' Suburbs : Literacy %'
    });
  }

  drawTopIlliterateSuburbs(stateName) {
    this._twitterAnalytics.getTopIlliterateSuburbsByState(stateName).subscribe((data) => {
      let suburbNames = data['data'].rows.map(rows => rows.doc.SSCName);
      let yearTwelvePassPercent = data['data'].rows.map(rows => rows.doc.yearTwelvePassPercent);
      this.drawBarChart('Year Twelve Pass %', suburbNames, yearTwelvePassPercent);
    });
  }

}
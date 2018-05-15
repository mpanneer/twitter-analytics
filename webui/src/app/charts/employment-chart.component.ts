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
export class EmploymentChartComponent extends ChartComponent implements OnInit {

  chart = [];
  state: string;

  constructor(private route: ActivatedRoute, private _twitterAnalytics: TwitteranalyticsService) {
    super();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.state = params['state'];
      this.drawTopEmployedSuburbs(this.state);
      this.chartName = 'Top 10 '+ this.state.toUpperCase()+' Suburbs : Employment %'
    });
  }

  drawTopEmployedSuburbs(stateName) {
    this._twitterAnalytics.getTopemployedSuburbsByState(stateName).subscribe((data) => {
      let suburbNames = data['data'].rows.map(rows => rows.doc.SSCName);
      let percentEmployed = data['data'].rows.map(rows => rows.doc.percentEmployed);
      this.drawBarChart('Employment %', suburbNames, percentEmployed);
    });
  }

}
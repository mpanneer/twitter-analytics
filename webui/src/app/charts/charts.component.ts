import { Component, OnInit } from '@angular/core';
import { TwitteranalyticsService } from '../twitteranalytics.service';
import { Chart } from 'chart.js';
import { ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

  chart = [];
  state: string;

  constructor(private route: ActivatedRoute, private _twitterAnalytics: TwitteranalyticsService) {}

  ngOnInit() {
    
  }
} 
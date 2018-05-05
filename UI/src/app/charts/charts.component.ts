import { Component, OnInit } from '@angular/core';
import { TwitteranalyticsService } from '../twitteranalytics.service';
import { Chart } from 'chart.js';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

  chart = [];
  tweets = [];
  constructor(private _twitterAnalytics: TwitteranalyticsService) {}

  ngOnInit() {

    this.tweets = this._twitterAnalytics.tweetsPerPostcode();

    let postCodes = this.tweets.map(tweets => tweets.postcode);
    let noOfTweets = this.tweets.map(tweets => tweets.tweetsCount);
    
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: postCodes,
        datasets: [
          { 
            label: 'No. of Tweets',
            data: noOfTweets,
            borderColor: "#3cba9f"
          }
        ]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
        }
      }
    });
  }
}

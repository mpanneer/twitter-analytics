import { Component, OnInit } from '@angular/core';
import { TwitteranalyticsService } from '../twitteranalytics.service';
import { Chart } from 'chart.js';
import { ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-charts',
  templateUrl: './chart.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartComponent {

  chart = [];
  chartName: string;

  drawBarChart(label,labels,values) {
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          { 
            label: label,
            data: values,
            backgroundColor: "black"
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

  drawClusteredBarChart2(canvas,labels, label1, values1, label2, values2) {
    return new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          { 
            label: label1,
            data: values1,
            backgroundColor: "black"
          },
          { 
            label: label2,
            data: values2,
            backgroundColor: "red"
          }
        ]
      },
      options: {
        barValueSpacing: 20,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true,
              min: 0,
              max: 100,
              stepSize: 20,
              autoSkip: false
            }
          }],
          xAxes: [{
            ticks: {
              autoSkip: false
            }
          }]
        }
      }
    });
  }

  drawClusteredBarChart(labels, label1, values1, label2, values2, label3, values3) {
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          { 
            label: label1,
            data: values1,
            backgroundColor: "black"
          },
          { 
            label: label2,
            data: values2,
            backgroundColor: "red"
          },
          { 
            label: label3,
            data: values3,
            backgroundColor: "blue"
          }
        ]
      },
      options: {
        barValueSpacing: 50,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true,
              min: 0
            }
          }]
        }
      }
    });
  }
}

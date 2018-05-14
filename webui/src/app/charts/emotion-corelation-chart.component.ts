import { Component, OnInit } from '@angular/core';
import { TwitteranalyticsService } from '../twitteranalytics.service';
import { Chart } from 'chart.js';
import { ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartComponent } from './chart.component';

@Component({
  selector: 'app-charts',
  templateUrl: './corel-chart.component.html',
  styleUrls: ['./charts.component.css']
})
export class EmotionCorelationChartComponent extends ChartComponent implements OnInit {

  chartleft: Chart;
  chartright: Chart;
  attrs = ['', 'students', 'income', 'employment', 'literacy'];
  emotions = ['', 'happy','sad','neutral','enthusiasm','worry','surprise','love','fun','hate','boredom','relief','anger'];
  

  selectedEmotion: string;
  selectedAttr: string;
  state: string;

  constructor(private route: ActivatedRoute, private _twitterAnalytics: TwitteranalyticsService) {
    super();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.state = params['state'];
    });
  }

  emotionSelect(emotion) {
    console.log("Selected emotion is " + emotion);
    this.selectedEmotion = emotion;
    this.updateCharts();
  }

  attrSelect(attr) {
    console.log("Selected attribute is " + attr);
    this.selectedAttr = attr;
    this.updateCharts();
  }

  updateCharts() {
    if (!this.isEmpty(this.selectedEmotion) && !this.isEmpty(this.selectedAttr)) {
      if (this.chartleft) {
        this.chartleft.destroy();
      }
      if (this.chartright) {
        this.chartright.destroy();
      }
      if (this.selectedAttr === 'students') {
        this.drawEmotionCorelationForStudent(this.state, this.selectedEmotion);
      } else if (this.selectedAttr === 'income') {
        this.drawEmotionCorelationForIncome(this.state, this.selectedEmotion);
      } else if (this.selectedAttr === 'employment') {
        this.drawEmotionCorelationForEmployment(this.state, this.selectedEmotion);
      } else if (this.selectedAttr === 'literacy') {
        this.drawEmotionCorelationForLiteracy(this.state, this.selectedEmotion)
      }
    }
  }

  isEmpty(str) {
    return (!str || 0 === str.length);
  }

  drawEmotionCorelationForStudent(stateName, emotion) {
    this._twitterAnalytics.getTopUniStudentsSuburbsByState(stateName).subscribe((data) => {
      
      let suburbNames = data['data'].rows.map(rows => rows.doc.suburbName);
      let studentPercent = data['data'].rows.map(rows => rows.doc.uniStudentPercent);
      let emotionPercent = [];
      console.log(suburbNames,studentPercent);
      suburbNames.forEach(element => {
        this._twitterAnalytics.getSuburbEmotionsByName(stateName, element).subscribe((data) => {
          let suburbEmotionData = data['data'].rows[0];
          if (suburbEmotionData) {
            emotionPercent.push(suburbEmotionData.value[emotion + 'Percent']);
          } else {
            emotionPercent.push('0');
          }
          
          if (emotionPercent.length == suburbNames.length) {
            this.chartleft = this.drawClusteredBarChart2('canvas-left', suburbNames, 'University Students', studentPercent, emotion, emotionPercent);
          }
        });
      });
    });

    this._twitterAnalytics.getTopEmotionsSuburbsByState(stateName, emotion).subscribe((data) => {
      let suburbNames = data['data'].rows.map(rows => rows.key[1]);
      let emotionPercent = data['data'].rows.map(rows => rows.value[emotion + 'Percent']);
      let studentPercent = [];

      suburbNames.forEach(element => {
        this._twitterAnalytics.getSuburbDetails(stateName, element).subscribe((data) => {
          studentPercent.push(data['data'].rows.map(rows => rows.doc.uniStudentPercent));
          if (studentPercent.length == suburbNames.length) {
            this.chartright = this.drawClusteredBarChart2('canvas-right',suburbNames, 'University Students', studentPercent, emotion, emotionPercent);
          }
        });
      });
    });
  }


  drawEmotionCorelationForIncome(stateName, emotion) {
    this._twitterAnalytics.getTopSalarySuburbsByState(stateName).subscribe((data) => {
      let suburbNames = data['data'].rows.map(rows => rows.doc.suburbName);
      let medianIncome = data['data'].rows.map(rows => rows.doc.medianIncome / 1000);
      let emotionPercent = [];

      suburbNames.forEach(element => {
        this._twitterAnalytics.getSuburbEmotionsByName(stateName, element).subscribe((data) => {
          let suburbEmotionData = data['data'].rows[0];
          if (suburbEmotionData) {
            emotionPercent.push(suburbEmotionData.value[emotion + 'Percent']);
          } else {
            emotionPercent.push('0');
          }
          if (emotionPercent.length == suburbNames.length) {
            this.drawClusteredBarChart2('canvas-left', suburbNames, 'Median Income', medianIncome, emotion, emotionPercent);
          }
        });
      });
    });

    this._twitterAnalytics.getTopEmotionsSuburbsByState(stateName, emotion).subscribe((data) => {
      let suburbNames = data['data'].rows.map(rows => rows.key[1]);
      let emotionPercent = data['data'].rows.map(rows => rows.value[emotion + 'Percent']);
      let medianIncome = [];

      suburbNames.forEach(element => {
        this._twitterAnalytics.getSuburbDetails(stateName, element).subscribe((data) => {
          medianIncome.push(data['data'].rows.map(rows => rows.doc.medianIncome / 1000));
          if (medianIncome.length == suburbNames.length) {
            this.drawClusteredBarChart2('canvas-right', suburbNames, 'Median Income', medianIncome, emotion, emotionPercent);
          }
        });
      });
    });
  }

  drawEmotionCorelationForEmployment(stateName, emotion) {
    this._twitterAnalytics.getTopemployedSuburbsByState(stateName).subscribe((data) => {
      let suburbNames = data['data'].rows.map(rows => rows.doc.suburbName);
      let employmentPercent = data['data'].rows.map(rows => rows.doc.percentEmployed);
      let emotionPercent = [];

      suburbNames.forEach(element => {
        this._twitterAnalytics.getSuburbEmotionsByName(stateName, element).subscribe((data) => {
          let suburbEmotionData = data['data'].rows[0];
          if (suburbEmotionData) {
            emotionPercent.push(suburbEmotionData.value[emotion + 'Percent']);
          } else {
            emotionPercent.push('0');
          }

          if (emotionPercent.length == suburbNames.length) {
            this.drawClusteredBarChart2('canvas-left', suburbNames, 'Employment', employmentPercent, emotion, emotionPercent);
          }
        });
      });
    });

    this._twitterAnalytics.getTopEmotionsSuburbsByState(stateName, emotion).subscribe((data) => {
      let suburbNames = data['data'].rows.map(rows => rows.key[1]);
      let emotionPercent = data['data'].rows.map(rows => rows.value[emotion + 'Percent']);
      let employmentPercent = [];

      suburbNames.forEach(element => {
        this._twitterAnalytics.getSuburbDetails(stateName, element).subscribe((data) => {
          employmentPercent.push(data['data'].rows.map(rows => rows.doc.percentEmployed));
          if (employmentPercent.length == suburbNames.length) {
            this.drawClusteredBarChart2('canvas-right', suburbNames, 'Employment', employmentPercent, emotion, emotionPercent);
          }
        });
      });
    });
  }

  drawEmotionCorelationForLiteracy(stateName, emotion) {
    this._twitterAnalytics.getTopIlliterateSuburbsByState(stateName).subscribe((data) => {
      let suburbNames = data['data'].rows.map(rows => rows.doc.suburbName);
      let literacyPercent = data['data'].rows.map(rows => rows.doc.yearTwelvePassPercent);
      let emotionPercent = [];

      suburbNames.forEach(element => {
        this._twitterAnalytics.getSuburbEmotionsByName(stateName, element).subscribe((data) => {
          let suburbEmotionData = data['data'].rows[0];
          if (suburbEmotionData) {
            emotionPercent.push(suburbEmotionData.value[emotion + 'Percent']);
          } else {
            emotionPercent.push('0');
          }
          if (emotionPercent.length == suburbNames.length) {
            this.drawClusteredBarChart2('canvas-left', suburbNames, 'Literacy', literacyPercent, emotion, emotionPercent);
          }
        });
      });
    });

    this._twitterAnalytics.getTopEmotionsSuburbsByState(stateName, emotion).subscribe((data) => {
      let suburbNames = data['data'].rows.map(rows => rows.key[1]);
      let emotionPercent = data['data'].rows.map(rows => rows.value[emotion + 'Percent']);
      let literacyPercent = [];

      suburbNames.forEach(element => {
        this._twitterAnalytics.getSuburbDetails(stateName, element).subscribe((data) => {
          literacyPercent.push(data['data'].rows.map(rows => rows.doc.yearTwelvePassPercent));
          if (literacyPercent.length == suburbNames.length) {
            this.drawClusteredBarChart2('canvas-right', suburbNames, 'Literacy', literacyPercent, emotion, emotionPercent);
          }
        });
      });
    });
  }

}
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
  emotions = ['', 'happy', 'sad', 'neutral', 'enthusiasm', 'worry', 'surprise', 'love', 'fun', 'hate', 'boredom', 'relief', 'anger'];


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
        this.chartleft.clear();
        this.chartleft.destroy();
        this.chartleft=null;
      }
      if (this.chartright) {
        this.chartright.clear();
        this.chartright.destroy();
        this.chartright=null;
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
      let emotionPercentMap = new Map();
      suburbNames.forEach(element => {
        this._twitterAnalytics.getSuburbEmotionsByName(stateName, element).subscribe((data) => {
          let suburbEmotionData = data['data'].rows[0];
          if (suburbEmotionData) {
            emotionPercentMap.set(element, suburbEmotionData.value[emotion + 'Percent']);
          } else {
            emotionPercentMap.set(element, 0);
          }

          if (emotionPercentMap.size == suburbNames.length) {
            let emotionPercent = [];
            suburbNames.forEach(element => {
              emotionPercent.push(emotionPercentMap.get(element));
            });
            this.chartleft = this.drawClusteredBarChart2('canvas-left', suburbNames, 'University Students', studentPercent, emotion, emotionPercent);
          }
        });
      });
    });

    this._twitterAnalytics.getTopEmotionsSuburbsByState(stateName, emotion).subscribe((data) => {
      let suburbNames = data['data'].rows.map(rows => rows.key[1]);
      let emotionPercent = data['data'].rows.map(rows => rows.value[emotion + 'Percent']);
      let studentPercentMap = new Map();
      suburbNames.forEach(element => {
        this._twitterAnalytics.getSuburbDetails(stateName, element).subscribe((data) => {
          let suburbAttrData = data['data'].rows[0];
          if (suburbAttrData) {
            studentPercentMap.set(element, suburbAttrData.doc.uniStudentPercent);
          } else {
            studentPercentMap.set(element, 0);
          }
          if (studentPercentMap.size == suburbNames.length) {
            let studentPercent = [];
            suburbNames.forEach(element => {
              studentPercent.push(studentPercentMap.get(element));
            });
            this.chartright = this.drawClusteredBarChart2('canvas-right', suburbNames, 'University Students', studentPercent, emotion, emotionPercent);
          }
        });
      });
    });
  }


  drawEmotionCorelationForIncome(stateName, emotion) {
    this._twitterAnalytics.getTopSalarySuburbsByState(stateName).subscribe((data) => {
      let suburbNames = data['data'].rows.map(rows => rows.doc.suburbName);
      let medianIncome = data['data'].rows.map(rows => rows.doc.medianIncome / 1000);
      let emotionPercentMap = new Map();

      suburbNames.forEach(element => {
        this._twitterAnalytics.getSuburbEmotionsByName(stateName, element).subscribe((data) => {
          let suburbEmotionData = data['data'].rows[0];
          if (suburbEmotionData) {
            emotionPercentMap.set(element, suburbEmotionData.value[emotion + 'Percent']);
          } else {
            emotionPercentMap.set(element, 0);
          }
          if (emotionPercentMap.size == suburbNames.length) {
            let emotionPercent = [];
            suburbNames.forEach(element => {
              emotionPercent.push(emotionPercentMap.get(element));
            });
            this.drawClusteredBarChart2('canvas-left', suburbNames, 'Median Income', medianIncome, emotion, emotionPercent);
          }
        });
      });
    });

    this._twitterAnalytics.getTopEmotionsSuburbsByState(stateName, emotion).subscribe((data) => {
      let suburbNames = data['data'].rows.map(rows => rows.key[1]);
      let emotionPercent = data['data'].rows.map(rows => rows.value[emotion + 'Percent']);
      let medianIncomeMap = new Map();

      suburbNames.forEach(element => {
        this._twitterAnalytics.getSuburbDetails(stateName, element).subscribe((data) => {
          let suburbAttrData = data['data'].rows[0];
          if (suburbAttrData) {
            medianIncomeMap.set(element, suburbAttrData.doc.medianIncome/1000);
          } else {
            medianIncomeMap.set(element, 0);
          }
         
          if (medianIncomeMap.size == suburbNames.length) {
            let medianIncome = [];
            suburbNames.forEach(element => {
              medianIncome.push(medianIncomeMap.get(element));
            });
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
      let emotionPercentMap = new Map();

      suburbNames.forEach(element => {
        this._twitterAnalytics.getSuburbEmotionsByName(stateName, element).subscribe((data) => {
          let suburbEmotionData = data['data'].rows[0];
          if (suburbEmotionData) {
            emotionPercentMap.set(element, suburbEmotionData.value[emotion + 'Percent']);
          } else {
            emotionPercentMap.set(element, 0);
          }

          if (emotionPercentMap.size == suburbNames.length) {
            let emotionPercent = [];
            suburbNames.forEach(element => {
              emotionPercent.push(emotionPercentMap.get(element));
            });
            this.drawClusteredBarChart2('canvas-left', suburbNames, 'Employment', employmentPercent, emotion, emotionPercent);
          }
        });
      });
    });

    this._twitterAnalytics.getTopEmotionsSuburbsByState(stateName, emotion).subscribe((data) => {
      let suburbNames = data['data'].rows.map(rows => rows.key[1]);
      let emotionPercent = data['data'].rows.map(rows => rows.value[emotion + 'Percent']);
      let employmentPercentMap = new Map();

      suburbNames.forEach(element => {
        this._twitterAnalytics.getSuburbDetails(stateName, element).subscribe((data) => {
          let suburbAttrData = data['data'].rows[0];
          console.log(suburbAttrData);
          if (suburbAttrData) {
            console.log(element,suburbAttrData.doc.percentEmployed);
            employmentPercentMap.set(element, suburbAttrData.doc.percentEmployed);
          } else {
            employmentPercentMap.set(element, 0);
          }
          if (employmentPercentMap.size == suburbNames.length) {
            let employmentPercent = [];
            suburbNames.forEach(element => {
              employmentPercent.push(employmentPercentMap.get(element));
            });
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
      let emotionPercentMap = new Map();

      suburbNames.forEach(element => {
        this._twitterAnalytics.getSuburbEmotionsByName(stateName, element).subscribe((data) => {
          let suburbEmotionData = data['data'].rows[0];
          if (suburbEmotionData) {
            emotionPercentMap.set(element, suburbEmotionData.value[emotion + 'Percent']);
          } else {
            emotionPercentMap.set(element, 0);
          }
          if (emotionPercentMap.size == suburbNames.length) {
            let emotionPercent = [];
            suburbNames.forEach(element => {
              emotionPercent.push(emotionPercentMap.get(element));
            });
            this.drawClusteredBarChart2('canvas-left', suburbNames, 'Literacy', literacyPercent, emotion, emotionPercent);
          }
        });
      });
    });

    this._twitterAnalytics.getTopEmotionsSuburbsByState(stateName, emotion).subscribe((data) => {
      let suburbNames = data['data'].rows.map(rows => rows.key[1]);
      let emotionPercent = data['data'].rows.map(rows => rows.value[emotion + 'Percent']);
      let literacyPercentMap = new Map();

      suburbNames.forEach(element => {
        this._twitterAnalytics.getSuburbDetails(stateName, element).subscribe((data) => {
          let suburbAttrData = data['data'].rows[0];
          if (suburbAttrData) {
            literacyPercentMap.set(element, suburbAttrData.doc.yearTwelvePassPercent);
          } else {
            literacyPercentMap.set(element, 0);
          }
         
          if (literacyPercentMap.size == suburbNames.length) {
            let literacyPercent = [];
            suburbNames.forEach(element => {
              literacyPercent.push(literacyPercentMap.get(element));
            });
            this.drawClusteredBarChart2('canvas-right', suburbNames, 'Literacy', literacyPercent, emotion, emotionPercent);
          }
        });
      });
    });
  }

}
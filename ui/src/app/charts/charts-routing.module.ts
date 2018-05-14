import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartsComponent } from './charts.component';
import { ChartComponent } from './chart.component';
import { SalaryChartComponent } from './salary-chart.component';
import { LiteracyChartComponent } from './literacy-chart.component';
import { UniStudentsChartComponent } from './students-chart.component';
import { EmploymentChartComponent } from './employment-chart.component';
import { SalaryCorelationChartComponent } from './salary-corel-chart.component';
import { EmotionChartComponent } from './emotion-chart.component';
import { EmotionCorelationChartComponent } from './emotion-corelation-chart.component';


const chartRoutes: Routes = [
  { path: 'charts', component: ChartsComponent },
  { path: 'chart/salary/:state', component: SalaryChartComponent },
  { path: 'chart/literacy/:state', component: LiteracyChartComponent },
  { path: 'chart/unistudents/:state', component: UniStudentsChartComponent },
  { path: 'chart/employed/:state', component: EmploymentChartComponent },
  { path: 'chart/salary-corel/:state', component: SalaryCorelationChartComponent },

  { path: 'chart/emotion/:emotion/:state', component: EmotionChartComponent },
  { path: 'chart/emotion-corel/:state', component: EmotionCorelationChartComponent }
];

//http://115.146.95.140:5984/twitter_analytics/_design/Tweet/_view/SentimentTweetStateSuburb?keys=[["VIC","melbourne"]]&group=true

@NgModule({
  imports: [
    RouterModule.forChild(chartRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ChartsRoutingModule { }

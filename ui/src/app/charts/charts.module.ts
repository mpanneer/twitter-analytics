import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { ChartsRoutingModule } from './charts-routing.module';
import { ChartComponent } from './chart.component';
import { ChartsComponent } from './charts.component';
import { SalaryChartComponent } from './salary-chart.component';
import { LiteracyChartComponent } from './literacy-chart.component';
import { EmploymentChartComponent } from './employment-chart.component';
import { UniStudentsChartComponent } from './students-chart.component';
import { SalaryCorelationChartComponent } from './salary-corel-chart.component';
import { EmotionChartComponent } from './emotion-chart.component';
import { EmotionCorelationChartComponent } from './emotion-corelation-chart.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    CommonModule,
    ChartsRoutingModule,
    NgbModule
  ],
  declarations: [
    ChartComponent,
    SalaryChartComponent,
    LiteracyChartComponent,
    EmploymentChartComponent,
    UniStudentsChartComponent,
    SalaryCorelationChartComponent,
    ChartsComponent,
    EmotionChartComponent,
    EmotionCorelationChartComponent
  ],
  providers: [ ]
})
export class ChartsModule {}

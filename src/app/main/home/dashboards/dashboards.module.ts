import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  ArcElement,
  CategoryScale,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PieController,
  PointElement,
  Tooltip
} from 'chart.js';
import { DashboardsComponent } from './dashboards.component';
import { WidgetsModule as DashboardWidgetsModule } from '../widgets/widgets.module';


@NgModule({
  declarations: [
    DashboardsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: DashboardsComponent}]),
    DashboardWidgetsModule.forRoot([Tooltip, Legend, PieController,
      LineController, LineElement, PointElement, CategoryScale, LinearScale, ArcElement]),
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DashboardsModule {}

import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartComponentLike } from 'chart.js';
import { BaseChartDirective } from './directives/base-chart.directive';
import { BaseDefaults } from './chart.js/base-defaults';
import { emptyState } from './chart.js/plugins/empty-state';


@NgModule({
  declarations: [
    BaseChartDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    BaseChartDirective
  ]
})
export class WidgetsModule {

  public static forRoot(registrables: ChartComponentLike[]): ModuleWithProviders<WidgetsModule> {
    //override some chart default such as base color
    Chart.defaults.set(BaseDefaults);

    //register all global stuff
    Chart.register(...registrables, emptyState());
    return {
      ngModule: WidgetsModule
    }
  }
}

import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {
  Chart,
  ChartConfiguration,
  ChartData,
  ChartDataset,
  ChartOptions,
  ChartType,
  DefaultDataPoint,
  Plugin
} from 'chart.js';

@Directive({
  selector: 'canvas[baseChart]'
})
export class BaseChartDirective<TType extends ChartType, TData = DefaultDataPoint<TType>,
  TLabel = unknown> implements OnInit, OnChanges, OnDestroy {

  @Input() type: ChartConfiguration<TType, TData, TLabel>['type'] = 'pie' as TType;

  @Input() legend = true;

  @Input() data?: ChartData<TType, TData, TLabel>;

  @Input() options?: ChartOptions<TType>;

  @Input() plugins: Plugin<TType>[] = [];

  @Input() labels?: TLabel[]

  @Input() datasets?: ChartDataset<TType, TData>[]

  @Output() onRender = new EventEmitter<Chart<TType, TData, TLabel>>();

  private chart?: Chart<TType, TData, TLabel>;
  private context: string;

  constructor(private elem: ElementRef, private zone: NgZone) {
    this.context = this.elem.nativeElement.getContext('2d');
  }

  ngOnInit(): void {
    this.renderChart();
  }


  get _options(): ChartOptions<TType> {
    const options = {
      plugins: {
        legend: {
          display: this.legend
        }
      }
    }
    if (!this.options) {
      return options as any;
    }
    return {...options, ...this.options}
  }

  private get _configuration(): ChartConfiguration<TType, TData, TLabel> {
    return {
      type: this.type,
      data: this.data ? this.data : {labels: this.labels || [], datasets: this.datasets || []},
      plugins: this.plugins,
      options: this._options
    }

  }

  renderChart() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.zone.runOutsideAngular(() => this.chart = new Chart(this.context, this._configuration))

    if (this.chart) {
      this.onRender.emit(this.chart);
    }

  }

  ngOnChanges(changes: SimpleChanges): void {
    const requireRender = ['type'];
    const propertyNames = Object.getOwnPropertyNames(changes);

    if (propertyNames.some(key => requireRender.includes(key)) ||
      propertyNames.every(key => changes[ key ].isFirstChange())
    ) {
      this.renderChart();
    } else {

      if (this.chart) {
        Object.assign(this.chart.config.data, this._configuration.data);
        Object.assign(this.chart.config.plugins, this._configuration.plugins);
        Object.assign(this.chart.config.options, this._configuration.options);
        this.zone.runOutsideAngular(() => this.chart?.update());

      }

    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

}

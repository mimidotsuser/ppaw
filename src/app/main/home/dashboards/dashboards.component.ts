import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  Subject,
  Subscription,
  tap
} from 'rxjs';
import { ChartData, ChartOptions } from 'chart.js';
import { AnalyticsService } from '../services/analytics.service';
import {
  ProductItemByLocationAnalytics,
  ProductOutOfStockAnalytics,
  WorksheetByAuthorAnalytics,
  WorksheetByCustomerAnalytics
} from '../../../models/analytics.model';
import { CustomerModel } from '../../../models/customer.model';
import { addDaysToDate } from '../../../utils/utils';
import { serializeDate } from '../../../utils/serializers/date';
import { WorkCategoryCodes, WorkCategoryTitles } from '../../../models/worksheet.model';
import { CustomerService } from '../../customers/services/customer.service';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss'],
  providers: [DatePipe, CustomerService],
})
export class DashboardsComponent implements OnInit, OnDestroy {
  private _subscriptions: Subscription[] = [];
  private _customers: CustomerModel[] = [];
  private _worksheetsByCustomer: WorksheetByCustomerAnalytics[] = [];
  worksheetFilterModel: WorksheetFiltersFormModel = {};
  customerSearch$ = new Subject<string>();
  customerSearchBusy = false;
  productsOutOfStock?: ChartData<'pie'>;
  productItemsByLocation?: ChartData<'pie'>;
  worksheetsByAuthor?: ChartData<'pie'>;
  worksheetsByCustomer?: ChartData<'line'>;
  worksheetsEndDateFilterMin: string;
  worksheetsDateFilterMax: string;
  entryCategories: { id: string, title: string }[];

  constructor(private analyticsService: AnalyticsService, private datePipe: DatePipe,
              private customerService: CustomerService) {

    //form controls init
    const past3Months = addDaysToDate(new Date(), -90);
    this.worksheetFilterModel.start_date = past3Months.toISOString().slice(0, 10)
    this.worksheetFilterModel.end_date = new Date().toISOString().slice(0, 10)
    this.worksheetsDateFilterMax = new Date().toISOString().slice(0, 10)
    this.worksheetsEndDateFilterMin = past3Months.toISOString().slice(0, 10);

    //request data
    this.loadAnalyticsData();

    this.entryCategories = [
      {id: WorkCategoryCodes.REPAIR, title: WorkCategoryTitles.REPAIR},
      {id: WorkCategoryCodes.GENERAL_SERVICING, title: WorkCategoryTitles.GENERAL_SERVICING},
      {
        id: WorkCategoryCodes.DELIVERY_AND_INSTALLATION,
        title: WorkCategoryTitles.DELIVERY_AND_INSTALLATION
      },
      {
        id: WorkCategoryCodes.TRAINING_AND_INSTALLATION,
        title: WorkCategoryTitles.TRAINING_AND_INSTALLATION
      },
      {id: WorkCategoryCodes.TECHNICAL_REPORT, title: WorkCategoryTitles.TECHNICAL_REPORT},
      {id: WorkCategoryCodes.OTHER, title: WorkCategoryTitles.OTHER},
    ];
    this.worksheetFilterModel[ 'entryCategories' ] = this.entryCategories;
  }

  ngOnInit(): void {
    this.customerSearch();
  }

  set subSink(value: Subscription) {
    this._subscriptions.push(value);
  }

  get pieChartOptions(): ChartOptions<'pie'> {
    return {
      responsive: true,
      aspectRatio: 2,
      plugins: {
        legend: {position: 'bottom'},
      }
    }
  }


  get lineChartOptions(): ChartOptions<'line'> {
    return {
      responsive: true,
      aspectRatio: innerWidth < 426 ? 1 : 3,
      elements: {
        line: {
          cubicInterpolationMode: 'monotone',
          tension: 0.4
        },
      },
      scales: {
        y: {min: 0, ticks: {stepSize: 1},},
        x: {ticks: {minRotation: 45}}

      },

      plugins: {
        legend: {position: 'bottom'}
      }
    }
  }

  get customers() {return this._customers}


  private loadAnalyticsData() {
    //worksheets by clients
    this.loadUsersCustomerVisits();

    //out of stock
    this.subSink = this.analyticsService.fetchProductsOutOfStock()
      .subscribe({
        next: (model) => {
          this.productsOutOfStock = this.mapProductsOutOfStockData(model)
        }
      });

    //items by location
    this.subSink = this.analyticsService.fetchProductItemsByLocation()
      .subscribe({
        next: (model) => {
          this.productItemsByLocation = this.mapProductItemsByLocationData(model)
        }
      });

    //worksheets by author
    this.subSink = this.analyticsService.fetchWorksheetsByAuthor()
      .subscribe({
        next: (model) => {
          this.worksheetsByAuthor = this.mapWorksheetsByAuthorData(model)
        }
      });

  }

  private loadUsersCustomerVisits() {
    const params: { [ key: string ]: string } = {}


    if (this.worksheetFilterModel.customers && this.worksheetFilterModel.customers.length > 0) {
      params[ 'customerIds' ] = this.worksheetFilterModel.customers
        .map((customer) => customer.id).join(',');
    }

    if (this.worksheetFilterModel.entryCategories && this.worksheetFilterModel.entryCategories.length > 0) {
      params[ 'entry_categories' ] = this.worksheetFilterModel.entryCategories
        .map((category) => category.id).join(',');
    }

    if (this.worksheetFilterModel.start_date) {
      params[ 'start_date' ] = serializeDate(this.worksheetFilterModel.start_date)
    }

    if (this.worksheetFilterModel.end_date) {
      params[ 'end_date' ] = serializeDate(this.worksheetFilterModel.end_date)
    }

    this.subSink = this.analyticsService.fetchWorksheetsByCustomer(params)
      .subscribe({
        next: (model) => {
          this.worksheetsByCustomer = this.mapWorksheetsByCustomerData(model);
          this._worksheetsByCustomer = model;

          if (this._customers.length === 0) { //only patch if there are no customers
            this.patchSelectedCustomers();
          }
        }
      })
  }

  private mapProductsOutOfStockData(model: ProductOutOfStockAnalytics[]) {
    return {
      datasets: [
        {data: model.map((row) => row.total)}
      ],
      labels: model.map((row) => row.name)
    }
  }

  private mapProductItemsByLocationData(model: ProductItemByLocationAnalytics[]): ChartData<'pie'> {
    return {
      datasets: [
        {data: model.map((row) => row.total)}
      ],
      labels: model.map((row) => row.location)
    }
  }

  private mapWorksheetsByAuthorData(model: WorksheetByAuthorAnalytics[]): ChartData<'pie'> {
    return {
      datasets: [
        {data: model.map((row) => row.total)}
      ],
      labels: model.map((row) => row.name)
    }
  }

  private mapWorksheetsByCustomerData(model: WorksheetByCustomerAnalytics[]): ChartData<'line'> {
    const uniqueLabels: { [ key: string ]: string } = model
      .reduce((acc, row) => {
        const createdAt: string = this.datePipe.transform(row.created_at)!;
        acc[ createdAt ] = row.created_at;
        return acc;
      }, {} as { [ key: string ]: string });

    const labels = Object.keys(uniqueLabels)

    return {
      datasets: model.reduce((acc, row, index) => {
        const obj = acc.find((dataset) => dataset.id === row.customer_id);
        if (obj) {
          obj.data[ index ] = row.total
        } else {
          const data = new Array(labels.length).fill(0);
          data[ index ] = row.total;
          acc.push({
            id: row.customer_id,
            label: `${row.name} - ${row?.branch || row?.region}`,
            data
          })
        }

        return acc;
      }, [] as { id: number, label: string, data: number[] }[]),
      labels
    }
  }

  private patchSelectedCustomers() {

    const selectedUniqueCustomerIds: { [ key: number ]: number } = this._worksheetsByCustomer
      .reduce((acc, row) => {
        acc[ row.customer_id ] = row.customer_id;
        return acc;
      }, {} as { [ key: number ]: number });


    //get data from backend
    this.subSink = this.customerService
      .fetch({ids: Object.keys(selectedUniqueCustomerIds).join(',')})
      .subscribe({
        next: (res) => {

          this.worksheetFilterModel.customers = ([
            ...(this.worksheetFilterModel.customers || []), ...res.data
          ]);

        }
      });

  }

  submitWorksheetDataFilters() {
    this.loadUsersCustomerVisits();
  }

  onStartDateChange() {
    if (this.worksheetFilterModel.start_date) {
      this.worksheetsEndDateFilterMin = new Date(this.worksheetFilterModel.start_date)
        .toISOString().slice(0, 10);
    } else {
      this.worksheetsEndDateFilterMin = '';
    }
  }


  customerSearch() {
    this.subSink = this.customerSearch$
      .pipe(filter((term) => term != null && term.trim().length > 2),
        distinctUntilChanged(),
        debounceTime(800))
      .pipe(tap(() => this.customerSearchBusy = true))
      .pipe(finalize(() => this.customerSearchBusy = false))
      .subscribe((searchTerm) => {

        this.customerSearchBusy = true;
        const selectedCustomers = (this.worksheetFilterModel.customers || []);

        this.subSink = this.customerService.fetch({
          limit: 10, search: searchTerm,
          exclude: selectedCustomers.map((c) => c.id).join(',')
        })
          .pipe(finalize(() => this.customerSearchBusy = false))
          .subscribe({
            next: (res) => {
              this._customers = selectedCustomers.concat(res.data);
            }
          })
      })
  }


  customersTrackByFn(item?: CustomerModel) {return item?.id}

  ngOnDestroy(): void {
    this._subscriptions.map((s) => s.unsubscribe())
  }
}

interface WorksheetFiltersFormModel {
  start_date?: string,
  end_date?: string,
  customers?: CustomerModel[],
  entryCategories?: { id: string, title: string }[]
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChartData, ChartOptions } from 'chart.js';
import { AnalyticsService } from '../services/analytics.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import {
  ProductItemByLocationAnalytics,
  ProductOutOfStockAnalytics,
  WorksheetByAuthorAnalytics,
  WorksheetByCustomerAnalytics
} from '../../../models/analytics.model';
import { CustomerModel } from '../../../models/customer.model';
import { addDaysToDate } from '../../../utils/utils';
import { serializeDate } from '../../../utils/serializers/date';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss'],
  providers: [DatePipe],
})
export class DashboardsComponent implements OnInit, OnDestroy {
  private _subscriptions: Subscription[] = [];
  private _customers: CustomerModel[] = [];
  private _worksheetsByCustomer: WorksheetByCustomerAnalytics[] = [];
  productsOutOfStock?: ChartData<'pie'>
  productItemsByLocation?: ChartData<'pie'>
  worksheetsByAuthor?: ChartData<'pie'>
  worksheetsByCustomer?: ChartData<'line'>
  worksheetCustomersFilterControl: FormControl;
  worksheetsStartDateFilterControl: FormControl;
  worksheetsEndDateFilterControl: FormControl;
  worksheetsEndDateFilterMin: string;

  constructor(private analyticsService: AnalyticsService, private datePipe: DatePipe,
              private fb: FormBuilder) {

    //form controls init
    this.worksheetCustomersFilterControl = this.fb.control(null);

    const past3Months = addDaysToDate(new Date(), -90);
    this.worksheetsStartDateFilterControl = this.fb.control(past3Months.toISOString().slice(0, 10))
    this.worksheetsEndDateFilterControl = this.fb.control(new Date().toISOString().slice(0, 10))
    this.worksheetsEndDateFilterMin = past3Months.toISOString().slice(0, 10);

    //request data
    this.loadAnalyticsData();
    this.loadCustomers();
  }

  ngOnInit(): void {
    this.subSink = this.worksheetsStartDateFilterControl.valueChanges
      .subscribe((val) => {
        if (!val) {
          this.worksheetsEndDateFilterControl.patchValue(null);
        } else {
          this.worksheetsEndDateFilterMin = this.worksheetsEndDateFilterControl.value;

        }
      })
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
    const customersIds = !this.worksheetCustomersFilterControl.value ? undefined :
      (this.worksheetCustomersFilterControl.value as CustomerModel[]).map((customer) => customer.id);

    const startDate = serializeDate(this.worksheetsStartDateFilterControl.value);
    const endDate = serializeDate(this.worksheetsEndDateFilterControl.value);

    this.subSink = this.analyticsService.fetchWorksheetsByCustomer(startDate, endDate, customersIds)
      .subscribe({
        next: (model) => {
          this.worksheetsByCustomer = this.mapWorksheetsByCustomerData(model);
          this._worksheetsByCustomer = model;
        }
      })
  }

  private loadCustomers() {
    this.subSink = this.analyticsService.fetchCustomers()
      .subscribe({
        next: (model) => {
          this._customers = model;

          //set selected customers
          if (!this.worksheetCustomersFilterControl.value) {
            this.patchSelectedCustomers();
          }
        }
      })
  }

  mapProductsOutOfStockData(model: ProductOutOfStockAnalytics[]) {
    return {
      datasets: [
        {data: model.map((row) => row.total)}
      ],
      labels: model.map((row) => row.name)
    }
  }

  mapProductItemsByLocationData(model: ProductItemByLocationAnalytics[]): ChartData<'pie'> {
    return {
      datasets: [
        {data: model.map((row) => row.total)}
      ],
      labels: model.map((row) => row.location)
    }
  }

  mapWorksheetsByAuthorData(model: WorksheetByAuthorAnalytics[]): ChartData<'pie'> {
    return {
      datasets: [
        {data: model.map((row) => row.total)}
      ],
      labels: model.map((row) => row.name)
    }
  }

  mapWorksheetsByCustomerData(model: WorksheetByCustomerAnalytics[]): ChartData<'line'> {
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


    (Object.keys(selectedUniqueCustomerIds) as string[])
      .map((id) => {
        const customerObj = this._customers.find((cust) => cust.id === +id);
        if (customerObj) {
          if (!this.worksheetCustomersFilterControl.value) {
            this.worksheetCustomersFilterControl.patchValue([customerObj]);
          } else {
            this.worksheetCustomersFilterControl.patchValue([...this.worksheetCustomersFilterControl.value, customerObj]);

          }
        }
      });
  }

  submitWorksheetDataFilters() {
    this.loadUsersCustomerVisits();
  }

  ngOnDestroy(): void {
    this._subscriptions.map((s) => s.unsubscribe())
  }
}

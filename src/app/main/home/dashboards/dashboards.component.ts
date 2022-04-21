import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChartData, ChartOptions } from 'chart.js';
import { AnalyticsService } from '../services/analytics.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import {
  ProductItemByLocationAnalytics,
  ProductOutOfStockAnalytics,
  WorksheetByCustomerAnalytics
} from '../../../models/analytics.model';
import { CustomerModel } from '../../../models/customer.model';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss'],
  providers: [DatePipe]
})
export class DashboardsComponent implements OnInit, OnDestroy {
  private _subscriptions: Subscription[] = [];
  private _productsOutOfStock: ProductOutOfStockAnalytics[] = [];
  private _productItemsByLocation: ProductItemByLocationAnalytics[] = [];
  private _worksheetsByCustomer: WorksheetByCustomerAnalytics[] = [];
  private _customers: CustomerModel[] = [];
  customersControl: FormControl;

  constructor(private analyticsService: AnalyticsService, private datePipe: DatePipe,
              private fb: FormBuilder) {
    this.loadAnalyticsData();
    this.loadCustomers();
    this.customersControl = this.fb.control(null);
  }

  ngOnInit(): void {
  }

  set subSink(value: Subscription) {
    this._subscriptions.push(value);
  }

  get pieChartOptions(): ChartOptions<'pie'> {
    return {
      responsive: true,
      aspectRatio: 2,
      plugins: {
        legend: {position: 'bottom'}
      }
    }
  }

  get lineChartOptions(): ChartOptions<'line'> {
    return {
      responsive: true,
      aspectRatio: 3,
      elements: {
        line: {
          tension: 0.4
        },
      },
      scales: {
        y: {min: 0, ticks: {stepSize: 1}},
      },

      plugins: {
        legend: {position: 'bottom'}
      }
    }
  }

  get productsOutOfStock(): ChartData<'pie'> {
    return {
      datasets: [
        {data: this._productsOutOfStock.map((row) => row.total)}
      ],
      labels: this._productsOutOfStock.map((row) => row.name)
    }
  }

  get productItemsByLocation(): ChartData<'pie'> {
    return {
      datasets: [
        {data: this._productItemsByLocation.map((row) => row.total)}
      ],
      labels: this._productItemsByLocation.map((row) => row.location)
    }
  }

  get worksheetsByCustomer(): ChartData<'line'> {
    const uniqueLabels: { [ key: string ]: string } = this._worksheetsByCustomer
      .reduce((acc, row) => {
        const createdAt: string = this.datePipe.transform(row.created_at)!;
        acc[ createdAt ] = row.created_at;
        return acc;
      }, {} as { [ key: string ]: string });

    const labels = Object.keys(uniqueLabels)

    return {
      datasets: this._worksheetsByCustomer.reduce((acc, row, index) => {
        const obj = acc.find((dataset) => dataset.id === row.customer_id);
        if (obj) {
          obj.data[ index ] = row.total
        } else {
          const data = new Array(labels.length).fill(0);
          data[ index ] = row.total;
          acc.push({
            id: row.customer_id,
            label: row.name,
            data
          })
        }

        return acc;
      }, [] as { id: number, label: string, data: number[] }[]),
      labels
    }
  }

   customers() {return this._customers}

  loadAnalyticsData() {
    //out of stock
    this.subSink = this.analyticsService.fetchProductsOutOfStock()
      .subscribe({
        next: (model) => this._productsOutOfStock = model
      });

    //items by location
    this.subSink = this.analyticsService.fetchProductItemsByLocation()
      .subscribe({
        next: (model) => this._productItemsByLocation = model
      });

    //worksheets by customer
    this.subSink = this.analyticsService.fetchWorksheetsByCustomer()
      .subscribe({
        next: (model) => this._worksheetsByCustomer = model
      })
  }

  private loadCustomers() {
    this.subSink = this.analyticsService.fetchCustomers()
      .subscribe({
        next: (model) => this._customers = model
      })
  }

  ngOnDestroy(): void {
    this._subscriptions.map((s) => s.unsubscribe())
  }

}

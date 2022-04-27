import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http.service';
import {
  ProductItemByLocationAnalytics,
  ProductOutOfStockAnalytics,
  WorksheetByAuthorAnalytics,
  WorksheetByCustomerAnalytics
} from '../../../models/analytics.model';
import { HomeModule } from '../home.module';
import { CustomerModel } from '../../../models/customer.model';

@Injectable({
  providedIn: HomeModule
})
export class AnalyticsService {

  constructor(private httpService: HttpService) {

  }

  fetchProductItemsByLocation(): Observable<ProductItemByLocationAnalytics[]> {
    return this.httpService.get(this.httpService.endpoint.productItemsCountByLocation)
      .pipe(map((res: { data: ProductItemByLocationAnalytics[] }) => res.data))
  }

  fetchProductsOutOfStock(): Observable<ProductOutOfStockAnalytics[]> {
    return this.httpService.get(this.httpService.endpoint.productsOutOfStockCount)
      .pipe(map((res: { data: ProductOutOfStockAnalytics[] }) => res.data))
  }

  fetchWorksheetsByCustomer(query:object): Observable<WorksheetByCustomerAnalytics[]> {
    return this.httpService
      .get(this.httpService.endpoint.worksheetsCountByCustomer, {params: {...query}})
      .pipe(map((res: { data: WorksheetByCustomerAnalytics[] }) => res.data))
  }


  fetchWorksheetsByAuthor():Observable<WorksheetByAuthorAnalytics[]> {
    return this.httpService.get(this.httpService.endpoint.worksheetsCountByAuthor)
      .pipe(map((res: { data: WorksheetByAuthorAnalytics[] }) => res.data))
  }


  fetchCustomers(): Observable<CustomerModel[]> {
    return this.httpService
      .get(this.httpService.endpoint.customers, {params: {limit: 300}})
      .pipe(map((res) => res.data));
  }
}

import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { WorksheetsModule } from '../worksheets.module';
import { HttpService } from '../../../core/services/http.service';
import { ProductItemModel } from '../../../models/product-item.model';
import { WorksheetModel } from '../../../models/worksheet.model';
import { ProductCategoryModel } from '../../../models/product-category.model';
import { HttpResponseModel } from '../../../models/response.model';
import { CustomerModel } from '../../../models/customer.model';

@Injectable({
  providedIn: WorksheetsModule
})
export class WorksheetService {

  constructor(private httpService: HttpService) { }

  fetch(query: object): Observable<HttpResponseModel<WorksheetModel>> {
    let params = {...query, include: 'createdBy,customer'}

    return this.httpService.get(this.httpService.endpoint.worksheets, {params: params})
  }

  create(payload: object): Observable<WorksheetModel> {
    return this.httpService.post(this.httpService.endpoint.worksheets, payload)
      .pipe(map((res: { data: WorksheetModel }) => res.data))
  }


  fetchById(id: string | number): Observable<WorksheetModel> {
    return this.httpService.get(`${this.httpService.endpoint.worksheets}/${id}`,
      {
        params: {
          include: 'createdBy,customer,entries.remark,entries.repair.products,' +
            'entries.warrant,entries.contract,entries.productItem.product'
        }
      })
      .pipe(map((res: { data: WorksheetModel }) => res.data))
  }

  fetchCustomerMachines(client_id: number): Observable<ProductItemModel[]> {
    return this.httpService.get(this.httpService.endpoint.productItems,
      {params: {customer_id: client_id}})
      .pipe(map((val: { data: ProductItemModel[] }) => val.data))
  }

  get fetchAllProductCategories(): Observable<ProductCategoryModel[]> {
    return this.httpService.get(this.httpService.endpoint.productCategories)
      .pipe(map((res: { data: ProductCategoryModel[] }) => res.data));
  }

  fetchCustomers(params: {}): Observable<HttpResponseModel<CustomerModel>> {
    return this.httpService
      .get(this.httpService.endpoint.customers, {params: params});
  }
}

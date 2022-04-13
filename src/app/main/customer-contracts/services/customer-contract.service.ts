import { Injectable } from '@angular/core';
import { CustomerContractsModule } from '../customer-contracts.module';
import { HttpService } from '../../../core/services/http.service';
import { PaginationModel } from '../../../models/pagination.model';
import { HttpResponseModel } from '../../../models/response.model';
import {
  ContractProductItemModel,
  CustomerContractModel
} from '../../../models/customer-contract.model';
import { map, Observable } from 'rxjs';
import { ProductItemModel } from '../../../models/product-item.model';

@Injectable({
  providedIn: CustomerContractsModule
})
export class CustomerContractService {

  constructor(private httpService: HttpService) { }

  fetch(meta: PaginationModel): Observable<HttpResponseModel<CustomerContractModel>> {
    const params = {...meta, include: 'customer'};
    return this.httpService.get(this.httpService.endpoint.customerContracts, {params})
  }

  create(payload: object): Observable<CustomerContractModel> {
    return this.httpService.post(this.httpService.endpoint.customerContracts, payload)
      .pipe(map((res: { data: CustomerContractModel }) => res.data));
  }

  update(id: number | string, payload: object): Observable<CustomerContractModel> {
    return this.httpService.patch(`${this.httpService.endpoint.customerContracts}/${id}`, payload)
      .pipe(map((res: { data: CustomerContractModel }) => res.data));

  }

  fetchById(id: number): Observable<CustomerContractModel> {
    return this.httpService.get(`${this.httpService.endpoint.customerContracts}/${id}`,
      {params: {include: 'customer,createdBy,productItems.product'}})
      .pipe(map((res: { data: CustomerContractModel }) => res.data));
  }

  fetchCustomerProductItems(customerId: number, meta: PaginationModel):
    Observable<HttpResponseModel<ProductItemModel>> {
    const url = this.httpService.endpoint.customerProductItems
      .replace(/:id/g, customerId.toString());

    const params = {
      include: 'latestActiveContracts,product,latestActivity.location',
      includeChildrenItems: true, ...meta
    }
    return this.httpService.get(url, {params})
  }

  fetchContractProductItems(contractId: number, params: object):
    Observable<HttpResponseModel<ContractProductItemModel>> {

    const url = this.httpService.endpoint.customerContractProductItems
      .replace(/:id/g, contractId.toString());

    return this.httpService.get(url, {params: {...params}})

  }

}

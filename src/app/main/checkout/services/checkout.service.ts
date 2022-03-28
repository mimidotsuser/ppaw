import { Injectable } from '@angular/core';
import { CheckoutModule } from '../checkout.module';
import { map, Observable } from 'rxjs';
import { MRFModel } from '../../../models/m-r-f.model';
import { HttpService } from '../../../core/services/http.service';
import { PaginationModel } from '../../../models/pagination.model';
import { HttpResponseModel } from '../../../models/response.model';
import { WarehouseModel } from '../../../models/warehouse.model';
import { ProductBalanceModel } from '../../../models/product-balance.model';

@Injectable({
  providedIn: CheckoutModule
})
export class CheckoutService {

  constructor(private httpService: HttpService) {}

  fetch(meta: PaginationModel): Observable<HttpResponseModel<MRFModel>> {
    return this.httpService.get(this.httpService.endpoint.materialRequestsPendingIssue,
      {params: {...meta, include: 'latestActivity'}});
  }

  findRequestById(requestId: number): Observable<MRFModel> {
    const url = this.httpService.endpoint.materialRequestIssue
      .replace(/:id/g, requestId.toString());

    return this.httpService.get(url, {params: {include: 'items,activities'}})
      .pipe(map((res: { data: MRFModel }) => res.data))
  }

  get fetchAllWarehouses(): Observable<WarehouseModel[]> {
    return this.httpService.get(this.httpService.endpoint.warehouses)
      .pipe(map((res: { data: WarehouseModel[] }) => res.data));
  }

  fetchMeldedBalances(id: number): Observable<ProductBalanceModel[]> {
    const url = this.httpService.endpoint.meldedBalances
      .replace(/:id/g, id.toString());

    return this.httpService.get(url)
      .pipe(map((res: { data: ProductBalanceModel[] }) => res.data));

  }

  create(id: number, payload: object): Observable<MRFModel> {
    const url = this.httpService.endpoint.materialRequestIssue
      .replace(/:id/g, id.toString());

    return this.httpService.post(url, payload)
      .pipe(map((res: { data: MRFModel }) => res.data));
  }
}

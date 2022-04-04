import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PurchaseOrderModule } from '../purchase-order.module';
import { HttpService } from '../../../core/services/http.service';
import { RFQModel } from '../../../models/r-f-q.model';
import { CurrencyModel } from '../../../models/currency.model';
import { PurchaseOrderModel } from '../../../models/purchase-order.model';
import { PaginationModel } from '../../../models/pagination.model';
import { HttpResponseModel } from '../../../models/response.model';
import { UOMModel } from '../../../models/u-o-m.model';

@Injectable({
  providedIn: PurchaseOrderModule
})
export class PurchaseOrderService {

  constructor(private httpService: HttpService) { }

  fetch(meta: PaginationModel, params = {}): Observable<HttpResponseModel<PurchaseOrderModel>> {
    params = {...meta, ...params}
    return this.httpService
      .get(this.httpService.endpoint.purchaseOrders, {params});
  }

  findRFQById(id: number | string, params: {} = {}): Observable<RFQModel> {
    params = {include: 'items', ...params}
    return this.httpService.get(`${this.httpService.endpoint.rfqs}/${id}`, {params})
      .pipe(map((res: { data: RFQModel }) => res.data))
  }


  fetchCurrencies(): Observable<CurrencyModel[]> {
    return this.httpService.get(this.httpService.endpoint.currencies)
      .pipe(map((res: { data: CurrencyModel[] }) => res.data))
  }

  get fetchUnitOfMeasure(): Observable<UOMModel[]> {
    return this.httpService.get(this.httpService.endpoint.unitOfMeasure)
      .pipe(map((res: { data: UOMModel[] }) => res.data));
  }

  create(payload: object) {
    return this.httpService.post(this.httpService.endpoint.purchaseOrders, payload)
      .pipe(map((res: { data: PurchaseOrderModel }) => res.data));
  }
}

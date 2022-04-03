import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RfqModule } from '../rfq.module';
import { PurchaseRequestModel } from '../../../models/purchase-request.model';
import { HttpService } from '../../../core/services/http.service';
import { RFQModel } from '../../../models/r-f-q.model';
import { UOMModel } from '../../../models/u-o-m.model';
import { PaginationModel } from '../../../models/pagination.model';
import { HttpResponseModel } from '../../../models/response.model';

@Injectable({
  providedIn: RfqModule
})
export class RqfService {

  constructor(private httpService: HttpService) { }

  fetch(meta: PaginationModel, params: {} = {}): Observable<HttpResponseModel<RFQModel>> {
    params = {...meta, ...params};
    return this.httpService.get(this.httpService.endpoint.rfqs, {params})
  }

  findPurchaseRequestById(id: number | string, params: {} = {}): Observable<PurchaseRequestModel> {
    params = {include: 'items.product.balance', ...params}
    return this.httpService
      .get(`${this.httpService.endpoint.purchaseRequests}/${id}`, {params})
      .pipe(map((res: { data: PurchaseRequestModel }) => res.data))
  }

  get fetchUnitOfMeasure(): Observable<UOMModel[]> {
    return this.httpService.get(this.httpService.endpoint.unitOfMeasure)
      .pipe(map((res: { data: UOMModel[] }) => res.data));
  }

  create(payload: object): Observable<PurchaseRequestModel> {
    return this.httpService.post(this.httpService.endpoint.rfqs, payload)
      .pipe(map((res: { data: PurchaseRequestModel }) => res.data));
  }
}

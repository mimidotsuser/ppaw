import { Injectable } from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';
import { PurchaseOrderModule } from '../purchase-order.module';
import { HttpService } from '../../../core/services/http.service';
import { RFQModel } from '../../../models/r-f-q.model';
import { CurrencyModel } from '../../../models/currency.model';
import { PurchaseOrderModel } from '../../../models/purchase-order.model';
import { PaginationModel } from '../../../models/pagination.model';
import { HttpResponseModel } from '../../../models/response.model';
import { UOMModel } from '../../../models/u-o-m.model';
import { DownloadService } from '../../../core/services/download.service';

@Injectable({
  providedIn: PurchaseOrderModule
})
export class PurchaseOrderService {

  constructor(private httpService: HttpService, private downloadService: DownloadService) { }

  fetch(meta: PaginationModel, params = {}): Observable<HttpResponseModel<PurchaseOrderModel>> {
    params = {...meta, ...params}
    return this.httpService
      .get(this.httpService.endpoint.purchaseOrders, {params});
  }

  findById(id: string | number): Observable<PurchaseOrderModel> {
    const params = {include: 'items,createdBy'}
    return this.httpService
      .get(`${this.httpService.endpoint.purchaseOrders}/${id}`, {params})
      .pipe(map((res: { data: PurchaseOrderModel }) => res.data));
  }

  create(payload: object) {
    return this.httpService.post(this.httpService.endpoint.purchaseOrders, payload)
      .pipe(map((res: { data: PurchaseOrderModel }) => res.data));
  }

  download(request: PurchaseOrderModel): Subscription {
    const path = this.httpService.endpoint.purchaseOrderDownload
      .replace(/:id/g, request.id.toString());
    return this.downloadService.queue({path, filename: `po-${request.sn}.pdf`})
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

}

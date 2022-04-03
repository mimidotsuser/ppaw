import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { LpoModule } from '../lpo.module';
import { HttpService } from '../../../core/services/http.service';
import { RFQModel } from '../../../models/r-f-q.model';
import { CurrencyModel } from '../../../models/currency.model';
import { PurchaseOrderModel } from '../../../models/purchase-order.model';

@Injectable({
  providedIn: LpoModule
})
export class PurchaseOrderService {

  constructor(private http: HttpService) { }

  fetchAll(): Observable<PurchaseOrderModel[]> {
    return this.http.get('/purchase-orders')
      .pipe(map((res: { data: PurchaseOrderModel[] }) => res.data));
  }

  findRFQByInd(id: string): Observable<RFQModel> {
    return this.http.get(`/rfqs/${id}`)
  }

  fetchCurrencies(): Observable<CurrencyModel[]> {
    return this.http.get('/currencies')
      .pipe(map((res: { data: CurrencyModel[] }) => res.data))
  }
}

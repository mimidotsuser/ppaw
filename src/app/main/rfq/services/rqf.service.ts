import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map, mergeMap, Observable } from 'rxjs';
import { RfqModule } from '../rfq.module';
import { PurchaseRequestModel } from '../../../models/purchase-request.model';
import { ProductBalanceModel } from '../../../models/product-balance.model';
import { HttpService } from '../../../core/services/http.service';
import { RFQModel } from '../../../models/r-f-q.model';

@Injectable({
  providedIn: RfqModule
})
export class RqfService {

  constructor(private http: HttpService) { }

  fetchAll(): Observable<RFQModel[]> {
    return this.http.get('/rfqs')
      .pipe(map((res: { data: RFQModel[] }) => res.data))
  }

  findPRById(id: string): Observable<PurchaseRequestModel> {
    return this.http.get(`/purchase-requests/${id}`, {params: {_expand: 'created_by'}})
      .pipe(mergeMap((pr: PurchaseRequestModel) => {
        let params = new HttpParams();
        params = params.append('_expand', 'product');

        pr.items.map((v) => {
          params = params.append('product_id', v.product_id)
        });
        return this.http.get('/stock-balances?', {params})
          .pipe(map((rs: { data: ProductBalanceModel[] }) => rs.data))
          .pipe(map((m: ProductBalanceModel[]) => {
            return this.demoDataMap(pr, m);
          }))
      }));
  }

  demoDataMap(request: PurchaseRequestModel, balances: ProductBalanceModel[]): PurchaseRequestModel {
    request.items.map((item) => {
      const bal = balances.find((x) => x.product_id === item.product_id);
      if (bal) {
        item.product = bal.product;
        item.product.physical_balance = bal.physical_balance;
      }
    });
    return request;
  }
}

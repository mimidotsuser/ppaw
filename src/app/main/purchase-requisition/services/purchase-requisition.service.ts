import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { PurchaseRequisitionModule } from '../purchase-requisition.module';
import { HttpService } from '../../../core/services/http.service';
import { ProductBalanceModel } from '../../../models/product-balance.model';

@Injectable({
  providedIn: PurchaseRequisitionModule
})
export class PurchaseRequisitionService {

  constructor(private http: HttpService) { }

  /**
   * Fetch all product balances
   * @param page
   * @param limit
   */
  productBalances(page = 1, limit = 10): Observable<ProductBalanceModel[]> {
    return this.http.get('/stock-balances', {
      params: {_expand: 'product', _page: page, _limit: limit}
    })
      .pipe(map((res: { data: ProductBalanceModel[] }) => res.data))
      .pipe(shareReplay())
  }
}

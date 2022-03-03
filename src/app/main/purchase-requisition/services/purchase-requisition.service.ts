import { Injectable } from '@angular/core';
import { map, mergeMap, Observable, shareReplay } from 'rxjs';
import { PurchaseRequisitionModule } from '../purchase-requisition.module';
import { HttpService } from '../../../core/services/http.service';
import { ProductBalanceModel } from '../../../models/product-balance.model';
import { PurchaseRequestModel } from '../../../models/purchase-request.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: PurchaseRequisitionModule
})
export class PurchaseRequisitionService {

  constructor(private http: HttpService) { }

  formatRequestId(requestId: number): string {
    return `REQUEST-${String(requestId).padStart(4, '0')}`
  }

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

  fetchMyRequests({page, perPage} = {page: 1, perPage: 10}): Observable<PurchaseRequestModel[]> {
    return this.http.get('/purchase-requests', {
      params: {_expand: 'created_by', _page: page, _limit: perPage}
    }).pipe(map((res: { data: PurchaseRequestModel[] }) => res.data))
  }

  fetchPendingVerification({page, perPage} = {
    page: 1,
    perPage: 10
  }): Observable<PurchaseRequestModel[]> {
    return this.http.get('/purchase-requests', {
      params: {_expand: 'created_by', _page: page, _limit: perPage}
    }).pipe(map((res: { data: PurchaseRequestModel[] }) => res.data))
  }

  findById(id: string): Observable<PurchaseRequestModel> {
    return this.http.get(`/purchase-requests/${id}`, {
      params: {_expand: 'created_by'}
    })
      .pipe(mergeMap((pr: PurchaseRequestModel) => {
        let params = new HttpParams();
        params = params.append('_expand', 'product');

        pr.items.map((v) => params = params.append('product_id', v.product_id));

        return this.http.get('/stock-balances?', {params})
          .pipe(map((rs: { data: ProductBalanceModel[] }) => rs.data))
          .pipe(map((m: ProductBalanceModel[]) => {
            return this.demo(pr, m);
          }))
      }));
  }

  demo(request: PurchaseRequestModel, balances: ProductBalanceModel[]): PurchaseRequestModel {
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

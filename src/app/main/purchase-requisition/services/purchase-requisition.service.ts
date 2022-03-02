import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PurchaseRequisitionModule } from '../purchase-requisition.module';
import { HttpService } from '../../../core/services/http.service';
import { ProductBalanceModel } from '../../../models/product-balance.model';

@Injectable({
  providedIn: PurchaseRequisitionModule
})
export class PurchaseRequisitionService {

  constructor(private http: HttpService) { }

  get productBalances(): Observable<ProductBalanceModel[]> {
    return this.http.get('/stock-balances', {params: {_expand: 'product'}})
      .pipe(map((res: { data: ProductBalanceModel[] }) => res.data))
  }
}

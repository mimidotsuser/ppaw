import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { ProductBalanceModel } from '../../../models/product-balance.model';
import { HttpService } from '../../../core/services/http.service';
import { MainModule } from '../../main.module';

@Injectable({
  providedIn: MainModule
})
export class StockLedgerService {

  constructor(private http: HttpService) { }

  fetchAll(obj?: { perPage: number, page: number }): Observable<ProductBalanceModel[]> {
    return this.http.get('/stock-balances', {
      params: {_expand: 'product', _page: obj?.page || 1, _limit: obj?.perPage || 10}
    })
      .pipe(map((res: { data: ProductBalanceModel[] }) => res.data))
      .pipe(shareReplay())
  }
}

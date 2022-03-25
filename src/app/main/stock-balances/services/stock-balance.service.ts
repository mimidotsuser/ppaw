import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { ProductBalanceModel, StockAdjustmentModel } from '../../../models/product-balance.model';
import { HttpService } from '../../../core/services/http.service';
import { StockBalancesModule } from '../stock-balances.module';
import { PaginationModel } from '../../../models/pagination.model';
import { HttpResponseModel } from '../../../models/response.model';

@Injectable({
  providedIn: StockBalancesModule
})
export class StockBalanceService {

  constructor(private httpService: HttpService) { }

  fetchAll(pagination: PaginationModel): Observable<HttpResponseModel<ProductBalanceModel>> {
    return this.httpService.get(this.httpService.endpoint.stockBalances, {
      params: {include: 'product', ...pagination}
    }).pipe(shareReplay())
  }

  update(id: number, model: StockAdjustmentModel): Observable<ProductBalanceModel> {
    return this.httpService
      .patch(`${this.httpService.endpoint.stockBalances}/${id}`, model)
      .pipe(map((res: { data: ProductBalanceModel }) => res.data))
  }
}


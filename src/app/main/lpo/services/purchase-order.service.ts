import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { LpoModule } from '../lpo.module';
import { HttpService } from '../../../core/services/http.service';
import { RFQModel } from '../../../models/r-f-q.model';
import { CurrencyModel } from '../../../models/currency.model';

@Injectable({
  providedIn: LpoModule
})
export class PurchaseOrderService {

  constructor(private http: HttpService) { }

  findRFQByInd(id: string): Observable<RFQModel> {
    return this.http.get(`/rfqs/${id}`)
  }

  fetchCurrencies(): Observable<CurrencyModel[]> {
    return this.http.get('/currencies')
      .pipe(map((res: { data: CurrencyModel[] }) => res.data))
  }
}

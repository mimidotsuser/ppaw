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
  }

}

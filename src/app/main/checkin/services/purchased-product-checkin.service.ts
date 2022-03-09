import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http.service';
import { PPCIModel } from '../../../models/p-p-c-i.model';
import { map, Observable } from 'rxjs';
import { CheckinModule } from '../checkin.module';

@Injectable({
  providedIn: CheckinModule
})
export class PurchasedProductCheckinService {

  constructor(private http: HttpService) { }

  findPPCheckinByPO(purchaseOrderId: string): Observable<PPCIModel[]> {
    return this.http.get('/purchased-products', {params: {po_id: purchaseOrderId}})
      .pipe(map((v: { data: PPCIModel[] }) => v.data))
  }
}

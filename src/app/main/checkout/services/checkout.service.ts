import { Injectable } from '@angular/core';
import { CheckoutModule } from '../checkout.module';
import { BehaviorSubject, map, mergeMap, Observable, take } from 'rxjs';
import { MRFLog, MRFModel, MRFPurpose, MRFStage } from '../../../models/m-r-f.model';
import { HttpService } from '../../../core/services/http.service';

@Injectable({
  providedIn: CheckoutModule
})
export class CheckoutService {

  private myRequests$ = new BehaviorSubject<MRFModel[]>([]);

  constructor(private http: HttpService) {

  }

  get requestsPendingCheckout(): Observable<MRFModel[]> {
    return this.myRequests$;
  }

  formatOrderId(order: number): string {
    return `REQUEST-${String(order).padStart(4, '0')}`
  }

  findRequestById(id: string) {
    return this.myRequests$
      .pipe(map((v) => v.filter((x) => x.id == id)))
      .pipe(mergeMap((v) => v))
      .pipe(take(1));
  }
}

import { Injectable } from '@angular/core';
import { CheckoutModule } from '../checkout.module';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { MRFModel } from '../../../models/m-r-f.model';
import { HttpService } from '../../../core/services/http.service';

@Injectable({
  providedIn: CheckoutModule
})
export class CheckoutService {

  private myRequests$ = new BehaviorSubject<MRFModel[]>([]);

  constructor(private httpService: HttpService) {

  }

  get requestsPendingCheckout(): Observable<MRFModel[]> {
    return this.myRequests$;
  }


  findRequestById(requestId: number): Observable<MRFModel> {
    const url = this.httpService.endpoint.materialRequestIssue
      .replace(/:id/g, requestId.toString());

    return this.httpService
      .get(url)
      .pipe(map((res: { data: MRFModel }) => res.data))
  }
}

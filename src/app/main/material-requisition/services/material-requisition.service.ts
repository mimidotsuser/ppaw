import { Injectable } from '@angular/core';
import { BehaviorSubject, map, mergeMap, Observable, take } from 'rxjs';
import { MaterialRequisitionModule } from '../material-requisition.module';
import { HttpService } from '../../../core/services/http.service';
import {
  MRFLog,
  MRFModel,
  MRFOrderItemModel,
  MRFPurpose,
  MRFStage
} from '../../../models/m-r-f.model';

@Injectable({
  providedIn: MaterialRequisitionModule
})
export class MaterialRequisitionService {

  private myRequests$ = new BehaviorSubject<MRFModel[]>([]);

  constructor(private http: HttpService) {
  }

  formatOrderId(order: number): string {
    return `REQUEST-${String(order).padStart(4, '0')}`
  }

  aggregateQty(items: MRFOrderItemModel[]): {
    verified: number, approved: number,
    issued: number, requested: number
  } {
    return items.reduce((acc, val) => {
      acc.issued += !val.qty_issued ? -1 : val.qty_issued;
      acc.verified += !val.qty_verified ? -1 : val.qty_verified;
      acc.approved += !val.qty_approved ? -1 : val.qty_approved;
      acc.requested += val.qty_requested || 0;
      return acc;
    }, {verified: 0, approved: 0, issued: 0, requested: 0});
  }

  get myRequests(): Observable<MRFModel[]> {
    return this.myRequests$;
  }

  get requestsToVerify(): Observable<MRFModel[]> {
    return this.myRequests$;
  }

  get requestsToApprove(): Observable<MRFModel[]> {
    return this.myRequests$;
  }

  findById(id: string): Observable<MRFModel> {
    return this.myRequests$
      .pipe(map((v) => v.filter((x) => x.id == id)))
      .pipe(mergeMap((v) => v))
      .pipe(take(1))
  }
}

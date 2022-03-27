import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { MaterialRequisitionModule } from '../material-requisition.module';
import { HttpService } from '../../../core/services/http.service';
import { MRFItemModel, MRFModel } from '../../../models/m-r-f.model';
import { PaginationModel } from '../../../models/pagination.model';
import { HttpResponseModel } from '../../../models/response.model';

@Injectable({
  providedIn: MaterialRequisitionModule
})
export class MaterialRequisitionService {

  private myRequests$ = new BehaviorSubject<MRFModel[]>([]);

  constructor(private http: HttpService) {
  }


  aggregateQty(items: MRFItemModel[]) {
    return items.reduce((acc, val) => {
      acc.issued += !val.issued_qty ? -1 : val.issued_qty;
      acc.verified += !val.verified_qty ? -1 : val.verified_qty;
      acc.approved += !val.approved_qty ? -1 : val.approved_qty;
      acc.requested += val.requested_qty || 0;
      return acc;
    }, {verified: 0, approved: 0, issued: 0, requested: 0}) as
      { verified: number, approved: number, issued: number, requested: number };
  }

  fetch(meta: PaginationModel): Observable<HttpResponseModel<MRFModel>> {
    const params = {...meta, include: 'items,activities,latestActivity'}
    return this.http.get(this.http.endpoint.materialRequests, {params});
  }

  requestsPendingVerification(meta: PaginationModel): Observable<HttpResponseModel<MRFModel>> {
    return this.http.get(this.http.endpoint.materialRequestsPendingVerification);
  }

  requestsPendingApproval(meta: PaginationModel): Observable<HttpResponseModel<MRFModel>> {
    return this.http.get(this.http.endpoint.materialRequestsPendingApproval);
  }

  findById(id: string): Observable<MRFModel> {
    return this.http.get(`${this.http.endpoint.materialRequests}/${id}`)
      .pipe(map((res: { data: MRFModel }) => res.data))
  }
}

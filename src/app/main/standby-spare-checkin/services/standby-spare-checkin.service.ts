import { Injectable } from '@angular/core';
import { PaginationModel } from '../../../models/pagination.model';
import { HttpService } from '../../../core/services/http.service';
import { map, Observable } from 'rxjs';
import { HttpResponseModel } from '../../../models/response.model';
import { StandbySpareCheckinModel } from '../../../models/standby-spare-checkin.model';
import { MRFModel } from '../../../models/m-r-f.model';

@Injectable({
  providedIn: 'root'
})
export class StandbySpareCheckinService {

  constructor(private httpService: HttpService) { }

  fetch(meta: PaginationModel): Observable<HttpResponseModel<StandbySpareCheckinModel>> {
    return this.httpService.get(this.httpService.endpoint.standbySpareCheckin,
      {params: {include: 'event,product,createdBy', ...meta}})
  }

  fetchMaterialRequest(id: number): Observable<MRFModel> {
    return this.httpService.get(`${this.httpService.endpoint.materialRequests}/${id}`,
      {params: {include: 'event,items.product.variants,balanceActivities'}})
      .pipe(map((res: { data: MRFModel }) => res.data));
  }

  create(payload: object): Observable<StandbySpareCheckinModel[]> {
    return this.httpService.post(this.httpService.endpoint.standbySpareCheckin, payload)
      .pipe(map((res: { data: StandbySpareCheckinModel[] }) => res.data));
  }
}

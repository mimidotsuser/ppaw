import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http.service';
import { GoodsReceiptNoteModel } from '../../../models/goods-receipt-note.model';
import { InspectionNoteModule } from '../inspection-note.module';
import { PaginationModel } from '../../../models/pagination.model';
import { HttpResponseModel } from '../../../models/response.model';
import { InspectionModel } from '../../../models/inspection.model';

@Injectable({
  providedIn: InspectionNoteModule
})
export class InspectionNoteService {

  constructor(private httpService: HttpService) { }

  fetchRequests(meta: PaginationModel): Observable<HttpResponseModel<GoodsReceiptNoteModel>> {
    return this.httpService.get(this.httpService.endpoint.goodsReceiptNoteRequestsPendingInspection,
      {params: {...meta, include: 'purchaseOrder,createdBy'}});
  }

  fetchRequest(id: string | number): Observable<GoodsReceiptNoteModel> {
    const url = this.httpService.endpoint.goodsReceiptNoteRequestPendingInspection
      .replace(':id', id.toString());

    return this.httpService.get(url,
      {params: {include: 'items.product,activities,purchaseOrder,createdBy'}})
      .pipe(map((res: { data: GoodsReceiptNoteModel }) => res.data));
  }

  create(payload: object): Observable<InspectionModel> {
    return this.httpService.post(this.httpService.endpoint.inspection, payload)
      .pipe(map((res: { data: InspectionModel }) => res.data));
  }
}

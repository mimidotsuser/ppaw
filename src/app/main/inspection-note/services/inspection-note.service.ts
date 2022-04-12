import { Injectable } from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';
import { HttpService } from '../../../core/services/http.service';
import { GoodsReceiptNoteModel } from '../../../models/goods-receipt-note.model';
import { InspectionNoteModule } from '../inspection-note.module';
import { PaginationModel } from '../../../models/pagination.model';
import { HttpResponseModel } from '../../../models/response.model';
import { InspectionModel } from '../../../models/inspection.model';
import { DownloadService } from '../../../core/services/download.service';

@Injectable({
  providedIn: InspectionNoteModule
})
export class InspectionNoteService {

  constructor(private httpService: HttpService, private downloadService: DownloadService) { }

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

  fetchHistory(meta: PaginationModel): Observable<HttpResponseModel<InspectionModel>> {

    const params = {
      include: 'createdBy,goodsReceiptNote.purchaseOrder,InspectionNote,items.product,' +
        'goodsReceiptNote.latestActivity',
      ...meta
    };
    return this.httpService.get(this.httpService.endpoint.inspection, {params});
  }

  download(request: InspectionModel): Subscription {
    const path = this.httpService.endpoint.inspectionNoteDownload
      .replace(/:id/g, request.id.toString());
    return this.downloadService.queue({path, filename: `inspection-node-${request.sn}.pdf`})
  }
}

import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http.service';
import { GoodsReceiptNoteModule } from '../goods-receipt-note.module';
import { map, Observable, Subscription } from 'rxjs';
import { WarehouseModel } from '../../../models/warehouse.model';
import { GoodsReceiptNoteModel } from '../../../models/goods-receipt-note.model';
import { PaginationModel } from '../../../models/pagination.model';
import { HttpResponseModel } from '../../../models/response.model';
import { InspectionModel } from '../../../models/inspection.model';
import { DownloadService } from '../../../core/services/download.service';

@Injectable({
  providedIn: GoodsReceiptNoteModule
})
export class GoodsReceiptNoteService {

  constructor(private httpService: HttpService, private downloadService: DownloadService) { }

  get fetchAllWarehouses(): Observable<WarehouseModel[]> {
    return this.httpService.get(this.httpService.endpoint.warehouses)
      .pipe(map((res: { data: WarehouseModel[] }) => res.data));
  }

  create(payload: object): Observable<GoodsReceiptNoteModel> {
    return this.httpService.post(this.httpService.endpoint.goodsReceiptNote, payload)
      .pipe(map((res: { data: GoodsReceiptNoteModel }) => res.data))
  }

  fetch(meta: PaginationModel, params?: any): Observable<HttpResponseModel<GoodsReceiptNoteModel>> {
    params = {hasRejectedItems: true, include: 'latestActivity,purchaseOrder,createdBy', ...params}
    return this.httpService.get(this.httpService.endpoint.goodsReceiptNote, {params});
  }

  fetchRequestsPendingApproval(meta: PaginationModel): Observable<HttpResponseModel<GoodsReceiptNoteModel>> {
    return this.httpService
      .get(this.httpService.endpoint.goodsReceiptNoteRequestsPendingApproval,
        {params: {...meta, include: 'latestActivity,createdBy,purchaseOrder'}})
  }

  fetchRequestPendingApproval(id: string | number): Observable<GoodsReceiptNoteModel & { inspection_note: InspectionModel }> {
    const url = this.httpService.endpoint.goodsReceiptNoteRequestPendingApproval
      .replace(':id', id.toString());

    const params = {include: 'createdBy,purchaseOrder,InspectionNote,items.product,activities'};
    return this.httpService.get(url, {params})
      .pipe(map((res: { data: GoodsReceiptNoteModel & { inspection_note: InspectionModel } }) => res.data));
  }


  createApproval(id: string | number, payload: object): Observable<GoodsReceiptNoteModel> {
    const url = this.httpService.endpoint.goodsReceiptNoteRequestPendingApproval
      .replace(':id', id.toString());

    return this.httpService.post(url, payload)
      .pipe(map((res: { data: GoodsReceiptNoteModel }) => res.data))
  }

  downloadGRN(request: GoodsReceiptNoteModel): Subscription {
    const path = this.httpService.endpoint.goodsReceiptNoteDownload
      .replace(/:id/g, request.id.toString());
    return this.downloadService.queue({path, filename: `g-r-n-${request.sn}.pdf`})
  }

  downloadRGA(request: GoodsReceiptNoteModel): Subscription {
    const path = this.httpService.endpoint.rejectedGoodsAdviceDownload
      .replace(/:id/g, request.id.toString());
    return this.downloadService.queue({path, filename: `r-g-a-${request.sn}.pdf`})
  }

  downloadInspectionNote(request: InspectionModel): Subscription {
    const path = this.httpService.endpoint.inspectionNoteDownload
      .replace(/:id/g, request.id.toString());
    return this.downloadService.queue({path, filename: `inspection-node-${request.sn}.pdf`})
  }
}

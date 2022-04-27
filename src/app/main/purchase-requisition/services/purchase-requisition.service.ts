import { Injectable } from '@angular/core';
import { PurchaseRequisitionModule } from '../purchase-requisition.module';
import { HttpService } from '../../../core/services/http.service';
import { PaginationModel } from '../../../models/pagination.model';
import { map, Observable, Subscription } from 'rxjs';
import { HttpResponseModel } from '../../../models/response.model';
import { ProductBalanceModel } from '../../../models/product-balance.model';
import {
  PRStage,
  PurchaseRequestActivityModel,
  PurchaseRequestModel
} from '../../../models/purchase-request.model';
import { WarehouseModel } from '../../../models/warehouse.model';
import { DownloadService } from '../../../core/services/download.service';

@Injectable({
  providedIn: PurchaseRequisitionModule
})
export class PurchaseRequisitionService {

  constructor(private httpService: HttpService, private downloadService: DownloadService) { }

  stage(log?: PurchaseRequestActivityModel): string {

    if (!log) {return '---'}

    if (log.stage === PRStage.REQUEST_CREATED) {
      return 'Verification Stage';
    }

    if (log.stage === PRStage.VERIFIED_REJECTED) {
      return 'Verification Stage';
    }
    if (log.stage === PRStage.VERIFIED_OKAYED) {
      return 'Approval Stage';
    }

    if (log.stage === PRStage.APPROVAL_REJECTED || log.stage === PRStage.APPROVAL_OKAYED) {
      return 'Complete'
    }

    return 'Unknown';
  }

  status(log?: PurchaseRequestActivityModel): string {

    if (!log) {return '---'}

    if (log.stage === PRStage.REQUEST_CREATED || log.stage === PRStage.VERIFIED_OKAYED) {
      return 'Pending';
    }
    if (log.stage === PRStage.VERIFIED_REJECTED || log.stage === PRStage.APPROVAL_REJECTED) {
      return 'Request Rejected'
    }

    if (log.stage === PRStage.APPROVAL_OKAYED) {
      return 'Complete'

    }
    return 'Unknown';
  }


  fetch(queries: object): Observable<HttpResponseModel<PurchaseRequestModel>> {
    return this.httpService.get(this.httpService.endpoint.purchaseRequests,
      {params: {...queries, include: 'latestActivity,activities,items'}})

  }

  create(payload: object): Observable<PurchaseRequestModel> {
    return this.httpService.post(this.httpService.endpoint.purchaseRequests, payload)
      .pipe(map((res: { data: PurchaseRequestModel }) => res.data))
  }

  fetchById(id: number | string): Observable<PurchaseRequestModel> {
    return this.httpService.get(`${this.httpService.endpoint.purchaseRequests}/${id}`,
      {params: {include: 'items,activities,items.product'}})
      .pipe(map((res: { data: PurchaseRequestModel }) => res.data))
  }

  fetchProductBalances(meta: PaginationModel): Observable<HttpResponseModel<ProductBalanceModel>> {
    const params = {
      exclude_variants: true,
      sort_by: 'out_of_stock',
      include: 'product',
      ...meta
    };
    return this.httpService.get(this.httpService.endpoint.stockBalances, {params})
  }

  get fetchAllWarehouses(): Observable<WarehouseModel[]> {
    return this.httpService.get(this.httpService.endpoint.warehouses)
      .pipe(map((res: { data: WarehouseModel[] }) => res.data));
  }

  /**
   * Verification
   * @param meta
   */
  fetchRequestsPendingVerification(meta: PaginationModel): Observable<HttpResponseModel<PurchaseRequestModel>> {
    return this.httpService.get(this.httpService.endpoint.purchaseRequestsPendingVerification,
      {params: {...meta, include: 'latestActivity'}});
  }

  fetchRequestPendingVerification(id: number): Observable<PurchaseRequestModel> {
    const url = this.httpService.endpoint.purchaseRequestVerification
      .replace(/:id/g, id.toString());

    return this.httpService
      .get(url, {params: {include: 'items,activities,items.product.balance'}})
      .pipe(map((res: { data: PurchaseRequestModel }) => res.data));

  }

  createVerificationRequest(id: number, payload: object): Observable<PurchaseRequestModel> {
    const url = this.httpService.endpoint.purchaseRequestVerification
      .replace(/:id/g, id.toString());

    return this.httpService
      .post(url, payload)
      .pipe(map((res: { data: PurchaseRequestModel }) => res.data));
  }


  /**
   * Approval
   * @param meta
   */
  fetchRequestsPendingApproval(meta: PaginationModel): Observable<HttpResponseModel<PurchaseRequestModel>> {
    return this.httpService.get(this.httpService.endpoint.purchaseRequestsPendingApproval,
      {params: {...meta, include: 'latestActivity'}});
  }

  fetchRequestPendingApproval(id: number): Observable<PurchaseRequestModel> {
    const url = this.httpService.endpoint.purchaseRequestApproval
      .replace(/:id/g, id.toString());

    return this.httpService
      .get(url, {params: {include: 'items,activities,items.product.balance'}})
      .pipe(map((res: { data: PurchaseRequestModel }) => res.data));

  }

  createApprovalRequest(id: number, payload: object): Observable<PurchaseRequestModel> {
    const url = this.httpService.endpoint.purchaseRequestApproval
      .replace(/:id/g, id.toString());

    return this.httpService
      .post(url, payload)
      .pipe(map((res: { data: PurchaseRequestModel }) => res.data));
  }

  download(request: PurchaseRequestModel): Subscription {
    const path = this.httpService.endpoint.purchaseRequestDownload
      .replace(/:id/g, request.id.toString());
    return this.downloadService.queue({path, filename: `pr-${request.sn}.pdf`})
  }
}

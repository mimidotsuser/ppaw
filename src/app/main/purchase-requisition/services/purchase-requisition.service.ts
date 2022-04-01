import { Injectable } from '@angular/core';
import { PurchaseRequisitionModule } from '../purchase-requisition.module';
import { HttpService } from '../../../core/services/http.service';
import { PaginationModel } from '../../../models/pagination.model';
import { map, Observable } from 'rxjs';
import { HttpResponseModel } from '../../../models/response.model';
import { ProductBalanceModel } from '../../../models/product-balance.model';
import {
  PRStage,
  PurchaseRequestActivityModel,
  PurchaseRequestModel
} from '../../../models/purchase-request.model';
import { WarehouseModel } from '../../../models/warehouse.model';

@Injectable({
  providedIn: PurchaseRequisitionModule
})
export class PurchaseRequisitionService {

  constructor(private httpService: HttpService) { }

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


  fetch(meta: PaginationModel): Observable<HttpResponseModel<PurchaseRequestModel>> {
    return this.httpService.get(this.httpService.endpoint.purchaseRequests,
      {params: {...meta,include:'latestActivity,createdBy,activities,items'}})

  }

  create(payload: object): Observable<PurchaseRequestModel> {
    return this.httpService.post(this.httpService.endpoint.purchaseRequests, payload)
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


}

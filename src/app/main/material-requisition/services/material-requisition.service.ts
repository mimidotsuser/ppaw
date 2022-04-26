import { Injectable } from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';
import { MaterialRequisitionModule } from '../material-requisition.module';
import { HttpService } from '../../../core/services/http.service';
import { MRFModel } from '../../../models/m-r-f.model';
import { PaginationModel } from '../../../models/pagination.model';
import { HttpResponseModel } from '../../../models/response.model';
import { ProductCategoryModel } from '../../../models/product-category.model';
import { WarehouseModel } from '../../../models/warehouse.model';
import { ProductModel } from '../../../models/product.model';
import { ProductBalanceModel } from '../../../models/product-balance.model';
import { DownloadService } from '../../../core/services/download.service';

@Injectable({
  providedIn: MaterialRequisitionModule
})
export class MaterialRequisitionService {


  constructor(private httpService: HttpService, private downloadService: DownloadService) {
  }

  fetch(queries: object): Observable<HttpResponseModel<MRFModel>> {
    const params = {...queries, include: 'items,activities,latestActivity'}
    return this.httpService.get(this.httpService.endpoint.materialRequests, {params});
  }

  fetchById(id: string): Observable<MRFModel> {
    return this.httpService.get(`${this.httpService.endpoint.materialRequests}/${id}`,
      {params: {include: 'items,activities'}})
      .pipe(map((res: { data: MRFModel }) => res.data))
  }

  create(payload: object): Observable<MRFModel> {
    return this.httpService.post(this.httpService.endpoint.materialRequests, payload)
      .pipe(map((res: { data: MRFModel }) => res.data))
  }

  fetchRequestsPendingVerification(meta: PaginationModel): Observable<HttpResponseModel<MRFModel>> {
    return this.httpService.get(this.httpService.endpoint.materialRequestsPendingVerification,
      {params: {...meta, include: 'latestActivity'}});
  }

  fetchRequestPendingVerification(id: number): Observable<MRFModel> {
    const url = this.httpService.endpoint.materialRequestVerification
      .replace(/:id/g, id.toString());
    return this.httpService
      .get(url, {params: {include: 'items,activities,items.worksheet'}})
      .pipe(map((res: { data: MRFModel }) => res.data));

  }

  createVerificationRequest(id: number, payload: object): Observable<MRFModel> {
    const url = this.httpService.endpoint.materialRequestVerification
      .replace(/:id/g, id.toString());
    return this.httpService
      .post(url, payload)
      .pipe(map((res: { data: MRFModel }) => res.data));
  }

  fetchRequestsPendingApproval(meta: PaginationModel): Observable<HttpResponseModel<MRFModel>> {
    return this.httpService.get(this.httpService.endpoint.materialRequestsPendingApproval,
      {params: {...meta, include: 'latestActivity'}});
  }

  fetchRequestPendingApproval(id: number): Observable<MRFModel> {
    const url = this.httpService.endpoint.materialRequestApproval
      .replace(/:id/g, id.toString());

    return this.httpService
      .get(url, {params: {include: 'items,activities,items.worksheet'}})
      .pipe(map((res: { data: MRFModel }) => res.data));
  }

  createApprovalRequest(id: number, payload: object): Observable<MRFModel> {
    const url = this.httpService.endpoint.materialRequestApproval
      .replace(/:id/g, id.toString());

    return this.httpService
      .post(url, payload)
      .pipe(map((res: { data: MRFModel }) => res.data));
  }


  get fetchAllProductCategories(): Observable<ProductCategoryModel[]> {
    return this.httpService.get(this.httpService.endpoint.productCategories)
      .pipe(map((res: { data: ProductCategoryModel[] }) => res.data));
  }

  get fetchAllWarehouses(): Observable<WarehouseModel[]> {
    return this.httpService.get(this.httpService.endpoint.warehouses)
      .pipe(map((res: { data: WarehouseModel[] }) => res.data));
  }

  fetchMaxAllowedRequestQty(product: ProductModel): Observable<number> {
    const url = this.httpService.endpoint.meldedBalances
      .replace(/:id/g, product.id.toString());

    return this.httpService.get(url)
      .pipe(map((res: { data: ProductBalanceModel[] }) => {
        return res.data.reduce((acc, row) => acc + row.virtual_balance, 0)
      }));

  }

  exportMRN(request: MRFModel): Subscription {
    const path = this.httpService.endpoint.MRNDownload
      .replace(/:id/, request.id.toString())

    return this.downloadService.queue({path: path, filename: `mrn-${request.sn}.pdf`})
  }

  exportSiv(request: MRFModel): Subscription {
    const path = this.httpService.endpoint.SIVDownload
      .replace(/:id/, request.id.toString())

    return this.downloadService.queue({path, filename: `siv-${request.sn}.pdf`})
  }
}

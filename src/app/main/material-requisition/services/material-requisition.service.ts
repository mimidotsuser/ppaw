import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { MaterialRequisitionModule } from '../material-requisition.module';
import { HttpService } from '../../../core/services/http.service';
import { MRFItemModel, MRFModel } from '../../../models/m-r-f.model';
import { PaginationModel } from '../../../models/pagination.model';
import { HttpResponseModel } from '../../../models/response.model';
import { ProductCategoryModel } from '../../../models/product-category.model';
import { WarehouseModel } from '../../../models/warehouse.model';
import { ProductModel } from '../../../models/product.model';
import { ProductBalanceModel } from '../../../models/product-balance.model';

@Injectable({
  providedIn: MaterialRequisitionModule
})
export class MaterialRequisitionService {


  constructor(private httpService: HttpService) {
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
    return this.httpService.get(this.httpService.endpoint.materialRequests, {params});
  }

  fetchRequestsPendingVerification(meta: PaginationModel): Observable<HttpResponseModel<MRFModel>> {
    return this.httpService
      .get(this.httpService.endpoint.materialRequestsPendingVerification, {params: {...meta}});
  }

  fetchRequestPendingVerification(id: number): Observable<MRFModel> {
    const url = this.httpService.endpoint.materialRequestVerification
      .replace(/:id/g, id.toString());
    return this.httpService
      .get(url, {params: {include: 'items,activities'}})
      .pipe(map((res: { data: MRFModel }) => res.data));

  }

  createVerificationRequest(id: number, payload: object): Observable<MRFModel> {
    const url = this.httpService.endpoint.materialRequestVerification
      .replace(/:id/g, id.toString());
    return this.httpService
      .post(url, payload)
      .pipe(map((res: { data: MRFModel }) => res.data));
  }

  requestsPendingApproval(meta: PaginationModel): Observable<HttpResponseModel<MRFModel>> {
    return this.httpService.get(this.httpService.endpoint.materialRequestsPendingApproval);
  }

  findById(id: string): Observable<MRFModel> {
    return this.httpService.get(`${this.httpService.endpoint.materialRequests}/${id}`)
      .pipe(map((res: { data: MRFModel }) => res.data))
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

  create(payload: object): Observable<MRFModel> {
    return this.httpService.post(this.httpService.endpoint.materialRequests, payload)
      .pipe(map((res: { data: MRFModel }) => res.data))
  }
}

import { Injectable } from '@angular/core';
import { ProductItemsModule } from '../product-items.module';
import { HttpService } from '../../../core/services/http.service';
import { PaginationModel } from '../../../models/pagination.model';
import { map, Observable } from 'rxjs';
import { HttpResponseModel } from '../../../models/response.model';
import { ProductItemActivityModel, ProductItemModel } from '../../../models/product-item.model';
import { ProductCategoryModel } from '../../../models/product-category.model';
import { WarehouseModel } from '../../../models/warehouse.model';

@Injectable({
  providedIn: ProductItemsModule
})
export class ProductItemService {

  constructor(private httpService: HttpService) { }

  fetch(pagination: PaginationModel): Observable<HttpResponseModel<ProductItemModel>> {
    return this.httpService.get(this.httpService.endpoint.productItems, {
      params: {include: 'product,latestActivity.location,active_warrant', ...pagination}
    })
  }

  create(model: object): Observable<ProductItemModel> {
    return this.httpService
      .post(this.httpService.endpoint.productItems, model)
      .pipe(map((res: { data: ProductItemModel }) => res.data))
  }

  update(id: number, model: object): Observable<ProductItemModel> {
    return this.httpService
      .patch(`${this.httpService.endpoint.productItems}/${id}`, model)
      .pipe(map((res: { data: ProductItemModel }) => res.data))
  }

  destroy(id: number): Observable<null> {
    return this.httpService.destroy(`${this.httpService.endpoint.productItems}/${id}`)
  }

  findById(id: string | number): Observable<ProductItemModel> {
    const params = {include: 'product,latestActivity.location,activeWarrant'};

    return this.httpService
      .get(`${this.httpService.endpoint.productItems}/${id}`, {params})
      .pipe(map((res: { data: ProductItemModel }) => res.data))
  }

  get fetchAllProductCategories(): Observable<ProductCategoryModel[]> {
    return this.httpService.get(this.httpService.endpoint.productCategories)
      .pipe(map((res: { data: ProductCategoryModel[] }) => res.data));
  }

  get fetchAllWarehouses(): Observable<WarehouseModel[]> {
    return this.httpService.get(this.httpService.endpoint.warehouses)
      .pipe(map((res: { data: WarehouseModel[] }) => res.data));
  }

  fetchActivities(itemId: number, meta: PaginationModel): Observable<HttpResponseModel<ProductItemActivityModel>> {
    const url = this.httpService.endpoint.productItemActivities
      .replace(':id', itemId.toString());

    const params = {...meta, include: 'location,warrant,createdBy,remark,repair,eventable,contract'}
    return this.httpService.get(url, {params})
  }

  createActivity(itemId: number | string, payload: object): Observable<ProductItemActivityModel> {
    const url = this.httpService.endpoint.productItemActivities
      .replace(':id', itemId.toString());

    return this.httpService.post(url, payload)
      .pipe(map((res: { data: ProductItemActivityModel }) => res.data))

  }
}

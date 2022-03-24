import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ProductModel } from '../../../models/product.model';
import { ProductsModule } from '../products.module';
import { HttpService } from '../../../core/services/http.service';
import { PaginationModel } from '../../../models/pagination.model';
import { HttpResponseModel } from '../../../models/response.model';
import { ProductCategoryModel } from '../../../models/product-category.model';

@Injectable({
  providedIn: ProductsModule
})
export class ProductService {

  constructor(private httpService: HttpService) {
  }

  get fetchAllCategories(): Observable<ProductCategoryModel[]> {
    return this.httpService.get(this.httpService.endpoint.productCategories)
      .pipe(map((res: { data: ProductCategoryModel[] }) => res.data));
  }

  fetchProducts(categoryId: number, meta: PaginationModel,
                includeParent = false): Observable<HttpResponseModel<ProductModel>> {
    const params = {limit: meta.limit, page: meta.page, include: ''};
    if (includeParent) {
      params.include = 'parent'
    }
    return this.httpService
      .get(`${this.httpService.endpoint.productCategories}/${categoryId}/products`, {params})
  }


  create(model: ProductModel): Observable<ProductModel> {
    return this.httpService
      .post(this.httpService.endpoint.products, model)
      .pipe(map((res: { data: ProductModel }) => res.data))

  }

  update(id: number, model: ProductModel): Observable<ProductModel> {
    return this.httpService
      .patch(`${this.httpService.endpoint.products}/${id}`, model)
      .pipe(map((res: { data: ProductModel }) => res.data))
  }

  destroy(id: number): Observable<null> {
    return this.httpService
      .destroy(`${this.httpService.endpoint.products}/${id}`)
  }
}

import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CustomersModule } from '../customers.module';
import { HttpService } from '../../../core/services/http.service';
import { CustomerModel } from '../../../models/customer.model';
import { HttpResponseModel } from '../../../models/response.model';

@Injectable({
  providedIn: CustomersModule
})
export class CustomerService {


  constructor(private httpService: HttpService) {
  }

  fetch(params: object): Observable<HttpResponseModel<CustomerModel>> {
    return this.httpService
      .get(this.httpService.endpoint.customers, {params: {...params, include: 'parent'}});
  }

  create(model: CustomerModel): Observable<CustomerModel> {
    return this.httpService.post(this.httpService.endpoint.customers, model)
      .pipe(map((res: { data: CustomerModel }) => res.data))
  }

  update(id: number, model: CustomerModel): Observable<CustomerModel> {
    return this.httpService.patch(`${this.httpService.endpoint.customers}/${id}`, model)
      .pipe(map((res: { data: CustomerModel }) => res.data))
  }

  destroy(id: number): Observable<null> {
    return this.httpService.destroy(`${this.httpService.endpoint.customers}/${id}`)
  }
}

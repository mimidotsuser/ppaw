import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http.service';
import { VendorModel } from '../../../models/vendor.model';
import { VendorsModule } from '../vendors.module';

@Injectable({providedIn: VendorsModule})
export class VendorService {

  constructor(private httpService: HttpService) { }

  fetchAll(): Observable<VendorModel[]> {
    return this.httpService.get(this.httpService.endpoint.vendors)
      .pipe(map((s: { data: VendorModel[] }) => s.data))
  }

  create(vendor: VendorModel): Observable<VendorModel> {
    return this.httpService.post(this.httpService.endpoint.vendors, vendor)
      .pipe(map((s: { data: VendorModel }) => s.data));
  }
}

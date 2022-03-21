import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http.service';
import { VendorModel } from '../../../models/vendor.model';
import { VendorsModule } from '../vendors.module';

@Injectable({providedIn: VendorsModule})
export class VendorService {

  constructor(private http: HttpService) { }

  fetchAll(): Observable<VendorModel[]> {
    return this.http.get('/vendors')
      .pipe(map((s: { data: VendorModel[] }) => s.data))
  }

  create(vendor: VendorModel) {
    return this.http.post('/vendors', vendor);
  }
}

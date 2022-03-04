import { Injectable } from '@angular/core';
import { HttpService } from '../../../../core/services/http.service';
import { VendorModel } from '../../../../models/vendor.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
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

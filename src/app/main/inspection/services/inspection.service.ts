import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { InspectionModule } from '../inspection.module';
import { HttpService } from '../../../core/services/http.service';
import { PPCIModel } from '../../../models/p-p-c-i.model';

@Injectable({
  providedIn: InspectionModule
})
export class InspectionService {

  constructor(private http: HttpService) { }

  fetchPPCheckInPendingInspection(): Observable<PPCIModel[]> {
    return this.http.get('/purchased-products')
      .pipe(map((val: { data: PPCIModel[] }) => val.data))
  }

  fetchProductCheckInById(id: string): Observable<PPCIModel> {
    return this.http.get(`/purchased-products/${id}`)
  }
}

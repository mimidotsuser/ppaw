import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http.service';
import { PPCIModel } from '../../../models/p-p-c-i.model';
import { InspectionReportModule } from '../inspection-report.module';

@Injectable({
  providedIn: InspectionReportModule
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

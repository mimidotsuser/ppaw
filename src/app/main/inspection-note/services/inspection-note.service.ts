import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http.service';
import { GoodsReceiptNoteModel } from '../../../models/goods-receipt-note.model';
import { InspectionNoteModule } from '../inspection-note.module';

@Injectable({
  providedIn: InspectionNoteModule
})
export class InspectionNoteService {

  constructor(private http: HttpService) { }

  fetchPPCheckInPendingInspection(): Observable<GoodsReceiptNoteModel[]> {
    return this.http.get('/purchased-products')
      .pipe(map((val: { data: GoodsReceiptNoteModel[] }) => val.data))
  }

  fetchProductCheckInById(id: string): Observable<GoodsReceiptNoteModel> {
    return this.http.get(`/purchased-products/${id}`)
  }
}

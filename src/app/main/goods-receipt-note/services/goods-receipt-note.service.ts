import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http.service';
import { GoodsReceiptNoteModule } from '../goods-receipt-note.module';
import { map, Observable } from 'rxjs';
import { WarehouseModel } from '../../../models/warehouse.model';
import { GoodsReceiptNoteModel } from '../../../models/goods-receipt-note.model';

@Injectable({
  providedIn: GoodsReceiptNoteModule
})
export class GoodsReceiptNoteService {

  constructor(private httpService: HttpService) { }

  get fetchAllWarehouses(): Observable<WarehouseModel[]> {
    return this.httpService.get(this.httpService.endpoint.warehouses)
      .pipe(map((res: { data: WarehouseModel[] }) => res.data));
  }

  create(payload: object): Observable<GoodsReceiptNoteModel> {
    return this.httpService.post(this.httpService.endpoint.goodsReceiptNote, payload)
      .pipe(map((res: { data: GoodsReceiptNoteModel }) => res.data))
  }
}

import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { WorksheetsModule } from '../worksheets.module';
import { HttpService } from '../../../core/services/http.service';
import { ProductItemModel } from '../../../models/product-item.model';

@Injectable({
  providedIn: WorksheetsModule
})
export class WorksheetService {

  constructor(private http: HttpService) { }

  fetchClientMachines(client_id: number): Observable<ProductItemModel[]> {
    return this.http.get('/product-serials', {params: {client_id}})
      .pipe(map((val: { data: ProductItemModel[] }) => val.data))
  }

}

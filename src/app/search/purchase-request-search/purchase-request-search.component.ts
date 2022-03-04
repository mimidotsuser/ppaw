import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PurchaseRequestModel } from '../../models/purchase-request.model';
import { catchError, map, mergeMap, Observable, takeWhile, tap } from 'rxjs';
import { HttpService } from '../../core/services/http.service';
import { ProductBalanceModel } from '../../models/product-balance.model';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'purchase-request-search[controlName],purchase-request-search[control]',
  templateUrl: './purchase-request-search.component.html',
  styleUrls: ['./purchase-request-search.component.scss']
})
export class PurchaseRequestSearchComponent implements OnInit {

  @Input() control: FormControl | null = null;
  @Input() controlName: string = '';
  @Input() path = '/purchase-requests';
  @Input() customId: string | undefined;
  @Input() editable = false;

  constructor(private http: HttpService) { }

  ngOnInit(): void {
  }


  formatRequestId(id: number) {
    return `REQUEST-${String(id).padStart(4, '0')}`
  }

  get outputFormatter(): (item: PurchaseRequestModel) => string {
    return (item: PurchaseRequestModel) => {
      return `${this.formatRequestId(item.order_id)} ${item.created_by ? '| by ' : ''}` +
        `${item?.created_by?.first_name || ''} ${item?.created_by?.last_name || ''}`
    }
  }

  get search(): (searchItem: string) => Observable<PurchaseRequestModel[]> {
    return (searchItem: string) => {
      return this.http.get(this.path, {params: {search: searchItem}})
        .pipe(map((value: { data: PurchaseRequestModel[] }) => value.data))
        .pipe(mergeMap((prs: PurchaseRequestModel[]) => {
          let params = new HttpParams();
          params = params.append('_expand', 'product');
          //extract the product ids to fetch
          prs.map((pr) => {
            pr.items.map((v) => params = params.append('product_id', v.product_id));
          });

          return this.http.get('/stock-balances?', {params})
            .pipe(map((rs: { data: ProductBalanceModel[] }) => rs.data))
            .pipe(map((m: ProductBalanceModel[]) => {
              return this.demoDataMap(prs, m);
            }))

        }))
    }
  }

  //TODO remove this after backend implementation
  demoDataMap(requests: PurchaseRequestModel[], balances: ProductBalanceModel[]): PurchaseRequestModel[] {
    requests.map((request) => {
      request.items.map((item) => {
        const bal = balances.find((x) => x.product_id === item.product_id);
        if (bal) {
          item.product = bal.product;
          item.product.physical_balance = bal.physical_balance;
        }
      })
    })

    return requests;
  }

}

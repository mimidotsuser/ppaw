import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { map, mergeMap, Observable } from 'rxjs';
import { PurchaseRequestModel } from '../../models/purchase-request.model';
import { HttpService } from '../../core/services/http.service';

@Component({
  selector: 'pr-typeahead-input[controlName],pr-typeahead-input[control]',
  templateUrl: './purchase-request-search.component.html',
  styleUrls: ['./purchase-request-search.component.scss']
})
export class PurchaseRequestSearchComponent implements OnInit {

  @Input() control: FormControl | null = null;
  @Input() controlName: string = '';
  @Input() customId: string | undefined;
  @Input() editable = false;

  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
  }

  get path(){
    return this.httpService.endpoint.purchaseRequests;
  }


  get outputFormatter(): (item: PurchaseRequestModel) => string {
    return (item: PurchaseRequestModel) => {
      return `${item.sn} ${item.created_by ? '| by ' : ''}` +
        `${item?.created_by?.first_name || ''} ${item?.created_by?.last_name || ''}`
    }
  }

  get search(): (searchItem: string) => Observable<PurchaseRequestModel[]> {
    return (searchItem: string) => {
      return this.httpService.get(this.path, {params: {search: searchItem}})
        .pipe(map((value: { data: PurchaseRequestModel[] }) => value.data))
        .pipe(mergeMap((prs: PurchaseRequestModel[]) => {
          let params = new HttpParams();
          params = params.append('_expand', 'product');
          //extract the product ids to fetch
          prs.map((pr) => {
            pr.items.map((v) => params = params.append('product_id', v.product_id));
          });

          return this.httpService.get('/stock-balances?', {params})

        }))
    }
  }

}

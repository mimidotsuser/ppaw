import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PRStage, PurchaseRequestModel } from '../../models/purchase-request.model';
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
  @Input() stage: PRStage | null = PRStage.APPROVAL_OKAYED;
  @Input() with: string | null = 'items';
  @Input() withoutRFQ?: boolean;

  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
  }

  get path() {
    return this.httpService.endpoint.purchaseRequests;
  }


  get outputFormatter(): (item: PurchaseRequestModel) => string {
    return (item: PurchaseRequestModel) => {
      return `${item.sn} ${item.created_by ? '| by ' : ''}` +
        `${item?.created_by?.first_name || ''} ${item?.created_by?.last_name || ''}`
    }
  }

  get queryParams(): { [ key: string ]: string | boolean; } {
    let params: { [ key: string ]: string | boolean } = {search: '%s'}
    if (this.stage) {
      params = {stage: this.stage, ...params}
    }
    if (this.with) {
      params = {include: this.with, ...params}
    }
    if (this.withoutRFQ === true) {
      params = {withoutRFQ: true, ...params}
    }
    return params
  }
}

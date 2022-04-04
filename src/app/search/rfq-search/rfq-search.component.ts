import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpService } from '../../core/services/http.service';
import { RFQModel } from '../../models/r-f-q.model';

@Component({
  selector: 'rfq-typeahead-input[control],rfq-typeahead-input[controlName]',
  templateUrl: './rfq-search.component.html',
  styleUrls: ['./rfq-search.component.scss']
})
export class RfqSearchComponent implements OnInit {
  @Input() control: FormControl | null = null;
  @Input() controlName: string = '';
  @Input() customId: string | undefined;
  @Input() editable = false;
  @Input() with?: string
  @Input() withoutPO?: boolean

  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
  }

  get path() {
    return this.httpService.endpoint.rfqs;
  }


  get outputFormatter(): (item: RFQModel) => string {
    return (item: RFQModel) => {
      return `${item.sn}${item.created_by ? ' | by ' : ''}` +
        `${item?.created_by?.first_name || ''} ${item?.created_by?.last_name || ''}`
    }
  }


  get queryParams(): { [ key: string ]: string | boolean; } {
    let params: { [ key: string ]: string | boolean } = {search: '%s'}

    if (this.with) {
      params = {include: this.with, ...params}
    }
    if (this.withoutPO === true) {
      params = {withoutPO: true, ...params}
    }
    return params
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpService } from '../../core/services/http.service';
import { MRFModel } from '../../models/m-r-f.model';

@Component({
  selector: 'material-request-typeahead[control],material-request-typeahead[controlName]',
  templateUrl: './material-request-search.component.html',
  styleUrls: ['./material-request-search.component.scss']
})
export class MaterialRequestSearchComponent implements OnInit {

  @Input() control: FormControl | null = null;
  @Input() controlName: string = '';
  @Input() customId?: string;
  @Input() placeholder = 'Search by request number';
  @Input() stage?: 'issued' | 'approved' | 'verified' | 'created';

  constructor(private httpService: HttpService) {
  }

  ngOnInit(): void {
  }

  get path() {
    return this.httpService.endpoint.materialRequests;
  }

  get outputFormatter(): (item: MRFModel) => string {
    return (item) => `${item.sn}${item.created_by ? ' by ' : ''}${item.created_by?.first_name}`
  };

  get queryParams(): { [ key: string ]: string | boolean } {

    let params: { [ key: string ]: string | boolean } = {search: '%s', include: 'createdBy'}

    if (this.stage) {
      params = {...params, stage: this.stage}
    }
    return params;
  }
}

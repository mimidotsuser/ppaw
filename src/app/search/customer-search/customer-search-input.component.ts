import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CustomerModel } from '../../models/customer.model';
import { HttpService } from '../../core/services/http.service';

@Component({
  selector: 'customer-typeahead-input[control],customer-typeahead-input[controlName]',
  templateUrl: './customer-search-input.component.html',
  styleUrls: ['./customer-search-input.component.scss']
})
export class CustomerSearchInputComponent implements OnInit {

  @Input() control: FormControl | null = null;
  @Input() controlName: string = '';
  @Input() customId?: string;
  @Input() parentsOnly?: true;
  @Input() childrenOnly?: true;

  constructor(private httpService: HttpService) {
  }

  ngOnInit(): void {
  }

  get path() {
    return this.httpService.endpoint.customers;
  }

  get outputFormatter(): (item: CustomerModel) => string {
    return (item: CustomerModel) => `${item.name}|${item.branch || item.region}`
  };

  get queryParams(): { [ key: string ]: string | boolean } {

    let params: { [ key: string ]: string | boolean } = {search: '%s'}

    if (this.parentsOnly) {
      params = {parentsOnly: true, ...params,}
    }
    if (this.childrenOnly) {
      params = {childrenOnly: true, ...params,}
    }

    return params;
  }
}

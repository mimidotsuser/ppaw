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
  path: string;

  constructor(private httpService: HttpService) {
    this.path = httpService.endpoint.customers;
  }

  ngOnInit(): void {
  }

  get outputFormatter(): (item: CustomerModel) => string {
    return (item: CustomerModel) => `${item.name}|${item.branch || item.region}`
  };

}

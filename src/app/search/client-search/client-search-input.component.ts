import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CustomerModel } from '../../models/customerModel';

@Component({
  selector: 'client-search-input[control],client-search-input[controlName]',
  templateUrl: './client-search-input.component.html',
  styleUrls: ['./client-search-input.component.scss']
})
export class ClientSearchInputComponent implements OnInit {

  @Input() control: FormControl | null = null;
  @Input() controlName: string = '';
  @Input() path = '/clients';
  @Input() customId?: string;

  constructor() {
  }

  ngOnInit(): void {
  }

  get outputFormatter(): (item: CustomerModel) => string {
    return (item: CustomerModel) => `${item.name}|${item.branch || item.region}`
  };

}

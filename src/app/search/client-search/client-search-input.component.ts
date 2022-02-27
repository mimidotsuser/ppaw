import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ClientModel } from '../../models/client.model';

@Component({
  selector: 'client-search-input[control],client-search-input[controlName]',
  templateUrl: './client-search-input.component.html',
  styleUrls: ['./client-search-input.component.scss']
})
export class ClientSearchInputComponent implements OnInit {

  @Input() control: FormControl | null = null;
  @Input() controlName: string = '';
  @Input() path = '/clients';

  constructor() {
  }

  ngOnInit(): void {
  }

  get outputFormatter(): (item: ClientModel) => string {
    return (item: ClientModel) => `${item.name}|${item.branch || item.region}`
  };

}

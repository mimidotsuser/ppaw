import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ClientModel } from '../../models/client.model';
import { WorksheetModel } from '../../models/worksheet.model';

@Component({
  selector: 'app-product-serial-search',
  templateUrl: './product-serial-search.component.html',
  styleUrls: ['./product-serial-search.component.scss']
})
export class ProductSerialSearchComponent implements OnInit {


  @Input() control: FormControl | null = null;
  @Input() controlName: string = '';
  @Input() path = '/product-serials';
  @Input() customId: string | undefined;

  constructor() {
  }

  ngOnInit(): void {
  }

  get queryParams(): { [ key: string ]: string; } {
    if (this.client) {
      return {
        search: '%s',
        client_id: this.client.id
      }
    }
    return {search: '%s'}
  }

  get outputFormatter(): (item: WorksheetModel) => string {
    return (item: WorksheetModel) => `${item.id}|${item?.remarks.slice(0, 15)}`
  };

}

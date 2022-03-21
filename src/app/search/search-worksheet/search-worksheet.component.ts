import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { WorksheetModel } from '../../models/worksheet.model';
import { CustomerModel } from '../../models/customerModel';

@Component({
  selector: 'search-worksheet[control],search-worksheet[controlName]',
  templateUrl: './search-worksheet.component.html',
  styleUrls: ['./search-worksheet.component.scss']
})
export class SearchWorksheetComponent implements OnInit {

  @Input() control: FormControl | null = null;
  @Input() controlName: string = '';
  @Input() path = '/worksheets';
  @Input() client: CustomerModel | null = null;
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

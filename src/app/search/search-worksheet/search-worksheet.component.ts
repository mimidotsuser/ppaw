import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { WorksheetModel } from '../../models/worksheet.model';
import { CustomerModel } from '../../models/customerModel';
import { HttpService } from '../../core/services/http.service';

@Component({
  selector: 'worksheet-typeahead-input[control],worksheet-typeahead-input[controlName]',
  templateUrl: './search-worksheet.component.html',
  styleUrls: ['./search-worksheet.component.scss']
})
export class SearchWorksheetComponent implements OnInit {

  @Input() control: FormControl | null = null;
  @Input() controlName: string = '';
  @Input() client: CustomerModel | null = null;
  @Input() customId: string | undefined;

  constructor(private httpService: HttpService) {
  }

  ngOnInit(): void {
  }

  get path() {
    return this.httpService.endpoint.worksheets;
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

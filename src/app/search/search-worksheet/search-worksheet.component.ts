import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { WorksheetModel } from '../../models/worksheet.model';
import { HttpService } from '../../core/services/http.service';
import { CustomerModel } from '../../models/customer.model';

@Component({
  selector: 'worksheet-typeahead-input[control],worksheet-typeahead-input[controlName]',
  templateUrl: './search-worksheet.component.html',
  styleUrls: ['./search-worksheet.component.scss']
})
export class SearchWorksheetComponent implements OnInit {

  @Input() control: FormControl | null = null;
  @Input() controlName: string = '';
  @Input() customId: string | undefined;
  @Input() customer?: CustomerModel;

  constructor(private httpService: HttpService) {
  }

  ngOnInit(): void {
  }

  get path() {
    return this.httpService.endpoint.worksheets;
  }

  get queryParams(): { [ key: string ]: string; } {
    return {
      search: '%s',
      include: 'customer'
    }

  }

  get outputFormatter(): (item: WorksheetModel) => string {
    return (item: WorksheetModel) => `${item.reference}|${item?.customer?.name}`
  };
}

import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable } from 'rxjs';
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

  get search(): (searchItem: string) => Observable<RFQModel[]> {
    return (searchItem: string) => {
      return this.httpService.get(this.path, {params: {search: searchItem, include: 'product'}})
        .pipe(map((value: { data: RFQModel[] }) => value.data))
    }
  }

}

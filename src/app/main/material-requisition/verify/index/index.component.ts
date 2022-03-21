import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MaterialRequisitionService } from '../../services/material-requisition.service';
import { Observable, startWith, switchMap } from 'rxjs';
import { MRFModel, MRFOrderItemModel } from '../../../../models/m-r-f.model';
import { SearchService } from '../../../../shared/services/search.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  providers: [SearchService]
})
export class IndexComponent implements OnInit {

  requestSearchInput: FormControl;
  private requests$!: Observable<MRFModel[]>;

  constructor(private crService: MaterialRequisitionService, private fb: FormBuilder,
              private searchService: SearchService<MRFModel>) {

    this.searchService.setFields(['created_by.first_name', 'created_by.last_name',
      'created_at', 'order_id',]);
    this.requestSearchInput = this.fb.control('');
  }

  ngOnInit(): void {
    this.requests$ = this.requestSearchInput.valueChanges.pipe(
      startWith(''),
      switchMap((v) => this.searchService.find(v, this.crService.requestsToVerify))
    );
  }

  get checkoutRequests(): Observable<MRFModel[]> {
    return this.requests$;
  }

  formatOrderId(order: number) {
    return this.crService.formatOrderId(order);
  }

  aggregateQty(items: MRFOrderItemModel[]) {
    return this.crService.aggregateQty(items);
  }
}
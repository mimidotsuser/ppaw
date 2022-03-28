import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { MaterialRequisitionService } from '../../services/material-requisition.service';
import { MRFModel } from '../../../../models/m-r-f.model';
import { PaginationModel } from '../../../../models/pagination.model';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit, OnDestroy {

  faEllipsisV = faEllipsisV;
  requests: MRFModel[] = [];
  private _subscriptions: Subscription[] = [];
  pagination: PaginationModel = {total: 0, page: 1, limit: 25};
  searchInput: FormControl;

  constructor(private requisitionService: MaterialRequisitionService, private fb: FormBuilder) {
    this.loadRequests();
    this.searchInput = this.fb.control('');
  }

  ngOnInit(): void {

  }

  set subSink(value: Subscription) {
    this._subscriptions.push(value);
  }

  get tableCountStart() {
    return (this.pagination.page - 1) * this.pagination.limit
  }

  get tableCountEnd() {
    return this.pagination.page * this.pagination.limit
  }

  loadRequests() {
    this.subSink = this.requisitionService.fetchRequestsPendingVerification(this.pagination)
      .subscribe((res) => {
        this.pagination.total = res.total;
        this.requests = this.requests.concat(res.data);
      })
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe());
  }

}

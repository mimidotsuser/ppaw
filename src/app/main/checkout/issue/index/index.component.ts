import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { MRFModel } from '../../../../models/m-r-f.model';
import { CheckoutService } from '../../services/checkout.service';
import { PaginationModel } from '../../../../models/pagination.model';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {

  faEllipsisV = faEllipsisV;
  requests: MRFModel[] = [];
  loadingMainContent = false;
  private _subscriptions: Subscription[] = [];
  pagination: PaginationModel = {total: 0, page: 1, limit: 25};
  searchInput: FormControl;

  constructor(private checkoutService: CheckoutService, private fb: FormBuilder) {

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
    //if data has already been loaded, don't re-fetch it
    if (this.tableCountEnd <= this.requests.length
      || (this.requests.length === this.pagination.total && this.pagination.total !== 0)) {
      return;
    }

    this.loadingMainContent = true;
    this.subSink = this.checkoutService.fetch(this.pagination)
      .pipe(finalize(() => this.loadingMainContent = false))
      .subscribe((res) => {
        this.pagination.total = res.total;
        this.requests = this.requests.concat(res.data);
      })
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe());
  }

}

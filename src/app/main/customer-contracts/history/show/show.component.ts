import { Component, OnDestroy, OnInit } from '@angular/core';
import { CustomerContractModel } from '../../../../models/customer-contract.model';
import { CustomerContractService } from '../../services/customer-contract.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { PaginationModel } from '../../../../models/pagination.model';
import { finalize, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})
export class ShowComponent implements OnInit, OnDestroy {

  loadingMainContent = false;
  pagination: PaginationModel = {total: 0, page: 1, limit: 15}
  private _subscriptions: Subscription[] = []
  model?: CustomerContractModel;
  searchInput: FormControl;

  constructor(private customerContractService: CustomerContractService, private fb: FormBuilder,
              private _route: ActivatedRoute, private router: Router) {
    this.loadContract();
    this.searchInput = this.fb.control('');
  }

  ngOnInit(): void {
  }

  set subSink(v: Subscription) {
    this._subscriptions.push(v);
  }

  get tableCountStart() {
    return (this.pagination.page - 1) * this.pagination.limit
  }

  get tableCountEnd() {
    return this.pagination.page * this.pagination.limit
  }

  get customer() {
    if (!this.model || !this.model?.customer) {
      return ''
    }
    return `${this.model.customer?.name} | ${this.model.customer?.branch || this.model.customer?.region}`
  }

  get authorName() {
    return `${this.model?.created_by?.first_name || ''} ${this.model?.created_by?.last_name || ''}`
  }

  get route() {return this._route}

  loadContract() {
    this.loadingMainContent = true;
    this.subSink = this.customerContractService.fetchById(this.route.snapshot.params[ 'id' ])
      .pipe(finalize(() => this.loadingMainContent = false))
      .subscribe({
        next: (model) => {
          this.model = model;
          this.pagination.total = model.product_items?.length || 0;
        }
      })
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }
}

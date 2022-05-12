import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize, Subscription } from 'rxjs';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { PaginationModel } from '../../../../models/pagination.model';
import { CustomerContractModel } from '../../../../models/customer-contract.model';
import { CustomerContractService } from '../../services/customer-contract.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {
  faEllipsisV = faEllipsisV;
  loadingMainContent = false;
  pagination: PaginationModel = {total: 0, page: 1, limit: 25}
  private _contracts: CustomerContractModel[] = [];
  private _subscriptions: Subscription[] = [];
  searchInput: FormControl;

  constructor(private fb: FormBuilder, private contractService: CustomerContractService,
              private _route: ActivatedRoute) {
    this.searchInput = this.fb.control('');
    this.loadContracts();
  }

  ngOnInit(): void {
  }

  private set subSink(v: Subscription) {
    this._subscriptions.push(v);
  }

  get route() {
    return this._route;
  }

  get tableCountStart() {
    return (this.pagination.page - 1) * this.pagination.limit
  }

  get tableCountEnd() {
    return this.pagination.page * this.pagination.limit
  }

  get contracts() {
    return this._contracts;
  }

  loadContracts() {
    if (this.tableCountEnd <= this._contracts.length
      || (this._contracts.length === this.pagination.total && this.pagination.total !== 0)) {
      return;
    }

    this.loadingMainContent = true;
    this.subSink = this.contractService.fetch(this.pagination)
      .pipe(finalize(() => this.loadingMainContent = false))
      .subscribe({
        next: (res) => {
          this.pagination.total = res.total;
          this._contracts = res.data;
        }
      })
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }


}

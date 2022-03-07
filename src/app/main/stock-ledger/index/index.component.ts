import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { faFilter, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { ProductBalanceModel } from '../../../models/product-balance.model';
import { StockLedgerService } from '../services/stock-ledger.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {

  searchInput: FormControl;
  faFilter = faFilter
  faEllipsisV = faEllipsisV;
  itemsBalances: ProductBalanceModel[] = []
  private subscriptions: Subscription[] = []
  pagination = {
    perPage: 15,
    page: 1
  }

  constructor(private ledgerService: StockLedgerService, private fb: FormBuilder) {
    this.searchInput = this.fb.control(null);
  }

  ngOnInit(): void {
    //load initial items on page load
    const x = this.ledgerService.fetchAll(this.pagination)
      .subscribe((val) => this.itemsBalances = val);
    this.subscriptions.push(x)
  }

  loadProductBalances(page: number) {
    this.pagination.page = page;
    const x = this.ledgerService
      .fetchAll({page: this.pagination.page, perPage: this.pagination.perPage})
      .subscribe((val) => this.itemsBalances = val);

    this.subscriptions.push(x)
  }

  ngOnDestroy(): void {
    this.subscriptions.map((sub) => sub.unsubscribe());
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';
import { faEllipsisV, faFilter } from '@fortawesome/free-solid-svg-icons';
import { ProductBalanceModel } from '../../../models/product-balance.model';
import { StockBalanceService } from '../services/stock-balance.service';
import { PaginationModel } from '../../../models/pagination.model';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {
  faFilter = faFilter
  faEllipsisV = faEllipsisV;
  loadingMainContent = false;
  showAdjustmentFormPopup = false;
  formSubmissionBusy = false;
  pagination: PaginationModel = {total: 0, page: 1, limit: 25}
  private _itemsBalances: ProductBalanceModel[] = []
  private _subscriptions: Subscription[] = []
  searchInput: FormControl;
  form: FormGroup;

  constructor(private stockBalanceService: StockBalanceService, private fb: FormBuilder) {

    this.searchInput = this.fb.control(null);

    this.form = fb.group({
      id: fb.control({value: null, disabled: true}),
      item_code: fb.control({value: null, disabled: true}),
      manufacturer_part_number: fb.control({value: null, disabled: true}),
      stock_balance: fb.control({value: 0, disabled: true}),
      total_qty_in: fb.control(0),
    });
  }

  ngOnInit(): void {
    this.loadProductBalances();
  }

  set subSink(value: Subscription) {
    this._subscriptions.push(value);
  }

  get itemsBalances(): ProductBalanceModel[] {
    return this._itemsBalances;
  }

  loadProductBalances() {
    //if data has already been loaded, don't re-fetch it
    if (this.tableCountEnd <= this._itemsBalances.length) {return;}
    this.loadingMainContent = true;
    this.subSink = this.stockBalanceService.fetchAll(this.pagination)
      .pipe(finalize(() => this.loadingMainContent = false))
      .subscribe({
        next: (res) => {
          this._itemsBalances = this._itemsBalances.concat(res.data);
          this.pagination.total = res.total;
        }
      })

  }

  get tableCountStart() {
    return (this.pagination.page - 1) * this.pagination.limit
  }

  get tableCountEnd() {
    return this.pagination.page * this.pagination.limit
  }

  showBalanceAdjustmentForm(model: ProductBalanceModel) {
    this.form.patchValue({
      id: model.id,
      item_code: model.product?.item_code || '',
      manufacturer_part_number: model.product?.manufacturer_part_number || '',
      stock_balance: model.stock_balance,
      total_qty_in: model.stock_balance,
    })
    this.showAdjustmentFormPopup = true;
  }

  updateBalance() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {return}
    if (!this.form.dirty) {this.showAdjustmentFormPopup = false;}

    this.formSubmissionBusy = true;
    const payload = {total_qty_in: this.form.get('total_qty_in')?.value}
    this.subSink = this.stockBalanceService
      .update(this.form.get('id')?.value as number, payload)
      .pipe(finalize(() => this.formSubmissionBusy = false))
      .subscribe((model) => {
        const index = this.itemsBalances.findIndex((b) => b.id === model.id);
        if (index > -1) {
          this.itemsBalances[ index ] = model;
        }
        this.showAdjustmentFormPopup = false;
      })
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe());
  }
}

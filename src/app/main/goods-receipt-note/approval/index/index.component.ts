import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { faExternalLinkAlt, faFilter } from '@fortawesome/free-solid-svg-icons';
import { GoodsReceiptNoteService } from '../../services/goods-receipt-note.service';
import { GoodsReceiptNoteModel } from '../../../../models/goods-receipt-note.model';
import { PaginationModel } from '../../../../models/pagination.model';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {

  faFilter = faFilter;
  faExternalLinkAlt = faExternalLinkAlt;
  pagination: PaginationModel = {page: 1, limit: 25, total: 0}
  private _requests: GoodsReceiptNoteModel[] = [];
  private _subscriptions: Subscription[] = []
  searchInput: FormControl;

  constructor(private fb: FormBuilder, private goodsReceiptNoteService: GoodsReceiptNoteService) {
    this.loadRequests();
    this.searchInput = this.fb.control('');
  }

  ngOnInit(): void {
  }


  private set subSink(v: Subscription) {
    this._subscriptions.push(v);
  }

  get tableCountStart() {
    return (this.pagination.page - 1) * this.pagination.limit
  }

  get tableCountEnd() {
    return this.pagination.page * this.pagination.limit
  }

  get requests(): GoodsReceiptNoteModel[] {
    return this._requests
  }

  loadRequests() {
    if (this.tableCountEnd <= this._requests.length) {
      return;
    }
    this.subSink = this.goodsReceiptNoteService.fetchRequestsPendingApproval(this.pagination)
      .subscribe({
        next: (res) => {
          this._requests = this._requests.concat(res.data);
          this.pagination.total = res.total;
        }
      })
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }

}

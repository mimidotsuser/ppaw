import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { InspectionNoteService } from '../../services/inspection-note.service';
import { Subscription } from 'rxjs';
import { GoodsReceiptNoteModel } from '../../../../models/goods-receipt-note.model';
import { PaginationModel } from '../../../../models/pagination.model';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {


  faFilter = faFilter;
  pagination: PaginationModel = {page: 1, limit: 25, total: 0}
  private _requests: GoodsReceiptNoteModel[] = [];
  private _subscriptions: Subscription[] = []
  searchInput: FormControl;

  constructor(private fb: FormBuilder, private inspectionService: InspectionNoteService) {
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
    this.subSink = this.inspectionService.fetchRequests(this.pagination)
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

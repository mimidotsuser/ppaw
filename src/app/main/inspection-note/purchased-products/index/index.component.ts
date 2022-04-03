import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { InspectionNoteService } from '../../services/inspection-note.service';
import { Subscription } from 'rxjs';
import { GoodsReceiptNoteModel } from '../../../../models/goods-receipt-note.model';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {


  searchInput: FormControl;
  faFilter = faFilter;
  requests: GoodsReceiptNoteModel[] = [];
  private _subscriptions: Subscription[] = []

  constructor(private fb: FormBuilder, private inspectionService: InspectionNoteService) {
    this.searchInput = this.fb.control('');
  }

  ngOnInit(): void {
    this.subSink = this.inspectionService.fetchPPCheckInPendingInspection()
      .subscribe((val) => this.requests = val)
  }


  set subSink(subscription: Subscription) {
    this._subscriptions.push(subscription);
  }



  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }

}

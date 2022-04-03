import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  faEllipsisV,
  faExternalLinkAlt,
  faEye,
  faFilePdf
} from '@fortawesome/free-solid-svg-icons';
import { RqfService } from '../services/rqf.service';
import { RFQModel } from '../../../models/r-f-q.model';
import { PaginationModel } from '../../../models/pagination.model';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {

  showRFQSummaryPopup = false;
  faEllipsisV = faEllipsisV;
  faFilePdf = faFilePdf;
  faEye = faEye;
  faExternalLinkAlt = faExternalLinkAlt;
  selectedModel: RFQModel | null = null;
  _rfqRequests: RFQModel[] = [];
  pagination: PaginationModel = {total: 0, page: 1, limit: 25}
  private _subscriptions: Subscription[] = [];


  constructor(private rfqService: RqfService) {
    this.loadRequests();
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

  get requests() {
    return this._rfqRequests;
  }

  loadRequests() {
    this.subSink = this.rfqService
      .fetch(this.pagination, {include: 'purchaseOrder,createdBy,vendors,items'})
      .subscribe({
        next: (res) => {
          if (this.tableCountEnd <= this.requests.length) {
            return;
          }
          this.pagination.total = res.total;
          this._rfqRequests = this._rfqRequests.concat(res.data);
        }
      })
  }

  showRFQSummary(request: RFQModel) {
    this.selectedModel = request;
    this.showRFQSummaryPopup = true;
  }

  exportRFQ(request: RFQModel) {
    //to-do
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }
}

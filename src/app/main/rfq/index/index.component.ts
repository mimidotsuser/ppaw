import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  faEllipsisV,
  faFilePdf,
  faEye,
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons';
import { RqfService } from '../services/rqf.service';
import { RFQItemModel, RFQModel } from '../../../models/r-f-q.model';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {

  rfqRequests: RFQModel[] = [];
  subscriptions: Subscription[] = [];
  showRFQSummaryPopup = false;
  faEllipsisV = faEllipsisV;
  faFilePdf = faFilePdf;
  faEye = faEye;
  faExternalLinkAlt = faExternalLinkAlt;
  selectedModel: RFQModel | null = null;


  constructor(private rfqService: RqfService) { }

  ngOnInit(): void {
    this.rfqService.fetchAll()
      .subscribe((value) => this.rfqRequests.push(...value))
  }

  formatOrderId(id: number) {
    return `REQUEST-${String(id).padStart(4, '0')}`
  }

  aggregateQty(items: RFQItemModel[]) {
    return items.reduce((acc, v) => acc += v.qty, 0)
  }

  authorName(req: RFQModel) {
    return `${req.created_by?.first_name || ''} ${req.created_by?.last_name || ''}`
  }

  showRFQSummary(request: RFQModel) {
    this.selectedModel = request;
    this.showRFQSummaryPopup = true;
  }

  exportRFQ(request: RFQModel) {
    //to-do
  }

  ngOnDestroy(): void {
    this.subscriptions.map((sub) => sub.unsubscribe())
  }
}

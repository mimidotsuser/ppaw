import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { faFilePdf, faEye } from '@fortawesome/free-regular-svg-icons';
import { CheckoutRequestService } from '../services/checkout-request.service';
import { MRFStage, MRFModel, MRFOrderItemModel, MRFLog } from '../../../models/m-r-f.model';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  itemsSearchInput = new FormControl();
  faEllipsisV = faEllipsisV;
  faFilePdf = faFilePdf;
  faEye = faEye;
  showLogsPopup = false;
  model: MRFModel | null = null;

  constructor(private crService: CheckoutRequestService) { }

  ngOnInit(): void {
  }

  get checkoutRequests(): Observable<MRFModel[]> {
    return this.crService.myRequests;
  }

  formatOrderId(order: number) {
    return this.crService.formatOrderId(order);
  }

  aggregateQty(items: MRFOrderItemModel[]) {
    return this.crService.aggregateQty(items);
  }

  lastProcessInstance(request: MRFModel): { stage: string, status: string } {

    //sort in reverse such that the latest equals first index
    const lastStage = [...request.logs].sort((a, b) => {
      return b.id - a.id;
    })[ 0 ];

    const qty = this.aggregateQty(request.order_items);

    if (lastStage.stage === MRFStage.CREATE) {
      return {stage: 'Verification', status: 'Pending verification'}
    }

    if (lastStage.stage === MRFStage.VERIFY) {
      return {
        stage: qty.verified == 0 ? 'Complete' : 'Approval',
        status: qty.verified == 0 ? 'Rejected' : 'Pending Approval'
      }
    }
    if (lastStage.stage === MRFStage.APPROVE) {
      return {
        stage: qty.approved == 0 ? 'Complete' : 'Approval',
        status: qty.approved == 0 ? 'Rejected' : 'Pending Issuing'
      }
    }

    if (lastStage.stage === MRFStage.CHECKOUT) {
      return {stage: 'Complete', status: 'Issued'}
    }
    return {stage: 'Unknown', status: 'Unknown'}
  }

  showLogs(item: MRFModel) {
    this.showLogsPopup = true;
    this.model = item;
  }

  formatTimelineStageTitle(log: MRFLog) {
    if (log.stage === MRFStage.CREATE) {
      return 'Request Application Stage';
    }
    if (log.stage === MRFStage.VERIFY) {
      return 'Request Verification Stage';
    }
    if (log.stage === MRFStage.APPROVE) {
      return 'Request Approval Stage';
    }
    if (log.stage === MRFStage.CHECKOUT) {
      return 'Request Checkout';
    }
    return 'Request Stage Unknown';
  }


  exportMRN(request: MRFModel) {}

  exportSIV(request: MRFModel) {}
}

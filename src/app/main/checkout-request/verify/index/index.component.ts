import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CheckoutRequestService } from '../../services/checkout-request.service';
import { Observable } from 'rxjs';
import { MRFModel, MRFOrderItemsModel } from '../../../../models/m-r-f.model';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  requestSearchInput = new FormControl();

  constructor(private crService: CheckoutRequestService) { }

  ngOnInit(): void {}

  get checkoutRequests(): Observable<MRFModel[]> {
    return this.crService.requestsToApprove;
  }

  formatOrderId(order: number) {
    return this.crService.formatOrderId(order);
  }

  aggregateQty(items: MRFOrderItemsModel[]) {
    return this.crService.aggregateQty(items);
  }
}

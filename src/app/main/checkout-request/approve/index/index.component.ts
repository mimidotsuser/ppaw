import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, startWith, switchMap, tap } from 'rxjs';
import { CheckoutRequestService } from '../../services/checkout-request.service';
import { MRFModel, MRFOrderItemModel, MRFStage } from '../../../../models/m-r-f.model';
import { SearchService } from '../../../../shared/services/search.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  providers: [SearchService]
})
export class IndexComponent implements OnInit {

  requestSearchInput = new FormControl();
  private requests$!: Observable<MRFModel[]>;

  constructor(private crService: CheckoutRequestService,
              private searchService: SearchService<MRFModel>) {

    this.searchService.setFields(['created_by.first_name', 'created_by.last_name',
      'created_at', 'order_id',]);
  }

  ngOnInit(): void {
    this.requests$ = this.requestSearchInput.valueChanges.pipe(
      startWith(''),
      switchMap((v) => this.searchService.find(v, this.crService.requestsToApprove))
    );
  }

  get checkoutRequests(): Observable<MRFModel[]> {
    return this.requests$;
  }

  formatOrderId(order: number) {
    return this.crService.formatOrderId(order);
  }

  aggregateQty(items: MRFOrderItemModel[]) {
    return this.crService.aggregateQty(items);
  }

  approvedOn(item: MRFModel): string {
    const x = item?.logs?.find((log) => log.stage === MRFStage.VERIFY);
    return x ? x.created_at : '';
  }

  approver(item: MRFModel): string {
    const x = item?.logs?.find((log) => log.stage === MRFStage.VERIFY);
    return x ? `${x.created_by?.first_name || ''} ${x.created_by?.last_name || ''}` : '---';

  }

}

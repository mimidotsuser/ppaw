import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, startWith, switchMap } from 'rxjs';
import { MRFModel, MRFStage } from '../../../models/m-r-f.model';
import { SearchService } from '../../../shared/services/search.service';
import { CheckoutService } from '../services/checkout.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  providers: [SearchService]
})
export class IndexComponent implements OnInit {

  requestSearchInput = new FormControl();
  private requests$!: Observable<MRFModel[]>;

  constructor(private checkoutService: CheckoutService,
              private searchService: SearchService<MRFModel>) {

    this.searchService.setFields(['created_by.first_name', 'created_by.last_name',
      'created_at', 'order_id',]);
  }

  ngOnInit(): void {
    this.requests$ = this.requestSearchInput.valueChanges.pipe(
      startWith(''),
      switchMap((v) => this.searchService.find(v, this.checkoutService.requestsPendingCheckout))
    );
  }

  get requests(): Observable<MRFModel[]> {
    return this.requests$;
  }


  formatOrderId(order: number): string {
    return `REQUEST-${String(order).padStart(4, '0')}`
  }


  approvedOn(item: MRFModel): string {
    const x = item?.logs?.find((log) => log.stage === MRFStage.APPROVE);
    return x ? x.created_at : '';
  }

  approver(item: MRFModel): string {
    const x = item?.logs?.find((log) => log.stage === MRFStage.APPROVE);
    return x ? `${x.created_by?.first_name || ''} ${x.created_by?.last_name || ''}` : '---';

  }

}

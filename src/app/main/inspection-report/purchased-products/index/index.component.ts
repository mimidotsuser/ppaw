import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { InspectionService } from '../../services/inspection.service';
import { Subscription } from 'rxjs';
import { PPCIModel } from '../../../../models/p-p-c-i.model';
import { VendorModel } from '../../../../models/vendor.model';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {


  searchInput: FormControl;
  faFilter = faFilter;
  requests: PPCIModel[] = [];
  private _subscriptions: Subscription[] = []

  constructor(private fb: FormBuilder, private inspectionService: InspectionService) {
    this.searchInput = this.fb.control('');
  }

  ngOnInit(): void {
    this.subSink = this.inspectionService.fetchPPCheckInPendingInspection()
      .subscribe((val) => this.requests = val)
  }


  set subSink(subscription: Subscription) {
    this._subscriptions.push(subscription);
  }

  formatRequestVendors(vendors?: VendorModel[]) {
    if (!vendors || !Array.isArray(vendors)) {return}
    return vendors.map((v) => v.business_name).join(',');
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }

}

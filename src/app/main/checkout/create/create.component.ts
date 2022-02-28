import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { faCartPlus, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { faWindowClose } from '@fortawesome/free-regular-svg-icons';
import { MRFModel, MRFOrderItemModel, MRFStage } from '../../../models/m-r-f.model';
import { CheckoutService } from '../services/checkout.service';
import { SearchService } from '../../../shared/services/search.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  providers: [SearchService]
})
export class CreateComponent implements OnInit, OnDestroy {

  requestModel: MRFModel | null = null;
  subscriptions: Subscription[] = [];
  faCartPlus = faCartPlus;
  faWindowClose = faWindowClose;
  faMinusCircle = faMinusCircle;
  showIssueFormPopup = false;
  issueFormPopupFullscreen = false;
  selectedOrderItem: MRFOrderItemModel | null = null;

  //forms
  //machineAllocationFormGroup: FormGroup;
 // orderItemMachineAllocation: FormArray;


  constructor(private checkoutService: CheckoutService, private fb: FormBuilder,
              private searchService: SearchService<MRFModel>, private route: ActivatedRoute) {

    const x = this.checkoutService.findRequestById(this.route.snapshot.params[ 'id' ])
      .subscribe((v) => this.requestModel = v);

    if (x) {
      this.subscriptions.push(x);
    }

  }

  ngOnInit(): void {
  }

  formatOrderId(order: number): string {
    return this.checkoutService.formatOrderId(order);
  }

  get name() {
    return `${this.requestModel?.created_by?.first_name || ''} ${this.requestModel?.created_by?.last_name || ''}`
  }

  get requesterRemarks() {
    const log = this.requestModel?.logs ?
      this.requestModel?.logs.find((log) => log?.stage === MRFStage.CREATE) : null;

    return log ? log.remarks : '';
  }

  get verifierRemarks() {
    const log = this.requestModel?.logs ?
      this.requestModel?.logs.find((log) => log?.stage === MRFStage.VERIFY) : null;

    return log ? log.remarks : '';
  }

  get approverRemarks() {
    const log = this.requestModel?.logs ?
      this.requestModel?.logs.find((log) => log?.stage === MRFStage.APPROVE) : null;

    return log ? log.remarks : '';
  }

  get selectedOrderItemIsSpare() {
    return this.selectedOrderItem?.type === 'spare';
  }

  get issueFormPopupTitle() {
    if (!this.selectedOrderItem) {
      return '';
    }
    if (this.selectedOrderItemIsSpare) {
      return `Spare Requisition Allocation [${this.selectedOrderItem.product?.item_code}]`
    } else {
      return `Machine Requisition Allocation [${this.selectedOrderItem.product?.item_code}]`
    }
  }

  openIssuePopupForm(item: MRFOrderItemModel) {
    this.selectedOrderItem = item;
    this.showIssueFormPopup = true;
  }

  tempSpareIssue() {

  }

  tempMachineIssue() {

  }

  submit() {

  }

  ngOnDestroy(): void {
    this.subscriptions.map((sub) => sub.unsubscribe());
  }
}

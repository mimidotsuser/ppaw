import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { MRFItemModel, MRFModel, MRFStage } from '../../../../models/m-r-f.model';
import { MaterialRequisitionService } from '../../services/material-requisition.service';
import { PaginationModel } from '../../../../models/pagination.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {

  faExternalLinkAlt = faExternalLinkAlt;
  model?: MRFModel;
  private _subscriptions: Subscription[] = [];
  pagination: PaginationModel = {total: 0, page: 1, limit: 15};
  form: FormGroup;

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder,
              private requisitionService: MaterialRequisitionService) {


    this.subSink = this.requisitionService
      .fetchRequestPendingApproval(this.route.snapshot.params[ 'id' ])
      .subscribe((v) => {
        this.model = v;
        this.renderItemsForm();
      });


    this.form = this.fb.group({
      remarks: this.fb.control(''),
      items: this.fb.array([])
    });
  }

  ngOnInit(): void {
  }

  set subSink(value: Subscription) {
    this._subscriptions.push(value);
  }

  get tableCountStart() {
    return (this.pagination.page - 1) * this.pagination.limit
  }

  get tableCountEnd() {
    return this.pagination.page * this.pagination.limit
  }

  get name() {
    return `${this.model?.created_by?.first_name || ''} ${this.model?.created_by?.last_name || ''}`
  }

  get requesterRemarks() {
    const log = this.model?.activities ?
      this.model?.activities.find((log) => log?.stage === MRFStage.REQUEST_CREATED) : null;

    return log ? log.remarks : '';
  }

  get verifierRemarks() {
    const log = this.model?.activities ?
      this.model?.activities.find((log) => log?.stage === MRFStage.VERIFIED_OKAYED) : null;

    return log ? log.remarks : '';
  }

  get itemsForm(): FormArray {
    return this.form.get('items') as FormArray;
  }

  createItemFormGroup(item: MRFItemModel) {
    return this.fb.group({
      id: this.fb.control(item.id),
      product_id: this.fb.control(item.product_id),
      purpose_code: this.fb.control(item.purpose_code),
      purpose_title: this.fb.control(item.purpose_title),
      customer_id: this.fb.control(item.customer_id),
      customer: this.fb.control(item.customer),
      requested_qty: this.fb.control(item.requested_qty),
      verified_qty: this.fb.control(item.verified_qty),
      approved_qty: this.fb.control(item.verified_qty,
        {validators: [Validators.min(0), Validators.max(item.verified_qty!)]}),
      worksheet_id: this.fb.control(item.worksheet_id),
      product: this.fb.control(item.product),
    })
  }

  renderItemsForm() {
    this.model?.items.map((item) => {
      if (item?.verified_qty || 0 > 0) {
        this.itemsForm.push(this.createItemFormGroup(item));
        this.pagination.total += 1;
      }
    })
  }

  submitForm() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {return}

    const payload = {
      remarks: this.form.get('remarks')?.value,
      items: (this.itemsForm.controls as FormGroup[]).map((group) => {
        return {id: group.get('id')?.value, approved_qty: group.get('approved_qty')?.value}
      })
    }
    this.subSink = this.requisitionService.createApprovalRequest(this.model!.id, payload)
      .subscribe({
        next: () => {
          this.router.navigate(['../'], {relativeTo: this.route})
            .then(() => {
              // alert('Request status updated successfully')
            })
        }
      })

  }

  ngOnDestroy(): void {
    this._subscriptions.map((s) => s.unsubscribe())
  }
}

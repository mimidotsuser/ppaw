import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, Subscription } from 'rxjs';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { MaterialRequisitionService } from '../../services/material-requisition.service';
import { MRFItemModel, MRFModel, MRFStage } from '../../../../models/m-r-f.model';
import { PaginationModel } from '../../../../models/pagination.model';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-verify',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {

  faExternalLinkAlt = faExternalLinkAlt;
  formSubmissionBusy = false;
  pagination: PaginationModel = {total: 0, page: 1, limit: 25};
  private _subscriptions: Subscription[] = [];
  model?: MRFModel;
  form: FormGroup;

  constructor(private _route: ActivatedRoute, private router: Router, private fb: FormBuilder,
              private requisitionService: MaterialRequisitionService,
              private toastService: ToastService) {

    this.subSink = this.requisitionService
      .fetchRequestPendingVerification(this.route.snapshot.params[ 'id' ])
      .subscribe({
        next: (v) => {
          this.model = v;
          this.pagination.total = v.items.length;
          this.renderItemsForm();
        },
        error: (e) => {
          if (e.status === 403) {
            this.router.navigate(['../../../not-authorized'], {relativeTo: this.route})
          } else if (e.status === 404) {
            this.router.navigate(['../../../not-found'], {relativeTo: this.route})
          }

        }
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

  get itemsForm(): FormArray {
    return this.form.get('items') as FormArray;
  }

  get route() {return this._route}

  createItemFormGroup(item: MRFItemModel) {
    return this.fb.group({
      id: this.fb.control(item.id),
      product_id: this.fb.control(item.product_id),
      purpose_code: this.fb.control(item.purpose_code),
      purpose_title: this.fb.control(item.purpose_title),
      customer_id: this.fb.control(item.customer_id),
      customer: this.fb.control(item.customer),
      requested_qty: this.fb.control(item.requested_qty),
      verified_qty: this.fb.control(item.requested_qty,
        {validators: [Validators.min(0), Validators.max(item.requested_qty)]}),
      worksheet_id: this.fb.control(item.worksheet_id),
      worksheet: this.fb.control(item.worksheet),
      product: this.fb.control(item.product),
    })
  }

  renderItemsForm() {
    this.model?.items.map((item) => {
      this.itemsForm.push(this.createItemFormGroup(item))
    })
  }

  submitForm() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {return}

    const payload = {
      remarks: this.form.get('remarks')?.value,
      items: (this.itemsForm.controls as FormGroup[]).map((group) => {
        return {id: group.get('id')?.value, verified_qty: group.get('verified_qty')?.value}
      })
    }
    this.formSubmissionBusy = true;
    this.subSink = this.requisitionService.createVerificationRequest(this.model!.id, payload)
      .pipe(finalize(() => this.formSubmissionBusy = false))
      .subscribe({
        next: () => {
          this.toastService.show({message: 'Form verification status updated successfully'})
          this.router.navigate(['../'], {relativeTo: this.route})
        }, error: (err) => {
          let message = 'Unexpected error encountered. Please try again';
          if (err.status && err.status == 404) {
            message = 'Material request verification status already updated';
          }

          if (err.status && err.status == 403) {
            message = 'You do not have required permissions to perform the action';
          }

          this.toastService.show({
            message,
            type: 'danger'
          })
        }
      })

  }

  ngOnDestroy(): void {
    this._subscriptions.map((s) => s.unsubscribe())
  }
}

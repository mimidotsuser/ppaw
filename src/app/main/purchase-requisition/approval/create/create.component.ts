import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, Subscription } from 'rxjs';
import {
  PRStage,
  PurchaseRequestItemModel,
  PurchaseRequestModel
} from '../../../../models/purchase-request.model';
import { PurchaseRequisitionService } from '../../services/purchase-requisition.service';
import { PaginationModel } from '../../../../models/pagination.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {

  formSubmissionBusy = false;
  pagination: PaginationModel = {total: 0, page: 1, limit: 25}
  private _subscriptions: Subscription[] = []
  form: FormGroup;
  model?: PurchaseRequestModel;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router,
              private purchaseRequisitionService: PurchaseRequisitionService) {

    this.loadRequest();

    this.form = this.fb.group({
      remarks: this.fb.control(null),
      items: this.fb.array([])
    });

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

  get requestItems(): PurchaseRequestItemModel[] {
    return !this.model?.items ? [] : this.model.items
      .filter((item) => item.verified_qty || 0 > 0)
  }

  get authorName() {
    return `${this.model?.created_by?.first_name || ''} ${this.model?.created_by?.last_name || ''}`
  }

  get requesterRemarks() {
    const obj = this.model?.activities!.find((log) => log.stage === PRStage.REQUEST_CREATED);
    return obj ? obj.remarks : ''
  }

  get verificationInfo(): { remarks: string, author: string } {
    const obj = this.model?.activities!.find((log) => log.stage === PRStage.VERIFIED_OKAYED);
    return (obj && obj?.remarks) ? {
      remarks: obj.remarks,
      author: `${obj.created_by?.first_name || ''} ${obj.created_by?.last_name || ''}`
    } : {remarks: '', author: ''}
  }

  get allocationForm(): FormArray {
    return this.form.get('items') as FormArray
  }


  loadRequest() {
    this.subSink = this.purchaseRequisitionService
      .fetchRequestPendingApproval(this.route.snapshot.params[ 'id' ])
      .subscribe({
        next: (model) => {
          this.model = model;
          this.pagination.total = model.items.length;
        },
        error: (e) => {
          if (e.status === 403) {
            this.router.navigate(['../../../not-authorized'], {relativeTo: this.route})
          } else if (e.status === 404) {
            this.router.navigate(['../../../not-found'], {relativeTo: this.route})
          }
        }
      });
  }

  itemAllocationFormOrCreate(item: PurchaseRequestItemModel): FormGroup {
    let group = (this.allocationForm.controls as FormGroup[])
      .find((group) => group.get('id')?.value === item.id);
    if (group) {
      return group;
    }

    //create and push it to the form array

    this.allocationForm.push(this.fb.group({
      id: this.fb.control(item.id),
      approved_qty: this.fb.control(item.verified_qty, {
        validators: [Validators.required, Validators.min(0), Validators.max(item.verified_qty!)]
      })
    }));
    return this.allocationForm.controls[ this.allocationForm.length - 1 ] as FormGroup;
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid || !this.model?.id) {return}

    this.formSubmissionBusy = true;
    this.subSink = this.purchaseRequisitionService
      .createApprovalRequest(this.model.id, this.form.value)
      .pipe(finalize(() => this.formSubmissionBusy = false))
      .subscribe(() => {
        this.router.navigate(['../'], {relativeTo: this.route})
          .then(() => {
            //show success message
          })
      })
  }

  ngOnDestroy(): void {
    this._subscriptions.map((x) => x.unsubscribe())
  }

}

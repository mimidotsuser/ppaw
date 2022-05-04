import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {
  GoodsReceiptNoteItemModel,
  GoodsReceiptNoteModel,
  GRNReceiptNoteStage
} from '../../../../models/goods-receipt-note.model';
import { InspectionNoteService } from '../../services/inspection-note.service';
import { PaginationModel } from '../../../../models/pagination.model';
import { ProductModel } from '../../../../models/product.model';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {

  faTrashAlt = faTrashAlt
  formSubmissionBusy = false;
  private _subscriptions: Subscription[] = [];
  pagination: PaginationModel = {page: 1, limit: 25, total: 0};
  model?: GoodsReceiptNoteModel;
  form!: FormGroup;

  constructor(private route: ActivatedRoute, private inspectionService: InspectionNoteService,
              private fb: FormBuilder, private router: Router, private toastService: ToastService) {

    this.subSink = this.inspectionService.fetchRequest(this.route.snapshot.params[ 'id' ])
      .subscribe({
        next: (model) => {
          this.model = model;
          this.pagination.total = this.model.items.length;
          model.items.map((item) => this.renderInspectionItemsFormGroup(item));
        },
        error: (e) => {
          if (e.status === 403) {
            this.router.navigate(['../../../not-authorized'], {relativeTo: this.route})
          } else if (e.status === 404) {
            this.router.navigate(['../../../not-found'], {relativeTo: this.route})
          } else {
            this.toastService.show({
              message: 'Unexpected error encountered. Please try again',
              type: 'danger'
            })
          }
        }
      });

    this.initMainForm()
    //create at least one checklist form group
    this.createChecklistItemFormGroup()
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

  get authorName(): string {
    return `${this.model?.created_by?.first_name || ''} ${this.model?.created_by?.last_name || ''}`
  }

  get requesterRemarks(): string {
    if (!this.model?.activities) {return ''}
    return this.model?.activities
      .find((log) => log.stage === GRNReceiptNoteStage.REQUEST_CREATED)
      ?.remarks || ''
  }

  /**
   * Inspection
   */
  get inspectionItemsForm(): FormArray {
    return this.form.get('items') as FormArray;
  }

  initMainForm() {
    this.form = this.fb.group({
      remarks: this.fb.control(null, {validators: [Validators.required]}),
      checklist: this.fb.array([]),
      items: this.fb.array([])
    });
  }

  renderInspectionItemsFormGroup(item: GoodsReceiptNoteItemModel) {
    const group = this.fb.group({
      item_id: this.fb.control(item.id),
      product: this.fb.control(item.product),
      delivered_qty: this.fb.control(item.delivered_qty),
      rejected_qty: this.fb.control(0, {
        validators: [
          Validators.required, Validators.min(0), Validators.max(item.delivered_qty)
        ]
      }),
    });

    this.inspectionItemsForm.push(group);
  }


  get inspectionChecklistForm(): FormArray {
    return this.form.get('checklist') as FormArray;
  }

  createChecklistItemFormGroup() {
    const group = this.fb.group({
      feature: this.fb.control(null, {validators: [Validators.required]}),
      passed: this.fb.control(true, {validators: [Validators.required]})
    });

    this.inspectionChecklistForm.push(group);
  }

  removeChecklistItemFormGroup(index: number) {
    this.inspectionChecklistForm.removeAt(index);
  }

  submitForm() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {return;}

    const payload = this.form.value;

    payload.items = (payload.items as ItemInspectionForm[])
      .map((item) => ({rejected_qty: item.rejected_qty, item_id: item.item_id}))

    payload[ 'goods_receipt_note_id' ] = this.model?.id;

    this.formSubmissionBusy = true;
    this.subSink = this.inspectionService.create(payload)
      .pipe(finalize(() => this.formSubmissionBusy = false))
      .subscribe({
        next: () => {
          this.toastService.show({message: 'Inspection note created successfully'})
          this.router.navigate(['../../'], {relativeTo: this.route})

        }, error: (err) => {
          let message = 'Unexpected error encountered. Please try again';

          if (err.status && err.status == 404) {
            message = 'Inspection note already created!';
          }
          if (err.status && err.status == 403) {
            message = 'You do not have required permissions to perform the action';
          }

          this.toastService.show({message, type: 'danger'})
        }
      })
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }
}

interface ItemInspectionForm {
  item_id: number
  product: ProductModel
  delivered_qty: number
  rejected_qty: number
}

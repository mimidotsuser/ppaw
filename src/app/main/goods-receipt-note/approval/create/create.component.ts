import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';
import {
  GoodsReceiptNoteItemModel,
  GoodsReceiptNoteModel,
  GRNReceiptNoteStage
} from '../../../../models/goods-receipt-note.model';
import { PaginationModel } from '../../../../models/pagination.model';
import { GoodsReceiptNoteService } from '../../services/goods-receipt-note.service';
import { InspectionChecklistModel, InspectionModel } from '../../../../models/inspection.model';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {

  formSubmissionBusy = false;
  pagination: PaginationModel = {page: 1, limit: 25, total: 0};
  private _subscriptions: Subscription[] = [];
  model?: GoodsReceiptNoteModel & { inspection_note: InspectionModel };
  form!: FormGroup;
  remarks: FormControl;

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder,
              private goodsReceiptNoteService: GoodsReceiptNoteService,
              private toastService: ToastService) {

    this.subSink = this.goodsReceiptNoteService
      .fetchRequestPendingApproval(this.route.snapshot.params[ 'id' ])
      .subscribe({
        next: (model) => {
          this.model = model;
          this.pagination.total = this.model.items.length;
        }, error: (e) => {
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

    this.remarks = this.fb.control('N/A');
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

  get inspectionRemarks(): string {
    if (!this.model?.activities) {return ''}
    return this.model?.activities
      .find((log) => log.stage === GRNReceiptNoteStage.INSPECTION_DONE)
      ?.remarks || ''
  }

  get items(): GoodsReceiptNoteItemModel[] {
    return !this.model || !this.model.items ? [] : this.model.items;
  }

  get inspectionChecklist(): InspectionChecklistModel[] {
    return this.model?.inspection_note?.checklist ? this.model.inspection_note.checklist : []
  }

  submitForm(approved = true) {
    const payload = {
      approved: approved,
      remarks: this.remarks.value
    }
    this.formSubmissionBusy = true;
    this.subSink = this.goodsReceiptNoteService.createApproval(this.model!.id, payload)
      .pipe(finalize(() => this.formSubmissionBusy = false))
      .subscribe({
        next: () => {
          this.toastService.show({message: 'Form approval status updated successfully'})
          this.router.navigate(['../../'], {relativeTo: this.route})
        },
        error: (err) => {
          let message = 'Unexpected error encountered. Please try again';

          if (err.status && err.status == 404) {
            message = 'Request approval status already updated!';
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

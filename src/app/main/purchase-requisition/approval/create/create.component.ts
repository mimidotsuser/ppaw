import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  PRStage,
  PurchaseRequestItemModel,
  PurchaseRequestModel
} from '../../../../models/purchase-request.model';
import { PurchaseRequisitionService } from '../../services/purchase-requisition.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  model: PurchaseRequestModel | null = null;
  form: FormGroup;
  subscriptions: Subscription[] = []

  constructor(private route: ActivatedRoute, private fb: FormBuilder,
              private prService: PurchaseRequisitionService) {

    const x = this.prService.findById(route.snapshot.params[ 'id' ])
      .subscribe((value => this.model = value));

    this.form = this.fb.group({
      remarks: new FormControl(),
      accepted: new FormArray([])
    });

    this.subscriptions.push(x);
  }

  ngOnInit(): void {
  }

  formatRequestId(orderId: number): string {
    return this.prService.formatRequestId(orderId);
  }

  get authorName() {
    return `${this.model?.created_by?.first_name || ''} ${this.model?.created_by?.last_name || ''}`
  }

  get requesterRemarks() {
    const obj = this.model?.logs!.find((log) => log.stage === PRStage.CREATE);
    return obj ? obj.remarks : ''
  }

  get verificationInfo(): { remarks: string, author: string } {
    const obj = this.model?.logs!.find((log) => log.stage === PRStage.VERIFY);
    return obj ? {
      remarks: obj.remarks,
      author: `${obj.created_by?.first_name || ''} ${obj.created_by?.last_name || ''}`
    } : {remarks: '', author: ''}
  }

  get allocationForm(): FormArray {
    return this.form.get('accepted') as FormArray
  }

  itemAllocationFormOrCreate(item: PurchaseRequestItemModel): FormGroup {
    let group = (this.allocationForm.controls as FormGroup[])
      .find((group) => group.get('item_id')?.value === item.id);
    if (group) {
      return group;
    }

    //create and push it to the form array

    this.allocationForm.push(this.fb.group({
      item_id: new FormControl(item.id),
      qty_approved: new FormControl(item.qty_verified, {
        validators: [Validators.required, Validators.min(0), Validators.max(item.qty_verified)]
      })
    }));
    return this.allocationForm.controls[ this.allocationForm.length - 1 ] as FormGroup;
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      alert('Invalid data');
      return
    }
    //submit the form
  }

}

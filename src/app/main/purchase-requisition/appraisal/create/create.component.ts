import { Component, OnInit } from '@angular/core';
import { PurchaseRequisitionService } from '../../services/purchase-requisition.service';
import {
  PRStage,
  PurchaseRequestItemModel,
  PurchaseRequestModel
} from '../../../../models/purchase-request.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

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
    this.form = this.fb.group({
      remarks: this.fb.control(null),
      accepted: this.fb.array([])
    });

  }

  ngOnInit(): void {
  }


  get authorName() {
    return `${this.model?.created_by?.first_name || ''} ${this.model?.created_by?.last_name || ''}`
  }

  get requesterRemarks() {
    const obj = this.model?.activities!.find((log) => log.stage === PRStage.REQUEST_CREATED);
    return obj ? obj.remarks : ''
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
      item_id: this.fb.control(item.id),
      qty_approved: this.fb.control(item.requested_qty, {
        validators: [Validators.required, Validators.min(0), Validators.max(item.requested_qty)]
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

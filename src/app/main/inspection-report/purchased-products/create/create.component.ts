import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { PPCIModel, PPCItemModel } from '../../../../models/p-p-c-i.model';
import { InspectionService } from '../../services/inspection.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {

  model!: PPCIModel;
  form: FormGroup;
  faTrashAlt = faTrashAlt
  private _subscriptions: Subscription[] = []

  constructor(private route: ActivatedRoute, private inspectionService: InspectionService,
              private fb: FormBuilder) {

    this.form = this.fb.group({
      remarks: this.fb.control(null),
      checkin_type: this.fb.control('PURCHASED_PRODUCT'),
      inspection_checklist: this.fb.array([]),
      inspection_items: this.fb.array([])
    });
    //create at least one checklist form group
    this.createChecklistItemFormGroup()
  }

  ngOnInit(): void {
    this.subSink = this.inspectionService.fetchProductCheckInById(this.route.snapshot.params[ 'id' ])
      .subscribe((model) => {
        this.model = model;
        model.items.map((item) => this.addInspectionItemFormGroup(item));
      });
  }

  get authorName(): string {
    return `${this.model?.created_by?.first_name || ''} ${this.model?.created_by?.last_name || ''}`
  }

  get requesterRemarks(): string {
    return this.model?.logs!
      .find((log) => log.stage === 'RECEIVED')?.remarks || ''
  }

  set subSink(value: Subscription) {
    this._subscriptions.push(value);
  }

  /**
   * Inspection
   */
  get inspectionItemsForm(): FormArray {
    return this.form.get('inspection_items') as FormArray;
  }

  addInspectionItemFormGroup(item: PPCItemModel) {
    const group = this.fb.group({
      product: this.fb.control(item.product),
      qty_received: this.fb.control(item.qty),
      qty_fit: this.fb.control(item.qty,
        {
          validators: [Validators.required, Validators.min(0), Validators.max(item.qty)]
        }
      ),
    });

    this.inspectionItemsForm.push(group);
  }


  get inspectionChecklistForm(): FormArray {
    return this.form.get('inspection_checklist') as FormArray;
  }

  createChecklistItemFormGroup() {
    const group = this.fb.group({
      feature: this.fb.control(null, {validators: [Validators.required]}),
      status: this.fb.control(true, {validators: [Validators.required]})
    });

    this.inspectionChecklistForm.push(group);
  }

  removeChecklistItemFormGroup(index: number) {
    this.inspectionChecklistForm.removeAt(index);
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {return;}

  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }
}

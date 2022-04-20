import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PaginationModel } from '../../../models/pagination.model';
import { StandbySpareCheckinService } from '../services/standby-spare-checkin.service';
import { MRFModel, MRFPurposeCode } from '../../../models/m-r-f.model';
import { ProductModel } from '../../../models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { StockBalanceActivityModel } from '../../../models/stock-balance-activity.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {

  pagination: PaginationModel = {total: 0, page: 1, limit: 15}
  private _subscriptions: Subscription[] = [];
  form: FormGroup;

  constructor(private fb: FormBuilder, private service: StandbySpareCheckinService,
              private router: Router, private route: ActivatedRoute) {
    this.form = this.fb.group({
      material_request: this.fb.control(null, {validators: Validators.required}),
      remarks: this.fb.control(''),
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

  get itemsFormArray() {
    return this.form.get('items') as FormArray;
  }

  itemFormGroup(obj: {
    product: ProductModel, approvedQty: number, initialQty: number,
    maxQty: number, groupId: string, received: number
  }) {
    return this.fb.group({
      product: this.fb.control(obj.product),
      approved_qty: this.fb.control(obj.approvedQty),
      max_qty: this.fb.control(obj.maxQty),
      qty: this.fb.control(obj.initialQty, {
        validators: [Validators.required, Validators.min(0), Validators.max(obj.maxQty)]
      }),
      group_id: this.fb.control(obj.groupId),
      received_qty: this.fb.control(obj.received)
    })
  }

  onMaterialRequestSelect() {
    this.itemsFormArray.clear();

    if (!this.form.value.material_request) {return}

    //fetch material request items
    this.subSink = this.service.fetchMaterialRequest((this.form.value.material_request as MRFModel).id)
      .subscribe({
        next: (model) => {
          const spareItems = model.items.filter((item) => {
            return item.product?.parent_id && item.purpose_code === MRFPurposeCode.STANDBY
          })

          if (spareItems.length === 0) {
            alert('Material Request has no standby spares')
          }
          //create form groups for each and push it to the items form array
          spareItems.map((item) => {
            if (!item.product) {return}
            const groupId = Math.random().toString(36).substr(3, 30);

            let alreadyReceivedQty = this.alreadyReceivedTotalQty(model, item.product_id) || 0;

            item.product?.variants?.map((variant) => {
              this.itemsFormArray.push(this.itemFormGroup({
                product: variant,
                approvedQty: item.approved_qty || 0,
                initialQty: 0,
                maxQty: (item.approved_qty || 0) - alreadyReceivedQty,
                received: this.aggregateReceived(model.balance_activities, variant.id),
                groupId
              }));
            });

            delete item.product?.variants;

            this.itemsFormArray.push(this.itemFormGroup({
              product: item.product,
              approvedQty: item.approved_qty || 0,
              initialQty: (item.approved_qty || 0) - alreadyReceivedQty,
              maxQty: (item.approved_qty || 0) - alreadyReceivedQty,
              received: this.aggregateReceived(model.balance_activities, item.product.id),
              groupId
            }))
          });

          this.pagination.total = this.itemsFormArray.length
        }
      })
  }

  alreadyReceivedTotalQty(model: MRFModel, parentId: number) {
    const variantsIds = model.items
      .find((item) => item.product_id === parentId)
      ?.product?.variants?.map((v) => v.id)
    return model.balance_activities!
      .filter((activity) => {
        if (variantsIds) {
          return variantsIds.includes(activity.product_id) || activity.product_id === parentId
        }
        return activity.product_id === parentId;
      })
      .reduce((acc, val) => acc += val.qty_in_after - val.qty_in_before, 0);

  }

  aggregateReceived(balance_activities: StockBalanceActivityModel[] | undefined, id: number) {
    if (!balance_activities) {return 0}
    return balance_activities!.filter((m) => m.product_id == id)
      .reduce((acc, val) => acc += val.qty_in_after - val.qty_in_before, 0)
  }

  synchronizeReceivedQty(group: FormGroup) {
    if (group.invalid) {return}
    const max = group.get('max_qty')?.value;
    const value = group.get('qty')?.value;

    (this.itemsFormArray.controls as FormGroup[])
      .map((controls, index) => {
        if (controls != group && controls.get('group_id')?.value === group.get('group_id')?.value) {
          controls.patchValue({qty: max - value})
        }
      })
  }

  submitForm() {
    const payload = {
      material_request_id: this.form.value.material_request.id,
      remarks: this.form.value.remarks,
      items: (this.form.value as CheckInFormModel).items
        .map((item) => ({product_id: item.product.id, qty: item.qty}))
    }
    this.subSink = this.service.create(payload)
      .subscribe({
        next: () => this.router.navigate(['../'], {relativeTo: this.route})
          .then(() => {

          })
      })
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }

}

interface CheckInFormModel {
  items: { product: ProductModel, qty: Number }[];
  material_request: MRFModel;
  remarks?: string
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { PurchaseOrderItemModel, PurchaseOrderModel } from '../../../models/purchase-order.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {
  form: FormGroup;
  private _subscriptions: Subscription[] = [];
  isBusy = false;
  faSpinner = faSpinner;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      purchase_order: this.fb.control(null,
        {validators: [Validators.required], updateOn: 'blur'}),
      reference_no: this.fb.control(null,
        {validators: [Validators.required]}),
      order_entries: this.fb.array([])
    });
  }

  ngOnInit(): void {
  }

  set subSink(subscription: Subscription) {
    this._subscriptions.push(subscription);
  }

  get orderEntriesForm(): FormArray {
    return this.form.get('order_entries') as FormArray;
  }

  createOrderEntryForm(obj: { item: PurchaseOrderItemModel, delivered: number }) {
    return this.fb.group({
      product: this.fb.control(obj.item.product),
      qty: this.fb.control(obj.item.qty - obj.delivered,
        {
          validators: [Validators.min(0), Validators.max(obj.item.qty - obj.delivered)]
        }),
      delivered_qty: this.fb.control(obj.delivered),
      po_qty: this.fb.control(obj.item.qty),
      po_item_id: this.fb.control(obj.item.id)
    })
  }

  onPurchaseOrderSelected(model: PurchaseOrderModel) {
    //clear the order entries form
    this.orderEntriesForm.clear();
    if (!model) {return}

    this.isBusy = true;

    //fetch Purchase Order items

  }

  renderPurchaseOrderItemsForm(deliveredItems: { [ key: string ]: number }) {
    this.isBusy = false;
    const lpo = this.form.value.purchase_order as PurchaseOrderModel;
    lpo.items.map((item) => {
      const deliveredQty = deliveredItems[ item.id ] || 0;
      this.orderEntriesForm.push(
        this.createOrderEntryForm({item, delivered: deliveredQty})
      )
    })

  }


  submitForm() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {return}
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }
}



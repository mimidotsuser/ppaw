import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { LPOItemModel, LPOModel } from '../../../../models/l-p-o.model';
import { PurchasedProductCheckinService } from '../../services/purchased-product-checkin.service';

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

  constructor(private fb: FormBuilder, private checkinService: PurchasedProductCheckinService) {
    this.form = this.fb.group({
      purchase_order: this.fb.control(null,
        {validators: [Validators.required], updateOn: 'blur'}),
      reference_no: this.fb.control(null,
        {validators: [Validators.required]}),
      order_entries: this.fb.array([])
    });

  }

  ngOnInit(): void {
    this.subSink = this.form.get('purchase_order')!
      .valueChanges
      .subscribe((value: LPOModel) => this.onPurchaseOrderSelected(value))

  }

  set subSink(subscription: Subscription) {
    this._subscriptions.push(subscription);
  }

  get orderEntriesForm(): FormArray {
    return this.form.get('order_entries') as FormArray;
  }

  createOrderEntryForm(obj: { item: LPOItemModel, delivered: number }) {
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

  onPurchaseOrderSelected(model: LPOModel) {

    //clear the order entries form
    this.orderEntriesForm.clear();
    if (!model) {return} //exit

    this.isBusy = true;
    this.subSink = this.checkinService.findPPCheckinByPO(model.id)
      .subscribe((res) => {
        //for each checkin, aggregate quantity for each item
        const aggregated = res.reduce((acc: { [ key: string ]: number }, checkin) => {
          checkin.items.map((item) => {
            acc[ item.po_item_id ] = (acc[ item.po_item_id ] || 0) + item.qty
          });
          return acc;
        }, {});

        //call method to create respective order items
        this.renderPurchaseOrderItemsForm(aggregated);
      })

  }

  renderPurchaseOrderItemsForm(deliveredItems: { [ key: string ]: number }) {
    this.isBusy = false;
    const lpo = this.form.value.purchase_order as LPOModel;
    lpo.items.map((item) => {
      const deliveredQty = deliveredItems[ item.id ] || 0;
      this.orderEntriesForm.push(
        this.createOrderEntryForm({item, delivered: deliveredQty})
      )
    })

  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {return}
    //todo submit the form
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }
}

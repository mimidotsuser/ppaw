import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';
import { PurchaseOrderItemModel, PurchaseOrderModel } from '../../../models/purchase-order.model';
import { ProductModel } from '../../../models/product.model';
import { WarehouseModel } from '../../../models/warehouse.model';
import { PaginationModel } from '../../../models/pagination.model';
import { GoodsReceiptNoteService } from '../services/goods-receipt-note.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {
  loadingMainContent = false;
  formSubmissionBusy = false;
  pagination: PaginationModel = {page: 1, limit: 25, total: 0}
  private _subscriptions: Subscription[] = [];
  private _warehouses: WarehouseModel[] = [];
  form: FormGroup;

  constructor(private fb: FormBuilder, private goodsReceiptNoteService: GoodsReceiptNoteService,
              private toastService: ToastService) {
    this.form = this.fb.group({
      purchase_order: this.fb.control(null,
        {validators: [Validators.required]}),
      reference: this.fb.control(null,
        {validators: [Validators.required]}),
      items: this.fb.array([]),
      remarks: this.fb.control(null),
      warehouse: this.fb.control(null,
        {validators: [Validators.required]})
    });
  }

  ngOnInit(): void {
    this.subSink = this.goodsReceiptNoteService.fetchAllWarehouses
      .subscribe((m) => this._warehouses = m)
  }

  private set subSink(v: Subscription) {
    this._subscriptions.push(v);
  }

  get tableCountStart() {
    return (this.pagination.page - 1) * this.pagination.limit
  }

  get tableCountEnd() {
    return this.pagination.page * this.pagination.limit
  }

  get warehouses(): WarehouseModel[] {
    return this._warehouses;
  }

  get goodsReceiptNoteItemsForm(): FormArray {
    return this.form.get('items') as FormArray;
  }

  createGoodsReceiptNoteEntryForm(obj: { item: PurchaseOrderItemModel }) {
    const diff = obj.item.qty * (obj.item?.uom?.unit || 0) - (obj.item?.delivered_qty || 0)
    return this.fb.group({
      product: this.fb.control(obj.item.product),
      received_qty: this.fb.control(diff,
        {validators: [Validators.min(0), Validators.max(diff)]}),
      delivered_qty: this.fb.control((obj.item?.delivered_qty || 0)),
      po_item: this.fb.control(obj.item),
    })
  }

  onPurchaseOrderSelected() {
    //clear the order entries form
    this.goodsReceiptNoteItemsForm.clear();
    const model = this.form.value.purchase_order as PurchaseOrderModel;
    this.pagination.total = model?.items?.length || 0;

    if (!model) {return}
    this.loadingMainContent = true;

    model.items.map((item) => {
      this.goodsReceiptNoteItemsForm.push(
        this.createGoodsReceiptNoteEntryForm({item})
      )
    });
    this.loadingMainContent = false;

  }


  submitForm() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {return}

    const items = (this.form.value.items as GoodsReceivedItemFormModel[])
      .map((item) => {
        return {
          po_item_id: item.po_item?.id,
          product_id: item.product.id,
          delivered_qty: item.received_qty,
        }
      }).filter((item) => item.delivered_qty > 0);

    if (items.length === 0) {
      this.toastService.show({message: 'Received items not provided', type: 'danger'})
      return;
    }

    this.formSubmissionBusy = true;

    const payload = {
      warehouse_id: this.form.value.warehouse.id,
      purchase_order_id: this.form.value.purchase_order.id,
      reference: this.form.value.reference,
      remarks: this.form.value.remarks,
      items
    }
    this.subSink = this.goodsReceiptNoteService.create(payload)
      .pipe(finalize(() => this.formSubmissionBusy = false))
      .subscribe({
        next: () => {
          this.goodsReceiptNoteItemsForm.clear();
          this.form.reset();
          this.toastService.show({
            message: 'Goods receipt note created successfully. Request forwarded for inspection'
          })
        },
        error: (err) => {
          let message = 'Unexpected error encountered. Please try again';

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

interface GoodsReceivedItemFormModel {
  product: ProductModel,
  received_qty: number
  delivered_qty: number
  po_item: PurchaseOrderItemModel,
}


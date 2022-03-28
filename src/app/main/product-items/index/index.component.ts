import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { environment } from '../../../../environments/environment';
import {
  ProductItemActivityCategoryCode,
  ProductItemModel
} from '../../../models/product-item.model';
import { PaginationModel } from '../../../models/pagination.model';
import { ProductCategoryModel } from '../../../models/product-category.model';
import { ProductItemService } from '../services/product-item.service';
import { WarehouseModel } from '../../../models/warehouse.model';
import { serializeDate } from '../../../utils/serializers/date';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {

  faEllipsisV = faEllipsisV;
  private _productItems: ProductItemModel[] = [];
  private _subscriptions: Subscription[] = []
  private _productCategories: ProductCategoryModel[] = [];
  private _warehouses: WarehouseModel[] = [];
  pagination: PaginationModel = {total: 0, page: 1, limit: 25};
  _productItemLocations: { [ key: string ]: { title: string, value: string } } = {};
  showProductItemFormPopup = false;
  itemOutsideWarehouse = false;
  minAllowedWarrantEndDate?: string;
  searchInput: FormControl;
  form: FormGroup;


  constructor(private fb: FormBuilder, private productItemService: ProductItemService) {
    this.loadProductItems();

    this.searchInput = this.fb.control('');

    this.form = this.fb.group({
      id: this.fb.control(null),
      product: this.fb.control({}, [Validators.required]),
      serial_number: this.fb.control({}, [Validators.required]),

      customer: this.fb.control({}),
      contract: this.fb.control({}, []),
      purchase_order: this.fb.control({}, []),
      warrant_start: this.fb.control({}, []),
      warrant_end: this.fb.control({}, []),

      warehouse: this.fb.control({}, [Validators.required]),
      out_of_order: this.fb.control({}, [Validators.required]),
    });

    this._productItemLocations = {
      warehouse: {title: `Warehouse/${environment.app.name} store`, value: 'warehouse'},
      customer: {title: 'Customer Premises', value: 'customer'}
    }

  }

  ngOnInit(): void {
    this.subSink = this.productItemService.fetchAllProductCategories
      .subscribe((model) => this._productCategories = model);

    this.subSink = this.productItemService.fetchAllWarehouses
      .subscribe((model) => this._warehouses = model);

    this.subSink = this.form.get('warrant_start')!.valueChanges
      .subscribe((value) => {
        if (value) {
          try {
            this.minAllowedWarrantEndDate = serializeDate(value);
            this.form.get('warrant_end')?.patchValue(null);
          } catch (e) {}
        }

      })
  }

  loadProductItems() {
    //if data has already been loaded, don't re-fetch it
    if (this.tableCountEnd <= this._productItems.length) {
      return;
    }

    this.subSink = this.productItemService.fetch(this.pagination)
      .subscribe({
        next: (res) => {
          this._productItems = this._productItems.concat(res.data);
          this.pagination.total = res.total;
        }
      })

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

  get productItems() {
    return this._productItems;
  }

  get machineCategory(): ProductCategoryModel | undefined {
    return this._productCategories.find((c) => c.name.toLowerCase() === 'machine');
  }

  get productItemLocations() {
    return Object.keys(this._productItemLocations).map((k) => this._productItemLocations[ k ])
  }

  get warehouses() {
    return this._warehouses;
  }

  closeProductItemFormPopup() {
    if (this.form.dirty && !window.confirm('')) {
      return
    }
    this.showProductItemFormPopup = false;
  }

  openCreateForm(selectedModel?: ProductItemModel) {
    this.form.reset();
    if (selectedModel) {
      this.form.patchValue({}); //todo
    }
    this.showProductItemFormPopup = true;
  }

  locationFormChange() {
    this.itemOutsideWarehouse = !this.itemOutsideWarehouse;
    if (this.itemOutsideWarehouse) {
      this.form.get('customer')?.addValidators([Validators.required])
      this.form.get('warehouse')?.clearValidators();
      this.form.get('out_of_order')?.clearValidators();

    } else {
      this.form.get('warehouse')?.addValidators([Validators.required])
      this.form.get('out_of_order')?.addValidators([Validators.required])
      this.form.get('customer')?.clearValidators();

    }
    this.form.get('customer')?.updateValueAndValidity();
    this.form.get('warehouse')?.updateValueAndValidity();
    this.form.get('out_of_order')?.updateValueAndValidity();
  }

  submitForm() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {return}

    let payload: { [ key: string ]: string | number | boolean } = {
      product_id: this.form.value.product.id,
      serial_number: this.form.value.serial_number,
      purchase_order_id: this.form.value.purchase_order?.id,
      description: 'N/A',
      category_code: ProductItemActivityCategoryCode.INITIAL_ENTRY,
    };
    if (this.itemOutsideWarehouse) {

      payload = {
        customer_id: this.form.value.customer.id,
        warrant_start: this.form.value.warrant_start,
        warrant_end: this.form.value.warrant_start,
        contract_id: this.form.value.contract_id?.id,
        ...payload,
      }

    } else {
      payload = {
        warehouse_id: this.form.value.warehouse.id,
        out_of_order: this.form.value.out_of_order,
        ...payload
      }

    }


    if (this.form.value.id) {
      const $oldModel = this.productItems.find((x) => x.id === this.form.value.id);
      if ($oldModel && $oldModel.purchase_order_id !== payload[ 'purchase_order_id' ]) {
        //if old model had PO, and new one has none, decrement.
        payload[ 'increment_stock_by' ] = !!$oldModel.purchase_order_id &&
        !payload[ 'purchase_order_id' ] ? -1 : 1;
      }
      this.updateProductItem(this.form.value.id, payload);
    } else {
      //if the item is in good condition and there is no purchase order,
      if (payload[ 'out_of_order' ] === false && !payload[ 'purchase_order_id' ]) {
        payload[ 'increment_stock_by' ] = 1;
      }
      this.createProductItem(payload);
    }
  }

  createProductItem(payload: object) {
    this.subSink = this.productItemService.create(payload)
      .subscribe({
        next: (model) => {
          this.productItems.unshift(model);
          this.showProductItemFormPopup = false;
        }
      });
  }

  updateProductItem(id: number, payload: object) {
    this.subSink = this.productItemService.update(id, payload)
      .subscribe({
        next: (model) => {
          const index = this.productItems.findIndex((p) => p.id === model.id);
          if (index > -1) {
            this.productItems[ index ] = model;
          }
          this.showProductItemFormPopup = false;
        }
      });
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe());
  }
}

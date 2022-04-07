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
  showProductItemFormPopup = false;
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

      current_location: this.fb.control(this.productItemLocations[ 0 ].value,
        [Validators.required]),

      customer: this.fb.control({}),
      contract: this.fb.control({}, []),
      purchase_order: this.fb.control({}, []),
      warrant_start: this.fb.control({}, []),
      warrant_end: this.fb.control({}, []),

      warehouse: this.fb.control({}, [Validators.required]),
      out_of_order: this.fb.control({}, [Validators.required]),
    });


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
    return [
      {title: `${environment.app.name} Warehouses/stores`, value: 'warehouse'},
      {title: 'Customer Premises', value: 'customer'}
    ]
  }

  get itemOutsideWarehouse(): boolean {
    return this.form.value.current_location ?
      this.form.value.current_location !== this.productItemLocations[ 0 ].value :
      false;
  }

  get warehouses() {
    return this._warehouses;
  }

  closeProductItemFormPopup() {
    if (this.form.dirty && !window.confirm('Data not saved. Changes will be lost if you continue.')) {
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

  showEditItemForm(item: ProductItemModel) {
    this.form.patchValue({
      id: item.id,
      product: item.product,
      serial_number: item.serial_number,
      purchase_order: item.purchase_order
    });
    if (item.latest_activity?.location_type === 'customer') {
      this.form.patchValue({
        current_location: this.productItemLocations[ 1 ].value,
        customer: item.latest_activity?.location,
        warehouse: null
      })
    } else {
      this.form.patchValue({
        current_location: this.productItemLocations[ 0 ].value,
        warehouse: item.latest_activity?.location,
        customer: null,
        out_of_order: item.out_of_order,
      })
    }

    this.locationFormChange();

    this.form.clearValidators();
    this.form.updateValueAndValidity();
    this.form.get('product')?.addValidators(Validators.required);
    this.form.get('product')?.updateValueAndValidity();
    this.form.get('serial_number')?.addValidators(Validators.required);
    this.form.get('serial_number')?.updateValueAndValidity();

    this.showProductItemFormPopup = true;
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
        warrant_end: this.form.value.warrant_end,
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
      this.updateProductItem(this.form.value.id, payload);
    } else {
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

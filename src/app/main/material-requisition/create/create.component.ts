import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';
import { faEllipsisV, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { MRFPurposeCode } from '../../../models/m-r-f.model';
import { WorksheetModel } from '../../../models/worksheet.model';
import { CustomerModel } from '../../../models/customer.model';
import { ProductModel } from '../../../models/product.model';
import { ProductCategoryModel } from '../../../models/product-category.model';
import { MaterialRequisitionService } from '../services/material-requisition.service';
import { WarehouseModel } from '../../../models/warehouse.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit, OnDestroy {

  faEllipsisV = faEllipsisV;
  faSpinner = faSpinner;
  showPopupForm = false;
  loadingProductMaxQty = false;
  formSubmitting = false;
  private _subscriptions: Subscription[] = [];
  private _productCategories: ProductCategoryModel[] = [];
  private _formModelOnEdit: FormModel | null = null;
  private _formRequestItems: FormModel[] = [];
  private _warehouses: WarehouseModel[] = [];
  remarksControl: FormControl;
  warehouseControl: FormControl;

  searchInput: FormControl;
  form: FormGroup;

  constructor(private fb: FormBuilder, private requisitionService: MaterialRequisitionService) {
    this.form = this.fb.group({
      category: this.fb.control(null, {validators: [Validators.required]}),
      parent: this.fb.control(null),
      product: this.fb.control(null, {validators: [Validators.required]}),
      purpose: this.fb.control(null, {validators: [Validators.required]}),
      customer: this.fb.control(null, {validators: [Validators.required]}),
      qty: this.fb.control(1,
        {validators: [Validators.required, Validators.min(1)]}),
      worksheet: this.fb.control(null),
      maxQty: this.fb.control(0),
    });

    this.searchInput = this.fb.control('');
    this.remarksControl = this.fb.control('',
      {validators: Validators.maxLength(200)});
    this.warehouseControl = this.fb.control('',
      {validators: Validators.required});

  }

  ngOnInit(): void {

    this.subSink = this.requisitionService.fetchAllProductCategories
      .subscribe((categories) => {
        this._productCategories = categories;
        this.form.get('category')?.patchValue(this.machineCategory);
      });

    this.subSink = this.requisitionService.fetchAllWarehouses
      .subscribe((warehouses) => this._warehouses = warehouses)

    //on product category change,
    this.subSink = this.form.get('category')!.valueChanges
      .subscribe((val) => {
        //reset product
        this.form.get('product')?.reset();
        this.form.get('maxQty')?.patchValue(0);
        this.form.get('parent')?.reset();

        //if spare, disable product input
        if (this.spareCategorySelected) {
          this.form.get('product')?.disable();
        } else {
          this.form.get('product')?.enable();
        }
      });

    //On parent selection
    this.subSink = this.form.get('parent')!.valueChanges
      .subscribe((value) => {
        if (this.spareCategorySelected && !value) {
          this.form.get('product')?.disable();
        } else {
          this.form.get('product')?.enable();
        }
      });

  }

  set subSink(v: Subscription) {
    this._subscriptions.push(v);
  }

  get warehouses() {
    return this._warehouses;
  }

  get purposes(): { id: MRFPurposeCode, title: string }[] {
    const requestPurposes = [
      {id: MRFPurposeCode.SALE, title: 'Customer Sale'},
      {id: MRFPurposeCode.STANDBY, title: 'Standby'},
    ];

    if (this.spareCategorySelected) {
      requestPurposes.unshift({id: MRFPurposeCode.REPAIR, title: 'Machine Repair'})

    } else {
      requestPurposes.push(
        {id: MRFPurposeCode.DEMO, title: 'Customer Demo'},
        {id: MRFPurposeCode.LEASE, title: 'Customer Lease'})
    }
    return requestPurposes;
  }

  get requestItems(): FormModel[] {
    return this._formRequestItems;
  }

  get machineCategory(): ProductCategoryModel | undefined {
    return this._productCategories.find((c) => {
      return c.name.toLowerCase() === 'machine';
    });
  }

  get spareCategory(): ProductCategoryModel | undefined {
    return this._productCategories.find((c) => {
      return c.name.toLowerCase() === 'spare';
    });
  }

  get spareCategorySelected(): boolean {
    return this.form.get('category')?.value === this.spareCategory;
  }

  purposeOptionComparator(v1: { id: MRFPurposeCode }, v2: { id: MRFPurposeCode }) {
    return v1 && v2 ? v1.id === v2.id : false;
  }

  closePopup() {
    if (this._formModelOnEdit) {
      this._formRequestItems.push(this._formModelOnEdit);
    }
    this.showPopupForm = false;
  }

  showCreateForm(model: FormModel | null = null) {
    if (model) {
      this.form.patchValue(model);
      this._formModelOnEdit = model;
      this.removeSelectedItem(model);

      //can now update qty control validity
      this.form.get('qty')?.clearValidators();
      this.form.get('qty')?.addValidators([Validators.min(1),
        Validators.max(this.maxAllowedQty)]);
      this.form.get('qty')?.updateValueAndValidity();
    } else {
      this._formModelOnEdit = null;
      this.form.reset({category: this.machineCategory});
      this.form.get('maxQty')?.patchValue(0);
    }
    this.showPopupForm = true;
  }


  /***
   * When a product is selected (on the form),
   */
  onProductModelSelected() {
    //clear quantity field
    this.form.get('qty')?.patchValue(0);
    this.form.get('qty')?.clearValidators();

    //retrieve merged stock balances  if there is product selected
    if (!this.form.get('product')) {
      this.form.get('maxQty')?.patchValue(0);
      this.form.get('qty')?.addValidators([Validators.min(1)]);
      this.form.get('qty')?.addValidators([Validators.max(0)]);
      this.form.get('qty')?.updateValueAndValidity();
      this.loadingProductMaxQty = false

      return
    }
    this.loadingProductMaxQty = true

    this.subSink = this.requisitionService.fetchMaxAllowedRequestQty(this.form.value.product)
      .pipe(finalize(() => this.loadingProductMaxQty = false))
      .subscribe({
        next: (available) => {

          this.form.get('maxQty')?.patchValue(available); //must be done before adding max validator
          this.form.get('qty')?.addValidators([Validators.min(1)]);
          this.form.get('qty')?.addValidators([Validators.max(this.maxAllowedQty)]);
          this.form.get('qty')?.updateValueAndValidity();
        },
      })
  }

  removeSelectedItem(model: FormModel) {
    const index = this._formRequestItems.findIndex((item) => {
      return item.purpose === model.purpose && item.product.id === model.product.id
        && item.customer.id === model.customer.id;
    });
    if (index > -1) {
      this._formRequestItems.splice(index, 1);
    }
  }

  addItem() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {return}

    //check if it already exists
    const newItem = this.form.value as FormModel;

    const index = this._formRequestItems.findIndex((model) => {
      return model.customer.id === newItem.customer.id && model.purpose.id === newItem.purpose.id
        && model.product.id === newItem.product.id;
    });

    if (index > -1) {
      //only update the qty
      this._formRequestItems[ index ].qty += newItem.qty;
    } else {
      this._formRequestItems.push(newItem);
    }

    this.showPopupForm = false;
  }

  /**
   * Calculate maximum allowed quantity for the product currently on the form.
   * The maxQty must have been set beforehand
   */
  get maxAllowedQty() {
    if (!this.form.value.product || this.form.value.maxQty == 0) {return 0}

    const qtyAlreadyTaken = this._formRequestItems.reduce((acc, model) => {
      if (this.form.value.product.id === model.product.id) {
        acc += model.qty;
      }
      return acc;
    }, 0);

    return this.form.value.maxQty - qtyAlreadyTaken;
  }

  submitForm() {
    this.remarksControl.markAllAsTouched();
    this.warehouseControl.markAllAsTouched();
    if (this.remarksControl.invalid || this.warehouseControl.invalid) {
      return
    }

    const payload = {
      warehouse_id: this.warehouseControl.value.id,
      remarks: this.remarksControl.value,
      items: this._formRequestItems.map((item) => {
        return {
          product_id: item.product.id,
          customer_id: item.customer.id,
          worksheet_id: item.worksheet?.id,
          purpose_code: item.purpose.id,
          requested_qty: item.qty
        }
      })
    }

    this.formSubmitting = true;
    this.subSink = this.requisitionService.create(payload)
      .pipe(finalize(() => this.formSubmitting = false))
      .subscribe({
        next: () => {
          this._formRequestItems = [];
          this.remarksControl.reset();
        }
      })
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }
}

interface FormModel {
  type: string;
  parent: null | ProductModel;
  product: ProductModel;
  purpose: { id: MRFPurposeCode, title: string };
  customer: CustomerModel;
  worksheet: null | WorksheetModel;
  qty: number;
  maxQty: number;
}

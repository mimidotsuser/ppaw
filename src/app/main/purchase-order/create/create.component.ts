import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import { PurchaseOrderService } from '../services/purchase-order.service';
import { VendorModel } from '../../../models/vendor.model';
import { VendorService } from '../../vendors/services/vendor.service';
import { RFQItemModel, RFQModel } from '../../../models/r-f-q.model';
import { ProductModel } from '../../../models/product.model';
import { CurrencyModel } from '../../../models/currency.model';
import { addDaysToDate } from '../../../utils/utils';
import { PaginationModel } from '../../../models/pagination.model';
import { UOMModel } from '../../../models/u-o-m.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {

  pagination: PaginationModel = {total: 0, page: 1, limit: 25};
  showAdhocLPOItemFormPopup = false;
  showCreateVendorFormPopup = false
  formSubmissionBusy = false;
  vendorFormSubmissionBusy = false
  currencies: CurrencyModel[] = [];
  private _vendors: VendorModel[] = [];
  private _uom: UOMModel[] = [];
  private _subscriptions: Subscription[] = [];
  adhocLPOItemForm!: FormGroup;
  form!: FormGroup;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router,
              private purchaseOrderService: PurchaseOrderService, private vendorService: VendorService) {


    this.initPurchaseOrderForm()
    this.initPurchaseOrderAdhocForm();
    this.preloadQuerySelectedRFQ();

  }

  ngOnInit(): void {

    this.subSink = this.vendorService.fetchAll()
      .subscribe((val) => this._vendors = val);

    this.subSink = this.purchaseOrderService.fetchCurrencies()
      .subscribe((val: CurrencyModel[]) => {
        this.currencies = val;
        const currency = val.find((curr) => curr.name.toLowerCase().includes('kenya'))
        this.form.patchValue({currency});

      });

    //fetch Unit of measure
    this.subSink = this.purchaseOrderService.fetchUnitOfMeasure
      .subscribe((data) => this._uom = data);
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

  get unitOfMeasure(): UOMModel[] {
    return this._uom;
  }

  get vendors(): VendorModel[] {
    return this._vendors;
  }

  get requestItemsForm(): FormArray {
    return this.form.get('items') as FormArray
  }

  get calcTotalPrice(): number {
    return (this.requestItemsForm.controls as FormGroup[])
      .reduce((acc, group) => {
        return acc += this.calcSubtotalPrice(group);
      }, 0);
  }

  calcSubtotalPrice(group: FormGroup) {
    return (group.get('uom')?.value?.unit || 0) *
      (group.get('qty')?.value || 0) *
      (group.get('unit_price')?.value || 0)
  }

  uomComparator(x1: UOMModel, x2: UOMModel) {
    return x1?.id === x2?.id
  }

  initPurchaseOrderForm() {
    const default_doc_validity = addDaysToDate(new Date(), 7, true)
      .toISOString().slice(0, 10);

    this.form = this.fb.group({
      rfq: this.fb.control(null),
      vendor: this.fb.control(null, {validators: [Validators.required]}),
      doc_validity: this.fb.control(default_doc_validity,
        {validators: [Validators.required]}),
      items: this.fb.array([],
        {validators: [Validators.minLength(1)]}),
      currency: this.fb.control(null, {validators: [Validators.required]})
    });
  }

  initPurchaseOrderAdhocForm() {
    this.adhocLPOItemForm = this.fb.group({
      product: this.fb.control(null, {validators: [Validators.required]}),
      qty: this.fb.control(1, {
        validators: [Validators.required, Validators.min(1)]
      }),
      unit_price: this.fb.control(0, {validators: [Validators.min(0)]}),
      uom: this.fb.control(0, {validators: [Validators.required]})
    });
  }

  preloadQuerySelectedRFQ() {
    //if rfq  is on url query params,
    if (this.route.snapshot.queryParams[ 'rfq' ]) {
      this.subSink = this.purchaseOrderService
        .findRFQById(this.route.snapshot.queryParams[ 'rfq' ], {
          include: 'items.product.balance'
        })
        .subscribe({
          next: (rfq) => {
            this.form.patchValue({rfq});
            this.bindRFQToLPOForm(rfq);
          },
          error: () => {
            //show error
            this.router.navigate([], {
              queryParams: {rfq: null},
              queryParamsHandling: 'merge'
            })
          }
        });
    }
  }


  createPurchaseOrderItemForm(product: ProductModel, obj?: {
    item?: RFQItemModel, qty: number, price: number, uom?: UOMModel
  }) {
    if (!obj) {
      obj = {qty: 0, price: 1};
    }
    return this.fb.group({
      rfq_item: this.fb.control(obj.item),
      product: this.fb.control(product),
      qty: this.fb.control(obj.qty, {
        validators: [Validators.min(obj.item ? 0 : 1), Validators.required]
      }),
      unit_price: this.fb.control(obj.price, {
        validators: [Validators.min(0), Validators.required]
      }),
      uom: this.fb.control(obj.uom, {validators: [Validators.required]}),
    });
  }

  /**
   * Get LPO item form index by product
   * @param product
   * @return index of the form or -1 if not found
   */
  getPurchaseOrderItemFormIndex(product: ProductModel): number {
    return (this.requestItemsForm.controls as FormGroup[])
      .findIndex((form) => {
        return (form.get('product')?.value as ProductModel)?.id === product.id
      });
  }

  /**
   * Add LPO item form group into Purchase request form (in a smart way)
   * @param product
   * @param RFQItem
   */
  addPurchaseOrderItemForm(product: ProductModel, RFQItem: RFQItemModel | null = null): FormGroup {
    //check if it exists first
    const index = this.getPurchaseOrderItemFormIndex(product);

    if (index > -1) {
      //delete the form group
      this.requestItemsForm.removeAt(index);
    }

    //if no order item, just create group and push it
    if (!RFQItem) {
      const group = this.createPurchaseOrderItemForm(product);
      this.requestItemsForm.push(group);
      return group;
    }

    const group = this.createPurchaseOrderItemForm(product, {
      item: RFQItem,
      qty: RFQItem.qty,
      uom: RFQItem.uom,
      price: 1
    });

    this.requestItemsForm.push(group);
    return group;

  }

  removeRFQItemsFromPurchaseOrderForm() {
    if (this.requestItemsForm.length == 0) {return;}
    for (let i = this.requestItemsForm.length - 1; i >= 0; i--) {
      if (this.requestItemsForm.at(i).get('rfq_item')?.value) {
        this.requestItemsForm.removeAt(i);
        this.pagination.total -= 1;
      }
    }
  }

  bindRFQToLPOForm(request: RFQModel) {
    //reset the form by removing any old associated items
    this.removeRFQItemsFromPurchaseOrderForm();
    //for each RFQ request item, create and push LPO item form
    request.items.forEach((item) => {
      this.addPurchaseOrderItemForm(item.product!, item);
      this.pagination.total += 1;
    })
  }


  onRFQRequestSelection() {
    //if RFQ is empty, reset the form (except for adhoc LPO items)
    if (!this.form.value.rfq) {
      this.removeRFQItemsFromPurchaseOrderForm();
      this.router.navigate([], {
        queryParams: {rfq: null},
        queryParamsHandling: 'merge'
      });
    } else {
      this.bindRFQToLPOForm(this.form.value.rfq);
      this.router.navigate([], {
        queryParams: {rfq: this.form.value.rfq.id},
        queryParamsHandling: 'merge'
      });
    }
  }

  purchaseOrderItemChecked($evt: Event, group: FormGroup) {
    if (($evt.target as HTMLInputElement).checked) {
      // reset the quantity
      group.patchValue({qty: group.get('rfq_item')?.value?.qty || 0});
    } else {
      const index = (this.requestItemsForm.controls as FormGroup[])
        .findIndex((form: FormGroup) => {
          return form.get('product')?.value?.id === group.get('product')?.value?.id
        });

      //remove the item if the form group has no RFQ order item
      if (!group.get('rfq_item')?.value) {
        this.requestItemsForm.removeAt(index);
        this.pagination.total -= 1;
      } else {
        //reset the quantity to zero
        this.requestItemsForm.at(index).patchValue({qty: 0});
      }
    }
  }

  showCreateVendorForm(selector: NgSelectComponent, form: FormGroup) {
    selector.close();
    form.reset();
    this.showCreateVendorFormPopup = true;
  }

  saveAdhocLPOItemForm() {
    this.adhocLPOItemForm.markAllAsTouched();
    if (this.adhocLPOItemForm.invalid) {return}

    //check if similar product item already exists
    const index = this.getPurchaseOrderItemFormIndex(this.adhocLPOItemForm.value.product);

    //if it exists, prompt the user if they want to overwrite the data
    if (index > -1) {
      if (!window.confirm('Similar product item already exist. Overwrite the quantity?')) {
        return;
      }
      //update the form group quantity and unit price
      this.requestItemsForm.at(index).patchValue({
        qty: this.adhocLPOItemForm.value.qty,
        unit_price: this.adhocLPOItemForm.value.unit_price,
        uom: this.adhocLPOItemForm.value.uom
      });
      this.showAdhocLPOItemFormPopup = false;
      this.adhocLPOItemForm.reset({qty: 1,});
    } else {
      const group = this.createPurchaseOrderItemForm(this.adhocLPOItemForm.value.product, {
        qty: this.adhocLPOItemForm.value.qty,
        price: this.adhocLPOItemForm.value.unit_price,
        uom: this.adhocLPOItemForm.value.uom

      });

      this.requestItemsForm.push(group);
      this.showAdhocLPOItemFormPopup = false;
      this.adhocLPOItemForm.reset({qty: 1});
      this.pagination.total += 1;
    }

  }

  submitPurchaseOrder(download = true) {
    this.form.markAllAsTouched();
    if (this.form.invalid) {return}

    const items = (this.form.value.items as PurchaseOrderItemFormModel[])
      .map((item) => {
        return {
          rfq_item_id: item.rfq_item?.id,
          product_id: item.product.id,
          qty: item.qty,
          unit_price: item.unit_price,
          unit_of_measure_id: item.uom.id
        }
      }).filter((item) => item.qty > 0);

    if (items.length == 0) {return;}

    const payload = {
      rfq_id: this.form.value.rfq?.id,
      doc_validity: this.form.value.doc_validity,
      vendor_id: this.form.value.vendor?.id,
      currency_id: this.form.value.currency?.id,
      items
    }

    this.formSubmissionBusy = true;
    this.subSink = this.purchaseOrderService.create(payload)
      .pipe(finalize(() => this.formSubmissionBusy = false))
      .subscribe({
        next: (model) => {
          this.requestItemsForm.clear();
          this.form.reset();

          this.router.navigate([], {
            queryParams: {rfq: null},
            queryParamsHandling: 'merge'
          }).finally(() => {
            if (download) {
              this.subSink = this.purchaseOrderService.download(model)
            }
          });

        }
      })
  }

  submitVendorForm(form: FormGroup) {
    form.markAllAsTouched();
    if (form.invalid) {
      return;
    }

    this.vendorFormSubmissionBusy = true;
    //submit the client data
    this.vendorService.create(form.value)
      .pipe(finalize(() => this.vendorFormSubmissionBusy = false))
      .subscribe((vendor: VendorModel) => {
        //add it into the RFQ form vendors list (set as selected)
        this._vendors = [...this.vendors, vendor];

        //single vendor. Set as selected
        this.form.get('vendor')?.patchValue(vendor)
        this.showCreateVendorFormPopup = false;
      })
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }
}

export interface PurchaseOrderItemFormModel {
  rfq_item?: RFQModel,
  product: ProductModel,
  qty: number,
  unit_price: number,
  uom: UOMModel
}

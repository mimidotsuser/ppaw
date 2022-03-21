import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import { PurchaseOrderService } from '../services/purchase-order.service';
import { VendorModel } from '../../../models/vendor.model';
import { VendorService } from '../../vendors/services/vendor.service';
import { RFQItemModel, RFQModel } from '../../../models/r-f-q.model';
import { ProductModel } from '../../../models/product.model';
import { addDaysToDate } from '../../../utils/utils';
import { CurrencyModel } from '../../../models/currency.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {
  form: FormGroup;
  adhocLPOItemForm: FormGroup;
  private subscriptions: Subscription[] = [];
  vendors: VendorModel[] = [];
  showAdhocLPOItemFormPopup = false;
  showCreateVendorFormPopup = false
  currencies: CurrencyModel[] = [];

  constructor(private fb: FormBuilder, private route: ActivatedRoute,
              private lpoService: PurchaseOrderService, private vendorService: VendorService) {

    const default_doc_validity = addDaysToDate(new Date(), 7, true)
      .toISOString().slice(0, 10);

    this.form = this.fb.group({
      rfq: this.fb.control(null),
      vendors: this.fb.control(null, {validators: [Validators.required]}),
      doc_validity: this.fb.control(default_doc_validity,
        {validators: [Validators.required]}),
      request_items: this.fb.array([],
        {validators: [Validators.minLength(1)]}),
      currency: this.fb.control(null, {validators: [Validators.required]})
    });

    this.adhocLPOItemForm = this.fb.group({
      product: this.fb.control(null, {validators: [Validators.required]}),
      qty: this.fb.control(1, {
        validators: [Validators.required, Validators.min(1)]
      }),
      unit_price: this.fb.control(0, {validators: [Validators.min(0)]})
    });

    //if rfq  is on url query params,
    if (route.snapshot.queryParams[ 'rfq' ]) {
      const x = this.lpoService.findRFQByInd(route.snapshot.queryParams[ 'rfq' ])
        .subscribe((rfq) => {
          this.form.patchValue({rfq});
          this.bindRFQToLPOForm(rfq);
        });
      this.subscriptions.push(x);
    }
  }

  ngOnInit(): void {
    const x = this.vendorService.fetchAll()
      .subscribe((val) => this.vendors = [...this.vendors, ...val]);
    const y = this.lpoService.fetchCurrencies()
      .subscribe((val: CurrencyModel[]) => {
        this.currencies = val;
        const currency = val.find((curr) => curr.name.toLowerCase().includes('kenya'))
        this.form.patchValue({currency});

      });

    this.subscriptions.push(x, y);
  }

  get aggregateOrderTotal(): string {
    return (this.requestItemsForm.controls as FormGroup[])
      .reduce((acc, group) => {
        return acc += group.value.qty * group.value.unit_price;
        }, 0).toString();
  }

  get requestItemsForm(): FormArray {
    return this.form.get('request_items') as FormArray
  }

  createLPOItemForm(product: ProductModel, obj?: { item: RFQItemModel | null, qty: number, price: number }) {
    if (!obj) {
      obj = {item: null, qty: 0, price: 1};
    }
    return this.fb.group({
      order_item: this.fb.control(obj.item),
      product: this.fb.control(product),
      qty: this.fb.control(obj.qty, {
        validators: [Validators.min(obj.item ? 0 : 1), Validators.required]
      }),
      unit_price: this.fb.control(obj.price, {
        validators: [Validators.min(0), Validators.required]
      }),
    });
  }

  /**
   * Get LPO item form index by product
   * @param product
   * @return index of the form or -1 if not found
   */
  getLPOItemFormIndex(product: ProductModel): number {
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
  addLPOItemForm(product: ProductModel, RFQItem: RFQItemModel | null = null): FormGroup {
    //check if it exists first
    const index = this.getLPOItemFormIndex(product);

    if (index > -1) {
      //delete the form group
      this.requestItemsForm.removeAt(index);
    }

    //if no order item, just create group and push it
    if (!RFQItem) {
      const group = this.createLPOItemForm(product);
      this.requestItemsForm.push(group);
      return group;
    }

    const group = this.createLPOItemForm(product, {
      item: RFQItem,
      qty: RFQItem.qty,
      price: 1
    });

    this.requestItemsForm.push(group);
    return group;

  }

  removeRFQItemsFromLPOForm() {
    (this.requestItemsForm.controls as FormGroup[])
      .map((group, index) => {
        if (group.get('order_item')?.value) {
          this.requestItemsForm.removeAt(index);
        }
      })
  }

  bindRFQToLPOForm(request: RFQModel) {
    //reset the form by removing any old associated items
    this.removeRFQItemsFromLPOForm();
    //for each RFQ request item, create and push LPO item form
    request.items.forEach((item) => {
      this.addLPOItemForm(item.product!, item);
    })
  }


  onRFQRequestSelection() {
    //if RFQ is empty, reset the form (except for adhoc LPO items)
    if (!this.form.value.rfq) {
      this.removeRFQItemsFromLPOForm();
    } else {
      this.bindRFQToLPOForm(this.form.value.rfq);
    }
  }

  lpoItemChecked($evt: Event, index: number, rfqItemModel?: RFQItemModel) {
    if (($evt.target as HTMLInputElement).checked) {
      // reset the quantity
      this.requestItemsForm.at(index).patchValue({qty: rfqItemModel?.qty || 0});
    } else {
      //remove the item if the form group has no RFQ order item
      if (!rfqItemModel) {
        this.requestItemsForm.removeAt(index);
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
    const index = this.getLPOItemFormIndex(this.adhocLPOItemForm.value.product);

    //if it exists, prompt the user if they want to overwrite the data
    if (index > -1) {
      if (!window.confirm('Similar product item already exist. Overwrite the quantity?')) {
        return;
      }
      //update the form group quantity and unit price
      this.requestItemsForm.at(index).patchValue({
        qty: this.adhocLPOItemForm.value.qty,
        unit_price: this.adhocLPOItemForm.value.unit_price
      });
      this.showAdhocLPOItemFormPopup = false;
      this.adhocLPOItemForm.reset({qty: 1,});
    } else {
      const group = this.createLPOItemForm(this.adhocLPOItemForm.value.product, {
        item: null,
        qty: this.adhocLPOItemForm.value.qty,
        price: this.adhocLPOItemForm.value.unit_price
      });

      this.requestItemsForm.push(group);
      this.showAdhocLPOItemFormPopup = false;
      this.adhocLPOItemForm.reset({qty: 1});
    }

  }

  submitPurchaseOrder() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return
    }

    //submit LPO and order items where quantity is greater than zero
  }

  submitVendorForm(form: FormGroup) {
    form.markAllAsTouched();
    if (form.invalid) {
      return;
    }

    //submit the client data
    this.vendorService.create(form.value)
      .subscribe((vendor: VendorModel) => {
        //add it into the RFQ form vendors list (set as selected)
        this.vendors = [...this.vendors, vendor];

        //single vendor. Set as selected
        this.form.get('vendors')?.patchValue(vendor)
        this.showCreateVendorFormPopup = false;
      })
  }

  ngOnDestroy(): void {
    this.subscriptions.map((sub) => sub.unsubscribe())
  }
}

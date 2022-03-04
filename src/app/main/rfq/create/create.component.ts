import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { addDaysToDate } from '../../../utils/utils';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import {
  PurchaseRequestItemModel,
  PurchaseRequestModel
} from '../../../models/purchase-request.model';
import { RqfService } from '../services/rqf.service';
import { ProductModel } from '../../../models/product.model';
import { VendorModel } from '../../../models/vendor.model';
import { VendorService } from '../../vendors/vendor-widgets/services/vendor.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  adhocRFQItemForm!: FormGroup;
  showAdhocRFQItemFormPopup = false;
  subscriptions: Subscription[] = [];
  showVendorCreateFormPopup = false;
  vendors: VendorModel[] = []

  constructor(private route: ActivatedRoute, private rfqService: RqfService,
              private fb: FormBuilder, private vendorService: VendorService) {

    //main form
    this.form = this.fb.group({
      purchase_request: this.fb.control(null, {validators: [Validators.required]}),
      closing_date: this.fb.control(
        addDaysToDate(new Date(), 7, true).toISOString().slice(0, 10)),
      request_items: this.fb.array([]),
      vendors: this.fb.control(null, {validators: [Validators.required]})
    });

    // Adhoc RFQ form
    this.adhocRFQItemForm = this.fb.group({
      product: this.fb.control(null, {validators: [Validators.required]}),
      qty: this.fb.control(1,
        {validators: [Validators.required, Validators.min(1)]})
    });

    //if purchase request id is available on url, preload.
    if (this.route.snapshot.queryParamMap.has('pr')) {
      const x = this.rfqService.findPRById(this.route.snapshot.queryParamMap.get('pr')!)
        .subscribe((p) => {
          this.form.patchValue({purchase_request: p});
          this.renderPurchaseRequestItemsForm(p)
        })
      this.subscriptions.push(x);
    }

  }

  ngOnInit(): void {
    //fetch vendors
    const x = this.vendorService.fetchAll()
      .subscribe((value) => {
        this.vendors = [...this.vendors, ...value];

      });
    this.subscriptions.push(x);
  }

  get requestItemsForm(): FormArray {
    return this.form.get('request_items') as FormArray;
  }

  createRFQItemForm(product: ProductModel, obj?: { pr_item: PurchaseRequestItemModel | null, qty: number }) {
    if (!obj) {
      obj = {pr_item: null, qty: 0};
    }
    return this.fb.group({
      order_item: this.fb.control(obj.pr_item),
      product: this.fb.control(product),
      qty: this.fb.control(obj.qty,
        {validators: [Validators.min(obj.pr_item ? 0 : 1), Validators.required]})
    });
  }

  /**
   * Get RFQ item form index by product
   * @param product
   * @return index of the form or -1 if not found
   */
  getRFQItemFormIndex(product: ProductModel): number {
    return (this.requestItemsForm.controls as FormGroup[])
      .findIndex((form) => {
        return (form.get('product')?.value as ProductModel).id === product.id
      });
  }

  addRFQItemForm(product: ProductModel, orderItem: PurchaseRequestItemModel | null = null): FormGroup {
    //check if it exists first
    const index = this.getRFQItemFormIndex(product);

    if (index > -1) {
      //delete the form group
      this.requestItemsForm.removeAt(index);
    }

    //if no order item, just create group and push it
    if (!orderItem) {
      const group = this.createRFQItemForm(product);
      this.requestItemsForm.push(group);
      return group;
    }

    const group = this.createRFQItemForm(product, {
      pr_item: orderItem,
      qty: orderItem.qty_approved
    });

    this.requestItemsForm.push(group);
    return group;

  }

  removePRItemsFromRFQItemsForm() {
    (this.requestItemsForm.controls as FormGroup[])
      .map((group, index) => {
        if (group.get('order_item')?.value) {
          this.requestItemsForm.removeAt(index);
        }
      })
  }

  renderPurchaseRequestItemsForm(request: PurchaseRequestModel) {
    //reset the form by removing any old associated items
    this.removePRItemsFromRFQItemsForm();
    //for each PR request, create and push RQFItem form
    request.items.forEach((item) => {
      this.addRFQItemForm(item.product, item);
    })
  }

  /**
   * On purchase request selection change
   *
   */
  onPurchaseRequestSelected() {
    //if there is no purchase, just reset the form
    if (!this.form.value.purchase_request) {
      this.removePRItemsFromRFQItemsForm();
    } else {
      this.renderPurchaseRequestItemsForm(this.form.value.purchase_request);
    }
  }

  saveAdhocItemForm() {
    this.adhocRFQItemForm.markAllAsTouched();
    if (this.adhocRFQItemForm.invalid) {return}

    //create line item form + push

    //check if it exists first
    const index = this.getRFQItemFormIndex(this.adhocRFQItemForm.value.product);

    //prompt the user if they want to overwrite the data

    if (index > -1) {
      if (!window.confirm('Similar product item already exist. Overwrite the quantity?')) {
        return;
      }
      //update the form group quantity
      this.requestItemsForm.at(index).patchValue({qty: this.adhocRFQItemForm.value.product});
      this.showAdhocRFQItemFormPopup = false;

    } else {
      const group = this.createRFQItemForm(this.adhocRFQItemForm.value.product, {
        pr_item: null,
        qty: this.adhocRFQItemForm.value.qty
      });
      this.requestItemsForm.push(group);
      this.showAdhocRFQItemFormPopup = false;
      this.adhocRFQItemForm.reset({qty: 1});
    }
  }

  rfqItemChecked($evt: Event, index: number, orderItem: PurchaseRequestItemModel | null) {
    if (($evt.target as HTMLInputElement).checked) {
      // reset the quantity

      this.requestItemsForm.at(index).patchValue({qty: orderItem?.qty_approved || 0});
    } else {
      //if the form group has not order item id, remove
      if (!orderItem) {
        this.requestItemsForm.removeAt(index);
      } else {
        //reset the quantity to zero
        this.requestItemsForm.at(index).patchValue({qty: 0});
      }
    }
  }

  submitRFQ() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return
    }
    //todo submit
  }

  showVendorForm(vendorSelector: NgSelectComponent, vendorForm: FormGroup) {
    vendorSelector.close();
    vendorForm.reset();
    this.showVendorCreateFormPopup = true;
  }

  submitVendor(form: FormGroup) {
    form.markAllAsTouched();
    if (form.invalid) {
      return;
    }

    //submit the client data
    this.vendorService.create(form.value)
      .subscribe((vendor: VendorModel) => {
        //add it into the RFQ form vendors list (set as selected)
        this.vendors = [...this.vendors, vendor];

        this.showVendorCreateFormPopup = false;
      })

  }


  ngOnDestroy(): void {
    this.subscriptions.map((sub) => sub.unsubscribe())
  }
}

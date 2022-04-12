import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addDaysToDate } from '../../../utils/utils';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import {
  PurchaseRequestItemModel,
  PurchaseRequestModel
} from '../../../models/purchase-request.model';
import { RequestForQuotationService } from '../services/request-for-quotation.service';
import { ProductModel } from '../../../models/product.model';
import { VendorModel } from '../../../models/vendor.model';
import { VendorService } from '../../vendors/services/vendor.service';
import { PaginationModel } from '../../../models/pagination.model';
import { UOMModel } from '../../../models/u-o-m.model';
import { serializeDate } from '../../../utils/serializers/date';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {

  showAdhocRFQItemFormPopup = false;
  showVendorCreateFormPopup = false;
  pagination: PaginationModel = {total: 0, page: 1, limit: 25}
  vendors: VendorModel[] = []
  private _subscriptions: Subscription[] = [];
  private _uom: UOMModel[] = [];
  form!: FormGroup;
  adhocRFQItemForm!: FormGroup;

  constructor(private route: ActivatedRoute, private rfqService: RequestForQuotationService, private router: Router,
              private fb: FormBuilder, private vendorService: VendorService) {

    this.loadPurchaseRequest();

    this.initRFQForm();
    this.initRFQAdhocForm();

  }

  ngOnInit(): void {
    //fetch vendors
    this.subSink = this.vendorService.fetchAll()
      .subscribe((value) => {
        this.vendors = [...this.vendors, ...value];
      });

    //fetch Unit of measure
    this.subSink = this.rfqService.fetchUnitOfMeasure
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

  get requestItemsForm(): FormArray {
    return this.form.get('request_items') as FormArray;
  }

  get unitOfMeasure(): UOMModel[] {
    return this._uom;
  }

  uomComparator(x1: UOMModel, x2: UOMModel) {
    return x1?.id === x2?.id
  }

  loadPurchaseRequest() {
    //if purchase request id is available on url, preload.
    if (this.route.snapshot.queryParamMap.has('pr')) {
      this.subSink = this.rfqService
        .findPurchaseRequestById(this.route.snapshot.queryParamMap.get('pr')!, {withoutRFQ: true})
        .subscribe({
          next: (purchaseRequest) => {
            this.form.patchValue({purchase_request: purchaseRequest});
            this.renderPurchaseRequestItemsForm(purchaseRequest);
            this.pagination.total = purchaseRequest?.items?.length;

          },
          error: () => {
            //show error
            this.router.navigate([], {
              queryParams: {pr: null},
              queryParamsHandling: 'merge'
            })
          }
        })
    }

  }

  initRFQForm() {
    //main form
    this.form = this.fb.group({
      purchase_request: this.fb.control(null,
        {validators: [Validators.required]}),
      closing_date: this.fb.control(
        addDaysToDate(new Date(), 7, true).toISOString().slice(0, 10)),
      request_items: this.fb.array([]),
      vendors: this.fb.control(null, {validators: [Validators.required]})
    });
  }

  initRFQAdhocForm() {
    // Adhoc RFQ form
    this.adhocRFQItemForm = this.fb.group({
      product: this.fb.control(null, {validators: [Validators.required]}),
      uom: this.fb.control(null, {validators: [Validators.required]}),
      qty: this.fb.control(1,
        {validators: [Validators.required, Validators.min(1)]})
    });
  }

  createRFQItemForm(product: ProductModel, obj?: { pr_item?: PurchaseRequestItemModel, qty: number, uom?: UOMModel }) {
    if (!obj) {
      obj = {pr_item: undefined, qty: 0, uom: undefined};
    }
    return this.fb.group({
      pr_item: this.fb.control(obj.pr_item),
      product: this.fb.control(product),
      uom: this.fb.control(obj.uom, {validators: [Validators.required]}),
      qty: this.fb.control(obj.qty,
        {validators: [Validators.min(obj.pr_item ? 0 : 1), Validators.required]})
    });
  }

  /**
   * Get RFQ item form index by product
   * @param product
   * @return index of the form or -1 if not found
   */
  getRFQItemFormIndexByProduct(product: ProductModel): number {
    return (this.requestItemsForm.controls as FormGroup[])
      .findIndex((form) => {
        return (form.get('product')?.value as ProductModel).id === product.id
      });
  }

  addRFQItemForm(product: ProductModel, orderItem?: PurchaseRequestItemModel): FormGroup {
    //check if it exists first
    const index = this.getRFQItemFormIndexByProduct(product);

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
      pr_item: orderItem!,
      qty: orderItem!.approved_qty!
    });

    this.requestItemsForm.push(group);
    return group;

  }

  removePRItemsFromRFQItemsForm() {
    if (this.requestItemsForm.length == 0) {return;}
    for (let i = this.requestItemsForm.length - 1; i >= 0; i--) {
      if (this.requestItemsForm.at(i).get('pr_item')?.value) {
        this.requestItemsForm.removeAt(i);
      }
    }
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
  onPurchaseRequestSelect() {
    //if there is no purchase, just reset the form
    if (!this.form.value.purchase_request) {
      this.pagination.total = 0;
      this.removePRItemsFromRFQItemsForm();
    } else {
      this.pagination.total = this.form.value?.purchase_request?.items?.length;
      this.renderPurchaseRequestItemsForm(this.form.value.purchase_request);
    }
  }

  addAdhocRFQItem() {
    this.adhocRFQItemForm.markAllAsTouched();
    if (this.adhocRFQItemForm.invalid) {return}

    //create line item form + push

    //check if it exists first
    const index = this.getRFQItemFormIndexByProduct(this.adhocRFQItemForm.value.product);

    //prompt the user if they want to overwrite the data

    if (index > -1) {
      if (!window.confirm('Similar product item already exist. Overwrite the quantity and UOM?')) {
        return;
      }
      //update the form group quantity
      this.requestItemsForm.at(index).patchValue({
        qty: this.adhocRFQItemForm.value.qty,
        uom: this.adhocRFQItemForm.value.uom
      });

      this.adhocRFQItemForm.reset({qty: 1});
      this.showAdhocRFQItemFormPopup = false;
    } else {
      const group = this.createRFQItemForm(this.adhocRFQItemForm.value.product, {
        qty: this.adhocRFQItemForm.value.qty,
        uom: this.adhocRFQItemForm.value.uom
      });
      this.requestItemsForm.push(group);
      this.showAdhocRFQItemFormPopup = false;
      this.adhocRFQItemForm.reset({qty: 1});
    }
  }

  rfqItemChecked($evt: Event, group: FormGroup) {
    if (($evt.target as HTMLInputElement).checked) {
      // reset the quantity

      group.patchValue({qty: group.get('pr_item')?.value?.approved_qty || 0});
    } else {
      const index = (this.requestItemsForm.controls as FormGroup[])
        .findIndex((form: FormGroup) => {
          return form.get('product')?.value?.id === group.get('product')?.value?.id
        });

      //if the form group has not order item id, remove
      if (!group.get('pr_item')?.value) {
        this.requestItemsForm.removeAt(index);
      } else {
        //reset the quantity to zero
        this.requestItemsForm.at(index).patchValue({qty: 0});
      }
    }
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
    this.subSink = this.vendorService.create(form.value)
      .subscribe((vendor: VendorModel) => {
        //add it into the RFQ form vendors list (set as selected)
        this.vendors = [...this.vendors, vendor];

        this.form.get('vendors')?.patchValue([...(this.form.value.vendors || []), vendor])
        this.showVendorCreateFormPopup = false;
      })

  }

  submitRFQForm(download = true) {
    this.form.markAllAsTouched();
    if (this.form.invalid) {return}

    const items = (this.form.value.request_items as RFQItemFormModel[])
      .map((item) => {
        return {
          purchase_request_item_id: item.pr_item?.id,
          product_id: item.product.id, qty: item.qty,
          unit_of_measure_id: item.uom.id
        }
      })
      .filter((item) => item.qty > 0);

    if (items.length === 0) {
      //show error
      return;
    }

    let payload = {
      vendors: (this.form.value.vendors as VendorModel[]).map((v) => ({id: v.id})),
      purchase_request_id: (this.form.value.purchase_request as PurchaseRequestModel).id,
      closing_date: serializeDate(this.form.value.closing_date),
      items
    }
    this.subSink = this.rfqService.create(payload)
      .subscribe({
        next: (model) => {

          this.requestItemsForm.clear();
          this.form.reset();

          this.router.navigate([], {
            queryParams: {pr: null},
            queryParamsHandling: 'merge'
          }).finally(() => {
            if (download) {
              this.subSink = this.rfqService.download(model);
            }
          })

        }
      })
  }


  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }
}

export interface RFQItemFormModel {
  pr_item?: PurchaseRequestItemModel,
  product: ProductModel,
  qty: number,
  uom: UOMModel
}

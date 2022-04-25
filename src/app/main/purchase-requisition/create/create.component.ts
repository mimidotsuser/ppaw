import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';
import { faFilter, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { ProductBalanceModel } from '../../../models/product-balance.model';
import { PurchaseRequisitionService } from '../services/purchase-requisition.service';
import { ProductModel } from '../../../models/product.model';
import { PaginationModel } from '../../../models/pagination.model';
import { WarehouseModel } from '../../../models/warehouse.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit, OnDestroy {


  faShoppingCart = faShoppingCart
  faFilter = faFilter
  showCartPopup = false;
  loadingMainContent = false;
  formSubmissionBusy = false;
  pagination: PaginationModel = {page: 1, limit: 25, total: 0}
  private _itemBalance: ProductBalanceModel[] = [];
  private _subscriptions: Subscription[] = [];
  private _warehouses: WarehouseModel[] = [];
  form: FormGroup;
  searchInput: FormControl;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute,
              private purchaseRequisitionService: PurchaseRequisitionService) {
    this.loadProductBalances();

    this.searchInput = this.fb.control('');
    this.form = this.fb.group({
      cart_items: this.fb.array([]),
      warehouse_id: this.fb.control(null,
        {validators: [Validators.required]}),
      remarks: this.fb.control(null,
        {validators: [Validators.required, Validators.max(250)]})
    });

  }

  ngOnInit(): void {
    this.subSink = this.purchaseRequisitionService.fetchAllWarehouses
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

  get itemsBalances(): ProductBalanceModel[] {
    return this._itemBalance;
  }

  loadProductBalances() {
    if (this.tableCountEnd <= this._itemBalance.length) {
      return;
    }
    this.loadingMainContent = true;
    this.subSink = this.purchaseRequisitionService.fetchProductBalances(this.pagination)
      .pipe(finalize(() => this.loadingMainContent = false))
      .subscribe({
        next: (res) => {
          this._itemBalance = res.data;
          this.pagination.total = res.total;
        }
      });
  }

  get warehouses(): WarehouseModel[] {
    return this._warehouses;
  }

  get cartForm(): FormArray {
    return this.form.get('cart_items') as FormArray
  }

  createFormGroup(productBalance: ProductBalanceModel) {
    return this.fb.group({
      physical_qty: this.fb.control(productBalance.stock_balance),
      product: this.fb.control(productBalance.product),
      request_qty: this.fb.control(productBalance.product?.economic_order_qty,
        {validators: [Validators.min(1), Validators.required]})
    })
  }

  requestForm(product: ProductModel): undefined | FormGroup {
    return (this.cartForm.controls as FormGroup[])
      .find((item) => (item.get('product')?.value as ProductModel)?.id === product.id)
  }

  addToCart(productBalance: ProductBalanceModel) {
    const group = this.createFormGroup(productBalance);
    this.cartForm.push(group);
  }

  updateOrderQty(product?: ProductModel, by = 10) {
    if (!product) {return;}
    const subForm = this.requestForm(product);
    if (!subForm) {return;}

    if (Number(subForm.get('request_qty')?.value) + by < 1) {
      //remove the form group from cart
      const index = this.cartForm.controls.indexOf(subForm);
      this.cartForm.removeAt(index);
    } else {
      subForm.get('request_qty')?.patchValue(Number(subForm.get('request_qty')?.value) + by)
    }

  }

  get totalItems(): number {
    return this.cartForm.length;
  }

  get totalQty(): number {
    return (this.cartForm.controls as FormGroup[])
      .reduce((acc, group) => {
        acc += (group.get('request_qty')?.value || 0)
        return acc;
      }, 0)
  }

  toggleCartPopup() {
    if (this.totalItems > 0) {
      this.showCartPopup = !this.showCartPopup;
    }
  }

  submitForm() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {return}

    const payload = {
      remarks: this.form.value.remarks,
      warehouse_id: this.form.value.warehouse_id,
      items: (this.form.value.cart_items as [])
        .map((item: { product: ProductModel, request_qty: number }) => {
          return {product_id: item.product.id, requested_qty: item.request_qty}
        })
    }
    this.formSubmissionBusy = true;
    this.subSink = this.purchaseRequisitionService.create(payload)
      .pipe(finalize(() => this.formSubmissionBusy = false))
      .subscribe({
        next: () => {
          this.form.reset();
          this.router.navigate(['../history'], {relativeTo: this.route})
            .then(() => {
              //show message
            })
        }
      })
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe());
  }

}

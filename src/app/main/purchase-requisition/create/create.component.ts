import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { faShoppingCart,faFilter } from '@fortawesome/free-solid-svg-icons';
import { SearchService } from '../../../shared/services/search.service';
import { ProductBalanceModel } from '../../../models/product-balance.model';
import { PurchaseRequisitionService } from '../services/purchase-requisition.service';
import { ProductModel } from '../../../models/product.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  providers: [SearchService]
})
export class CreateComponent implements OnInit {


  searchInput = new FormControl();
  _itemBalance: Observable<ProductBalanceModel[]> = new Observable();
  faShoppingCart = faShoppingCart
  faFilter = faFilter
  showCartPopup = false;
  //forms
  form: FormGroup;


  constructor(private searchService: SearchService<ProductBalanceModel>, private fb: FormBuilder,
              private prService: PurchaseRequisitionService) {
    this._itemBalance = this.prService.productBalances;

    this.form = this.fb.group({
      cart_items: new FormArray([]),
      remarks: new FormControl(null, {validators: [Validators.required]})
    });

  }

  ngOnInit(): void {
  }

  get itemsBalances(): Observable<ProductBalanceModel[]> {
    return this._itemBalance;
  }

  get cartForm(): FormArray {
    return this.form.get('cart_items') as FormArray
  }

  createFormGroup(productBalance: ProductBalanceModel) {
    return this.fb.group({
      physical_qty: new FormControl(productBalance.physical_balance),
      product: new FormControl(productBalance.product),
      request_qty: new FormControl(productBalance.product.eoq,
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

  updateOrderQty(productBalance: ProductBalanceModel, by = 10) {
    const subForm = this.requestForm(productBalance.product)!;

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
      //todo fix quantity bug before enabling the popup
      // this.showCartPopup = !this.showCartPopup;
    }
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      alert('Form has errors invalid');
      return
    }
  }

}

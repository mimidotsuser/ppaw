import { Component, OnDestroy, OnInit } from '@angular/core';
import { finalize, Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerContractService } from '../services/customer-contract.service';
import { ProductItemModel } from '../../../models/product-item.model';
import { ProductModel } from '../../../models/product.model';
import { CustomerModel } from '../../../models/customer.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {

  formSubmissionBusy = false;
  private _subscriptions: Subscription[] = [];

  constructor(private _route: ActivatedRoute, private contractService: CustomerContractService,
              private router: Router) {}

  ngOnInit(): void {
  }

  get route(): ActivatedRoute {return this._route}

  private set subSink(v: Subscription) {
    this._subscriptions.push(v);
  }


  submitForm(form: FormGroup) {
    form.markAllAsTouched();
    if (form.invalid) {return}

    this.formSubmissionBusy = true;
    const payload = {
      start_date: form.value.start_date,
      expiry_date: form.value.expiry_date,
      category_code: form.value.category.code,
      category_title: form.value.category.title,
      customer_id: form.value.customer.id,
      contract_items: (form.value.contract_items as CustomerContractFormModel[])
        .filter((item) => item.selected)
        .map((item) => ({product_item_id: item.productItem.id}))
    }

    this.subSink = this.contractService.create(payload)
      .pipe(finalize(() => this.formSubmissionBusy = false))
      .subscribe({
        next: () => {
          this.router.navigate(['../'], {relativeTo: this.route})
            .then(() => {

            })
        }
      })
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe());
  }
}

interface CustomerContractFormModel {
  selected: boolean
  searchableStatus: string
  productItem: ProductItemModel
  product: ProductModel
  location: CustomerModel
}

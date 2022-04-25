import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerContractService } from '../services/customer-contract.service';
import { FormGroup } from '@angular/forms';
import { ProductItemModel } from '../../../models/product-item.model';
import { ProductModel } from '../../../models/product.model';
import { CustomerModel } from '../../../models/customer.model';
import { CustomerContractModel } from '../../../models/customer-contract.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {

  private _subscriptions: Subscription[] = [];
  private _model?: CustomerContractModel;

  constructor(private _route: ActivatedRoute, private contractService: CustomerContractService,
              private router: Router) {
    this.subSink = this.contractService.fetchById(this.route.snapshot.params[ 'id' ])
      .subscribe({next: (model) => this._model = model})
  }

  ngOnInit(): void {
  }

  private set subSink(v: Subscription) {
    this._subscriptions.push(v);
  }

  get route(): ActivatedRoute {return this._route}

  get model() {
    return this._model ? this._model : null;
  }

  submitForm(form: FormGroup) {
    form.markAllAsTouched();
    if (form.invalid) {return}

    const payload = {
      start_date: form.value.start_date,
      expiry_date: form.value.expiry_date,
      category_code: form.value.category.code,
      category_title: form.value.category.title,
      customer_id: form.get('customer')?.value?.id,
      contract_items: (form.value.contract_items as CustomerContractFormModel[])
        .filter((item) => item.selected)
        .map((item) => ({product_item_id: item.productItem.id}))
    }

    this.subSink = this.contractService.update(this.route.snapshot.params[ 'id' ], payload)
      .subscribe({
        next: () => {
          this.router.navigate(['../../'], {relativeTo: this.route})
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

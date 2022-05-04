import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerContractService } from '../services/customer-contract.service';
import { FormGroup } from '@angular/forms';
import { ProductItemModel } from '../../../models/product-item.model';
import { ProductModel } from '../../../models/product.model';
import { CustomerModel } from '../../../models/customer.model';
import { CustomerContractModel } from '../../../models/customer-contract.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {

  private _subscriptions: Subscription[] = [];
  private _model?: CustomerContractModel;

  constructor(private _route: ActivatedRoute, private contractService: CustomerContractService,
              private router: Router, private toastService: ToastService) {
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
          this.toastService.show({message: 'Contract updated successfully'})
          this.router.navigate(['../../'], {relativeTo: this.route})
        }, error: (err) => {
          let message = 'Unexpected error encountered. Please try again';
          if (err.status && err.status == 403) {
            message = 'You do not have required permissions to perform the action';
          }
          if (err.status && err.status == 422) {
            message = err?.error && err.error?.message ? err.error.message : message;
          }

          this.toastService.show({message, type: 'danger'})
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

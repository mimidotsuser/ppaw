import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { concatMap, map, Observable, of, Subscription, tap } from 'rxjs';
import { PaginationModel } from '../../../../models/pagination.model';
import { CustomerContractService } from '../../services/customer-contract.service';
import { ProductItemModel } from '../../../../models/product-item.model';
import { CustomerModel } from '../../../../models/customer.model';
import { HttpResponseModel } from '../../../../models/response.model';
import { CustomerContractModel } from '../../../../models/customer-contract.model';

@Component({
  selector: 'app-customer-contract-form',
  templateUrl: './customer-contract-form.component.html',
  styleUrls: ['./customer-contract-form.component.scss']
})
export class CustomerContractFormComponent implements OnInit, OnDestroy {

  @Input() set model(value: CustomerContractModel | null) {
    this._model = value;
    this.patchForm();
  };

  isBusy = false;
  pagination: PaginationModel = {total: 0, page: 1, limit: 35}
  private _subscriptions: Subscription[] = [];
  private _model: CustomerContractModel | null = null;
  searchInput: FormControl;
  form: FormGroup;


  constructor(private fb: FormBuilder, private customerContractService: CustomerContractService) {
    this.form = this.fb.group({
      customer: this.fb.control(null, {validators: Validators.required}),
      category: this.fb.control(null, {validators: Validators.required}),
      start_date: this.fb.control(null, {validators: Validators.required}),
      expiry_date: this.fb.control(null, {validators: Validators.required}),
      contract_items: this.fb.array([], {validators: Validators.min(1)})
    });
    this.searchInput = this.fb.control(null);
  }

  ngOnInit(): void {
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

  get searchFields(): string[] {
    return ['value.searchableStatus', 'value.productItem', 'value.product', 'value.location']
  }

  get contractCategories() {
    return [{code: 'FULL', title: 'Full cover'}, {code: 'LABOUR_ONLY', title: 'Labour Only'}]
  }

  get contractId(): number | null {return this._model ? this._model.id : null}

  get contractItemsFormArray(): FormArray {
    return this.form.get('contract_items') as FormArray;
  }

  get totalSelectedItems(): number {
    return this.contractItemsFormArray.controls
      .filter((group) => group.value.selected)
      .length
  }

  get allItemsSelected() {
    return this.totalSelectedItems === this.contractItemsFormArray.length
  }

  coverTypeSelectComparator(a: { code: string }, b: { code: string }) {
    return a?.code === b?.code;
  }

  toggleProductItemSelection($evt: Event) {
    if (($evt.target as HTMLInputElement).checked) {
      (this.contractItemsFormArray.controls as FormGroup[])
        .map((group) => {group.patchValue({selected: true})})

    } else {
      (this.contractItemsFormArray.controls as FormGroup[])
        .map((group) => {group.patchValue({selected: false})})

    }
  }

  contractItemFormGroup(productItem: ProductItemModel & { location: CustomerModel, selected: boolean }) {
    return this.fb.group({
      selected: this.fb.control(productItem.selected),
      searchableStatus: this.fb.control(productItem.selected ? 'selected' : ''),
      productItem: this.fb.control(productItem),
      product: this.fb.control(productItem.product),
      location: this.fb.control(productItem?.location)
    })
  }

  onCustomerSelect() {
    if (!this.form.value.customer) {
      //allow user to modify contract owner
      if (this.contractId) {return}

      //clear the form if we are not editing the contract
      return this.contractItemsFormArray.clear();
    }

    this.contractItemsFormArray.clear();
    this.loadProductItems();
  }

  loadProductItems() {
    //if data has already been loaded, don't re-fetch it
    if (this.tableCountEnd <= this.contractItemsFormArray.length) {
      return;
    }

    this.isBusy = true;
    this.subSink = this.customerContractService
      .fetchCustomerProductItems(this.form.value.customer.id, this.pagination)
      .pipe(
        concatMap((customerProductItemsResponse) => {
          if (this.contractId) {
            //fetch contract items
            return this.loadContractItemsAndConcat(customerProductItemsResponse)
          }
          return of(customerProductItemsResponse);
        })
      )
      .pipe(tap(x => this.isBusy = false))
      .subscribe({
        next: (res) => {
          this.pagination.total = res.total;
          res.data.map((item) => {
            const group = this.contractItemFormGroup(item as any)
            this.contractItemsFormArray.push(group);

            this.subSink = group.get('selected')!.valueChanges
              .subscribe((selected) => {
                group.get('searchableStatus')?.patchValue(selected ? 'selected' : '');
              })
          })
        }
      })
  }

  private loadContractItemsAndConcat(res: HttpResponseModel<ProductItemModel>):
    Observable<HttpResponseModel<ProductItemModel & { selected: boolean, location: CustomerModel }>> {
    return this.customerContractService
      .fetchContractProductItems(this.contractId!,
        {ids: res.data.map((item) => item.id).join(',')})
      .pipe(map((customerProductItemsResponse) => {
        res.data.map((item) => {
          const index = customerProductItemsResponse.data
            .findIndex((x) => x.product_item_id == item.id);
          Object.assign(item, {selected: index > -1})
          return item;
        });
        return res as HttpResponseModel<ProductItemModel & { location: CustomerModel, selected: boolean }>;
      }))
  }

  patchForm() {
    if (!this._model) {return}

    this.form.patchValue({
      customer: this._model.customer,
      category: {code: this._model.category_code, title: this._model.category_title},
      start_date: new Date(this._model.start_date).toISOString().slice(0, 10),
      expiry_date: new Date(this._model.expiry_date).toISOString().slice(0, 10)
    });

    this.loadProductItems();
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe());
  }
}

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';
import { PaginationModel } from '../../../../models/pagination.model';
import { CustomerContractService } from '../../services/customer-contract.service';
import { ProductItemModel } from '../../../../models/product-item.model';
import { CustomerContractModel } from '../../../../models/customer-contract.model';

@Component({
  selector: 'app-customer-contract-form',
  templateUrl: './customer-contract-form.component.html',
  styleUrls: ['./customer-contract-form.component.scss']
})
export class CustomerContractFormComponent implements OnInit, OnDestroy {

  loadingMainContent = false;
  pagination: PaginationModel = {total: 0, page: 1, limit: 35}
  private _subscriptions: Subscription[] = [];
  private _model: CustomerContractModel | null = null;
  searchInput: FormControl;
  form: FormGroup;

  @Input()
  set model(value: CustomerContractModel | null) {
    this._model = value;
    this.patchForm();
  };

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
    return [
      {code: 'FULL', title: 'Comprehensive'},
      {code: 'LABOUR_ONLY', title: 'Labour Only'},
      {code: 'LEASE', title: 'Lease Cover'}
    ]
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
        .map((group) => {
          if (!group.get('selected')?.disabled) {
            group.patchValue({selected: true});
          }
        })

    } else {
      (this.contractItemsFormArray.controls as FormGroup[])
        .map((group) => {group.patchValue({selected: false})})

    }
  }

  contractItemFormGroup(productItem: ProductItemModel) {
    const contract = productItem?.latest_contracts ? productItem.latest_contracts[ 0 ] : null;
    const isSelected = this._model ? this._model.id === contract?.id : false;
    const canBeSelected = !contract || (this._model ? this._model?.id === contract?.id : false);

    return this.fb.group({
      selected: this.fb.control({value: isSelected, disabled: !canBeSelected}),
      searchableStatus: this.fb.control(isSelected && canBeSelected ? 'selected' : ''),
      productItem: this.fb.control(productItem),
      product: this.fb.control(productItem.product),
      location: this.fb.control(productItem?.latest_activity?.location)
    })
  }

  onCustomerSelect() {
    if (!this.form.value.customer) {
      //allow user to modify contract owner if contract id already exists
      if (this.contractId) {return}

      //clear the form if we are not editing the contract
      return this.contractItemsFormArray.clear();
    }

    this.contractItemsFormArray.clear();
    this.loadProductItems();
  }

  loadProductItems() {
    //if data has already been loaded, don't re-fetch it
    if (this.tableCountEnd <= this.contractItemsFormArray.length) {return;}

    this.loadingMainContent = true;
    this.subSink = this.customerContractService
      .fetchCustomerProductItems(this.form.get('customer')?.value?.id, this.pagination)
      .pipe(finalize(() => this.loadingMainContent = false))
      .subscribe({
        next: (res) => {
          this.pagination.total = res.total;
          res.data.map((item) => {
            const group = this.contractItemFormGroup(item)
            this.contractItemsFormArray.push(group);

            this.subSink = group.get('selected')!.valueChanges
              .subscribe((selected) => {
                group.get('searchableStatus')?.patchValue(selected ? 'selected' : '');
              })
          })
        }
      })
  }

  patchForm() {
    this.form.get('customer')?.enable();

    if (!this._model) {return}

    this.form.get('customer')?.disable();

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

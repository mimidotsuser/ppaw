import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, Subscription, tap } from 'rxjs';
import { faCartPlus, faSpinner, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { MRFItemModel, MRFModel, MRFStage } from '../../../../models/m-r-f.model';
import { CheckoutService } from '../../services/checkout.service';
import { PaginationModel } from '../../../../models/pagination.model';
import { addDaysToDate } from '../../../../utils/utils';
import { WarehouseModel } from '../../../../models/warehouse.model';
import { ProductItemModel } from '../../../../models/product-item.model';
import { serializeDate } from '../../../../utils/serializers/date';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit, OnDestroy {

  faCartPlus = faCartPlus;
  faTrashAlt = faTrashAlt;
  faSpinner = faSpinner;
  showIssueFormPopup = false;
  pagination: PaginationModel = {total: 0, page: 1, limit: 30};
  warehouses: WarehouseModel[] = [];
  private _subscriptions: Subscription[] = [];
  private _balances: ProductMeldedBalanceModel[] = []
  defaultWarrantStartDate: Date;
  defaultWarrantEndDate: Date;
  selectedItemToAllocate?: MRFItemModel;
  requestModel?: MRFModel;
  machineItemsFormArray: FormArray;
  spareItemsFormArray: FormArray;
  remarksControl: FormControl;

  constructor(private checkoutService: CheckoutService, private fb: FormBuilder,
              private route: ActivatedRoute, private router: Router) {

    this.subSink = this.checkoutService.findRequestById(this.route.snapshot.params[ 'id' ])
      .pipe(map((model) => {
        model.items = model.items.filter((item) => (item.approved_qty || 0) > 0)
          .map((item) => Object.assign(item, {cartButtonBusy: false}));
        return model;
      }))
      .pipe(tap((model) => this.pagination.total = model.items.length))
      .subscribe((v) => this.requestModel = v);

    this.defaultWarrantStartDate = new Date();
    this.defaultWarrantEndDate = addDaysToDate(this.defaultWarrantStartDate, 365)

    this.machineItemsFormArray = this.fb.array([]);
    this.spareItemsFormArray = this.fb.array([]);
    this.remarksControl = this.fb.control('N/A',
      {validators: [Validators.required]});

  }

  ngOnInit(): void {
    this.subSink = this.checkoutService.fetchAllWarehouses
      .subscribe((w) => this.warehouses = w)
  }

  get name() {
    return `${this.requestModel?.created_by?.first_name || ''}
         ${this.requestModel?.created_by?.last_name || ''}`
  }


  set subSink(value: Subscription) {
    this._subscriptions.push(value);
  }

  get tableCountStart() {
    return (this.pagination.page - 1) * this.pagination.limit
  }

  get tableCountEnd() {
    return this.pagination.page * this.pagination.limit
  }

  get requestItems(): MRFItemModel[] {
    return this.requestModel?.items ? this.requestModel.items : [];
  }

  get requesterRemarks() {
    const log = this.requestModel?.activities ? this.requestModel?.activities
      .find((log) => log?.stage === MRFStage.REQUEST_CREATED) : null;

    return log ? log.remarks : '';
  }

  get verifierRemarks() {
    const log = this.requestModel?.activities ? this.requestModel?.activities
      .find((log) => log?.stage === MRFStage.VERIFIED_OKAYED) : null;

    return log ? log.remarks : '';
  }

  get approverRemarks() {
    const log = this.requestModel?.activities ? this.requestModel?.activities
      .find((log) => log?.stage === MRFStage.APPROVAL_OKAYED) : null;
    return log ? log.remarks : '';
  }

  get selectedItemIsSpare(): boolean {
    return !!this.selectedItemToAllocate?.product?.parent_id;
  }

  get issueFormPopupTitle() {
    if (!this.selectedItemToAllocate) {
      return '';
    }
    if (this.selectedItemIsSpare) {
      return `Spare Requisition Allocation [${this.selectedItemToAllocate.product?.item_code}]`
    } else {
      return `Machine Requisition Allocation [${this.selectedItemToAllocate.product?.item_code}]`
    }
  }

  getWarehouseById(id?: number): WarehouseModel | undefined {
    if (!id) {return undefined}
    return this.warehouses.find((x) => x.id == id)
  }


  /** Machines form related logic**/

  private machineAllocationFormGroup(id: string, item: MRFItemModel) {
    return this.fb.group({
      id: this.fb.control(id),
      item_id: this.fb.control(item.id),
      product_id: this.fb.control(item.product_id),
      product_item: this.fb.control(null, {validators: [Validators.required]}),
      warrant_start: this.fb.control(this.defaultWarrantStartDate.toISOString().slice(0, 10)),
      warrant_end: this.fb.control(this.defaultWarrantEndDate.toISOString().slice(0, 10)),
    })
  }


  createMachineAllotmentFormGroup(itemModel: MRFItemModel): FormGroup {
    const id = Math.random().toString(36).substr(2);
    const group = this.machineAllocationFormGroup(id, itemModel);
    this.machineItemsFormArray.push(group);
    return group;
  }

  /**
   * Remove machine allocation item form group
   *
   * @param group: allocation group
   */
  removeMachineAllottedItemFormGroup(group: FormGroup) {
    const index = (this.machineItemsFormArray.controls as FormGroup[])
      .findIndex((form) => form.get('id')?.value === group.get('id')?.value);
    if (index > -1) {
      this.machineItemsFormArray.removeAt(index);
    }
  }

  machineAllocationArrayByItem(itemModel: MRFItemModel): FormGroup[] {
    const items = (this.machineItemsFormArray.controls as FormGroup[])
      .filter((group) => group.get('item_id')?.value === itemModel.id) as FormGroup[];
    if (items.length > 0) {
      return items;
    }
    return [this.createMachineAllotmentFormGroup(itemModel)];
  }

  /**
   * Get all selected product items
   * @param group
   */
  getSelectedMachineProductItems(group: FormGroup): ProductItemModel[] {
    //return all product items that matches the product_id of the group

    return ((this.machineItemsFormArray.controls as FormGroup[])
      .filter((g) => {
        return g.get('product_id')?.value === group.get('product_id')?.value &&
          g.get('product_item')?.value
      }) as FormGroup[])
      .map((group) => group.get('product_item')?.value as ProductItemModel)
  }

  /** 2. Spares form related logic **/

  private createSpareAllotmentItemForm(item: MRFItemModel) {
    return this.fb.group({
      item_id: this.fb.control(item.id),
      product_id: this.fb.control(item.product_id),
      approved_qty: this.fb.control(item.approved_qty || 0),
      old_total: this.fb.control(0),
      new_total: this.fb.control(item.approved_qty || 0),
    });
  }


  spareAllocationFormGroupByItem(itemModel: MRFItemModel): FormGroup {
    let group = (this.spareItemsFormArray.controls as FormGroup[])
      .find((group) => group.get('item_id')?.value === itemModel.id);

    if (!group) {
      //if the group doesn't exist, create one
      group = this.createSpareAllotmentItemForm(itemModel);
      this.spareItemsFormArray.push(group);
    }

    return group;
  }

  synchronizeSpareControlValues(group: FormGroup, fromOldTotalInput = true) {

    if (!group || !group.get('old_total') || !group.get('new_total')) {
      return;
    }

    if (fromOldTotalInput) {
      const diff = (group.get('approved_qty')?.value || 0) - (group.get('old_total')?.value || 0)
      group.get('new_total')?.patchValue(diff > -1 ? diff : 0)

    } else {
      const diff = (group.get('approved_qty')?.value || 0) - (group.get('new_total')?.value || 0)
      group.get('old_total')?.patchValue(diff > -1 ? diff : 0)
    }
  }

  updateSpareFormGroupValidations(item: MRFItemModel, balances: ProductMeldedBalanceModel) {
    const group = this.spareAllocationFormGroupByItem(item);
    if (!group) {return}


    const totalQtyAllocated = this.allocatedSpareBalancesByProductId(item);
    const approved = group.get('approved_qty')?.value || 0;


    const totalNewQtyAllocated = totalQtyAllocated.new_total - (group.get('new_total')?.value || 0);
    const totalOldQtyAllocated = totalQtyAllocated.old_total - (group.get('old_total')?.value || 0);


    const availableTotalNewQty = balances.parent_total - totalNewQtyAllocated;
    const availableTotalOldQty = balances.variant_total - totalOldQtyAllocated;

    group.get('new_total')?.clearValidators();
    group.get('new_total')?.setValidators([
      Validators.required, Validators.min(0),
      Validators.max(approved > availableTotalNewQty ? availableTotalNewQty : approved)]);
    group.get('new_total')?.updateValueAndValidity();

    group.get('old_total')?.clearValidators();
    group.get('old_total')?.setValidators([
      Validators.required, Validators.min(0),
      Validators.max(approved > availableTotalOldQty ? availableTotalOldQty : approved)]);
    group.get('old_total')?.updateValueAndValidity();
  }

  allocatedSpareBalancesByProductId(item: MRFItemModel): { new_total: 0, old_total: 0 } {
    return (this.spareItemsFormArray.controls as FormGroup[])
      .reduce((acc, group) => {
        if (group.get('product_id')?.value === item.product_id) {
          acc.old_total += (+group.get('old_total')?.value);
          acc.new_total += (+group.get('new_total')?.value);
        }
        return acc;
      }, {new_total: 0, old_total: 0})
  }

  showIssueForm(item: MRFItemModel) {
    this.selectedItemToAllocate = item;
    if (!this.selectedItemIsSpare) {
      this.showIssueFormPopup = true;
      return;
    }
    //check if we have respective balances

    let balances = this._balances.find((bal) => bal.product_id === item.product_id);

    if (balances) {
      this.updateSpareFormGroupValidations(item, balances);
      //update current form validity
      this.showIssueFormPopup = true;
    } else {

      //fetch spares balances for the item if not found
      item.cartButtonBusy = true;
      this.subSink = this.checkoutService.fetchMeldedBalances(item.product_id)
        .pipe(tap(() => item.cartButtonBusy = false))
        .subscribe({
          next: (productBalances) => {

            //aggregate the balances for variants and all parents (if more than 1 🤫)
            const aggregate = productBalances
              .reduce((acc, bal) => {
                if (bal.product?.variant_of_id) {
                  acc.variant_total += bal.stock_balance;
                } else {
                  acc.parents_total += bal.stock_balance;
                }
                return acc;
              }, {variant_total: 0, parents_total: 0})

            balances = {
              product_id: item.product_id,
              parent_total: aggregate.parents_total,
              variant_total: aggregate.variant_total
            }
            //push it to local balances array
            this._balances.push(balances)

            this.updateSpareFormGroupValidations(item, balances)
            //show the popup
            this.showIssueFormPopup = true;
          },
          error: () => false
        })
    }
  }

  closeIssueForm() {
    if (!this.selectedItemIsSpare) {
      this.saveMachineAllocationFormArray(false);
    }
  }

  saveSpareAllocationFormGroup(group: FormGroup) {
    group.markAllAsTouched();
    if (group.invalid) {return}

    const itemModel = this.requestItems
      .find((item) => item.id === group.get('item_id')?.value);

    if (itemModel) {
      itemModel.issued_qty = group.get('old_total')?.value + group.get('new_total')?.value;
      this.showIssueFormPopup = false;
    }
  }

  saveMachineAllocationFormArray(validateForm = true) {

    if (validateForm) {
      this.machineItemsFormArray.markAllAsTouched();
      if (this.machineItemsFormArray.invalid) {return}
    }

    const itemModel = this.requestItems
      .find((item) => item.id === this.selectedItemToAllocate?.id);

    if (itemModel) {
      itemModel.issued_qty = (this.machineItemsFormArray.controls as FormGroup[])
        .filter((group) => {
          return group.get('item_id')?.value === itemModel.id && group.get('product_item')?.value;
        }).length;
      this.showIssueFormPopup = false;
    }

  }

  submitIssueForm() {
    //verify all items have been issued
    const notIssued = this.requestModel!.items
      .find((item) => (item.approved_qty || 0) > (item.issued_qty || 0));

    if (notIssued) {
      alert('You have not issued all the items');
      return;
    }
    const payload = {
      remarks: this.remarksControl.value,
      items: {
        spares: (this.spareItemsFormArray.value as SpareItemAllocationFormModel[]),
        machines: (this.machineItemsFormArray.value as MachineItemAllocationFormModel[])
          .reduce((acc: { item_id: number, allocation: any[] }[], allocation) => {
            //check if already exists
            let group = acc.find((item) => item.item_id === allocation.item_id);
            if (!group) {
              group = {item_id: allocation.item_id, allocation: []};
              acc.push(group);
            }
            group.allocation.push({
              product_item_id: allocation.product_item.id,
              warrant_start: allocation.warrant_start ? serializeDate(allocation.warrant_start) : '',
              warrant_end: allocation.warrant_end ? serializeDate(allocation.warrant_end) : ''
            })
            return acc;
          }, [])
      }
    }

    this.subSink = this.checkoutService.create(this.requestModel!.id!, payload)
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

interface ProductMeldedBalanceModel {
  product_id: number
  parent_total: number
  variant_total: number
}

interface SpareItemAllocationFormModel {
  item_id: number
  product_id: number
  approved_qty: number
  old_total: number
  new_total: number
}

interface MachineItemAllocationFormModel {
  id: string
  item_id: number
  product_id: number
  product_item: ProductItemModel
  serial_number: string
  warrant_start: string | null
  warrant_end: string | null

}

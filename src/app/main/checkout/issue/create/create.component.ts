import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { faCartPlus, faSpinner, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { MRFItemModel, MRFModel, MRFStage } from '../../../../models/m-r-f.model';
import { CheckoutService } from '../../services/checkout.service';
import { ProductSerialModel } from '../../../../models/product-serial.model';
import { uniqueProductSerial } from '../../../../utils/validators/unique-product-serial';
import { PaginationModel } from '../../../../models/pagination.model';
import { addDaysToDate } from '../../../../utils/utils';
import { WarehouseModel } from '../../../../models/warehouse.model';
import { ProductBalanceModel } from '../../../../models/product-balance.model';

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
  cartButtonBusy = false;
  private _subscriptions: Subscription[] = [];
  pagination: PaginationModel = {total: 0, page: 1, limit: 30};
  warehouses: WarehouseModel[] = [];
  defaultWarrantStartDate: Date;
  defaultWarrantEndDate: Date;
  selectedOrderItem?: MRFItemModel;
  requestModel?: MRFModel;
  machineAllocationFormGroup: FormGroup;
  spareAllocationFormGroup: FormGroup;
  remarksControl: FormControl;

  constructor(private checkoutService: CheckoutService, private fb: FormBuilder,
              private route: ActivatedRoute, private router: Router) {

    this.subSink = this.checkoutService.findRequestById(this.route.snapshot.params[ 'id' ])
      .subscribe((v) => this.requestModel = v);

    this.defaultWarrantStartDate = new Date();
    this.defaultWarrantEndDate = addDaysToDate(this.defaultWarrantStartDate, 365)
    this.machineAllocationFormGroup = this.fb.group({
      machineOrderItems: this.fb.array([])
    });

    this.spareAllocationFormGroup = this.fb.group({
      allottedSpares: this.fb.array([])
    });
    this.remarksControl = this.fb.control('');

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

    if (!this.requestModel?.items) {return []}
    const passed = this.requestModel.items
      .filter((item) => (item.approved_qty || 0) > 0);
    this.pagination.total = passed.length;
    return passed;
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
    return !!this.selectedOrderItem?.product?.parent_id;
  }

  get issueFormPopupTitle() {
    if (!this.selectedOrderItem) {
      return '';
    }
    if (this.selectedItemIsSpare) {
      return `Spare Requisition Allocation [${this.selectedOrderItem.product?.item_code}]`
    } else {
      return `Machine Requisition Allocation [${this.selectedOrderItem.product?.item_code}]`
    }
  }

  openIssuePopupForm(item: MRFItemModel) {
    this.selectedOrderItem = item;
    if (!this.selectedItemIsSpare) {
      this.addMachineOrderItemsFormGroup(item);  //Init machine order items array
      if (this.machineAllottedItemsForm(item).length === 0) {
        this.addMachineAllottedItemFormGroup(item);       //add one group
      }

      this.showIssueFormPopup = true;

    } else {
      //get spare balances i.e. allocated (used,unused) and stock balances(all parent + variants)

      const balances = this.getAlreadyAllottedSpares(item.product_id);

      const group = this.spareAllotmentForm(item);

      if (group.get('balances')?.value) {
        this.setSpareControlsMaxAllocationValidity(group, balances, item.approved_qty!);
        this.showIssueFormPopup = true;

      } else if (balances.balances && balances.balances.length > 0) {
        group.get('balances')?.patchValue(balances.balances);
        this.setSpareControlsMaxAllocationValidity(group, balances, item.approved_qty!);
        this.showIssueFormPopup = true;
      } else {
        //fetch spares balances for the item if not found
        this.cartButtonBusy = true;
        this.subSink = this.checkoutService.fetchMeldedBalances(item.product_id)
          .subscribe({
            next: (ProductBalances) => {

              group.get('balances')?.patchValue(ProductBalances);

              this.setSpareControlsMaxAllocationValidity(group, balances, item.approved_qty!);

              this.cartButtonBusy = false
              this.showIssueFormPopup = true;
            },
            error: () => this.cartButtonBusy = false
          })
      }
    }

  }

  getWarehouseById(id?: number): WarehouseModel | undefined {
    if (!id) {return undefined}
    return this.warehouses.find((x) => x.id == id)
  }

  /** Forms and submission **/

  //1 Machines

  /**
   * Machine Form Structure
   *     x = this.fb.group({
   *       machineOrderItems: new FormArray([
   *         this.fb.group({
   *           order_item: this.fb.control('abc'),
   *           allotted_machines: new FormArray([
   *             this.fb.group({
   *               product_serial: this.fb.control(null, {validators: [Validators.required]}),
   *               warrant_start: this.fb.control(this.defaultWarrantStartDate),
   *               warrant_end: this.fb.control(this.defaultWarrantEndDate),
   *             })
   *           ])
   *         }),
   *         ...
   *       ])
   *     })
   */

  get machineOrderItemsFormArray(): FormArray {
    return (this.machineAllocationFormGroup.get('machineOrderItems') as FormArray)
  }

  addMachineOrderItemsFormGroup(item: MRFItemModel) {
    //check if group exists
    let group = this.machineOrderItemsFormGroup(item.id);
    if (!group) {
      //create the group if not exist
      group = this.fb.group({
        order_item_id: this.fb.control(item.id),
        product_id: this.fb.control(item.product_id),
        allotted_machines: this.fb.array([])
      });

      this.machineOrderItemsFormArray.push(group);
    }
  }

  machineOrderItemsFormGroup(itemId: number): FormGroup | undefined {
    return (this.machineOrderItemsFormArray.controls as FormGroup[])
      .find((group: FormGroup) => group.get('order_item_id')?.value === itemId)
  }

  private createMachineAllotmentForm(): FormGroup {
    return this.fb.group({
      product_serial: this.fb.control(null,
        {
          validators: [
            Validators.required,
            uniqueProductSerial(this.selectedProductSerials.bind(this))
          ]
        }),
      warrant_start: this.fb.control(this.defaultWarrantStartDate.toISOString().slice(0, 10)),
      warrant_end: this.fb.control(this.defaultWarrantEndDate.toISOString().slice(0, 10)),
    });
  }

  machineAllottedItemsForm(orderItem: MRFItemModel): FormArray {
    const root = this.machineOrderItemsFormGroup(orderItem.id);
    if (!root) {
      throw new Error('Trying to access machine allocation group from un-initialized array')
    }

    return root.get('allotted_machines') as FormArray;
  }


  addMachineAllottedItemFormGroup(orderItem: MRFItemModel) {
    const allottedMachinesForm = this.createMachineAllotmentForm();
    this.machineAllottedItemsForm(orderItem).push(allottedMachinesForm);
  }

  removeMachineAllottedItemFormGroup(orderItem: MRFItemModel, index: number) {
    this.machineAllottedItemsForm(orderItem).removeAt(index);
  }

  canAddMachineAllottedItemForm(orderItem: MRFItemModel) {
    return this.machineAllottedItemsForm(orderItem).length < (orderItem.approved_qty || 0);
  }


  saveOrderItemMachineIssue(orderItem: MRFItemModel) {
    // get the form
    const form = this.machineAllottedItemsForm(orderItem);
    form.markAllAsTouched();
    if (form.invalid) {
      //todo notify user
      return
    }
    //update the quantity issued
    orderItem.issued_qty = form.length;
    this.showIssueFormPopup = false;
  }

  selectedProductSerials(): ProductSerialModel[] {
    return (this.machineOrderItemsFormArray!.controls as FormGroup[])
      .flatMap((orderGroup) => {
        const allocation = (orderGroup as FormGroup).get('allotted_machines') as FormArray;
        return (allocation.controls as FormGroup[])
          .filter((group) => group.get('product_serial')?.valid) //return only valid
          .map((group) => group.get('product_serial')?.value as ProductSerialModel)
      });

  }


  // 2. Spares

  get spareAllottedItemsForm(): FormArray {
    return this.spareAllocationFormGroup.get('allottedSpares') as FormArray
  }

  createSpareAllotmentForm(itemModel: MRFItemModel) {
    return this.fb.group({
      order_item_id: this.fb.control(itemModel.id),
      product_id: this.fb.control(itemModel.product_id),
      unused_total: this.fb.control(itemModel.approved_qty || 0, {
        validators: [
          Validators.required, Validators.min(0),
          Validators.max(itemModel.approved_qty || 0)
        ], updateOn: 'blur'
      }),
      used_total: this.fb.control(0, {
        validators: [
          Validators.required, Validators.min(0),
          Validators.max(itemModel.approved_qty || 0)
        ],
        updateOn: 'blur'
      }),
      balances: this.fb.control(null)//will hold actual stock balances
    });
  }

  spareAllotmentForm(itemModel: MRFItemModel): FormGroup {
    //check if form exists first
    let group = (this.spareAllottedItemsForm.controls as FormGroup[])
      .find((group: FormGroup) => group.get('order_item_id')?.value === itemModel.id);

    if (group) {return group}
    //else create and return
    group = this.createSpareAllotmentForm(itemModel);
    this.spareAllottedItemsForm.push(group);
    //register for value synchronization
    return group;
  }

  synchronizeSpareControlValues(fromUsedInput = true) {
    if (!this.selectedOrderItem) {
      return;
    }

    const group = this.spareAllotmentForm(this.selectedOrderItem);
    if (!group || !group.get('used_total') || !group.get('unused_total')) {
      return;
    }
    if (fromUsedInput) {
      const diff = (this.selectedOrderItem.approved_qty || 0) - group.get('used_total')?.value;
      group.get('unused_total')?.patchValue(diff)

    } else {
      const diff = (this.selectedOrderItem.approved_qty || 0) - group.get('unused_total')?.value;
      group.get('used_total')?.patchValue(diff)
    }
  }

  saveOrderItemSpareIssue(itemModel: MRFItemModel) {
    // get the form
    const form = this.spareAllotmentForm(itemModel);
    form.markAllAsTouched();

    const qty = (form.get('used_total')?.value || 0) +
      (form.get('unused_total')?.value || 0);
    if (qty > (itemModel.approved_qty || 0)) {
      form.get('used_total')?.setErrors({
        allotment: `Quantity allocated exceeds approved quantity of ${itemModel.approved_qty}`
      });
    }

    if (form.invalid) {return}

    //update the quantity issued (extra step approach)
    itemModel.issued_qty = qty;
    this.showIssueFormPopup = false;

  }

  getAlreadyAllottedSpares(productId: number):
    { old_qty: number, new_qty: number, balances: ProductBalanceModel[] } {
    return (this.spareAllottedItemsForm.controls as FormGroup[])
      .reduce((acc, group) => {
        if (group.get('product_id')?.value === productId) {
          acc.old_qty += (+group.get('used_total')?.value);
          acc.new_qty += (+group.get('unused_total')?.value);
          acc.balances = group.get('balances')?.value; //this is just assignment
        }
        return acc;
      }, {old_qty: 0, new_qty: 0, balances: []})
  }

  setSpareControlsMaxAllocationValidity(group: FormGroup,
                                        balances: { new_qty: number, old_qty: number },
                                        qtyExpected: number) {

    const newStockBal = (group.get('balances')?.value as ProductBalanceModel[])
      .find((i) => !i.product?.variant_of_id) //where variant id is empty

    const brandNewQtyRemainder: number = newStockBal ?
      newStockBal.stock_balance - balances.new_qty - qtyExpected : 0;

    const brandNewMax: number = qtyExpected < brandNewQtyRemainder ? qtyExpected : brandNewQtyRemainder;

    group.get('unused_total')?.clearValidators();
    group.get('unused_total')?.setValidators(Validators.min(0));
    group.get('unused_total')?.setValidators(Validators.max(brandNewMax));
    group.get('unused_total')?.updateValueAndValidity();

    const oldStockBal = (group.get('balances')?.value as ProductBalanceModel[])
      .find((i) => i.product?.variant_of_id) //where variant id has value

    const oldQtyRemainder = oldStockBal ? oldStockBal.stock_balance - balances.old_qty - qtyExpected : 0;
    const oldMax: number = qtyExpected < oldQtyRemainder ? qtyExpected :
      (oldQtyRemainder > 0 ? oldQtyRemainder : 0);

    group.get('used_total')?.clearValidators();
    group.get('used_total')?.setValidators(Validators.min(0));
    group.get('used_total')?.setValidators(Validators.max(oldMax));
    group.get('used_total')?.updateValueAndValidity();

  }

  submitOrderFulfillment() {
    //verify all items have been issued
    const notIssued = this.requestModel!.items
      .find((item) => (item.approved_qty || 0) > (item.issued_qty || 0));

    if (notIssued) {
      alert('You have not issued all the items');
      return;
    }
    const payload = {
      remarks: this.remarksControl.value || 'N/A',
      items: {
        machines: [],
        spares: []
      }
    }
    //push spare allocation
    payload.items.spares = (this.spareAllottedItemsForm.controls as FormGroup[])
      .map((group) => {
        return {
          id: group.get('order_item_id')?.value,
          new_total: group.get('unused_total')?.value,
          old_total: group.get('used_total')?.value,
        }
      }) as any;
    //push machines allocation
    payload.items.machines = (this.machineOrderItemsFormArray.value as any[])
      .map((item) => {
        return {
          id: item.order_item_id,
          allocation: (item.allotted_machines as any[]).map((allocation) => {
            return {
              product_item_id: allocation.product_serial.id,
              warrant_start: allocation.warrant_start,
              warrant_end: allocation.warrant_end
            }
          })
        }
      }) as any

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

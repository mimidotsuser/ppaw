import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { faWindowClose } from '@fortawesome/free-regular-svg-icons';
import { MRFModel, MRFOrderItemModel, MRFStage } from '../../../models/m-r-f.model';
import { CheckoutService } from '../services/checkout.service';
import { SearchService } from '../../../shared/services/search.service';
import { ProductSerialModel } from '../../../models/product-serial.model';
import { uniqueProductSerial } from '../../../utils/validators/unique-product-serial';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  providers: [SearchService]
})
export class CreateComponent implements OnInit, OnDestroy {

  requestModel: MRFModel | null = null;
  subscriptions: Subscription[] = [];
  faCartPlus = faCartPlus;
  faWindowClose = faWindowClose;
  showIssueFormPopup = false;
  issueFormPopupFullscreen = false;
  selectedOrderItem: MRFOrderItemModel | null = null;

  defaultWarrantStartDate = new Date();
  defaultWarrantEndDate = this.addDaysToDate(this.defaultWarrantStartDate, 365);

  //forms
  machineAllocationFormGroup: FormGroup;
  spareAllocationFormGroup: FormGroup;

  constructor(private checkoutService: CheckoutService, private fb: FormBuilder,
              private searchService: SearchService<MRFModel>, private route: ActivatedRoute) {

    const x = this.checkoutService.findRequestById(this.route.snapshot.params[ 'id' ])
      .subscribe((v) => this.requestModel = v);

    if (x) {
      this.subscriptions.push(x);
    }

    this.machineAllocationFormGroup = this.fb.group({
      machineOrderItems: new FormArray([])
    });

    this.spareAllocationFormGroup = this.fb.group({
      allottedSpares: new FormArray([])
    })

  }

  ngOnInit(): void {
  }

  formatOrderId(order: number): string {
    return this.checkoutService.formatOrderId(order);
  }

  get name() {
    return `${this.requestModel?.created_by?.first_name || ''} ${this.requestModel?.created_by?.last_name || ''}`
  }

  get requesterRemarks() {
    const log = this.requestModel?.logs ?
      this.requestModel?.logs.find((log) => log?.stage === MRFStage.CREATE) : null;

    return log ? log.remarks : '';
  }

  get verifierRemarks() {
    const log = this.requestModel?.logs ?
      this.requestModel?.logs.find((log) => log?.stage === MRFStage.VERIFY) : null;

    return log ? log.remarks : '';
  }

  get approverRemarks() {
    const log = this.requestModel?.logs ?
      this.requestModel?.logs.find((log) => log?.stage === MRFStage.APPROVE) : null;

    return log ? log.remarks : '';
  }

  get selectedOrderItemIsSpare() {
    return this.selectedOrderItem?.type === 'spare';
  }

  get issueFormPopupTitle() {
    if (!this.selectedOrderItem) {
      return '';
    }
    if (this.selectedOrderItemIsSpare) {
      return `Spare Requisition Allocation [${this.selectedOrderItem.product?.item_code}]`
    } else {
      return `Machine Requisition Allocation [${this.selectedOrderItem.product?.item_code}]`
    }
  }

  openIssuePopupForm(item: MRFOrderItemModel) {
    this.selectedOrderItem = item;
    if (this.selectedOrderItemIsSpare) {
    } else {
      this.addMachineOrderItemsFormGroup(item);  //Init machine order items array
      if (this.machineAllottedItemsForm(item).length === 0) {
        this.addMachineAllottedItemFormGroup(item);       //add one group
      }
    }

    this.showIssueFormPopup = true;
  }

  addDaysToDate(start: any, days: number): Date {
    const prev = new Date(start.getTime());
    prev.setDate(prev.getDate() + days);
    return prev;
  }


  /** Forms and submission **/

  //1 Machines

  /**
   * Machine Form Structure
   *     x = this.fb.group({
   *       machineOrderItems: new FormArray([
   *         this.fb.group({
   *           order_item: new FormControl('abc'),
   *           allotted_machines: new FormArray([
   *             this.fb.group({
   *               product_serial: new FormControl(null, {validators: [Validators.required]}),
   *               warrant_start: new FormControl(this.defaultWarrantStartDate),
   *               warrant_end: new FormControl(this.defaultWarrantEndDate),
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

  addMachineOrderItemsFormGroup(orderItem: MRFOrderItemModel) {
    //check if group exists
    let group = this.machineOrderItemsFormGroup(orderItem.id);
    if (!group) {
      //create the group if not exist
      group = this.fb.group({
        order_item_id: new FormControl(orderItem.id),
        product_id: new FormControl(orderItem.product_id),
        allotted_machines: new FormArray([])
      });

      this.machineOrderItemsFormArray.push(group);
    }
  }

  machineOrderItemsFormGroup(itemId: string): FormGroup | undefined {
    return (this.machineOrderItemsFormArray.controls as FormGroup[])
      .find((group: FormGroup) => group.get('order_item_id')?.value === itemId)
  }

  private createMachineAllotmentForm(): FormGroup {
    return this.fb.group({
      product_serial: new FormControl(null,
        {
          validators: [
            Validators.required,
            uniqueProductSerial(this.selectedProductSerials.bind(this))
          ]
        }),
      warrant_start: new FormControl(this.defaultWarrantStartDate.toISOString().slice(0, 10)),
      warrant_end: new FormControl(this.defaultWarrantEndDate.toISOString().slice(0, 10)),
    });
  }

  machineAllottedItemsForm(orderItem: MRFOrderItemModel): FormArray {
    const root = this.machineOrderItemsFormGroup(orderItem.id);
    if (!root) {
      throw new Error('Trying to access machine allocation group from un-initialized array')
    }

    return root.get('allotted_machines') as FormArray;
  }


  addMachineAllottedItemFormGroup(orderItem: MRFOrderItemModel) {
    const allottedMachinesForm = this.createMachineAllotmentForm();
    this.machineAllottedItemsForm(orderItem).push(allottedMachinesForm);
  }

  removeMachineAllottedItemFormGroup(orderItem: MRFOrderItemModel, index: number) {
    this.machineAllottedItemsForm(orderItem).removeAt(index);
  }

  canAddMachineAllottedItemForm(orderItem: MRFOrderItemModel) {
    return this.machineAllottedItemsForm(orderItem).length < (orderItem.qty_approved || 0);
  }


  saveOrderItemMachineIssue(orderItem: MRFOrderItemModel) {
    // get the form
    const form = this.machineAllottedItemsForm(orderItem);
    form.markAllAsTouched();
    if (form.invalid) {
      //todo notify user
      return
    }
    //update the quantity issued
    orderItem.qty_issued = form.length;
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

  createSpareAllotmentForm(orderItem: MRFOrderItemModel) {
    return this.fb.group({
      order_item_id: new FormControl(orderItem.id),
      product_id: new FormControl(orderItem.product_id),
      unused_total: new FormControl(orderItem.qty_approved || 0,
        {
          validators: [
            Validators.required, Validators.min(0),
            Validators.max(orderItem.qty_approved || 0)
          ]
        }),
      used_total: new FormControl(0,
        {
          validators: [
            Validators.required, Validators.min(0),
            Validators.max(orderItem.qty_approved || 0)
          ],
          updateOn: 'blur'
        }),
    });
  }

  spareAllotmentForm(orderItem: MRFOrderItemModel): FormGroup {
    //check if form exists first
    let group = (this.spareAllottedItemsForm.controls as FormGroup[])
      .find((group: FormGroup) => group.get('order_item_id')?.value === orderItem.id);

    if (group) {return group}
    //else create and return
    group = this.createSpareAllotmentForm(orderItem);
    this.spareAllottedItemsForm.push(group);
    //register for value synchronization
    this.registerSpareControlSynchrony(orderItem);
    return group;
  }

  registerSpareControlSynchrony(orderItem: MRFOrderItemModel) {
    // get the form group
    const group = this.spareAllotmentForm(orderItem);
    if (!group || !group.get('used_total') || !group.get('unused_total')) {
      return;
    }

    const b = group.get('used_total')!.valueChanges.subscribe((value) => {
      if ((orderItem.qty_approved || 0) - value > -1) {
        group.get('unused_total')?.patchValue((orderItem.qty_approved || 0) - value)
      }
    });

    this.subscriptions.push(b)
  }

  saveOrderItemSpareIssue(orderItem: MRFOrderItemModel) {
    // get the form
    const form = this.spareAllotmentForm(orderItem);
    form.markAllAsTouched();
    if (form.invalid) {
      //todo notify user
      return
    }
    //update the quantity issued (extra step approach)
    orderItem.qty_issued = (form.get('used_total')?.value || 0) +
      (form.get('unused_total')?.value || 0)
    this.showIssueFormPopup = false;

  }

  submitOrderFulfillment() {
    //verify all items have been issued
    const notIssued = this.requestModel!.order_items
      .find((item) => (item.qty_approved || 0) > (item.qty_issued || 0));

    if (notIssued) {
      alert('You have not issued all the items');
      return;
    }
    //submit the forms
    const machineAllocation = this.selectedProductSerials();
    const spareAllocation = (this.spareAllottedItemsForm.controls as FormGroup[])
      .map((group: FormGroup) => group.value);

    //todo submit the machine allocation and spare allocation
  }

  ngOnDestroy(): void {
    this.subscriptions.map((sub) => sub.unsubscribe());
  }
}

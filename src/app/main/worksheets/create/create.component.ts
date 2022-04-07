import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { WorkCategoryCodes, WorkCategoryTitles } from '../../../models/worksheet.model';
import { ProductItemModel } from '../../../models/product-item.model';
import { WorksheetService } from '../services/worksheet.service';
import { CustomerModel } from '../../../models/customer.model';
import { ProductCategoryModel } from '../../../models/product-category.model';
import { ProductModel } from '../../../models/product.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {

  faWindowClose = faWindowClose;
  showAddWorksheetEntryFormPopup = false;
  customerMachines: ProductItemModel[] = [];
  private _productCategories?: ProductCategoryModel[];
  private _subscriptions: Subscription[] = [];
  worksheetEntryForm: FormGroup;
  form: FormGroup;

  constructor(private fb: FormBuilder, private worksheetService: WorksheetService,
              private router: Router, private route: ActivatedRoute) {
    this.form = this.fb.group({
      customer: this.fb.control(null,
        {validators: [Validators.required]}),
      reference: this.fb.control(null,
        {validators: [Validators.required]}),
      entries: this.fb.array([],
        {validators: [Validators.minLength(1)]})
    });

    this.worksheetEntryForm = this.createEntryForm();
  }

  ngOnInit(): void {
    this.subSink = this.worksheetService.fetchAllProductCategories
      .subscribe({next: (data) => this._productCategories = data})
  }

  set subSink(value: Subscription) {
    this._subscriptions.push(value);
  }


  get workCategories(): { code: WorkCategoryCodes, title: WorkCategoryTitles }[] {
    return (Object.keys(WorkCategoryTitles) as WorkCategoryCodes[])
      .map((key: WorkCategoryCodes) => ({code: key, title: WorkCategoryTitles[ key ]}))
  }

  get spareProductCategory(): ProductCategoryModel | undefined {
    if (!this._productCategories) {return undefined}
    return this._productCategories
      .find((cat) => cat.name.toLowerCase() === 'spare')
  }

  /** Entries form **/
  get entriesFormArray(): FormArray {
    return this.form.get('entries') as FormArray;
  }

  get spareItemsFormArray(): FormArray {
    return this.worksheetEntryForm.get('repairItems') as FormArray
  }

  /** Spare Group Entry **/
  get spareItemFormGroup() {
    return this.fb.group({
      product: this.fb.control(null, {validators: [Validators.required]}),
      old_total: this.fb.control(0,
        {validators: [Validators.required, Validators.min(0)]}),
      new_total: this.fb.control(1,
        {validators: [Validators.required, Validators.min(0)]}),
    })
  }

  get machineRepairCategorySelected() {
    return this.worksheetEntryForm.value.category?.code === WorkCategoryCodes.REPAIR
  }


  onProductItemsSelectAllToggle($evt: Event) {
    const checked = ($evt.target as HTMLInputElement).checked;
    if (checked) {
      this.worksheetEntryForm.patchValue({productItems: [...this.customerMachines]});

    } else {
      this.worksheetEntryForm.get('productItems')?.patchValue(null);
    }
  }

  onCustomerSelection() {
    const customer = this.form.value.customer as CustomerModel;
    this.customerMachines = []; //reset the machines available

    this.entriesFormArray.clear();

    this.subSink = this.worksheetService
      .fetchCustomerMachines(customer.id)
      .subscribe((value) => this.customerMachines = value);
  }

  createEntryForm(data?: WorksheetEntryFormModel): FormGroup {
    return this.fb.group({
      category: this.fb.control(data?.category,
        {validators: [Validators.required]}),
      productItems: this.fb.control(data?.productItems || [],
        {validators: [Validators.required]}),
      repairItems: this.fb.array(data?.repairItems || []),
      description: this.fb.control(data?.description,
        {validators: Validators.required})
    })
  }

  removeWorksheetEntry(group: FormGroup) {
    const index = this.entriesFormArray.controls.findIndex((control) => {
      return control === group
    })
    if (index > -1) {
      this.entriesFormArray.removeAt(index);
    }
  }

  addSpareItemFormGroup() {
    this.spareItemsFormArray.push(this.spareItemFormGroup);
  }

  removeSpareItemFormGroup(spareGroupEntryId: number) {
    this.spareItemsFormArray.removeAt(spareGroupEntryId)
  }

  showAddWorksheetEntryForm() {
    //reset the forms
    this.spareItemsFormArray.clear();
    this.worksheetEntryForm.reset({productItems: []});
    this.showAddWorksheetEntryFormPopup = true;
  }

  selectedEntryCategoryComparator(a: any, b: any) {
    return a?.code === b?.code;
  }

  onFormEntryCategorySelection() {
    if (!this.machineRepairCategorySelected) {
      this.spareItemsFormArray.clear();
    } else {
      this.addSpareItemFormGroup(); //add an empty spare group
    }
  }


  addWorksheetEntry() {
    this.worksheetEntryForm.markAllAsTouched();
    if (this.worksheetEntryForm.invalid) {return}

    this.entriesFormArray.push(this.createEntryForm(this.worksheetEntryForm.value));
    this.spareItemsFormArray.clear();
    this.worksheetEntryForm.reset();
    this.showAddWorksheetEntryFormPopup = false;
  }

  worksheetEntryTotalSpares(entry: FormGroup): number {
    if (!entry.value.repairItems) {return 0}
    return (entry.value as WorksheetEntryFormModel).repairItems
      .reduce((acc, v) => acc += v.new_total + v.old_total, 0);
  }

  editWorksheetEntry(entry: FormGroup) {
    this.worksheetEntryForm.patchValue(entry.value);
    if (entry.value.repairItems) {
      (entry.value as WorksheetEntryFormModel).repairItems
        .map((spareModel) => {
          const group = this.spareItemFormGroup;
          group.patchValue(spareModel);
          this.spareItemsFormArray.push(group);
        })
    }
    this.removeWorksheetEntry(entry);
    this.showAddWorksheetEntryFormPopup = true;
  }

  submitForm() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {return}
    const payload = {
      reference: this.form.value.reference,
      customer_id: this.form.value.customer.id,
      entries: this.form.value.entries
        .map((entry: WorksheetEntryFormModel) => {
          let parsed: any = {
            category_code: entry.category.code,
            description: entry.description,
            product_items: entry.productItems.map((prod) => ({id: prod.id})),
          }
          if (entry[ 'repairItems' ]) {

            parsed[ 'repair_items' ] = entry
              .repairItems.map((repair) => ({
                old_total: repair.old_total,
                new_total: repair.old_total,
                product_id: repair.product.id,
              }))
          }
          return parsed;
        })
    }

    this.subSink = this.worksheetService.create(payload)
      .subscribe({
        next: () => {
          this.router.navigate(['../history'], {relativeTo: this.route})
            .then(() => {
              //show message
            })
        }
      })
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }
}

interface RepairSpareModel {
  product: ProductModel,
  old_total: number
  new_total: number
}

interface WorksheetEntryFormModel {
  category: { code: WorkCategoryCodes, title: WorkCategoryTitles };
  productItems: ProductItemModel[]
  repairItems: RepairSpareModel[];
  description: string;
}

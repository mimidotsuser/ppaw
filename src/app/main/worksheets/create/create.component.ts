import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { WorkCategory } from '../../../models/worksheet.model';
import { ProductItemModel } from '../../../models/product-item.model';
import { WorksheetService } from '../services/worksheet.service';
import { ClientModel } from '../../../models/client.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {

  form: FormGroup;
  entryForm: FormGroup;
  clientMachines: ProductItemModel[] = [];
  showEntryFormPopup = false;
  faWindowClose = faWindowClose;
  private subscriptions: Subscription[] = [];

  constructor(private fb: FormBuilder, private worksheetService: WorksheetService) {
    this.form = this.fb.group({
      client: this.fb.control(null, {validators: [Validators.required]}),
      reference: this.fb.control(null, {validators: [Validators.required]}),
      entries: this.fb.array([], {validators: [Validators.minLength(1)]})
    });

    this.entryForm = this.createEntryForm();
  }

  ngOnInit(): void {
  }

  get workCategories(): { code: (keyof typeof WorkCategory), title: WorkCategory }[] {
    return [
      {code: 'MACHINE_REPAIR', title: WorkCategory.MACHINE_REPAIR},
      {code: 'GENERAL_SERVICING', title: WorkCategory.GENERAL_SERVICING},
      {code: 'DELIVERY_AND_INSTALLATION', title: WorkCategory.DELIVERY_AND_INSTALLATION},
      {code: 'TECHNICAL_REPORT', title: WorkCategory.TECHNICAL_REPORT},
      {code: 'TRAINING_AND_INSTALLATION', title: WorkCategory.TRAINING_AND_INSTALLATION},
      {code: 'OTHER', title: WorkCategory.OTHER},
    ]
  }

  joinProductItemsSerials(products: ProductItemModel[] = []): string {
    return products.map((product) => product.serial_number).join(',')
  }

  onProductItemsSelectAllToggle($evt: Event) {
    const checked = ($evt.target as HTMLInputElement).checked;
    if (checked) {
      this.entryForm.patchValue({productItems: [...this.clientMachines]});

    } else {
      this.entryForm.get('productItems')?.patchValue(null);
    }
  }

  onClientSelection() {
    const client = this.form.value.client as ClientModel;
    this.clientMachines = []; //reset the machines available
    if (!client) {
      this.form.reset();
      return;
    }
    const x = this.worksheetService
      .fetchClientMachines(client.id)
      .subscribe((value) => this.clientMachines = value);
    this.subscriptions.push(x);
  }

  /** Entries form **/
  get entriesForm(): FormArray {
    return this.form.get('entries') as FormArray;
  }

  createEntryForm(data?: { category: any, productItems: any, spareEntries: any,
    workDescription: any }): FormGroup {
    if (!data) {
      data = {
        category: null,
        productItems: [],
        spareEntries: [],
        workDescription: null
      }
    }
    return this.fb.group({
      category: this.fb.control(data.category, {validators: [Validators.required]}),
      productItems: this.fb.control(data.productItems,
        {validators: [Validators.required]}),
      spareEntries: this.fb.array(data.spareEntries),
      workDescription: this.fb.control(data.workDescription,
        {validators: Validators.required})
    })
  }

  removeWorksheetEntry(index: number) {
    this.entriesForm.removeAt(index);
  }

  get spareEntriesForm(): FormArray {
    return this.entryForm.get('spareEntries') as FormArray
  }

  /** Spare Group Entry **/
  get spareGroupEntryForm() {
    return this.fb.group({
      item: this.fb.control(null, {validators: [Validators.required]}),
      used_qty: this.fb.control(0,
        {validators: [Validators.required, Validators.min(0)]}),
      unused_qty: this.fb.control(1,
        {validators: [Validators.required, Validators.min(0)]}),
    })
  }

  addSpareGroupEntry() {
    this.spareEntriesForm.push(this.spareGroupEntryForm);
  }

  removeSpareGroupEntry(spareGroupEntryId: number) {
    this.spareEntriesForm.removeAt(spareGroupEntryId)
  }

  showAddEntryFormPopup() {
    //reset spare entry form
    this.spareEntriesForm.clear();
    this.entryForm.reset({productItems: []});
    this.showEntryFormPopup = true;
  }

  selectedEntryCategoryComparator(a: any, b: any) {
    return a?.code === b?.code;
  }

  onEntryCategorySelection() {
    if (!this.machineRepairCategorySelected) {
      this.spareEntriesForm.clear();
    } else {
      this.addSpareGroupEntry(); //add an empty spare group
    }
  }

  get machineRepairCategorySelected() {
    return this.entryForm.value.category?.code === 'MACHINE_REPAIR'
  }

  saveEntry() {
    this.entryForm.markAllAsTouched();
    if (this.entryForm.invalid) {return}

    //todo if machine, there should be at least have a spare entry
    this.entriesForm.push(this.createEntryForm(this.entryForm.value));
    this.showEntryFormPopup = false;
  }

  submitForm() {}

  ngOnDestroy(): void {
    this.subscriptions.map((sub) => sub.unsubscribe())
  }
}

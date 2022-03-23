import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, Observable, of, startWith, Subscription, tap } from 'rxjs';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { MRFPurpose } from '../../../models/m-r-f.model';
import { WorksheetModel } from '../../../models/worksheet.model';
import { CustomerModel } from '../../../models/customer.model';
import { SearchService } from '../../../shared/services/search.service';
import { ProductModel } from '../../../models/product.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  providers: [SearchService]
})
export class CreateComponent implements OnInit, OnDestroy {

  searchInput = this.fb.control('');
  form: FormGroup;
  showPopupForm = false;
  itemType = {machine: 'Machine', spare: 'Spare'}
  remarksControl = this.fb.control('', {validators: Validators.required});
  faEllipsisV = faEllipsisV;
  subscriptions: Subscription[] = [];

  private formModelOnEdit: FormModel | null = null;
  private formModelItems: FormModel[] = [];
  private filteredItems$: Observable<FormModel[]> = new Observable<FormModel[]>();
  private searchFields = ['type', 'parent.local_description', 'parent.item_code',
    'product.local_description', 'product.item_code', 'purpose', 'qty', 'client.name',
    'client.branch', 'client.region'];

  constructor(private fb: FormBuilder, private searchService: SearchService<FormModel>) {
    this.form = this.fb.group({
      type: this.fb.control(this.itemType.machine, {validators: [Validators.required]}),
      parent: this.fb.control(null),
      product: this.fb.control(null, {validators: [Validators.required]}),
      purpose: this.fb.control(null, {validators: [Validators.required]}),
      client: this.fb.control(null, {validators: [Validators.required]}),
      qty: this.fb.control(1,
        {validators: [Validators.required, Validators.min(1)]}),
      worksheet: this.fb.control(null)
    });
  }

  ngOnInit(): void {
    //on product category change,
    const y = this.form.get('type')?.valueChanges!
      .pipe(tap(() => {
        //reset product
        this.form.get('product')?.reset();
        //if spare, disable product input
        if (this.form.get('type')?.value === this.itemType.spare) {
          this.form.get('product')?.disable();
        } else {
          this.form.get('product')?.enable();
        }
      })).subscribe();

    const x = this.form.get('parent')?.valueChanges!.pipe(tap(() => {
      if (this.form.get('type')?.value === this.itemType.spare && !this.form.get('parent')?.value) {
        this.form.get('product')?.disable();
      } else {
        this.form.get('product')?.enable();
      }
      return true;
    })).subscribe();

    if (x) {
      this.subscriptions.push(x);
    }
    if (y) {
      this.subscriptions.push(y);
    }


    //search
    this.filteredItems$ = this.searchInput.valueChanges
      .pipe(startWith(''))
      .pipe(map((searchTerm: string) => {
        return this.formModelItems.filter((row: any) => {
          return this.searchFields
            .some((field: string) => this.searchService.hasHit(searchTerm.toLowerCase(), row, field))
        })
      }));
  }

  get purposes(): { id: MRFPurpose, title: string }[] {
    const requestPurposes = [
      {id: MRFPurpose.CLIENT_PURCHASE, title: 'Client Sale'},
      {id: MRFPurpose.CLIENT_STANDBY, title: 'Standby'},
    ];

    if (this.form.get('type')?.value === this.itemType.machine) {
      requestPurposes.push(
        {id: MRFPurpose.CLIENT_DEMO, title: 'Client Demo'},
        {id: MRFPurpose.CLIENT_LEASE, title: 'Client Lease'}
      )
    } else {
      requestPurposes.unshift({id: MRFPurpose.CLIENT_REPAIR, title: 'Machine Repair'})
    }

    return requestPurposes;
  }

  closePopup() {
    if (this.formModelOnEdit) {
      this.formModelItems.push(this.formModelOnEdit);
    }
    this.showPopupForm = false;
  }

  showCreateForm(model: FormModel | null = null) {
    if (model) {
      this.form.patchValue(model);
      this.formModelOnEdit = model;
      this.removeSelectedItem(model);
    } else {
      this.formModelOnEdit = null;
      this.form.reset({type: this.itemType.machine});
    }
    this.showPopupForm = true;
  }

  get selectedItems(): Observable<FormModel[]> {
    return this.searchInput.value ? this.filteredItems$ : of(this.formModelItems);
  }


  removeSelectedItem(model: FormModel) {
    const index = this.formModelItems.findIndex((item) => {
      return item.purpose === model.purpose && item.product.id === model.product.id
        && item.client.id === model.client.id;
    });
    if (index > -1) {
      this.formModelItems.splice(index, 1);
    }
  }

  addItem() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return
    }
    //check if it already exists
    const item = this.form.value as FormModel;
    const index = this.formModelItems.findIndex((model) => {
      return model.client.id === item.client.id && model.purpose === item.purpose
        && model.product.id === item.product.id && model.parent?.id === item.parent?.id;
    });

    if (index > -1) {
      //only update the qty
      this.formModelItems[ index ].qty += item.qty;
    } else {
      this.formModelItems.push(item);
    }

    this.closePopup()

  }

  submit() {
    this.remarksControl.markAllAsTouched();
    if (this.remarksControl.invalid) {
      return
    }
    //TODO submit the form
  }

  ngOnDestroy(): void {
    this.subscriptions.map((sub) => sub.unsubscribe())
  }
}

interface FormModel {
  type: string;
  parent: null | ProductModel;
  product: ProductModel;
  purpose: MRFPurpose;
  client: CustomerModel;
  worksheet: null | WorksheetModel;
  qty: number;
}

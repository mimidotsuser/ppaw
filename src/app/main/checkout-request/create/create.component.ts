import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of, startWith, Subscription, switchMap, tap } from 'rxjs';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { MRFPurpose } from '../../../models/m-r-f.model';
import { WorksheetModel } from '../../../models/worksheet.model';
import { ClientModel } from '../../../models/client.model';
import { SearchService } from '../../../shared/services/search.service';
import { ProductModel } from '../../../models/product.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  providers: [SearchService]
})
export class CreateComponent implements OnInit, OnDestroy {

  itemsSearchInput = new FormControl();
  form: FormGroup;
  showPopupForm = false;
  itemType = {machine: 'Machine', spare: 'Spare'}
  remarksControl = new FormControl('', {validators: Validators.required});
  faEllipsisV = faEllipsisV;
  subscriptions: Subscription[] = [];
  _selectedItems: FormModel[] = [];
  private _selectedItems$: Observable<FormModel[]> = new Observable<FormModel[]>();


  constructor(private fb: FormBuilder, private searchService: SearchService<FormModel>) {
    this.searchService.setFields(['type', 'parent.local_description', 'parent.item_code',
      'product.local_description', 'product.item_code', 'purpose', 'qty', 'client.name',
      'client.branch', 'client.region']);
    this.form = this.fb.group({
      type: new FormControl(this.itemType.machine, {validators: [Validators.required]}),
      parent: new FormControl(),
      product: new FormControl(null, {validators: [Validators.required]}),
      purpose: new FormControl(null, {validators: [Validators.required]}),
      client: new FormControl(null, {validators: [Validators.required]}),
      qty: new FormControl(1,
        {validators: [Validators.required, Validators.min(1)]}),
      worksheet: new FormControl()
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
    this._selectedItems$ = this.itemsSearchInput.valueChanges.pipe(
      startWith(''),
      switchMap((v) => this.searchService.find(v, of(this._selectedItems)))
    )
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
    this.showPopupForm = false;
  }

  showCreateForm(model: FormModel | null = null) {
    if (model) {
      this.form.patchValue(model);
    }
    this.showPopupForm = true;
  }

  get selectedItems(): Observable<FormModel[]> {
    return this._selectedItems$;
  }


  removeSelectedItem(model: FormModel) {
    const index = this._selectedItems.findIndex((item) => {
      return item.purpose === model.purpose && item.product.id === model.product.id
        && item.client.id === model.client.id;
    });
    if (index > -1) {
      this._selectedItems.splice(index, 1);
    }
  }

  addItem() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this._selectedItems.push(this.form.value);
    }
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
  client: ClientModel;
  worksheet: null | WorksheetModel;
  qty: number;
}

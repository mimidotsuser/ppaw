import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, finalize, Subscription } from 'rxjs';
import { CustomerService } from '../services/customer.service';
import { CustomerModel } from '../../../models/customer.model';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { PaginationModel } from '../../../models/pagination.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {

  faEllipsisV = faEllipsisV;
  showCustomerFormPopup = false;
  loadingMainContent = true;
  formSubmissionBusy = false;
  model: CustomerModel = {id: 0, name: ''}
  pagination: PaginationModel = {total: 0, page: 1, limit: 25}
  private _customers: CustomerModel[] = [];
  private _subscriptions: Subscription[] = []
  searchControl: FormControl;

  constructor(private customerService: CustomerService, private fb: FormBuilder,
              private toastService: ToastService) {
    this.searchControl = this.fb.control('');
  }

  ngOnInit(): void {
    this.loadCustomers();

    this.subSink = this.searchControl.valueChanges
      .pipe(debounceTime(800), distinctUntilChanged())
      .subscribe((v: string) => {
        if (v && v.trim()) {
          this._customers = [];  //reset current items-very important
          this.pagination.total = 0;
          this.loadCustomers(); //initiate loading of customers
        }
      })
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


  get customers(): CustomerModel[] {
    return this._customers;
  }

  loadCustomers() {
    //if data has already been loaded, don't re-fetch it
    if (this.tableCountEnd <= this.customers.length) {return;}
    this.loadingMainContent = true;

    let params = {}
    if (this.searchControl.value) {
      params = {search: this.searchControl.value.trim()};
    }

    this.subSink = this.customerService.fetch({...params, ...this.pagination})
      .pipe(finalize(() => this.loadingMainContent = false))
      .subscribe({
        next: (res) => {
          this._customers = this._customers.concat(res.data);
          this.pagination.total = res.total;
        }
      })
  }

  showCreateForm(parent?: CustomerModel) {
    this.model = {
      id: 0,
      name: '',
      parent_id: parent ? parent.id : undefined,
      parent: parent,
      created_at: ''
    }
    this.showCustomerFormPopup = true;
  }

  showEditForm(customer: CustomerModel) {
    this.model = customer;
    this.showCustomerFormPopup = true;
  }

  closeCustomerFormPopup(form: FormGroup) {
    //confirm with the user if form is dirty?
    if (form.dirty && !window.confirm('Your unsaved changes will be lost. Continue?')) {return}
    this.showCustomerFormPopup = false;

  }

  submitCustomerForm(form: FormGroup) {
    form.markAllAsTouched();
    if (form.invalid) {return;}
    if (!form.dirty) {
      this.showCustomerFormPopup = false;
      return
    }

    const payload = form.value;
    if (payload.parent) {
      payload.parent_id = payload.parent.id;
    }

    delete payload.parent;
    this.formSubmissionBusy = true;

    if (this.model.id > 0) {
      this.subSink = this.customerService.update(this.model.id, payload)
        .pipe(finalize(() => this.formSubmissionBusy = false))
        .subscribe({
          next: (model) => {
            const index = this.customers.findIndex((c) => c.id === model.id);
            if (index > -1) {
              this.customers[ index ] = model;
            }
            this.showCustomerFormPopup = false;
            this.toastService.show({delay: 3000, message: 'Customer updated successfully'})
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
    } else {
      this.subSink = this.customerService.create(payload)
        .pipe(finalize(() => this.formSubmissionBusy = false))
        .subscribe({
          next: (model) => {
            this.customers.push(model);
            this.showCustomerFormPopup = false;
            this.toastService.show({message: 'Customer added successfully', delay: 3000})
          },
          error: (err) => {
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

  }


  deleteCustomer(customer: CustomerModel) {
    this.subSink = this.customerService.destroy(customer.id)
      .subscribe({
        next: () => {
          const index = this.customers.findIndex((c) => c.id === customer.id);
          if (index > -1) {
            this.customers.splice(index, 1);
          }
          this.toastService.show({message: 'Customer removed successfully', delay: 3000})
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
    this._subscriptions.map((sub) => sub.unsubscribe())
  }

}

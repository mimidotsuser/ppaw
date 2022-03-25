import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CustomerService } from '../services/customer.service';
import { CustomerModel } from '../../../models/customer.model';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { PaginationModel } from '../../../models/pagination.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {

  model: CustomerModel = {id: 0, name: ''}
  searchControl: FormControl;
  faEllipsisV = faEllipsisV;
  showCustomerFormPopup = false;
  pagination: PaginationModel = {total: 0, page: 1, limit: 5}
  private _customers: CustomerModel[] = [];
  private _subscriptions: Subscription[] = []

  constructor(private customerService: CustomerService, private fb: FormBuilder) {
    this.searchControl = this.fb.control('');
  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  set subSink(value: Subscription) {
    this._subscriptions.push(value);
  }


  get customers(): CustomerModel[] {
    return this._customers;
  }

  loadCustomers() {
    //if data has already been loaded, don't re-fetch it
    if (this.tableCountEnd <= this.customers.length) {
      return;
    }
    this.subSink = this.customerService.fetch(this.pagination)
      .subscribe({
        next: (res) => {
          this._customers = this._customers.concat(res.data);
          this.pagination.total = res.total;
        }
      })
  }

  get tableCountStart() {
    return (this.pagination.page - 1) * this.pagination.limit
  }

  get tableCountEnd() {
    return this.pagination.page * this.pagination.limit
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

  saveClientForm(form: FormGroup) {
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

    if (this.model.id > 0) {
      this.subSink = this.customerService.update(this.model.id, payload)
        .subscribe((model) => {
          const index = this.customers.findIndex((c) => c.id === model.id);
          if (index > -1) {
            this.customers[ index ] = model;
          }
          this.showCustomerFormPopup = false;

        })
    } else {
      this.subSink = this.customerService.create(payload)
        .subscribe((model) => {
          this.customers.push(model);
          this.showCustomerFormPopup = false;
        })
    }

  }


  deleteCustomer(customer: CustomerModel) {
    this.subSink = this.customerService.destroy(customer.id)
      .subscribe(() => {
        const index = this.customers.findIndex((c) => c.id === customer.id);
        if (index > -1) {
          this.customers.splice(index, 1);
        }
      })
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }

}

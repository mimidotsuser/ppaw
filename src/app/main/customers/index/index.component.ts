import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../services/customer.service';
import { Observable } from 'rxjs';
import { CustomerModel } from '../../../models/customer.model';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  faEllipsisV = faEllipsisV;
  clientSearchInput: FormControl;
  openFormSidePopup = false;
  model: null | CustomerModel = null;

  constructor(private clientService: CustomerService, private fb: FormBuilder) {
    this.clientSearchInput = this.fb.control('');
  }

  ngOnInit(): void {
  }


  get clients(): Observable<CustomerModel[]> {
    //TODO transform to  ClientModel {children:[]}
    return this.clientService.clients;
  }

  showCreateForm(parent: null | CustomerModel = null) {
    this.model = {
      id: '',
      name: '',
      region: '',
      location: '',
      branch: '',
      parent_id: parent ? parent.id! : '',
      parent: parent ? parent : undefined,
    }
    this.openFormSidePopup = true;
  }

  showEditForm(client: CustomerModel) {
    this.model = {...client};
    this.openFormSidePopup = true;
  }

  closeFormPopup(form: FormGroup) {
    //confirm with the user if form is dirty?
    this.openFormSidePopup = false;
  }

  saveClientForm(form: FormGroup) {

    //
    this.openFormSidePopup = false;
  }

  deleteClient(client: CustomerModel) {

  }
}

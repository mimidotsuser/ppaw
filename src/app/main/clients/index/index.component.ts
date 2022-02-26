import { Component, OnInit } from '@angular/core';
import { ClientService } from '../services/client.service';
import { Observable } from 'rxjs';
import { ClientModel } from '../../../models/client.model';
import { FormControl, FormGroup } from '@angular/forms';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  faEllipsisV = faEllipsisV;
  clientSearchInput = new FormControl();
  openFormSidePopup = false;
  model: null | ClientModel = null;
  parent: null | ClientModel = null;

  constructor(private clientService: ClientService) { }

  ngOnInit(): void {
  }


  get clients(): Observable<ClientModel[]> {
    //TODO transform to  ClientModel {children:[]}
    return this.clientService.clients;
  }

  showCreateForm(parent: null | ClientModel = null) {
    this.model = null;
    this.parent = parent;
    this.openFormSidePopup = true;
  }

  showEditForm(client: ClientModel) {
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

  deleteClient(client: ClientModel) {

  }
}

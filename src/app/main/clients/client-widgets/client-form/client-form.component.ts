import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientModel } from '../../../../models/client.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-client-form[clients]',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss']
})
export class ClientFormComponent implements OnInit {

  form!: FormGroup;

  @Input() clients!: Observable<ClientModel[]>

  @Input() set model(model: null | ClientModel) {this.initForm(model)};

  @Input() parent?: ClientModel | null = null;

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {
  }

  initForm(model: null | ClientModel = null) {
    if (!model) {
      model = {
        id: '',
        name: '',
        region: '',
        location: '',
        branch: '',
        parent_id: this.parent ? this.parent.id : '',
        created_by_id: '',
        contracts_total: 0,
        created_at: ''
      }
    }

    this.form = this.fb.group({
      id: new FormControl(model.id),
      parent_id: new FormControl(model.parent_id),
      name: new FormControl(model.name, {
        validators: [Validators.required, Validators.maxLength(200)]
      }),
      branch: new FormControl(model.branch, {
        validators: [Validators.maxLength(200)]
      }),
      location: new FormControl(model.location, {
        validators: [Validators.maxLength(200)]
      }),
      region: new FormControl(model.region, {
        validators: [Validators.maxLength(200)]
      }),
    })
  }

  onParentSelect($evt: Event) {
    const title = ($evt.target as HTMLSelectElement)
      .selectedOptions[ 0 ].getAttribute('data-name');
    /**
     * Set the bank name if the input has not been touched or is blank
     */
    if ((this.form.get('name')?.touched && !this.form.get('name')?.value) ||
      !this.form.get('name')?.touched) {
      this.form.get('name')?.patchValue(title);
    }
  }
}

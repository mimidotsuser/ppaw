import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ProductModel } from '../../../../models/product.model';

@Component({
  selector: 'app-spare-form[machines]',
  templateUrl: './spare-form.component.html',
  styleUrls: ['./spare-form.component.scss']
})
export class SpareFormComponent implements OnInit {


  @Input() set model(model: ProductModel | null) {
    this.initForm(model);
  }

  @Input() machines!: Observable<ProductModel[]>;

  form!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(model: ProductModel | null = null) {
    this.form = this.fb.group({
      parent_id: new FormControl(model?.parent_id,
        {validators: [Validators.required]}),
      item_code: new FormControl(model?.item_code,
        {
          validators: [Validators.required]
        }),
      mpn: new FormControl(model?.mpn,
        {validators: [Validators.required]}),
      description: new FormControl(model?.description,
        {
          validators: [Validators.required, Validators.maxLength(230)]
        }),
      local_description: new FormControl(model?.local_description,
        {
          validators: [Validators.maxLength(230)]
        }),
      chinese_description: new FormControl(model?.chinese_description,
        {
          validators: [Validators.maxLength(230)]
        }),
      eoq: new FormControl(model?.eoq,
        {
          validators: [Validators.required, Validators.min(0)]
        }),
      minl: new FormControl(model?.minl,
        {
          validators: [Validators.required, Validators.min(0)]
        }),
      rol: new FormControl(model?.rol,
        {
          validators: [Validators.required, Validators.min(0)]
        }),
      maxl: new FormControl(model?.maxl,
        {
          validators: [Validators.required, Validators.min(0)]
        }),
    });
  }

}

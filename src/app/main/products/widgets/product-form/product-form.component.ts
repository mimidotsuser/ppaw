import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductModel } from '../../../../models/product.model';
import { requiredIf } from '../../../../utils/validators/required-if';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {


  @Input() set model(model: ProductModel | null) {
    this.initForm(model);
  }

  @Input() hasParent = false

  form!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(model: ProductModel | null = null) {
    this.form = this.fb.group({
      parent: this.fb.control(model?.parent,
        {validators: [requiredIf(this.hasParent)]}),
      item_code: this.fb.control(model?.item_code,
        {
          validators: [Validators.required]
        }),
      mpn: this.fb.control(model?.mpn,
        {validators: [Validators.required]}),
      description: this.fb.control(model?.description,
        {
          validators: [Validators.required, Validators.maxLength(230)]
        }),
      local_description: this.fb.control(model?.local_description,
        {
          validators: [Validators.maxLength(230)]
        }),
      chinese_description: this.fb.control(model?.chinese_description,
        {
          validators: [Validators.maxLength(230)]
        }),
      eoq: this.fb.control(model?.eoq,
        {
          validators: [Validators.required, Validators.min(0)]
        }),
      minl: this.fb.control(model?.minl,
        {
          validators: [Validators.required, Validators.min(0)]
        }),
      rol: this.fb.control(model?.rol,
        {
          validators: [Validators.required, Validators.min(0)]
        }),
      maxl: this.fb.control(model?.maxl,
        {
          validators: [Validators.required, Validators.min(0)]
        }),
    });
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductModel } from '../../../../models/product.model';
import { requiredIf } from '../../../../utils/validators/required-if';
import { ProductCategoryModel } from '../../../../models/product-category.model';

@Component({
  selector: 'app-product-form[category]',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {


  @Input() set model(model: ProductModel | null) {
    this.initForm(model);
  }

  @Input() set category(category: ProductCategoryModel) {this._category = category}

  @Input() hasParent = false

  form!: FormGroup;
  private _category!: ProductCategoryModel;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(model: ProductModel | null = null) {
    this.form = this.fb.group({
      parent: this.fb.control(model?.parent,
        {validators: [requiredIf(this.hasParent)]}),
      item_code: this.fb.control(model?.item_code, {validators: [Validators.required]}),
      manufacturer_part_number: this.fb.control(model?.manufacturer_part_number),
      description: this.fb.control(model?.description,
        {validators: [Validators.required, Validators.maxLength(230)]}),
      local_description: this.fb.control(model?.local_description,
        {validators: [Validators.maxLength(230)]}),
      chinese_description: this.fb.control(model?.chinese_description,
        {validators: [Validators.maxLength(230)]}),
      economic_order_qty: this.fb.control(model?.economic_order_qty,
        {validators: [Validators.required, Validators.min(0)]}),
      min_level: this.fb.control(model?.min_level,
        {validators: [Validators.required, Validators.min(0)]}),
      reorder_level: this.fb.control(model?.reorder_level,
        {validators: [Validators.required, Validators.min(0)]}),
      max_level: this.fb.control(model?.max_level,
        {validators: [Validators.required, Validators.min(0)]}),
    });
  }

  get category(): ProductCategoryModel {
    return this._category;
  }
}

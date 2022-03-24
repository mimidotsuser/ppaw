import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { ProductModel } from '../../../../models/product.model';
import { ProductService } from '../../services/product.service';
import { Subscription } from 'rxjs';
import { ProductCategoryModel } from '../../../../models/product-category.model';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {

  faEllipsisV = faEllipsisV;
  showProductFormPopup = false;
  selectedModel: ProductModel | null = null;
  searchControl: FormControl;
  private _machines: ProductModel[] = [];
  private _subscriptions: Subscription[] = [];
  private _categories: ProductCategoryModel[] = [];
  pagination = {page: 1, total: 0, limit: 25}

  constructor(private productService: ProductService, private fb: FormBuilder) {
    this.searchControl = this.fb.control('');
  }

  ngOnInit(): void {
    this.subSink = this.productService.fetchAllCategories
      .subscribe({
        next: (pc) => {
          this._categories = pc
          this.fetchProducts()
        }
      })

  }

  private set subSink(v: Subscription) {
    this._subscriptions.push(v);
  }

  get machineCategory(): ProductCategoryModel | undefined {
    return this._categories.find((c) => c.name.toLowerCase() === 'machine');
  }

  fetchProducts() {
    this.subSink = this.productService
      .fetchProducts((this.machineCategory?.id || 0), this.pagination)
      .subscribe((res) => {
        this._machines = res.data;
        this.pagination.total = res.total;
      })
  }

  get products(): ProductModel[] {
    return this._machines;
  }

  showCreateProductFormPopup() {
    this.showProductFormPopup = true;
    this.selectedModel = null;
  }

  showProductEditForm(product: ProductModel) {
    this.showProductFormPopup = true;
    this.selectedModel = {...product};
  }

  closeProductFormPopup(form: FormGroup) {
    this.showProductFormPopup = false;

  }

  saveProductForm(form: FormGroup) {
    form.markAllAsTouched();
    if (form.invalid) {return}

    if (this.selectedModel?.id) {
      this.updateProduct(form)
    } else {
      this.createProduct(form)
    }

  }

  createProduct(form: FormGroup) {
    this.subSink = this.productService
      .create({...form.value, product_category_id: this.machineCategory?.id || 0})
      .subscribe((prod) => {
        this.products.unshift(prod);
        form.reset()
        this.showProductFormPopup = false;
      })
  }

  updateProduct(form: FormGroup) {
    this.subSink = this.productService.update(this.selectedModel!.id,
      {...form.value, product_category_id: this.machineCategory?.id || 0})
      .subscribe((prod) => {
        const index = this.products.findIndex((p) => p.id === prod.id);
        if (index > -1) {
          this.products[ index ] = prod;
        }
        form.reset()
        this.showProductFormPopup = false;
      })
  }


  deleteProduct(product: ProductModel) {
    this.subSink = this.productService.destroy(product.id)
      .subscribe(() => {
        const index = this.products.findIndex((p) => p.id === product.id);
        if (index > -1) {
          this.products.splice(index, 1);
        }
      })
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe());
  }

}

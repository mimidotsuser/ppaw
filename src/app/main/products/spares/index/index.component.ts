import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { ProductModel } from '../../../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ProductCategoryModel } from '../../../../models/product-category.model';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  faEllipsisV = faEllipsisV;
  showProductFormPopup = false;
  selectedModel: ProductModel | null = null;
  loadingMainContent = false;
  formSubmissionBusy = false;
  pagination = {page: 1, total: 0, limit: 25}
  private _products: ProductModel[] = [];
  private _subscriptions: Subscription[] = [];
  private _categories: ProductCategoryModel[] = [];
  searchControl: FormControl;


  constructor(private productService: ProductService, private fb: FormBuilder) {
    this.searchControl = this.fb.control('')
  }

  ngOnInit(): void {
    this.loadingMainContent = true;
    this.subSink = this.productService.fetchAllCategories
      .subscribe({
        next: (pc) => {
          this._categories = pc;
          this.fetchProducts()
        }
      })

  }

  private set subSink(v: Subscription) {
    this._subscriptions.push(v);
  }


  get tableCountStart() {
    return (this.pagination.page - 1) * this.pagination.limit
  }

  get tableCountEnd() {
    return this.pagination.page * this.pagination.limit
  }


  get machineCategory(): ProductCategoryModel | undefined {
    return this._categories.find((c) => c.name.toLowerCase() === 'machine');
  }

  get spareCategory(): ProductCategoryModel | undefined {
    return this._categories.find((c) => c.name.toLowerCase() === 'spare');
  }


  fetchProducts() {
    if (this.tableCountEnd <= this._products.length) {return;}

    this.loadingMainContent = true;
    this.subSink = this.productService
      .fetchProducts((this.spareCategory?.id || 0), this.pagination, true)
      .pipe(finalize(() => this.loadingMainContent = false))
      .subscribe((res) => {
        this._products = res.data;
        this.pagination.total = res.total;
      })
  }

  get products(): ProductModel[] {
    return this._products;
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

    this.formSubmissionBusy = true;
    const model = form.value;
    model[ 'parent_id' ] = model.parent.id;
    delete model.parent;
    model[ 'product_category_id' ] = this.spareCategory?.id || 0;
    model[ 'create_old_variant' ] = true;

    if (this.selectedModel?.id) {
      this.updateProduct(form, model)
    } else {
      this.createProduct(form, model)
    }

  }

  createProduct(form: FormGroup, model: ProductModel) {
    this.subSink = this.productService
      .create(model)
      .pipe(finalize(() => this.formSubmissionBusy = false))
      .subscribe((prod) => {
        this.products.unshift(prod);
        form.reset()
        this.showProductFormPopup = false;
      })
  }

  updateProduct(form: FormGroup, model: ProductModel) {
    this.subSink = this.productService.update(this.selectedModel!.id, model)
      .pipe(finalize(() => this.formSubmissionBusy = false))
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

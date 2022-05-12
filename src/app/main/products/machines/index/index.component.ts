import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { ProductModel } from '../../../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ProductCategoryModel } from '../../../../models/product-category.model';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {

  faEllipsisV = faEllipsisV;
  showProductFormPopup = false;
  loadingMainContent = false;
  formSubmissionBusy = false;
  selectedModel: ProductModel | null = null;
  pagination = {page: 1, total: 0, limit: 25}
  private _products: ProductModel[] = [];
  private _subscriptions: Subscription[] = [];
  private _categories: ProductCategoryModel[] = [];
  searchControl: FormControl;

  constructor(private productService: ProductService, private fb: FormBuilder,
              private toastService: ToastService) {
    this.searchControl = this.fb.control('');
  }

  ngOnInit(): void {
    this.loadingMainContent = true;
    this.subSink = this.productService.fetchAllCategories
      .subscribe({
        next: (pc) => {
          this._categories = pc
          this.fetchProducts()
        },
        error: (err) => {
          let message = 'Unexpected error encountered. Please try again';
          if (err.status && err.status == 403) {
            message = 'You do not have required permissions to perform the action';
          }
          this.toastService.show({message, type: 'danger'})
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

  fetchProducts() {
    if (this.tableCountEnd <= this._products.length
      || (this._products.length === this.pagination.total && this.pagination.total !== 0)) {
      return;
    }

    this.loadingMainContent = true;
    this.subSink = this.productService
      .fetchProducts((this.machineCategory?.id || 0), this.pagination)
      .pipe(finalize(() => this.loadingMainContent = false))
      .subscribe({
        next: (res) => {
          this._products = this._products.concat(res.data);
          this.pagination.total = res.total;
        }, error: (err) => {
          let message = 'Unexpected error encountered. Please try again';
          if (err.status && err.status == 403) {
            message = 'You do not have required permissions to perform the action';
          }
          this.toastService.show({message, type: 'danger'})
        }
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
    if (this.selectedModel?.id) {
      this.updateProduct(form)
    } else {
      this.submitProductCreateForm(form)
    }

  }

  submitProductCreateForm(form: FormGroup) {
    this.subSink = this.productService
      .create({...form.value, product_category_id: this.machineCategory?.id || 0})
      .pipe(finalize(() => this.formSubmissionBusy = false))
      .subscribe({
        next: (prod) => {
          this.products.unshift(prod);
          form.reset()
          this.showProductFormPopup = false;
          this.toastService.show({message: 'Product created successfully', delay: 3000})
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

  updateProduct(form: FormGroup) {
    this.subSink = this.productService.update(this.selectedModel!.id,
      {...form.value, product_category_id: this.machineCategory?.id || 0})
      .pipe(finalize(() => this.formSubmissionBusy = false))
      .subscribe({
        next: (prod) => {
          const index = this.products.findIndex((p) => p.id === prod.id);
          if (index > -1) {
            this.products[ index ] = prod;
          }
          form.reset()
          this.showProductFormPopup = false;
          this.toastService.show({message: 'Product updated successfully', delay: 3000})
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


  deleteProduct(product: ProductModel) {
    this.subSink = this.productService.destroy(product.id)
      .subscribe({
        next: () => {
          const index = this.products.findIndex((p) => p.id === product.id);
          if (index > -1) {
            this.products.splice(index, 1);
          }
        }, error: (err) => {
          let message = 'Unexpected error encountered. Please try again';
          if (err.status && err.status == 403) {
            message = 'You do not have required permissions to perform the action';
          }
          this.toastService.show({message, type: 'danger'})
        }
      })
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe());
  }

}

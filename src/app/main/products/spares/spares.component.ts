import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, startWith, switchMap } from 'rxjs';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { SearchService } from '../../../shared/services/search.service';
import { ProductService } from '../services/product.service';
import { ProductModel } from '../../../models/product.model';

@Component({
  selector: 'app-spares',
  templateUrl: './spares.component.html',
  styleUrls: ['./spares.component.scss'],
  providers: [SearchService]
})
export class SparesComponent implements OnInit {
  faEllipsisV = faEllipsisV;
  showSpareFormPopup = false;
  model: ProductModel | null = null;
  productSearchInput: FormControl;
  private _spares: Observable<ProductModel[]> = new Observable<ProductModel[]>();

  constructor(private productService: ProductService, private fb: FormBuilder,
              private searchService: SearchService<ProductModel>) {
    searchService.setFields(['item_code', 'mpn', 'local_description', 'description',
      'eoq', 'minl', 'maxl']);
    this.productSearchInput = this.fb.control('')
  }

  ngOnInit(): void {
    this._spares = this.productSearchInput.valueChanges.pipe(
      startWith(''),
      switchMap((v) => this.searchService.find(v, this.productService.spares))
    )
  }

  get products(): Observable<ProductModel[]> {
    return this._spares;
  }

  get machines(): Observable<ProductModel[]> {
    return this.productService.machines;
  }

  showCreateProductFormPopup() {
    this.showSpareFormPopup = true;
    this.model = null;
  }

  showProductEditForm(product: ProductModel) {
    this.showSpareFormPopup = true;
    this.model = {...product};
  }

  closeProductFormPopup(form: FormGroup) {

  }

  saveProductForm(form: FormGroup) {
    form.markAllAsTouched();
  }

  deleteProduct(product: ProductModel) {

  }

}

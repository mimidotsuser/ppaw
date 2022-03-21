import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, startWith, switchMap } from 'rxjs';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { SearchService } from '../../../../shared/services/search.service';
import { ProductModel } from '../../../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  providers: [SearchService]
})
export class IndexComponent implements OnInit {

  faEllipsisV = faEllipsisV;
  showMachineFormPopup = false;
  model: ProductModel | null = null;
  productSearchInput: FormControl;
  private _machines$: Observable<ProductModel[]> = new Observable<ProductModel[]>();

  constructor(private productService: ProductService, private fb: FormBuilder,
              private searchService: SearchService<ProductModel>) {
    searchService.setFields(['item_code', 'mpn', 'local_description', 'description',
      'eoq', 'minl', 'maxl']);

    this.productSearchInput = this.fb.control('');
  }

  ngOnInit(): void {
    this._machines$ = this.productSearchInput.valueChanges.pipe(
      startWith(''),
      switchMap((v) => this.searchService.find(v, this.productService.machines))
    )
  }

  get products(): Observable<ProductModel[]> {
    return this._machines$;
  }

  showCreateProductFormPopup() {
    this.showMachineFormPopup = true;
    this.model = null;
  }

  showProductEditForm(product: ProductModel) {
    this.showMachineFormPopup = true;
    this.model = {...product};
  }

  closeProductFormPopup(form: FormGroup) {
    this.showMachineFormPopup = false;

  }

  saveProductForm(form: FormGroup) {
    form.markAllAsTouched();
  }

  deleteProduct(product: ProductModel) {

  }

}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, startWith, switchMap } from 'rxjs';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { SpareModel } from '../../../models/spare.model';
import { SearchService } from '../../../shared/services/search.service';
import { ProductService } from '../services/product.service';
import { MachineModel } from '../../../models/machine.model';

@Component({
  selector: 'app-spares',
  templateUrl: './spares.component.html',
  styleUrls: ['./spares.component.scss'],
  providers: [SearchService]
})
export class SparesComponent implements OnInit {
  faEllipsisV = faEllipsisV;
  showSpareFormPopup = false;
  model: SpareModel | null = null;
  productSearchInput = new FormControl('');
  private _spares: Observable<SpareModel[]> = new Observable<SpareModel[]>();

  constructor(private productService: ProductService, private searchService: SearchService<SpareModel>) {
    searchService.setFields(['item_code', 'mpn', 'local_description', 'description', 'eoq', 'minl', 'maxl'])
  }

  ngOnInit(): void {
    this._spares = this.productSearchInput.valueChanges.pipe(
      startWith(''),
      switchMap((v) => this.searchService.find(v, this.productService.spares))
    )
  }

  get products(): Observable<SpareModel[]> {
    return this._spares;
  }

  get machines(): Observable<MachineModel[]> {
    return this.productService.machines;
  }

  showCreateProductFormPopup() {
    this.showSpareFormPopup = true;
    this.model = null;
  }

  showProductEditForm(product: SpareModel) {
    this.showSpareFormPopup = true;
    this.model = {...product};
  }

  closeProductFormPopup(form: FormGroup) {

  }

  saveProductForm(form: FormGroup) {}

  deleteProduct(product: SpareModel) {

  }

}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, startWith, switchMap } from 'rxjs';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { MachineModel } from '../../../models/machine.model';
import { SearchService } from '../../../shared/services/search.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-machines',
  templateUrl: './machines.component.html',
  styleUrls: ['./machines.component.scss'],
  providers: [SearchService]
})
export class MachinesComponent implements OnInit {

  faEllipsisV = faEllipsisV;
  showMachineFormPopup = false;
  model: MachineModel | null = null;
  productSearchInput = new FormControl('');
  private _machines$: Observable<MachineModel[]> = new Observable<MachineModel[]>();

  constructor(private productService: ProductService, private searchService: SearchService<MachineModel>) {
    searchService.setFields(['item_code', 'mpn', 'local_description', 'description', 'eoq', 'minl', 'maxl'])
  }

  ngOnInit(): void {
    this._machines$ = this.productSearchInput.valueChanges.pipe(
      startWith(''),
      switchMap((v) => this.searchService.find(v, this.productService.machines))
    )
  }

  get products(): Observable<MachineModel[]> {
    return this._machines$;
  }

  showCreateProductFormPopup() {
    this.showMachineFormPopup = true;
    this.model = null;
  }

  showProductEditForm(product: MachineModel) {
    this.showMachineFormPopup = true;
    this.model = {...product};
  }

  closeProductFormPopup(form: FormGroup) {

  }

  saveProductForm(form: FormGroup) {}

  deleteProduct(product: MachineModel) {

  }
}

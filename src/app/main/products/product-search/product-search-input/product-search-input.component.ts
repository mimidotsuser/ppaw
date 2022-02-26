import { Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  FormControlDirective,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  switchMap, takeWhile,
  tap
} from 'rxjs';
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { HttpService } from '../../../../core/services/http.service';
import { SpareModel } from '../../../../models/spare.model';
import { MachineModel } from '../../../../models/machine.model';

@Component({
  selector: 'product-search-input',
  templateUrl: './product-search-input.component.html',
  styleUrls: ['./product-search-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => ProductSearchInputComponent)
    }
  ]
})
export class ProductSearchInputComponent implements OnInit, ControlValueAccessor {

  @Input() formControl: FormControl | null = null;
  @Input() formControlName: string = '';
  @ViewChild(FormControlDirective, {static: true}) formControlDirective!: FormControlDirective;

  @Input() id = Math.random().toString(20).substr(3)
  @Input() path = '/products/items'; //TODO replace with correct endpoint
  @Input() editable = false;
  @Input() showIcons = true;
  @Input() outputFormatter: (item: SpareModel | MachineModel) => string;
  @Input() popupClass = 'search-results';
  @Input() placement = 'bottom-start';

  // @Input() localData: Observable<SpareModel[] | MachineModel[] | null> = of(null);


  faSearch = faSearch;
  faSpinner = faSpinner;
  searching = false;
  searchFailed = false;


  constructor(private httpService: HttpService, private formControlContainer: ControlContainer) {
    this.outputFormatter = (item) => {
      return `${item.item_code} | ${item.mpn}`
    }
  }

  ngOnInit(): void {
  }

  get inputControl(): any {
    return this.formControl || this.formControlContainer.control?.get(this.formControlName);
  }

  registerOnChange(fn: any): void {
    this.formControlDirective.valueAccessor?.registerOnChange(fn);
  }

  registerOnTouched(fn: any): void {
    this.formControlDirective.valueAccessor?.registerOnTouched(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.formControlDirective.valueAccessor?.setDisabledState?.(isDisabled);
  }

  writeValue(obj: any): void {
    this.formControlDirective.valueAccessor?.writeValue(obj);
  }


  productSearch(searchValue: string): Observable<SpareModel[] | MachineModel[] | [] | [null]> {
    if (searchValue.trim() === '') {
      return of([]);
    }

    return this.httpService.get(this.path, {params: {search: searchValue}})
      .pipe(tap(() => this.searchFailed = false))
      .pipe(map((res) => res.data))
      .pipe(catchError(() => {
        this.searchFailed = true;
        return []
      }))
      .pipe(takeWhile(() => !this.searchFailed))
      .pipe(map((products: MachineModel[]) => products.filter((product) => {
        return product?.item_code?.toLowerCase().includes(searchValue) ||
          product?.mpn?.toLowerCase().includes(searchValue)
      })))
      .pipe(map((rs) => rs.length > 0 ? rs : [null]))
  }

  autoSearch: (searchTerm: Observable<string>) => Observable<SpareModel[] | MachineModel[] |
    [] | [null]> = (searchTerm: Observable<string>) =>
    searchTerm.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      //TODO: do local data search first?
      switchMap((value: string) => this.productSearch(value.toLowerCase())),
      tap(() => this.searching = false)
    )
}

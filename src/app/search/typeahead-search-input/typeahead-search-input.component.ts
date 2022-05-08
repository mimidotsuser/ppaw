import { Component, forwardRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  FormControlDirective,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  switchMap,
  takeWhile,
  tap
} from 'rxjs';
import { ResultTemplateContext } from '@ng-bootstrap/ng-bootstrap/typeahead/typeahead-window';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '../../core/services/http.service';

@Component({
  selector: 'typeahead-input[path][outputFormatter][resultTemplate][control],' +
    'typeahead-input[path][outputFormatter][resultTemplate][controlName]',
  templateUrl: './typeahead-search-input.component.html',
  styleUrls: ['./typeahead-search-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TypeaheadSearchInputComponent)
    }
  ]
})
export class TypeaheadSearchInputComponent<T> implements OnInit, ControlValueAccessor {

  @Input() control: FormControl | null = null;
  @Input() controlName: string = '';
  @ViewChild(FormControlDirective, {static: true}) formControlDirective!: FormControlDirective;

  @Input() path!: string;
  @Input() outputFormatter!: (item: T) => string;
  @Input() resultTemplate!: TemplateRef<ResultTemplateContext>;
  @Input() queryParams?: { [ key: string ]: string | boolean | number | null };
  @Input() customId?: string = Math.random().toString(20).substr(3)
  @Input() editable = false;
  @Input() showIcons = true;
  @Input() popupClass = 'search-results';
  @Input() placement = 'bottom-start';
  @Input() placeholder = 'Type to search';

  //use modelValueFormatter to override data set to control on suggestion select
  @Input() modelValueFormatter?: (data: T) => any
  //use search to override actual search

  @Input() search?: (searchTerm: string) => Observable<T[] | [] | [null]>

  faSearch = faSearch;
  faSpinner = faSpinner;
  searching = false;
  searchFailed = false;

  constructor(private httpService: HttpService, private formControlContainer: ControlContainer) {}

  ngOnInit(): void {
  }


  get inputControl(): any {
    return this.control || this.formControlContainer.control?.get(this.controlName);
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

  private parsedQueryParams(searchTerm: string): { [ key: string ]: any } {
    if (!this.queryParams) {
      return {search: searchTerm, limit: 10}
    }

    return Object.keys(this.queryParams).reduce((acc: { [ key: string ]: any }, key) => {
      if (typeof this.queryParams![ key ] === 'string') {
        acc[ key ] = (this.queryParams![ key ] as string).replace('%s', searchTerm);
      } else {
        acc[ key ] = this.queryParams![ key ];
      }
      return acc;
    }, {limit: 10})
  }

  private _backendSearch(searchTerm: string): Observable<T[] | [] | [null]> {
    return this.httpService.get(this.path, {params: this.parsedQueryParams(searchTerm)})
      .pipe(map((res) => res.data))
  }

  autoSearch: (searchTerm: Observable<string>) => Observable<T[] | [] | [null]> =
    (searchTerm: Observable<string>) =>
      searchTerm.pipe(debounceTime(800), distinctUntilChanged())
        .pipe(tap(() => this.searching = true))
        .pipe(tap(() => this.searchFailed = false))
        .pipe(switchMap((v: string) => {
          if (v.trim() === '') {return of([]);}

          return this.search
            ? this.search(v)
            : this._backendSearch(v)
        }))
        .pipe(catchError(() => {
          this.searchFailed = true;
          this.searching = false;
          return []
        }))
        .pipe(takeWhile(() => !this.searchFailed))
        .pipe(tap((rs) => this.showIcons = rs.length === 0))
        .pipe(map((rs: any) => Array.isArray(rs) && rs.length > 0 ? rs : [null]))
        .pipe(tap(() => this.searching = false))

  onSelect($event: NgbTypeaheadSelectItemEvent) {
    if (this.modelValueFormatter) {
      this.writeValue(this.modelValueFormatter($event.item));
      $event.preventDefault();
    }
  }

  onFocus($event: FocusEvent) {
    ($event.target as HTMLInputElement).select()
  }
}

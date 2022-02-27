import { Component, forwardRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  FormControlDirective, NG_VALUE_ACCESSOR
} from '@angular/forms';
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable, of, switchMap,
  takeWhile,
  tap
} from 'rxjs';
import { ResultTemplateContext } from '@ng-bootstrap/ng-bootstrap/typeahead/typeahead-window';
import { HttpService } from '../../core/services/http.service';

@Component({
  selector: 'app-search-input[path][outputFormatter][resultTemplate][control],' +
    'app-search-input[path][outputFormatter][resultTemplate][controlName]',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SearchInputComponent)
    }
  ]
})
export class SearchInputComponent<T> implements OnInit, ControlValueAccessor {

  @Input() control: FormControl | null = null;
  @Input() controlName: string = '';
  @ViewChild(FormControlDirective, {static: true}) formControlDirective!: FormControlDirective;

  @Input() path!: string;
  @Input() outputFormatter!: (item: T) => string;
  @Input() resultTemplate!: TemplateRef<ResultTemplateContext>;
  @Input() queryParams?: { [ key: string ]: string | boolean | number | null };
  @Input() id = Math.random().toString(20).substr(3)
  @Input() editable = false;
  @Input() showIcons = true;
  @Input() popupClass = 'search-results';
  @Input() placement = 'bottom-start';
  @Input() placeholder = 'Type to search';

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
      return {search: searchTerm}
    }

    return Object.keys(this.queryParams).reduce((acc: { [ key: string ]: any }, key) => {
      if (typeof this.queryParams![ key ] === 'string') {
        acc[ key ] = (this.queryParams![ key ] as string).replace('%s', searchTerm);
      } else {
        acc[ key ] = this.queryParams![ key ];
      }
      return acc;
    }, {})
  }

  private backendSearch(searchTerm: string): Observable<T[] | [] | [null]> {
    if (searchTerm.trim() === '') {
      return of([]);
    }
    return this.httpService.get(this.path, {params: this.parsedQueryParams(searchTerm)})
      .pipe(tap(() => this.searchFailed = false))
      .pipe(map((res) => res.data))
      .pipe(catchError(() => {
        this.searchFailed = true;
        return []
      }))
      .pipe(takeWhile(() => !this.searchFailed))
      .pipe(map((rs) => rs.length > 0 ? rs : [null]))
  }

  autoSearch: (searchTerm: Observable<string>) => Observable<T[] | [] | [null]> =
    (searchTerm: Observable<string>) =>
      searchTerm.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => this.searching = true),
        //TODO: do local data search first?
        switchMap((value: string) => this.backendSearch(value)),
        tap(() => this.searching = false)
      )
}

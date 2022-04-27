import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  Subject,
  Subscription,
  tap
} from 'rxjs';
import { UserModel } from '../../../../models/user.model';
import { CustomerModel } from '../../../../models/customer.model';
import { WorksheetFiltersModel } from '../../../../models/filters.model';
import { serializeDate } from '../../../../utils/serializers/date';
import { UserService } from '../../../users/services/user.service';
import { CustomerService } from '../../../customers/services/customer.service';
import { WorkCategoryCodes, WorkCategoryTitles } from '../../../../models/worksheet.model';

@Component({
  selector: 'worksheet-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss'],
  providers: [UserService, CustomerService]
})
export class FilterBarComponent implements OnInit, OnDestroy {

  @Output()
  filtersChanged = new EventEmitter<WorksheetFiltersModel | undefined>();

  customerSearch$ = new Subject<string>()
  userSearch$ = new Subject<string>()
  customerSearchBusy = false;
  userSearchBusy = false;
  private _customers: CustomerModel[] = [];
  private _users: UserModel[] = [];
  private _subscriptions: Subscription[] = [];
  private _filters?: WorksheetFiltersModel;
  entryCategories: { id: string, title: string }[]
  model: FiltersFormModel = {};
  dateFiltersMax: string;
  endDateFilterMin?: string;

  constructor(private userService: UserService, private customerService: CustomerService) {
    this.dateFiltersMax = new Date().toISOString().slice(0, 10);
    this.entryCategories = [
      {id: WorkCategoryCodes.REPAIR, title: WorkCategoryTitles.REPAIR},
      {id: WorkCategoryCodes.GENERAL_SERVICING, title: WorkCategoryTitles.GENERAL_SERVICING},
      {
        id: WorkCategoryCodes.DELIVERY_AND_INSTALLATION,
        title: WorkCategoryTitles.DELIVERY_AND_INSTALLATION
      },
      {
        id: WorkCategoryCodes.TRAINING_AND_INSTALLATION,
        title: WorkCategoryTitles.TRAINING_AND_INSTALLATION
      },
      {id: WorkCategoryCodes.TECHNICAL_REPORT, title: WorkCategoryTitles.TECHNICAL_REPORT},
      {id: WorkCategoryCodes.OTHER, title: WorkCategoryTitles.OTHER},
    ];
    this.model[ 'entryCategories' ] = this.entryCategories;
  }

  ngOnInit(): void {
    this.customerSearch();
    this.userSearch();
  }

  set subSink(v: Subscription) {this._subscriptions.push(v)}

  get customers(): CustomerModel[] {return this._customers;}

  get users(): UserModel[] {return this._users;}

  get hasAppliedFilters() {
    return this._filters && Object.values(this._filters).filter((v) => v).length > 0
  }

  get hasFilters() {
    return this.model && Object.values(this.model).filter((v) => v).length > 0
  }

  customerSearch() {
    this.subSink = this.customerSearch$
      .pipe(filter((term) => term != null && term.trim().length > 2),
        distinctUntilChanged(),
        debounceTime(800))
      .pipe(tap(() => this.customerSearchBusy = true))
      .pipe(finalize(() => this.customerSearchBusy = false))
      .subscribe((searchTerm) => {

        this.customerSearchBusy = true;
        this.subSink = this.customerService.fetch({
          limit: 10, search: searchTerm,
          exclude: this._customers.map((c) => c.id).join(',')
        })
          .pipe(finalize(() => this.customerSearchBusy = false))
          .subscribe({
            next: (res) => {
              this._customers = this._customers.concat(res.data)
            }
          })
      })
  }

  customersTrackByFn(item?: CustomerModel) {return item?.id}


  userSearch() {
    this.subSink = this.userSearch$
      .pipe(filter((term) => term != null && term.trim().length > 2),
        distinctUntilChanged(),
        debounceTime(800))
      .pipe(tap(() => this.userSearchBusy = true))
      .pipe(finalize(() => this.userSearchBusy = false))
      .subscribe((searchTerm) => {

        this.userSearchBusy = true;
        this.subSink = this.userService.fetch({
          limit: 10, search: searchTerm,
          exclude: this._users.map((c) => c.id).join(',')
        })
          .pipe(finalize(() => this.userSearchBusy = false))
          .subscribe({
            next: (res) => {
              this._users = this._users.concat(res.data)
            }
          })
      })
  }

  userTrackByFn(item?: UserModel) {return item?.id}


  onStartDateChange() {
    if (this.model.start_date) {
      this.endDateFilterMin = new Date(this.model.start_date).toISOString().slice(0, 10);
    } else {
      this.endDateFilterMin = '';
    }
  }

  applyFilters() {
    this._filters = {};

    if (this.model.start_date) {this._filters.start_date = serializeDate(this.model.start_date)}

    if (this.model.end_date) {this._filters.end_date = serializeDate(this.model.end_date)}

    if (this.model.customers) {
      this._filters.customers = this.model.customers.map((x) => x.id).join(',')
    }
    if (this.model.users) {
      this._filters.created_by = this.model.users.map((x) => x.id).join(',')
    }
    if (this.model.entryCategories) {
      this._filters.entry_categories = this.model.entryCategories
        .map((x) => x.id).join(',')

    }

    this.filtersChanged.emit(this.hasAppliedFilters ? this._filters : undefined);
  }

  clearFilters() {
    //clear query params

    //reset local filters model
    this.model = {customers: [], users: [], entryCategories: []}
    this._filters = undefined;

    //emit event
    this.filtersChanged.emit(this._filters);
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }
}

interface FiltersFormModel {
  entryCategories?: { id: string, title: string }[];
  customers?: CustomerModel[],
  users?: UserModel[],
  start_date?: string,
  end_date?: string,
}

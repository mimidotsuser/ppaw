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
import { WorksheetService } from '../../services/worksheet.service';
import { WorksheetFiltersModel } from '../../../../models/filters.model';
import { serializeDate } from '../../../../utils/serializers/date';

@Component({
  selector: 'worksheet-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss']
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
  model: FiltersFormModel = {};
  dateFiltersMax: string;
  endDateFilterMin?: string;

  constructor(private worksheetService: WorksheetService) {
    this.dateFiltersMax = new Date().toISOString().slice(0, 10);
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


  customerSearch() {
    this.subSink = this.customerSearch$
      .pipe(filter((term) => term != null && term.trim().length > 2),
        distinctUntilChanged(),
        debounceTime(800))
      .pipe(tap(() => this.customerSearchBusy = true))
      .pipe(finalize(() => this.customerSearchBusy = false))
      .subscribe((searchTerm) => {

        this.customerSearchBusy = true;
        this.subSink = this.worksheetService
          .fetchCustomers({
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
        this.subSink = this.worksheetService
          .fetchUsers({
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

    this.filtersChanged.emit(this._filters);
  }

  clearFilters() {
    //clear query params

    //reset local filters model
    this.model = {customers: [], users: []}
    this._filters = undefined;

    //emit event
    this.filtersChanged.emit(this._filters);
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }
}

interface FiltersFormModel {
  customers?: CustomerModel[],
  users?: UserModel[],
  start_date?: string,
  end_date?: string,
}

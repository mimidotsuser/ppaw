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
import { PurchaseRequestFiltersModel } from '../../../../models/filters.model';
import { CustomerModel } from '../../../../models/customer.model';
import { UserModel } from '../../../../models/user.model';
import { serializeDate } from '../../../../utils/serializers/date';
import { UserService } from '../../../users/services/user.service';

@Component({
  selector: 'purchase-request-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss'],
  providers: [UserService]
})
export class FilterBarComponent implements OnInit, OnDestroy {

  @Output()
  filtersChanged = new EventEmitter<PurchaseRequestFiltersModel | undefined>();

  userSearch$ = new Subject<string>()
  userSearchBusy = false;
  private _customers: CustomerModel[] = [];
  private _users: UserModel[] = [];
  private _subscriptions: Subscription[] = [];
  private _filters?: PurchaseRequestFiltersModel;
  model: FiltersFormModel = {};
  dateFiltersMax: string;
  endDateFilterMin?: string;
  requestStages: { id: string, title: string }[]

  constructor(private userService: UserService) {
    this.dateFiltersMax = new Date().toISOString().slice(0, 10);

    this.requestStages = [
      {id: 'approved', title: 'Complete'},
      {id: 'verified', title: 'Approval'},
      {id: 'created', title: 'Verification'},
    ]
  }

  ngOnInit(): void {
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

    if (this.model.stages) {
      this._filters.stages = this.model.stages.map((stage) => stage.id).join(',')
    }
    if (this.model.users) {
      this._filters.created_by = this.model.users.map((x) => x.id).join(',')
    }

    this.filtersChanged.emit(this._filters);
  }

  clearFilters() {
    //clear query params

    //reset local filters model
    this.model = {stages: [], users: []}
    this._filters = undefined;

    //emit event
    this.filtersChanged.emit(this._filters);
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }
}

interface FiltersFormModel {
  stages?: { id: string, title: string }[],
  users?: UserModel[],
  start_date?: string,
  end_date?: string,
}

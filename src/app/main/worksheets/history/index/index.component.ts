import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { faEllipsisV, faFilter } from '@fortawesome/free-solid-svg-icons';
import { WorksheetModel } from '../../../../models/worksheet.model';
import { PaginationModel } from '../../../../models/pagination.model';
import { WorksheetService } from '../../services/worksheet.service';
import { WorksheetFiltersModel } from '../../../../models/filters.model';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  faFilter = faFilter
  faEllipsisV = faEllipsisV;
  loadingMainContent = false;
  private _worksheets: WorksheetModel[] = [];
  private _subscriptions: Subscription[] = [];
  pagination: PaginationModel = {limit: 25, total: 0, page: 1};
  worksheetFilters?: WorksheetFiltersModel;
  searchInput: FormControl;

  constructor(private fb: FormBuilder, private worksheetService: WorksheetService,
              private _route: ActivatedRoute) {
    this.searchInput = this.fb.control(null);
    this.loadWorksheets();
  }

  ngOnInit(): void {
  }

  set subSink(v: Subscription) {
    this._subscriptions.push(v);
  }

  get tableCountStart() {
    return (this.pagination.page - 1) * this.pagination.limit
  }

  get tableCountEnd() {
    return this.pagination.page * this.pagination.limit
  }

  get worksheets() {
    return this._worksheets;
  }

  get route() {return this._route}

  loadWorksheets() {
    if (this.tableCountEnd <= this._worksheets.length
      || (this._worksheets.length === this.pagination.total && this.pagination.total !== 0)) {
      return;
    }

    this.loadingMainContent = true;
    this.subSink = this.worksheetService
      .fetch({...this.pagination, ...this.worksheetFilters || []})
      .pipe(finalize(() => this.loadingMainContent = false))
      .subscribe({
        next: (res) => {
          this.pagination.total = res.total;
          this._worksheets = this.worksheets.concat(res.data);
        }
      })
  }

  filtersChanged(filters?: WorksheetFiltersModel) {
    this._worksheets = []; //reset existing worksheet data
    this.worksheetFilters = filters;
    this.loadWorksheets();
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }
}

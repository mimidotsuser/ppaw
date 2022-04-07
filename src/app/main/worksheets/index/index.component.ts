import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { faEllipsisV, faFilter } from '@fortawesome/free-solid-svg-icons';
import { WorksheetModel } from '../../../models/worksheet.model';
import { WorksheetService } from '../services/worksheet.service';
import { PaginationModel } from '../../../models/pagination.model';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {

  faFilter = faFilter
  faEllipsisV = faEllipsisV;
  private _worksheets: WorksheetModel[] = [];
  private _subscriptions: Subscription[] = [];
  pagination: PaginationModel = {limit: 25, total: 0, page: 1};
  searchInput: FormControl;

  constructor(private fb: FormBuilder, private worksheetService: WorksheetService) {
    this.searchInput = this.fb.control(null);
    this.loadWorksheets();
  }

  ngOnInit(): void {
  }

  set subSink(v: Subscription) {
    this._subscriptions.push(v);
  }

  get worksheets() {
    return this._worksheets;
  }

  loadWorksheets() {
    this.subSink = this.worksheetService.fetch(this.pagination)
      .subscribe({
        next: (res) => {
          this.pagination.total = res.total;
          this._worksheets = this.worksheets.concat(res.data);
        }
      })
  }

  viewWorksheetSummary(worksheet: WorksheetModel) {

  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }
}

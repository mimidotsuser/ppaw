import { Component, OnInit } from '@angular/core';
import { PaginationModel } from '../../../../models/pagination.model';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WorksheetEntryModel, WorksheetModel } from '../../../../models/worksheet.model';
import { WorksheetService } from '../../services/worksheet.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})
export class ShowComponent implements OnInit {

  pagination: PaginationModel = {total: 0, page: 1, limit: 15}
  private _subscriptions: Subscription[] = []
  searchInput: FormControl;
  model?: WorksheetModel;

  constructor(private _route: ActivatedRoute, private fb: FormBuilder, private router: Router,
              private worksheetService: WorksheetService) {
    this.loadRequest();
    this.searchInput = this.fb.control('');

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

  get entries(): WorksheetEntryModel[] {
    return !this.model?.entries ? [] : this.model.entries;
  }

  get authorName() {
    return `${this.model?.created_by?.first_name || ''} ${this.model?.created_by?.last_name || ''}`
  }

  loadRequest() {
    this.subSink = this.worksheetService.fetchById(this._route.snapshot.params[ 'id' ])
      .subscribe((model) => {
        this.model = model;
        this.pagination.total = model.entries?.length || 0;
      });
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }

}

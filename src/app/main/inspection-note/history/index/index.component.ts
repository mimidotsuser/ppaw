import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';
import {
  faEllipsisV,
  faExternalLinkAlt,
  faEye,
  faFilePdf,
  faFilter
} from '@fortawesome/free-solid-svg-icons';
import { PaginationModel } from '../../../../models/pagination.model';
import { InspectionNoteService } from '../../services/inspection-note.service';
import { InspectionModel } from '../../../../models/inspection.model';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {


  faFilter = faFilter;
  faEllipsisV = faEllipsisV;
  faEye = faEye;
  faFilePdf = faFilePdf;
  faExternalLinkAlt = faExternalLinkAlt;
  loadingMainContent = false;
  pagination: PaginationModel = {page: 1, limit: 25, total: 0}
  private _requests: InspectionModel[] = [];
  private _subscriptions: Subscription[] = []
  searchInput: FormControl;

  constructor(private fb: FormBuilder, private inspectionService: InspectionNoteService,
              private _route: ActivatedRoute) {
    this.loadRequests();
    this.searchInput = this.fb.control('');
  }

  ngOnInit(): void {
  }

  private set subSink(v: Subscription) {
    this._subscriptions.push(v);
  }

  get tableCountStart() {
    return (this.pagination.page - 1) * this.pagination.limit
  }

  get tableCountEnd() {
    return this.pagination.page * this.pagination.limit
  }

  get requests(): InspectionModel [] {
    return this._requests
  }

  get route() {return this._route}

  loadRequests() {
    if (this.tableCountEnd <= this._requests.length
      || (this._requests.length === this.pagination.total && this.pagination.total !== 0)) {
      return;
    }
    this.loadingMainContent = true;
    this.subSink = this.inspectionService.fetchHistory(this.pagination)
      .pipe(finalize(() => this.loadingMainContent = false))
      .subscribe({
        next: (res) => {
          this._requests = this._requests.concat(res.data);
          this.pagination.total = res.total;
        }
      })
  }

  exportInspectionNote(request: InspectionModel) {
    this.subSink = this.inspectionService.download(request);
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }
}

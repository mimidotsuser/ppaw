import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, Subscription } from 'rxjs';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { PaginationModel } from '../../../../models/pagination.model';
import { InspectionChecklistModel, InspectionModel } from '../../../../models/inspection.model';
import {
  GoodsReceiptNoteItemModel,
  GoodsReceiptNoteModel,
  GRNReceiptNoteStage
} from '../../../../models/goods-receipt-note.model';
import { GoodsReceiptNoteService } from '../../services/goods-receipt-note.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})
export class ShowComponent implements OnInit, OnDestroy {

  faFilePdf = faFilePdf;
  loadingMainContent = false;
  pagination: PaginationModel = {total: 0, page: 1, limit: 15}
  private _subscriptions: Subscription[] = []
  searchInput: FormControl;
  model?: GoodsReceiptNoteModel

  constructor(private _route: ActivatedRoute, private fb: FormBuilder, private router: Router,
              private noteService: GoodsReceiptNoteService) {
    this.loadRequest();
    this.searchInput = this.fb.control('');

  }

  ngOnInit(): void {
  }

  get authorName() {
    return this.model && this.model.created_by ?
      `${this.model.created_by?.first_name} ${this.model.created_by?.last_name}` : '';
  }

  get items(): GoodsReceiptNoteItemModel[] {
    return !this.model || !this.model?.items ? [] : this.model.items;
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

  get route() {
    return this._route;
  }

  get inspectionChecklist(): InspectionChecklistModel[] {
    return this.model?.inspection_note?.checklist ? this.model.inspection_note.checklist : [];
  }

  loadRequest() {
    this.loadingMainContent = true;
    this.subSink = this.noteService.findById(this.route.snapshot.params[ 'id' ])
      .pipe(finalize(() => this.loadingMainContent = false))
      .subscribe((model) => {
        this.model = model;
        this.pagination.total = model?.items?.length || 0;
      });
  }


  canExportGRN(request: GoodsReceiptNoteModel) {
    return request?.activities && request.activities
      .findIndex((activity) => {
        return activity.stage === GRNReceiptNoteStage.APPROVAL_OKAYED
      }) > -1
  }

  canExportRGA(request: GoodsReceiptNoteModel) {
    return request?.has_rejected_items && this.canExportGRN(request)
  }

  exportGRN(request: GoodsReceiptNoteModel) {
    this.subSink = this.noteService.downloadGRN(request);
  }

  exportInspectionNote(request: InspectionModel) {
    this.subSink = this.noteService.downloadInspectionNote(request);

  }

  exportRGA(request: GoodsReceiptNoteModel) {
    this.subSink = this.noteService.downloadRGA(request);

  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }

}

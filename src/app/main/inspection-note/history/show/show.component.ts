import { Component, OnInit } from '@angular/core';
import { InspectionChecklistModel, InspectionModel } from '../../../../models/inspection.model';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { GoodsReceiptNoteItemModel } from '../../../../models/goods-receipt-note.model';
import { PaginationModel } from '../../../../models/pagination.model';
import { InspectionNoteService } from '../../services/inspection-note.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})
export class ShowComponent implements OnInit {
  faFilePdf = faFilePdf;
  pagination: PaginationModel = {total: 0, page: 1, limit: 15}
  private _subscriptions: Subscription[] = []
  searchInput: FormControl;
  model?: InspectionModel

  constructor(private _route: ActivatedRoute, private fb: FormBuilder, private router: Router,
              private inspectionNoteService: InspectionNoteService) {
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
    return !this.model || !this.model?.goods_receipt_note?.items ? [] : this.model.goods_receipt_note.items;
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
    return this.model?.checklist ? this.model.checklist : [];
  }

  loadRequest() {
    this.subSink = this.inspectionNoteService.findById(this.route.snapshot.params[ 'id' ])
      .subscribe((model) => {
        this.model = model;
        this.pagination.total = model?.goods_receipt_note?.items?.length || 0;
      });
  }

  exportInspectionNote(request: InspectionModel) {
    this.subSink = this.inspectionNoteService.download(request);
  }


  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }
}

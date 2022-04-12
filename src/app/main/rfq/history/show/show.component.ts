import { Component, OnDestroy, OnInit } from '@angular/core';
import { PaginationModel } from '../../../../models/pagination.model';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestForQuotationService } from '../../services/request-for-quotation.service';
import { RFQItemModel, RFQModel } from '../../../../models/r-f-q.model';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})
export class ShowComponent implements OnInit, OnDestroy {

  pagination: PaginationModel = {total: 0, page: 1, limit: 15}
  private _subscriptions: Subscription[] = []
  searchInput: FormControl;
  model?: RFQModel;

  constructor(private _route: ActivatedRoute, private fb: FormBuilder, private router: Router,
              private requisitionService: RequestForQuotationService) {
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

  get requestItems(): RFQItemModel[] {
    return !this.model?.items ? [] : this.model.items;
  }

  get authorName() {
    return `${this.model?.created_by?.first_name || ''} ${this.model?.created_by?.last_name || ''}`
  }

  get route() {return this._route}

  loadRequest() {
    this.subSink = this.requisitionService.findById(this.route.snapshot.params[ 'id' ])
      .subscribe((model) => {
        this.model = model;
        this.pagination.total = model.items?.length;
      });
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }

}

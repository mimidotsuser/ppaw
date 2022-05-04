import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { faFilePdf } from '@fortawesome/free-regular-svg-icons';
import { PaginationModel } from '../../../../models/pagination.model';
import { MRFItemModel, MRFModel, MRFStage } from '../../../../models/m-r-f.model';
import { MaterialRequisitionService } from '../../services/material-requisition.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})
export class ShowComponent implements OnInit {

  faFilePdf = faFilePdf
  pagination: PaginationModel = {total: 0, page: 1, limit: 25}
  private _subscriptions: Subscription[] = []
  searchInput: FormControl;
  model?: MRFModel;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router,
              private requisitionService: MaterialRequisitionService,) {
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

  get requestItems(): MRFItemModel[] {
    return !this.model?.items ? [] : this.model.items;
  }

  get authorName() {
    return `${this.model?.created_by?.first_name || ''} ${this.model?.created_by?.last_name || ''}`
  }

  loadRequest() {
    this.subSink = this.requisitionService.fetchById(this.route.snapshot.params[ 'id' ])
      .subscribe((model) => {
        this.model = model;
        this.pagination.total = model.items?.length;
      });
  }


  canExportMRN(model: MRFModel) {
    return model.activities && model.activities.findIndex((log) => {
      return log.stage === MRFStage.APPROVAL_OKAYED ||
        log.stage === MRFStage.PARTIAL_ISSUE || log.stage === MRFStage.ISSUED
    }) > -1

  }

  canExportSIV(model: MRFModel) {
    return model.activities && model?.activities.findIndex((log) => {
      return log.stage === MRFStage.PARTIAL_ISSUE || log.stage === MRFStage.ISSUED
    }) > -1;
  }

  exportMRN(request: MRFModel) {
    this.subSink = this.requisitionService.exportMRN(request);
  }

  exportSIV(request: MRFModel) {
    this.subSink = this.requisitionService.exportSiv(request);
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }
}

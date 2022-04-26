import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize, Subscription } from 'rxjs';
import { faEllipsisV, faEye, faFilePdf, faFilter } from '@fortawesome/free-solid-svg-icons';
import { MRFActivity, MRFModel, MRFStage } from '../../../../models/m-r-f.model';
import { PaginationModel } from '../../../../models/pagination.model';
import { MaterialRequisitionService } from '../../services/material-requisition.service';
import { MaterialRequisitionFiltersModel } from '../../../../models/filters.model';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {

  faFilter = faFilter
  faEllipsisV = faEllipsisV;
  faFilePdf = faFilePdf;
  faEye = faEye;
  loadingMainContent = false;
  showRequestSummaryPopup = false;
  selectedModel: MRFModel | null = null;
  pagination: PaginationModel = {total: 0, page: 1, limit: 25}
  private _requests: MRFModel[] = [];
  private _subscriptions: Subscription [] = [];
  private _requisitionFilters?: MaterialRequisitionFiltersModel
  searchInput: FormControl;


  constructor(private requisitionService: MaterialRequisitionService, private fb: FormBuilder,
              private _route: ActivatedRoute) {

    this.loadRequests();
    this.searchInput = this.fb.control('');
  }

  ngOnInit(): void {
  }

  get requests(): MRFModel[] {
    return this._requests;
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

  get route() {return this._route;}

  loadRequests() {
    if (this.tableCountEnd <= this._requests.length) {
      return;
    }
    this.loadingMainContent = true;

    this.subSink = this.requisitionService
      .fetch({...this.pagination, ...this._requisitionFilters || []})
      .pipe(finalize(() => this.loadingMainContent = false))
      .subscribe((res) => {
        this.pagination.total = res.total;
        this._requests = this._requests.concat(res.data);
      });
  }

  showRequestSummary(item: MRFModel) {
    this.showRequestSummaryPopup = true;
    this.selectedModel = item;
  }

  stage(log?: MRFActivity): string {
    if (!log) {return '---'}
    if (log.stage === MRFStage.REQUEST_CREATED) {
      return 'Verification Stage';
    }

    if (log.stage === MRFStage.VERIFIED_REJECTED) {
      return 'Verification Stage';
    }
    if (log.stage === MRFStage.VERIFIED_OKAYED) {
      return 'Approval Stage';
    }

    if (log.stage === MRFStage.APPROVAL_REJECTED) {
      return 'Approval Stage';
    }
    if (log.stage === MRFStage.APPROVAL_OKAYED || log.stage === MRFStage.PARTIAL_ISSUE) {
      return 'Issue/Checkout Stage';
    }

    if (log.stage === MRFStage.ISSUED) {
      return 'Complete'
    }
    return 'Unknown';
  }

  status(log?: MRFActivity): string {
    if (!log) {return '---'}

    if (log.stage === MRFStage.REQUEST_CREATED || log.stage === MRFStage.VERIFIED_OKAYED
      || log.stage === MRFStage.APPROVAL_OKAYED) {
      return 'Pending';
    }
    if (log.stage === MRFStage.VERIFIED_REJECTED || log.stage === MRFStage.APPROVAL_REJECTED) {
      return 'Request Rejected'
    }
    if (log.stage === MRFStage.PARTIAL_ISSUE) {
      return 'Partially Issued'
    }
    if (log.stage === MRFStage.ISSUED) {
      return 'Issued/Complete'
    }
    return 'Unknown';
  }

  formatTimelineStageTitle(log: MRFActivity) {
    if (log.stage === MRFStage.REQUEST_CREATED) {
      return 'Request Application Stage';
    }
    if (log.stage === MRFStage.VERIFIED_OKAYED || log.stage === MRFStage.VERIFIED_REJECTED) {
      return 'Request Verification Stage';
    }
    if (log.stage === MRFStage.APPROVAL_OKAYED || log.stage === MRFStage.APPROVAL_REJECTED) {
      return 'Request Approval Stage';
    }
    if (log.stage === MRFStage.ISSUED || log.stage === MRFStage.PARTIAL_ISSUE) {
      return 'Request Checkout';
    }
    return 'Request Stage Unknown';
  }

  canExportMRN(model: MRFModel) {
    if (model.latest_activity) {
      return model.latest_activity.stage === MRFStage.APPROVAL_OKAYED ||
        model.latest_activity.stage === MRFStage.PARTIAL_ISSUE ||
        model.latest_activity.stage === MRFStage.ISSUED
    }
    if (!model.activities) {
      return false;
    }
    const index = model?.activities.findIndex((log) => {
      return log.stage === MRFStage.APPROVAL_OKAYED || log.stage === MRFStage.PARTIAL_ISSUE
        || log.stage === MRFStage.ISSUED
    });
    return index > -1;
  }

  canExportSIV(model: MRFModel) {
    if (model.latest_activity) {
      return model.latest_activity.stage === MRFStage.PARTIAL_ISSUE ||
        model.latest_activity.stage === MRFStage.ISSUED
    }
    if (!model.activities) {
      return false;
    }

    const index = model?.activities.findIndex((log) => {
      return log.stage === MRFStage.PARTIAL_ISSUE || log.stage === MRFStage.ISSUED
    });
    return index > -1;
  }

  exportMRN(request: MRFModel) {
    this.subSink = this.requisitionService.exportMRN(request);
  }

  exportSIV(request: MRFModel) {
    this.subSink = this.requisitionService.exportSiv(request);
  }

  filtersChanged(filters?: MaterialRequisitionFiltersModel) {
    this._requisitionFilters = filters;
    this._requests = [];
    this.loadRequests();

  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }
}

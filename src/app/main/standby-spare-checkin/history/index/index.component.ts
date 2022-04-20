import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaginationModel } from '../../../../models/pagination.model';
import { Subscription } from 'rxjs';
import { StandbySpareCheckinModel } from '../../../../models/standby-spare-checkin.model';
import { StandbySpareCheckinService } from '../../services/standby-spare-checkin.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {

  pagination: PaginationModel = {total: 0, page: 1, limit: 25}
  private _subscriptions: Subscription[] = [];
  private _requests: StandbySpareCheckinModel[] = [];

  constructor(private _route: ActivatedRoute, private service: StandbySpareCheckinService) {
    this.loadRequests();
  }

  ngOnInit(): void {
  }

  get route() {return this._route}


  set subSink(v: Subscription) {
    this._subscriptions.push(v);
  }

  get tableCountStart() {
    return (this.pagination.page - 1) * this.pagination.limit
  }

  get tableCountEnd() {
    return this.pagination.page * this.pagination.limit
  }

  get requests() {return this._requests}

  loadRequests() {
    if (this.tableCountEnd <= this.requests.length) {
      return;
    }
    this.subSink = this.service.fetch(this.pagination)
      .subscribe({
        next: (res) => {
          this.pagination.total = res.total;
          this._requests = this._requests.concat(res.data);
        }
      })
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable, startWith, switchMap } from 'rxjs';
import { MaterialRequisitionService } from '../../services/material-requisition.service';
import { MRFModel, MRFItemModel, MRFStage } from '../../../../models/m-r-f.model';
import { SearchService } from '../../../../shared/services/search.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {

  requestSearchInput: FormControl;
  private requests$!: Observable<MRFModel[]>;

  constructor(private crService: MaterialRequisitionService, private fb: FormBuilder) {

    this.requestSearchInput = this.fb.control('');
  }

  ngOnInit(): void {

  }

  get checkoutRequests(): Observable<MRFModel[]> {
    return this.requests$;
  }


  aggregateQty(items: MRFItemModel[]) {
    return this.crService.aggregateQty(items);
  }

  approvedOn(item: MRFModel): string {
    const x = item?.activities?.find((log) => log.stage === MRFStage.VERIFIED_OKAYED);
    return x ? x.created_at : '';
  }

  approver(item: MRFModel): string {
    const x = item?.activities?.find((log) => log.stage === MRFStage.VERIFIED_OKAYED);
    return x ? `${x.created_by?.first_name || ''} ${x.created_by?.last_name || ''}` : '---';

  }

}

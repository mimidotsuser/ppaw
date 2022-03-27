import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MaterialRequisitionService } from '../../services/material-requisition.service';
import { Observable } from 'rxjs';
import { MRFModel, MRFItemModel } from '../../../../models/m-r-f.model';

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
}

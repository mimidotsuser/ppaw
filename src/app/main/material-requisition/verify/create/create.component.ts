import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { MaterialRequisitionService } from '../../services/material-requisition.service';
import { MRFModel, MRFOrderItemModel, MRFStage } from '../../../../models/m-r-f.model';

@Component({
  selector: 'app-verify',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {

  faExternalLinkAlt = faExternalLinkAlt;
  model: MRFModel | null = null;
  subscriptions: Subscription[] = [];
  form: FormGroup;

  constructor(private route: ActivatedRoute, private fb: FormBuilder,
              private crService: MaterialRequisitionService) {
    const x = this.crService.findById(this.route.snapshot.params[ 'id' ])
      .subscribe((v) => this.model = v);

    if (x) {
      this.subscriptions.push(x);
    }

    this.form = this.fb.group({});
  }

  ngOnInit(): void {
  }

  formatOrderId(order: number) {
    return this.crService.formatOrderId(order);
  }

  aggregateQty(items: MRFOrderItemModel[]) {
    return this.crService.aggregateQty(items);
  }

  get name() {
    return `${this.model?.created_by?.first_name || ''} ${this.model?.created_by?.last_name || ''}`
  }

  get requesterRemarks() {
    const log = this.model?.logs ?
      this.model?.logs.find((log) => log?.stage === MRFStage.CREATE) : null;

    return log ? log.remarks : '';
  }


  submit() {
    //TODO
  }

  ngOnDestroy(): void {
    this.subscriptions.map((s) => s.unsubscribe())
  }
}

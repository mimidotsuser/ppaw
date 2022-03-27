import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { MRFItemModel, MRFModel, MRFStage } from '../../../../models/m-r-f.model';
import { MaterialRequisitionService } from '../../services/material-requisition.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

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


  aggregateQty(items: MRFItemModel[]) {
    return this.crService.aggregateQty(items);
  }

  get name() {
    return `${this.model?.created_by?.first_name || ''} ${this.model?.created_by?.last_name || ''}`
  }

  get requesterRemarks() {
    const log = this.model?.activities ?
      this.model?.activities.find((log) => log?.stage === MRFStage.REQUEST_CREATED) : null;

    return log ? log.remarks : '';
  }

  get verifierRemarks() {
    const log = this.model?.activities ?
      this.model?.activities.find((log) => log?.stage === MRFStage.VERIFIED_OKAYED) : null;

    return log ? log.remarks : '';
  }


  submit() {
    //TODO
  }
}

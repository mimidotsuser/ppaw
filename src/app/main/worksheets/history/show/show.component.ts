import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { PaginationModel } from '../../../../models/pagination.model';
import { WorksheetEntryModel, WorksheetModel } from '../../../../models/worksheet.model';
import { WorksheetService } from '../../services/worksheet.service';
import { ActivityDescriptionModel } from '../../../../models/activity-description.model';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})
export class ShowComponent implements OnInit {

  faExternalLinkAlt = faExternalLinkAlt;
  groupsPagination: PaginationModel = {total: 0, page: 1, limit: 15}
  entriesPagination: PaginationModel = {total: 0, page: 1, limit: 15}
  sparesPagination: PaginationModel = {total: 0, page: 1, limit: 15}
  showWorksheetEntryPopup = false;
  private _subscriptions: Subscription[] = []
  searchInput: FormControl;
  model?: WorksheetModel;
  selectedEntry?: GroupedEntryModel;

  constructor(private _route: ActivatedRoute, private fb: FormBuilder, private router: Router,
              private worksheetService: WorksheetService) {
    this.loadRequest();
    this.searchInput = this.fb.control('');

  }

  ngOnInit(): void {
  }


  set subSink(v: Subscription) {
    this._subscriptions.push(v);
  }

  get groupsTableCountStart() {
    return (this.groupsPagination.page - 1) * this.groupsPagination.limit
  }

  get groupsTableCountEnd() {
    return this.groupsPagination.page * this.groupsPagination.limit
  }

  get entriesTableCountStart() {
    return (this.entriesPagination.page - 1) * this.entriesPagination.limit
  }

  get entriesTableCountEnd() {
    return this.entriesPagination.page * this.entriesPagination.limit
  }

  get sparesTableCountStart() {
    return (this.sparesPagination.page - 1) * this.sparesPagination.limit
  }

  get sparesTableCountEnd() {
    return this.sparesPagination.page * this.sparesPagination.limit
  }


  get entries(): WorksheetEntryModel[] {
    return !this.model?.entries ? [] : this.model.entries;
  }

  get authorName() {
    return `${this.model?.created_by?.first_name || ''} ${this.model?.created_by?.last_name || ''}`
  }

  get customer() {
    return !this.model?.customer ? '' :
      `${this.model?.customer?.name} | ${this.model?.customer?.region || this.model?.customer?.branch}`;
  }

  get route() {return this._route}

  get groupedEntries(): GroupedEntryModel[] {

    if (!this.model?.entries) {
      return [];
    }
    return this.model.entries.reduce((acc: GroupedEntryModel[], entry) => {

      const group = acc.find((g) => {
        return g.category_code === entry.log_category_code && g?.remark?.id == entry?.remark?.id
      });

      if (group) {
        group.entries.push(entry);
      } else {
        acc.push({
          entries: [entry],
          category_code: entry.log_category_code,
          category_title: entry.log_category_title,
          remark: entry?.remark
        })
      }
      this.groupsPagination.total = acc.length; //avoiding extra variable
      return acc;
    }, []);
  }

  loadRequest() {
    this.subSink = this.worksheetService.fetchById(this._route.snapshot.params[ 'id' ])
      .subscribe((model) => {
        this.model = model;
      });
  }

  showEntrySummary(group: GroupedEntryModel) {
    this.showWorksheetEntryPopup = true;
    this.selectedEntry = group;
    this.sparesPagination.total = group.entries[ 0 ]?.repair?.products?.length || 0;
    this.entriesPagination.total = group.entries.length;
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe())
  }

}

interface GroupedEntryModel {
  remark?: ActivityDescriptionModel;
  category_code: string;
  category_title: string;
  entries: WorksheetEntryModel[]
}

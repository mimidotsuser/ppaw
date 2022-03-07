import { Component, OnInit } from '@angular/core';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { WorksheetModel } from '../../../models/worksheet.model';
import { UserModel } from '../../../models/user.model';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  worksheets: WorksheetModel[] = [];
  faFilter = faFilter
  searchInput: FormControl;

  constructor(private fb: FormBuilder) {
    this.searchInput = this.fb.control(null);
  }

  ngOnInit(): void {
  }

  deserializeAuthorName(user?: UserModel): string {
    if (!user || (!user.first_name && !user.last_name)) {return ''}
    return `${user.first_name || ''} ${user.last_name || ''}`
  }
}

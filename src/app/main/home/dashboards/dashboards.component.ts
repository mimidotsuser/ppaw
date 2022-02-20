import { Component, OnInit } from '@angular/core';
import { MetaService } from '../../../core/services/meta.service';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss']
})
export class DashboardsComponent implements OnInit {

  constructor(private metaService: MetaService) {
    this.metaService.title = 'Dashboard'
  }

  ngOnInit(): void {
  }

}

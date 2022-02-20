import { Component, Input, OnInit } from '@angular/core';
import { MetaService } from '../../../core/services/meta.service';

@Component({
  selector: 'app-content-header',
  templateUrl: './content-header.component.html',
  styleUrls: ['./content-header.component.scss']
})
export class ContentHeaderComponent implements OnInit {

  @Input() menuItems: string[] = []
  @Input() title: string = '';

  constructor(private titleService: MetaService) {
    titleService.title = this.title;
  }

  ngOnInit(): void {
  }


  get totalItems() {
    return this.menuItems.length;
  }
}

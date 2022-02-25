import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../shared/services/search.service';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  providers: [SearchService]
})
export class ProductsComponent implements OnInit {
  activeTab = 'machinesTab';

  constructor(private router: Router) { }

  ngOnInit(): void {
    if (this.router.url.includes('/spares')) {
      this.activeTab = 'sparesTab'
    }
  }

}

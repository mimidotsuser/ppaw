import { Component, OnDestroy, OnInit } from '@angular/core';
import {  NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { SearchService } from '../../shared/services/search.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  providers: [SearchService]
})
export class ProductsComponent implements OnInit, OnDestroy {
  activeTab = 'machinesTab';
  routerSubscription: null | Subscription = null;

  constructor(private router: Router) { }

  ngOnInit(): void {
    if (this.router.url.includes('/spares')) {
      this.activeTab = 'sparesTab'
    }
    /* This will be crucial if component has already been initialized */
    this.routerSubscription = this.router.events
      .pipe(filter((evt) => evt instanceof NavigationEnd))
      .subscribe((val: any) => {
        if (val?.url.includes('/spares')) {
          this.activeTab = 'sparesTab'
        } else {
          this.activeTab = 'machinesTab'
        }
      });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

}

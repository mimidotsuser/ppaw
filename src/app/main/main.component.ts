import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ActivationEnd,
  NavigationEnd,
  NavigationStart,
  Router
} from '@angular/router';
import { filter, Subscription, tap } from 'rxjs';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faAddressBook,
  faBook,
  faCheckDouble,
  faCircleNotch,
  faClipboardCheck,
  faCubes,
  faDolly,
  faFileInvoiceDollar,
  faHome,
  faPeopleCarry,
  faShoppingBasket,
  faShoppingCart,
  faUserShield,
  faWarehouse
} from '@fortawesome/free-solid-svg-icons';
import { environment } from '../../environments/environment';
import { HttpService } from '../core/services/http.service';
import { MetaService } from '../core/services/meta.service';
import { AuthService } from '../core/services/auth.service';
import { DownloadService } from '../core/services/download.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  faCircleNotch = faCircleNotch;
  appName: string = environment.app.name;
  logoUrl: string = environment.app.logoUrl;
  hideSidebarMenu = true;
  totalDownloadJobs = 0;
  private _subscriptions: Subscription[] = [];


  pageTitle: string = '';
  private _breadcrumbList: { label: string, title: string, path: string, active: boolean }[] = [];
  breadcrumbList: { label: string, title: string, path: string, active: boolean }[] = [];

  constructor(private router: Router, private httpService: HttpService,
              private authService: AuthService, private titleService: MetaService,
              private downloadService: DownloadService) {

    this.subSink = this.router.events
      .pipe(filter((evt) => evt instanceof NavigationStart))
      .pipe(tap(() => this.hideSidebarMenu = true))
      .subscribe()

    this.subSink = this.router.events
      .pipe(filter((evt) => evt instanceof ActivationEnd || evt instanceof NavigationEnd))
      .subscribe((evt) => {
        this.resolveBreadcrumb(evt as ActivationEnd | NavigationEnd);
      })
  }

  ngOnInit(): void {
    this.subSink = this.downloadService.queueEvents.subscribe({
      next: (data) => {
        if (data.status === 'processed' || data.status === 'failed') {
          this.totalDownloadJobs -= 1;
        } else {
          this.totalDownloadJobs += 1;
        }
      }
    })
  }

  set subSink(value: Subscription) {
    this._subscriptions.push(value);
  }

  get menuBlocks(): string[] {
    return this.menuList ? Object.keys(this.menuList) : [];
  }

  get name(): string {
    return !this.authService.user ? '' :
      `${this.authService.user?.first_name} ${this.authService.user?.last_name}`
  }

  get menuList(): { [ key: string ]: MenuList } {
    return {
      dashboard: {
        title: 'Dashboard',
        display: true,
        icon: faHome,
        items: [
          {title: 'Dashboard', url: 'home', display: true}
        ]
      },
      inventory_requisition: {
        title: 'Material Requisition',
        display: true,
        icon: faWarehouse,
        items: [
          {title: 'New request', url: 'material-requisition/create', display: true},
          {title: 'All requests', url: 'material-requisition/history', display: true, exact: false},
          {
            title: 'Verify requests', url: 'material-requisition/verification',
            display: true,
            exact: false
          },
          {
            title: 'Approve requests',
            url: 'material-requisition/approval',
            display: true,
            exact: false
          },
        ]
      },
      checkout: {
        title: 'Checkout',
        display: true,
        icon: faPeopleCarry,
        items: [
          {title: 'Checkout Requests', url: 'checkout/issue-requests', display: true, exact: false},
        ]
      },
      purchase_requests: {
        title: 'Purchase Requests',
        display: true,
        icon: faShoppingBasket,
        items: [
          {title: 'New Requests', url: 'purchase-requisition/create', display: true},
          {
            title: 'All Purchase Requests',
            url: 'purchase-requisition/history',
            display: true,
            exact: false
          },
          {
            title: 'Requests Checking',
            url: 'purchase-requisition/check',
            display: true,
            exact: false
          },
          {
            title: 'Requests Approval', url: 'purchase-requisition/approve',
            display: true,
            exact: false
          },
        ]
      },
      rfq: {
        title: 'RFQ',
        display: true,
        icon: faFileInvoiceDollar,
        items: [
          {title: 'New RFQ', url: 'request-for-quotations/create', display: true, exact: false},
          {title: 'All RFQ\'s', url: 'request-for-quotations/history', display: true, exact: false},
        ]
      },
      lpo: {
        title: 'Purchase Orders',
        display: true,
        icon: faShoppingCart,
        items: [
          {title: 'New Purchase Order', url: 'purchase-orders/create', display: true, exact: false},
          {
            title: 'All Purchase Orders',
            url: 'purchase-orders/history',
            display: true,
            exact: false
          },
        ]
      },
      checkin: {
        title: 'Products Checkin',
        display: true,
        icon: faDolly,
        items: [
          {title: 'Purchased Products', url: 'goods-receipt-note/create', display: true},
          {
            title: 'Spare Standby Reminder',
            url: 'standby-spare-checkin',
            display: true,
            exact: false
          },
        ]
      },
      inspection: {
        title: 'Products Inspection',
        display: true,
        icon: faCheckDouble,
        items: [
          {
            title: 'Inspection Requests', url: 'inspection-note/purchased-products',
            display: true,
            exact: false
          },
          {
            title: 'Inspection History', url: 'inspection-note/history',
            display: true,
            exact: false
          }]
      },
      post_inspection: {
        title: 'Post Inspection',
        icon: faClipboardCheck,
        display: true,
        items: [
          {
            title: 'GRN/RGA Approval', url: 'goods-receipt-note/approval',
            display: true,
            exact: false
          },
          {
            title: 'All GRN/RGA Docs', url: 'goods-receipt-note/history',
            display: true,
            exact: false
          }]
      },
      stock_balance: {
        title: 'Tracking & Balances',
        display: true,
        icon: faCubes,
        items: [
          {
            title: 'Product Tracking',
            url: 'product-items',
            display: true,
            exact: false
          },
          {
            title: 'Stock Balances', url: 'stock-balances',
            display: true
          },
        ]
      },
      worksheets: {
        title: 'Worksheets',
        display: true,
        icon: faBook,
        items: [
          {
            title: 'New Worksheet', url: 'worksheets/create',
            display: true
          }, {
            title: 'All Worksheets', url: 'worksheets/history',
            display: true, exact: false
          },
        ]
      },
      customers: {
        title: 'Clients & Contracts',
        display: true,
        icon: faAddressBook,
        items: [
          {
            title: 'All Customers', url: 'customers',
            display: true
          },
          {
            title: 'All Contracts', url: 'customer-contracts',
            display: true,
            exact: false
          },
        ]
      },
      adminstration: {
        title: 'Administration',
        display: true,
        icon: faUserShield,
        items: [
          {
            title: 'Inventory Products',
            url: 'products',
            display: true,
            exact: false
          },
          {
            title: 'Staff Accounts', url: 'users',
            display: true
          },
          {
            title: 'User Roles', url: 'roles',
            display: true
          },
        ]
      }

    }
  }


  menuItemTrackBy(index: number, item: MenuItem) {
    return item.title;
  }

  resolveBreadcrumb(evt: ActivationEnd | NavigationEnd) {

    if (evt instanceof ActivationEnd) {

      if (evt.snapshot.url.length == 0) {return}

      this._breadcrumbList = this._breadcrumbList.map((e) => {
        e.path = `/${evt.snapshot.url[ 0 ].path}${e.path}`;
        return e;
      });

      if (evt.snapshot.data && (evt.snapshot.data[ 'title' ] || evt.snapshot.data[ 'breadcrumb' ])) {
        const label = evt.snapshot.data[ 'breadcrumb' ] ||
          evt.snapshot.data[ 'title' ] || evt.snapshot.url[ 0 ].path;
        const title = evt.snapshot.data[ 'title' ] || evt.snapshot.data[ 'breadcrumb' ] || '';

        this._breadcrumbList.unshift({
          title: this.resolveSegment(title, evt.snapshot),
          label: this.resolveSegment(label, evt.snapshot),
          path: `/${evt.snapshot.url[ 0 ].path}`,
          active: false
        });
      }
    }
    if (evt instanceof NavigationEnd) {
      this._breadcrumbList[ this._breadcrumbList.length - 1 ].active = true;
      this.pageTitle = this._breadcrumbList[ this._breadcrumbList.length - 1 ].title;
      this.breadcrumbList = this._breadcrumbList;
      this.titleService.title = this.pageTitle;
      this._breadcrumbList = []; //reset local breadcrumb list
    }
  }

  resolveSegment(segment: string, route: ActivatedRouteSnapshot) {
    if (segment.includes(':')) {
      Object.entries(route.params).map(([key, value]) => {
        segment = segment.replace(new RegExp(`:${key}`, 'g'), value)
      })
    }
    return segment;
  }

  logout() {
    this.subSink = this.httpService.post('/auth/logout', {})
      .subscribe(() => {
        this.authService.user = null; //reset the local storage user
        this.router.navigateByUrl('/');// route out of the main application
      });
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe());

  }

  log(menuListElement: MenuList) {
    console.log(menuListElement)
  }
}

interface MenuList {
  title: string;
  icon?: IconProp;
  display: boolean;
  items: MenuItem[]

}

interface MenuItem {
  title: string,
  icon?: IconProp,
  url: string,
  display: boolean,
  exact?: boolean
}

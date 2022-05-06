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
  faTimes,
  faUserShield,
  faWarehouse
} from '@fortawesome/free-solid-svg-icons';
import { environment } from '../../environments/environment';
import { HttpService } from '../core/services/http.service';
import { MetaService } from '../core/services/meta.service';
import { AuthService } from '../core/services/auth.service';
import { DownloadService } from '../core/services/download.service';
import { Resources } from '../utils/permissions';
import { ToastService } from '../core/services/toast.service';
import { ToastNotificationModel } from '../models/notification.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  faTimes = faTimes;
  faCircleNotch = faCircleNotch;
  appName: string = environment.app.name;
  logoUrl: string = environment.app.logoUrl;
  hideSidebarMenu = true;
  totalDownloadJobs = 0;
  private _subscriptions: Subscription[] = [];


  pageTitle: string = '';
  private _breadcrumbList: { label: string, title: string, path: string, active: boolean }[] = [];
  breadcrumbList: { label: string, title: string, path: string, active: boolean }[] = [];
  toastNotifications: ToastNotificationModel[] = [];

  constructor(private router: Router, private httpService: HttpService,
              private authService: AuthService, private titleService: MetaService,
              private downloadService: DownloadService, private toastService: ToastService) {

    this.subSink = this.router.events
      .pipe(filter((evt) => evt instanceof NavigationStart))
      .pipe(tap(() => this.hideSidebarMenu = true))
      .subscribe()

    this.subSink = this.router.events
      .pipe(filter((evt) => evt instanceof ActivationEnd || evt instanceof NavigationEnd))
      .subscribe((evt) => {
        this.resolveBreadcrumb(evt as ActivationEnd | NavigationEnd);
      });

    this.toastNotifications = this.toastService.toasts();
  }

  ngOnInit(): void {
    this.toastNotifications = []; //reset
    this.toastService.clearAll();

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
        display: this.authService.hasAccess({
          create: [Resources.materialRequisition],
          view: [Resources.materialRequisition],
          verify: [Resources.materialRequisition],
          approve: [Resources.materialRequisition],
        }),
        icon: faWarehouse,
        items: [
          {
            title: 'New request',
            url: 'material-requisition/create',
            display: this.authService.can(Resources.materialRequisition, 'create')
          },
          {
            title: 'All requests',
            url: 'material-requisition/history',
            display: this.authService.can(Resources.materialRequisition, 'view'),
            exact: false
          },
          {
            title: 'Verify requests', url: 'material-requisition/verification',
            display: this.authService.can(Resources.materialRequisition, 'verify'),
            exact: false
          },
          {
            title: 'Approve requests',
            url: 'material-requisition/approval',
            display: this.authService.can(Resources.materialRequisition, 'approve'),
            exact: false
          },
        ]
      },
      checkout: {
        title: 'Checkout',
        display: this.authService.hasAccess({
          'create': [Resources.checkout],
        }),
        icon: faPeopleCarry,
        items: [
          {
            title: 'Checkout Requests',
            url: 'checkout/issue-requests',
            display: this.authService.can(Resources.checkout, 'create'),
            exact: false
          },
        ]
      },
      purchase_requests: {
        title: 'Purchase Requests',
        display: this.authService.hasAccess({
          create: [Resources.purchaseRequests],
          view: [Resources.purchaseRequests],
          verify: [Resources.purchaseRequests],
          approve: [Resources.purchaseRequests],
        }),
        icon: faShoppingBasket,
        items: [
          {
            title: 'New Requests',
            url: 'purchase-requisition/create',
            display: this.authService.can(Resources.purchaseRequests, 'create')
          },
          {
            title: 'All Purchase Requests',
            url: 'purchase-requisition/history',
            display: this.authService.can(Resources.purchaseRequests, 'view'),
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
        display: this.authService.hasAccess({
          create: [Resources.rfq],
          view: [Resources.rfq],
        }),
        icon: faFileInvoiceDollar,
        items: [
          {
            title: 'New RFQ',
            url: 'request-for-quotations/create',
            display: this.authService.can(Resources.rfq, 'create'),
            exact: false
          },
          {
            title: 'All RFQ\'s',
            url: 'request-for-quotations/history',
            display: this.authService.can(Resources.rfq, 'view'),
            exact: false
          },
        ]
      },
      lpo: {
        title: 'Purchase Orders',
        display: this.authService.hasAccess({
          create: [Resources.purchaseOrder],
          view: [Resources.purchaseOrder],
        }),
        icon: faShoppingCart,
        items: [
          {
            title: 'New Purchase Order',
            url: 'purchase-orders/create',
            display: this.authService.can(Resources.purchaseOrder, 'create'),
            exact: false
          },
          {
            title: 'All Purchase Orders',
            url: 'purchase-orders/history',
            display: this.authService.can(Resources.purchaseOrder, 'view'),
            exact: false
          },
        ]
      },
      checkin: {
        title: 'Products Checkin',
        display: this.authService.hasAccess({
          create: [Resources.goodsReceiptNote, Resources.standByCheckIn],
          view: [Resources.standByCheckIn],
        }),
        icon: faDolly,
        items: [
          {
            title: 'Purchased Products',
            url: 'goods-receipt-note/create',
            display: this.authService.can(Resources.goodsReceiptNote, 'create')
          },
          {
            title: 'Spare Standby Reminder',
            url: 'standby-spare-checkin',
            display: this.authService.can(Resources.standByCheckIn, 'view'),
            exact: false
          },
        ]
      },
      inspection: {
        title: 'Products Inspection',
        display: this.authService.hasAccess({
          create: [Resources.inspectionNote],
          view: [Resources.inspectionNote],
        }),
        icon: faCheckDouble,
        items: [
          {
            title: 'Inspection Requests', url: 'inspection-note/purchased-products',
            display: this.authService.can(Resources.inspectionNote, 'create'),
            exact: false
          },
          {
            title: 'Inspection History', url: 'inspection-note/history',
            display: this.authService.can(Resources.inspectionNote, 'view'),
            exact: false
          }]
      },
      post_inspection: {
        title: 'Post Inspection',
        icon: faClipboardCheck,
        display: this.authService.hasAccess({
          approve: [Resources.goodsReceiptNote],
          view: [Resources.goodsReceiptNote],
        }),
        items: [
          {
            title: 'GRN/RGA Approval', url: 'goods-receipt-note/approval',
            display: this.authService.can(Resources.goodsReceiptNote, 'approve'),
            exact: false
          },
          {
            title: 'All GRN/RGA Docs', url: 'goods-receipt-note/history',
            display: this.authService.can(Resources.goodsReceiptNote, 'view'),
            exact: false
          }]
      },
      stock_balance: {
        title: 'Tracking & Balances',
        display: this.authService.hasAccess({
          view: [Resources.stockBalance, Resources.productItems],
          create: [Resources.productItems],
          edit: [Resources.stockBalance],
        }),
        icon: faCubes,
        items: [
          {
            title: 'Product Items & Tracking',
            url: 'product-items',
            display: this.authService.can(Resources.productItems, 'view'),
            exact: false
          },
          {
            title: 'Stock Balances', url: 'stock-balances',
            display: this.authService.can(Resources.stockBalance, 'view')
          },
        ]
      },
      worksheets: {
        title: 'Worksheets',
        display: this.authService.hasAccess({
          view: [Resources.worksheet],
          create: [Resources.worksheet],
        }),
        icon: faBook,
        items: [
          {
            title: 'New Worksheet', url: 'worksheets/create',
            display: this.authService.can(Resources.worksheet, 'create')
          }, {
            title: 'All Worksheets', url: 'worksheets/history',
            display: this.authService.can(Resources.worksheet, 'view'), exact: false
          },
        ]
      },
      customers: {
        title: 'Clients & Contracts',
        display: this.authService.hasAccess({
          view: [Resources.contracts, Resources.customers],
        }),
        icon: faAddressBook,
        items: [
          {
            title: 'All Customers', url: 'customers',
            display: this.authService.can(Resources.customers, 'view')
          },
          {
            title: 'All Contracts', url: 'customer-contracts',
            display: this.authService.can(Resources.contracts, 'view'),
            exact: false
          },
        ]
      },
      adminstration: {
        title: 'Administration',
        display: this.authService.hasAccess({
          view: [Resources.products, Resources.users, Resources.roles],
        }),
        icon: faUserShield,
        items: [
          {
            title: 'Inventory Products',
            url: 'products',
            display: this.authService.can(Resources.products, 'view'),
            exact: false
          },
          {
            title: 'Staff Accounts', url: 'users',
            display: this.authService.can(Resources.users, 'view')
          },
          {
            title: 'User Roles', url: 'roles', exact: false,
            display: this.authService.can(Resources.roles, 'view')
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

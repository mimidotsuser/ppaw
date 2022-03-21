import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription, tap } from 'rxjs';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faUserShield,
  faBook,
  faHome,
  faAddressBook,
  faShoppingBasket,
  faShoppingCart,
  faPeopleCarry,
  faDolly,
  faFileInvoiceDollar,
  faWarehouse,
  faCheckDouble,
  faClipboardCheck,
  faCubes

} from '@fortawesome/free-solid-svg-icons';
import { environment } from '../../environments/environment';
import { HttpService } from '../core/services/http.service';
import { StorageService } from '../core/services/storage.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  appName: string = environment.app.name;
  logoUrl: string = environment.app.logoUrl;
  collapseSidebar = false;
  private _subscriptions: Subscription[] = [];

  menuList: { [ key: string ]: MenuItem } = {
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
        {title: 'New request', url: 'checkout-requests/create', display: true},
        {title: 'My requests', url: 'checkout-requests', display: true},
        {
          title: 'Verify requests', url: 'checkout-requests/verification',
          display: true,
          exact: false
        },
        {title: 'Approve requests', url: 'checkout-requests/approval', display: true, exact: false},
      ]
    },
    checkout: {
      title: 'Checkout',
      display: true,
      icon: faPeopleCarry,
      items: [
        {title: 'Checkout Requests', url: 'checkout', display: true, exact: false},
        {title: 'Checkout History', url: 'reports/checkout', display: true},
      ]
    },
    purchase_requests: {
      title: 'Purchase Requests',
      display: true,
      icon: faShoppingBasket,
      items: [
        {title: 'New Requests', url: 'purchase-requisition/create', display: true},
        {title: 'My Requests', url: 'purchase-requisition', display: true},
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
        {title: 'All RFQ\'s', url: 'request-for-quotations', display: true},
      ]
    },
    lpo: {
      title: 'Purchase Orders',
      display: true,
      icon: faShoppingCart,
      items: [
        {title: 'New Purchase Order', url: 'purchase-orders/create', display: true, exact: false},
        {title: 'All Purchase Orders', url: 'purchase-orders', display: true},
      ]
    },
    checkin: {
      title: 'Products Checkin',
      display: true,
      icon: faDolly,
      items: [
        {title: 'Purchased Products', url: 'checkin/purchased-products', display: true},
        {title: 'Spare Standby Reminder', url: 'checkin/standby-reminder', display: true},
      ]
    },
    inspection: {
      title: 'Products Inspection',
      display: true,
      icon: faCheckDouble,
      items: [
        {
          title: 'Inspection Requests', url: 'inspection-report/purchased-products',
          display: true,
          exact: false
        },
        {
          title: 'Inspection History', url: 'inspection-report/history',
          display: true
        }]
    },
    post_inspection: {
      title: 'Post Inspection',
      icon: faClipboardCheck,
      display: true,
      items: [
        {
          title: 'GRN/RGA Approval', url: 'checkin-approval/grn-and-rga/create',
          display: true
        },
        {
          title: 'All GRN/RGA Docs', url: 'checkin-approval/grn-and-rga',
          display: true
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
          display: true
        },
        {
          title: 'Stock Balances', url: 'stock-balances',
          display: true
        },
        {
          title: 'Balance Adjustment', url: 'stock-balances/adjustment',
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
          title: 'All Worksheets', url: 'worksheets',
          display: true
        },
      ]
    },
    clients: {
      title: 'Clients',
      display: true,
      icon: faAddressBook,
      items: [
        {
          title: 'All Clients', url: 'clients',
          display: true
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
          url: 'products/machines',
          display: true
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

  constructor(private router: Router, private httpService: HttpService,
              private storageService: StorageService) {
    this.subSink = this.router.events
      .pipe(filter((evt) => evt instanceof NavigationEnd))
      .pipe(tap(() => this.collapseSidebar = false))
      .subscribe()

  }

  ngOnInit(): void {}

  set subSink(value: Subscription) {
    this._subscriptions.push(value);
  }

  toggleSidebar() {
    this.collapseSidebar = !this.collapseSidebar;
  }

  get menuBlocks(): string[] {
    return Object.keys(this.menuList);
  }

  logout() {
    this.subSink = this.httpService.post('/auth/logout', {})
      .subscribe(() => {
        this.storageService.user = null; //reset the local storage user
        this.router.navigateByUrl('/');// route out of the main application
      })
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe());

  }
}

interface MenuItem {
  title: string;
  icon?: IconProp;
  display: boolean;
  items?: { title: string, icon?: IconProp, url: string, display: boolean, exact?: boolean }[]

}

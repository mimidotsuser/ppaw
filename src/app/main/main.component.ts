import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription, tap } from 'rxjs';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faUserShield,
  faWaveSquare,
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

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  appName: string = environment.app.name;
  logoUrl: string = environment.app.logoUrl;
  collapseSidebar = false;
  routerSubscription: Subscription | null = null

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
        {title: 'New RFQ', url: 'request-for-quotations/create', display: true},
        {title: 'All RFQ\'s', url: 'request-for-quotations', display: true},
      ]
    },
    lpo: {
      title: 'Purchase Orders',
      display: true,
      icon: faShoppingCart,
      items: [
        {title: 'New Purchase Order', url: 'purchase-orders/create', display: true},
        {title: 'All Purchase Orders', url: 'purchase-orders', display: true},
      ]
    },
    checkin: {
      title: 'Products Checkin',
      display: true,
      icon: faDolly,
      items: [
        {title: 'Purchased Products', url: 'checkin/purchased-products', display: true},
        {title: 'Lease Products', url: 'checkin/leased-products', display: true},
        {title: 'Demo Products', url: 'checkin/demo-products', display: true},
        {title: 'Standby Products', url: 'checkin/standby-products', display: true},
      ]
    },
    inspection: {
      title: 'Products Inspection',
      display: true,
      icon: faCheckDouble,
      items: [
        {
          title: 'Inspection Requests', url: 'inspection/purchased-products/create',
          display: true
        },
        {
          title: 'Inspection History', url: 'inspection/purchased-products',
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
          title: 'All RGN/RGA Docs', url: 'checkin-approval/grn-and-rga',
          display: true
        }]
    },
    stock_ledger: {
      title: 'Stock Ledger',
      display: true,
      icon: faCubes,
      items: [
        {
          title: 'Stock Ledger', url: 'stock-ledger',
          display: true
        },
        {
          title: 'Inventory Adjustment', url: 'stock-ledger/inventory-adjustment',
          display: true
        }]
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
    reports: {
      title: 'Reports',
      display: true,
      icon: faWaveSquare,
      items: [
        {
          title: 'Worksheet Reports',
          url: 'reports/worksheets',
          display: true
        }
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

  constructor(private router: Router) {
    this.routerSubscription = this.router.events
      .pipe(filter((evt) => evt instanceof NavigationEnd))
      .pipe(tap(() => this.collapseSidebar = false))
      .subscribe()

  }

  ngOnInit(): void {}

  toggleSidebar() {
    this.collapseSidebar = !this.collapseSidebar;
  }

  get menuBlocks(): string[] {
    return Object.keys(this.menuList);
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}

interface MenuItem {
  title: string;
  icon?: IconProp;
  display: boolean;
  items?: { title: string, icon?: IconProp, url: string, display: boolean, exact?: boolean }[]

}

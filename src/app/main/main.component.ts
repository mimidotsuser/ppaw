import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  appName: string = environment.app.name;
  logoUrl: string = environment.app.logoUrl;
  collapseSidebar = false;

  menuList: { [ key: string ]: MenuItem } = {
    dashboard: {
      title: 'Dashboard',
      icon: '',
      display: true,
      items: [
        {title: 'Dashboard', icon: '', url: 'home', display: true}
      ]
    },
    inventory_requisition: {
      title: 'Inventory Requisition',
      icon: '',
      display: true,
      items: [
        {title: 'New request', icon: '', url: 'checkout-requests/create', display: true},
        {title: 'My requests', icon: '', url: 'checkout-requests', display: true},
        {
          title: 'Verify requests',
          icon: '',
          url: 'checkout-requests/verification',
          display: true
        },
        {title: 'Approve requests', icon: '', url: 'checkout-requests/approval', display: true},
      ]
    },
    checkout: {
      title: 'Checkout',
      icon: '',
      display: true,
      items: [
        {title: 'Checkout Requests', icon: '', url: 'checkout/create', display: true},
        {title: 'Checkout History', icon: '', url: 'checkout', display: true},
      ]
    },
    purchase_requests: {
      title: 'Procurement Requisition',
      icon: '',
      display: true,
      items: [
        {title: 'New Requests', icon: '', url: 'purchase-requisition/create', display: true},
        {title: 'My Requests', icon: '', url: 'purchase-requisition', display: true},
        {title: 'Requests Checking', icon: '', url: 'purchase-requisition/check', display: true},
        {
          title: 'Requests Approval',
          icon: '',
          url: 'purchase-requisition/approve',
          display: true
        },
      ]
    },
    rfq: {
      title: 'Request for Quotations',
      icon: '',
      display: true,
      items: [
        {title: 'New RFQ', icon: '', url: 'request-for-quotations/create', display: true},
        {title: 'All RFQ\'s', icon: '', url: 'request-for-quotations', display: true},
      ]
    },
    lpo: {
      title: 'Purchase Orders',
      icon: '',
      display: true,
      items: [
        {title: 'New Purchase Order', icon: '', url: 'purchase-orders/create', display: true},
        {title: 'All Purchase Orders', icon: '', url: 'purchase-orders', display: true},
      ]
    },
    checkin: {
      title: 'Products Checkin',
      icon: '',
      display: true,
      items: [
        {title: 'Purchased Products', icon: '', url: 'checkin/purchased-products', display: true},
        {title: 'Lease Products', icon: '', url: 'checkin/leased-products', display: true},
        {title: 'Demo Products', icon: '', url: 'checkin/demo-products', display: true},
        {title: 'Standby Products', icon: '', url: 'checkin/standby-products', display: true},
      ]
    },
    inspection: {
      title: 'Products Inspection',
      icon: '',
      display: true,
      items: [
        {
          title: 'Inspection Requests',
          icon: '',
          url: 'inspection/purchased-products/create',
          display: true
        },
        {
          title: 'Inspection History',
          icon: '',
          url: 'inspection/purchased-products',
          display: true
        }]
    },
    post_inspection: {
      title: 'Post Inspection',
      icon: '',
      display: true,
      items: [
        {
          title: 'GRN/RGA Approval',
          icon: '',
          url: 'checkin-approval/grn-and-rga/create',
          display: true
        },
        {
          title: 'All RGN/RGA Docs',
          icon: '',
          url: 'checkin-approval/grn-and-rga',
          display: true
        }]
    },
    stock_ledger: {
      title: 'Stock Ledger',
      icon: '',
      display: true,
      items: [
        {
          title: 'Stock Ledger',
          icon: '',
          url: 'stock-ledger',
          display: true
        },
        {
          title: 'Inventory Adjustment',
          icon: '',
          url: 'stock-ledger/inventory-adjustment',
          display: true
        }]
    },
    inventory_products: {
      title: 'Inventory Products',
      icon: '',
      display: true,
      items: [
        {
          title: 'Machines',
          icon: '',
          url: 'products/machines',
          display: true
        },
        {
          title: 'Spares',
          icon: '',
          url: 'products/spares',
          display: true
        },
      ]
    },
    worksheets: {
      title: 'Worksheets',
      icon: '',
      display: true,
      items: [
        {
          title: 'New Worksheet',
          icon: '',
          url: 'worksheets/create',
          display: true
        }, {
          title: 'All Worksheets',
          icon: '',
          url: 'worksheets',
          display: true
        },
      ]
    },
    clients: {
      title: 'Clients',
      icon: '',
      display: true,
      items: [
        {
          title: 'New Client',
          icon: '',
          url: 'clients/create',
          display: true
        }, {
          title: 'All Clients',
          icon: '',
          url: 'clients',
          display: true
        },
      ]
    },
    users: {
      title: 'Users',
      icon: '',
      display: true,
      items: [
        {
          title: 'All Users',
          icon: '',
          url: 'users',
          display: true
        },
      ]
    },
    roles: {
      title: 'Roles',
      icon: '',
      display: true,
      items: [
        {
          title: 'Create Role',
          icon: '',
          url: 'roles/create',
          display: true
        },
        {
          title: 'All Roles',
          icon: '',
          url: 'roles',
          display: true
        },
      ]
    },
    reports: {
      title: 'Reports',
      icon: '',
      display: true,
      items: [
        {
          title: 'Worksheet Reports',
          icon: '',
          url: 'reports/worksheets',
          display: true
        }
      ]
    },
  }

  constructor() {}

  ngOnInit(): void {}

  toggleSidebar() {
    this.collapseSidebar = !this.collapseSidebar;
  }

  get menuBlocks(): string[] {
    return Object.keys(this.menuList);
  }
}

interface MenuItem {
  title: string;
  icon: string;
  display: boolean;
  items?: { title: string, icon: string, url: string, display: boolean }[]

}

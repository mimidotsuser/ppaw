export enum Actions {
  view = 'view',
  create = 'create',
  edit = 'edit',
  delete = 'delete',
  search = 'search',
  approve = 'approve',
  verify = 'verify',
}

export enum Resources {
  materialRequisition = 'materialRequisition',
  checkout = 'checkout',
  purchaseRequests = 'purchaseRequests',
  rfq = 'rfqs',
  purchaseOrder = 'purchaseOrders',
  inspectionNote = 'inspectionNote',
  goodsReceiptNote = 'goodsReceiptNote',
  stockBalance = 'stockBalances',
  worksheet = 'worksheets',
  contracts = 'customerContracts',
  customers = 'customers',
  products = 'products',
  productItems = 'productItems',
  productItemsTracking = 'tracking',
  users = 'users',
  roles = 'roles',
  organizationSettings = 'organizationSettings',
  vendors = 'vendors',
  standByCheckIn = 'standByCheckIn'
}

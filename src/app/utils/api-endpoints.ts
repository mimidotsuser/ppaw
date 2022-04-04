export enum V1Endpoints {
  csrf = '/csrf-cookie',
  login = '/auth/login',
  logout = '/auth/logout',
  authenticated = '/auth/is-authenticated',
  forgotPassword = '/auth/forgot-password',
  resetPassword = '/auth/reset-password',

  permissions = '/permissions',
  roles = '/roles',
  users = '/users',
  resentInvite = '/users/:id/resend-invite',
  customers = '/customers',
  products = '/products',
  productCategories = '/product-categories',
  warehouses = '/warehouses',
  stockBalances = '/stock-balances',
  worksheets = '/worksheets',
  productItems = '/product-items',
  purchaseOrders = '/purchase-orders',
  purchaseRequests = '/purchase-requests',
  rfqs = '/request-for-quotation',

  meldedBalances = '/products/:id/melded-balances',

  materialRequests = '/material-requisitions',

  materialRequestVerification = '/material-requisitions/:id/verification',
  materialRequestsPendingVerification = '/material-requisitions/verification',

  materialRequestApproval = '/material-requisitions/:id/approval',
  materialRequestsPendingApproval = '/material-requisitions/approval',

  materialRequestIssue = '/material-requisitions/:id/issue',
  materialRequestsPendingIssue = '/material-requisitions/issue',

  purchaseRequestVerification = '/purchase-requests/:id/verification',
  purchaseRequestsPendingVerification = '/purchase-requests/verification',

  purchaseRequestApproval = '/purchase-requests/:id/approval',
  purchaseRequestsPendingApproval = '/purchase-requests/approval',
  vendors = '/vendors',
  unitOfMeasure = '/unit-of-measures',
  currencies = '/currencies',
}

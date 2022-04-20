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
  productItemActivities = '/product-items/:id/activities',
  productItems = '/product-items',
  customerProductItems = '/customers/:id/product-items',
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
  goodsReceiptNote = '/goods-receipt-note',

  goodsReceiptNoteRequestPendingInspection = '/goods-receipt-note/:id/inspection',
  goodsReceiptNoteRequestsPendingInspection = '/goods-receipt-note/inspection',
  inspection = '/inspection-note',

  goodsReceiptNoteRequestPendingApproval = '/goods-receipt-note/:id/approval',
  goodsReceiptNoteRequestsPendingApproval = '/goods-receipt-note/approval',

  customerContractProductItems = '/customer-contracts/:id/product-items',
  customerContracts = '/customer-contracts',

  MRNDownload = '/material-requisitions/:id/download-mrn-doc',
  SIVDownload = '/material-requisitions/:id/download-siv-doc',
  purchaseRequestDownload = '/purchase-requests/:id/download-doc',
  requestForQuotationDownload = '/request-for-quotation/:id/download-docs',
  inspectionNoteDownload = '/inspection-note/:id/download-doc',
  purchaseOrderDownload = '/purchase-orders/:id/download-doc',
  goodsReceiptNoteDownload = '/goods-receipt-note/:id/download-doc',
  rejectedGoodsAdviceDownload = '/goods-receipt-note/:id/download-rga-doc',

  standbySpareCheckin = '/standby-spare-checkin',
  stockBalanceActivities = '/stock-balance-activities',
}

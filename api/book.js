import request from '@/utils/request'
export default {
  goodsQrcode(data,loading) {
    return request.GET('/book/index/goods-qrcode',data,loading)
  },
  orderList(data,loading) {
    return request.GET('/book/order/list',data,loading)
  },
  getQrcode(data,loading) {
    return request.GET('/book/order/get-qrcode',data,loading)
  },
  cancel(data,loading) {
    return request.GET('/book/order/cancel',data,loading)
  },
  applyRefund(data,loading) {
    return request.GET('/book/order/apply-refund',data,loading)
  },
  index(data,loading) {
    return request.GET('/book/index/index',data,loading)
  },
  goodsList(data,loading) {
    return request.GET('/book/index/good-list',data,loading)
  },
  goodDetails(data,loading) {
    return request.GET('/book/index/good-details',data,loading)
  },
  submitPreview(data,loading) {
    return request.GET('/book/order/submit-preview',data,loading)
  },
  orderClerkOrderDetails(data,loading) {
    return request.GET('/book/order/clerk-order-details',data,loading)
  },
  clerk(data,loading) {
    return request.GET('/book/order/clerk',data,loading)
  },
} 

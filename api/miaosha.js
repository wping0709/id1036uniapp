import request from '@/utils/request'
export default {
  commentList(data,loading) {
    return request.GET('/miaosha/comment-list',data,loading)
  },
  qrcode(data,loading) {
    return request.GET('/miaosha/goods-qrcode',data,loading)
  },
  orderList(data,loading) {
    return request.GET('/miaosha/order-list',data,loading)
  },
  cancel(data,loading) {
    return request.GET('/miaosha/revoke',data,loading)
  },
  list(data,loading) {
    return request.GET('/miaosha/list',data,loading)
  },
  details(data,loading) {
    return request.GET('/miaosha/details',data,loading)
  },
  goodsList(data,loading) {
    return request.GET('/miaosha/goods-list',data,loading)
  },
  submitPreview(data,loading) {
    return request.GET('/miaosha/submit-preview',data,loading)
  },
  submit(data,loading) {
    return request.POST('/miaosha/submit',data,loading)
  },
  orderDetail(data,loading) {
    return request.GET('/miaosha/order-details',data,loading)
  },
  commentPreview(data,loading) {
    return request.GET('/miaosha/comment-preview',data,loading)
  },
  orderComment(data,loading) {
    return request.POST('/miaosha/comment',data,loading)
  },
  revoke(data,loading) {
    return request.GET('/miaosha/revoke',data,loading)
  },
  expressDetail(data,loading) {
    return request.GET('/miaosha/express-detail',data,loading)
  },
  confirm(data,loading) {
    return request.GET('/miaosha/confirm',data,loading)
  },
  refundDetail(data,loading) {
    return request.GET('/miaosha/refund-detail',data,loading)
  },
}

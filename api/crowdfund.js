import request from '@/utils/request'
export default {
  orderList(data,loading) {
    return request.GET('/crowdfund/order-list',data,loading)
  },
  list(data,loading) {
    return request.GET('/crowdfund/list',data,loading)
  },
  details(data,loading) {
    return request.GET('/crowdfund/details',data,loading)
  },
  collection(data,loading) {
    return request.POST('/crowdfund/collection',data,loading)
  },
  qrcode(data,loading) {
    return request.GET('/crowdfund/goods-qrcode',data,loading)
  },
  submitPreview(data,loading) {
    return request.GET('/crowdfund/submit-preview',data,loading)
  },
  submit(data,loading) {
    return request.POST('/crowdfund/submit',data,loading)
  },
}

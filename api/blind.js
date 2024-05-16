import request from '@/utils/request'

export default {
  orderList (data, loading) {
    return request.GET('/blindBox/order/list', data, loading)
  },
  orderCancel (data, loading) {
    return request.POST('/blindBox/order/order-cancel', data, loading)
  },
  indexCatList (data, loading) {
    return request.POST('/blindBox/index/cat-list', data, loading)
  },
  indexBoxList (data, loading) {
    return request.GET('/blindBox/index/box-list', data, loading)
  },
  boxDetail (data, loading) {
    return request.GET('/blindBox/box-detail/detail', data, loading)
  },
  getRule (data, loading) {
    return request.GET('/blindBox/box-detail/get-rule', data, loading)
  },
  orderDetail (data, loading) {
    return request.GET('/blindBox/order/detail', data, loading)
  },
  lotteryDetail (data, loading) {
    return request.GET('/blindBox/order/lottery-detail', data, loading)
  },
  openBox (data, loading) {
    return request.GET('/blindBox/order/open-box', data, loading)
  },
  selectAttr (data, loading) {
    return request.GET('/blindBox/order/select-attr', data, loading)
  },
  checkAttr (data, loading) {
    return request.POST('/blindBox/order/check-attr', data, loading)
  },
  orderConfirm (data, loading) {
    return request.GET('/blindBox/order/confirm', data, loading)
  },

}

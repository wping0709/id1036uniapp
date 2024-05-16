import request from '@/utils/request.js'
export default {
  index (data, loading) {
    return request.GET('/recommend/index/index', data, loading)
  },
  mchList (data, loading) {
    return request.GET('/recommend/index/mch-list', data, loading)
  },
  priceList (data, loading) {
    return request.GET('/recommend/index/price-list', data, loading)
  },

  orderList (data, loading) {
    return request.GET('/recommend/index/order-list', data, loading)
  },

  getQrcode (data, loading) {
    return request.GET('/recommend/index/get-qrcode', data, loading)
  },
  cashDetail (data, loading) {
    return request.GET('/recommend/index/cash-detail', data, loading)
  },
  apply (data, loading) {
    return request.POST('/recommend/index/apply', data, loading)
  },
  getPrice (data, loading) {
    return request.GET('/recommend/index/get-price', data, loading)
  },

}

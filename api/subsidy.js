import request from '@/utils/request.js'

export default {

  subsidyList (data, loading) {
    return request.GET('/subsidy/list', data, loading)
  },
  subsidyIndex (data, loading) {
    return request.GET('/subsidy/index', data, loading)
  },
  cashDetail (data, loading) {
    return request.GET('/subsidy/cash-detail', data, loading)
  },
  getPrice (data, loading) {
    return request.GET('/subsidy/get-price', data, loading)
  },
  apply (data, loading) {
    return request.POST('/subsidy/apply', data, loading)
  },
}

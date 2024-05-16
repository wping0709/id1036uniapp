import request from '@/utils/request'

export default {
  getPrice (data, loading) {
    return request.GET('/waimai/get-price', data, loading)
  },
  apply (data, loading) {
    return request.POST('/waimai/apply', data, loading)
  },
  cashDetail (data, loading) {
    return request.GET('/waimai/cash-detail', data, loading)
  },
}

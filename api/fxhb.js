import request from '@/utils/request'
export default {
  open (data, loading) {
    return request.GET('/fxhb/index/open', data, loading)
  },
  openSubmit (data, loading) {
    return request.POST('/fxhb/index/open-submit', data, loading)
  },
  detail (data, loading) {
    return request.GET('/fxhb/index/detail', data, loading)
  },
  detailSubmit(data,loading) {
    return request.POST('/fxhb/index/detail-submit',data,loading)
  }
}

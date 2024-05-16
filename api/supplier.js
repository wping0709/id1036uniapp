import request from '@/utils/request.js'
export default {
  applySubmit(data,loading) {
    return request.POST('/supplier/apply-submit',data,loading)
  },
  apply(data,loading) {
    return request.POST('/supplier/apply',data,loading)
  },
}

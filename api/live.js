import request from '@/utils/request.js'

export default {
  getList(data,loading) {
    return request.GET('/live/get-list',data,loading)
  }
}

import request from '@/utils/request.js'

export default {
  quick (data, loading) {
    return request.GET('/quick/quick/quick', data, loading)
  }
}

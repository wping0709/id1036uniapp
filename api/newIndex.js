import request from '@/utils/request.js'

export default {
  qrcode (data, loading) {
    return request.GET('/index/share', data, loading)
  }
}

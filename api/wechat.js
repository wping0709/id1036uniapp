import request from '@/utils/request.js'

export default {
  wechatConfig (data, loading) {
    return request.GET('/wechat/wechat-js-sdk-signature', data, loading)
  }
}

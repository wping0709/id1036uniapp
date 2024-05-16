import request from '@/utils/request'

export default {
  sendSmsCode (data, loading) {
    return request.POST('/auth/send-sms-code', data, loading)
  },
  authLogin (data, loading) {
    return request.POST('/auth/login', data, loading)
  },
  editPass (data, loading) {
    return request.POST('/auth/edit-pass', data, loading)
  },
  verifySmsCode (data, loading) {
    return request.POST('/auth/verify-sms-code', data, loading)
  },
  regAndBind (data, loading) {
    return request.POST('/auth/reg-and-bind', data, loading)
  },
  regUser (data, loading) {
    return request.POST('/auth/reg-user', data, loading)
  },
}

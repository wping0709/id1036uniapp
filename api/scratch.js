import request from '../utils/request'

export default {

  submit (data, loading) {
    return request.POST('/scratch/scratch/submit', data, loading)
  },
  scratchSetting (data, loading) {
    return request.GET('/scratch/scratch/setting', data, loading)
  },
  scratchIndex (data, loading) {
    return request.GET('/scratch/scratch/index', data, loading)
  },
  scratchLog (data, loading) {
    return request.GET('/scratch/scratch/log', data, loading)
  },
  scratchReceive (data, loading) {
    return request.GET('/scratch/scratch/receive', data, loading)
  },
  scratchPrize (data, loading) {
    return request.POST('/scratch/scratch/prize', data, loading)
  },
  qrcode (data, loading) {
    return request.GET('/scratch/scratch/qrcode', data, loading)
  },

}

import request from '@/utils/request'
export default {
  // 获取抽奖信息
  pondIndex(data,loading) {
    return request.GET('/pond/pond/index',data,loading)
  },
  // 获取中奖信息
  pondLottery(data,loading) {
    return request.GET('/pond/pond/lottery',data,loading)
  },
  // 获取中奖信息
  pondSetting(data,loading) {
    return request.GET('/pond/pond/setting',data,loading)
  },
  // 获取中奖信息
  pondPrize(data,loading) {
    return request.GET('/pond/pond/prize',data,loading)
  },
  // 获取中奖信息
  pondSubmit(data,loading) {
    return request.POST('/pond/pond/submit',data,loading)
  },
  // 获取海报信息
  qrcode(data,loading) {
    return request.POST('/pond/pond/qrcode',data,loading)
  },
}

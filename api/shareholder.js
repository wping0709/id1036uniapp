import request from '@/utils/request.js'

export default {
  // 股东分红首页
  bonusIndex (data, loading) {
    return request.GET('/shareholderbonus/bonus/index', data, loading)
  },
  // 我的佣金
  bonusList (data, loading) {
    return request.GET('/shareholderbonus/bonus/list', data, loading)
  },
  // 分红佣金
  bonusListList (data, loading) {
    return request.GET('/shareholderbonus/bonus/bonus-list', data, loading)
  },
  // 贡献值
  bonusContributeList (data, loading) {
    return request.GET('/shareholderbonus/bonus/contribute-list', data, loading)
  },
  // 股东解析
  bonusLevelAnalysis (data, loading) {
    return request.GET('/shareholderbonus/bonus/level-analysis', data, loading)
  },

}

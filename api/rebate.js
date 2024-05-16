import request from '@/utils/request.js'
export default {
  center(data,loading) {
    return request.GET('/rebate/center',data,loading)
  } ,
  logList(data,loading) {
    return request.GET('/rebate/log-list',data,loading)
  } ,
}

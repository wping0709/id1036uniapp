
import request from '@/utils/request'

export default {
    indexIndex(data, loading) {
        return request.GET('/accountsettings/index/index', data, loading)
    },
    userIndex(data, loading) {
        return request.GET('/accountsettings/user/index', data, loading)
    },
    modifyUser(data, loading) {
        return request.POST('/accountsettings/user/index', data, loading)
    },
    // 反馈记录
    feedbackList(data, loading) {
        return request.POST('/accountsettings/feedback/list', data, loading)
    },
    // 反馈记录
    feedbackForm(data, loading) {
        return request.POST('/accountsettings/feedback/form', data, loading)
    },
    // 反馈记录
    feedbackSubmit(data, loading) {
        return request.POST('/accountsettings/feedback/submit', data, loading)
    },
    // 实名认证提交
    realNameSubmitReal(data, loading) {
        return request.POST('/accountsettings/real-name/submit-real', data, loading)
    },
    // 聚合实名认证
    realNameIdCardApi(data, loading) {
        return request.POST('/accountsettings/real-name/id-card-api', data, loading)
    },

}

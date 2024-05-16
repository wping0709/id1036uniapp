import request from '@/utils/request.js'
export default {
    orderPay(data, loading) {
        return request.POST('/passport/login', data, loading)
    },

    getPayInfo(data, loading) {
        return request.GET('/pay/info', data, loading)
    },
    // 验证支付密码
    verifyBalancePassword(data, loading) {
        return request.POST('/pay/verify-balance-pass-word', data, loading)
    },
    // 修改支付密码
    editBalancePassword(data, loading) {
        return request.POST('/pay/edit-balance-pass-word', data, loading)
    },
    // 开启关闭免密支付
    changeFreePayment(data, loading) {
        return request.GET('/pay/change-free-payment', data, loading)
    },
    setBalancePassword(data, loading) {
        return request.POST('/pay/set-balance-pass-word', data, loading)
    },
    sendPay(data, loading) {
        return request.GET('/pay/pay', data, loading)
    }
}

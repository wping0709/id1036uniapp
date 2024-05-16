import request from '@/utils/request'

export default {
    receiveCoupon(data, loading) {
        return request.GET('/coupon/receive', data, loading)
    },
    index(data, loading) {
        return request.GET('/coupon/index', data, loading)
    },
    shareSend(data, loading) {
        return request.GET('/coupon/share-send', data, loading)
    },
    detail(data, loading) {
        return request.GET('/coupon/detail', data, loading)
    },
    shareCouponIndex(data, loading) {
        return request.GET('/coupon/share-coupon-index', data, loading)
    },
    shareCounponRule(data, loading) {
        return request.GET('/coupon/get-share-coupon-rule', data, loading)
    },
}

import request from '@/utils/request.js'
export default {
    verifyCardLog(data,loading) {
        return request.GET('/commander/verify-card-log',data,loading)
    },
    tuanzhangType(data,loading) {
        return request.POST('/commander/tuanzhang-type-new',data,loading)
    },
    beihuo(data,loading) {
        return request.GET('/commander/beihuo',data,loading)
    },
    tuanzhangSave(data,loading) {
        return request.POST('/commander/tuanzhang-save',data,loading)
    },
    getInfo(data,loading) {
        return request.POST('/commander/get-info',data,loading)
    },
    getOrderTeam(data,loading) {
        return request.GET('/commander/get-order-team',data,loading)
    },
    waimaiOrder(data,loading) {
        return request.GET('/commander/waimai-order',data,loading)
    },
    getPrice(data,loading) {
        return request.GET('/commander/get-price',data,loading)
    },
    apply(data,loading) {
        return request.POST('/commander/apply',data,loading)
    },
    shopOrderTpl(data,loading) {
        return request.POST('/commander/shop-order-tpl',data,loading)
    },
    
}

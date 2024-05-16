import request from '@/utils/request'
export default {
    // 获取商品浏览记录
    getBrowse(data, loading) {
        return request.GET('/default/browse', data, loading)
    },
    // 获取商品详情
    getGoodsDetail(data, loading) {
        return request.GET('/default/goods', data, loading)
    },
    // 获取规格信息
    getGoodsAttr(data, loading) {
        return request.GET('/default/goods-attr-info', data, loading)
    },
    // 获取商品优惠券列表
    getGoodsCouponList(data, loading) {
        return request.GET('/default/get-goods-youhui', data, loading)
    },
    // 获取商品推荐
    getGoodsRecommend(data, loading) {
        return request.GET('/default/goods-recommend', data, loading)
    },
    // 商品评价 /default/comment-list
    getCommentList(data, loading) {
        return request.GET('/default/comment-list', data, loading)
    },
}

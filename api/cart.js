import request from '@/utils/request'
export default {
    // 修改购物车商品
    cartOfflineEdit(data, loading) {
        return request.POST('/cart/cart-offline-edit', data, loading)
    },
    // 获取商品浏览记录
    cartEdit(data, loading) {
        return request.POST('/cart/cart-edit', data, loading)
    },
    // 获取商品浏览记录
    getCartList(data, loading) {
        return request.GET('/cart/list', data, loading)
    },
    // 删除购物车
    delCartList(data, loading) {
        return request.GET('/cart/delete', data, loading)
    },
    // 添加购物车
    addCart(data, loading) {
        return request.POST('/cart/add-cart', data, loading)
    },
    // 添加购物车
    cartOffline(data, loading) {
        return request.POST('/cart/offline', data, loading)
    },
    // 线下删除购物车
    cartOfflineDelete(data, loading) {
        return request.GET('/cart/offline-delete', data, loading)
    },
    // 扫码添加购物车
    cartGoods(data, loading) {
        return request.POST('/cart/goods', data, loading)
    },
    // 线下购物车列表
    cartOfflineList(data, loading) {
        return request.GET('/cart/cart-offline-list', data, loading)
    },
}

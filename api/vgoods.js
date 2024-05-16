import request from '@/utils/request'
export default {

  vgoodsEdit (data, loading) {
    return request.GET('/vgoods/edit', data, loading)
  },
  vgoodsgetCat (data, loading) {
    return request.GET('/vgoods/get-cat', data, loading)
  },
  vgoodsGood (data, loading) {
    return request.POST('/vgoods/good', data, loading)
  },
  list (data, loading) {
    return request.POST('/vgoods/list', data, loading)
  },
  userInfo (data, loading) {
    return request.POST('/vgoods/user-info', data, loading)
  },
  delVgoods (data, loading) {
    return request.POST('/vgoods/del-vgoods', data, loading)
  },
  focusList (data, loading) {
    return request.POST('/vgoods/focus-list', data, loading)
  },
  focus (data, loading) {
    return request.POST('/vgoods/focus', data, loading)
  },
  giftSetting (data, loading) {
    return request.GET('/vgoods/gift-setting', data, loading)
  },
  giveGift (data, loading) {
    return request.POST('/vgoods/give-gift', data, loading)
  },
  getVgoodsComment (data, loading) {
    return request.POST('/vgoods/get-vgoods-comment', data, loading)
  },
  commentGood (data, loading) {
    return request.POST('/vgoods/comment-good', data, loading)
  },
  addVgoodsComment (data, loading) {
    return request.POST('/vgoods/add-vgoods-comment', data, loading)
  },
  vgoodsGoods (data, loading) {
    return request.POST('/vgoods/vgoods-goods', data, loading)
  },
  reportVgoods (data, loading) {
    return request.POST('/vgoods/report-vgoods', data, loading)
  },
  cartList (data, loading) {
    return request.POST('/vgoods/cart-list', data, loading)
  },
  addVgoods (data, loading) {
    return request.POST('/vgoods/add-vgoods', data, loading)
  },
  historyGoodsList (data, loading) {
    return request.POST('/vgoods/history-goods-list', data, loading)
  },
  shopGoodsList (data, loading) {
    return request.POST('/vgoods/shop-goods-list', data, loading)
  },
  imgDetail (data, loading) {
    return request.POST('/vgoods/img-details', data, loading)
  },
  
}

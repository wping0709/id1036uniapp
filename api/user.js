import request from '@/utils/request.js'
export default {
	priceConverting(data, loading) {
		return request.POST('/user/price-converting', data, loading)
	},
	getUserForMobile(data, loading) {
		return request.POST('/user/get-user-for-mobile', data, loading)
	},
	rebateApply(data, loading) {
		return request.GET('/user/rebate-apply', data, loading)
	},
	webLogin(data, loading) {
		return request.GET('/user/web-login', data, loading)
	},
	userLogout(data, loading) {
		return request.GET('/user/user-logout', data, loading)
	},
	userInfo(data, loading) {
		return request.POST('/user/user-info', data, loading)
	},
	userEmpower(data, loading) {
		return request.POST('/user/user-empower', data, loading)
	},
	userHandBinding(data, loading) {
		return request.POST('/user/user-hand-binding', data, loading)
	},
	addressDetail(data, loading) {
		return request.GET('/user/address-detail', data, loading)
	},
	addrsssSave(data, loading) {
		return request.POST('/user/address-save', data, loading)
	},

	getList(data, loading) {
		return request.GET('/user/index', data, loading)
	},
	// 会员中心数据
	userMember(data, loading) {
		return request.GET('/user/member', data, loading)
	},
	// 获取地址列表
	addressList(data, loading) {
		return request.GET('/user/address-list', data, loading)
	},
	// 设置默认地址
	addressSetDefault(data, loading) {
		return request.GET('/user/address-set-default', data, loading)
	},
	// 删除地址
	addressDelete(data, loading) {
		return request.GET('/user/address-delete', data, loading)
	},
	// 更换手机号
	userBinding(data, loading) {
		return request.POST('/user/user-binding', data, loading)
	},
	// 我的卡劵
	card(data, loading) {
		return request.POST('/user/card', data, loading)
	},
	// 收藏商品列表
	favoriteList(data, loading) {
		return request.GET('/user/favorite-list', data, loading)
	},
	// 收藏专题列表
	topicFavoriteList(data, loading) {
		return request.GET('/user/topic-favorite-list', data, loading)
	},
	// 收藏专题
	topicFavorite(data, loading) {
		return request.GET('/user/topic-favorite', data, loading)
	},
	// 取消
	favoriteRemove(data, loading) {
		return request.POST('/user/favorite-remove', data, loading)
	},
	// 收藏
	favoriteAdd(data, loading) {
		return request.POST('/user/favorite-add', data, loading)
	},
	// 收藏店铺
	getAreaInfo(data, loading) {
		return request.GET('/user/get-area-info', data, loading)
	},

	getDeliveryList(data, loading) {
		return request.GET('/user/get-delivery-list', data, loading)
	},
	deliveryGrabOrder(data, loading) {
		return request.POST('/user/delivery-grab-order', data, loading)
	},
	orderPush(data, loading) {
		return request.GET('/user/order-push', data, loading)
	},
	getDeliveryAccount(data, loading) {
		return request.GET('/user/get-delivery-account', data, loading)
	},
	resolutionAddress(data, loading) {
		return request.POST('/default/resolution-address', data, loading)
	},
}

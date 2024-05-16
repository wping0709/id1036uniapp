import request from '@/utils/request'
export default {
	integralmallIndex(data, loading) {
		return request.GET('/integralmall/integralmall/index', data, loading)
	},
	getQrcode(data, loading) {
		return request.GET('/integralmall/integralmall/get-qrcode', data, loading)
	},
	integralmallList(data, loading) {
		return request.GET('/integralmall/integralmall/list', data, loading)
	},
	orderRevoke(data, loading) {
		return request.GET('/integralmall/integralmall/revoke', data, loading)
	},
	orderSubmit(data, loading) {
		return request.GET('/integralmall/integralmall/order-submit', data, loading)
	},
	orderConfirm(data, loading) {
		return request.GET('/integralmall/integralmall/confirm', data, loading)
	},
	integralmallGoodsList(data, loading) {
		return request.GET('/integralmall/integralmall/goods-list', data, loading)
	},
	integralmallExplain(data, loading) {
		return request.GET('/integralmall/integralmall/explain', data, loading)
	},
	// 签到
	integralmallRegister(data, loading) {
		return request.GET('/integralmall/integralmall/register', data, loading)
	},
	// 签到
	goodsInfo(data, loading) {
		return request.GET('/integralmall/integralmall/goods-info', data, loading)
	},
	// 获取预订单数据
	submitPriview(data, loading) {
		return request.GET('/integralmall/integralmall/submit-preview', data, loading)
	},
	// 兑换列表
	exchange(data, loading) {
		return request.GET('/integralmall/integralmall/exchange', data, loading)
	},
	// 订单详情
	clerkOrderDetail(data, loading) {
		return request.GET('/integralmall/integralmall/clerk-order-details', data, loading)
	},
	// 积分明细
	integralDetail(data, loading) {
		return request.GET('/integralmall/integralmall/integral-detail', data, loading)
	},
	// 优惠卷详情
	couponInfo(data, loading) {
		return request.GET('/integralmall/integralmall/coupon-info', data, loading)
	},
	// 兑换优惠券
	excahngeCoupon(data, loading) {
		return request.GET('/integralmall/integralmall/exchange-coupon', data, loading)
	},
	// 核销订单
	integralmallClerk(data, loading) {
		return request.GET('/integralmall/integralmall/clerk', data, loading)
	},

}

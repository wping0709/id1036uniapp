import request from '@/utils/request'

export default {
	//选择人数页面
	getQrorderInfo(data, loading) {
		 return request.GET('/qrorder/qrorder-info', data, loading)
	},
	//首页左侧分类列表
	getQrorderCatList(data, loading) {
		 return request.GET('/qrorder/qrorder-cat-list', data, loading)
	},
	//获取右侧分类商品列表
	getQrorderGoodsList(data, loading) {
		 return request.GET('/qrorder/qrorder-goods-list', data, loading)
	},
	//热门搜索列表
	getHotSearch(data,loading) {
		return request.GET('/qrorder/get-hot-search',data,loading)
	},
	//搜索
	getSearchList(data,loading) {
		return request.GET('/default/search',data,loading)
	},
	//扫码点餐预下单接口
	newSubmitPreview(data,loading) {
		return request.POST('/order/new-submit-preview',data,loading)
	},
	//扫码下单接口
	orderNewSubmit(data,loading) {
		return request.POST('/order/new-submit',data,loading)
	},
	//点击加菜后的判断
	checkOrder(data,loading) {
		return request.POST('/qrorder/check-order',data,loading)
	},
	//获取优惠券列表
	getCouponList(data,loading) {
		return request.POST('/qrorder/get-coupon-list',data,loading)
	},
	//合并优惠券
	updateOrderCoupon(data,loading) {
		return request.POST('/qrorder/update-order-coupon',data,loading)
	},
	updateorderdetail(data,loading) {
		return request.POST('/order/update-order-detail',data,loading)
	},
	// 选择完商品后进行挂单
	handingOrder(data,loading) {
		return request.POST('/qrorder/handing-order',data,loading)
	},
	getHangindOrder(data,loading) {
		return request.GET('/qrorder/get-handing-order',data,loading)
	},
	getHangindOrderDetail(data,loading) {
		return request.GET('/qrorder/get-hangind-order-detail',data,loading)
	},
}
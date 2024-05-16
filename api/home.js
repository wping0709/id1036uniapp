import request from '@/utils/request.js'
export default {
	getPage(data, loading) {
		return request.GET('/index/index', data, loading)
	},
	getTemplateData(data, loading) {
		return request.POST('/index/template-info', data, loading)
	},
	getAllData(data, loading) {
		return request.GET('/new-discount/index', data, loading)
	},
	getCoupon(data, loading) {
		return request.GET('/new-discount/send-coupon', data, loading)
	},
	getGoodsNum(data, loading) {
		return request.GET('/new-discount/get-goods', data, loading)
	},
	getMoreRecommendGoods(data, loading){
		return request.POST('/index/recommend-goods', data, loading)
	},
	getVersion(data, loading){
		return request.GET('/default/get-version',data,loading)
	}
}

import request from '@/utils/request.js'
export default {
	goodsBrowseLog(data, loading) {
		return request.GET('/default/goods-browse-log', data, loading)
	},
	visitLog(data, loading) {
		return request.GET('/default/visit-log', data, loading)
	},
	shareLog(data, loading) {
		return request.GET('/default/share-log', data, loading)
	},
	topicType(data, loading) {
		return request.GET('/default/topic-type', data, loading)
	},
	topicQrcode(data, loading) {
		return request.GET('/default/topic-qrcode', data, loading)
	},
	getImLogin(data, loading) {
		return request.GET('/default/get-im-login', data, loading)
	},
	evaluateCenter(data, loading) {
		return request.GET('/default/evaluate-center', data, loading)
	},
	goodsAttrInfo(data, loading) {
		return request.GET('/default/goods-attr-info', data, loading)
	},
	shareQrcode(data, loading) {
		return request.GET('/default/share-qrcode', data, loading)
	},
	goodsQrcode(data, loading) {
		return request.GET('/default/goods-qrcode', data, loading)
	},
	// 获取整点内容
	getDefatuleH(data, loading) {
		return request.GET('/default/hourly-miaosha', data, loading)
	},
	// 获取品牌列表
	getPinPaiList(data, loading) {
		return request.GET('/default/get-brand-list', data, loading)
	},
	// 获取搜索分类
	getCats(data, loading) {
		return request.GET('/default/cats', data, loading)
	},
	// 获取搜索结果
	defaultSearch(data, loading) {
		return request.GET('/default/search', data, loading)
	},
	// 获取搜索结果
	district(data, loading) {
		return request.GET('/default/district', data, loading)
	},
	// 获取分类列表
	catList(data, loading) {
		return request.GET('/default/cat-list', data, loading)
	},
	// 获取商品列表
	goodsList(data, loading) {
		return request.GET('/default/goods-list', data, loading)
	},
	// 获取门店列表
	shopList(data, loading) {
		return request.GET('/default/shop-list', data, loading)
	},
	// 获取门店详情
	shopDetail(data, loading) {
		return request.GET('/default/shop-detail', data, loading)
	},
	// 清理缓存
	store(data, loading) {
		return request.GET('/default/store', data, loading)
	},
	// 商城信息
	shortestStore(data, loading) {
		return request.GET('/default/shortest-store', data, loading)
	},
	//商城简介
	articleDetail(data, loading) {
		return request.GET('/default/article-detail', data, loading)
	},
	couponList(data, loading) {
		return request.GET('/default/coupon-list', data, loading)
	},
	browseList(data, loading) {
		return request.GET('/default/browse-list', data, loading)
	},
	dleGoodsLog(data, loading) {
		return request.GET('/default/dle-goods-log', data, loading)
	},
	dleShopLog(data, loading) {
		return request.GET('/default/dle-shop-log', data, loading)
	},
	// 经纬度更换地址
	locationContent(data, loading) {
		return request.GET('/default/location-content-new', data, loading)
	},
	// 地址更换区id
	addressSmart(data, loading) {
		return request.POST('/default/address-smart', data, loading)
	},
	// 专题列表
	topicList(data, loading) {
		return request.GET('/default/topic-list', data, loading)
	},
	// 专题详情
	topic(data, loading) {
		return request.GET('/default/topic', data, loading)
	},
	// 专题详情
	topicQrcode(data, loading) {
		return request.GET('/default/topic-qrcode', data, loading)
	},
	// 秒杀商品详情
	getGoodsAttr(data, loading) {
		return request.GET('/default/goods-attr-info', data, loading)
	},
	// 视频专区列表
	videoList(data, loading) {
		return request.GET('/default/video-list', data, loading)
	},
	// 服务中心
	articleList(data, loading) {
		return request.GET('/default/article-list', data, loading)
	},
	
	defaultIndex(data, loading) {
		return request.GET('/default/index', data, loading)
	},
	storeList(data, loading) {
		return request.GET('/default/store-list', data, loading)
	},
	BuyData(data, loading) {
		return request.POST('/default/buy-data', data, loading)
	},
	wxLogin(data, loading) {
		return request.POST('/default/wx-login', data, loading)
	},
	getStoreList(data, loading) {
		return request.GET('/default/get-store-list', data, loading)
	},
	scanCodeGoods(data, loading){
		return request.GET('/default/get-scan-code-goods', data, loading)
	}

}

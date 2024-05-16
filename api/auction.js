import request from '@/utils/request'
export default {
	myAuction(data, loading) {
		return request.GET('/auction/my-auction', data, loading)
	},
	recommend(data, loading) {
		return request.GET('/auction/recommend', data, loading)
	},
	recommendList(data, loading) {
		return request.GET('/auction/recommend-auction-list', data, loading)
	},
	auctionType(data, loading) {
		return request.GET('/auction/auction-type', data, loading)
	},
	exclusiveBottom(data, loading) {
		return request.GET('/auction/exclusive-bottom', data, loading)
	},
	detail(data, loading) {
		return request.GET('/auction/auction-detail', data, loading)
	},
	goodsDetial(data, loading) {
		return request.GET('/auction/detail-bottom', data, loading)
	},
	warn(data, loading) {
		return request.POST('/auction/warn', data, loading)
	},
	publishComment(data, loading) {
		return request.POST('/auction/publish-comment', data, loading)
	},
	bidDiscuss(data, loading) {
		return request.GET('/auction/bid-discuss', data, loading)
	},
	supportStatus(data, loading) {
		return request.GET('/auction/support-status', data, loading)
	},
	paySupport(data, loading) {
		return request.POST('/auction/pay-support', data, loading)
	},
	startbid(data, loading) {
		return request.POST('/auction/start-bid', data, loading)
	},
	cancel(data, loading) {
		return request.POST('/auction/cancel-auction-order', data, loading)
	},
	submitPreview(data, loading) {
		return request.GET('/auction/submit-preview', data, loading)
	},
	submit(data, loading) {
		return request.POST('/auction/submit', data, loading)
	},
	exclusive(data, loading) {
		return request.GET('/auction/exclusive', data, loading)
	},
	follow(data, loading) {
		return request.GET('/auction/follow', data, loading)
	},
}

import request from '@/utils/request.js'
export default {
	getConfig (data, loading) {
		return request.POST('/live/live/get-config', data, loading)
	},
	qrcode (data, loading) {
		return request.GET('/live/live-qrcode', data, loading)
	},
	liveGetInfo (data, loading) {
		return request.POST('/live/live/get-info', data, loading)
	},
	submitApply (data, loading) {
		return request.POST('/live/live/submit-apply', data, loading)
	},
	getAnchorInfo (data, loading) {
		return request.POST('/live/live/get-anchor-info', data, loading)
	},
	getOrderList (data, loading) {
		return request.GET('/live/live/get-order-list', data, loading)
	},
	getLiveLog (data, loading) {
		return request.GET('/live/live/get-live-log', data, loading)
	},
	getLive (data, loading) {
		return request.GET('/live/live/get-live', data, loading)
	},
	followStatus (data, loading) {
		return request.GET('/live/live/follow-status', data, loading)
	},
	getGoodsList (data, loading) {
		return request.GET('/live/live/get-goods-list', data, loading)
	},
	getGoods (data, loading) {
		return request.GET('/live/live/get-goods', data, loading)
	},
	switchGoods (data, loading, isAdd) {
		var url = '/live/live/del-goods'
		if (isAdd) url = '/live/live/add-goods'
		return request.GET(url, data, loading)
	},
	cashDetail (data, loading) {
		return request.GET('/live/live/cash-detail', data, loading)
	},
	getShareList (data, loading) {
		return request.GET('/live/live/get-share-list', data, loading)
	},
	getCashInfo (data, loading) {
		return request.GET('/live/live/get-cash-info', data, loading)
	},
	cashApply (data, loading) {
		return request.POST('/live/live/cash-apply', data, loading)
	},
	getLiveCat (data, loading) {
		return request.GET('/live/live/get-live-cat', data, loading)
	},
	getLiveList (data, loading) {
		return request.GET('/live/live/get-live-list', data, loading)
	},
	livePush (data, loading) {
		return request.POST('/live/live/push', data, loading)
	},
	liveEnd (data, loading) {
		return request.POST('/live/live/end', data, loading)
	},
	getComment (data, loading) {
		return request.GET('/live/live/get-comment', data, loading)
	},
	addComment (data, loading) {
		return request.POST('/live/live/add-comment', data, loading)
	},
	startLiveByPre (data, loading) {
		return request.POST('/live/live/start-live-by-pre', data, loading)
	},
	getAnchorRoomList (data, loading) {
		return request.GET('/live/live/get-anchor-room-list', data, loading)
	},
}


import request from '@/utils/request.js'

export default {
	defaultActivityLog(data, loading) {
		return request.GET('/step/default/activity-log', data, loading)
	},
	defaultActivitySubmit(data, loading) {
		return request.POST('/step/default/activity-submit', data, loading)
	},
	defaultActivity(data, loading) {
		return request.POST('/step/default/activity', data, loading)
	},
	defaultActivityJoin(data, loading) {
		return request.GET('/step/default/activity-join', data, loading)
	},
	defaultActivityDetail(data, loading) {
		return request.GET('/step/default/activity-detail', data, loading)
	},
	defaultSetting(data, loading) {
		return request.GET('/step/default/setting', data, loading)
	},
	defaultIndex(data, loading) {
		return request.POST('/step/default/index', data, loading)
	},
	remind(data, loading) {
		return request.GET('/step/default/remind', data, loading)
	},
	setting(data, loading) {
		return request.GET('/step/default/setting', data, loading)
	},
	convert(data, loading) {
		return request.POST('/step/default/convert', data, loading)
	},
	log(data, loading) {
		return request.GET('/step/default/log', data, loading)
	},
	ranking(data, loading) {
		return request.GET('/step/default/ranking', data, loading)
	},
	goods(data, loading) {
		return request.GET('/step/default/goods', data, loading)
	},
	submit(data, loading) {
		return request.POST('/step/default/submit', data, loading)
	},
	inviteDetail(data, loading) {
		return request.GET('/step/default/invite-detail', data, loading)
	},
	picList(data, loading) {
		return request.GET('/step/default/pic-list', data, loading)
	},
	qrcode(data, loading) {
		return request.GET('/step/default/qrcode', data, loading)
	},
}

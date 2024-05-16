
import request from '@/utils/request.js'
export default {
	getQrcode(data, loading) {
		return request.GET('/scancodepay/index/get-qrcode', data, loading)
	},
	getCoupon(data, loading) {
		return request.GET('/scancodepay/index/get-coupon', data, loading)
	},
	getScanCodePaySetting(data, loading) {
		return request.GET('/scancodepay/index/get-mch', data, loading)
	}

}

import request from '@/utils/request.js'
export default {

	methods: {
		async orderSubmit (data, orderType) {
			// 服务返回订单结果
			var res = ''
			// 跳转支付携带参数
			var params = {
				order_type: 0,
				order_id: 0
			}

			// 以下为订单生成 跳转收银台,携带订单类型,及订单id
			// 会员订单
			if (orderType == 'hy') {
				res = await request.POST('/user/submit-member', data, true)
				params.order_type = 17
				params.order_id = res.data.order_id
			}
			// 普通订单
			else if (orderType == 's') {
				res = await request.POST('/order/new-submit', data, true)
				params.order_type = 0
				if (res.data.order_id_list) {
					params.order_type = 18
				}
				params.order_id = res.data.order_id
			}
			// 会员卡
			else if (orderType == 'vc') {
				if (this.pay_success_url == -1 || !this.pay_success_url) this.pay_success_url = '/pages/user/user'
				res = await request.GET('/vip-card/submit', data, true)
				params.order_type = 15
				params.order_id = res.data.order_id
			}
			// 积分
			else if (orderType == 'jf') {
				res = await request.POST('/integralmall/integralmall/submit', data, true)
				params.order_type = 14
				// 无需支付且积分支付成功
				if (res.type == 1) {
					uni.$u.toast(res.msg)
					return setTimeout(() => {
						this.$utils.toUrl('/integral-mall/order/order?status=1')
					}, 1000);
				}
				// 需支付订单金额跳转收银台
				else {
					params.order_id = res.data.order_id

				}
			} else if (orderType == 'recharge') {
				res = await request.POST('/recharge/submit', data, true)
				return this.$utils.toUrl(res.data.pay_url, 'redirectTo')

			} else if (orderType == 'miaosha') {
				res = await request.POST('/miaosha/submit', data, true)
				params.order_type = 1
				params.order_id = res.data.order_id
			} else if (orderType == 'pintuan') {
				res = await request.POST('/group/order/submit', data, true)
				params.order_type = 2
				params.order_id = res.data.order_id
			} else if (orderType == 'yuyue') {
				res = await request.POST('/book/order/submit', data, true)
				if (res.data.p_price == 0) {
					return this.$utils.toUrl('/book/order/order', 'redirectTo')
				}
				params.order_type = 3
				params.order_id = res.data.order_id
			} else if (orderType == 'blind') {
				res = await request.POST('/blindBox/order/new-submit', data, true)
				params.order_type = 13
				params.order_id = res.data.order_id
			}
			// 对象转url参数
			const urlData = this.$utils.objUrlData(params)
			this.$utils.toUrl('/pages/pay/pay?' + urlData, 'redirectTo')
		},
		wxPay (res) {
			console.log('微信支付', res);

			var that = this
			const {
				data
			} = res

			// 微信环境支付
			// #ifdef MP-WEIXIN
			return new Promise((resolv, reject) => {
				wx.requestPayment({
					appId: data.appId,
					nonceStr: data.nonceStr,
					package: data.package,
					signType: data.signType,
					timeStamp: data.timeStamp,
					paySign: data.paySign,
					success: (res) => {
						resolv(res)
					},
					fail: (err) => {
						this.$utils.toast('支付失败!')
						reject(err)
					},
				});
			})
			// #endif

			// 公众号支付。 h5不可用，必须为微信环境
			// #ifdef H5
			return new Promise((resolv, reject) => {

				if (typeof WeixinJSBridge != 'undefined') {
					// 微信环境自有api 
					WeixinJSBridge.invoke(
						'getBrandWCPayRequest', {
						"appId": data.appId, //公众号名称，由商户传入
						"timeStamp": data.timeStamp, //时间戳     
						"nonceStr": data.nonceStr, //随机串     
						"package": data.package,
						"signType": data.signType, //微信签名方式：     
						"paySign": data.paySign //微信签名 
					},
						function(ress) {
							if (ress.err_msg == "get_brand_wcpay_request:ok") {
								resolv(ress)
							} else if (ress.err_msg == "get_brand_wcpay_request:cancel") {
								uni.$u.toast('已取消支付')
							} else {
								uni.$u.toast('支付失败')
								reject(ress)
							}
						}
					);
				} else {
					location.href = data
				}

			})
			// #endif

			/* #ifdef APP-PLUS */
			return new Promise(async (resolv, reject) => {
				console.log('123');
				// const channels = await plus.payment.getChannels()
				// console.log(channels);
				// for (let var1 in channels) {
				// 	channels[var1].key == 'wx'
				// }
				console.log(data, '支付参数');
				uni.requestPayment({
					"provider": "wxpay",
					"orderInfo": {
						"appid": data.appid, // 微信开放平台 - 应用 - AppId，注意和微信小程序、公众号 AppId 可能不一致
						"noncestr": data.noncestr, // 随机字符串
						"package": data.package, // 固定值
						"partnerid": data.partnerid, // 微信支付商户号
						"prepayid": data.prepayid, // 统一下单订单号 
						"timestamp": data.timestamp, // 时间戳（单位：秒）
						"sign": data.sign // 签名，这里用的 MD5/RSA 签名
					},
					success: (res) => {
						console.log(res);
						resolv(res)
					},
					fail: (err) => {
						console.log(err);
						this.$utils.toast('支付失败!')
						reject(err)
					},
				});

			})
			/* #endif */


		}
	}
}

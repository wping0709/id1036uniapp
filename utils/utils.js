import requestAll from '@/api/index'

import wxConfig from '@/utils/wxConfig'

// 判断是否微信浏览器
const is_webpage = function() {
	/* #ifndef H5 */
	return false
	/* #endif */
	let ua = window.navigator.userAgent.toLowerCase();
	console.log(ua);
	return ua.match(/MicroMessenger/i) == "micromessenger"
}
const urlToJson = function(url) {  // 箭头函数默认传值为当前页面url
	let obj = {},
		index = url.indexOf('?'), // 看url有没有参数
		params = url.substr(index + 1); // 截取url参数部分 name = aaa & age = 20
		
	// if (index != -1) { // 有参数时
		let parr = params.split('&');  // 将参数分割成数组 ["name = aaa", "age = 20"]
		console.log(parr);
		for (let i of parr) {           // 遍历数组
			let arr = i.split('=');  // 1） i name = aaa   arr = [name, aaa]  2）i age = 20  arr = [age, 20]
			obj[arr[0]] = arr[1];  // obj[arr[0]] = name, obj.name = aaa   obj[arr[0]] = age, obj.age = 20
		}
	// }

	return obj;
}
export default {

	is_webpage,
	// 对象转url参数
	objUrlData (obj) {
		let result = ''
		for (let f in obj) {
			result += `&${f}=${obj[f]}`
		}
		return result.substring(1, result.length)
	},

	// 订阅消息
	bindMessage (ids) {
		/* #ifdef MP-WEIXIN */
		return new Promise((resolve, reject) => {
			if (typeof ids == 'string') {
				ids = [ids]
			}
			uni.requestSubscribeMessage({
				tmplIds: ids,
				success: (res) => {
					resolve(res)
				},
				fail: (err) => {
					// #ifdef MP-WEIXIN
					resolve(err)
					// #endif
					// #ifndef MP-WEIXIN
					resolve(err)
					// #endif

				}
			})
		})
		/* #endif */
		/* #ifndef MP-WEIXIN */
		return true
		/* #endif */
	},









	// 跳转页面
	toUrl (url, type) {
		if (url.indexOf('/mch/shop-list/shop-list') != -1) {
			url = '/pages/shop-list/shop-list'
		}
		// 如果是tabbar页面必须用switch跳转
		const tabBarList = ['/pages/index/index', '/pages/user/user', '/pages/cart/cart', '/pages/cat/cat']
		// 所有跳转switchTab页面储存地址携带的参数 && 跳转方式如果不能传reLaunch,否则不储存携带参数
		if (tabBarList.some(item => url.indexOf(item) !== -1) && type != 'reLaunch') {
			if (url.indexOf('?') !== -1) uni.setStorageSync('switchTabParams', url.split('?'))
			uni.switchTab({
				url: url
			});
			return
		}

		let urlArr = url.split('/')
		let fbAll = ['pt', 'shop', 'shop-list', 'shop-detail', 'book', 'integral-mall', 'miaosha', 'card', 'list-new-user', 'list-vip', 'member', 'video', 'share', 'address', 'recharge', 'bangding', 'fxhb', 'coupon-list', 'coupon-detail', 'coupon', 'pay', 'custom-page', 'cartoffline', 'web', 'search', 'income-code', 'topic-list', 'topic', 'express-detail', 'subsidy', 'favorite', 'store', 'list', 'scan-code-pay', 'article-list', 'article-detail', 'new-order-submit-offline', 'help-order', 'add-share', 'cash-detail', 'cash', 'order-comment', 'order-refund', 'order-refund-detail', 'quick-purchase'
		]
		let i = fbAll.indexOf(urlArr[2])
		// 当前为分包路径，且之前为主包路径
		if (i != -1 && urlArr[1] == 'pages') {
			switch (fbAll[i]) {

				case 'order-comment':
					url = '/order' + url.substring(6)
					break;
				case 'order-refund':
					url = '/order' + url.substring(6)
					break;
				case 'order-refund-detail':
					url = '/order' + url.substring(6)
					break;


				case 'quick-purchase':
					url = '/other' + url.substring(6)
					break;
				case 'cash':
					url = '/other' + url.substring(6)
					break;
				case 'cash-detail':
					url = '/other' + url.substring(6)
					break;
				case 'add-share':
					url = '/other' + url.substring(6)
					break;
				case 'help-order':
					url = '/other' + url.substring(6)
					break;
				case 'new-order-submit-offline':
					url = '/other' + url.substring(6)
					break;
				case 'new-order-submit-offline':
					url = '/other' + url.substring(6)
					break;

				case 'article-detail':
					url = '/other' + url.substring(6)
					break;
				case 'article-list':
					url = '/other' + url.substring(6)
					break;
				case 'scan-code-pay':
					url = '/other' + url.substring(6)
					break;
				case 'list':
					url = '/other' + url.substring(6)
					break;
				case 'store':
					url = '/other' + url.substring(6)
					break;
				case 'favorite':
					url = '/other' + url.substring(6)
					break;
				case 'subsidy':
					url = '/other' + url.substring(6)
					break;
				case 'express-detail':
					url = '/other' + url.substring(6)
					break;
				case 'topic-list':
					url = '/other' + url.substring(6)
					break;
				case 'topic':
					url = '/other' + url.substring(6)
					break;
				case 'income-code':
					url = '/other' + url.substring(6)
					break;
				case 'search':
					url = '/other' + url.substring(6)
					break;
				case 'web':
					url = '/other' + url.substring(6)
					break;
				case 'cartoffline':
					url = '/other' + url.substring(6)
					break;
				case 'custom-page':
					url = '/other' + url.substring(6)
					break;
				case 'pay':
					url = '/other' + url.substring(6)
					break;
				case 'coupon':
					url = '/other' + url.substring(6)
					break;
				case 'list-new-user':
					url = '/other' + url.substring(6)
					break;
				case 'list-vip':
					url = '/other' + url.substring(6)
					break;
				case 'coupon-list':
					url = '/other' + url.substring(6)
					break;
				case 'coupon-detail':
					url = '/other' + url.substring(6)
					break;
				case 'video':
					url = '/other' + url.substring(6)
					break;
				case 'member':
					url = '/other' + url.substring(6)
					break;
				case 'card':
					url = '/other' + url.substring(6)
					break;


				case 'share':
					url = '/sales' + url.substring(6)
					break;


				case 'shop':
					url = '/shop' + url.substring(6)
					break;
				case 'shop-list':
					url = '/shop' + url.substring(6)
					break;
				case 'shop-detail':
					url = '/shop' + url.substring(6)
					break;


				case 'bangding':
					url = '/account-settings' + url.substring(6)
					break;
				case 'recharge':
					url = '/account-settings' + url.substring(6)
					break;
				case 'address':
					url = '/account-settings' + url.substring(6)
					break;
				case 'address-edit':
					url = '/account-settings' + url.substring(6)
					break;


				default:
					url = url.substring(6)

					break;
			}
			console.log(url, 'newUrl');
		}

		if (type == 'redirectTo') {
			uni.redirectTo({
				url
			})
		} else if (type == 'reLaunch') {
			uni.reLaunch({
				url,
			});
		} else if (type == 'wxapp') {
			// 防止路径事endecodeURI加密，先不解析只为了获取参数信息，等到需要路径时再解析
			let params = urlToJson(url);
      		let path = decodeURIComponent(params.path)
      		let extraData = urlToJson(path)
			console.log(params.appId,path,extraData);
			uni.navigateToMiniProgram({
				appId: params.appId,
				path: path,
				extraData: extraData,
				success(e) {
					console.log(e);
				}
			});
		} else {
			console.log('navigateTo');
			uni.navigateTo({
				url
			})
		}
	},

	// 判断数组是否含有参数
	inArray: function(val, arr) {
		return arr.some(function(v) {
			return val === v;
		})
	},
	isArray: function(data) {
		return Array.isArray(data)
	},

	// 数量大于99默认输出99+
	numFilter (num = 0, maxNum = 99) {
		num = parseInt(num)
		if (!num) return 0
		if (num > maxNum) return `${maxNum}+`
		return num

	},

	// 获取当前日期
	currentDate (type, fuhao = '-', dateText = new Date()) {
		console.log(dateText, 'dateText');
		const date = new Date(dateText)
		let y = date.getFullYear()
		let m = date.getMonth() + 1
		m = m < 10 ? '0' + m : m
		let d = date.getDate()
		d = d < 10 ? '0' + d : d

		let h = date.getHours()
		h = h < 10 ? '0' + h : h

		let s = date.getMinutes()
		s = s < 10 ? '0' + s : s

		let ss = date.getSeconds()
		ss = ss < 10 ? '0' + ss : ss

		if (type == 'yyyy-mm-dd') {
			return `${y}${fuhao}${m}${fuhao}${d}`
		} else {
			return `${y}${fuhao}${m}${fuhao}${d} ${h}:${s}:${ss}`
		}
	},

	// 后退页面
	backTo (num = 1) {
		let current = getCurrentPages();

		if (current.length <= 1) {
			console.log('当前没有上一页,将跳转至首页');
			this.toUrl('/pages/index/index')
		} else {
			uni.navigateBack({
				delta: num
			})
		}

	},

	// 提示
	toast (msg = 'error', icon = 'none') {
		uni.showToast({
			title: msg,
			duration: 2000,
			icon: icon
		});
	},

	// 保存网路图片到相册
	addImg (url, fileName = new Date().getTime()) {
		/* #ifdef  MP-WEIXIN */
		// 判断是否开启权限
		uni.authorize({
			scope: "scope.writePhotosAlbum",
			success: () => {
				uni.showLoading({
					title: "下载中...",
				});
				// 下载图片
				uni.downloadFile({
					url: url,
					success: (res) => {
						//   保存图片
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: () => {
								uni.$u.toast("保存成功");
							},
							fail: (err) => {
								uni.hideLoading();
								uni.showModal({ title: '保存失败', content: JSON.stringify(err), showCancel: false })
								console.log(err, "保存失败");
							},
						});
					},
					fail: (err) => {
						uni.hideLoading();
						uni.showModal({ title: '下载失败', content: JSON.stringify(err), showCancel: false })
						console.log(err, "下载失败");
					},
				});
			},
			fail: (err) => {
				uni.showModal({
					title: "提示",
					content: "保存图片需要先授权添加到相册权限。",
					success: function(res) {
						if (res.confirm) {
							uni.openSetting({});
						} else if (res.cancel) {
							console.log("用户点击取消");
						}
					},
				});
			},
		});
		/* #endif */

		// #ifdef APP-PLUS
		uni.showLoading({
			title: "下载中...",
		});
		// 下载图片
		uni.downloadFile({
			url: url,
			success: (res) => {
				//   保存图片
				uni.saveImageToPhotosAlbum({
					filePath: res.tempFilePath,
					success: () => {
						uni.$u.toast("保存成功");
					},
					fail: (err) => {
						uni.hideLoading();
						uni.showModal({ title: '保存失败', content: JSON.stringify(err), showCancel: false })
						console.log(err, "保存失败");
					},
				});
			},
			fail: (err) => {
				uni.hideLoading();
				uni.showModal({ title: '下载失败', content: JSON.stringify(err), showCancel: false })
				console.log(err, "下载失败");
			},
		});

		// #endif

		/* #ifdef H5 */
		function downloadImage (imgsrc, name) { //下载图片地址和图片名
			var image = new Image();
			// 解决跨域 Canvas 污染问题,
			image.setAttribute("crossorigin", "anonymous");
			image.onload = function() {
				var canvas = document.createElement("canvas");
				canvas.width = image.width;
				canvas.height = image.height;
				var context = canvas.getContext("2d");
				context.drawImage(image, 0, 0, image.width, image.height);
				var url = canvas.toDataURL("image/png"); //将图片格式转为base64
				var a = document.createElement("a"); // 生成一个a元素
				var event = new MouseEvent("click"); // 创建一个单击事件
				a.download = name || "myPhoto"; // 设置图片名称
				a.href = url; // 将生成的URL设置为a.href属性
				a.dispatchEvent(event); // 触发a的单击事件
			};
			image.src = imgsrc + '?time=' + Date.now(); //注意，这里是灵魂，否则依旧会产生跨域问题

		}
		downloadImage(url, fileName)
		/* #endif */
	},

	// 复制
	copy (value, toast = '内容已复制') {
		uni.setClipboardData({
			data: value,
			success: () => {
				uni.$u.toast(toast)
			}
		});
	},

	randomString: function(len) {
		len = len || 32
		var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678' /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
		var maxPos = $chars.length
		var pwd = ''
		for (let i = 0; i < len; i++) {
			pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
		}
		return pwd
	},

	//0未付款，1待发货，2待收货，3已完成，4已取消
	//11售后待审核， 12待卖家发货， 13待卖家收货
	orderStatus (order) {
		// 已取消
		if (order.is_cancel == 1 || order.cancel_status == 1) {
			return 4
		}
		// 售后订单待审核
		else if (order.apply_delete == 1) {
			return 11
		}
		// 12待买家发货，
		else if (order.is_agree == 1 && order.is_user_send == 0) {
			return 12
		}
		// 13待卖家收货
		else if ((order.is_agree == 1 || order.status == 2) && order.is_user_send == 1 && order.status != 1) {
			return 13
		}
		// 未付款
		else if (order.is_pay == 0 && order.pay_type != 2) {
			return 0
		}
		// 待发货
		else if (order.is_send == 0 && (order.is_pay == 1 || order.pay_type == 2)) {
			return 1
		}
		// 待收货
		else if (order.is_send == 1 && order.is_confirm == 0 && (order.is_pay == 1 || order.pay_type == 2)) {
			return 2
		}
		// 已完成
		else if (order.is_send == 1 && order.is_confirm == 1 && (order.is_pay == 1 || order.pay_type == 2)) {
			return 3
		}
		// 待处理
		else if (order.apply_delete == 1) {
			return 5
		}


		return -1

	},

	//查看位置
	openLocation (data, success, fail) {
		uni.openLocation({
			...data,
			success (res) {
				success && success(res)
			},
			fail (err) {
				fail && fail(err)
			}
		})
	},
	// 拨打电话
	makePhoneCall (data, success, fail) {
		uni.makePhoneCall({
			...data,
			success (res) {
				success && success(res)
			},
			fail (err) {
				fail && fail(err)
			}
		})
	},
	// 扫码封装  为了兼容公众号使用扫码
	scanCode () {
		return new Promise(async (resolve, reject) => {
			// #ifndef H5
			uni.scanCode({
				success: (res) => {
					res.path = '/' + res.path
					resolve(res)
				},
				fail: (err) => {
					reject(err)
				}
			})
			// #endif

			// #ifdef H5
			if (is_webpage()) {
				const jWeixin = await wxConfig.init(['scanQRCode'])
				jWeixin.scanQRCode({
					needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
					scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
					success: (res) => {
						console.log(res, '扫描结果');
						let pathArr = res.resultStr.split('#')
						let result = {
							path: pathArr.length >= 2 ? pathArr[1] : '',
							result: res.resultStr
						}
						resolve(result)
					}
				});

			} else {
				uni.$u.toast('当前环境不支持扫码！')
				reject('当前环境不支持扫码！')
			}
			// #endif
		})
	},

	// url获取参数
	urlToJson,
	// 解析微信参数
	wxParams (params) {
		let str = decodeURIComponent(params.scene)
		let newPrams = {}
		let arr = str.split(',')
			.map(item => {
				return item.split(':')
			})
		if (arr.length) {
			arr.forEach(item => {
				newPrams[item[0]] = item[1] || ''
			})
		}
		return newPrams

	},
	// showModal封装为promise对象
	showModalAsync (params) {
		return new Promise((resolve, reject) => {
			uni.showModal({
				title: '提示',
				...params,
				success: (result) => {
					resolve(result)
				},
				fail: (err) => {
					reject(err)
				},
				complete: () => { }
			});
		})
	},

	// 图片预览 images字符串，对象
	previewImage(images , current = 0) {
		let urls = []
		typeof images == 'string' && (urls = [images])
		urls = images
		uni.previewImage({
			current: current,
			urls: urls,
		});
	}

}

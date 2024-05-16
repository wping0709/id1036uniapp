import utils from './utils.js'
import siteinfo from '@/siteinfo.js'
import store from '@/store/index.js'
var api_data = siteinfo.api_data

// api_data._platform = 'app'
function API_URL (url) {
	let currentStore = store.getters['currentStore']
	currentStore && currentStore.id >= 0 && (api_data.store_id = currentStore.id)
	if (url) {
		return siteinfo.apiroot + `?r=api${url}&${utils.objUrlData(api_data)}`
	} else {
		return siteinfo.apiroot + `?${utils.objUrlData(api_data)}&r=api`
	}
}

// 成功状态码
const code = [0]


// 请求错提示处理
function errorToast (res, url) {
	console.log(res,url);
	let noToastUrls = ['/coupon/share-send','/share/bind-parent']

	if (res.data && res.data.msg == '自身分销的页面' && url == '/share/bind-parent') {
		console.log('code != 0 不做提示  自身分销的页面', res);
		return
	} else if (noToastUrls.some(item => item.indexOf(url) != -1)) {
		console.log('code != 0 不做提示', res);
		return
	} else if(url === '/order/new-submit-preview' && res.data.msg == '不满足会员等级') {
		console.log('/order/new-submit-preview不满足会员等级，不做提示');
		return
	} else if(url === '/mch/user/myshop' && res.data.msg == '请先申请商户入驻。') {
		return 
	}else if(url === '/user/user-binding' && (res.data === 1 || res.data === 3)){
		return
	}

	else {
		uni.showModal({
			title: '提示',
			content: res.data.msg || `接口报错${url},请联系开发者。`,
			cancelText: '留在此页',
			confirmText: '返回上页',
			success: ({ confirm }) => {
				confirm && utils.backTo()
			},
			fail: (e) => {console.log(e);},
			complete: () => { }
		});
	}

}

// post请求封装
function POST (url, params, needLoading) {
	const Token = uni.getStorageSync("token");
	if (needLoading) {
		uni.showLoading({
			title: "加载中",
			mask: true,
		});
	}

	let requestData = params
	if (Token) params.access_token = Token

	let promise = new Promise(function(resolve, reject) {
		uni.request({
			url: API_URL(url),
			method: "POST",
			data: requestData,
			header: {
				"content-Type": "application/x-www-form-urlencoded",
			},
			success: (res) => {
				needLoading &&	uni.hideLoading();
				// 响应未登录 跳转登录页面
				if (res.data.code == -1) {
					let pages = getCurrentPages()
					let cPage = pages[pages.length - 1]
					console.log(pages);
					store.commit('setCacheData', {
						path: `/${cPage.route}`,
						options: cPage.options
					})

					utils.toUrl('/login/login/login_page', 'redirectTo')
				}
				// 后台响应 请求成功
				else if (code.indexOf(res.data.code) !== -1) {
					resolve(res.data);
				}
				// 其他均为响应错误
				else {
					reject(res.data)

					errorToast(res, url)


				}
			},
			fail: (res) => {
				needLoading && uni.hideLoading();
				reject(res.data);
			},
		});
	});
	return promise;
}

function GET (url, params, needLoading) {
	const Token = uni.getStorageSync("token");
	if (needLoading) {
		uni.showLoading({
			title: "加载中",
			mask: true,
		});
	}
	let promise = new Promise(function(resolve, reject) {
		uni.request({
			url: API_URL(url),
			method: "GET",
			data: {
				access_token: Token,
				...params,
			},
			header: {
				"content-Type": "application/x-www-form-urlencoded",
			},
			success: async (res) => {

				needLoading && uni.hideLoading();

				// 响应未登录 跳转登录页面
				if (res.data.code == -1) {
					let pages = getCurrentPages()
					let cPage = pages[pages.length - 1]
					console.log(pages);
					store.commit('setCacheData', {
						path: `/${cPage.route}`,
						options: cPage.options
					})
					utils.toUrl('/login/login/login_page', 'redirectTo')
				}
				// 服务器响应成功
				else if (code.indexOf(res.data.code) !== -1) {
					resolve(res.data);
				}
				// 服务器响应失败
				else {
					reject(res.data);
					errorToast(res, url)
				}
			},
			fail: (res) => {
				needLoading &&	uni.hideLoading();
				reject(res.data);
			},
		});
	});
	return promise;
}


/* JSONPOST请求 */
function POSTJSON (url, params, needLoading) {
	const Token = uni.getStorageSync("token");
	if (needLoading) {
		uni.showLoading({
			title: "加载中",
			mask: true,
		});
	}
	let promise = new Promise(function(resolve, reject) {
		uni.request({
			url: API_URL(url),
			method: "POST",
			data: {
				access_token: Token,
				...params,
			},
			header: {
				"content-Type": "application/json",
			},
			success: (res) => {
			  needLoading &&	uni.hideLoading();
				// 响应未登录 跳转登录页面
				if (res.data.code == -1) {
					let pages = getCurrentPages()
					let cPage = pages[pages.length - 1]
					console.log(pages);
					store.commit('setCacheData', {
						path: `/${cPage.route}`,
						options: cPage.options
					})
					utils.toUrl('/login/login/login_page', 'redirectTo')

				}
				// 后台响应 请求成功
				else if (code.indexOf(res.data.code) !== -1) {
					resolve(res.data);
				}
				// 其他均为响应错误
				else {
					reject(res.data)
					errorToast(res, url)

				}
			},
			fail: (res) => {
				needLoading && uni.hideLoading();
				reject(res.data);
			},
		});
	});
	return promise;
}



/* 
	上传图片
	使用此上传图片会进行canvas压缩，需在页面写个canvas标签
	<canvas
		:style="{
			width: `${systemInfo.windowWidth}px`,
			height: `${systemInfo.windowWidth}px`,
			position: 'absolute',
			zIndex: '-1',
			left: '-10000rpx',
			top: '-10000rpx',
		}"
		canvas-id="zipCanvas"
	></canvas>

	tempFilePaths 图片路径
	r上传路径
	type 上传类型,
*/
async function UPLOAD_IMAGE (tempFilePaths, r = "/upload/upload-image", type = 'image', canvId = 'zipCanvas', cw = 750, limitSize = 2048) {

	uni.showLoading({
		title: "正在上传...",
	});
	try {
		function zipUrlPromise (canvasId, imagePath, limitSize, drawWidth, callback) {

			return new Promise((resolve, reject) => {
				//主函数，默认限制大小1024kb即1mb,drawWidth是绘画区域的大小
				//初始值传入为画布自身的边长（我们这是一个正方形的画布）
				getLessLimitSizeImage(canvasId, imagePath, limitSize, drawWidth)
				function getLessLimitSizeImage (canvasId, imagePath, limitSize, drawWidth) {
					//判断图片尺寸是否满足要求
					imageSizeIsLessLimitSize(imagePath, limitSize,
						(lessRes) => {
							//满足要求走callback，将压缩后的文件路径返回
							resolve(imagePath)
							// callback(imagePath);
						},
						(moreRes) => {
							//不满足要求需要压缩的时候
							uni.getImageInfo({
								src: imagePath,
								success: (imageInfo) => {
									let maxSide = Math.max(imageInfo.width, imageInfo.height);
									let windowW = drawWidth;
									let scale = 1;
									/*
									这里的目的是当绘画区域缩小的比图片自身尺寸还要小的时候
									取图片长宽的最大值，然后和当前绘画区域计算出需要放缩的比例
									然后再画经过放缩后的尺寸，保证画出的一定是一个完整的图片。由于每次递归绘画区域都会缩小，
									所以不用担心scale永远都是1绘画尺寸永远不变的情况，只要不满足压缩后体积的要求
									就会缩小绘画区域，早晚会有绘画区域小于图片尺寸的情况发生
									*/
									if (maxSide > windowW) {
										scale = windowW / maxSide;
									}
									//trunc是去掉小数
									let imageW = Math.trunc(imageInfo.width * scale);
									let imageH = Math.trunc(imageInfo.height * scale);
									console.log('调用压缩', imageW, imageH);
									//图片在规定绘画区域上画并获取新的图片的path
									getCanvasImage(canvasId, imagePath, imageW, imageH,
										(pressImgPath) => {
											/*
											再去检查是否满足要求，始终缩小绘画区域，让图片适配绘画区域
											这里乘以0.95是必须的，如果不缩小绘画区域，会出现尺寸比绘画区域小，
											而体积比要求压缩体积大的情况出现，就会无穷递归下去，因为scale的值永远是1
											但0.95不是固定的，你可以根据需要自己改，0到1之间，越小则绘画区域缩小的越快
											但不建议取得太小，绘画区域缩小的太快，压出来的将总是很糊的
											*/
											getLessLimitSizeImage(canvasId, pressImgPath, limitSize, drawWidth * 0.95, callback);
										}
									)
								}
							})
						}
					)
				}

				//将图片画在画布上并获取画好之后的图片的路径
				function getCanvasImage (canvasId, imagePath, imageW, imageH, getImgSuccess) {
					//创建画布内容
					const ctx = uni.createCanvasContext(canvasId);
					//图片画上去，imageW和imageH是画上去的尺寸，图像和画布间隔都是0
					ctx.drawImage(imagePath, 0, 0, imageW, imageH);
					//这里一定要加定时器，给足够的时间去画（所以每次递归最少要耗时200ms，多次递归很耗时！）
					ctx.draw(false, setTimeout(function() {
						//把当前画布指定区域的内容导出生成指定大小的图片，并返回文件路径
						uni.canvasToTempFilePath({
							canvasId: canvasId,
							x: 0,
							y: 0,
							width: imageW,
							height: imageH,
							quality: 1, //最高质量
							success: (res) => {
								//将取出的图片路径通过回调函数返回
								getImgSuccess(res.tempFilePath);
							}
						})
					}, 200));
				}

				//判断图片大小是否满足需求,limitSize的单位是kb
				function imageSizeIsLessLimitSize (imagePath, limitSize, lessCallback, moreCallback) {
					//获取文件信息
					uni.getFileInfo({
						filePath: imagePath,
						success: (res) => {
							console.log("压缩前图片大小", res.size / 1024, 'kb');
							//如果图片太大了走moreCallback
							if (res.size > 1024 * limitSize) {
								moreCallback()
							}
							//图片满足要求了走lessCallback
							else {
								lessCallback()
							}
						}
					})
				}
			})
		}


		// canvId //需和canvId已知用于获取canvas元素
		// tempFilePaths  原图片文件
		// limitSize 图片限制为多少kb
		// cw 图片默认宽度
		tempFilePaths = await zipUrlPromise(canvId, tempFilePaths, limitSize, cw)
		console.log(tempFilePaths, 'promise');


		const url = API_URL() + r;
		return new Promise((resolve, reject) => {
			uni.uploadFile({
				url: url,
				filePath: tempFilePaths,
				name: type,
				formData: {},
				success: (uploadFileRes) => {
					console.log(uploadFileRes);
					uploadFileRes = JSON.parse(uploadFileRes.data);
					if (uploadFileRes.code == 0) {
						resolve(uploadFileRes)
						uni.hideLoading();

					} else {
						reject(uploadFileRes)
						uni.hideLoading();

						uni.$u.toast(uploadFileRes.msg || '上传出错')
					}


				},
				fail: error => {
					uni.hideLoading();

					reject(error)
				}
			});
		})
	} catch (error) {
		uni.hideLoading();
	}
}

module.exports = {
	POST,
	POSTJSON,
	GET,
	API_URL,
	UPLOAD_IMAGE
};

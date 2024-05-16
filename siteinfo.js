var apiroot = 'http://id1036.cyy.com/web/index.php',
	siteroot = 'http://id1036.cyy.com/webpage/#';

// var apiroot = 'http://demo.quanqudao.top/web/index.php',
// 	siteroot = 'http://demo.quanqudao.top/webpage/#';

// #ifdef H5
// // 开发环境
// if (process.env.NODE_ENV === 'development') {
// 	// TODO
// }
// production
// 生产环境
if (process.env.NODE_ENV === 'production') {
	// TODO
	apiroot = `${window.location.origin}/web/index.php`
	siteroot = `${window.location.origin}/webpage/#`
}
// #endif


module.exports = {
	api_data: {
		store_id: '1',
		_version: '24.6',

		// #ifdef H5
		_platform: 'h5',
		// #endif

		// #ifdef APP-PLUS
		_platform: 'app',
		// #endif

		// #ifdef MP-WEIXIN
		_platform: 'wx',
		// #endif
	},


	// 客服地址
	kefu_host: 'https://ws.cyyvip.com/web/dist',
	// kefu_host: 'https://qijian.cyyvip.com',
	//h5环境地址,用来做app分享打开的h5地址
	siteroot,
	// 请求服务器地址
	apiroot,
};

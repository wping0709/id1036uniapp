import request from '@/utils/request.js'
export default {
	// 获取商城配置
	getShopConfig(data, loading) {
		return request.GET('/default/store', data, loading)
	},
	// 获取tabBar数据
	getTabBar(data,loading) {
		return request.GET('/default/navbar', data, loading)
	},
	// 获取静态资源图片
	getImage(data,loading) {
		return request.GET('/default/get-image',data,loading)
	}
}

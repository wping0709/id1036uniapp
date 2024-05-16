import App from './App'
import Vue from 'vue'
import requestAll from '@/api/index.js'
import utils from '@/utils/utils.js'
import minxi from '@/mixins/index.js'
import store from '@/store/index.js'
import uView from '@/uview-ui'
// #ifdef H5
if (process.env.NODE_ENV === 'development') {
	// 本地调试使用
	const vconsole = require('vconsole');
	Vue.prototype.$vconsole = new vconsole(); // 使用vconsole
}
// #endif


// 获取商城配置
(async function() {
	// 获取商城配置
	await store.dispatch('getShopConfig')

	// 获取静态图片
	await store.dispatch('getImage')
})()



Vue.prototype.$utils = utils
Vue.prototype.$requestAll = requestAll

Vue.mixin(minxi)
Vue.use(uView)


Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	store,
	...App
})
app.$mount()

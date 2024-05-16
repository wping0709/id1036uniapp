uview版本2.0.36



siteinfo 项目配置文件


mixins 混入目录
注：
1、share.js当前主要用来分享绑定操作及分享数据配置，需搭配父组件定义shareData使用,默认页面为当前页面title为商城名称，图片为当前页面图片
2、index.js为全局混入
3、OrderPay.js为订单提交处理混入。




store Vuex文件
注：
1、获取用户信息，获取定位，获取商城配置均已封装在store



utils/utils   封装方法，已挂载Vue原型实例（$utils）
注：
1、当前项目所有跳转方式均走自定义封装跳转方式（$utils.toUrl）,方便跳转拦截处理逻辑




utils/request 请求封装
注：
1、当前所有接口返回状态为-1且为未登录，跳转至登录页面。且保存跳转前页面。登录完成返回登录页面
2、接口返回不等于-1且不为成功状态码均走错误消息（errorToast）处理，过滤某些不必要提示。

api/*  所有服务接口封装，已挂载Vue实例（$requestAll）



公共组件简介
components/share分享弹框
componets/Upload上传组件
components/w-evaluate五角星组件
components/w-navbar自定义导航头
components/wx-open-subscribe公众号订阅消息组件二次封装
components/TabBar主要用来出来后端返回tabbar数据渲染tabbar
components/shenhe审核组件
componets/picker-address省市区选择组件，picker选择使用
componets/picker-regions即将废除
componets/pay-password免密支付弹框
componets/OrderDelivery选择配送方式组件


components/goods/AttrPopup规格选择弹框
components/goods/GiveGoods赠送商品选择及展示，主要用于订单商品显示或选择赠送商品
components/goods/GoodsList商品列表渲染





utils/wxConfig 公众号jweixin-module初始化配置
static/css/common.css  公共样式内封装flex公共样式，字体排列方式，内外边距，字体大小，常用color，常用background-color，透明度0-1,等等。。。





<!-- uni暴露获取dom元素方法 -->
this.$uGetRect('#id')




注意！！！！！！！！！！！！！！！！！！！
注意！！！！！！！！！！！！！！！！！！！
u-popup组件加如下事件修饰符，防止滚动穿透，更新uview组件需重新加如下修饰符
@touchmove.stop.prevent

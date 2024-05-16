<template>
	<view class="order-list">
		<view class="bg-fff">
			<u-tabs :list="tabsList" @click="clickTabs" :activeStyle="{
          color: '#f00',
          fontWeight: '600',
        }" :current="tabsIndex" :lineWidth="25" lineHeight="5rpx" :lineColor="'#f00'" :scrollable="false"></u-tabs>
		</view>

		<scroll-view scroll-y class="content">
			<template v-if="orderData && orderData.list.length">
				<OrderList :list="orderData.list" @clickCancel="clickCancel" @clickPay="clickPay"
					@orderConfirm="orderConfirm" @onShowCode="onShowCode" @clickOrder="clickOrder" type="integral">
				</OrderList>
				<u-loadmore status="nomore"></u-loadmore>
			</template>
			<u-empty v-else mode="data" :icon="wxapp_img.empty_data">
			</u-empty>
			
			<CodePopup :imgUrl="codeUrl" :show.sync="showCodePopup" title="核销二维码"></CodePopup>
		</scroll-view>
	</view>
</template>

<script>
	import OrderPay from '@/mixins/OrderPay';

	import OrderList from '@/components/OrderList/OrderList.vue'
	import CodePopup from '@/pages/user/components/CodePopup.vue'
	export default {
		components: {
			CodePopup,
			OrderList,
		},
		mixins: [OrderPay],
		data() {
			return {
				tabsList: [{
						name: '待付款',
					},
					{
						name: '待发货',
					},
					{
						name: '待收货',
					},
					{
						name: '已完成',
					},
				],
				codeUrl: '',
				showCodePopup: false,
				tabsIndex: 0,
				orderData: '',
			};
		},
		onLoad(params) {
			this.tabsIndex = params.status ? params.status - 0 : 0;
		},
		onShow() {
			this.getOrderList();
		},
		methods: {
			async onShowCode(order) {
				// 获取核销吗
				const res = await this.$requestAll.integralmall.getQrcode({
					order_no: order.order_no
				}, true)
				this.codeUrl = res.data.url
				this.showCodePopup = true
			},
			// 确认收货
			async orderConfirm(item) {
				uni.showModal({
					title: '提示',
					content: '是否已确认收货？',
					showCancel: true,
					success: async ({
						confirm,
						cancel
					}) => {
						if (confirm) {
							const res = await this.$requestAll.integralmall.orderConfirm({
								order_id: item.id,
							});
							this.resetData();
							this.getOrderList();
						}
					},
				});
			},
			clickTabs({
				index
			}, order) {
				this.tabsIndex = index;
				this.resetData();
				this.order_id = order ? order.order_id : '';
				this.getOrderList();
			},
			// 重置数据
			resetData() {
				this.orderData = this.$options.data().orderData;
				this.orderList = this.$options.data().orderList;
				this.status = this.$options.data().status;
				this.page = this.$options.data().page;
			},
			// 获取数据列表
			async getOrderList() {
				var params = {
					status: this.tabsIndex,
				};
				const res = await this.$requestAll.integralmall.integralmallList(
					params,
					true
				);
				let list = res.data.list.map(item => {
					return Object.assign(item, {
						goods_list: [{
							goods_name: item.detail.goods_name,
							goods_pic: item.detail.pic,
							num: 1,
							attr_list: item.detail.attr
						}]
					})
				})
				this.orderData = Object.assign(res.data, {
					list
				});

			},
			// 点击订单
			clickOrder(item) {
				console.log(item);
				this.$utils.toUrl('/integral-mall/clerk/clerk?id=' + item.order_no);
			},
			// 取消订单
			clickCancel(item) {
				uni.showModal({
					title: '提示',
					content: '您确定取消该订单吗?',
					success: async res => {
						if (res.confirm) {
							const {
								msg
							} = await this.$requestAll.integralmall.orderRevoke({
									order_id: item.id,
								},
								true
							);
							uni.showModal({
								title: '提示',
								content: msg,
								showCancel: false,
								success: ({
									confirm,
									cancel
								}) => {
									this.resetData();
									this.getOrderList();
								},
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					},
				});
			},
			// 点击支付
			clickPay(order) {
				uni.showModal({
					title: '提示',
					content: '请选择支付方式',
					showCancel: true,
					cancelText: '余额支付',
					confirmText: '线上支付',
					success: async ({
						confirm,
						cancel
					}) => {
						// 线上支付
						var payIndex = 0;
						if (cancel) {
							payIndex = 1;
						}
						// 余额支付
						if (confirm) {
							payIndex = 0;
						}
						const res = await this.$requestAll.integralmall.orderSubmit({
								id: order.id,
								pay_type: this.orderData.pay_type_list[payIndex].payment,
							},
							true
						);
						// 线上支付退出
						if (cancel) {
							this.getOrderList();
							return;
						}
						await this.wxPay(res);
						this.getOrderList();
					},
				});
			},
			// 点击退款
			onTuikuan(item) {
				uni.showModal({
					title: '提示',
					// content: `您确定退款当前订单${item.order_id}`,
					content: '是否取消该订单？',
					success: async res => {
						if (res.confirm) {
							const {
								msg
							} = await this.$requestAll.order.orderRevoke({
									order_id: item.order_id,
								},
								true
							);
							uni.showModal({
								title: '提示',
								content: msg,
								success: function(res) {
									if (res.confirm) {
										console.log('用户点击确定');
									} else if (res.cancel) {
										console.log('用户点击取消');
									}
								},
							});
							this.resetData();
							this.getOrderList();
						} else if (res.cancel) {
							// this.$utils.toast('用户点击取消');
						}
					},
				});
			},
		},
		computed: {
			SHOP_CONFIG() {
				return this.$store.getters['SHOP_CONFIG'];
			},
		},
	};
</script>

<style lang="less" scoped>
	.order-list {
		background: #f5f5f5;
		height: 100vh;
		/* #ifdef H5 */
		height: calc(100vh - 44px);
		/* #endif */
		padding-bottom: env(safe-area-inset-bottom);
		display: flex;
		flex-direction: column;

		/deep/.u-tabs__wrapper__scroll-view-wrapper {
			padding-bottom: 10rpx;

			.u-tabs__wrapper__nav__item {
				padding: 0;
			}
		}

		>.content {
			flex: 1;
			height: 0;
		}
	}

	.conent-box {
		padding-top: 20rpx;

		.order-item {
			border-radius: 20rpx;
			padding: 20rpx 0;
			box-shadow: 4rpx 6rpx 2rpx #eee;
			margin: 0 20rpx 20rpx;
			background: #fff;

			>view {
				padding: 0 20rpx;
			}

			.order-title {
				font-size: 26rpx;
				border-bottom: 2rpx solid #e5e5e5;

				>view:nth-child(1) {
					font-weight: 600;
					padding-bottom: 20rpx;
				}

				>view:nth-child(2) {
					color: #666;
					padding-bottom: 20rpx;
				}
			}

			.total-button {
				margin-top: 10rpx;
				padding-top: 20rpx;
				border-top: 2rpx solid #eee;
				height: 60rpx;
				color: #555;

				.button-box {
					width: 0;
					flex: 1;
					justify-content: flex-end;

					>view {
						padding: 0 20rpx;
						line-height: 50rpx;
						border: 2rpx solid #ddd;
						border-radius: 10rpx;
						margin-left: 20rpx;
						font-size: 30rpx;
					}
				}
			}
		}
	}

	.code-popup {
		padding: 40rpx;
		box-sizing: content-box;
		text-align: center;

		image {
			display: block;
			margin: 0 auto;
			width: 450rpx;
			height: 450rpx;
		}
	}

	.border0 {
		border: 0 !important;
	}
</style>

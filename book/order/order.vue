<template>
	<view class="body flex-col">
		<view class="bg-fff" style="border-bottom: 2rpx solid #eee">
			<u-tabs :current="status" :list="list1" :activeStyle="{
          color: 'red',
        }" lineColor="red" @change="clickTab" :scrollable="false"></u-tabs>
		</view>

		<scroll-view @scrolltolower="loadData()" scroll-y class="content flex-h-1">
			<view class="scroll-box" v-if="list.length">
				<!-- <OrderList @getList="resetPageData" :list="list"></OrderList> -->
				<OrderList @clickShiyong="clickShiyong" @applyRefund="applyRefund" @clickCancel="clickCancel"
					:list="list" type="book">
				</OrderList>
				<u-loadmore :status="more"></u-loadmore>
			</view>
			<view class="scroll-box" v-else>
				<u-empty mode="data" :icon="wxapp_img.empty_data">
				</u-empty>
			</view>

			<CodePopup :imgUrl="codeUrl" :show.sync="showCode" title="核销二维码"></CodePopup>
		</scroll-view>
	</view>
</template>
<script>
	import OrderList from '@/components/OrderList/OrderList.vue'
	import CodePopup from '@/pages/user/components/CodePopup.vue'
	export default {
		components: {
			OrderList,
			CodePopup
		},
		data() {
			return {
				list1: [{
						name: '全部',
					},
					{
						name: '待支付',
					},
					{
						name: '待使用',
					},
					{
						name: '已使用',
					},
					{
						name: '售后',
					},
				],
				pageData: '',
				status: 0,
				list: [],
				page: 1,
				more: 'loadmore',
				codeUrl: '',
				showCode: false
			};
		},
		onLoad(params) {
			this.loadData();
		},

		methods: {
			// 立即使用
			async clickShiyong(item) {
				const res = await this.$requestAll.book.getQrcode({
						order_no: item.order_no,
					},
					true
				);
				this.codeUrl = res.data.url;
				this.showCode = true;
			},
			// 取消订单
			async clickCancel(item) {
				uni.showModal({
					title: '提示',
					content: '您确定取消该订单吗?',
					success: async res => {
						if (res.confirm) {
							await this.$requestAll.book.cancel({
									id: item.id,
								},
								true
							);
							this.loadData(true)
						}
					},
				});
			},
			// 申请退款
			async applyRefund(item) {
				uni.showModal({
					title: '提示',
					content: '您确定申请退款吗?',
					success: async res => {
						if (res.confirm) {
							await this.$requestAll.book.applyRefund({
									order_id: item.id,
								},
								true
							);
							this.loadData(true)
						}
					},
				})
			},
			async loadData(isReset) {
				if (isReset) {
					let {
						list,
						more,
						page
					} = this.$options.data()
					this.list = list
					this.more = more
					this.page = page
				}
				if (this.more == 'nomore') return;
				const res = await this.$requestAll.book.orderList({
						status: this.status - 1,
						page: this.page,
					},
					true
				);
				let list = res.data.list.map(item => {
					return {
						...item,
						goods_list: [{
							goods_name: item.goods_name,
							goods_pic: item.cover_pic,
							price: item.original_price,
							attr_list: item.attr_list
						}]
					}
				})
				this.list.push(...list);
				this.more =
					this.list.length >= res.data.row_count ? 'nomore' : 'loadmore';
				this.page++;
			},
			clickTab({
				index
			}) {
				this.status = index;
				this.resetPageData();
			},
			resetPageData() {
				this.list = this.$options.data().list;
				this.page = this.$options.data().page;
				this.more = this.$options.data().more;
				this.loadData()
			},
		},
		onShow() {},
		computed: {},
		watch: {},
		onReachBottom() {},
	};
</script>
<style lang="scss" scoped>
	.body {
		background: #f5f5f5;
		height: 100vh;
		/* #ifdef H5 */
		height: calc(100vh - 44px);
		/* #endif */
	}
</style>

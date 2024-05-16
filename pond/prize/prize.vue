<template>
	<view class="body">
		<div v-if="pageData.length" class="list">
			<div v-for="item in pageData" :key="item.id" class="item flex-y-center flex-x-sb p-20" :style="{
				background: item.type != 4 || (item.type == 4 && item.status == 1) ? '#f5f5f5': '#fff'
			}">
				<view class="flex-w-1">
					<view class="font-30">{{ item.name }}</view>
					<view class="font-24 color-999 m-t-20">{{ item.create_time }}</view>
				</view>
				<view class="bt" v-if="item.type != 4"> 已发放 </view>
				<view @click="item.status != '1' && submit(item)" :class="['bt',item.status != 1 && 'bt-4'] " v-else>
					{{ item.status == 1 ? '已兑换' : '立即兑换' }}
				</view>
			</div>
			<u-loadmore :status="status"></u-loadmore>
		</div>
		<u-empty v-else mode="data" :icon="wxapp_img.empty_data">
		</u-empty>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				pageData: [],
				page: 1,
				status: 'loadmore',
			};
		},
		onLoad() {
			this.loadData();
		},
		onShow() {},
		methods: {
			async loadData() {
				if (this.status == 'nomore') return;
				const res = await this.$requestAll.pond.pondPrize({
						page: this.page,
					},
					true
				);
				this.pageData.push(...res.data);
				this.page++;
				this.status = res.data.length < 20 ? 'nomore' : 'loadmore';
			},
			submit(goods) {
				// pond_id=649&goods_info={"goods_id":"1","attr":[{"attr_id":1,"attr_group_name":"规格","attr_name":"默认"}],"num":1}
				let goods_info = {
					goods_id: goods.gift_id,
					attr: goods.attr,
					num: 1,
				};
				this.$utils.toUrl(
					'/pages/order-submit/order-submit?pond_id=' +
					goods.id +
					'&goods_info=' +
					JSON.stringify(goods_info)
				);
			},
		},
		computed: {},
		watch: {},
		onReachBottom() {
			this.loadData();
		},
		onPullDownRefresh() {},
	};
</script>
<style lang="scss" scoped>
	.body {
		background: #f5f5f5;
		min-height: 100vh;
		/* #ifdef H5 */
  min-height: calc(100vh - 44px);
  /* #endif */
		padding-bottom: env(safe-area-inset-bottom);

		.item {
			border-bottom: 1px solid #eee;

			.bt {
				line-height: 1.9;
				padding: 0 20rpx;
				border-radius: 30rpx;
				background: #cdcdcd;

				color: #fff;
			}

			.bt-4 {
				color: #ff0000;
				background: initial;
				border: 2rpx solid #ff0000;
			}
		}
	}
</style>

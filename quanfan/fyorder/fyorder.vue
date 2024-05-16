<template>
	<view v-if="pageData" class="body">
		<div class="zong">
			<view @click="$utils.toUrl('/quanfan/daifang/daifang?pageType=daifang')"
				class="flex-col flex-y-center flex-x-center font-center">
				<view class="font-36">￥0</view>
				<view class="font-30">待释放金额</view>
			</view>
			<view @click="$utils.toUrl('/quanfan/daifang/daifang?pageType=yifang')"
				class=" flex-col flex-y-center flex-x-center font-center">
				<view class="font-36">￥0</view>
				<view class="font-30">已释放金额</view>
			</view>
			<view class="flex-col flex-y-center flex-x-center font-center">
				<view class="font-36">0%</view>
				<view class="font-30">释放速率</view>
			</view>
		</div>

		<div class="tabs">
			<view>消费优惠券</view>
			<view>商家优惠券</view>
		</div>
		<view class="font-center bg-fff p-y-10 color-666">
			优惠券释放后可以到任何联盟商家消费或使用
		</view>

		<div class="fixed" @click="$utils.toUrl('/other/member/member')">会员加速</div>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				pageData: '',
			};
		},
		onLoad() {
			this.loadData();
		},
		methods: {
			async loadData() {
				const res = await this.$requestAll.order.quanfan({
					status: -1,
				});
				this.pageData = res.data;
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
		min-height: 100vh;

		.zong {
			display: flex;
			background: #ff0000;
			color: #fff;
			justify-content: space-around;
			align-items: center;
			padding: 30rpx 0;
		}

		.tabs {
			display: flex;
			justify-content: space-around;
			align-items: center;
			line-height: 100rpx;
			background: #fff;
			margin-top: 20rpx;
			border-bottom: 2rpx solid #eee;
		}
	}

	.fixed {
		position: fixed;
		right: 0;
		top: 50%;
		transform: translate(0, -50%);
		padding: 10rpx;
		background: #ff0000;
		box-sizing: content-box;
		border-radius: 50%;
		width: 86rpx;
		height: 86rpx;
		text-align: center;
		font-size: 32rpx;
		color: #fff;
	}
</style>

<template>
	<view v-if='code' class='body'>
		<view class="zhongjiang ">
			<div class="p-y-20 border-b font-30 color-999 font-center">
				持有{{code.num}}个幸运码
			</div>
			<div class="p-x-30">
				<div class="p-y-20 flex-y-center">
					<view class="flex-w-1 flex-y-center">
						<image :src="code.own.user.avatar_url" class="user-img" mode="aspectFill"></image>
						<text class="p-l-20 u-line-1 flex-w-1 font-30">
							{{code.own.user.nickname}}
						</text>
					</view>

					<view class="font-right m-l-20">
						<view class="">{{code.own.lucky_code}}</view>
						<view class="">幸运码</view>
					</view>
				</div>

				<!-- 获赠的幸运码 -->
				<div v-for="(item,i) in code.parent" :key="i" class="p-y-20 flex-y-center">
					<view class="flex-w-1 flex-y-center">
						<image :src="item.avatar_url" class="user-img" mode="aspectFill"></image>
						<text class="p-l-20 u-line-1 flex-w-1 font-30">
							{{item.nickname}}
						</text>
					</view>

					<view class="font-right m-l-20">
						<view class="">{{item.lucky_code}}</view>
						<view class="">获赠幸运码</view>
					</view>
				</div>
			</div>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				code: '',
				id: '',
			};
		},
		onLoad(params) {
			this.id = params.id
			this.loadData();
		},
		onShow() {},
		methods: {
			async loadData() {
				const res = await this.$requestAll.lottery.luckyCode({
					id: this.id
				});
				this.code = res.data;
			},
		},
		computed: {},
		watch: {},
		onReachBottom() {},
		onPullDownRefresh() {}
	}
</script>
<style lang='scss' scoped>
	.body {
		padding: 20rpx;
		background: #f5f5f5;
		min-height: 100vh;
	}

	.zhongjiang {
		border-radius: 20rpx;
		background: #fff;

		.user-img {
			width: 70rpx;
			height: 70rpx;
			border-radius: 50%;
		}
	}
</style>

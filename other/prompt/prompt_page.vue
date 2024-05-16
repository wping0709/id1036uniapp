<template>
	<view class="body">
		<!-- <div class="title">提示</div> -->
		<u-empty
		        text="使用小程序打开，app暂不支持此插件"
		        icon="http://cdn.uviewui.com/uview/empty/permission.png"
		>
		</u-empty>
		<!-- <div class="rules">{{pageData}}
		</div> -->
	</view>
</template>
<script>
	export default {
		data() {
			return {
				pageData: '使用小程序打开，app暂不支持此插件',
			};
		},
		onLoad() {
			// this.loadData();
		},
		onShow() {},
		methods: {
			// async loadData() {
			// 	const res = await this.$requestAll.step.setting({}, true);
			// 	this.pageData = res.data;
			// },
		},
		computed: {},
		watch: {},
		onReachBottom() {},
		onPullDownRefresh() {},
	};
</script>
<style lang="scss" scoped>
	.body {
		padding-top: 20rpx;
		background: #f5f5f5;
		min-height: 100vh;
		background: #fff;

		.title {
			margin: 0 20rpx;
		}

		.rules {
			margin-top: 20rpx;
			padding: 0 20rpx;
			text-align: center;
		}
	}
</style>

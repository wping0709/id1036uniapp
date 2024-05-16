<template>
	<view class="" :style="{background:param.bg_color}">
		<view :style="{height:systemInfo.statusBarHeight+ 'px'}" class=""></view>
		<view class="info-box">
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			param: {
				type: Object,
				default: () => {
					return {}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.info-box {
		height: 88rpx;
		padding: 0 20rpx;
		color: #FFF;
		display: flex;
	}
</style>

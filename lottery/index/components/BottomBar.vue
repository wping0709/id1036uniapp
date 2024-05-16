<template>
	<div class="bottom-menus">
		<div class="fixed flex-y-center">
			<div @click="$utils.toUrl('/lottery/index/index','redirectTo')" class="menu flex-y-center flex-x-center">
				<text class="iconfont icon-gift"></text>
				<text>抽奖会场</text>
			</div>
			<div @click="$utils.toUrl('/lottery/prize/prize','redirectTo')" class="menu flex-y-center flex-x-center">
				<text class="iconfont icon-jilu"></text>
				<text>抽奖记录</text>
			</div>
		</div>
	</div>
</template>

<script>
</script>

<style lang="less" scoped>
	.bottom-menus {
		height: 100rpx;
		height: calc(100rpx + env(safe-area-inset-bottom));

		.fixed {
			height: 100rpx;
			height: calc(100rpx + env(safe-area-inset-bottom));
			padding-bottom: env(safe-area-inset-bottom);
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			background: #fff;

			display: flex;
			justify-content: space-around;

			.menu {
				height: 50rpx;
				width: 0;
				flex: 1;

				&:nth-child(2) {
					border-left: 1px solid #aaa;
				}
			}
		}
	}
</style>

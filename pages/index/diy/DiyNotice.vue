<template>
	<view >
		<view @click="showContent" :style="{
        color: param.color,
        background: param.bg_color,
      }" class="flex-y-center p-x-20 notice-box">
			<view class="left flex-y-center">
				<image :src="param.icon || wxapp_img.icon_notice" style="width: 40rpx; height: 40rpx" mode="aspectFit"></image>
				<text class="m-l-10">{{ param.name }}</text>
			</view>
			<view class="content flex-w-1 m-x-10">
				<u-notice-bar :text="param.content" icon=" " :bg-color="param.bg_color" :color="param.color"></u-notice-bar>
			</view>
			<text class="iconfont icon-arrow-right font-30" :style="{ color: param.color }"></text>
		</view>
		<u-popup :safeAreaInsetBottom="false" :show="show" mode="center" round="10">
			<view style="width: 600rpx">
				<view>
					<image class="img-title" :src="wxapp_img.icon_notice_title" mode="widthFix" />
				</view>
				<view style="padding: 36rpx; margin-top: -40rpx">
					<scroll-view scroll-y style="max-height: 500rpx">
						{{ param.content }}
					</scroll-view>
					<view @click="showContent" class="popup-bt m-t-20"
						style="background: linear-gradient(-90deg, #e83c3c, #fe886e)">我知道了</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		name: 'DiyNotice', //商城公告
		data() {
			return {
				show: false,
			};
		},
		props: {
			param: {
				type: Object,
				default () {
					return {};
				},
			},
		},
		methods: {
			showContent() {
				this.show = !this.show;
			},
		},
	};
</script>

<style lang="scss" scoped>
	.notice-box {
		height: 88rpx;
		overflow:hidden;
	}

	.img-title {
		position: relative;
		left: -20rpx;
		top: -46rpx;
		width: 622rpx;
	}

	.popup-bt {
		line-height: 80rpx;
		border-radius: 10rpx;
		color: #fff;
		font-size: 28rpx;
		text-align: center;
	}
</style>

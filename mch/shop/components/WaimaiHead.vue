<template>
	<view v-if="shopData" class="head">
		<image :src="shopData.shop.header_bg" mode="aspectFill" />
		<view @click="
        $utils.toUrl(
          '/mch/shop-summary/shop-summary?mch_id=' + shopData.shop.id
        )
      " class="head-content">
			<view class="left flex-w-1 flex">
				<image :src="shopData.shop.logo" mode="aspectFill" />
				<view class="flex-w-1 flex-col flex-x-sb">
					<view class="font-32">
						<text>{{ shopData.shop.name }}</text>
						<text class="iconfont icon-arrow-right color-666"></text>
					</view>
					<view class="flex">
						<text>
							<text style="color: #ffd261" class="iconfont icon-collection-fill font-24 m-r-10"></text>
							<text>{{ shopData.shop.score }}</text>
						</text>
						<text>
							<text style="color: #02c3b0" class="iconfont icon-jisu font-24 m-r-10"></text>
							<text>极速退款</text>
						</text>
						<text>
							<text style="color: #ffa100" class="iconfont icon-shijian font-24 m-r-10"></text>
							<text>配送约{{ shopData.shop.delivery_time }}分钟</text>
						</text>
					</view>
				</view>
			</view>
			<view @click.stop="switchShoucang" class="right flex-col flex-x-center flex-y-center">
				<text v-if="!shopData.shop.is_favorite" class="iconfont icon-collection font-40"></text>
				<text v-else class="iconfont icon-collection-fill font-40"></text>
				<text>{{ !shopData.shop.is_favorite ? '收藏' : '已收藏' }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			shopData: {
				type: Object,
				default () {
					return {};
				},
			},
		},
		methods: {
			// 收藏切换
			async switchShoucang() {
				if (this.shopData.shop.is_favorite == 1) {
					const res = await this.$requestAll.user.favoriteRemove({
							goods_id: this.shopData.shop.id,
							type: 2,
						},
						true
					);

					this.$emit('favoriteChange', 0);
				} else {
					const res = await this.$requestAll.user.favoriteAdd({
							goods_id: this.shopData.shop.id,
							type: 2,
						},
						true
					);
					this.$emit('favoriteChange', 1);
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	.head {
		position: relative;

		>image {
			width: 100%;
			height: 240rpx;
		}

		.head-content {
			position: relative;
			z-index: 9;

			display: flex;
			justify-content: space-between;
			align-items: center;
			background: #fff;
			border-radius: 10rpx;

			width: 700rpx;
			height: 130rpx;
			padding: 20rpx;
			margin: -65rpx auto 0;

			.left {
				>image {
					width: 100rpx;
					height: 100rpx;
					border-radius: 10rpx;
					margin-right: 20rpx;
				}

				>.flex-w-1 {
					>view:nth-child(2) {
						>text {
							padding: 0 10rpx;

							font-size: 22rpx;
							border-right: 2rpx solid #eee;
							height: 30rpx;
							line-height: 30rpx;

							&:nth-child(1) {
								padding-left: 0;
							}

							&:nth-last-child(1) {
								border-right: 0 solid #000;
								padding-right: 0;
							}
						}
					}
				}
			}

			.right {
				width: 70rpx;

				color: #666;

				.icon-collection-fill {
					color: #ffd261;
				}

				font-size: 22rpx;
			}
		}
	}
</style>

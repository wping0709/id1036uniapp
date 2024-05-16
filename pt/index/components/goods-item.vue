<template>
	<view class="goods">
		<div class="goods-img">
			<image :src="goods.cover_pic" style="width: 100%; height: 100%; border-radius:10rpx;" mode="aspectFill" />

			<view v-if="goods.avatar_url && goods.avatar_url.length" class="imgs flex-y-center">
				<!-- <scroll-view scroll-x class="flex-w-1 m-r-10"> -->
				<div class="imgs-scroll flex-w-1">
					<image v-for="(item, index) in goods.avatar_url" :key="index" :src="item" v-if="index < 3"
						mode="aspectFill" class="img-item" />
				</div>
				<!-- </scroll-view> -->
				<view>等正在拼团</view>
			</view>
		</div>
		<div class="right flex-w-1">
			<view class="goods-name u-line-1">{{ goods.name }}</view>

			<!-- 无团长-->
			<template v-if="goods.is_launch == 0">
				<view class="progress flex-y-center">
					<u-line-progress :percentage="percentage" activeColor="#ff1923" inactiveColor="#fee6e0"
						height="28rpx">
						<view style="min-width: 120rpx" class="u-line-1 color-fff font-20 font-center">
							<text>{{ goods.place_order_num || 0 }}</text>
							<text>/</text>
							<text>{{ goods.group_num }}</text>
						</view>
					</u-line-progress>
				</view>
			</template>
			<template v-else>
				<view class="flex m-b-20">
					<div class="pt-num-box flex-y-center">
						<view class="num"> {{ goods.group_num }}人团</view>
						<!-- <view class="num_1">已拼2678份</view> -->
					</div>
				</view>

				<!-- <view class="discount"> 已省{{ discount }}元 </view> -->
			</template>

			<view class="price-box">
				<PriceText :price="goods.price" ySize="44rpx" fSize="28rpx"></PriceText>
				<text class="color-999 m-l-10 font-24">单价买 ￥{{ goods.original_price }}
				</text>
			</view>

			<!-- 无团长才有图片 -->
			<view class="pt-info" v-if="goods.success_num > 0">
				<div class="pt-content">
					<div class="pt-left font-center color-fff">
						<view class="font-600-20 ">
							未中奖补贴
						</view>
						<view class="">
							<text class="font-600-22">￥</text>
							<text class="font-600-32">{{goods.subsidy_price}}</text>
						</view>
					</div>

					<image class="shandian" :src="wxapp_img.pt.shandian" mode="heightFix"></image>

					<div class="pt-right">
						<view class="">{{ goods.group_num }}人拼团</view>
						<view class="">{{ goods.success_num }}人拼中商品</view>
					</div>
				</div>
			</view>
		</div>
	</view>
</template>
<script>
	import PriceText from '@/components/price-text';
	export default {
		components: {
			PriceText,
		},
		props: {
			goods: {
				type: [Object, String],
			},
		},
		data() {
			return {};
		},
		onLoad(params) {},
		onShow() {},
		methods: {},
		computed: {
			// 计算进度条百分比
			percentage() {
				if (this.goods) {
					let y = this.goods.place_order_num ? this.goods.place_order_num : 0;
					let x = this.goods.group_num ? this.goods.group_num : 0;
					return (y / x) * 100;
				}
				return 0;
			},
			// 计算优惠金额
			discount() {
				if (this.goods) {
					let r = this.goods.original_price - this.goods.price;
					console.log(r);
					return r.toFixed(2);
				}
				return 0;
			},
		},
		watch: {},
		onReachBottom() {},
		onPullDownRefresh() {},
	};
</script>
<style lang="scss" scoped>
	.goods {
		// height: 300rpx;
		background: #fff;
		border-radius: 20rpx;
		padding: 24rpx;
		display: flex;
		justify-content: space-between;

		.goods-img {
			position: relative;
			margin-right: 20rpx;
			width: 252rpx;
			height: 252rpx;
			border-radius: 10rpx;
			background: #e8e8e8;

			.imgs {
				position: absolute;
				top: 10rpx;
				left: 10rpx;
				border-radius: 232rpx;
				width: 232rpx;
				background: rgba(0, 0, 0, 0.5);
				color: #fff;
				padding-right: 10rpx;
				font-size: 24rpx;

				.imgs-scroll {
					white-space: nowrap;

					.img-item {
						width: 40rpx;
						height: 40rpx;
						border-radius: 40rpx;
						margin-left: -20rpx;
						border: 1px solid #fff;

						&:nth-child(1) {
							margin-left: 0;
						}
					}
				}
			}
		}

		.goods-name {
			line-height: 42rpx;
			font-size: 30rpx;
			font-weight: 600;
			color: rgba(51, 51, 51, 0.94);
			margin-bottom: 14rpx;
		}

		.progress {
			height: 28rpx;
			margin-bottom: 12rpx;
		}

		.pt-num-box {
			line-height: 32rpx;
			border: 2rpx solid #fec9cc;
			border-radius: 6rpx;

			.num {
				padding: 0 8rpx;
				background: #fee5e5;
				line-height: 32rpx;

				font-size: 20rpx;
				color: #ff1b22;
				font-weight: 600;
			}

			.num_1 {
				color: #ff1b22;
				padding: 0 8rpx;
			}
		}

		.discount {
			position: relative;
			display: inline-block;
			padding: 0 6rpx;
			line-height: 28rpx;
			background: #ff691b;
			border-radius: 6rpx;
			font-size: 20rpx;
			color: #fff;
			font-weight: 600;

			&::after {
				content: '';
				position: absolute;
				bottom: 0;
				left: 20rpx;
				transform: translateY(100%);
				border: 10rpx solid #ff691b;
				border-left-color: transparent;
				border-bottom-color: transparent;
				border-right-color: transparent;
			}
		}

		.price-box {
			margin-bottom: 12rpx;
		}

		.pt-info {
			position: relative;
			display: flex;
			width: 100%;
			height: 80rpx;

			.pt-content {
				position: absolute;
				width: 100%;
				height: 100%;

				display: flex;
				justify-content: space-between;
				align-items: center;



				.pt-left {
					flex: 1;
					border-radius: 10rpx 0 0 10rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;

					background: linear-gradient(90deg, #FF791F 0%, #FF0F45 35%, #FF0031 100%);
					height: 100%;
				}

				.shandian {
					height: 100%;
				}

				.pt-right {
					border-radius: 0 10rpx 10rpx 0;
					flex: 1;
					padding-left: 10rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;

					height: 100%;
					background: linear-gradient(90deg, #FFF1BB 0%, #FFD893 100%);

					color: #FF5337;
					font-size: 22rpx;

				}

				>view {
					// flex: 1;
					// width: 0;
					// text-align: center;
					// &:nth-child(2) {
					//   flex: initial;
					//   width: 45%;
					//   margin-left: 25rpx;
					//   color: #ff643d;
					// }
				}
			}
		}
	}
</style>

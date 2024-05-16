<template>
	<view class="bodyBox">
		<view class="bigBox" v-if="goodsList.length != 0">
			<view class="title">
				<view>
					<text class="newPeople">新人专享价</text><text>| 数量有限先到先得</text>
				</view>
				<view @click="check()">
					查看全部 <text class="iconfont icon-arrow-right"></text>
				</view>
			</view>
			<!-- 商品展示区域 -->
			<view class="commodity" v-if="goodsList.length != 0">
				<view v-for="(item,index) in goodsList" :key="item.goods_id" class="goodsShow"
					@click="goodsDetail(item.goods_id)">
					<image :src="item.cover_pic" class="goodsTu"></image>
					<view class="disc">
						{{item.name}}
					</view>
					<view class="price">
						<PriceText :price="item.price" ySize="30rpx" fSize="25rpx"></PriceText>
					</view>
					<view class="linePrice">
						<text>￥{{item.original_price}}</text>
					</view>
					<view class="shopCar" @click="getGoods">
						<text class="iconfont icon-cart-full"></text>
					</view>
				</view>
			</view>

		</view>
		<view class="patch" v-if="couponList.length != 0 && goodsList.length != 0">

		</view>
		<!-- 优惠券展示区域 -->
		<view class="towBox" v-if="couponList.length != 0">
			<view class="coupon">
				新人专享<text style="color: #F8F66E;">券</text>包
			</view>
			<view class="coupon-content">
				<view v-for="(item,index) in couponList" class="couponShow" :key="index">
					<view class="lef"></view>
					<view class="rig"></view>
					<view class="expiration">即将过期</view>
					<view class="subPrice">
						<PriceText :price="item.sub_price"></PriceText>
					</view>
					<view class=" fullDiscount">满{{item.min_price}}可用</view>
					<view v-if="item.is_collection==0" class="received" @click="getCoupon">新人专享</view>
					<view v-else class="noReceived">新人专享</view>
				</view>

			</view>
			<view @click="sendCoupon()" :class="{'isGet':isDraw,'noGet':!isDraw}">
				{{ isDraw ? '已领取,去逛逛':'一键领取'}}
				<text class="iconfont icon-arrow-right"></text>
			</view>
		</view>
	</view>
</template>

<script>
	import PriceText from "@/components/price-text/index"
	export default {
		components: {
			PriceText
		},
		props: ['page_id', 'item', '_templateKey'],
		data() {
			return {
				goodsList: [],
				couponList: [],
				couponMsg: ''
			}
		},
		computed: {
			isDraw() {
				console.log('走计算属性');
				if (this.couponList.length > 0) {
					for (var i = 0; i < this.couponList.length; i++) {
						if (this.couponList[i].is_collection == 0) {
							return false;
						}
					}
					return true;
				} else {
					return true;
				}
			}
		},
		methods: {
			async getNewPeople() {
				const res = await this.$requestAll.home.getTemplateData({
					page_id: this.page_id,
					_template: 'new_discount',
					_templateKey: this._templateKey,
					_templateItem: JSON.stringify(this.item)
				});
				this.goodsList = res.data.parma.goods
				this.couponList = res.data.parma.coupons

			},
			async sendCoupon() {
				if (!this.isDraw) {
					const res = await this.$requestAll.home.getCoupon()
					console.log('领取优惠券', res)
					this.couponMsg = res.msg
					if (res.code == 0) {
						this.isDraw = true
					}
				} else {
					uni.navigateTo({
						url: '/pageAllNew/allNewData/allNew'
					});
				}
			},
			// 点击查看商品详情
			goodsDetail(id) {
				uni.navigateTo({
					url: '/pages/goods/goods?id=' + id
				});
			},
			// 查看全部
			check() {
				uni.navigateTo({
					url: '/pageAllNew/allNewData/allNew'
				});
			},
		},
		created() {
			this.getNewPeople()
			// this.allDraw()
			// this.sendCoupon()
		},

	}
</script>

<style lang="scss" scoped>
	.bigBox {
		width: 702rpx;
		height: 432rpx;
		background: linear-gradient(135deg, #FE3D1A 0%, #FF5A1A 100%);
		margin: 24rpx;
		padding: 20rpx;
		border-radius: 24rpx;
	}

	.towBox {
		width: 702rpx;
		height: 344rpx;
		background: linear-gradient(135deg, #FE3D1A 0%, #FF5A1A 100%);
		margin: 24rpx;
		padding: 20rpx;
		border-radius: 24rpx;
	}

	.title {
		display: flex;
		justify-content: space-between;
		color: #FFFFFF;
		font-size: 24rpx;

		.newPeople {
			width: 150rpx;
			height: 42rpx;
			font-size: 30rpx;
			font-family: PingFang SC, PingFang SC;
			font-weight: 600;
			margin-right: 10rpx;
		}
	}

	// 商品展示区域
	.commodity {
		width: 662rpx;
		height: 320rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		opacity: 1;
		margin-top: 20rpx;
		margin-bottom: 22rpx;
		padding: 20rpx;
		display: flex;
		overflow: auto;

		.goodsShow {
			width: 160rpx;
			height: 280rpx;
			flex: 0 0 auto;
			// background-color: #FF5;
			margin-right: 30rpx;
			position: relative;
			z-index: 100rpx;

			.goodsTu {
				width: 160rpx;
				height: 160rpx;
				border-radius: 10rpx;
			}

			.disc {
				width: 144rpx;
				height: 34rpx;
				font-size: 24rpx;
				font-family: PingFang SC, PingFang SC;
				font-weight: 600;
				color: rgba(51, 51, 51, 0.94);
				margin-top: 10rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.linePrice {
				width: 58rpx;
				height: 28rpx;
				font-size: 20rpx;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				color: #999999;
				text-decoration: line-through;
			}

			.shopCar {
				width: 42rpx;
				height: 42rpx;
				background: #FF1B22;
				border-radius: 100%;
				opacity: 1;
				position: absolute;
				bottom: 0rpx;
				right: 0rpx;

				text {
					margin-left: 5rpx;
					line-height: 42rpx;
					font-size: 32rpx;
					color: #fff;
				}
			}

		}
	}

	.bodyBox {
		position: relative;
	}

	.patch {
		width: 702rpx;
		height: 80rpx;
		background: linear-gradient(135deg, #FE3D1A 0%, #FF5A1A 100%);
		position: absolute;
		top: 400rpx;
		left: 24rpx;
		// z-index: -1;
	}

	// 优惠券展示区域
	.coupon {
		width: 180rpx;
		height: 42rpx;
		font-size: 30rpx;
		font-family: PingFang SC, PingFang SC;
		font-weight: 600;
		color: #FFFFFF;
		margin-bottom: 10rpx;
		position: relative;
		z-index: 100rpx;
	}

	.coupon-content {
		height: 172rpx;
		width: 680rpx;
		// background-color: #900788;
		display: flex;
		overflow: auto;

		.couponShow {
			width: 200rpx;
			height: 160rpx;
			background: linear-gradient(136deg, #FEFEFE 0%, #FEE8E0 100%);
			border-radius: 20rpx;
			opacity: 1;
			margin-right: 12rpx;
			margin-top: 12rpx;
			position: relative;
			flex: 0 0 auto;

			.lef {
				width: 16rpx;
				height: 16rpx;
				border-radius: 100%;
				background-color: #FF5A1A;
				position: absolute;
				left: -8rpx;
				top: 72rpx;
			}

			.rig {
				width: 16rpx;
				height: 16rpx;
				border-radius: 100%;
				background-color: #FF5A1A;
				position: absolute;
				right: -8rpx;
				top: 72rpx;
			}

			.expiration {
				width: 92rpx;
				height: 26rpx;
				background: #FFE3E2;
				border-radius: 120rpx 120rpx 120rpx 0rpx;
				opacity: 1;
				font-size: 18rpx;
				color: #FF1B22;
				font-weight: 400;
				line-height: 26rpx;
				padding: 0rpx 10rpx;
				position: absolute;
				top: -10rpx;
				left: 0rpx;
			}

			.subPrice {
				height: 72rpx;
				width: 100%;
				line-height: 72rpx;
				font-size: 40rpx;
				font-family: PingFang SC, PingFang SC;
				font-weight: 600;
				color: #FF1B22;
				margin-top: 16rpx;
				text-align: center;
			}

			.fullDiscount {
				height: 32rpx;
				font-size: 22rpx;
				line-height: 32rpx;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				color: #FF1B22;
				margin: 0rpx 30rpx;
			}

			.noReceived {
				width: 100rpx;
				height: 36rpx;
				background: #FFE3E2;
				border-radius: 60rpx;
				text-align: center;
				font-size: 20rpx;
				font-family: PingFang SC, PingFang SC;
				font-weight: 400;
				color: #FF1B22;
				line-height: 36rpx;
				margin: 0rpx 46rpx;
			}

			.received {
				width: 100rpx;
				height: 36rpx;
				background-color: #FFE3E2;
				border-radius: 60rpx;
				opacity: 1;
				text-align: center;
				margin: 4rpx 50rpx 10rpx 50rpx;
				color: #FF1B22;
				font-size: 20rpx;
				// font-family: PingFang SC, PingFang SC;
				line-height: 36rpx;
			}
		}

	}

	.noGet {
		width: 226rpx;
		height: 56rpx;
		background: #FEE8C7;
		border-radius: 120rpx;
		opacity: 1;
		line-height: 56rpx;
		margin: 20rpx 238rpx;
		color: #FF1B22;
		text-align: center;
		font-size: 28rpx;
		font-family: PingFang SC, PingFang SC;
		font-weight: 600;

		text {
			display: inline-block;
			width: 32rpx;
			height: 32rpx;
			border-radius: 100%;
			background-color: #F4222D;
			color: #fff;
			text-align: center;
			line-height: 32rpx;
			margin-left: 10rpx;
			font-weight: 400;
		}
	}

	.isGet {
		width: 280rpx;
		height: 56rpx;
		background: #FEE8C7;
		border-radius: 120rpx;
		opacity: 1;
		line-height: 56rpx;
		margin: 20rpx 200rpx;
		color: #FF1B22;
		text-align: center;
		font-size: 28rpx;
		font-family: PingFang SC, PingFang SC;
		font-weight: 600;

		text {
			display: inline-block;
			width: 32rpx;
			height: 32rpx;
			border-radius: 100%;
			background-color: #F4222D;
			color: #fff;
			text-align: center;
			line-height: 32rpx;
			margin-left: 10rpx;
			font-weight: 400;
		}
	}
</style>
<template>
	<view class="scroll-box">
		<view v-for="(item, index) of goodsList" :key="index" class="goods-item"
			@click="$utils.toUrl(item.url || pageUrl + '?id=' + item.id)">
			<view class="goods-pic">
				<image :src="item.pic_url" mode="aspectFill" />
			</view>
			<view class="goods-txt">
				<!-- 商品名称 -->
				<view class="goods-des u-line-2">{{ item.name }}</view>


				<view class="goods-btm flex-x-sb ">
					<!-- 当前价格 -->
					<view class="price-color">
						<div>￥{{ item.price }}</div>
						<div v-if="item.is_negotiable != 1">
							<MemberPrice :memberPrice="item.goods_member_price"></MemberPrice>
						</div>
					</view>
					<!-- 已售数量 -->
					<view v-if="item.sales &&  is_sales" class="font-24 color-999">
						已售{{ item.sales }}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import MemberPrice from '@/components/member-price'
	export default {
		components: {
			MemberPrice
		},
		props: {
			is_sales:{
				type:Number,
				default:0
			},
			goodsList: {
				type: Array,
				default () {
					return [];
				},
			},
			pageUrl: {
				type: String,
				default: "/pages/goods/goods",
			},
		},
		onLoad() {
			console.log('this.store',this.store)
		}
	};
</script>

<style lang="scss" scoped>
	.scroll-box {
		display: flex;
		flex-wrap: wrap;
		padding-top: 10rpx;

		.goods-item {
			position: relative;
			background: #fff;
			width: 360rpx;
			border-radius: 10rpx;
			overflow: hidden;
			margin: 10rpx;
			margin-top: 0;

			&:nth-child(2n) {
				margin-left: 0;
			}

			.goods-pic>image {
				width: 360rpx;
				height: 360rpx;
			}

			.goods-txt {
				padding: 10rpx;

				.goods-des {
					line-height: 40rpx;
					height: 80rpx;
				}
			}
		}
	}

	.goods-num0 {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.3);
	}
</style>

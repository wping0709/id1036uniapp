<template>
	<view v-if="goods" class="body">
		<swiper :indicator-dots="true" :autoplay="true" :interval="5000" :duration="500" style="height: 750rpx;">
			<swiper-item v-for="(item,i) in goods.pic_list" :key="i">
				<view class="swiper-item" style="height: 100%;">
					<image :src="item.pic_url" mode="aspectFill" style="height: 100%;width: 100%;"></image>
				</view>
			</swiper-item>
		</swiper>


		<div class="msg">
			<div class="goods-name font-600-30 m-b-10">{{goods.name}}</div>
			<div class="price-box flex-y-center">
				<image :src="wxapp_img.step.price" mode="aspectFill" style="width: 40rpx;height: 40rpx;">
				</image>
				<text style="font-size: 40rpx;font-weight: 700;color: #ff9d1e;margin: 0 10rpx;">{{goods.price}}</text>

				<text class="font-del color-666">原价：{{goods.original_price}}</text>
			</div>
		</div>


		<AttrPopup :showText="true" :goodsId="goods_id" ref="AttrPopup" type="step"></AttrPopup>

		<view class="detail m-t-20">
			<u-parse :content="goods.detail"></u-parse>
		</view>



		<view class="bottom-bar">
			<div class="fixed">
				<div @click="$utils.toUrl('/pages/index/index')" class="home flex-col flex-x-center flex-y-center color-999">
					<text class="iconfont icon-home font-40"></text>
					<text class="font-24 ">首页</text>
				</div>
				<div @click="submit" class="right flex-w-1 flex-x-center flex-y-center color-fff">立即兑换</div>
			</div>
		</view>
	</view>
</template>
<script>
	import AttrPopup from '@/components/goods/AttrPopup'
	export default {
		components: {
			AttrPopup
		},
		data() {
			return {
				goods_id: '',
				goods: '',
			};
		},
		onLoad(params) {
			this.goods_id = params.goods_id
			this.loadData();
		},
		onShow() {},
		methods: {
			async loadData() {
				const res = await this.$requestAll.step.goods({
					goods_id: this.goods_id
				}, true);
				this.goods = res.data.goods;
			},
			submit() {
				this.$refs['AttrPopup'].showPopup('buy')
			}
		},
		computed: {},
		watch: {},
		onReachBottom() {},
		onPullDownRefresh() {},
	};
</script>
<style lang="scss" scoped>
	.body {
		background: #f5f5f5;
		min-height: 100vh;

		.msg {
			padding: 20rpx;
			background: #fff;

			.goods-name {}
		}

		.bottom-bar {
			box-sizing: content-box;
			height: 100rpx;
			padding-bottom: env(safe-area-inset-bottom);

			.fixed {
				box-sizing: content-box;
				height: 100rpx;
				padding-bottom: env(safe-area-inset-bottom);
				position: fixed;
				bottom: 0%;
				left: 0%;
				right: 0;
				background: #fff;

				display: flex;
				align-items: center;

				.home {
					height: 100%;
					width: 130rpx;
				}

				.right {
					height: 100%;
					background: #ff9d1e;
					font-size: 32rpx;
				}
			}
		}
	}
</style>

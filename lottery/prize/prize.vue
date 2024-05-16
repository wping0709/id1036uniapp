<template>
	<view class="body flex-col">
		<view class="bg-fff">
			<u-tabs :current="tabIndex" :list="list1" :activeStyle="{
		      color: 'red',
		    }" lineColor="red" @change="clickTab"></u-tabs>
		</view>

		<scroll-view scroll-y="true" class="flex-h-1">
			<view class="list" v-if="pageData.list.length">
				<div class="item" v-for="(item,i) in pageData.list" :key="i">
					<view @click="$utils.toUrl('/lottery/goods/goods?id='+item.lottery.id)" class="goods flex">
						<image :src="item.gift.cover_pic" mode="aspectFill"></image>
						<view class="right flex-w-1">
							<view class="u-line-2">{{item.gift.name}}</view>
							<view class="m-t-30 color-999">
								共{{item.lottery.stock}}份
							</view>
						</view>
					</view>

					<view @click="$utils.toUrl('/lottery/detail/detail?id='+ item.id)"
						class="kaijiang-info p-x-20 color-999 flex-y-center flex-x-sb">
						<view class="flex-y-center">
							<text class="iconfont icon-shijian"></text>
							<text class="">{{item.time}}</text>
						</view>
						<view class="flex-y-center">
							<text>查看详情</text>
							<text class="iconfont icon-arrow-right"></text>
						</view>
					</view>
				</div>
				<u-loadmore :status="pageData.status"></u-loadmore>
			</view>
			<u-empty v-else mode="data" :icon="wxapp_img.empty_data">
			</u-empty>
			<BottomBar></BottomBar>
		</scroll-view>
	</view>
</template>
<script>
	import BottomBar from '../index/components/BottomBar.vue'
	export default {
		components: {
			BottomBar,
		},
		data() {
			return {
				list1: [{
						name: '进行中',
					},
					{
						name: '未中奖',
					},
					{
						name: '已中奖',
					},
				],
				tabIndex: 0,
				pageData: {
					list: [],
					page: 1,
					status: 'loadmore',
				},
			};
		},
		computed: {},
		watch: {},
		onLoad(params) {
			this.loadData();
		},
		onShow() {},
		methods: {
			async loadData() {
				if (this.pageData.status == 'nomore') return;
				const res = await this.$requestAll.lottery.prize({
					status: this.tabIndex,
					page: this.pageData.page
				});
				this.pageData.list.push(...res.data.list);
				this.pageData.page++;
				this.pageData.status = res.data.list.length < 10 ? 'nomore' : 'loadmore';
			},
			clickTab({
				index
			}) {
				this.tabIndex = index;
				this.pageData = this.$options.data().pageData
				this.loadData();
			}
		},
		onReachBottom() {},
		onPullDownRefresh() {},
	};
</script>
<style lang="scss" scoped>
	.body {
		background: #f5f5f5;
		height: 100vh;
	}

	.list {
		.item {
			margin-bottom: 20rpx;
			background: #fff;

			.goods {
				padding: 20rpx;
				border-bottom: 1px solid #eee;

				>image {
					width: 220rpx;
					height: 220rpx;
					border-radius: 10rpx;
					margin-right: 20rpx;
				}

				.right {
					font-size: 30rpx;
				}
			}

			.kaijiang-info {
				line-height: 80rpx;
			}

		}
	}
</style>

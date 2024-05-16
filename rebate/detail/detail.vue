<template>
	<div class="body">
		<div class="list">
			<div v-for="(item, i) in pageData.list" :key="i" class="item">
				<div class="left flex-y-center">
					<img src="../images/detail_rmb.png" mode="widthFix"></img>
					<div class="m-left-10 ">
						<div style="font-size: 28rpx; margin-bottom:14rpx;">{{item.desc}}</div>
						<div class="color-999 font-size-24">{{item.created_at}}</div>
					</div>
				</div>
				<div class="right">
					<div style="font-size: 36rpx; font-weight: 600;">+ {{item.amount}}</div>
					<div class="color-999 font-size-26" style="margin-top: 4rpx;">已到账</div>
				</div>
			</div>

			<div @click="getList" class="">
				<u-loadmore :status="pageData.status"></u-loadmore>
			</div>
		</div>
	</div>

</template>
<script>
	export default {
		data() {
			return {
				// 1积分，2余额
				type: 1,
				pageData: {
					page: 1,
					status: 'loadmore',
					list: []
				},
				loading: false
			};
		},
		onLoad(params) {
			this.type = params.type
			this.getList();
		},
		methods: {
			async getList(fn) {
				if(this.pageData.status == 'nomore') return 
				const {data} = await this.$requestAll.rebate.logList({
					type: this.type,
					page: this.pageData.page
				})
				
				this.pageData = {
					list: [...this.pageData.list,...data.list],
					status: data.pagination.totalCount <= this.pageData.page ? 'nomore': 'loadmore',
					page: this.pageData.page+1
				}

				fn && fn()
			},
		},
		onPullDownRefresh() {
			this.pageData = this.$options.data().pageData
			this.getList(() => uni.stopPullDownRefresh())
		}
	};
</script>

<style lang="scss" scoped>
	.flex-w-1 {
		flex: 1;
		width: 0;
	}

	.flex-x-sb {
		display: flex;
		justify-content: space-between;
	}

	.m-left-10 {
		margin-left: 10*2rpx;
	}

	.font-size-24 {
		font-size: 12*2rpx;
	}

	.font-size-26 {
		font-size: 13*2rpx;
	}

	.color-999 {
		color: #999;
	}

	/* rebate/detail/detail.wxss */
	.body {
		padding-top: 12*2rpx;
	}

	.list {
		.item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 15*2rpx;
			background: #ffffff;
			border-bottom: 1*2rpx solid #f8f8f8;
		}
	}

	.item {
		.left {
			>img {
				width: 35*2rpx;
			}
		}

		.right {
			text-align: center;
		}
	}

	.loadmore {
		line-height: 50*2rpx;
		text-align: center;
	}
</style>

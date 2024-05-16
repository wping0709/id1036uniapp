<template>
	<div v-if="pageData" class="rebate">
		<div class="header">
			<img class="bg" src="../images/center_header_bg.png" mode="aspectFill"></img>
			<div class="content flex-x-sb">
				<div class="balance flex-w-1">
					<div>返利余额（元）</div>
					<div class="price">
						<span style="font-size: 44rpx; margin-left:-10rpx;">￥</span>
						<span style="margin-left:-10rpx;">{{pageData.consume_rebate_fyjine}}</span>
					</div>
					<div style="margin-top: 8rpx;">平台每日自动返利</div>
				</div>

				<div class="integral flex-w-1 m-l-10">
					<div>待返积分（个）</div>
					<div class="price">
						<span class="u-line-1">{{pageData.consume_rebate_fyjifen}}</span>
					</div>
					<div style="margin-top: 8rpx;"></div>
				</div>
			</div>
		</div>

		<div class="page-content">
			<div class="title">
				返利收入
			</div>

			<div @click="navToDetail(2)" class="menu-item">
				<div class="flex-y-center flex-x-sb">
					<div>余额返利（元）</div>
					<div class="flex-y-center color-999">
						<span>收入明细</span>
						<img src="../images/arrow-right.png" style="width:30rpx;" mode="widthFix"></img>
					</div>
				</div>

				<div class="price">
					<span style="font-size: 30rpx;">￥</span>
					<span>{{pageData.consume_rebate_fyjine}}</span>
				</div>

				<div class="color-999">累计余额返利 ¥{{pageData.consume_rebate_fyjine_surplus}}</div>
			</div>

			<div @click="navToDetail(1)" class="menu-item">
				<div class="flex-y-center flex-x-sb">
					<div>积分返利（个）</div>
					<div class="flex-y-center color-999">
						<span>收入明细</span>
						<img src="../images/arrow-right.png" style="width: 30rpx;" mode="widthFix"></img>
					</div>
				</div>

				<div class="price">
					<span>{{pageData.consume_rebate_fyjifen}}</span>
				</div>

				<div class="color-999">累计积分返利 {{pageData.consume_rebate_fyjifen_surplus}}</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				pageData: ""
			};
		},
		onLoad() {
			this.loadData()
		},
		methods: {
			async loadData() {
				const res = await this.$requestAll.rebate.center({},true)
				this.pageData = res.data
			},
			navToDetail(type) {
				this.$utils.toUrl("/rebate/detail/detail?type="+ type);
			}
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

	/* rebate/center.wxss */
	/* rebate/center.wxss */
	.rebate {
		box-sizing: border-box;
		padding: 12*2rpx;
		font-family: PingFang SC;
		font-weight: 400;
		background: #ffffff;
		min-height: 100vh;

		.bg {
			width: 100%;
			height: 100%;
		}
	}

	.header {
		position: relative;
		height: 142*2rpx;

		.content {
			position: absolute;
			left: 25*2rpx;
			right: 25*2rpx;
			top: 21*2rpx;
			bottom: 23*2rpx;
			font-size: 14*2rpx;
			color: #ffb2a2;
			white-space: nowrap;

			.price {
				color: #fff;
				font-weight: 600;
				margin-top: 8*2rpx;
				font-size: 34*2rpx;
				line-height: 48*2rpx;
			}
		}

	}

	.page-content {
		.title {
			margin-top: 20*2rpx;
			margin-bottom: 14*2rpx;
			line-height: 24*2rpx;
			font-size: 17*2rpx;
			font-weight: 600;
			color: #333333;
		}
	}

	.menu-item {
		height: 104*2rpx;
		background: #f5f5f5;
		border-radius: 10*2rpx;
		margin-bottom: 12*2rpx;
		font-size: 12*2rpx;
		padding: 14*2rpx 18*2rpx;

		.price {
			margin-top: 6*2rpx;
			margin-bottom: 6*2rpx;
			line-height: 30*2rpx;
			font-size: 22*2rpx;
			font-weight: 600;
			color: #333333;
		}
	}
</style>

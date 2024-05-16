<template>
	<view>
		<!-- 多行 -->
		<view class="center">
			<view class="center-bottom">
				<view class="center-bottom-view" @click="xiangqing(item.id)" v-for="(item, index) of topicList"
					:key="index">
					<image :src="item.image_content" class="center-bottom-view-img" mode="aspectFill"></image>
					<view class="center-bottom-view-biaoq">
						<view> #{{ item.topic_name }} </view>
					</view>
					<view class="center-bottom-view-content">
						{{ item.content }}
					</view>
					<view class="center-bottom-view-bottom">
						<view class="center-bottom-view-bottom-name">
							<image :src="item.avatar_url" mode="aspectFill"></image>
							<view>
								{{ item.nickname }}
							</view>
						</view>
						<view class="center-bottom-view-bottom-kan">
							<image :src="wxapp_img.wine.kan" mode="aspectFill"></image>
							<view>
								{{ item.browse_num }}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	// ids 1 多行
	export default {
		data() {
			return {};
		},
		props: {
			topicList: {
				type: Array,
			},
			ids: {
				type: Number,
			},
		},
		watch: {
			ids(e, a) {
				console.log(e, a);
			},
		},
		methods: {
			xiangqing(e) {
				uni.navigateTo({
					url: `../topicDetails/topicDetails?id=${this.ids}&article_id=${e}`,
				});
			},
		},
	};
</script>

<style scoped lang="scss">
	.center {
		width: 100%;
		// margin-left: 18rpx;
		margin-top: 10rpx;

		.center-bottom {
			display: flex;
			flex-wrap: wrap;

			.center-bottom-view {
				width: 352rpx;
				height: 544rpx;
				// background: red;
				border-radius: 16rpx;
				margin-left: 18rpx;
				margin-top: 10rpx;
				border-radius: 16rpx;
				background-color: #fff;

				.center-bottom-view-img {
					width: 352rpx;
					height: 352rpx;
					border-radius: 10rpx 10rpx 0 0;
				}

				.center-bottom-view-biaoq {
					width: 308rpx;
					height: 60rpx;
					overflow-x: auto;
					white-space: nowrap;
					margin-top: 10rpx;

					view {
						width: 144rpx;
						height: 48rpx;
						display: inline-block;
						background: #f1f1f1;
						border-radius: 10rpx;
						text-align: center;
						line-height: 48rpx;
						margin-left: 20rpx;
						font-size: 22rpx;
						font-family: PingFang SC;
						font-weight: bold;
						color: #262626;
					}
				}

				.center-bottom-view-content {
					width: 308rpx;
					height: 36rpx;
					font-size: 26rpx;
					font-family: PingFang SC;
					font-weight: bold;
					color: #262626;
					margin-left: 20rpx;
					overflow: hidden;
					white-space: nowrap;
					/*限制不换行*/
					text-overflow: ellipsis;
				}

				.center-bottom-view-bottom {
					width: 308rpx;
					height: 40rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-left: 20rpx;
					margin-top: 20rpx;

					.center-bottom-view-bottom-name {
						width: 220rpx;
						height: 40rpx;
						display: flex;
						// justify-content: space-between;
						align-items: center;

						image {
							width: 40rpx;
							height: 40rpx;
							border-radius: 120rpx;
						}

						view {
							width: 120rpx;
							font-size: 24rpx;
							font-family: PingFang SC;
							font-weight: 400;
							color: #8c8c8c;
							margin-left: 20rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
					}

					.center-bottom-view-bottom-kan {
						max-width: 93rpx;
						height: 40rpx;
						display: flex;
						// justify-content: space-between;
						align-items: center;

						image {
							width: 28rpx;
							height: 23rpx;
						}

						view {
							height: 34rpx;
							line-height: 34rpx;
							font-size: 24rpx;
							font-family: PingFang SC;
							font-weight: 600;
							color: #8c8c8c;
							margin-left: 20rpx;
						}
					}
				}
			}
		}
	}

	.center2 {
		width: 750rpx;
		// height: 1106rpx;
		background: #ffffff;
		overflow: hidden;
		margin-top: 25rpx;

		.center2-top {
			width: 300rpx;
			height: 60rpx;
			margin-top: 30rpx;
			margin-left: 20rpx;
			display: flex;
			align-items: center;

			image {
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
			}

			.center2-view {
				height: 60rpx;
				margin-left: 15rpx;

				.center2-view-text {
					font-size: 26rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #262626;
				}

				.center2-view-text2 {
					font-size: 20rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #ccc;
				}
			}
		}

		.center2-content {
			height: 40rpx;
			display: flex;
			align-items: center;
			margin-top: 30rpx;
			margin-left: 20rpx;

			.center2-content-view {
				width: 60rpx;
				height: 30rpx;
				text-align: center;
				font-size: 20rpx;
				font-family: PingFang SC;
				line-height: 30rpx;
				background-color: #f18642;
				color: #fff;
				border-radius: 5rpx;
			}

			.center2-content-view2 {
				height: 40rpx;
				line-height: 40rpx;
				font-size: 26rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #262626;
				margin-left: 10rpx;
			}
		}

		.center2-bigImg {
			width: 400rpx;
			height: 600rpx;
			margin-top: 40rpx;
			margin-left: 20rpx;

			image {
				width: 100%;
				height: 100%;
				border-radius: 10rpx;
			}
		}

		.center2-bq {
			height: 40rpx;
			margin-left: 20rpx;
			display: flex;
			margin-top: 30rpx;

			view {
				min-width: 120rpx;
				height: 50rpx;
				// text-align: center;
				// line-height: 40rpx;
				padding: 5rpx 15rpx;
				// padding-top: 5rpx;
				color: #7997c1;
				background-color: #edf5fd;
				border-radius: 20rpx;
				margin-left: 10rpx;

				&:nth-child(1) {
					margin-left: 0;
				}
			}
		}

		.center2-caozuo {
			height: 40rpx;
			display: flex;
			flex-direction: row-reverse;
			margin-top: 60rpx;

			.center2-caozuo-view {
				height: 36rpx;
				display: flex;
				margin-right: 60rpx;

				image {
					width: 36rpx;
					height: 36rpx;
				}

				view {
					height: 36rpx;
					font-size: 26rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #8c8c8c;
					margin-left: 10rpx;
				}
			}
		}

		.center2-pl {
			width: 710rpx;
			height: 78rpx;
			background: #fafafa;
			border-radius: 20rpx;
			margin-left: 20rpx;
			margin-top: 24rpx;
			border-radius: 10rpx;
			display: flex;
			align-items: center;
			margin-bottom: 30rpx;

			view {
				height: 36rpx;
				line-height: 36rpx;
				font-size: 26rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #262626;
				margin-left: 28rpx;
			}

			input {
				width: 540rpx;
				height: 36rpx;
				font-size: 26rpx;
				font-family: PingFang SC;
				font-weight: 400;
				color: #8c8c8c;
				margin-top: 5rpx;
			}
		}
	}
</style>

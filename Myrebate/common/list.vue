<template>
	<view>
		<view class="center" v-if="types==0">
			<view class="center-bottom" v-for="(item,index) of list" :key="index">
				<view class="center-bottom-view" @click="xiangqing">
					<image :src="wxapp_img.publish.jiu" class="center-bottom-view-img" mode="aspectFill"></image>
					<view class="center-bottom-view-biaoq">
						<view>
							#{{item.topic_name}}
						</view>
					</view>
					<view class="center-bottom-view-content">
						{{item.content}}
					</view>
					<view class="center-bottom-view-bottom">
						<view class="center-bottom-view-bottom-name">
							<image :src="item.avatar_url" mode=""></image>
							<view>
								{{item.nickname}}
							</view>
						</view>
						<view class="center-bottom-view-bottom-kan">
							<image :src="wxapp_img.publish.kan" mode=""></image>
							<view>
								122
							</view>
						</view>
					</view>
				</view>
				<view class="center-bottom-view">
					<image :src="wxapp_img.publish.jiu" class="center-bottom-view-img" mode="aspectFill"></image>
					<view class="center-bottom-view-biaoq">
						<view>
							#秋天第一杯
						</view>
					</view>
					<view class="center-bottom-view-content">
						秋天里的第一杯微醺，安123456
					</view>
					<view class="center-bottom-view-bottom">
						<view class="center-bottom-view-bottom-name">
							<image :src="wxapp_img.publish.jiu" mode=""></image>
							<view>
								CLJY0816
							</view>
						</view>
						<view class="center-bottom-view-bottom-kan">
							<image :src="wxapp_img.publish.jiu" mode=""></image>
							<view>
								122
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="center2" v-if="types==1">
			<view class="center2-top">
				<image :src="wxapp_img.publish.jiu" class="" mode=""></image>
				<view class="center2-view">
					<view class="center2-view-text">
						SDAW
					</view>
					<view class="center2-view-text2">
						632天前
					</view>
				</view>
			</view>
			<view class="center2-content">
				<view class="center2-content-view">
					推荐
				</view>
				<view class="center2-content-view2">
					帅不帅
				</view>
			</view>
			<view class="center2-bigImg">
				<image :src="wxapp_img.publish.jiu" mode="aspectFill"></image>
			</view>
			<view class="center2-bq">
				<view>
					#美食333333
				</view>
				<view>
					#美食5555
				</view>
				<view>
					#美食88
				</view>
				<view>
					#美食9
				</view>
			</view>
			<view class="center2-caozuo">
				<view class="center2-caozuo-view">
					<image :src="wxapp_img.wine.pinglun" mode=""></image>
					<view>
						8
					</view>
				</view>
				<view class="center2-caozuo-view">
					<image :src="wxapp_img.wine.dianzan" mode=""></image>
					<view>
						24
					</view>
				</view>
				<view class="center2-caozuo-view">
					<image :src="wxapp_img.wine.fenxiang" mode=""></image>
					<view>
						分享
					</view>
				</view>
			</view>
			<view class="center2-pl">
				<view>
					空123：
				</view>
				<input type="text" placeholder="加油哦~" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		props:{
			list:{
				type:Array
			},
			types:{
				type:Number
			}
		},
		methods:{
			xiangqing(){
				uni.navigateTo({
					url:"../topicDetails/topicDetails"
				})
			}
		}
	}
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
						background: #F1F1F1;
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
							font-size: 24rpx;
							font-family: PingFang SC;
							font-weight: 400;
							color: #8C8C8C;
							margin-left: 20rpx;
						}
					}

					.center-bottom-view-bottom-kan {
						width: 88rpx;
						height: 40rpx;
						display: flex;
						justify-content: space-between;
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
							color: #8C8C8C;
						}
					}
				}
			}
		}
	}
	.center2{
		width: 750rpx;
		// height: 1106rpx;
		background: #FFFFFF;
		overflow: hidden;
		margin-top: 25rpx;
		.center2-top{
			width: 300rpx;
			height: 60rpx;
			margin-top: 30rpx;
			margin-left: 20rpx;
			display: flex;
			align-items: center;
			image{
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
			}
			.center2-view{
				height: 60rpx;
				margin-left: 15rpx;
				.center2-view-text{
					font-size: 26rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #262626;
				}
				.center2-view-text2{
					font-size: 20rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #ccc;
				}
			}
		}
		.center2-content{
			height: 40rpx;
			display: flex;
			align-items: center;
			margin-top: 30rpx;
			margin-left: 20rpx;
			.center2-content-view{
				width: 60rpx;
				height: 30rpx;
				text-align: center;
				font-size: 20rpx;
				font-family: PingFang SC;
				line-height: 30rpx;
				background-color: #F18642;
				color: #fff;
				border-radius: 5rpx;
			}
			.center2-content-view2{
				height: 40rpx;
				line-height: 40rpx;
				font-size: 26rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #262626;
				margin-left: 10rpx;
			}
		}
		.center2-bigImg{
			width: 400rpx;
			height: 600rpx;
			margin-top: 40rpx;
			margin-left: 20rpx;
			image{
				width: 100%;
				height: 100%;
				border-radius: 10rpx;
			}
		}
		.center2-bq{
			height: 40rpx;
			margin-left: 20rpx;
			display: flex;
			margin-top: 30rpx;
			view{
				min-width: 120rpx;
				height: 50rpx;
				// text-align: center;
				// line-height: 40rpx;
				padding: 5rpx 15rpx;
				// padding-top: 5rpx;
				color: #7997C1;
				background-color: #EDF5FD;
				border-radius: 20rpx;
				margin-left: 10rpx;
				&:nth-child(1){
					margin-left: 0;
				}
			}
		}
		.center2-caozuo{
			height: 40rpx;
			display: flex;
			flex-direction: row-reverse;
			margin-top: 60rpx;
			.center2-caozuo-view{
				height: 36rpx;
				display: flex;
				margin-right: 60rpx;
				image{
					width: 36rpx;
					height: 36rpx;
				}
				view{
					height: 36rpx;
					font-size: 26rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #8C8C8C;
					margin-left: 10rpx;
				}
			}
		}
		.center2-pl{
			width: 710rpx;
			height: 78rpx;
			background: #FAFAFA;
			border-radius: 20rpx;
			margin-left: 20rpx;
			margin-top: 24rpx;
			border-radius: 10rpx;
			display: flex;
			align-items: center;
			margin-bottom: 30rpx;
			view{
				height: 36rpx;
				line-height: 36rpx;
				font-size: 26rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #262626;
				margin-left: 28rpx;
			}
			input{
				width: 540rpx;
				height: 36rpx;
				font-size: 26rpx;
				font-family: PingFang SC;
				font-weight: 400;
				color: #8C8C8C;
				margin-top: 5rpx;
			}
		}
	}
</style>

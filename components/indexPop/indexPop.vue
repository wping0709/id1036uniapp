<template>
	<view v-if="show">
		<view class="big">
			<view class="big-view">
				<view class="big-view-top">
					<view class="big-view-top-left" @click="jiuping">
						<view class="big-view-top-left-view" >
							<view class="big-view-top-left-view-text">
								{{huoqu.push_info.push_name}}
							</view>
							<view class="big-view-top-left-view-text2">
								{{huoqu.push_info.push_title}}
							</view>
						</view>
						<image :src="wxapp_img.publish.jiuping" mode=""></image>
					</view>
					<view class="big-view-top-right" @click="huati">
						<view class="big-view-top-right-view">
							<view class="big-view-top-right-view-text">
								发布动态
							</view>
							<view class="big-view-top-right-view-text2">
								分享我的美好生活
							</view>
						</view>
						<image :src="wxapp_img.publish.dongtai" mode=""></image>
					</view>
				</view>
				<view class="big-view-center" @click="shequn">
					<image :src="wxapp_img.publish.xianzhi" mode=""></image>
					<view class="big-view-center-view">
						<view class="big-view-center-view-text">
							发布闲置
						</view>
						<view class="big-view-center-view-text2">
							让闲置商品物尽所值，快速出售手中闲置
						</view>
					</view>
				</view>
				<view class="big-bottom">
					<image :src="wxapp_img.publish.guan" mode="" @click="guan"></image>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			show: {
				type: Boolean,
				default: false,
			}
		},
		name:"indexPop",
		data() {
			return {
				huoqu:{}
			};
		},
		mounted() {
			console.log(uni.getStorageSync('SHOP_CONFIG'),666)
			this.huoqu = uni.getStorageSync('SHOP_CONFIG')
		},
		methods:{
			jiuping(){
				console.log(555)
				uni.navigateTo({
					url:"/wine/release/release"
				})
			},
			huati(){
				uni.navigateTo({
					url:"/wine/dynamic/dynamic"
				})
			},
			guan(){
				this.$emit('jiaShow',false)
				this.$emit('update:show',false)
			},
			shequn(){
				uni.navigateTo({
					url:"/posts/posts/index"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.big{
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		z-index: 100000;
		background-color: rgba(0, 0, 0, .5);
		border-top: 1rpx solid #ccc;
		display: flex;
		align-items: bottom;
		justify-content: center;
		.big-view{
			width: 100%;
			height: 630rpx;
			background: #FFFFFF;
			opacity: 1;
			border-radius: 20rpx 20rpx 0px 0px;
			position: absolute;
			bottom: 0;
			.big-view-top{
				width: 702rpx;
				height: 168rpx;
				margin-top: 62rpx;
				margin-left: 24rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.big-view-top-left{
					width: 340rpx;
					height: 168rpx;
					background: #F7F9FA;
					border-radius: 20rpx;
					display: flex;
					align-items: center;
					justify-content: space-around;
					.big-view-top-left-view{
						height: 88rpx;
						.big-view-top-left-view-text{
							height: 44rpx;
							font-size: 32rpx;
							font-family: PingFang SC;
							font-weight: bold;
							color: #262626;
						}
						.big-view-top-left-view-text2{
							height: 34rpx;
							font-size: 24rpx;
							font-family: PingFang SC;
							font-weight: 400;
							color: #8C8C8C;
							margin-top: 10rpx;
						}
					}
					image{
						width: 69rpx;
						height: 68rpx;
					}
				}
				.big-view-top-right{
					width: 340rpx;
					height: 168rpx;
					background: #F7F9FA;
					border-radius: 20rpx;
					display: flex;
					align-items: center;
					justify-content: space-around;
					.big-view-top-right-view{
						height: 88rpx;
						.big-view-top-right-view-text{
							height: 44rpx;
							font-size: 32rpx;
							font-family: PingFang SC;
							font-weight: bold;
							color: #262626;
						}
						.big-view-top-right-view-text2{
							height: 34rpx;
							font-size: 24rpx;
							font-family: PingFang SC;
							font-weight: 400;
							color: #8C8C8C;
							margin-top: 10rpx;
						}
					}
					image{
						width: 69rpx;
						height: 68rpx;
					}
				}
			}
			.big-view-center{
				width: 701rpx;
				height: 136rpx;
				background: #F7F9FA;
				border-radius: 20rpx;
				margin-left: 24rpx;
				margin-top: 20rpx;
				display: flex;
				align-items: center;
				image{
					width: 68rpx;
					height: 62rpx;
					margin-left: 34rpx;
				}
				.big-view-center-view{
					height: 88rpx;
					margin-left: 30rpx;
					.big-view-center-view-text{
						height: 44rpx;
						font-size: 32rpx;
						font-family: PingFang SC;
						font-weight: bold;
						color: #262626;
					}
					.big-view-center-view-text2{
						height: 34rpx;
						font-size: 24rpx;
						font-family: PingFang SC;
						font-weight: 400;
						color: #8C8C8C;
						margin-top: 10rpx;
					}
				}
			}
			.big-bottom{
				width: 100%;
				height: 88rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-top: 60rpx;
				image{
					width: 88rpx;
					height: 88rpx;
					border-radius: 120rpx;
				}
			}
		}
		
	}
</style>

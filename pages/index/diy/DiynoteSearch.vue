<template>
	<view>
		<!-- <view class="top" :style="'padding-top:' + titleHeight + 'px'">
			<view class="top-left" @click="fanhui">
			</view>
			<view class="top-center">
				微淘
			</view>
			<view class="top-right">
		
			</view>
		</view> -->
		<view class="sousuo" :style="{'background':param.backgroundColorW,'borderRadius':param.borderRadius,'color':param.color}" @click="quanbu">
			<view class="sousuo-view"  @click="quanbu" :style="{'background':param.backgroundColor}">
				<span class="iconfont" >&#xe7b4;</span>
				<view :style="{'text-align':param.textPosition,}">
					{{param.text}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// import list from "@/wine/comme/list.vue"
	export default {
		data() {
			return {
				titleHeight: 0
			};
		},
		props:{
			param:{
				type:Object
			}
		},
		onLoad() {
			this.getHeight()
		},
		methods: {
			getHeight() {
				let res = wx.getMenuButtonBoundingClientRect();
				this.titleHeight = res.top + 3;
			},
			quanbu(){
				uni.navigateTo({
					url:"../../wine/topic/topic?id="+2
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.top {
		// background-color: red;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		// position: fixed;
		// top: 0;
		// z-index: 2;
		background-color: #FFCC36;
		.top-left {
			width: 64rpx;
			height: 64rpx;
			border: 2rpx solid #EAEAEA;
			opacity: 0.2;
			border-radius: 120rpx;
			margin-left: 40rpx;
			text-align: center;
			line-height: 64rpx;
	
			.iconfont {
				width: 16rpx;
				height: 30rpx;
				color: #FFFFFF;
			}
		}
	
		.top-center {
			font-size: 36rpx;
			font-family: PingFang SC;
			font-weight: bold;
		}
	
		.top-right {
			width: 124rpx;
	
		}
	}
	
	.sousuo {
		width: 750rpx;
		height: 84rpx;
		// background: #FFCC36;
		display: flex;
		align-items: center;
		justify-content: center;
	
		.sousuo-view {
			width: 690rpx;
			height: 64rpx;
			// background: #FFFFFF;
			border-radius: 60rpx;
			display: flex;
			align-items: center;
	
			.iconfont {
				color: #9B9B9B;
				margin-left: 24rpx;
			}
	
			view {
				width: 632rpx;
				height: 36rpx;
				// margin-left: 10rpx;
			}
		}
	}
</style>
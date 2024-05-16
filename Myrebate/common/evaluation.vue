<template>
	<view>
		<view class="pj">
			<view class="pj_content">
				<view class="pj_conetnt_top">
					<view>
						发布了 <text>酒评</text>
					</view>
					<view>
						刚刚
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				
			}
		}
	}
</script>

<style scoped lang="scss">
	.pj{
		width: 100%;
		height: 300rpx;
		margin-top: 20rpx;
		background-color: #FFFFFF;
		.pj_content{
			width: 702rpx;
			height: 392rpx;
			border-bottom: 1rpx solid #F8F8F8;
			background: #FFFFFF;
			.pj_conetnt_top{
				height: 36rpx;
				margin-top: 18rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				view{
					font-size: 26rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #8C8C8C;
					text{
						font-size: 26rpx;
						font-family: PingFang SC;
						font-weight: 400;
						color: #262626;
					}
				}
			}
		}
	}
</style>

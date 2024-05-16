<template>
	<view>
		<view class="top">
			<view class="top-touxiang">
				<!--  @click="chakan(topic_info.user_id || topic_info.from_user)" -->
				<image :src="topic_info.avatar_url" mode=""></image>
				<view>
					{{topic_info.nickname || topic_info.question_name || topic_info.answer_name || ""}}
				</view>
			</view>
			<view :class="topic_info.is_focus == 0?'top-guanzhu':'top-guanzhu2'" @click="guanzhu()">
				{{topic_info.is_focus == 0?'关注':'已关注'}}
			</view>
		</view>
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" class="swiper" v-if="topic_info.pic_url.length != 0 && topic_info.pic_url">
			<swiper-item class="swiper-item" v-for="(item,index) of topic_info.pic_url" :key="index">
				<image :src="item" mode="aspectFit"></image>
			</swiper-item>
		</swiper>
		<view class="evaluation">
			<!-- <view class="title">
				我又发现了一瓶宝藏红酒
			</view> -->
			<view class="tikeText">
				<!-- <text v-if="topic_info.is_self">我的回答:</text>
				<text v-else="topic_info.is_self">{{topic_info.nickname || topic_info.question_name || topic_info.answer_name || ""}}的回答:</text> -->
				<text>
					{{topic_info.content}}
				</text>
			</view>

			
			<view class="time">
				{{topic_info.add_time || topic_info.addtimes || topic_info.addtime || ""}}
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				time:null
			}
		},
		props:{
			topic_info:{
				type:Object
			},
			plType:{
				type:Number
			}
		},
		methods:{
			chakan(id){
				uni.navigateTo({
					url:`../../Myrebate/index/index?id="${id}"`
				})
			},
			guanzhu(){
				this.$emit('gzDian',this.topic_info.is_focus,this.topic_info.from_user)
				// console.log(this.plType,"this.plTypethis.plTypethis.plTypethis.plType")
				// if(this.plType == undefined){
				// 	this.$emit('gzDian',this.topic_info.user_id,this.topic_info.is_focus)
				// }else{
				// 	this.$emit('gzDian',this.topic_info.from_user,this.topic_info.is_focus)
				// }
			}
		}
	}
</script>

<style scoped lang="scss">
	.top {
		width: 694rpx;
		height: 80rpx;
		margin-left: 32rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 20rpx;
	
		.top-touxiang {
			// width: 300rpx;
			height: 80rpx;
			display: flex;
			align-items: center;
	
			image {
				width: 80rpx;
				height: 80rpx;
				background: #F3F3F3;
				border-radius: 120rpx;
			}
	
			view {
				height: 42rpx;
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #262626;
				margin-left: 15rpx;
			}
		}
	
		.top-guanzhu {
			width: 120rpx;
			height: 54rpx;
			background: #FFC91F;
			border-radius: 120rpx;
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: bold;
			line-height: 54rpx;
			text-align: center;
			color: #262626;
		}
		.top-guanzhu2{
			width: 120rpx;
			height: 54rpx;
			background: #ccc;
			border-radius: 120rpx;
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: bold;
			line-height: 54rpx;
			text-align: center;
			color: #262626;
		}
	}
	.imgs{
		width: 694rpx;
		margin-left: 32rpx;
		image{
			width: 100%;
			height: 400rpx;
		}
	}
	.swiper {
		width: 750rpx;
		height: 1000rpx;
		margin-top: 20rpx;
	
		/deep/ .uni-swiper-dot {
			// 指示点元素默认样式
			width: 12rpx !important;
			height: 12rpx !important;
			background: #fff !important;
			border-radius: 50%;
	
		}
	
		/deep/ .uni-swiper-dot-active {
			// 指示点元素激活（当前选中）状态样式
			width: 12rpx !important;
			height: 12rpx !important;
			background-color: yellow !important;
			// border-radius: 50%  !important;
		}
	
		.swiper-item {
			width: 100%;
			height: 100%;
	
			image {
				width: 100%;
				height: 100%;
			}
	
		}
	}
	
	.evaluation {
		width: 672rpx;
		margin-top: 20rpx;
		margin-left: 30rpx;
		border-bottom: 1rpx solid #F2F2F2;
		.title {
			height: 44rpx;
			font-size: 32rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #262626;
			margin-top: 20rpx;
		}
		.tikeText {
			width: 672rpx;
			margin-top: 20rpx;
			display: flex;
			// text{
			// 	font-weight: 600;
			// }
		}
		.time{
			height: 32rpx;
			font-size: 22rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: #8C8C8C;
			margin-top: 20rpx;
			margin-bottom: 20rpx;
		}
	}
</style>

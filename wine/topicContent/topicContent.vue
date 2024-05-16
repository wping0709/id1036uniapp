<template>
	<view>
		<view class="top" :style="'padding-top:' + titleHeight + 'px;'">
			<view class="top-left" @click="fanhui">
				<span class="iconfont">&#xe8c6;</span>
			</view>
		</view>
		<view class="topic-content" :style="'background-image: url('+topic_info.pic_url+');'">
			<view class="topic-content-name">
				{{topic_info.topic_name || ""}}
				<view>
					{{topic_info.tag || ""}}
				</view>
			</view>
			<view class="topic-content-text">
				{{topic_info.dynamic_num || ""}}条动态 · {{topic_info.browse_num || ""}}次浏览
			</view>
			<view class="topic-content-text2">
				{{topic_info.title || ""}}
			</view>
		</view>
		<view class="topic-xuanze">
			<view :class="show==0?'topic-xuanze-view':'topic-xuanze-view2'" @click="qiehuan(0)">
				最热
				<view>
					
				</view>
			</view>
			<view :class="show==1?'topic-xuanze-view':'topic-xuanze-view2'" @click="qiehuan(1)">
				最新
				<view>
					
				</view>
			</view>
		</view>
		<list :topicList = "lists" :ids = "id"></list>
		<view class="chengkai">
			
		</view>
		<view class="bottom">
			<view @click="canyu">
				参与话题
			</view>
		</view>
	</view>
</template>

<script>
	import list from "@/wine/comme/list.vue"
	import wine from "@/api/wine.js"
	import share from '@/mixins/share'
	export default {
		mixins: [share],
		data() {
			return {
				// titleHeight:0,
				show:0,
				id:null,
				lists:[],
				topic_info:{}
			};
		},
		computed:{
			shareData() {
				return {
					path: `/wine/topicContent/topicContent${uni.$u.queryParams({
						id: this.id,
						user_id: this.$store.getters['user/userInfo'].id || '',
            store_id: this.$store.getters['currentStore'].id || '',
            // #ifdef APP-PLUS
            _platform: 'app'
						// #endif
					})}`
				}
			},
			titleHeight() {
				let sys = this.systemInfo
				return sys.safeArea.top
			}
		},
		onLoad(e) {
			this.id = e.id
			// this.getHeight()
			this.$nextTick(item=>{
				this.detileS(this.show)
			})
			
		},
		components:{
			list
		},
		methods:{
			canyu(){
				uni.navigateTo({
					url:"../dynamic/dynamic"
				})
			},
			detileS(e){
				let data = {
					topic_id:this.id,
					type:e
				}
				wine.getTopicDetail(data)
				.then(res=>{
					console.log(res,44444444444)
					if(res.code == 0){
						this.topic_info = res.topic_info
						if(res.data == null){
							uni.showToast({
								title:"暂无更多信息",
								icon:"none"
							})
						}else{
							this.lists = this.lists.concat(res.data)
							console.log(this.lists)
						}
					}
				})
			},
			fanhui(){
				uni.navigateBack({
					delta:-1
				})
			},
			// getHeight() {
			// 	let res = wx.getMenuButtonBoundingClientRect();
			// 	this.titleHeight = res.top + 3;
			// },
			qiehuan(e){
				this.show = e
				this.lists = []
				this.detileS(e)
			}
		}
	}
</script>
<style>
	page {
		width: 100%;
		height: 100%;
		background-color: #F6F6F6;
	}
</style>
<style lang="scss" scoped>
	.top {
		// background-color: red;
		display: flex;
		align-items: center;
		position: fixed;
		top: 0;
		z-index: 2;
		
		// justify-content: space-around;
		.top-left {
			width: 64rpx;
			height: 64rpx;
			background: #000000;
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
	}
	.topic-content{
		width: 750rpx;
		height: 563rpx;
		background-size: 100% 100%;
		overflow: hidden;
		.topic-content-name{
			height: 50rpx;
			font-size: 36rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #FFFFFF;
			display: flex;
			margin-top: 270rpx;
			align-items: center;
			margin-left: 40rpx;
			view{
				height: 30rpx;
				background: #0798E9;
				font-size: 20rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #FFFFFF;
				border-radius: 6rpx;
				margin-left: 8rpx;
				text-align: center;
				padding-left: 10rpx;
				padding-right: 10rpx;
			}
		}
		.topic-content-text{
			height: 36rpx;
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: #FFFFFF;
			margin-left: 40rpx;
			margin-top: 20rpx;
		}
		.topic-content-text2{
			height: 42rpx;
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: #FFFFFF;
			margin-left: 40rpx;
			margin-top: 20rpx;
		}
	}
	.topic-xuanze{
		width: 750rpx;
		height: 90rpx;
		background: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: space-around;
		.topic-xuanze-view{
			width: 56rpx;
			height: 48rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #FFCB34;
			view{
				width: 50rpx;
				height: 6rpx;
				background: #FFCB34;
			}
		}
		.topic-xuanze-view2{
			width: 56rpx;
			height: 40rpx;
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: #262626;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			view{
				
			}
		}
	}
	.chengkai{
		width: 100%;
		height: 220rpx;
	}
	.bottom{
		width: 100%;
		height: 300rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		bottom: 0;
		view{
			width: 368rpx;
			height: 80rpx;
			background: linear-gradient(270deg, #FFCB34 0%, #F8DF51 100%);
			box-shadow: 0px 6rpx 12rpx rgba(193,156,38,0.6);
			border-radius: 120rpx;
			text-align: center;
			line-height: 80rpx;
			font-size: 32rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #353430;
		}
	}
</style>

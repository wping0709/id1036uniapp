<template>
	<view>
		<view class="big">
			<view class="top">
				<view class="top-left">
					<span class="iconfont">&#xe7b4;</span>
					<input type="text" v-model="tiwen" @confirm="sousuo()" placeholder="请输入" />
				</view>
				<view class="top-right" @click="tiwens()">
					提问
				</view>
			</view>
			<view class="shaixuan">
				<view class="shaixuan-left">
					<view :class="show==0?'shaixuan-left-view':'shaixuan-left-view2'" @click="qiehuan(0)">
						热门回答
					</view>
					<view :class="show==1?'shaixuan-left-view':'shaixuan-left-view2'" @click="qiehuan(1)">
						等待回答
					</view>
				</view>
				<view class="shaixuan-right" @click="childShows">
					<view>
						{{guigeName}}
					</view>
					<image :src="wxapp_img.publish.shaixuan" mode=""></image>
				</view>
			</view> 
			<template v-if="show==0">
				<view class="wdList"  v-for="(item,index) of answerList" :key="index" >
					<view class="wdList-view">
						<view class="wdList-view-weiguan">
							<view class="wdList-view-weiguan-imgs">
								<image :src="items.avatar_url" mode="" v-for="(items,indexs) of item.see_list" :key="indexs"></image>
							</view>
							<view class="wdList-view-weiguan-text" :style="item.see_list.length <=0 ?'margin-left:0rpx;':''">
								{{ item.see_count || 0 }}人正在围观
							</view>
						</view>
						<view class="wdList-view-content">
							<view class="wdList-view-content-title" @click="tiaozhuan(item.id,item.user_id)">
								<span>{{item.cat_name}}</span>{{item.question}}
							</view>
							<view class="wdList-view-content-text" @click="tiaozhuan(item.id,item.user_id)">
								{{item.content}}
							</view>
							<view class="wdList-view-bottom">
								<view class="wdList-view-bottom-left" v-show="current_answer">
									<view class="wdList-view-bottom-left-text">
										{{item.current_answer}}
									</view>
									<view class="wdList-view-bottom-left-text2">
										回答了问题
									</view>
								</view>
								<view class="wdList-view-bottom-right" @click="popDian(item.id)">
									...
								</view>
							</view>
						</view>

					</view>
				</view>
			</template>
			<view class="wdList" v-if="show==1">
				<view class="wdList-view" v-for="(item,index) of awaitList" :key="index">
					<view class="wdList-view-content">
						<view class="wdList-view-content-title" @click="tiaozhuan(item.id,item.user_id)">
							<span>{{item.cat_name}}</span>{{item.question}}
						</view>
						<view class="wdList-view-bottom">
							<view class="wdList-view-bottom-left">
								<view class="wdList-view-bottom-left-text2" v-if="item.is_ok == 0">
									问题来自：{{item.current_question}}
								</view>
								<view class="wdList-view-bottom-left-text2" v-if="item.is_ok == 1">
									回答来自：{{item.current_answer}}
								</view>
							</view>
							<view class="wdList-view-bottom-right2" @click="wenda(item.id)">
								<image :src="wxapp_img.publish.dianji2" mode=""></image>
								<view>
									写回答
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<pop v-if="popShow" @ShutDown = 'childShow'></pop>
		<screeningPop v-if="screeningShow" :show="1" :guigeList = "guigeList"  @ShutDown = 'childShow2'></screeningPop>
	</view>
</template>

<script>
	import pop from "@/wine/comme/pop.vue"
	import wine from "@/api/wine.js"
	import screeningPop from "@/wine/comme/screeningPop.vue"
	export default {
		data() {
			return {
				show: 0,
				tiwen:"",
				popShow:false,
				screeningShow:false,
				answerList:[],
				awaitList:[],
				guigeList:[],
				guigeName:"全部",
				id:-1,
				answer_id:null
			};
		},
		components:{
			pop,
			screeningPop
		},
		onShow() {
			this.messageList(this.show,-1)
			this.guige()
			console.log(this.wxapp_img.publish,"wxapp_img.publishwxapp_img.publishwxapp_img.publish")
		},
		onShareAppMessage(res) {
		    if (res.from === 'button') {// 来自页面内分享按钮
		      console.log(res.target)
		    }
		    return {
		      title: '问答专区',
		      path: '/wine/TheZone/TheZone'
		    }
		  },
		methods: {
			tiwens(){
				uni.navigateTo({
					url:`../questions/questions?show=${0}`
				})
			},
			sousuo(){
				this.messageList(this.show,this.id)
			},
			// 获取详情
			tiaozhuan(e,a){
				uni.navigateTo({
					url:`../pinglunDetails/pinglunDetails?id=${e}&user_id=${a}`
				})
				// if(this.show == 1){
				// 	uni.navigateTo({
				// 		url:`../pinglunDetails/pinglunDetails?id=${e}&user_id=${a}`
				// 	})
				// }else{
				// 	uni.navigateTo({
				// 		url:`../wdDetils/wdDetils?article_id=${e}&id=${a}`
				// 	})
				// }
			},
			shareS(){
				let data = {
					question_id:this.answer_id,
					type:1
				}
				wine.answerAnswerShare(data)
				.then(res=>{
					console.log(res)
					if(res.code==0){
						// uni.$emit('state',true)
					}else{
						uni.showToast({
							title:"分享失败",
							icon:"none"
						})
					}
				})
			},
			// 请求规格
			guige(){
				wine.answerGetCatList()
				.then(res=>{
					console.log(res)
					if(res.code == 0){
						this.guigeList = res.data
					}
				})
			},
			// 请求问题和回答的数组
			messageList(e,a){
				this.answerList = []
				this.awaitList = []
				if(this.show == 0){
					let data = {
						question_name:this.tiwen,
						type:e,
						cat_id:a
					}
					wine.answerGetAnswerList(data)
					.then(res=>{
						console.log(res)
						if(res.data.length > 0 ){
							this.answerList = this.answerList.concat(res.data)
							console.log(this.answerList)
						}else{
							uni.showToast({
								title:"暂无更多消息",
								icon:"none"
							})
						}
					})
				}else{
					let data = {
						question_name:this.tiwen,
						type:e,
						cat_id:a
					}
					wine.answerGetAnswerList(data)
					.then(res=>{
						console.log(res)
						if(res.data.length > 0 ){
							this.awaitList = this.awaitList.concat(res.data)
							console.log(this.awaitList)
						}else{
							uni.showToast({
								title:"暂无更多消息",
								icon:"none"
							})
						}
					})
				}
				
			},
			// 切换状态
			qiehuan(e) {
				this.show = e
				if(this.id == -1){
					this.messageList(this.show,-1)
				}else{
					this.messageList(this.show,this.id)
				}
			},
			// 分享功能的显示隐藏
			popDian(e){
				this.popShow = !this.popShow
				this.answer_id = e
			},
			wenda(e){
				console.log(1)
				uni.navigateTo({
					url:`../questions/questions?show=${1}&id=${e}`
				})
			},
			// 子组件触发父组件（分享）
			childShow(e,a){
				console.log(e,a,"aaaaaa")
				if(a == undefined){
					this.popShow = e
				}else{
					this.popShow = e
					this.shareS()
				}
			},
			// 子组件触发父组件  开关
			childShows(e){
				this.screeningShow = e
			},
			// 子组件触发父组件 (规格)请求数据
			childShow2(e,a,f){
				if(a == undefined || f == undefined){
					this.screeningShow = e
				}else{
					console.log(e,a,f)
					this.messageList(this.show,a)
					this.id = a
					this.guigeName = f
					this.screeningShow = e
				}
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
	.big {
		background-color: #fff;
		overflow: hidden;
		.top {
			width: 678rpx;
			height: 64rpx;
			margin-left: 36rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 20rpx;

			.top-left {
				width: 546rpx;
				height: 64rpx;
				background: #F2F2F2;
				border-radius: 120rpx;
				display: flex;
				align-items: center;

				.iconfont {
					color: #9B9B9B;
					margin-left: 24rpx;
				}

				input {
					width: 632rpx;
					height: 36rpx;
					margin-left: 10rpx;
				}
			}

			.top-right {
				width: 108rpx;
				height: 64rpx;
				background: #FFC91F;
				border-radius: 10rpx;
				font-size: 26rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #262626;
				text-align: center;
				line-height: 64rpx;
			}
		}

		.shaixuan {
			width: 678rpx;
			height: 40rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-left: 36rpx;
			margin-top: 38rpx;

			.shaixuan-left {
				width: 284rpx;
				height: 40rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.shaixuan-left-view {
					height: 40rpx;
					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: bold;
					color: #262626;
				}

				.shaixuan-left-view2 {
					height: 40rpx;
					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #262626;
				}
			}

			.shaixuan-right {
				min-width: 100rpx;
				height: 40rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				view {
					height: 40rpx;
					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #262626;
				}

				image {
					width: 28rpx;
					height: 28rpx;
				}
			}
		}

		.wdList {
			width: 702rpx;
			margin-left: 24rpx;

			.wdList-view {
				border-bottom: 1rpx solid #F8F8F8;

				.wdList-view-weiguan {
					height: 38rpx;
					display: flex;
					align-items: center;
					margin-top: 48rpx;

					.wdList-view-weiguan-imgs {
						height: 38rpx;
						flex: 1;
						width: 0;
						white-space: nowrap;
						overflow-x: auto;

						image {
							display: inline-block;
							width: 38rpx;
							height: 38rpx;

							margin-left: -10rpx;
							border-radius: 50%;

							&:nth-child(1) {
								margin-left: 10rpx;
							}
						}
					}

					.wdList-view-weiguan-text {
						height: 36rpx;
						font-size: 26rpx;
						font-family: PingFang SC;
						font-weight: 400;
						color: #8C8C8C;
						margin-left: 30rpx;
					}
				}

				.wdList-view-content {

					// height: 326rpx;
					.wdList-view-content-title {
						width: 676rpx;
						font-size: 30rpx;
						font-family: PingFang SC;
						font-weight: bold;
						color: #262626;
						margin-top: 48rpx;

						span {
							width: 88rpx;
							height: 12rpx;
							text-align: center;
							background: #FFC91F;
							font-size: 22rpx;
							font-family: PingFang SC;
							font-weight: bold;
							color: #262626;
							padding: 5rpx;
							margin-right: 5rpx;
							border-radius: 10rpx;
						}
					}

					.wdList-view-content-text {
						font-size: 26rpx;
						font-family: PingFang SC;
						font-weight: 400;
						color: #8C8C8C;
						margin-top: 12rpx;
					}

					.wdList-view-bottom {
						height: 36rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;
						margin-top: 26rpx;
						margin-bottom: 30rpx;
						
						.wdList-view-bottom-left {
							display: flex;
							align-items: center;

							.wdList-view-bottom-left-text {
								font-size: 26rpx;
								font-family: PingFang SC;
								font-weight: bold;
								color: #262626;
							}

							.wdList-view-bottom-left-text2 {
								font-size: 26rpx;
								font-family: PingFang SC;
								font-weight: 400;
								color: #8C8C8C;
								// margin-left: 10rpx;
							}
						}

						.wdList-view-bottom-right {
							font-size: 26rpx;
							font-family: PingFang SC;
							font-weight: 400;
							color: #8C8C8C;
						}
						.wdList-view-bottom-right2 {
							width: 120rpx;
							display: flex;
							justify-content: space-between;
							align-items: center;
							font-size: 26rpx;
							font-family: PingFang SC;
							font-weight: 400;
							color: #8C8C8C;
							image{
								width: 24rpx;
								height: 24rpx;
							}
							view{
								height: 36rpx;
								font-size: 26rpx;
								font-family: PingFang SC;
								font-weight: bold;
								color: #262626;
							}
						}
					}
				}

			}
		}
	}
</style>

<template>
	<view>
		<!-- show 代表当前点的模块 0动态  1酒评  2问答  3喜欢    -->
		<view class="pj" :style="show==2?'margin-top:0rpx;':''" v-if="show == 1 || show==2 || show==3">
			<view class="pj_content" v-for="(item,index) of list" :key="index" >
				<view class="pj_conetnt_top">
					<!-- (1问题，2回答，3酒评，4评论，5动态) -->
					<view>
						{{like}}
						<text v-if="item.type==1">问题</text>
						<text v-if="item.type==2 && item.style==0">回答</text>
						<text v-if="item.type==2 && item.style==1">回答评论</text>
						<text v-if="item.type==3">酒评</text>
						<text v-if="item.type==4">评论</text>
						<text v-if="item.type==5 && item.style==0">动态</text>
						<text v-if="item.type==5 && item.style==1">动态评论</text>
						<!-- <uni-rate v-if="show==1" size="18" class="rate" :readonly="true" :value="item.score" /> -->
					</view>
					<view>
						{{item.addtime || item.add_time}}
					</view>
				</view>
				<view class="text" v-if="show==1">
					{{item.content}}
				</view>
				<view class="pj_conetnt_center" @click="liquor(item.type,item.id,item.qid || item.question_id,item.user_id,item.review_id,item.answer_id,item.note_id,item.article_id)">
					<image
						:src="item.cover_pic || item.pic_url"
						mode=""></image>

					<view class="pj_conetnt_center_view">
						<view class="title">
							{{item.goods_name || item.question || item.name}}
						</view>

						<view class="view_bottom">
							<view>
								{{item.want_count || item.answer_count || item.review_count }}
							</view>
							<text v-if="show==1">想买</text>
							<text v-if="show==2">回答</text>
							<text v-if="show==3">评论</text>
							<text>·</text>
							<view>
								{{item.like_count || item.eat_count}}
							</view>
							<text v-if="show==1">买过</text>
							<text v-if="show==2">喜欢</text>
							<text v-if="show==3">喜欢</text>
						</view>
					</view>
				</view>
			</view>
			
		</view>
		<view class="chengkai">
			
		</view>
		<!-- <evaluation></evaluation> -->
	</view>
</template>

<script>
	import wine from "@/api/wine.js"
	// import uniRate from "@/wine/comme/uni-rate.vue"
	export default {
		data() {
			return {
				titleHeight: 0,
				imgs: 'https://img1.baidu.com/it/u=3384796346,381674655&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500',
				show: 3,
				questionShow: 0,
				texts: "提问",
				like: "喜欢了",
				top_show: null,
				heights:"500rpx",
				id:'',
				page:1,
				focusData:null,
				list:[],
			};
		},
		// comments: {
		// 	list,
		// 	evaluation,
		// },
		// components:{
		// 	uniRate
		// },
		onShow() {
			this.page = 1
			this.list = []
			this.huoqu()
		},
		onReachBottom() {
			this.page++
			this.huoqu()
		},
		methods: {
			liquor(t,j,e,a,f,answer,noteId,article){
				console.log(t,j,e,a,f,answer,article)
				if(this.show==0){
					uni.navigateTo({
						url:`../../wine/topicDetails/topicDetails?id=${a}&article_id=${j}`
					})
				}else if(this.show==1){
					uni.navigateTo({
						url:`../../wine/topicDetails/topicDetails?id=${a}&article_id=${j}&default_show=${3}`
					})
				}else if(this.show==2){
					if(this.questionShow == 0){
						uni.navigateTo({
							url:`../../wine/pinglunDetails/pinglunDetails?id=${e}&user_id=${a}`
						})
					}else if(this.questionShow == 1){
						uni.navigateTo({
							url:`../../wine/wdDetils/wdDetils?id=${a}&article_id=${e}&answer_id=${j}`
						})
					}
				}else if(this.show==3){
					console.log(566)
					this.liquorTwo(t,j,e,a,f,answer,noteId,article)
					// uni.navigateTo({
					// 	url:`../../wine/wdDetils/wdDetils?id=${a}&article_id=${f}`
					// })
				}
			},
			liquorTwo(t,j,e,a,f,answer,noteId,article){
				// t type值(1问题，2回答，3酒评，4评论，5动态)
				console.log(t,j,e,a,f,answer,noteId,article)
				if(t==2){
						uni.navigateTo({
							url:`../../wine/wdDetils/wdDetils?id=${a}&article_id=${e}&answer_id=${answer}`
						})
				}else if(t==1){
					uni.navigateTo({
						url:`../../wine/pinglunDetails/pinglunDetails?id=${e}&user_id=${a}`
					})
				}else if(t == 3){
						uni.navigateTo({
							url:`../../wine/topicDetails/topicDetails?id=${a}&article_id=${noteId}&default_show=${3}`
						})
				}else if(t == 4){
					uni.navigateTo({
						url:`../../wine/topicDetails/topicDetails?id=${a}&article_id=${j}`
					})
				}
				else if(t==5){
					uni.navigateTo({
						url:`../../wine/topicDetails/topicDetails?id=${a}&article_id=${article}`
					})
				}
			},
			huoqu(){
				let data = {
					page:this.page,
					type:this.show,
					user_id:this.id
				}
				wine.userMyPush(data,1)
				.then(res=>{
					console.log(res)
					this.focusData = res
					if(res.data == null || res.data.list.length == 0){
						uni.showToast({
							title:"暂无更多数据",
							icon:'none'
						})
					}else{
						this.list = []
						this.list = this.list.concat(res.data.list)
						this.focusData = res
						// this.focusData.data.list = list
					}
				})
			},
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
<style scoped lang="scss">
	.top {
		width: 100%;
		height: 422rpx;
		display: flex;
		justify-content: space-between;
		z-index: 2;
		background-repeat: no-repeat;
		// background-size: cover;
		overflow: hidden;
		filter: blur(3rpx);

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

		.top-center {
			height: 63rpx;
			line-height: 63rpx;
			font-size: 36rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: rgba(255, 255, 255, 0.94);
		}

		.top-right {
			width: 130rpx;
			height: 50rpx;
		}
	}
	.tops {
		width: 100%;
		height: 36rpx;
		display: flex;
		justify-content: space-between;
		position: fixed;
		// top: 0;
		.tops-left {
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
	
		.tops-center {
			height: 63rpx;
			line-height: 63rpx;
			font-size: 36rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: rgba(255, 255, 255, 0.94);
		}
	
		.tops-right {
			width: 130rpx;
			height: 50rpx;
		}
	}

	.user-Img {
		width: 670rpx;
		height: 84rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: absolute;
		top: 190rpx;
		left: 36rpx;

		// background-color: red;
		.user-Img-left {
			height: 84rpx;
			display: flex;
			align-items: center;

			image {
				width: 84rpx;
				height: 84rpx;
				border-radius: 120rpx;
			}

			view {
				height: 50rpx;
				font-size: 36rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #FFFFFF;
				margin-left: 20rpx;
			}
		}

		.user-Img-right {
			width: 120rpx;
			height: 56rpx;
			text-align: center;
			line-height: 56rpx;
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #262626;
			background: #FFC91F;
			border-radius: 120rpx;
		}
		.user-Img-right2{
			width: 120rpx;
			height: 56rpx;
			text-align: center;
			line-height: 56rpx;
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #262626;
			background: #ccc;
			border-radius: 120rpx;
		}

	}

	.myContent {
		width: 100%;
		height: 88rpx;
		display: flex;
		// align-items: center;
		justify-content: space-around;
		position: absolute;
		top: 300rpx;

		// left: 36rpx;
		.myContent-view {
			width: 96rpx;
			// height: 34rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;

			.fabuNumber {
				height: 44rpx;
				font-size: 32rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: rgba(255, 255, 255, 0.94);
				text-align: center;
			}

			.fabuText {
				height: 34rpx;
				font-size: 24rpx;
				font-family: PingFang SC;
				font-weight: 400;
				color: rgba(255, 255, 255, 0.94);
				text-align: center;
			}
		}

	}

	.myredate_type {
		width: 750rpx;
		height: 90rpx;
		background: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: space-around;

		.myredate_type_view {
			height: 48rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;

			view {
				height: 40rpx;
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #FFCB34;
			}

			text {
				width: 50rpx;
				height: 6rpx;
				display: block;
				background: #FFCB34;
			}
		}

		.myredate_type_view2 {
			height: 48rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;

			view {
				height: 40rpx;
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #262626;
			}

			text {
				width: 50rpx;
				height: 6rpx;
				background: #fff;
				// display: block;
			}
		}
	}
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
	.question {
		width: 702rpx;
		height: 88rpx;
		display: flex;
		align-items: center;
		margin-left: 24rpx;

		.question_view {
			width: 120rpx;
			height: 56rpx;
			text-align: center;
			line-height: 56rpx;
			background: #E4E4E4;
			border-radius: 28rpx;
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #262626;
		}

		.question_view2 {
			width: 120rpx;
			height: 56rpx;
			text-align: center;
			line-height: 56rpx;
			border-radius: 28rpx;
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #262626;
		}
	}

	.pj {
		width: 100%;
		// height: 300rpx;
		margin-top: 20rpx;
		background-color: #FFFFFF;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.pj_content {
			width: 702rpx;
			// height: 392rpx;
			border-bottom: 1rpx solid #F8F8F8;

			// background: #FFFFFF;
			.pj_conetnt_top {
				height: 36rpx;
				margin-top: 18rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				// margin-left: 24rpx;
				view {
					font-size: 26rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #8C8C8C;
					display: flex;

					text {
						font-size: 26rpx;
						font-family: PingFang SC;
						font-weight: 600;
						color: #262626;
						margin-left: 10rpx;
					}

					.rate {
						margin-left: 15rpx;
					}
				}
			}

			.text {
				// height: 36rpx;
				font-size: 26rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #262626;
				margin-top: 18rpx;
			}

			.pj_conetnt_center {
				width: 702rpx;
				height: 232rpx;
				border-radius: 10rpx;
				margin-top: 18rpx;
				margin-bottom: 24rpx;
				background: #F2F2F2;
				display: flex;
				align-items: center;
				justify-content: space-around;

				image {
					width: 166rpx;
					height: 166rpx;
					border-radius: 10rpx;
					margin-left: 30rpx;
				}

				.pj_conetnt_center_view {
					height: 166rpx;
					display: flex;
					flex-direction: column;
					// align-items: center;
					justify-content: space-between;

					.title {
						width: 432rpx;
						height: 132rpx;
						font-size: 30rpx;
						font-family: PingFang SC;
						font-weight: bold;
						color: #262626;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 3;
						overflow: hidden;
					}

					.view_bottom {
						height: 36rpx;
						display: flex;

						view {
							height: 36rpx;
							font-size: 26rpx;
							font-family: PingFang SC;
							font-weight: 400;
							color: #262626;
							font-weight: 600;
						}

						text {
							height: 36rpx;
							font-size: 26rpx;
							font-family: PingFang SC;
							font-weight: 400;
							color: #8C8C8C;

							&:nth-child(3) {
								margin-left: 15rpx;
								margin-right: 15rpx;
							}
						}
					}
				}
			}
		}
	}
	.chengkai{
		width: 100rpx;
		height:100rpx;
	}
</style>

<template>
	<view>
		<view class="pinglun">
			<view class="pinglun-title" v-if="plType == 0 || plType == 2">
				{{plList.length || 0}}条评论
			</view>
			<view class="pinglun-title" v-else>
				回答({{plList.length || 0}})
			</view>
			<!-- 循环 -->
			<view class="pinglun-content" v-if="plType == 0 || plType == 2">
				<view class="pinglun-content-view" v-for="(item,index) of plList" :key="index" >
					<!-- 第一层 -->
					<view class="pinglun-content-view-pinglun" >
						<image :src="item.avatar_url" class="pinglun-content-view-img" mode="" ></image>
						<view class="pinglun-content-view-content" @click="dianjic(item.id)">
							<view class="pinglun-content-view-content-text">
								{{item.nickname || ""}} <text v-if="item.is_author==1">作者</text>
								<!-- <text v-else>回复{{item.to_name || item.nickname}}</text> -->
							</view>
							<view class="pinglun-content-view-content-text2">
								{{item.review || item.content || ""}}
							</view>
							<view class="pinglun-content-view-content-text3">
								{{item.add_time || item.addtime || ""}}
							</view>
						</view>
						<view class="pinglun-content-view-dianzan" @click="childDz(item.id,item.is_like,item.answer_id)">
							<image :src="wxapp_img.publish.xin" mode="" v-if="item.is_like==0"></image>
							<image :src="wxapp_img.publish.xin2" mode="" v-else></image>
							<view>
								{{item.like_count || ""}}
							</view>
						</view>
					</view>
					<!-- 第二层 -->
					<view class="pinglun-content-view-pinglun2" v-if="indexs <= 0"   v-for="(items,indexs) of item.child" :key="indesx" >
						<image :src="items.avatar_url" class="pinglun-content-view-img" mode=""></image>
						<view class="pinglun-content-view-content" @click="dianjic(item.child[indexs].id)">
							<!--  v-if="items.is_author==1" -->
							<view class="pinglun-content-view-content-text">
								{{items.nickname || ""}} <text v-if="item.is_author==1">作者</text>
								<text v-else>回复 {{items.to_name || ""}}</text>
							</view>
							<!-- <view class="pinglun-content-view-content-text" v-else>
								{{items.nickname}} <text style="background-color: #fff;">>{{items.to_name}}</text>
							</view> -->
							<view class="pinglun-content-view-content-text2">
								{{items.review || items.content || ""}}
							</view>
							<view class="pinglun-content-view-content-text3">
								{{items.add_time || items.addtime || ""}}
							</view>
							<view class="pinglun-content-view-content-text2" @click="zhankai(index)" v-if="item.show == false && item.child.length-1 != 0">
								展开{{item.child.length-1}}条回复 <span class="iconfont">&#xe744;</span>
							</view>
						</view>
						<view class="pinglun-content-view-dianzan" @click="childDz(item.child[indexs].id,item.child[indexs].is_like,item.child[indexs].answer_id)">
							<image :src="wxapp_img.publish.xin" mode="" v-if="items.is_like == 0"></image>
							<image :src="wxapp_img.publish.xin2" mode="" v-else></image>
							<view v-if="plType == 0">
								{{items.discuss_count || ""}}
							</view>
							<view v-if = "plType == 2">
								{{items.like_count || ""}}
							</view>
						</view>
					</view>
					<view class="pinglun-content-view-pinglun2" v-if="indexs > 0 && item.show"  v-for="(items,indexs) of item.child" :key="indesx" >
						<image :src="items.avatar_url" class="pinglun-content-view-img" mode=""></image>
						<view class="pinglun-content-view-content" @click="dianjic(item.child[indexs].id)">
							<view class="pinglun-content-view-content-text">
								{{items.nickname || ""}} <text v-if="item.is_author==1">作者</text>
								<text v-else>回复{{item.to_name || ""}}</text>
							</view>
							<view class="pinglun-content-view-content-text2">
								{{items.review || items.content || ""}}
							</view>
							<view class="pinglun-content-view-content-text3">
								{{items.add_time || items.addtime || ""}}
							</view>
						</view>
						<view class="pinglun-content-view-dianzan" @click="childDz(item.child[indexs].id,item.child[indexs].is_like,item.child[indexs].answer_id)">
							<image :src="wxapp_img.publish.xin" mode="" v-if="items.is_like==0"></image>
							<image :src="wxapp_img.publish.xin2" mode="" v-else></image>
							<view>
								{{items.discuss_count || items.like_count || ""}}
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="pinglun-content2" v-if="plType == 1 ">
				<view class="pinglun-content-view" v-for="(item,index) of plList" :key="index" >
					<!--  -->
					<image :src="item.avatar_url" class="pinglun-content-view-img" mode=""></image>
					<view class="pinglun-content-view-content" >
						<view class="pinglun-content-view-content-text" @click="tiaozhuan(item.id,item.question_id)">
							{{item.nickname || item.answer_name || ""}} <text v-if="item.is_author==1">作者</text>
							<!-- <text v-else>回复{{item.answer_name}}</text> -->
						</view>
						<view class="pinglun-content-view-content-text2" @click="tiaozhuan(item.id,item.question_id)">
							{{item.content || ""}}
						</view>
						<view class="pinglun2-content-view-content-text3">
							<view class="pinglun-content-view-content-text3-left">
								{{item.addtime || ""}}
							</view>
							<view class="pinglun-content-view-content-text3-right">
								<view class="dianzan-view" @click="childDz(item.id,item.is_like)">
									<image :src="wxapp_img.publish.xin" mode="" v-if="item.is_like==0"></image>
									<image :src="wxapp_img.publish.xin2" mode="" v-else></image>
									<view>
										{{item.like_count || ""}}
									</view>
								</view>
								<view class="dianzan-view" @click="tiaozhuan(item.id,item.question_id)">
									<image :src="wxapp_img.publish.pl" mode="" style="width: 24rpx;height: 26rpx;" ></image>
									<view>
										{{item.discuss_count || item.review_count || ""}}
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import wine from "@/api/wine.js"
	export default{
		// plType 0 为多个等级的评论  1 为只有一层的评论
		data(){
			return{
				TwoList:[],
				show:false,
				focusState:false
			}
		},
		props:{
			plType:{
				type:Number
			},
			plList:{
				type:Array
			},
			ids:{
				type:Number
			},
		},
		methods:{
			// 展开
			zhankai(e){
				this.$emit("chufa",e)
			},
			dianjic(e){
				console.log(e)
				
				uni.$emit("commentPl",e)
				
			},
			tiaozhuan(e,a){
				this.$emit("wdDetils",e,a)
				// answerAnswerDetail
				// uni.navigateTo({
				// 	url:`../wdDetils/wdDetils?article_id=${e}&id=${a}`
				// })
			},
			// 点赞
			childDz(e,a,f){ 
				console.log(e,a)
				console.log(this.plType,"aaaaa")
				let num = null
				if(a==0){
					num = 1
				}else if(a==1){
					num=0
				}
				if(this.plType == 0){
					console.log(456)
					let data = {
						article_id:this.ids,
						is_liked:num,
						review_id:e
					}
					wine.noteLikeArticle(data,1)
					.then(res=>{
						console.log(res)
						if(res.code==0){
							this.$emit("giveALike")
						}
					})
				}else if(this.plType == 1){
					console.log(3333333333333333)
					let data = {
						question_id:this.ids,
						is_like:num,
						answer_id:e
					}
					wine.answerLikeAnswer(data,1)
					.then(res=>{
						console.log(res)
						if(res.code==0){
							this.$emit("giveALikes")
						}
					})
				}else if(this.plType == 2){
					console.log(3333333333333333)
					let data = {
						// question_id:this.ids,
						is_like:num,
						// answer_id:f,
						comment_id:e
						// answer_id:f
					}
					wine.answerLikeAnswer(data,1)
					.then(res=>{
						console.log(res)
						if(res.code==0){
							this.$emit("giveALikes")
						}
					})
				}
			},
		}
	}
</script>

<style scoped lang="scss">
	.pinglun{
		width: 690rpx;
		margin-top: 24rpx;
		margin-left: 32rpx;
		.pinglun-title{
			height: 44rpx;
			font-size: 32rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #262626;
		}
		.pinglun-content{
			width: 672rpx;
			margin-top: 54rpx;
			
			.pinglun-content-view{
				// height: 146rpx;
				margin-top: 20rpx;
				padding-bottom: 20rpx;
				border-bottom: 1rpx solid #F2F2F2;
				.pinglun-content-view-pinglun{
					display: flex;
					justify-content: space-around;
					.pinglun-content-view-img{
						width: 60rpx;
						height: 60rpx;
						background: #F3F3F3;
						border-radius: 120rpx;
					}
					.pinglun-content-view-content{
						// height: 146rpx;
						width: 394rpx;
					
						.pinglun-content-view-content-text{
							height: 34rpx;
							font-size: 24rpx;
							font-family: PingFang SC;
							font-weight: 400;
							color: #8C8C8C;
							text{
								width: 52rpx;
								height: 30rpx;
								font-size: 20rpx;
								font-family: PingFang SC;
								font-weight: 400;
								color: #8C8C8C;
								background: #F2F2F2;
								border-radius: 2rpx;
								margin-left: 20rpx;
								padding-left: 10rpx;
								padding-right: 10rpx;
							}
						}
						.pinglun-content-view-content-text2{
							// height: 36rpx;
							font-size: 26rpx;
							font-family: PingFang SC;
							font-weight: 400;
							color: #262626;
							margin-top: 18rpx;
						}
						.pinglun-content-view-content-text3{
							height: 34rpx;
							margin-top: 26rpx;
							display: flex;
							justify-content: space-between;
							.pinglun-content-view-content-text3-left{
								font-size: 24rpx;
								font-family: PingFang SC;
								font-weight: 400;
								color: #8C8C8C;
							}
							.pinglun-content-view-content-text3-right{
								width: 115rpx;
								height: 34rpx;
								display: flex;
								justify-content: space-between;
								align-items: center;
								.dianzan-view{
									display: flex;
									justify-content: space-between;
									align-items: center;
									image{
										width: 28rpx;
										height: 25rpx;
									}
									view{
										height: 34rpx;
										font-size: 24rpx;
										font-family: PingFang SC;
										font-weight: 600;
										color: #8C8C8C;
									}
								}
							}
						}
					}
					.pinglun-content-view-dianzan{
						width: 85rpx;
						height: 34rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						image{
							width: 28rpx;
							height: 25rpx;
						}
						view{
							height: 34rpx;
							font-size: 24rpx;
							font-family: PingFang SC;
							font-weight: 600;
							color: #8C8C8C;
						}
					}
				}
				.pinglun-content-view-pinglun2{
					width: 608rpx;
					// height: 225rpx;
					display: flex;
					justify-content: space-around;
					margin-left: 52rpx;
					margin-top: 20rpx;
					margin-bottom: 30rpx;
					margin:20rpx 0 30rpx 52rpx;
					.pinglun-content-view-img{
						width: 60rpx;
						height: 60rpx;
						background: #F3F3F3;
						border-radius: 120rpx;
					}
					.pinglun-content-view-content{
						// height: 146rpx;
						width: 400rpx;
						.pinglun-content-view-content-text{
							// height: 34rpx;
							font-size: 24rpx;
							font-family: PingFang SC;
							font-weight: 400;
							color: #8C8C8C;
							text{
								width: 52rpx;
								height: 30rpx;
								font-size: 20rpx;
								font-family: PingFang SC;
								font-weight: 400;
								color: #8C8C8C;
								background: #F2F2F2;
								border-radius: 2rpx;
								margin-left: 20rpx;
								padding-left: 10rpx;
								padding-right: 10rpx;
							}
						}
						.pinglun-content-view-content-text2{
							// height: 36rpx;
							font-size: 26rpx;
							font-family: PingFang SC;
							font-weight: 400;
							color: #262626;
							margin-top: 18rpx;
						}
						.pinglun-content-view-content-text3{
							// height: 34rpx;
							font-size: 24rpx;
							font-family: PingFang SC;
							font-weight: 400;
							color: #8C8C8C;
							margin-top: 26rpx;
						}
					}
					.pinglun-content-view-dianzan{
						width: 85rpx;
						height: 34rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						image{
							width: 28rpx;
							height: 25rpx;
						}
						view{
							height: 34rpx;
							font-size: 24rpx;
							font-family: PingFang SC;
							font-weight: 600;
							color: #8C8C8C;
						}
					}
				}
			}
		}
		// 只有一级回答的时候
		.pinglun-content2{
			width: 672rpx;
			margin-top: 54rpx;
			
			.pinglun-content-view{
				// height: 146rpx;
				display: flex;
				// justify-content: space-between;
				.pinglun-content-view-img{
					width: 60rpx;
					height: 60rpx;
					background: #F3F3F3;
					border-radius: 120rpx;
					margin-left: 20rpx;
				}
				.pinglun-content-view-content{
					width: 530rpx;
					// min-height: 186rpx;
					margin-left: 30rpx;
					border-bottom: 1rpx solid #F2F2F2;
					.pinglun-content-view-content-text{
						height: 34rpx;
						font-size: 24rpx;
						font-family: PingFang SC;
						font-weight: 400;
						color: #8C8C8C;
						text{
							width: 52rpx;
							height: 30rpx;
							font-size: 20rpx;
							font-family: PingFang SC;
							font-weight: 400;
							color: #8C8C8C;
							background: #F2F2F2;
							border-radius: 2rpx;
							margin-left: 20rpx;
							padding-left: 10rpx;
							padding-right: 10rpx;
						}
					}
					.pinglun-content-view-content-text2{
						// height: 36rpx;
						font-size: 26rpx;
						font-family: PingFang SC;
						font-weight: 400;
						color: #262626;
						margin-top: 18rpx;
						margin-bottom: 20rpx;
					}
					.pinglun2-content-view-content-text3{
						// height: 64rpx;
						margin-bottom: 26rpx;
						display: flex;
						justify-content: space-between;
						.pinglun-content-view-content-text3-left{
							font-size: 24rpx;
							font-family: PingFang SC;
							font-weight: 400;
							color: #8C8C8C;
						}
						.pinglun-content-view-content-text3-right{
							width: 185rpx;
							height: 34rpx;
							display: flex;
							justify-content: space-between;
							align-items: center;
							.dianzan-view{
								display: flex;
								justify-content: space-between;
								align-items: center;
								image{
									width: 28rpx;
									height: 25rpx;
								}
								view{
									height: 34rpx;
									font-size: 24rpx;
									font-family: PingFang SC;
									font-weight: 600;
									color: #8C8C8C;
									margin-left: 10rpx;
								}
							}
						}
					}
				}
				.pinglun-content-view-dianzan{
					width: 85rpx;
					height: 34rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					image{
						width: 28rpx;
						height: 25rpx;
					}
					view{
						height: 34rpx;
						font-size: 24rpx;
						font-family: PingFang SC;
						font-weight: 600;
						color: #8C8C8C;
					}
				}
				.pinglun-content-view-dianzan2{
					width: 85rpx;
					height: 34rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.dianzan-view{
						display: flex;
						justify-content: space-between;
						align-items: center;
						image{
							width: 28rpx;
							height: 25rpx;
						}
						view{
							height: 34rpx;
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
</style>

<template>
	<view>
		<view class="wdList">
			<view class="wdList-view">
				<view class="wdList-view-content">
					<view class="wdList-view-content-title">
						<span>{{topic_info.cat_name || ""}}</span>{{topic_info.question || ""}}
					</view>
					<view class="wdList-view-bottom">
					</view>
				</view>
			</view>
		</view>
		<detile :topic_info = "topic_info" :plType = "2" @gzDian = "gzDian"></detile>
		<pingLun :plType = "1" :ids = "wtId" :plList = "list" @giveALikes = "questionLike" @wdDetils="wdDetils"></pingLun>
		<bottom :types = "1"  :num_obg = "num_obg" :is_like="is_like" :ids = "wtId" @giveALikes = "questionLike"></bottom>
	</view>
</template>

<script>
	import pingLun from "../comme/pingLun.vue"
	import detile from "../comme/detile.vue"
	import bottom from "../comme/bottom.vue"
	import wine from "@/api/wine.js"
	export default {
		data() {
			return {
				wtId:null,
				user_id:null,
				topic_info:{},
				list:[],
				num_obg:{
					like_count:null,
					share_count:null
				},
				ids:null,
				is_like:null
			};
		},
		components:{
			pingLun,
			detile,
			bottom
		},
		onShow() {
			this.huoqu()
		},
		onLoad(e) {
			console.log(e)
			this.wtId = e.id
			this.user_id = e.user_id
			this.huoqu()
			this.wg()
		},
		methods:{
			// 围观
			wg(){
				let data = {
					question_id:this.wtId,
					type:0,
				}
				wine.answerAnswerShare(data)
				.then(res=>{
					console.log(res,"围观")
				})
			},
			wdDetils(e,a){
				console.log(e,'这个是回答的那个人的id')
				uni.navigateTo({
					url:`../wdDetils/wdDetils?article_id=${a}&answer_id=${e}`
				})
			},
			questionLike(){
				this.huoqu()
			},
			huoqu(){
				let data = {
					answer_user_id:0,
					question_id:this.wtId
				}
				wine.answerQuestionDetail(data)
				.then(res=>{
					console.log(res)
					// this.topic_info = Object.assign(res.answer, res.question)
					this.topic_info = res.question
					this.list = res.answer_all
					this.num_obg.share_count = res.share_answer_count
					this.num_obg.like_count = res.like_answer_count
					this.is_like = res.is_like
					uni.setStorageSync('is_liske',this.is_like)
					console.log(this.is_like,"这里是切换的喜欢值")
					this.list.forEach(item=>{
						item.show = false
					})
				})
			},
			gzDian(e){
				console.log(e)
				let num = null;
				if(e==0){
					num = 1
				}else{
					num = 0
				}
				let data = {
					user_id:this.user_id,
					is_user_liked:num
				}
				wine.noteFocusUser(data)
				.then(res=>{
					console.log(res)
					if(res.code == 0){
						uni.showToast({
							title:"关注成功"
						})
						this.huoqu()
						// this.detileS(this.ids)
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.wdList {
		width: 702rpx;
		margin-left: 24rpx;
	
		.wdList-view {
			// border-bottom: 1rpx solid #F8F8F8;
	
			.wdList-view-weiguan {
				height: 38rpx;
				display: flex;
				align-items: center;
				margin-top: 28rpx;
	
				.wdList-view-weiguan-imgs {
					height: 38rpx;
					display: flex;
	
					image {
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
							span{
								color: #262626;
								margin-right: 10rpx;
							}
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
</style>

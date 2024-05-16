<template>
	<view>
		<view class="wdList">
			<view class="wdList-view">
				<view class="wdList-view-content">
					<view class="wdList-view-content-title">
						<span>{{questionTopic_info.cat_name}}</span>{{questionTopic_info.question}}
					</view>
					<view class="wdList-view-bottom">
					</view>
				</view>
			</view>
		</view>
		<detile :topic_info = "topic_info" @gzDian = "gzDian"></detile>
		<pingLun :plType = "2"  :ids = "ids" :plList = "list" @giveALikes = "questionLike" @commentPl = "pinglun" @chufa="cz"></pingLun>
		<bottom :types = "2"  :num_obg = "num_obg" :ids = "ids" :idc = "id" :is_like="is_like"  @giveALikes = "questionLike" ></bottom>
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
				id:null,
				ids:null,
				topic_info:{},
				list:[],
				num_obg:{
					like_count:null,
					review_count:null,
					share_count:null
				},
				is_like:null,
				questionTopic_info:null,
				answer_id:null
			};
		},
		watch:{
			num(e,a){
				if(e != a){
					console.log("此时id改变")
					// this.syff()
				}
			},
		},
		onLoad(e){
			// 回答人的id
			this.id = Number(e.id) 
			
			console.log(this.id,"2222222222222222")
			// 问答id
			this.ids = e.article_id
			this.answer_id = e.answer_id
			this.detileS(this.ids)
			this.wg()
		},
		components:{
			pingLun,
			detile,
			bottom
		},
		methods:{
			// 围观
			wg(){
				let data = {
					question_id:this.ids,
					type:0,
				}
				wine.answerAnswerShare(data)
				.then(res=>{
					console.log(res,"围观")
				})
			},
			// 查看全部回答
			quanbu(){
				uni.navigateBack({
					delta:-1
				})
			},
			// 关注
			gzDian(e,a){
				console.log(e,a)
				let num = null;
				if(e==0){
					num = 1
				}else{
					num = 0
				}
				let data = {
					user_id:this.id,
					is_user_liked:num
				}
				wine.noteFocusUser(data)
				.then(res=>{
					console.log(res)
					if(res.code == 0){
						uni.showToast({
							title:"关注成功"
						})
						this.detileS(this.ids)
					}
				})
			},
			// 子组件触发后   点赞
			Like(){
				console.log(999)
				// this.detileS(this.id)
				this.detileS(this.ids)
				
			},
			questionLike(){
				this.detileS(this.ids)
			},
			childPl(){
				this.detileS(this.ids)
			},
			cz(e){
				console.log(e,"父组件触发")
				this.list[e].show = true
				this.$forceUpdate()
				console.log(this.list)
			},
			wenda(){
				uni.navigateTo({
					url:`../questions/questions?show=${1}&id=${this.ids}`
				})
			},
			detileS(e){
				let data = {
					answer_id:this.answer_id,
					question_id:e
				}
				wine.answerAnswerDetail(data,1)
				.then(res=>{
					console.log(res,"问答详情")
					if(res.code == 0){ 
						uni.setStorageSync("wdId",res.answer.id)
						this.topic_info = res.answer
						this.num_obg.share_count = res.share_answer_count
						this.num_obg.like_count = res.like_answer_count
						this.num_obg.review_count = res.review_count 
						this.is_like = res.is_like
						this.list = res.review
						this.questionTopic_info = res.question
						this.list.forEach(item=>{
							item.show = false
						})
						console.log(this.list)
					}
				})
			}
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

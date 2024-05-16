<template>
	<view>
		<view class="content" v-if="show == 0">
			<view class="content_view" v-for="(item,index) of list" :key="index">
				<view class="content_view_left">
					<image
						:src="item.avatar_url"
						mode="" @click="chakan(item.user_id)"></image>
					<view class="content_view_left_view">
						<view>
							{{item.nickname}}
						</view>
						<view>
							{{item.fance_count}} <text>粉丝</text>
						</view>
					</view>
				</view>
				<view class="content_view_right" v-if="item.is_focus == 1 && show == 1" @click="gzDian(item.is_focus,item.focus_user)">
					已关注
				</view>
				<view class="content_view_right2" v-if = "item.is_focus == 0 && show == 1" @click="gzDian(item.is_focus,focus_user)">
					关注
				</view>
			</view>
		</view>
		<view class="content" v-if="show == 1">
			<view class="content_view" v-for="(item,index) of list" :key="index">
				<view class="content_view_left">
					<image
						:src="item.avatar_url"
						mode="" @click="chakan(item.focus_user)"></image>
					<view class="content_view_left_view">
						<view>
							{{item.nickname}}
						</view>
						<view>
							{{item.fance_count}} <text>粉丝</text>
						</view>
					</view>
				</view>
				<view class="content_view_right" v-if="item.is_focus == 1 && show == 1" @click="gzDian(item.is_focus,item.focus_user)">
					已关注
				</view>
				<view class="content_view_right2" v-if = "item.is_focus == 0 && show == 1" @click="gzDian(item.is_focus,focus_user)">
					关注
				</view>
			</view>
		</view>
		<view class="pj" v-if="show == 2">
			<view class="pj_content" v-for="(item,index) of likeList" :key="index">
				<view class="pj_conetnt_top">
					<view>
						{{item.to_like_user}} 喜欢了你的
						<text v-if="item.type==1">问题</text>
						<text v-if="item.type==2 && item.style==0">回答</text>
						<text v-if="item.type==2 && item.style==1">回答评论</text>
						<text v-if="item.type==3">酒评</text>
						<text v-if="item.type==4">评论</text>
						<text v-if="item.type==5 && item.style==0">动态</text>
						<text v-if="item.type==5 && item.style==1">动态评论</text>
					</view>
					<view>
						{{item.add_time}}
					</view>
				</view>
				<!-- @click="liquor(item.type,item.id,item.qid || item.question_id,item.user_id,item.review_id,item.answer_id,item.note_id,item.article_id)" -->
				<view class="pj_conetnt_center" @click="liquor(item.type,item.id,item.qid || item.question_id,item.user_id||item.like_user,item.review_id,item.answer_id,item.note_id,item.article_id)">
					<image
						:src="item.pic_url"
						mode="" ></image>
		
					<view class="pj_conetnt_center_view">
						<view class="title">
							{{item.name}}
						</view>
		
						<view class="view_bottom">
							<view>
								{{item.review_count}}
							</view>
							<text>评论</text>
							<text>·</text>
							<view>
								{{item.like_count}}
							</view>
							<text>喜欢</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import wine from "@/api/wine.js"
	export default {
		data() {
			return {
				show:0,
				id:null,
				list:[],
				page:1,
				likeList:[]
			};
		},
		onLoad(e) {
			this.show = e.show
			this.id = e.id
			if (e.show == 0) {
				uni.setNavigationBarTitle({
					title: '粉丝'
				})
				this.huoqu2()
			}else if(e.show == 1){
				uni.setNavigationBarTitle({
					title: '关注'
				})
				this.huoqu()
			}else if(e.show == 2){
				uni.setNavigationBarTitle({
					title: '收到的喜欢'
				})
				this.likeView()
			}
		},
		onReachBottom() {
			if(this.show != 2){
				this.page++
				this.huoqu()
			}else{
				this.page++
				this.likeView()
			}
		},
		methods:{
			chakan(id){
				
				uni.navigateTo({
					url:`../../Myrebate/index/index?id=${id}`
				})
			},
			gzDian(e,id){
				console.log(e)
				let num = null;
				if(e==0){
					num = 1
				}else{
					num = 0
				}
				let data = {
					user_id:id,
					is_user_liked:num
				}
				wine.noteFocusUser(data)
				.then(res=>{
					console.log(res)
					if(res.code == 0){
						uni.showToast({
							title:"已取消"
						})
						this.list = []
						this.huoqu()
					}
				})
			},
			huoqu(){
				let data = {
					page:this.page,
					user_id:this.id
				}
				wine.userFocusView(data,1)
				.then(res=>{
					console.log(res)
					if(res.data.list.length == 0){
						uni.showToast({
							title:"暂无更多数据",
							icon:'none'
						})
					}else{
						this.list = []
						this.list = this.list.concat(res.data.list)
					}
				})
			},
			huoqu2(){
				let data = {
					page:this.page,
					user_id:this.id
				}
				wine.userFanceView(data,1)
				.then(res=>{
					console.log(res)
					if(res.data.list.length == 0){
						uni.showToast({
							title:"暂无更多数据",
							icon:'none'
						})
					}else{
						this.list = []
						this.list = this.list.concat(res.data.list)
					}
				})
			},
			liquor(t,j,e,a,f,answer,noteId,article){
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
						url:`../../wine/topicDetails/topicDetails?id=${a}&article_id=${article}`
					})
				}
				else if(t==5){
					uni.navigateTo({
						url:`../../wine/topicDetails/topicDetails?id=${a}&article_id=${article}`
					})
				}
			},
			likeView(){
				let data = {
					page:this.page,
					user_id:this.id
				}
				wine.userLikeView(data,1)
				.then(res=>{
					console.log(res)
					if(res.data == null){
						uni.showToast({
							title:"暂无更多数据",
							icon:'none'
						})
					}else{
						this.likeList = []
						this.likeList = this.likeList.concat(res.data.list)
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
	.content {
		width: 750rpx;
		background-color: #fff;

		.content_view {
			width: 702rpx;
			height: 142rpx;
			border-bottom: 1rpx solod #F8F8F8;
			margin-left: 24rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.content_view_left {
				height: 88rpx;
				display: flex;

				image {
					width: 88rpx;
					height: 88rpx;
					border-radius: 120rpx;
				}

				.content_view_left_view {
					height: 88rpx;
					display: flex;
					// align-items: center;
					flex-direction: column;
					justify-content: space-between;
					margin-left: 20rpx;

					view {
						font-size: 30rpx;
						font-family: PingFang SC;
						// font-weight: bold;
						color: #262626;

						text {
							font-size: 26rpx;
							font-family: PingFang SC;
							color: #8C8C8C;
							// font-weight: 300;
						}
					}
				}
			}

			.content_view_right {
				width: 120rpx;
				height: 56rpx;
				background: #F2F2F2;
				border-radius: 120rpx;
				text-align: center;
				line-height: 56rpx;
				font-size: 26rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #262626;
			}

			.content_view_right2 {
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
		}
	}
	.pj {
		width: 100%;
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
						font-weight: 400;
						color: #262626;
						margin-left: 10rpx;
					}
	
					.rate {
						margin-left: 15rpx;
					}
				}
			}
	
			.text {
				height: 36rpx;
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
						height: 82rpx;
						font-size: 30rpx;
						font-family: PingFang SC;
						font-weight: bold;
						color: #262626;
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
</style>

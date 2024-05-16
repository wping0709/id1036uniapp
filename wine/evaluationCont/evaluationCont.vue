<template>
	<view>
		<view class="evaluationCont">
			<view class="evaluationCont_view"  v-for="(item,index) of list" :key="index">
				<view class="evaluationCont_view_top">
					<image :src="item.avatar_url" mode=""></image>
					<view>
						{{item.nickname}}
					</view>
				</view>
				<view class="evaluationCont_view_pf" @click="plDetile(item.user_id,item.id)">
					<WEvaluate  :value.sync="item.score" fontSize="40" :readonly="true" activeColor="#ffcb34"></WEvaluate>
					<!-- <uni-rate allow-half :readonly="true" :value="item.score || 0"  size="15"/> -->
					<view>
						{{item.score || 0}}.0
					</view>
				</view>
				<view class="evaluationCont_view_text" @click="plDetile(item.user_id,item.id)">
					<rich-text class="text-content" :nodes="item.content"></rich-text>
				</view>
				<view class="evaluationCont_view_imgs" v-if="item.pic_url && item.pic_url.length" >
					<image @click="$utils.previewImage(item.pic_url, indexs)" :src="items" v-for="(items,indexs) of item.pic_url" :key="indexs" mode="aspectFill"></image>
				</view>
				<view class="evaluationCont_view_time">
					<view class="evaluationCont_view_time_left">
						{{item.add_time}}
					</view>
					<view class="evaluationCont_view_time_right">
						<view class="dianzan" @click="jpDz(item.is_like,item.id)">
							<!-- 少了 is_like -->
							<image :src="wxapp_img.publish.dianzan" mode="" v-if="item.is_like==0"></image>
							<image :src="wxapp_img.publish.xin2" mode="" v-else></image>
							<text>
								{{item.like_count}}
							</text>
						</view>
						<view class="pinglun" @click="plDetile(item.user_id,item.id)">
							<view class="pl">
								<image :src="wxapp_img.publish.pinglun"  mode=""></image>
								<text>
									{{item.review_count}}
								</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import WEvaluate from "@/components/w-evaluate/index.vue"
	import wine from "@/api/wine.js"
	export default {
		data() {
			return {
				page:1,
				list:[],
				goods_id:null
			};
		},
		onLoad(e) {
			console.log(e.goods_id)
			this.goods_id = e.goods_id
			this.huoqu(e.goods_id)
		},  
		components:{
			WEvaluate
		},
		methods:{
			plDetile(e,j){
				uni.navigateTo({
					url:`../../wine/topicDetails/topicDetails?id=${e}&article_id=${j}&default_show=${3}`
				})
			},
			jpDz(e,a){
				let num = null
				if(e==0){
					num = 1
				}else{
					num = 0
				}
				let data = {
					note_id: a,
					is_liked: num,
					article_id: 0
					// review_id: e
				}
				wine.noteLikeArticle(data, 1)
					.then(res => {
						console.log(res)
						if (res.code == 0) {
							this.huoqu(this.goods_id)
						}
					})
			},
			huoqu(e){
				let data = {
					goods_id:e,
					page:this.page
				}
				wine.defaultAllComment(data)
				.then(res=>{
					console.log(res)
					if(res.data==null){
						uni.showToast({
							title:"暂无更多数据",
							icon:"none"
						})
					}else{
						this.list = []
						this.list = this.list.concat(res.data.list)
						console.log(this.list)
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.evaluationCont{
		width: 678rpx;
		margin-left: 36rpx;
		.evaluationCont_view{
			// height: 530rpx;
			margin-top: 30rpx;
			border-bottom: 1rpx solid #F6F6F6;
			.evaluationCont_view_top{
				height: 60rpx;
				display: flex;
				align-items: center;
				image{
					width: 60rpx;
					height: 60rpx;
					border-radius: 120rpx;
				}
				view{
					height: 42rpx;
					font-size: 30rpx;
					font-family: PingFang SC;
					font-weight: bold;
					color: #262626;
					margin-left: 12rpx;
				}
			}
			.evaluationCont_view_pf{
				height: 34rpx;
				display: flex;
				align-items: center;
				margin-top: 28rpx;
				view{
					height: 34rpx;
					font-size: 24rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #999999;
					margin-left: 10rpx;
					line-height: 34rpx;
				}
			}
			.evaluationCont_view_text{
				width: 690rpx;
				font-size: 30rpx;
				margin-top: 14rpx;
				font-family: PingFang SC;
				font-weight: 400;
				color: #262626;
				.text-content{
					width: 100%;
					white-space:pre-wrap;
					word-wrap: break-word;
					word-break: break-all; 
				}
			}
			.evaluationCont_view_imgs{
				height: 166rpx;
				overflow-x: scroll;
				overflow-y: hidden;
				white-space: nowrap;/* 父级元素中的内容不换行 */
				margin-top: 16rpx;
				image{
					width: 166rpx;
					height: 166rpx;
					border-radius: 10rpx;
					display: inline-block;
					margin-left: 4rpx;
				}
			}
			.evaluationCont_view_time{
				height: 34rpx;
				margin-top: 14rpx;
				display: flex;
				justify-content: space-between;
				margin-bottom: 30rpx;
				// align-items: center;
				.evaluationCont_view_time_left{
					height: 34rpx;
					font-size: 24rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #8C8C8C;
				}
				.evaluationCont_view_time_right{
					width: 214rpx;
					height: 25rpx;
					display: flex;
					align-items: center;
					justify-content: space-around;
					.dianzan{
						height: 25rpx;
						image{
							width: 28rpx;
							height: 25rpx;
						}
						text{
							height: 34rpx;
							font-size: 24rpx;
							font-family: PingFang SC;
							font-weight: 600;
							color: #8C8C8C;
							margin-left: 6rpx;
						}
					}
					.pinglun{
						height: 25rpx;
						image{
							width: 26rpx;
							height: 28rpx;
						}
						text{
							height: 34rpx;
							font-size: 24rpx;
							font-family: PingFang SC;
							font-weight: 600;
							color: #8C8C8C;
							margin-left: 6rpx;
						}
					}
				}
			}
		}
	}
</style>

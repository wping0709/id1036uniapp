<template>
	<view>
		<view class="chengkai">

		</view>
		<view class="bottom" v-if="types == 0 || types == 2">
			<view class="bottom-ipt">
				<image :src="wxapp_img.publish.bianji" mode=""></image>
				<input type="text" placeholder="来，说点什么…" @autofocus="autofocus" :focus="focusState" v-model="plText"
					@confirm="pinglun(event,num)" @click="pingluns(event,'')" />
			</view>
			<view class="bottom-right">
				<view class="bottom-right-view" style="margin-left: 30rpx;">
					<image :src="wxapp_img.publish.pinglun" mode=""></image>
					<view>
						{{num_obg.review_count || ""}}
					</view>
				</view>
				<view class="bottom-right-view" style="margin-left: 30rpx;" @click="dianzan(0)">
					<image :src="wxapp_img.publish.dianzan" mode="" v-if="is_like==0"></image>
					<image :src="wxapp_img.publish.xin2" mode="" v-else></image>
					<view>
						{{num_obg.like_count || "" }}
						<!-- || num_obg.like_answer_count -->
					</view>
				</view>
				<!-- <button size="mini" plain open-type="share">123</button> -->
				<view size="mini" plain open-type="share" class="bottom-right-view" style="margin-left: 30rpx;"
					@click="showPopup = true">
					<image :src="wxapp_img.publish.fenxiang" mode=""></image>
					<!-- <view>
						{{num_obg.share_count || num_obg.share_answer_count}}
					</view> -->
				</view>
			</view>
		</view>
		<view class="bottom2" v-if="types == 1">
			<view class="bottom-view" @click="wenda">
				回答问题
			</view>
			<view class="bottom-right" style="justify-content: space-around;">
				<view class="bottom-right-view" @click="dianzan(0)">
					<image :src="wxapp_img.publish.dianzan" mode="" v-if="is_like==0"></image>
					<image :src="wxapp_img.publish.xin2" mode="" v-else></image>
					<view>
						{{num_obg.like_count || ""}}
					</view>
				</view>
				<view class="bottom-right-view" @click="showPopup = true">
					<image :src="wxapp_img.publish.fenxiang" mode=""></image>
					<!-- <view>
						{{num_obg.share_count}}
					</view> -->
				</view>
			</view>
		</view>
		<Share :showPopup.sync="showPopup" :routerPush='routerPush' :number="1" @fenxiang="quxiao" :data="topic_info" type="topic"></Share>
	</view>
</template>

<script>
	import wine from "@/api/wine.js"
	import Share from '@/components/share/share.vue';
	export default {
		data() {
			return {
				show: null,
				plText: "",
				num: '',
				focusState: false,
				showPopup: false,
				//分享链接+参数
				routerPush:""
			}
		},
		components: {
			Share,
		},
		onShareAppMessage(res) {
			// 分享接口会报错
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '问答专区',
				path: '/wine/TheZone/TheZone'
			}
		},
		props: {
			// 当前应该显示的样式
			types: {
				type: Number
			},
			// 底部点赞和分享等的对象
			num_obg: {
				type: Object
			},
			// 回答时  回答的id
			idc: {
				type: Number
			},
			// 问题或话题id
			ids: {
				type: Number
			},
			// 当前是否喜欢的类型值 
			is_like: {
				type: Number
			},
			// 是否是酒评
			default_show: {
				type: Number
			},
			topic_info: {
				type: Object
			}
		},
		created() {
			// 自定义事件回调
			uni.$on("commentPl", (num) => {
				this.focusState = false;
				this.$nextTick(() => {
					this.focusState = true;
				});
				console.log(886888886666, num)
				// this.autofocus()
				this.num = num
				console.log(this.num)
			})
		},

		mounted() {
			let curPage = getCurrentPages();
			let route = curPage[curPage.length - 1].route; //获取当前页面的路由
			let params = curPage[curPage.length - 1].options;
			let query = '';
			let keys = Object.keys(params); //获取对象的key 返回对象key的数组
			if (keys.length > 0) {
				query = keys.reduce((pre, cur) => {
					return pre + cur + '=' + params[cur] + '&';
				}, '?').slice(0, -1);
			}
			this.routerPush = route + query
			// console.log(route + query,'route + queryroute + queryroute + query')
			// console.log(route, params, '666666666')
			// console.log(this.is_like, "888666666")
			// console.log(this.default_show, "7777")
			if (this.default_show == 0) {
				this.default_show = null
			}
			// wx.showShareMenu({
			// 	withShareTicket: true,
			// 	menus: ['shareAppMessage', 'shareTimeline']
			// })
		},
		methods: {
			quxiao(){
				this.showPopup = false
			},
			pingluns(e, a) {
				this.num = a
			},
			wenda(e) {
				console.log(1)
				uni.navigateTo({
					url: `../questions/questions?show=${1}&id=${this.ids}`
				})
			},
			// 点赞
			dianzan(e) {
				console.log(this.ids, this.is_like)
				console.log(this.default_show,
					"this.default_showthis.default_showthis.default_showthis.default_showthis.default_show")
				this.show = this.is_like
				console.log(123)
				if (this.is_like == 0) {
					this.show = 1
				} else if (this.is_like == 1) {
					this.show = 0
				}
				if (this.default_show != undefined || this.default_show != null) {
					this.jpDz()
				} else {
					this.dz(this.show)
				}
			},
			jpDz() {
				let data = {
					note_id: this.ids,
					is_liked: this.show,
					article_id: 0
					// review_id: e
				}
				wine.noteLikeArticle(data, 1)
					.then(res => {
						console.log(res)
						if (res.code == 0) {
							this.$emit("giveALike")
						}
					})
			},
			dz(e) {
				if (this.types == 0) {
					console.log(456)
					let data = {
						article_id: this.ids,
						is_liked: this.show
						// review_id: e
					}
					wine.noteLikeArticle(data, 1)
						.then(res => {
							console.log(res)
							if (res.code == 0) {
								this.$emit("giveALike")
							}
						})
				} else if (this.types == 1) {
					console.log(3333333333333333)
					let data = {
						question_id: this.ids,
						is_like: this.show,
						review_id: e
					}
					wine.answerLikeAnswer(data, 1)
						.then(res => {
							console.log(res)
							if (res.code == 0) {
								this.$emit("giveALikes")
							}
						})
				} else if (this.types == 2) {
					let data = {
						// question_id: this.ids,
						is_like: this.show,
						answer_id: this.idc
					}
					wine.answerLikeAnswer(data, 1)
						.then(res => {
							console.log(res)
							if (res.code == 0) {
								this.$emit("giveALikes")
							}
						})
				}
			},
			// 评论 （可能需要把点击和请求分开）
			pinglun(a, e) {
				console.log(e)
				if (this.types == 0) {
					let num = null
					if (e == "") {
						num = 0
					} else {
						num = this.num
					}
					// parent_id   没有上级id传0  否则传上级id
					let data = {
						article_id: this.ids,
						review_text: this.plText,
						parent_id: num,
					}
					wine.noteReviewArticle(data)
						.then(res => {
							console.log(res)
							if (res.code == 0) {
								this.plText = ""
								this.$emit("plHou")
							}
						})
				} else if (this.types == 2) {
					let num = null
					// console.log(num, "11111111111111111")
					if (e == "") {
						num = 0
					} else {
						num = this.num
					}
					// parent_id   没有上级id传0  否则传上级id
					let data = {
						answer_id: this.idc,
						review_text: this.plText,
						parent_id: num,
					}
					wine.answerReview(data)
						.then(res => {
							console.log(res)
							if (res.code == 0) {
								this.plText = ""
								this.$emit("giveALikes")
							}
						})
				}

			}
		}
	}
</script>

<style scoped lang="scss">
	.chengkai {
		width: 100%;
		height: 240rpx;
	}

	.bottom {
		width: 100%;
		height: 178rpx;
		display: flex;
		justify-content: space-around;
		position: fixed;
		bottom: 0rpx;
		background-color: #fff;

		.bottom-view {
			width: 478rpx;
			height: 80rpx;
			background: linear-gradient(90deg, #F8DF51 0%, #FFCB34 100%);
			border-radius: 120rpx;
			font-size: 32rpx;
			font-family: PingFang SC;
			font-weight: bold;
			line-height: 80rpx;
			text-align: center;
			color: #353430;
			// margin-left: 10rpx;
		}

		.bottom-ipt {
			width: 376rpx;
			height: 64rpx;
			background: #F2F2F2;
			border-radius: 120rpx;
			display: flex;
			align-items: center;

			input {
				width: 314rpx;
				height: 34rpx;
				margin-left: 10rpx;
			}

			image {
				width: 24rpx;
				height: 24rpx;
				margin-left: 20rpx;
			}
		}

		.bottom-right {
			width: 260rpx;
			display: flex;
			justify-content: space-between;

			.bottom-right-view {
				height: 74rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-between;

				image {
					width: 36rpx;
					height: 39rpx;
				}

				view {
					font-size: 20rpx;
					font-family: PingFang SC;
					font-weight: 600;
					color: #8C8C8C;
				}

				&:nth-child(2) image {
					width: 39rpx;
					height: 35rpx;
				}

				&:nth-child(3) image {
					width: 36rpx;
					height: 36rpx;
				}
			}
		}
	}

	.bottom2 {
		height: 178rpx;
		display: flex;
		justify-content: space-around;
		position: fixed;
		bottom: 0rpx;
		background-color: #fff;

		.bottom-view {
			width: 478rpx;
			height: 80rpx;
			background: linear-gradient(90deg, #F8DF51 0%, #FFCB34 100%);
			border-radius: 120rpx;
			font-size: 32rpx;
			font-family: PingFang SC;
			font-weight: bold;
			line-height: 80rpx;
			text-align: center;
			color: #353430;
			margin-left: 10rpx;
		}

		.bottom-ipt {
			width: 376rpx;
			height: 64rpx;
			background: #F2F2F2;
			border-radius: 120rpx;
			display: flex;
			align-items: center;

			input {
				width: 314rpx;
				height: 34rpx;
				margin-left: 10rpx;
			}

			image {
				width: 24rpx;
				height: 24rpx;
				margin-left: 20rpx;
			}
		}

		.bottom-right {
			width: 260rpx;
			display: flex;
			justify-content: space-between;

			.bottom-right-view {
				height: 74rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-between;

				image {
					width: 36rpx;
					height: 39rpx;
				}

				view {
					font-size: 20rpx;
					font-family: PingFang SC;
					font-weight: 600;
					color: #8C8C8C;
				}

				&:nth-child(2) image {
					width: 39rpx;
					height: 35rpx;
				}

				&:nth-child(3) image {
					width: 36rpx;
					height: 36rpx;
				}
			}
		}
	}
</style>

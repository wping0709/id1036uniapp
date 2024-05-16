<template>
	<view>
		<view class="fwb">
			<u-textarea v-model="evaluation" maxlength="1000" height="200rpx" placeholder="添加标题" border="none" count
				:placeholder-style="{padding: 0}"></u-textarea>
		</view>

		<view class="imgList">
			<view class="imgList-tianjia" @click="shangchuan">
				<span class="iconfont">&#xeca5;</span>
			</view>
			<view class="imageView">
				<view class="xhView" v-for="(item,index) of imglist" :key="index">
					<image :src="item" mode="aspectFill"></image>
					<view class="delete" @click="deleteS(item,index)">
						-
					</view>
				</view>
			</view>
		</view>
		<view class="site">
			<view class="site-left">
				<span class="iconfont">&#xe888;</span>
				<view>
					选择话题
				</view>
			</view>
			<view class="site-center">
				<image :src="topic.pic_url || ''" mode="aspectFill">
				</image>
				<view>
					{{topic.topic_name || ''}}
				</view>
			</view>
			<view class="site-right" @click="tianjia">
				点击添加 <span class="iconfont">&#xe7b5;</span>
			</view>
		</view>
		<view class="bottom">
			<view @click="fabu">
				发布
			</view>
		</view>
		<view class="chengkai">

		</view>
	</view>
</template>

<script>
	import request from '@/utils/request';
	import wine from "@/api/wine.js"
	export default {
		data() {
			return {
				evaluation: "",
				number: 0,
				imglist: [],
				// 话题选中的商品
				topic: null,
			};
		},
		onShow() {
			this.topic = uni.getStorageSync("topic")
			console.log(this.topic)
		},
		onUnload() {
			uni.removeStorage({
				key: 'topic',
			})
		},
		methods: {
			// 删除图片
			deleteS(e, index) {
				// var imgIndex = this.imglist.findIndex(value=>value == e)
				this.imglist.splice(index, 1)
				console.log(index, "imgIndeximgIndeximgIndex")
			},
			fabu() {
				if (this.evaluation == "") {
					uni.showToast({
						title: "请输入内容",
						icon: "none"
					})
					return
				} else if (this.imglist.length == 0) {
					uni.showToast({
						title: "请选择图片",
						icon: "none"
					})
					return
				} else if (this.topic == null || this.topic == "") {
					uni.showToast({
						title: "请选择话题",
						icon: "none"
					})
					return
				} else {
					let data = {
						type: 1,
						content: this.evaluation,
						address_show: 0,
						topic_id: this.topic.id,
						pic_list_url: JSON.stringify(this.imglist),
					}
					wine.AddPush(data, 2)
						.then(res => {
							console.log(res)
							if (res.code == 0) {
								uni.showToast({
									title: "成功发布"
								})
								setTimeout(item => {
									uni.navigateBack({
										delta: -1
									})
								}, 2000)
							}
						})
				}
			},
			tianjia() {
				uni.navigateTo({
					url: "../topic/topic?id=" + 1
				})
			},
			imageForList(e) {
				console.log(e, "eeeee")
				uni.showToast({
					title: "上传中",
					icon: 'loading',
					duration: 1000,
				});
				uni.uploadFile({
					url: request.API_URL() + "/default/upload-image",
					filePath: e,
					name: 'image',
					formData: {},
					success: (res) => {
						console.log(res, "图片img")
						let data = JSON.parse(res.data);
						console.log(data, "mmmmmm")
						this.imglist.push(data.data.url)
						console.log(this.imglist, "llllllll")
					}
				})
			},
			shangchuan() {
				let that = this
				// #ifdef APP-PLUS
				if (this.systemInfo.osName !== 'ios') {
					uni.showModal({
						title: '提示',
						content: '是否允许系统打开设备相机?用于上传图片',
						success: ({
							confirm,
							cancel
						}) => {
							if (confirm) {
								uni.chooseImage({
									count: 9, // 最多可以选择的图片张数，默认9
									sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
									sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
									success: function(res) {
										console.log(res)
										if (res.errMsg == "chooseImage:ok") {
											console.log(res, "res11111111")
											for (let i = 0; i <= res.tempFilePaths.length; i++) {
												that.imageForList(res.tempFilePaths[i])
											}
											// console.log(that.imglist)
										} else {
											uni.showToast({
												title: "上传失败",
												icon: "none"
											})
										}

									}
								})
							}
						}
					})
				} else {
					uni.chooseImage({
						count: 9, // 最多可以选择的图片张数，默认9
						sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
						sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
						success: function(res) {
							console.log(res)
							if (res.errMsg == "chooseImage:ok") {
								console.log(res, "res11111111")
								for (let i = 0; i <= res.tempFilePaths.length; i++) {
									that.imageForList(res.tempFilePaths[i])
								}
								// console.log(that.imglist)
							} else {
								uni.showToast({
									title: "上传失败",
									icon: "none"
								})
							}

						}
					})
				}
				// #endif
				// #ifdef MP-WEIXIN || H5
				uni.chooseImage({
					count: 9, // 最多可以选择的图片张数，默认9
					sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
					sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
					success: function(res) {
						console.log(res)
						if (res.errMsg == "chooseImage:ok") {
							console.log(res, "res11111111")
							for (let i = 0; i <= res.tempFilePaths.length; i++) {
								that.imageForList(res.tempFilePaths[i])
							}
							// console.log(that.imglist)
						} else {
							uni.showToast({
								title: "上传失败",
								icon: "none"
							})
						}

					}
				})
				// #endif

			}
		},
		watch: {
			evaluation(e, a) {
				// console.log(e.length)
				this.number = e.length
				if (this.number > 1000) {
					uni.showToast({
						title: "字数过多",
						icon: "none"
					})
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.fwb {
		width: 650rpx;
		// height: 272rpx;
		margin-left: 52rpx;

		.fwb-text {
			// height: 234rpx;
			min-height: 200rpx;
			overflow: hidden;
		}

		.fwb-zs {
			height: 32rpx;
			font-size: 22rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: #8C8C8C;
			text-align: right;
		}
	}

	.imgList {
		width: 650rpx;
		margin-left: 52rpx;
		display: flex;
		align-items: center;

		.imgList-tianjia {
			width: 160rpx;
			height: 160rpx;
			background: #FFFFFF;
			border: 2rpx dashed #E5E5E5;
			border-radius: 10rpx;
			text-align: center;
			line-height: 160rpx;
			color: #E5E5E5;

			.iconfont {
				font-size: 60rpx;
			}

		}

		.imageView {
			width: 490rpx;
			height: 160rpx;
			margin-left: 10rpx;
			overflow-x: scroll;
			white-space: nowrap;

			.xhView {
				width: 160rpx;
				height: 160rpx;
				position: relative;
				display: inline-block;
				margin-left: 10rpx;

				image {
					width: 160rpx;
					height: 100%;
					// display: inline-block;
				}

				.delete {
					width: 40rpx;
					height: 40rpx;
					background-color: red;
					border-radius: 50%;
					text-align: center;
					line-height: 40rpx;
					color: #fff;
					position: absolute;
					top: 0rpx;
					right: 0;
				}
			}

		}
	}

	.site {
		width: 650rpx;
		height: 108rpx;
		margin-left: 52rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #F2F2F2;
		border-top: 1rpx solid #F2F2F2;
		margin-top: 100rpx;

		.site-left {
			width: 165rpx;
			height: 42rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.site-left-image {
				width: 28rpx;
				height: 34rpx;
			}

			view {
				height: 42rpx;
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: 400;
				color: #262626;
			}
		}

		.site-center {
			width: 200rpx;
			height: 42rpx;
			display: flex;
			margin-left: -100rpx;

			image {
				width: 38rpx;
				height: 38rpx;
				border-radius: 50%;
			}

			view {
				width: 160rpx;
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: 400;
				color: #262626;
				margin-left: 15rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}

		.site-right {
			// width: 80rpx;
			height: 48rpx;
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: #8C8C8C;
			display: flex;

			.switch {
				width: 100%;
				height: 100%;
			}

			.iconfont {
				color: #888888;
				margin-left: 10rpx;
			}
		}
	}

	.bottom {
		width: 100%;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 264rpx;

		view {
			width: 690rpx;
			height: 80rpx;
			background: linear-gradient(270deg, #FFCB34 0%, #F8DF51 100%);
			border-radius: 120rpx;
			font-size: 32rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #353430;
			text-align: center;
			line-height: 80rpx;
		}
	}

	.chengkai {
		width: 100%;
		height: 150rpx;
	}
</style>
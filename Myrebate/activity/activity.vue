<template>
	<view>
		<view class="center">
			<view class="center-view" @click="dianji(item.id)" v-for="(item,index) of list" :key="index">
				<image :src="item.pic_url" mode="scaleToFill"></image>
				<view v-if="item.show==0">
					剩余 <text> {{item.dd}}天{{item.hh}}小时{{item.mm}}分钟{{item.ss}}秒 </text> 结束
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
				page: 1,
				list: [],
				time: null,
				timeList: [],
				
			};
		},
		onShow() {
			this.huoqu()
			clearInterval(this.time)
			this.time = setInterval(item => {
				this.djs()
				// console.log(1)
			}, 1000)
		},
		onUnload() {
			clearInterval(this.time)
		},
		methods: {
			djs() {
				this.timeList.forEach((item, index) => {
					this.countTime(item,index)
					this.$forceUpdate()
				})
			},
			async huoqu() {
				let data = {
					page: this.page
				}
				await wine.orderActivityList(data,1)
					.then(res => {
						console.log(res)
						if (res.data.list.length == 0) {
							uni.showToast({
								title: "暂无更多信息",
								icon: "none"
							})
						} else {
							this.list = []
							this.list = this.list.concat(res.data.list)
							this.list.forEach((item, index) => {
								item.times = ''
								item.dd = ''
								item.hh = ''
								item.mm = ''
								item.ss = ''
								item.show = 0
								// this.countTime(item.end_time)
								this.timeList.push(item.end_time)
							})
						}
					})
			},
			dianji(e) {
				uni.navigateTo({
					url: `/rebate/theZone/theZone?id=${e}`
				})
			},
			countTime(e,index) {
				var that = this;
				let nowTime = new Date().getTime(); //当前时间
				let endtime = e * 1000
				let leftTime = endtime - nowTime;
				//this.lastdata接口传递过来的倒计时结束时间，时间戳，需要用时间戳比较，获取时间差
				//this.endDates属于倒计时关闭的状态 
				//递归每秒调用countTime方法，显示动态时间效果
				if (nowTime < endtime) {
					that.list[index].dd = that.checkTime(Math.floor(leftTime / 1000 / 60 / 60 / 24)) ;
					that.list[index].hh = that.checkTime(Math.floor(leftTime /1000 / 60 / 60 % 24));
					that.list[index].mm = that.checkTime(Math.floor(leftTime /1000 / 60 % 60)) ;
					that.list[index].ss = that.checkTime(Math.floor(leftTime /1000 % 60)) ;
				} else if (nowTime > e*1000) {
					//当前时间大于结束时间，不显示倒计时的操作
					console.log("结束了")
					uni.showToast({
						title:`活动${that.list[index].activity_name}已结束`,
						icon:"none"
					})
					that.list[index].show = 1
				}
			},
			checkTime(index){
			     if(index < 10){
					 return '0' + index
				 }else{
					 return index
				 }
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
	.center {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;

		.center-view {
			width: 710rpx;
			height: 360rpx;
			margin-top: 20rpx;
			position: relative;

			image {
				width: 710rpx;
				height: 360rpx;
				border-radius: 20rpx;
			}

			view {
				// width: 280rpx;
				height: 54rpx;
				background: #FFFFFF;
				background-color: rgba(255, 255, 255, 0.6);
				border-radius: 28rpx 0px 0px 28rpx;
				position: absolute;
				bottom: 18rpx;
				right: 0;
				text-align: center;
				line-height: 54rpx;

				text {
					color: #F0250E;
					padding-left: 5rpx;
					padding-right: 5rpx;
				}
			}
		}
	}
</style>

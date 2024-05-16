<template>
	<view>
		<view class="big" @click="guanbi">
			<view class="types">
				<view class="types-view" >
					<button  size="mini" class="btn" plain open-type="share" >
						<image :src="wxapp_img.publish.fenxiang2" mode=""></image>
						分享
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import wine from "@/api/wine.js"
	export default{
		data(){
			return{
				
			}
		},
		onShareAppMessage(res) {
			// 分享接口会报错
		    if (res.from === 'button') {// 来自页面内分享按钮
		      console.log(res.target)
		    }
		    return {
		      title: '问答专区',
		      path: '/wine/TheZone/TheZone'
		    }
		},
		// beforeDestroy() {
		// 	console.log("bbc")
		// 	this.chuanhui('ShutDown',false,1)
		// },
		methods:{
			chuanhui(e){
				this.$emit('ShutDown',false,e)
			},
			guanbi(){
				this.$emit('ShutDown',false)
			},
		}
	}
</script>

<style lang="scss" scoped>
	// button {
	// 	position:relative;
	// 	display:block;
	// 	margin-left:auto;
	// 	margin-right:auto;
	// 	padding-left:14px;
	// 	padding-right:14px;
	// 	box-sizing:border-box;
	// 	font-size:18rpx;
	// 	text-align:center;
	// 	text-decoration:none;
	// 	line-height:1;
	// 	// border-radius:5px;
	// 	-webkit-tap-highlight-color:transparent;
	// 	overflow:hidden;
	// 	color:#ccc;
	// 	background-color:#fff;
	// }
	// // 边框样式
	// button::after{
	// 	  border: none;
	// }
	// // 禁用时样式
	// button[disabled] {
	// 	  background-color: #fff;
	// 	  color: #666;
	// }
	// // 点击时样式
	// .button-hover {
	// 	color:rgba(0, 0, 0, 0.6);
	// 	background-color:#fff;
	// }
	.big{
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		z-index: 100000;
		background-color: rgba(0, 0, 0, .5);
		border-top: 1rpx solid #ccc;
		display: flex;
		align-items: center;
		justify-content: center;
		.types{
			width: 600rpx;
			height: 196rpx;
			background: #FFFFFF;
			border-radius: 24rpx;
			display: flex;
			// align-items: center;
			justify-content: center;
			flex-direction: column;
			// justify-content: center;
			.types-view{
				// width: 200rpx;
				height: 27rpx;
				display: flex;
				align-items: center;
				margin-left: 38rpx;
				margin-top: 30rpx;
				.btn::after {
				  border: none;
				}
				image{
					width: 28rpx;
					height: 27rpx;
				}
				view{
					height: 40rpx;
					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: 600;
					color: #797979;
					margin-left: 20rpx;
				}
				&:nth-child(1){
					margin-top: 0;
				}
			}
		}
	}
</style>

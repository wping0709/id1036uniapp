<template>
	<view class="backTu2">
		<image :src="imgBc" class="backTu"></image>
		<!-- 权益 1 -->
		<view class="rightsOne">
			<view class="rightsOneTitle">
				权益1：新人专享价
			</view>
			<view class="goodsShow">
				<view class="goodsBox" v-for="(item,index) in activityGoodsList.slice(0, sliceNum)" :key="item.goods_id"
					@click="goodsDetail(item.goods_id)">
					<image :src="item.cover_pic" class="goodsTu"></image>
					<view class="disc">
						{{item.name}}
					</view>
					<view class="price">
						<PriceText :price="item.price" ySize="30rpx" fSize="25rpx"></PriceText>
					</view>
					<view class="linePrice">
						<text>￥{{item.original_price}}</text>
					</view>
					<view class="shopCar" @click.stop="getGoods(item.goods_id)">
						<text class="iconfont icon-cart-full"></text>
					</view>
				</view>
			</view>
			<view class="checkMore" @click="moreFn()" v-if="activityGoodsList.length > 6 && seeMore==true">
				查看更多<text class="iconfont icon-arrow-bottom"></text>
			</view>
			<view class="checkMore" @click="packUp()" v-if="seeMore != true">
				收起<text class="iconfont icon-arrow-top"></text>
			</view>
		</view>
		<!-- 专享优惠券 -->
		<view class="couponBox">
			<view class="couponBox-title">
				<view>
					<text class="bigSize">专享优惠券</text><text class="minSize">用券更优惠</text>
				</view>
				<view :class="{'isGet':isDraw,'noGet':!isDraw}" @click="drawCoupon()">
					<text>{{ isDraw ? '已领取':'一键领取'}}</text>
				</view>
			</view>
			<!-- 红包区域 -->
			<view class="redPacket">
				<view class="redPacketShow" v-for="(item,index) in couponsList" :key="item.id">
					<view class="expiration">即将过期</view>
					<view class="subPrice">
						<PriceText :price="item.sub_price"></PriceText>
					</view>
					<view class=" fullDiscount">满{{item.min_price}}可用</view>
				</view>
			</view>
		</view>
		<!-- 权益2 -->
		<view class="rightstwo">
			<view>
				<text class="bigSize2">{{itemTitle}}</text><text class="minSize2">{{subTitle}}</text>
			</view>
			<!-- 导航栏 -->
			<view :class="{'navSection':true,'sticky-fixed':isFixed}">
				<view class="navTitle" v-for="(item,index) in navList" :key="index"
					:class="{ 'active': activeTab === index }" @click="changeTab(index)">
					{{item.name}}
				</view>
			</view>
			<!-- 商品展示部分 -->
			<view class="showBox2" id="navS">
				<view class="goodsSection" v-for="(item2,index2) in allList" :key="item2.id"
					@click="goodsDetail(item2.id)">
					<image :src="item2.cover_pic"></image>
					<view class="goodsContent">
						<view class="goodsText">
							{{item2.name}}
						</view>
						<view class="goodsPrice">
							<PriceText :price="item2.price"></PriceText>
							<text class="linePrice">{{item2.original_price}}</text>
						</view>
						<view class="monSale">
							<text>月售</text><text>{{item2.sale_num}}</text>
						</view>
						<view class="goodsCar" @click.stop="getGoods(item2.id)">
							<text class="iconfont icon-cart-full"></text>
						</view>
					</view>
				</view>
				<view v-if="page > pageCount" class="noMoreData">没有更多商品啦...</view>
			</view>
		</view>
		<!-- 结算部分 -->
		<view class="lastStyle">
			<view class="account">
				<view class="accountLef">
					<view class="accountCar">
						<text class="iconfont icon-cart-full"></text>
					</view>
					<view v-show="!isModify">
						<text>合计：</text>
						<PriceText :price="totalPrice" ySize="34rpx" fSize="24rpx" color="#F0250E" fontWeight="700">
						</PriceText>
					</view>
				</view>
				<view class="accountBtn" @click="accountFn()">
					去购物车结算
				</view>
			</view>
		</view>
		<AttrPopup :showText="'addCart'" :goodsId="checkGoodsId" ref="AttrPopup" type="goods"></AttrPopup>
	</view>
</template>

<script>
	import PriceText from "@/components/price-text/index"
	import AttrPopup from '@/components/goods/AttrPopup';
	import loadmore from "../../uview-ui/libs/config/props/loadmore";
	export default {
		components: {
			PriceText,
			AttrPopup
		},
		data() {
			return {
				seeMore: true,
				activityGoodsList: [],
				couponsList: [],
				navList: [],
				activeTab: "",
				isSelect: 0,
				sliceNum: 6, //截取个数
				imgBc: '',
				colorBc: '',
				isFixed: false, // 标志头部是否固定
				checkGoodsId: 0,
				goodsList: [], //自营商品列表
				mch_list: [], //入住商列表
				isModify: false,
				listTop: 0,
				itemTitle: '',
				subTitle: '',
				couponMsg: '',
				page: 1,
				pageCount: 3, //下拉加载获取到的全部数据页数
				allList: [], //下拉加载获取到的全部数据
				catList: [],
			}
		},
		methods: {
			async getAllNew() {
				const res = await this.$requestAll.home.getAllData()
				console.log('新人专享福利全部数据', res)
				this.itemTitle = res.data.title
				this.subTitle = res.data.sub_title
				this.activityGoodsList = res.data.newDiscountGoods
				this.couponsList = res.data.coupons
				this.navList = res.data.conf
				this.allList = this.navList[this.isSelect].goods_list
				this.activeTab = this.isSelect
				this.imgBc = res.data.template_image
				this.colorBc = res.data.template_color
			},
			async drawCoupon() {
				if (!this.isDraw) {
					const res = await this.$requestAll.home.getCoupon()
					this.couponMsg = res.msg
					if (res.code == 0) {
						this.isDraw = true
					}
				}
			},
			// 合计商品价格
			async loadData() {
				const res = await this.$requestAll.cart.getCartList({}, true);
				this.goodsList = res.data.list;
				this.mch_list = res.data.mch_list;
			},
			// 切换商品类型
			changeTab(tab) {
				this.activeTab = tab;
				this.isSelect = this.activeTab
				this.clearData()
				this.allList = this.navList[this.isSelect].goods_list

			},
			// 点击展开查看更多
			moreFn() {
				this.sliceNum = this.activityGoodsList.length
				this.seeMore = !this.seeMore
			},
			// 收起更多商品展示
			packUp() {
				this.sliceNum = 6
				this.seeMore = true
			},
			// 点击查看商品详情
			goodsDetail(id) {
				uni.navigateTo({
					url: '/pages/goods/goods?id=' + id
				});
			},
			// 加入购物车
			getGoods(id, type = 'addCart') {
				this.checkGoodsId = id
				this.$refs['AttrPopup'].showPopup(type);

			},
			// 去购物车页面结算
			accountFn() {
				this.$utils.toUrl('/pages/cart/cart')
			},
			getDistanceToTop() {
				uni.createSelectorQuery()
					.select('#navS')
					.boundingClientRect((rect) => {
						if (rect) {
							this.listTop = rect.top
						}
					}).exec();
			},

			getData(fn) {
				if (this.navList[this.isSelect].type == 1) {
					uni.showLoading({
						title: 'Loading...'
					});
					let pageNum = this.page
					let catId = this.navList[this.isSelect].cat.id
					this.$requestAll.home.getGoodsNum({
						page: pageNum,
						cat_id: catId,
					}).then((res) => {
						this.pageCount = res.data.page_count
						this.catList = [...res.data.list]
						this.allList = [...this.allList, ...this.catList]
						this.page = this.page + 1
						uni.hideLoading();
					})
				}
				fn && fn()
			},
			clearData(fn) {
				this.page = 1
				this.catList = []
				this.allList = []
				this.getData(fn)
			}
		},
		computed: {
			totalPrice() {
				let mch_list = this.mch_list;
				let goodsList = this.goodsList;
				let totalPrice = 0;
				if (goodsList.length) {
					goodsList.forEach(goods => {
						totalPrice += goods.price;

					});
				}
				if (mch_list.length) {
					mch_list.forEach(mch => {
						mch.list.forEach(goods => {
							totalPrice += goods.unitPrice * goods.num;
						});
					});
				}
				return totalPrice.toFixed(2);
			},
			isDraw() {
				if (this.couponsList.length > 0) {
					for (var i = 0; i < this.couponsList.length; i++) {
						if (this.couponsList[i].is_collection == 0) {
							return false;
						}
					}
					return true;
				} else {
					return true;
				}
			}

		},

		// 滚动吸顶部分
		onPageScroll(e) {
			this.getDistanceToTop();
			this.isFixed = true
			if (this.listTop <= 50) {
				this.isFixed = true
			} else {
				this.isFixed = false
			}
		},
		// 下拉加载
		onReachBottom() {
			if (this.page <= this.pageCount) {
				this.getData()
			}
		},
		onLoad() {
			this.getAllNew()
			this.loadData()
		}
	}
</script>

<style lang="scss" scoped>
	.backTu {
		width: 750rpx;
		height: 600rpx;
		margin: 0;
		background-color: #F0250E;
	}

	.backTu2 {
		width: 750rpx;
		// height: 1686rpx;
		background: #FEE9DF;
	}

	// 权益1
	.rightsOne {
		width: 702rpx;
		// height: 842rpx;
		background: linear-gradient(180deg, #FEF1E8 0%, #FFFFFF 100%);
		border-radius: 20rpx;
		opacity: 1;
		border: 4rpx solid #FFFFFF;
		margin: 0rpx 26rpx 24rpx 22rpx;
		padding-top: 24rpx;
		padding-left: 24rpx;
		margin-top: -350rpx;
		z-index: 100;
		position: relative;

		.rightsOneTitle {
			width: 260rpx;
			height: 42rpx;
			font-size: 30rpx;
			font-family: PingFang HK, PingFang HK;
			font-weight: 600;
			color: rgba(51, 51, 51, 0.94);
			line-height: 42rpx;
			margin-bottom: 24rpx;
		}

		.checkMore {
			width: 100%;
			height: 34rpx;
			text-align: center;
			font-size: 24rpx;
			font-family: PingFang SC, PingFang SC;
			font-weight: 400;
			color: #666666;
			line-height: 34rpx;
			margin-bottom: 24rpx;
			margin-top: 24rpx;
		}

		.goodsShow {
			display: flex;
			flex-wrap: wrap;

			.goodsBox {
				width: 206rpx;
				height: 326rpx;
				background: #FFFFFF;
				border-radius: 20rpx;
				opacity: 1;
				border: 2rpx solid #F2F2F2;
				margin-right: 16rpx;
				margin-bottom: 16rpx;
				padding: 12rpx;
				position: relative;

				// 细节
				.goodsTu {
					width: 182rpx;
					height: 182rpx;
				}

				.disc {
					width: 168rpx;
					height: 34rpx;
					font-size: 24rpx;
					font-family: PingFang SC, PingFang SC;
					font-weight: 600;
					color: #262626;
					margin-top: 10rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.linePrice {
					width: 58rpx;
					height: 28rpx;
					font-size: 20rpx;
					font-family: PingFang SC, PingFang SC;
					font-weight: 400;
					color: #8C8C8C;
					text-decoration: line-through;
				}

				.shopCar {
					width: 42rpx;
					height: 42rpx;
					background: #FF1B22;
					border-radius: 100%;
					opacity: 1;
					position: absolute;
					bottom: 12rpx;
					right: 12rpx;

					text {
						margin-left: 5rpx;
						line-height: 42rpx;
						font-size: 32rpx;
						color: #fff;
					}
				}

			}
		}
	}

	// 专享优惠券
	.couponBox {
		width: 702rpx;
		height: 308rpx;
		background: linear-gradient(180deg, #FEF1E8 0%, #FFFFFF 100%);
		border-radius: 20rpx;
		opacity: 1;
		border: 4rpx solid #FFFFFF;
		margin: 0rpx 26rpx 24rpx 22rpx;
		padding: 24rpx;

		.couponBox-title {
			display: flex;
			justify-content: space-between;

			.bigSize {
				width: 150rpx;
				height: 42rpx;
				font-size: 30rpx;
				font-family: PingFang HK, PingFang HK;
				font-weight: 600;
				color: rgba(51, 51, 51, 0.94);
				line-height: 42rpx;
			}

			.minSize {
				width: 120rpx;
				height: 34rpx;
				font-size: 24rpx;
				font-family: PingFang HK, PingFang HK;
				font-weight: 400;
				color: #999999;
				line-height: 34rpx;
				margin-left: 10rpx;
			}

			.isGet {
				width: 164rpx;
				height: 60rpx;
				background: #D7D7D7;
				border-radius: 120rpx;
				opacity: 1;
				line-height: 60rpx;
				text-align: center;
			}

			.noGet {
				width: 164rpx;
				height: 60rpx;
				background: #FF1B22;
				color: #fff;
				border-radius: 120rpx;
				opacity: 1;
				line-height: 60rpx;
				text-align: center;
			}
		}

		// 红包区域
		.redPacket {
			height: 212rpx;
			width: 680rpx;
			// background-color: #900788;
			// margin-top: 12rpx;
			display: flex;
			overflow: auto;

			.redPacketShow {
				width: 162rpx;
				height: 188rpx;
				background-image: url('@/common/redPacket.png');
				margin-right: 18rpx;
				margin-top: 12rpx;
				position: relative;
				flex: 0 0 auto;

				.expiration {
					width: 92rpx;
					height: 26rpx;
					background: #FFE3E2;
					border-radius: 120rpx 120rpx 120rpx 0rpx;
					opacity: 1;
					font-size: 18rpx;
					color: #FF1B22;
					font-weight: 400;
					line-height: 26rpx;
					padding: 0rpx 10rpx;
					position: absolute;
					top: -12rpx;
					left: 8rpx;
				}

				.subPrice {
					height: 72rpx;
					width: 100%;
					line-height: 72rpx;
					text-align: center;
					margin-top: 10rpx;
				}

				.fullDiscount {
					height: 32rpx;
					font-size: 22rpx;
					line-height: 32rpx;
					font-family: PingFang SC, PingFang SC;
					font-weight: 400;
					color: #FF1B22;
					margin: 0rpx 10rpx;
					margin-top: -10rpx;
				}

			}
		}

	}

	// 权益2
	.rightstwo {
		width: 702rpx;
		// height: 1500rpx;
		// height: 808rpx;
		background: linear-gradient(180deg, #FEF1E8 0%, #FFFFFF 100%);
		border-radius: 20rpx;
		opacity: 1;
		border: 4rpx solid #FFFFFF;
		margin: 0rpx 26rpx 24rpx 22rpx;
		padding: 24rpx;

		.noMoreData {
			width: 100%;
			margin-top: 10rpx;
			text-align: center;
			color: #8C8C8C;
		}

		.bigSize2 {
			height: 42rpx;
			font-size: 30rpx;
			font-family: PingFang HK, PingFang HK;
			font-weight: 600;
			color: rgba(51, 51, 51, 0.94);
			line-height: 42rpx;
		}

		.minSize2 {
			height: 34rpx;
			font-size: 24rpx;
			font-family: PingFang HK, PingFang HK;
			font-weight: 400;
			color: #999999;
			line-height: 34rpx;
			margin-left: 10rpx;
		}

		// 导航部分
		.navSection {
			height: 46rpx;
			width: 670rpx;
			// background-color: #427088;
			margin-top: 24rpx;
			margin-bottom: 24rpx;
			display: flex;
			overflow: auto;
			z-index: 100;
		}

		.sticky-fixed {
			width: 750rpx;
			height: 94rpx;
			background: #FFFFFF;
			margin: -10rpx 0rpx 0rpx -48rpx;
			padding-left: 24rpx;
			display: flex;
			align-items: center;
			overflow: auto;
			// 吸顶
			position: sticky;
			top: 0;
			z-index: 100;
		}

		.navTitle {
			width: 168rpx;
			height: 46rpx;
			background: #F4EAE2;
			border-radius: 120rpx;
			opacity: 1;
			text-align: center;
			line-height: 46rpx;
			color: #333333;
			font-size: 24rpx;
			font-family: PingFang HK, PingFang HK;
			font-weight: 600;
			margin-right: 10rpx;
			flex: 0 0 auto;
		}

		.active {
			background-color: #FEDCD6;
			color: #FF1B22;
		}

		.showBox2 {
			width: 100%;
			height: 1200rpx;
			overflow: auto;
			// background-color: #ee6600;
		}

		.goodsSection {
			height: 192rpx;
			width: 100%;
			// background-color: #bb2;
			margin-top: 24rpx;
			display: flex;
			justify-content: space-between;

			image {
				width: 192rpx;
				height: 192rpx;
				background: #F2F2F2;
				border-radius: 10rpx;
				opacity: 1;
				margin-right: 20rpx;
			}

			.goodsContent {
				width: 420rpx;
				height: 192rpx;
				position: relative;

				.goodsText {
					width: 420rpx;
					height: 82rpx;
					font-size: 30rpx;
					font-family: PingFang SC, PingFang SC;
					font-weight: 600;
					color: #262626;
					line-height: 40rpx;
					margin-bottom: 20rpx;
					// 多行文本溢出显示三个圆点
					overflow: hidden;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
				}

				.linePrice {
					width: 58rpx;
					height: 34rpx;
					font-size: 24rpx;
					line-height: 34rpx;
					font-family: PingFang SC, PingFang SC;
					font-weight: 400;
					color: #8C8C8C;
					text-decoration: line-through;
					margin-left: 8rpx;
				}

				.monSale {
					width: 194rpx;
					height: 34rpx;
					// background-color: #aabbcc;
					font-size: 24rpx;
					font-family: PingFang SC, PingFang SC;
					font-weight: 400;
					color: #8C8C8C;
					line-height: 34rpx;
					margin-top: 10rpx;
				}

				.goodsCar {
					width: 44rpx;
					height: 44rpx;
					background: #F0250E;
					border-radius: 100%;
					opacity: 1;
					position: absolute;
					bottom: 0rpx;
					right: 0rpx;
					color: #fff;
					text-align: center;
					line-height: 44rpx;
				}
			}
		}
	}

	// 结算部分
	.lastStyle {
		width: 100%;
		height: 102rpx;
		background: #FEE9DF;
		position: fixed;
		bottom: 0rpx;
		left: 0rpx;
		z-index: 10000;
	}

	.account {
		width: 714rpx;
		height: 102rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 0rpx 12rpx 2rpx rgba(0, 0, 0, 0.05);
		border-radius: 120rpx;
		opacity: 1;
		margin: 0rpx 18rpx;
		// margin-top: 40rpx;
		padding: 12rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.accountLef {
			display: flex;
			align-items: center;
			width: 400rpx;
			height: 78rpx;

			// background-color: #00eeff;
			.accountCar {
				width: 78rpx;
				height: 78rpx;
				background: #FF1B22;
				border-radius: 100%;
				opacity: 1;
				font-size: 40rpx;
				text-align: center;
				line-height: 78rpx;
				color: #fff;
				font-size: 40rpx;
				margin-right: 18rpx;

				text {
					width: 40rpx;
					height: 37rpx;
					font-size: 60rpx;
				}
			}

			.priceText {
				font-size: 28rpx;
				font-family: PingFang SC, PingFang SC;
				color: rgba(51, 51, 51, 0.94);
			}
		}

		.accountBtn {
			width: 254rpx;
			height: 78rpx;
			background: linear-gradient(86deg, #FE403D 0%, #FF7728 100%);
			border-radius: 120rpx;
			opacity: 1;
			text-align: center;
			line-height: 78rpx;
			color: #fff;
			font-size: 30rpx;
			font-family: PingFang SC, PingFang SC;
			font-weight: 600;
		}
	}
</style>
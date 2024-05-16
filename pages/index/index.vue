<template>
	<view v-if="store && showPage" class="home-box">
		<!-- 没有shop_info组件 -->
		<!-- #ifndef H5 -->
		<WNavbar v-if="!template.some((item) => item.type == 'shop_info')" :title="SHOP_CONFIG.store_name"
			:bgColor="tabBarData && tabBarData.navigation_bar_color.backgroundColor"
			:color="tabBarData && tabBarData.navigation_bar_color.frontColor">
			<template v-slot:left><text></text></template>
		</WNavbar>

		<!-- 模板列表为空  && 已开启多城市 -->
		<DiyShopInfo v-else-if="!template.length" :param="defaultShopInfoData"></DiyShopInfo>
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<DiyShopInfo v-if="!template.length" :param="defaultShopInfoData"></DiyShopInfo>
		<!-- #endif -->

		<template v-for="(item, index) in template">
			<!-- 购买通知 -->
			<BuyNotice v-if="item.type == 'order_notice'" :param="item.param" ref="BuyNotice" :key="index"></BuyNotice>
			<!-- 选择门店 -->
			<DiyShopInfo :key="index" v-if="item.type == 'shop_info'" :param="item.param"></DiyShopInfo>
			<DiynoteSearch :key="index" v-if="item.type == 'note_search'" :param="item.param"></DiynoteSearch>
			<DiynoteTopic :key="index" v-if="item.type == 'note_topic'" :param="item.param"></DiynoteTopic>
			<DiynotePost :key="index" v-if="item.type == 'note_post'" :param="item.param" ref="DiynotePost">
			</DiynotePost>
			<DiySearch v-if="item.type == 'search'" :param="item.param" :templateList="template" :key="index">
			</DiySearch>
			<DiyNav v-if="item.type == 'nav'" :page_id="page_id" :_templateKey="index" :item="item" :key="index">
			</DiyNav>
			<DiyBanner v-if="item.type == 'banner'" :param="item.param" :key="index"></DiyBanner>

			<DiyFastNav v-if="item.type == 'fast_nav'" :param="item.param" :key="index"></DiyFastNav>

			<DiyPlate v-if="item.type == 'plate'" :param="item.param" :key="index"></DiyPlate>

			<!-- 新人专享 -->
			<DiyNewcomers v-if="item.type == 'new_discount'" :_templateKey="index" :page_id="page_id" :item="item" :key="index"></DiyNewcomers>
			<!-- 通知提示 -->
			<DiyTopic class="topic" v-if="item.type == 'topic'" :page_id="page_id" :_templateKey="index" :item="item"
				:key="index"></DiyTopic>

			<DiyIndexRecommend v-if="item.type == 'index_recommend'" :param="item.param" :key="index">
			</DiyIndexRecommend>

			<DiySuperBrand v-if="item.type == 'super_brand'" :param="item.param" :key="index"></DiySuperBrand>

			<DiyRecommendGoods v-if="item.type == 'recommend_goods' || item.type == 'blind_box'" ref="DiyRecommendGoods"
				:item="item" :_templateKey="index" :page_id="page_id" :templateList="template" :key="index">
			</DiyRecommendGoods>

			<DiyNearbyMch v-if="item.type == 'nearby_mch'" :param="item.param" :key="index"></DiyNearbyMch>

			<!-- 通知 -->
			<DiyNotice class="diy-notice" v-if="item.type == 'notice'" :param="item.param" :key="index"></DiyNotice>

			<!-- 视频组件 -->
			<DiyVideo v-if="item.type == 'video'" :param="item.param" :key="index"></DiyVideo>

			<!-- 商品组件 -->
			<DiyGoods v-if="item.type == 'goods'" :page_id="page_id" :_templateKey="index" :item="item" :index="index"
				:key="index"></DiyGoods>

			<!-- 商品预约组件 -->
			<DiyGoodsYuyue v-if="item.type == 'book'" :page_id="page_id" :_templateKey="index" :item="item"
				:index="index" :key="index"></DiyGoodsYuyue>

			<!-- 商品秒杀组件 -->
			<DiyGoodsMiaosha v-if="item.type == 'miaosha'" :page_id="page_id" :_templateKey="index" :item="item"
				:index="index" :key="index"></DiyGoodsMiaosha>

			<!-- 商品砍价组件 -->
			<DiyGoodsKanjia v-if="item.type == 'bargain'" :page_id="page_id" :_templateKey="index" :item="item"
				:index="index" :key="index"></DiyGoodsKanjia>

			<!-- 商品积分商城组件 -->
			<DiyGoodsIntegral v-if="item.type == 'integral'" :page_id="page_id" :_templateKey="index" :item="item"
				:index="index" :key="index"></DiyGoodsIntegral>

			<!-- 商品抽奖组件 -->
			<DiyGoodsChoujiang v-if="item.type == 'lottery'" :page_id="page_id" :_templateKey="index" :item="item"
				:index="index" :key="index"></DiyGoodsChoujiang>

			<!-- 整点秒杀 -->
			<DiyMiaosha v-if="item.type == 'hourly_miaosha'" :param="item.param" :key="index"></DiyMiaosha>

			<!-- 关联链接 -->
			<DiyLink v-if="item.type == 'link'" :param="item.param" :key="index"></DiyLink>

			<!-- 附近店铺 -->
			<DiyShop v-if="item.type == 'shop'" :page_id="page_id" :_templateKey="index" :item="item" class="diy-shop"
				:key="index"></DiyShop>

			<!-- 优惠券 -->
			<DiyCoupon :page_id="page_id" :_templateKey="index" :item="item" v-if="item.type == 'coupon'" :key="index">
			</DiyCoupon>

			<!-- 倒计时 -->
			<DiyTime v-if="item.type == 'time'" :item="item" :key="index"></DiyTime>

			<!-- 拼团 -->
			<DiyPinTuan v-if="item.type == 'pintuan'" :page_id="page_id" :_templateKey="index" :item="item"
				:key="index">
			</DiyPinTuan>

			<!-- 好店推荐 -->
			<DiyMch v-if="item.type == 'mch'" :item="item" :key="index"></DiyMch>

			<DiyRubik v-if="item.type == 'rubik'" :param="item.param" :key="index"></DiyRubik>

			<DiyLine v-if="item.type == 'line'" :item="item" :key="index"></DiyLine>

			<!-- 弹框广告 -->
			<DiyModal v-if="item.type == 'modal' && item.param.show == 1" :item="item" :key="index"></DiyModal>

			<!-- 粘性定位 -->
			<DiyFloat v-if="item.type == 'float'" :page_id="page_id" :_templateKey="index" :item="item" :key="index">
			</DiyFloat>

			<!-- 文本组件 -->
			<DiyText v-if="item.type == 'text'" :param="item.param" :key="index"></DiyText>

			<!-- 单品轮播 -->
			<DiyOneSwiper v-if="item.type == 'single_carousel'" :param="item.param" :key="index"></DiyOneSwiper>

			<!-- 选项卡轮播 -->
			<DiyTabSwiper v-if="item.type == 'tab_carousel'" :param="item.param" :key="index"></DiyTabSwiper>

			<!-- 广告 -->
			<DiyAd v-if="item.type == 'ad'" :param="item.param" :key="index"></DiyAd>
		</template>


		<!-- 去登录弹框 -->
		<DiyLoginPopup :show.sync="showLoginPopup"></DiyLoginPopup>

		<TabBar></TabBar>

		<Share v-if="store.index_share" :showPopup.sync="showShare" type="home" showFixedShare isMovable :number="2"
			routerPush=""></Share>

		<QOfficialAccount></QOfficialAccount>

		<AuthPopup ref="AuthPopup" :show.sync="showAuth" @success="loadData"></AuthPopup>

		<WxPrivacyPopup ref="WxPrivacyPopup"></WxPrivacyPopup>
	</view>
	<u-loading-page v-else loading loading-mode="spinner" iconSize="60px"></u-loading-page>
</template>

<script>
	import Share from "@/components/share/share";
	import share from "@/mixins/share.js";
	import TabBar from "@/components/TabBar";
	import DiySearch from "./diy/DiySearch";
	import DiyNav from "./diy/DiyNav";
	import DiyBanner from "./diy/DiyBanner";
	import DiyFastNav from "./diy/DiyFastNav";
	import DiyPlate from "./diy/DiyPlate";
	import DiyTopic from "./diy/DiyTopic";
	import DiyMiaosha from "./diy/DiyMiaosha";
	import DiyIndexRecommend from "./diy/DiyIndexRecommend";
	import DiyRecommendGoods from "./diy/DiyRecommendGoods";
	import DiySuperBrand from "./diy/DiySuperBrand";
	import DiyShopInfo from "./diy/DiyShopInfo";
	import DiyNearbyMch from "./diy/DiyNearbyMch";
	import DiyNotice from "./diy/DiyNotice";
	import DiyVideo from "./diy/DiyVideo";
	import DiyGoods from "./diy/DiyGoods";
	import DiyLink from "./diy/DiyLink";
	import DiyShop from "./diy/DiyShop";
	import DiyCoupon from "./diy/DiyCoupon";
	import DiyTime from "./diy/DiyTime";
	import DiyPinTuan from "./diy/DiyPinTuan";
	import DiyMch from "./diy/DiyMch";
	import DiyRubik from "./diy/DiyRubik";
	import DiyGoodsYuyue from "./diy/DiyGoodsYuyue";
	import DiyGoodsMiaosha from "./diy/DiyGoodsMiaosha";
	import DiyGoodsKanjia from "./diy/DiyGoodsKanjia";
	import DiyGoodsIntegral from "./diy/DiyGoodsIntegral";
	import DiyGoodsChoujiang from "./diy/DiyGoodsChoujiang";
	import DiyLine from "./diy/DiyLine";
	import DiyModal from "./diy/DiyModal";
	import DiyFloat from "./diy/DiyFloat";
	import DiyText from "./diy/DiyText";
	import DiyOneSwiper from "./diy/DiyOneSwiper";
	import DiyTabSwiper from "./diy/DiyTabSwiper";
	import BuyNotice from "./diy/BuyNotice";
	import DiyLoginPopup from "./diy/DiyLoginPopup.vue";
	import DiyAd from "./diy/DiyAd.vue";
	import DiynoteSearch from "./diy/DiynoteSearch.vue";
	import DiynoteTopic from "./diy/DiynoteTopic.vue";
	import DiynotePost from "./diy/DiynotePost.vue";
	import DiyNewcomers from "./diy/DiyNewcomers";
	import WNavbar from "@/components/w-navbar";
	import AuthPopup from "./components/AuthPopup.vue";
	import WxPrivacyPopup from "../../components/wx-privacy-popup.vue";
	const defaultShopInfoData = {
		bg_color: "#fff",
		btn_1_img: "",
		btn_1_open_type: "",
		btn_1_page_name: "",
		btn_1_text: "",
		btn_1_url: "",
		btn_2_img: "",
		btn_2_open_type: "",
		btn_2_page_name: "",
		btn_2_text: "",
		btn_2_url: "",
		default_search_text: "搜索",
		font_color: "#333",
		font_icon: "0",
		font_type: "1",
		is_show_logo: "0",
		logo_url: "",
		shop_type: "1",
	};

	export default {
		components: {
			Share,
			DiySearch,
			DiyNav,
			TabBar,
			DiyBanner,
			DiyFastNav,
			DiyPlate,
			DiyTopic,
			DiyMiaosha,
			DiyIndexRecommend,
			DiyRecommendGoods,
			DiySuperBrand,
			DiyShopInfo,
			DiyNearbyMch,
			DiyNotice,
			DiyVideo,
			DiyGoods,
			DiyLink,
			DiyShop,
			DiyCoupon,
			DiyTime,
			DiyPinTuan,
			DiyMch,
			DiyRubik,
			DiyGoodsYuyue,
			DiyGoodsMiaosha,
			DiyGoodsKanjia,
			DiyGoodsIntegral,
			DiyGoodsChoujiang,
			DiyLine,
			DiyModal,
			DiyFloat,
			DiyText,
			DiyOneSwiper,
			DiyTabSwiper,
			BuyNotice,
			DiyLoginPopup,
			WNavbar,
			DiynoteSearch,
			DiynoteTopic,
			DiynotePost,
			DiyAd,
			DiyNewcomers,
			AuthPopup,
			WxPrivacyPopup,
		},
		mixins: [share],
		data() {
			return {
				defaultShopInfoData, //shopinfo组件默认参数
				pages_index_index: {},
				template: [],
				// page_id: 82,
				page_id: -1,
				showBuyNotice: false, //通知弹框开关
				showLoginPopup: false, //登录弹框开关
				showShare: false, //分享弹框开关
				showPage: false, //是否显示当前页面
				showAuth: false,
			};
		},
		watch: {
			showPage(val, ovl) {
				if (val) {
					this.$nextTick(() => {
						if (this.store && this.store.purchase_frame) {
							let BuyNotice = this.$refs["BuyNotice"];
							// console.log(BuyNotice);
							BuyNotice && !BuyNotice.pageTime && BuyNotice.getBuy();
						}

						// 如果开启了多城市，引导开启定位，获取附近最近4个城市供与选择，未开启定位只展示总店城市
						if (
							this.store.client_shop_select_module != "shop" &&
							this.store.is_load_store
						) {
							this.$refs["AuthPopup"].onShowAuth();
						}
					});
				}
			},
		},
		onLoad() {
			
			this.onIsStoreTrue(() => {
				this.showPage = true;

				// 动态配置复制信息
				if (this.store.option.tt_video) {
					setTimeout(() => {
						// #ifdef MP-WEIXIN
						wx.setClipboardData({
							data: this.store.option.tt_video,
							success: (success) => {
								wx.hideToast();
							},
						});
						// #endif
						// #ifndef MP-WEIXIN
						uni.setClipboardData({
							data: this.store.option.tt_video,
							hideToast: false,
							success: (success) => {
								uni.hideToast();
							},
						});
						// #endif
					}, 2000);
				}

				this.loadData();
				// #ifdef MP-WEIXIN
				this.$nextTick(() => {
					this.$refs["WxPrivacyPopup"]?.switchShow(true);
				})
				// #endif
			});
		},
		onHide() {
			if (this.store && this.store.purchase_frame) {
				this.$refs["BuyNotice"] && this.$refs["BuyNotice"].clearTime();
			}
		},
		onUnload() {
			if (this.store && this.store.purchase_frame) {
				this.$refs["BuyNotice"] && this.$refs["BuyNotice"].clearTime();
			}
		},
		onShow() {
			this.onIsStoreTrue(() => {
				// 显示去登录弹框
				this.showLoginPopup =
					this.store &&
					this.store.wxapp_index_show_login == 1 &&
					!uni.getStorageSync("token") &&
					!uni.getStorageSync("isHideLoginPopup");
			});
			// #ifdef APP-PLUS
			this.appUpdate()
			// #endif
		},
		methods: {
			// 检测app更新
			async appUpdate(){
				let platform=uni.getSystemInfoSync().platform
				if(platform === 'ios'){
					return ;
				}
				// 获取安卓应用的版本号
				let versionCode = plus.runtime.versionCode;
				// 请求后太获取最新版本号以及最新apk安装地址
				const res = await this.$requestAll.home.getVersion({});
				if(res.code == 0 && parseInt(res.data.now_version) > versionCode){
					let download_url = res.data.download_url
					// 执行更新
					uni.showModal({
						title:'更新提醒',
						content:'您现在版本' + versionCode + '，发现新版本，请更新!',
						success:(res)=>{
							if(res.confirm){
								plus.nativeUI.showWaiting('下载更新文件...')
								let downloadTask = uni.downloadFile({
										url: download_url,
										complete: () => {},
										success: (res1) => {
											plus.nativeUI.closeWaiting()
											if (res1.statusCode == 200) {
												// 安装
												plus.nativeUI.showWaiting('安装中...')
												plus.runtime.install(res1.tempFilePath, function() {
													plus.nativeUI.closeWaiting()
													plus.nativeUI.alert('更新成功!', function() {
														plus.runtime.restart()
													})
												}, function(e) {
													plus.nativeUI.closeWaiting()
													plus.nativeUI.alert('更新失败')
													// 删除临时目录
													if (e.code == 10) {
														uni.removeSavedFile({
															filePath: res1.tempFilePath
														})
													}
												})
											}
										},
										fail(res) {
											plus.nativeUI.closeWaiting()
											plus.nativeUI.alert("下载失败")
										}
									});
							}
						}
					})
				}
			},
			// 判断store是否获取到
			onIsStoreTrue(callback) {
				if (!this.store) {
					setTimeout(() => {
						console.log("diaoyong");
						this.onIsStoreTrue(callback);
					}, 300);
				} else {
					callback && callback();
				}
			},
			async toMch() {
				const location = await this.$store.dispatch("GETLOCATION");
				const res = await this.$requestAll.mch.getMchList({
						longitude: location.longitude,
						latitude: location.latitude,
					},
					true
				);
				if (res.data.list.length) {
					this.$utils.toUrl(
						"/mch/shop/shop?mch_id=" + res.data.list[0].id,
						"redirectTo"
					);
				} else {
					uni.showModal({
						title: "提示",
						content: "未查询到店铺信息,是否重新加载？",
						success: (result) => {
							if (result.confirm) {
								uni.reLaunch({
									url: "/pages/index/index",
								});
							}
						},
						fail: () => {},
						complete: () => {},
					});
				}
			},

    async loadData(fn) {
      // 是否单店铺模式
      if (this.store.is_mch_mode) {
        // 获取门店列表，跳转门店首页
        this.toMch();
        return;
      }
      const res = await this.$requestAll.home.getPage({
        page_id: this.page_id,
      });
      this.pages_index_index = res.data;
      this.template = res.data.template;
	  console.log('this.template',this.template)
      fn && fn();
    },
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.showPage = false;
    this.loadData(() => {
      this.showPage = true;
      uni.stopPullDownRefresh();
    });
  },
  onReachBottom() {
    // console.log('触底加载');
    // this.$refs.DiyRecommendGoods[0].loadData();
	if (this.template.some((item) => item.type == "recommend_goods")) {
		this.$refs.DiyRecommendGoods && this.$refs.DiyRecommendGoods[0].moreRecommendGoods();
    }
    if (this.template.some((item) => item.type == "note_post")) {
      this.$refs["DiynotePost"][0].huoqu();
    }
  },
  onPageScroll({ scrollTop }) {
    this.$refs["DiyRecommendGoods"] &&
      this.$refs["DiyRecommendGoods"][0].pageScroll(scrollTop);
  },
  computed: {
    SHOP_CONFIG() {
      return this.$store.getters["SHOP_CONFIG"];
    },
    shareData() {
      return {
        imageUrl: this.store?.store_share_logo,
        title: this.store?.store_share_title,
        desc: this.store?.store_share_desc,
        path:
          "/pages/index/index" +
          uni.$u.queryParams({
            user_id: this.$store.getters["user/userInfo"].id || "",
            store_id: this.$store.getters["currentStore"].id || "",
            // #ifdef APP-PLUS
            _platform: "app",
            // #endif
          }),
      };
    },
    tabBarData() {
      return this.$store.getters["tabBarData"];
    },
  },
};
</script>

<style lang="scss" scoped>
	.home-box {

		// 横向滚动组件样式
		/deep/.u-scroll-list {
			padding-bottom: 10rpx;

			.u-scroll-list__indicator {
				margin-top: 10rpx;
			}
		}

		// 五角星组件样式
		.diy-shop {
			/deep/.uicon-star-fill {
				color: #f00 !important;
			}
		}

		.topic {
			/deep/.u-icon__img {
				width: 54rpx !important;
				height: 28rpx !important;
			}
		}

		/deep/.u-count-down__text {
			color: inherit !important;
			font-size: inherit !important;
		}

		background: #f5f5f5;
		min-height: 100vh;
	}
</style>
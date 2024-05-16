<template>
  <view v-if="vgoodsList.length" class="body">
    <!-- 头部 -->
    <div
      class="page-title-box"
      :style="'top:' + systemInfo.statusBarHeight + 'px'"
    >
      <div
        @click="$utils.backTo()"
        class="back iconfont icon-arrow-left font-50"
      ></div>
      <view class="page-title">
        <div
          @click="switchTab(cart.id)"
          :class="['tab', cart.id == cat_id && 'checked']"
          v-for="(cart, i) in cartList"
          :key="i"
        >
          {{ cart.name }}
        </div>
      </view>
    </div>

    <swiper
      @animationfinish="swiperChange"
      v-if="vgoodsList.length"
      :current="swiperIndex"
      class="swiper"
      :circular="false"
      vertical
    >
      <swiper-item v-for="(vgoods, i) in vgoodsList" :key="i">
        <view
          v-if="i < swiperIndex + 3 && i > swiperIndex - 3"
          class="swiper-item uni-bg-red"
        >
          <!-- autoplay自动播放  loop循环播放 controls显示默认控件 show-fullscreen-btn全屏按钮-->
          <!-- :http-cache="swiperIndex < i + 3" -->
          <video
            :src="vgoods.video_src"
            :id="'video' + i"
            :http-cache="false"
            :autoplay="i == 0"
            loop
            :controls="true"
            :show-fullscreen-btn="false"
            :show-center-play-btn="false"
          ></video>

          <!-- 右侧多按钮 -->
          <div class="swiper-item-right">
            <div v-if="vgoods.user_id != 0" class="item user-info">
              <image
                @click="
                  $utils.toUrl(
                    '/shakeProduct/homepage/index?user_id=' + vgoods.user_id
                  )
                "
                :src="vgoods.user_info && vgoods.user_info.avatar_url"
                mode="aspectFill"
                class="user-img"
              />
              <text
                @click="onFocus(vgoods)"
                v-if="!vgoods.is_focus"
                class="iconfont icon-jia"
              ></text>
              <text
                @click="onFocus(vgoods)"
                v-else
                class="iconfont icon-jianhao"
              ></text>
            </div>
            <div
              v-if="vgoods.goods_list.length"
              @click="showGoods = true"
              class="item"
            >
              
              <text v-if="!option.goods_icon" class="iconfont icon-shangpin"></text>
              <image v-else :src="option.goods_icon" mode="aspectFill" class="icon-shangpin-img"></image>
              <text>商品</text>
            </div>
            <div
              v-if="vgoods.user_id != 0"
              @click="showDaShang = true"
              class="item"
            >
              <text class="iconfont icon-dashang"></text>
              <text>打赏</text>
            </div>
            <div @click="showComment = true" class="item">
              <text class="iconfont icon-pinglun"></text>
              <text>评论</text>
            </div>
            <!-- 点赞 -->
            <div @click="onDianzan(vgoods, i)" class="item">
              <text
                :style="{
                  color: vgoods.is_like ? 'red' : '#fff',
                }"
                class="iconfont icon-aixin1"
              ></text>
              <text>{{ vgoods.good_num || 0 }}</text>
            </div>
            <!-- 购物车 -->
            <div @click="$utils.toUrl('/pages/cart/cart')" class="item">
              <text class="iconfont icon-cart-full"></text>
              <text>{{ tabBarData.cart_count || 0 }}</text>
            </div>
            <!-- 分享 -->
            <div @click="onShare(vgoods)" class="item">
              <text class="iconfont icon-share"></text>
              <text>分享</text>
            </div>
          </div>

          <!-- 底部内容区域 -->
          <div v-if="vgoods.content" class="swiper-item-bottom-content">
            <view class="m-b-20 font-30 font-w-600">{{
              vgoods.user_info && vgoods.user_info.nickname || ""
            }}</view>
            <scroll-view scroll-y style="max-height: 140rpx">
              {{ vgoods.content }}
            </scroll-view>
          </div>
        </view>
      </swiper-item>
    </swiper>
    <Share
      :showPopup.sync="showShare"
      :data="vgoodsList[swiperIndex]"
      type="vgoods"
    ></Share>

    <u-popup :show="showGoods" round="20rpx" @close="showGoods = false">
      <view class="goods-popup p-x-30">
        <view style="height: 80rpx" class="flex-y-center flex-x-sb">
          <text class="font-32">
            共{{ vgoodsList[swiperIndex].goods_list.length }}件商品
          </text>
          <text
            @click="showGoods = false"
            class="iconfont icon-reeor font-50"
          ></text>
        </view>
        <scroll-view
          scroll-y
          v-if="vgoodsList[swiperIndex].goods_list.length"
          class="goods-box-style6"
        >
          <view
            v-for="(goods, goodsIndex) in vgoodsList[swiperIndex].goods_list"
            :key="goodsIndex"
            class="goods-item-style6"
            @click="$utils.toUrl('/pages/goods/goods?id=' + goods.id)"
          >
            <image
              :src="goods.cover_pic"
              mode="aspectFill"
              style="width: 200rpx; height: 200rpx"
            />
            <view class="goods-content-style6 flex-w-1 flex-col flex-x-sb">
              <view>
                <view class="goods-title u-line-2">{{ goods.name }}</view>
              </view>
              <view>
                <view class="flex-y-center flex-x-sb">
                  <view class="flex-w-1">
                    <view class="price-color">
                      ￥
                      <text class="font-30 font-w-600">{{ goods.price }}</text>
                    </view>
                  </view>
                  <view @click.stop="clickAdd(goods)" class="goods-bt">
                    选规格
                  </view>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>

        <view v-else class="goods-box-style6">
          <u-empty mode="data" :icon="wxapp_img.empty_data"> </u-empty>
        </view>
      </view>
    </u-popup>
    <AttrPopup
      ref="AttrPopup"
      :goodsId="goodsId"
      :vgoods_id="vgoods_id"
    ></AttrPopup>

    <CommentPopup
      :show="showComment"
      :cItem="vgoodsList[swiperIndex]"
      :close.sync="showComment"
    ></CommentPopup>

    <GivePopup
      :show="showDaShang"
      :vgoods_id="vgoodsList[swiperIndex] ? vgoodsList[swiperIndex].id : ''"
      :close.sync="showDaShang"
    ></GivePopup>

    <QOfficialAccount></QOfficialAccount>
  </view>
</template>

<script>
import Share from "@/components/share/share";
import share from "@/mixins/share.js";
import AttrPopup from "@/components/goods/AttrPopup";
import CommentPopup from "../components/comment-popup";
import GivePopup from "../components/give-popup";
// import
export default {
  components: {
    Share,
    AttrPopup,
    CommentPopup,
    GivePopup,
  },
  mixins: [share],
  data() {
    return {
      pageType: 0,
      vgoodsList: [],
      cartList: [],
      id: "",
      cat_id: 0,
      page: 1,
      status: "loadmore",
      swiperIndex: 0,
      showShare: false, //分享开关
      showGoods: false, //带货商品弹框开关
      goodsId: "", //商品id
      vgoods_id: "", //抖品id
      cartData: "", //购物车数据
      showDaShang: false, //打赏弹框
      showComment: false, //评论弹框
      option: '',
    };
  },
  onLoad(params) {
    this.id = params.id;
    this.pageType = parseInt(params.pageType) || 0;
    this.getVgoods();
    this.getCat();
  },
  onShow() {},
  methods: {
    onShare() {
      this.showShare = true;
    },
    async getVgoods() {
      if (this.status == "nomore") return;
      const res = await this.$requestAll.vgoods.vgoodsEdit({
        page: this.page,
        cat_id: this.cat_id,
        id: this.id,
      });

      !this.option && (this.option = res.data.option)
      this.vgoodsList.push(...res.data.vgoods);

      this.page++;
      this.status = res.data.vgoods.length < 10 ? "nomore" : "loadmore";
    },
    async getCat() {
      const res = await this.$requestAll.vgoods.vgoodsgetCat({});
      this.cartList = res.data.cart_list;
    },
    resetPageData() {
      const { vgoodsList, page, status, swiperIndex } = this.$options.data();
      this.vgoodsList = vgoodsList;
      this.page = page;
      this.status = status;
      this.swiperIndex = swiperIndex;
    },
    switchTab(id) {
      this.cat_id = id;
      this.resetPageData();
      this.getVgoods();
    },
    swiperChange(v) {
      var val = JSON.parse(JSON.stringify(this.swiperIndex));

      this.swiperIndex = v.detail.current;

      uni.createVideoContext("video" + val).pause();
      uni.createVideoContext("video" + this.swiperIndex).play();
      if (v.detail.current > this.vgoodsList.length - 5) {
        this.$nextTick(() => {
          this.getVgoods();
        });
      }
    },
    // 点赞
    async vgoodsgetGood(vgoods) {
      await this.$requestAll.vgoods.vgoodsGood({
        id: vgoods.id,
        statue: this.isGood(vgoods) ? 0 : 1,
      });
      uni.$u.toast(this.isGood(vgoods) ? "取消成功" : "点赞成功");
      this.$store.commit("user/switchGood", vgoods.id);
    },
    // 点赞
    async onDianzan(item, i) {
      item = JSON.parse(JSON.stringify(item));
      item.good_num = Number(item.good_num) + (item.is_like ? -1 : 1);
      item.is_like = item.is_like ? 0 : 1;
      await this.$requestAll.vgoods.vgoodsGood(
        {
          id: item.id,
          status: item.is_like,
        },
        true
      );
      console.log(item);
      this.$set(this.vgoodsList, i, item);
    },
    // 点击添加购物车
    clickAdd(goods) {
      console.log(goods);
      this.showGoods = false;
      this.goodsId = goods.id;
      this.vgoods_id = this.vgoodsList[this.swiperIndex].id;
      this.$refs["AttrPopup"].showPopup("addCart");
    },
    async onFocus(vgoods) {
      const res = await this.$requestAll.vgoods.focus({
        id: vgoods.user_id,
        type: vgoods.is_focus,
      });
      uni.$u.toast(res.msg);
      vgoods.is_focus = vgoods.is_focus == 1 ? 0 : 1;
    },
  },
  computed: {
    videoHtml() {
      return function (item, i) {
        return `<video src="${item.video_src}" style="width:100vw;height:100vh;" id="video${i}"></video>`;
      };
    },
    isGood() {
      console.log(this.$store.getters["user/vgoods_good"]);

      var vgoods_good = this.$store.getters["user/vgoods_good"];
      return function (vgoods) {
        return vgoods_good.indexOf(vgoods.id) != -1;
      };
    },
    shareData() {
      return {
        title: this.vgoodsList[this.swiperIndex]?.content,
        path: `/vgoods/edit/index${uni.$u.queryParams({
          id: this.vgoodsList[this.swiperIndex]?.id,
          user_id: this.$store.getters["user/userInfo"].id || "",
          store_id: this.$store.getters["currentStore"].id || "",
          // #ifdef APP-PLUS
          _platform: "app",
          // #endif
        })}`,
      };
    },
    tabBarData() {
      return this.$store.getters["tabBarData"];
    },
  },
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
/deep/.u-picker__view {
  background: red !important;
}

.body {
  background: #000;
  height: 100vh;
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */

  .page-title-box {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;

    display: flex;
    align-items: center;
    height: 88rpx;
    overflow: hidden;

    font-size: 30rpx;
    color: #fff;

    .back {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      padding: 30rpx;
      height: 100%;
    }

    .page-title {
      flex: 1;
      width: 0;
      height: 100%;
      padding-right: 200rpx;
	  padding-left: 20rpx;	
      display: flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
      overflow-x: auto;

      .tab {
        line-height: 88rpx;
        height: 88rpx;
        padding: 0 20rpx;
        text-align: center;
      }

      .checked {
        position: relative;

        &::after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: 10rpx;
          transform: translateX(-50%);
          width: 60rpx;
          border-bottom: 4rpx solid #fff;
          border-radius: 2rpx;
        }
      }
    }
  }

  .swiper {
    height: 100vh;

    .swiper-item {
      position: relative;
      width: 100%;
      height: 100%;

      > video {
        width: 100%;
        height: 100%;
      }

      .swiper-item-right {
        position: absolute;
        right: 20rpx;
        bottom: 40%;
        transform: translateY(50%);
        color: #fff;

        > .item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-bottom: 10rpx;
          font-size: 24rpx;

          .icon-shangpin,
          .icon-shangpin-img,
          .icon-dashang,
          .icon-pinglun,
          .icon-aixin1,
          .icon-cart-full,
          .icon-share {
            margin-bottom: 10rpx;
            text-align: center;
            line-height: 80rpx;
            width: 80rpx;
            height: 80rpx;
            border-radius: 50%;
            font-size: 60rpx;
          }

          

          > text:nth-child(2) {
            margin-top: -14rpx;
          }

          @keyframes switchScale {
            from {
              transform: scale(0.9);
            }

            to {
              transform: scale(1);
            }
          }

          .icon-shangpin,.icon-shangpin-img {
            background: #ff4f00;
            animation: switchScale 1s infinite alternate;
          }
        }

        .user-info {
          position: relative;
          margin-bottom: 30rpx;

          .user-img {
            width: 100rpx;
            height: 100rpx;
            border-radius: 50%;
            border: 1px solid rgba(200, 200, 200, 0.5);
          }

          .iconfont {
            position: absolute;
            bottom: 0;
            left: 50%;
            -webkit-transform: translate(-50%, 50%);
            transform: translate(-50%, 50%);
            width: 40rpx;
            height: 40rpx;
            line-height: 40rpx;
            border-radius: 50%;
            font-size: 24rpx;
            font-weight: 900;
            text-align: center;
            background: #ff4f00;
            color: #fff;
            border: 1px solid #fff;
          }
        }
      }

      .swiper-item-bottom-content {
        position: absolute;
        bottom: 30rpx;
        bottom: calc(30rpx + env(safe-area-inset-bottom));
        left: 20rpx;
        width: 560rpx;
        line-height: 40rpx;
        color: #f5f5f5;
      }
    }
  }
}

.goods-box-style6 {
  height: 50vh;

  .goods-item-style6 {
    margin-bottom: 20rpx;
    display: flex;
    justify-content: space-between;

    .goods-content-style6 {
      margin-left: 10rpx;

      .goods-bt {
        border-radius: 20rpx;
        padding: 4rpx 16rpx;
        background: #ff4544;
        color: #fff;
      }
    }
  }
}
</style>

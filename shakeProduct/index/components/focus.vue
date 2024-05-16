<template>
  <view style="height: 100%">
    <scroll-view
      refresher-enabled
      :refresher-triggered="pullStatus"
      @refresherpulling="onPull"
      @scrolltolower="loadData"
      scroll-y
      style="height: 100%"
    >
      <view v-if="pageData.list.length" class="list env-bottom">
        <div class="item" v-for="(item, i) in pageData.list" :key="i">
          <!-- 用户信息 -->
          <div class="user-info">
            <div
              @click="
                $utils.toUrl(
                  '/shakeProduct/homepage/index?user_id=' + item.user_id
                )
              "
              class="left"
            >
              <image :src="item.user_info.avatar_url" mode="aspectFill" />
              <view class="font-30">{{ item.user_info.nickname }}</view>
            </div>
            <div class="right flex-y-center color-999">
              <text class="font-26">{{ item.addtime }}</text>
              <text
                @click="onShowJubao(item)"
                class="iconfont icon-gengduo-x font-50 p-x-10"
              ></text>
            </div>
          </div>
          <!-- 媒体信息 -->
          <div @click="navDetail(item)" class="media-box m-b-20">
           <!-- <video
              v-if="item.video_url"
			  
              :controls="false"
              :show-center-play-btn="false"
              :src="item.cover_pic || item.video_url"
            ></video> -->
			<VideoImage
			  :videoUrl="item.video_url"
			  :imgUrl="item.cover_pic"
			></VideoImage>
       <!--     <swiper
              
              style="height: 750rpx"
              :indicator-dots="item.img_list && item.img_list.length > 1"
              circular
            >
              <swiper-item v-for="(img, i) in item.img_list" :key="i">
                <image :src="img.url" class="goods-img" mode="aspectFit" />
              </swiper-item>
            </swiper> -->

            <div
              v-if="item.video_url"
              class="video-img flex-y-center flex-x-center"
            >
              <text class="iconfont icon-sanjiao-right font-50"></text>
            </div>
          </div>

          <!-- 查看他提到的宝贝 -->
          <view
            v-if="item.goods_list.length"
            @click="onShowGoodsPopup(item)"
            class="goods-box m-b-20 p-x-20 p-b-20 border-b flex-y-center flex-x-sb"
          >
            <view class="color-999">查看TA提到的宝贝</view>
            <view class="flex-w-1 flex-y-center">
              <scroll-view scroll-x class="flex-w-1 p-x-20">
                <view style="white-space: nowrap">
                  <image
                    :src="item.cover_pic"
                    class="goods-img"
                    v-for="(item, i) in item.goods_list"
                    :key="i"
                    mode="aspectFill"
                  />
                </view>
              </scroll-view>
              <view class="iconfont icon-arrow-right"></view>
            </view>
          </view>

          <!-- 内容 -->
          <div class="content u-line-2 p-x-20 m-b-20" v-if="item.content">
            {{ item.content }}
          </div>

          <!-- 多功能按钮 -->
          <div class="more-btn flex-y-center p-x-20">
            <view
              @click="onClickShare(item)"
              class="font-left flex-w-1 iconfont icon-zhuanfa font-40 color-666"
            ></view>

            <view class="flex-y-center">
              <view @click="onDianzan(item)" class="m-l-20 flex-y-center">
                <text
                  :style="{
                    color: item.is_like ? 'red' : '#666',
                  }"
                  class="iconfont icon-dianzan font-40 color-666"
                ></text>
                <text>点赞</text>
              </view>
              <view @click="onComment(item)" class="m-l-20 flex-y-center">
                <text class="iconfont icon-pinglun font-40 color-666"></text>
                <text>评论</text>
              </view>
              <view @click="onDashang(item)" class="m-l-20 flex-y-center">
                <text class="iconfont icon-dashang font-40 color-666"></text>
                <text>打赏</text>
              </view>
            </view>
          </div>
        </div>

        <u-loadmore :status="pageData.status"></u-loadmore>
      </view>

      <u-empty v-else mode="data" :icon="wxapp_img.empty_data"> </u-empty>
    </scroll-view>
    <!-- 分享组件 -->
    <Share :showPopup.sync="showShare" :data="selectItem" type="vgoods"></Share>

    <GivePopup
      :show="showDaShang"
      :close.sync="showDaShang"
      :vgoods_id="selectItem.id"
    ></GivePopup>

    <CommentPopup
      :show="showComment"
      :cItem="selectItem"
      :close.sync="showComment"
    ></CommentPopup>

    <u-popup :show="showInform" round="20px" @close="showInform = false">
      <div class="inform-popup">
        <div @click="onSwitchGuanzhu" class="item">
          <text
            :class="
              selectItem.is_focus ? 'icon-quxiaoguanzhu-01' : 'icon-guanzhu1'
            "
            class="iconfont"
          ></text>
          <text>{{ selectItem.is_focus ? '取消关注' : '关注' }}</text>
        </div>
        <div @click="onJubao" class="item">
          <text class="iconfont icon-jubao"></text>
          <text>举报</text>
          <text class="font-24 color-999">搬运抄袭，违法内容</text>
        </div>
        <div @click="showInform = false" class="item">
          <view class="flex-w-1">取消</view>
        </div>
      </div>
    </u-popup>

    <!-- 商品弹框 -->
    <u-popup :show="showGoods" round="20rpx" @close="showGoods = false">
      <view class="goods-popup p-x-30">
        <view style="height: 80rpx" class="flex-y-center flex-x-sb">
          <text class="font-32"> 共{{ goods_list.length }}件商品 </text>
          <text
            @click="showGoods = false"
            class="iconfont icon-reeor font-50"
          ></text>
        </view>
        <scroll-view scroll-y v-if="goods_list.length" class="goods-box-style6">
          <view
            v-for="(goods, goodsIndex) in goods_list"
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
    <AttrPopup ref="AttrPopup" :goodsId="goodsId"></AttrPopup>
  </view>
</template>
<script>
import Share from '@/components/share/share';
import GivePopup from './give-popup';
import VideoImage from "@/components/video-image";
import CommentPopup from './comment-popup';
import AttrPopup from '@/components/goods/AttrPopup';
export default {
  components: {
    Share,
    GivePopup,
    CommentPopup,
    AttrPopup,
	VideoImage
  },
  data() {
    return {
      pageData: {
        page: 0,
        list: [],
        status: 'loadmore',
      },
      pullStatus: false, //下拉刷新状态
      showShare: false, //分享弹框
      showDaShang: false, //打赏弹框
      showComment: false, //评论弹框
      selectItem: '', //当前操作项
      showGoods: false, //商品弹框
      goods_list: '', //商品列表
      goodsId: '', //用于选中规格获取商品详情
      showInform: false, //举报弹框
    };
  },
  created(params) {
    this.loadData();
  },
  methods: {
    onClickShare(item) {
      this.selectItem = item;
      this.$emit('update:shareData', this.shareData);
      this.showShare = true;
    },
    async getGoodsList() {
      const res = await this.$requestAll.vgoods.vgoodsGoods({
        vgoods_id: this.selectItem.id,
      });

      this.goods_list = res.data.list;
    },
    async loadData() {
      if (this.pageData.status == 'nomore') return;
      const res = await this.$requestAll.vgoods.list(
        {
          page: this.pageData.page,
          cart_id: 0,
          type: 'like',
          from: 3,
        },
        true
      );
      console.log(res, 'like');
      this.pageData.list.push(...res.data.vgoods_list);
      this.pageData.page++;
      this.pageData.status =
        res.data.count <= this.pageData.list.length ? 'nomore' : 'loadmore';
    },
    // 下拉刷新
    onPull() {
      if (this.pullStatus) return;
      this.pullStatus = true;
      this.pageData = this.$options.data().pageData;
      this.loadData().then(() => {
        this.pullStatus = false;
      });
    },
    // 打赏
    onDashang(item) {
      this.selectItem = item;
      this.showDaShang = true;
    },
    // 点赞
    async onDianzan(item) {
      const res = await this.$requestAll.vgoods.vgoodsGood(
        {
          id: item.id,
          status: item.is_like ? 0 : 1,
        },
        true
      );
      item.is_like = item.is_like ? 0 : 1;
    },
    onComment(item) {
      this.selectItem = item;
      this.showComment = true;
    },
    onShowGoodsPopup(item) {
      let olvItem = JSON.stringify(this.selectItem);
      this.selectItem = item;
      if (!olvItem || item.id != olvItem.id) {
        this.getGoodsList().then(() => {
          this.showGoods = true;
        });
      } else {
        this.showGoods = true;
      }
    },
    clickAdd(goods) {
      this.goodsId = goods.id;
      this.$refs['AttrPopup'].showPopup('addCart');
    },
    // 举报弹框显示
    onShowJubao(item) {
      this.selectItem = item;
      this.showInform = true;
    },
    // 举报提交
    async onJubao() {
      const res = await this.$requestAll.vgoods.reportVgoods(
        {
          vgoods_id: this.selectItem.id,
        },
        true
      );
      uni.$u.toast(res.msg);
      this.showInform = false;
    },
    // 关注切换
    async onSwitchGuanzhu() {
      const res = await this.$requestAll.vgoods.focus({
        id: this.selectItem.id,
        type: this.selectItem.is_focus,
      });
      uni.$u.toast(res.msg);
      this.selectItem.is_focus = this.selectItem.is_focus == 1 ? 0 : 1;
      const i = this.pageData.list.findIndex(
        item => item.id == this.selectItem.id
      );
      this.pageData.list[i].is_focus = this.selectItem.is_focus;
    },
    navDetail(item) {
      if (item.video_url) {
        this.$utils.toUrl('/vgoods/edit/index?pageType=1&id=' + item.id);
      } else {
        this.$utils.toUrl(
          '/shakeProduct/user_info/index' +
            uni.$u.requeryParams({ id: item.id, cart_id: item.cart_id })
        );
      }
    },
  },
  computed: {
    shareData() {
      let params = {
        id: this.selectItem.id,
        cart_id: this.selectItem.cart_id,
        pageType: 1,
        user_id: this.$store.getters['user/userInfo'].id || '',
        store_id: this.$store.getters['currentStore'].id || '',
        // #ifdef APP-PLUS
        _platform: 'app',
        // #endif
      };
      if (!this.selectItem.video_url) {
        delete params.pageType;
        delete params.cart_id;
      }
      return {
        title: this.selectItem.content,
        imageUrl: this.selectItem.cover_pic,
        path: `${
          !this.selectItem.video_url
            ? '/shakeProduct/user_info/index'
            : '/vgoods/edit/index'
        }${uni.$u.queryParams(params)}`,
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
}

.list {
  padding-top: 20rpx;

  .item {
    background: #fff;
    padding: 10rpx 0;
    border-radius: 10rpx;
    margin-bottom: 20rpx;
    font-size: 30rpx;
    .user-info {
      display: flex;
      align-items: center;
      padding: 10rpx 20rpx;
      .left {
        flex: 1;
        width: 0;
        display: flex;
        align-items: center;
        > image {
          width: 80rpx;
          height: 80rpx;
          border-radius: 50%;
          margin-right: 20rpx;
        }
      }
    }

    .media-box {
      position: relative;
      background: #000;
      > video {
        width: 100%;
        max-height: 750rpx;
      }
      .goods-img {
        width: 100%;
        height: 750rpx;
      }
      .video-img {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        color: #f5f5f5;
      }
    }

    .goods-box {
      .goods-img {
        display: inline-block;
        width: 70rpx;
        height: 70rpx;
        border-radius: 10rpx;
        margin-right: 20rpx;
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

.inform-popup {
  .item {
    font-size: 30rpx;
    display: flex;
    align-items: center;
    padding: 0 30rpx;
    height: 100rpx;
    border-bottom: 1px solid #eee;
    > text {
      margin-right: 10rpx;
    }
    &:nth-last-child(1) {
      border-bottom: 0 solid #000;
      text-align: center;
    }
  }
}
</style>

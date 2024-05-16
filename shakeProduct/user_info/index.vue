<template>
  <view v-if="pageData" class="body">
    <view v-if="pageData.list.length" class="list env-bottom">
      <template v-for="(item, i) in pageData.list">
        <div :key="i" class="item" v-if="item.user_info">
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
          <div class="p-20">
            <div class="flex flex-wrap">
              <div
                :class="['image-view', item.img_list.length == 1 && 'image-view-1']"
                
                v-for="(imgObj, i1) in item.img_list"
                :key="i1"
              >
                <image
                  @click.stop="previewImage(item, i1)"
                  mode="widthFix"
                  :src="imgObj.url"
                  style="width: 100%"
                ></image>
              </div>
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
          <div class="p-x-20 m-b-20 color-666 u-font-26" v-if="item.content">
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
      </template>

      <u-loadmore :status="pageData.status"></u-loadmore>
    </view>
    <u-empty v-else mode="data" :icon="wxapp_img.empty_data"> </u-empty>

    <!-- 分享组件 -->
    <Share :showPopup.sync="showShare" :data="selectItem" type="vgoods"></Share>

    <!-- 打赏 -->
    <GivePopup
      :show="showDaShang"
      :close.sync="showDaShang"
      :vgoods_id="selectItem.id"
    ></GivePopup>

    <!-- 评论 -->
    <CommentPopup
      :show="showComment"
      :cItem="selectItem"
      :close.sync="showComment"
    ></CommentPopup>

    <!-- 举报 -->
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
import GivePopup from '../index/components/give-popup';
import CommentPopup from '../index/components/comment-popup';
import AttrPopup from '@/components/goods/AttrPopup';
import share from '@/mixins/share';
export default {
  components: {
    Share,
    GivePopup,
    CommentPopup,
    AttrPopup,
  },
  mixins: [share],
  data() {
    return {
      pageData: {
        list: [],
        status: 'loadmore',
        page: 1,
      },
      cara_id: '', //params传递数据
      id: '', //params传递数据
      showGoods: false, //商品弹框
      showComment: false, //评论弹框
      selectItem: '', //选中数据
      showShare: false, //分享弹框
      showDaShang: false, //打赏弹框
      showInform: false, //举报弹框
      goods_list: '', //商品列表
      goodsId: '', //用于获取商品详情
    };
  },
  onLoad(params) {
    this.id = params.id;
    this.cart_id = params.cart_id;
    this.loadData();
  },
  onShow() {},
  methods: {
    onClickShare(item) {
      this.selectItem = item;
      this.showShare = true;
    },
    async loadData() {
      if (this.pageData.status == 'nomore') return;
      const res = await this.$requestAll.vgoods.imgDetail({
        page: this.pageData.page,
        cart_id: this.cart_id,
        vgoods_id: this.id,
      });
      this.pageData.list.push(...res.data.vgoods_list);
      this.pageData.page++;
      this.pageData.status =
        res.data.vgoods_list.length < 10 ? 'nomore' : 'loadmore';
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
    // 点击评论
    onComment(item) {
      this.selectItem = item;
      this.showComment = true;
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
    async getGoodsList() {
      const res = await this.$requestAll.vgoods.vgoodsGoods(
        {
          vgoods_id: this.selectItem.id,
        },
        true
      );

      this.goods_list = res.data.list;
    },
    // 显示商品
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
    // 选择规格
    clickAdd(goods) {
      this.goodsId = goods.id;
      this.$refs['AttrPopup'].showPopup('addCart');
    },
    previewImage(item,i1) {
      this.$utils.previewImage(
        item.img_list.map(te => te.url),
        i1
      );
    },
  },
  computed: {
    shareData() {
      let shareItem = this.selectItem;
      if (!shareItem.id || this.pageData.list.length) {
        shareItem = this.pageData.list[0];
      }
      if (!shareItem) return;
      return {
        title: shareItem.content,
        imageUrl: shareItem.cover_pic,
        path: `/shakeProduct/user_info/index${uni.$u.queryParams({
          id: shareItem.id,
          cart_id: shareItem.cart_id,
          user_id: this.$store.getters['user/userInfo'].id || '',
          store_id: this.$store.getters['currentStore'].id || '',
          // #ifdef APP-PLUS
          _platform: 'app',
          // #endif
        })}`,
      };
    },
  },
  watch: {},
  onReachBottom() {
    this.loadData();
  },
  onPullDownRefresh() {},
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
.image-view {
  position: relative;
  width: 228rpx;
  max-height: 228rpx;
  overflow: hidden;
  margin-right: 12rpx;
  margin-bottom: 12rpx;
  &:nth-child(3n) {
    margin-right: 0;
  }
  image {
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
  }
}
.image-view-1 {
  width: 710rpx;
  max-height: 710rpx;
}
</style>

<template>
  <view
    v-if="param.list && param.list[0].goods_list.length"
    class="pintuan-index-group"
  >
    <view class="pintuan-index-title">
      <view class="pintuan-index-name">超值拼团</view>
      <view class="pintuan-index-more" @click="onClickMore">
        <text>限量拼团，每日必逛</text>
        <text class="iconfont icon-arrow-right color-999 font-22"></text>
      </view>
    </view>

    <template v-if="!mch_id">
      <view class="pintuan-index-goods_group" v-if="param.list_style == 4">
        <view v-for="(item, index) of param.list[0].goods_list" :key="index">
          <view class="pintuan-index-box" @click="onGoods(item.id)">
            <view class="pintuan-index-goods_img">
              <image :src="item.cover_pic" />
              <view v-if="item.residue" class="pintuan-index-residue">
                剩余{{ item.residue }}件
              </view>
            </view>
            <view class="pintuan-index-name">{{ item.name }}</view>
            <view class="pintuan-index-price">
              <text>{{ item.price }}</text>
              <view style="margin-top: 10rpx">
                <text class="pintuan-index-label">{{
                  item.price_content
                }}</text>
              </view>
            </view>
            <view class="pintuan-index-before_price">
              ￥{{ item.original_price }}
            </view>
          </view>
        </view>
        <view class="pintuan-index-right" @click="onClickMore">
          <text>查看更多</text>
          <text class="iconfont icon-arrow-right color-999 font-22"></text>
        </view>
      </view>

      <view class="goods_group" v-if="param.list_style == 1">
        <view
          class="box"
          v-for="(item, index) of param.list[0].goods_list"
          :key="index"
          @click="onGoods(item.id)"
        >
          <view class="goods_img">
            <image :src="item.cover_pic" mode="aspectFill" />
          </view>
          <view class="info">
            <view class="name">{{ item.name }}</view>

            <!-- 拼团进度条 -->
            <view class="progressBox" v-if="item.is_launch == 0">
              <view class="progress">
                <view
                  class="text"
                  :style="
                    'width:' +
                    ((item.place_order_num / item.group_num) * 100 || 0) +
                    '%'
                  "
                ></view>
              </view>
              <view class="progressNum">
                {{ item.place_order_num || 0 }}/{{ item.group_num }}
              </view>
            </view>
            <view class="priceBox">
              <view class="price">
                <view class="new">￥{{ item.price }}</view>
                <view class="old">￥{{ item.original_price }}</view>
              </view>

              <!-- 拼团人头像 -->
              <view class="userList" v-if="item.is_launch == 0">
               <!-- <view
                  class="userItem"
                  v-for="(user, idx) of item.avatar_url"
                  :key="idx"
                >
                  <image :src="user" mode="aspectFill" />
                </view> -->
              </view>
            </view>

            <!-- 多人拼团 -->
            <view class="ptInfo" v-if="item.success_num > 0">
              <view class="ptLeft">
                <image :src="wxapp_img.left" />
                <view class="text">
                  {{ item.group_num }}人拼团，{{ item.success_num }}人拼中商品
                </view>
              </view>
              <view class="ptRight">
                <image :src="wxapp_img.right" />
                <view class="text"
                  >未中奖励{{ item.subsidy_price }}元红包补贴</view
                >
              </view>
            </view>
          </view>
        </view>
      </view>
    </template>
    <template v-else>
      <!-- 大图模式 -->
      <div v-if="param.list_style == 0" class="goods_list_0">
        <div
          :class="['goods_' + param.style]"
          v-for="(item, index) of param.list[0].goods_list"
          :key="index"
          @click="onGoods(item.id)"
        >
          <div
            :style="{
              width: '702rpx',
              height: param.per == 1 ? '420rpx' : '702rpx',
            }"
          >
            <image
              :src="item.cover_pic"
              style="width: 100%; height: 100%; border-radius: 10rpx"
              :mode="param.fill == 1 ? 'aspectFill': 'aspectFit'"
            ></image>
          </div>

          <!-- 常规，边框 -->
          <div v-if="param.style <= 1" class="goods-content p-10">
            <div v-if="param.name" class="goods-name u-line-1 font-30">{{ item.name }}</div>
            <div class="price-bt m-t-10">
              <view class="">
                <text class="price-color"> {{ item.price_content }}</text>
                <text class="font-600-40 price-color m-x-10"
                  >￥{{ item.price }}
                </text>
                <text class="font-del font-24 color-999">
                  ￥{{ item.original_price }}
                </text>
              </view>
              <div :class="'buy_list_' + param.buy_list">
                {{ param.buy_content || param.buy_default }}
              </div>
            </div>
          </div>

          <!-- 剧中，边框剧中 -->
          <div v-else class="goods-content p-10 flex-x-sb">
            <div v-if="param.name" class="goods-name u-line-1 font-30 flex-w1">
              {{ item.name }}
            </div>
            <div class="price-bt">
              <view class="">
                <text class="price-color"> {{ item.price_content }}</text>
                <text class="font-600-40 price-color m-x-10"
                  >￥{{ item.price }}
                </text>
              </view>
            </div>
          </div>
        </div>
      </div>

      <!-- 一行一个 -->
      <div v-else-if="param.list_style == 1" class="goods_list_1">
        <div
          :class="['goods goods_' + param.style]"
          v-for="(item, index) of param.list[0].goods_list"
          :key="index"
          @click="onGoods(item.id)"
        >
          <div style="width: 200rpx; height: 200rpx">
            <image
              :src="item.cover_pic"
              style="width: 100%; height: 100%; border-radius: 10rpx"
              :mode="param.fill == 1 ? 'aspectFill': 'aspectFit'"
            ></image>
          </div>
          <div class="goods-content flex-w-1 m-l-10">
            <div class="goods-name u-line-2">{{ item.name }}</div>
            <div>
              <text class="price-color"> {{ item.price_content }}</text>
              <text class="font-600-40 price-color m-x-10"
                >￥{{ item.price }}
              </text>
            </div>

            <view class="flex-x-sb flex-y-center">
              <text class="font-del font-24 color-999">
                单买价￥{{ item.original_price }}
              </text>
              <div v-if="param.buy" :class="'buy_list_' + param.buy_list">
                {{ param.buy_content || param.buy_default }}
              </div>
            </view>
          </div>
        </div>
      </div>

      <!-- 一行两个 -->
      <div v-else class="goods_list_2">
        <div
          :class="['goods goods_' + param.style]"
          v-for="(item, index) of param.list[0].goods_list"
          :key="index"
          @click="onGoods(item.id)"
        >
          <div style="width: 340rpx; height: 340rpx">
            <image
              :src="item.cover_pic"
              style="width: 100%; height: 100%; border-radius: 10rpx"
              :mode="param.fill == 1 ? 'aspectFill': 'aspectFit'"
            ></image>
          </div>

          <div :class="(param.style == 2 || param.style == 3) && 'font-center'" class="goods-content p-10">
            <div v-if="param.name" class="goods-name u-line-2">
              {{ item.name }}
            </div>

            <div>
              <text class="price-color"> {{ item.price_content }}</text>
              <text class="font-600-40 price-color m-x-10"
                >￥{{ item.price }}
              </text>
            </div>

            <div>
              <text class="font-del font-24 color-999">
                单买价￥{{ item.original_price }}
              </text>
            </div>
          </div>
        </div>
      </div>
    </template>
  </view>
</template>

<script>
export default {
  name: 'DiyPinTuan',
  props: ['page_id', '_templateKey', 'item', 'mch_id'],
  data() {
    return {
      param: '',
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      if (this.page_id) {
        const formData = {
          page_id: this.page_id,
          _templateKey: this._templateKey,
          _templateItem: JSON.stringify(this.item),
          _template: this.item.type,
        };
        const res = await this.$requestAll.home.getTemplateData(formData);
        this.param = res.data.param;
      } else {
        this.param = this.item.param;
      }
    },
    onClickMore: function () {
      if (this.mch_id) {
        this.$utils.toUrl('/pt/index/index?mch_id=' + this.mch_id);
      } else {
        this.$utils.toUrl('/pt/index/index');
      }
    },
    onGoods: function (id) {
      this.$utils.toUrl('/pt/details/details?gid=' + id);
    },
  },
};
</script>

<style lang="scss" scoped>
$rpx: 2rpx;
.pintuan-index-group {
  background-color: #fff;
  // border-radius: 11 * $rpx;
  // margin: 0 14 * $rpx 0 * $rpx;
  padding: 0 12 * $rpx;
}

.pintuan-index-group .pintuan-index-title {
  display: flex;
  justify-content: space-between;
  height: 42 * $rpx;
  align-items: center;
}

.pintuan-index-group .pintuan-index-title .pintuan-index-name {
  font-size: 16 * $rpx;
  color: #222;
  font-weight: bold;
}

.pintuan-index-group .pintuan-index-title .pintuan-index-more {
  color: #999;
  font-size: 12 * $rpx;
}

.pintuan-index-group .pintuan-index-title .pintuan-index-more image {
  width: 5 * $rpx;
  height: 10 * $rpx;
  margin-left: 5 * $rpx;
  display: inline-block;
}

.pintuan-index-group .pintuan-index-goods_group {
  display: flex;
  overflow: scroll;
}

.pintuan-index-group .pintuan-index-goods_group .pintuan-index-box {
  margin-right: 5 * $rpx;
}

.pintuan-index-group
  .pintuan-index-goods_group
  .pintuan-index-box
  .pintuan-index-goods_img {
  position: relative;
}

.pintuan-index-group
  .pintuan-index-goods_group
  .pintuan-index-box
  .pintuan-index-goods_img
  image {
  width: 80 * $rpx;
  height: 80 * $rpx;
  background-color: #ccc;
  border-radius: 7 * $rpx;
}

.pintuan-index-group
  .pintuan-index-goods_group
  .pintuan-index-box
  .pintuan-index-goods_img
  .pintuan-index-residue {
  font-size: 10 * $rpx;
  background: linear-gradient(90deg, #fe7201, #fe0401);
  color: #fff;
  position: absolute;
  bottom: 4 * $rpx;
  width: 50 * $rpx;
  text-align: center;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 8 * $rpx;
  line-height: 16 * $rpx;
}

.pintuan-index-group .pintuan-index-goods_group .pintuan-index-name {
  width: 80 * $rpx;
  font-size: 12 * $rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pintuan-index-group .pintuan-index-goods_group .pintuan-index-price {
  font-size: 13 * $rpx;
  font-weight: bold;
  color: #fa2c19;
}

.pintuan-index-group .pintuan-index-goods_group .pintuan-index-price::before {
  content: '￥';
  font-size: 9 * $rpx;
}

.pintuan-index-group
  .pintuan-index-goods_group
  .pintuan-index-price
  .pintuan-index-label {
  font-size: 8 * $rpx;
  font-weight: bold;
  height: 11 * $rpx;
  background: linear-gradient(90deg, #fe7201, #fe0401);
  border-radius: 3 * $rpx;
  text-align: center;
  line-height: 11 * $rpx;
  padding: 0 3 * $rpx;
  color: #fff;
  position: relative;
  top: -2 * $rpx;
}

.pintuan-index-group .pintuan-index-goods_group .pintuan-index-before_price {
  color: #999;
  font-size: 10 * $rpx;
  text-decoration: line-through;
  margin-bottom: 10 * $rpx;
}

.pintuan-index-group .pintuan-index-right {
  writing-mode: tb;
  border-radius: 7 * $rpx;
  background-color: #f6f6f6;
  height: 105 * $rpx;
  width: 45 * $rpx;
  text-align: center;
  line-height: 45 * $rpx;
}

.pintuan-index-group .pintuan-index-right {
  text {
    color: #999999;
    font-size: 12 * $rpx;
  }
  > .icon-arrow-right {
    position: relative;
    left: -4rpx;
  }
}

.pintuan-index-group .pintuan-index-right image {
  width: 5 * $rpx;
  height: 10 * $rpx;
  margin-top: 7 * $rpx;
  display: inline-block;
}
</style>

<!--竖版样式-->
<style lang="scss" scoped>
$rpx: 2rpx;
.group .title .name {
  font-size: 32 * $rpx;
  color: #222;
  font-weight: bold;
}

.group .title .more image {
  width: 10 * $rpx;
  height: 20 * $rpx;
  margin-left: 10 * $rpx;
}

.box {
  margin-bottom: 10 * $rpx;
  width: 100%;
  display: flex;
}

.box .goods_img {
  position: relative;
}

.box .goods_img image {
  width: 150 * $rpx;
  height: 150 * $rpx;
  background-color: #ccc;
  border-radius: 14 * $rpx;
}

.box .info {
  flex: auto;
  width: 0;
  display: flex;
  flex-direction: column;
  margin-left: 20 * $rpx;
}

.box .name {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  /*font-size: 30*$rpx;*/
  color: #333;
}

.box .priceBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10 * $rpx;
}

.priceBox .price {
  display: flex;
  align-items: baseline;
}

.priceBox .price .new {
  display: flex;
  align-items: baseline;
  color: #ff0033;
  font-size: 100%;
}

.price .new text:nth-child(2) {
  font-size: 32 * $rpx;
  font-weight: 500;
}

.price .old {
  font-size: 100%;
  color: #999;
  text-decoration: line-through;
}

.userList {
  display: flex;
  align-items: center;
}

.userList .userItem:nth-child(n) {
  z-index: n -3;
}

.userList .userItem:last-child {
  background-color: #ccc;
  font-size: 22 * $rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  letter-spacing: -4 * $rpx;
}

.userItem {
  position: relative;
  width: 36 * $rpx;
  height: 36 * $rpx;
  box-sizing: border-box;
  border: 1 * $rpx solid #fff;
  border-radius: 50%;
  background-color: #f5f5f5;
  margin-left: -10 * $rpx;
}

.userItem image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.box.right text {
  color: #999999;
  font-size: 24 * $rpx;
}

.box.right image {
  width: 10 * $rpx;
  height: 20 * $rpx;
  margin-top: 14 * $rpx;
  position: relative;
  right: 6 * $rpx;
}

.ptInfo {
  width: 100%;
  min-height: 25%;
  display: flex;
  align-items: center;
  margin-top: 15 * $rpx;
}

.ptInfo .ptLeft,
.ptInfo .ptRight {
  height: 100%;
  position: relative;
  font-size: 80%;
}

.ptInfo .ptLeft .text,
.ptInfo .ptRight .text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  text-align: center;
}

.ptInfo .ptRight .text {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ptInfo .ptLeft image,
.ptInfo .ptRight image {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
}

.ptInfo .ptLeft {
  min-width: 50%;
  color: #fff;
}

.ptInfo .ptLeft .text {
  padding: 1 * $rpx 2 * $rpx 1 * $rpx 1 * $rpx;
}

.ptInfo .ptRight {
  flex: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #ff643d;
  justify-content: center;
}

.progressBox {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10 * $rpx;
}

.progressNum {
  font-size: 100%;
  color: #c8674c;
}

.progress {
  width: 90%;
  height: 20 * $rpx;
  background-color: #f5f5f5;
  overflow: hidden;
  border-radius: 99 * $rpx;
}

.progress .text {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #f22300, #ff4c17);
  border-radius: 99 * $rpx;
}

// 大图模式
.goods_list_0 {
  .price-color {
    color: #ff4544;
  }
  .goods_0,
  .goods_1,
  .goods_2,
  .goods_3 {
    margin-bottom: 10rpx;
    &:nth-last-child(1) {
      margin-bottom: 0;
    }
    .price-bt {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .buy_list_1 {
        padding: 0 20rpx;
        border-radius: 40rpx;
        line-height: 46rpx;
        background: #ff4544;
        color: #fff;
        font-size: 24rpx;
      }

      .buy_list_2,
      .buy_list_4 {
        padding: 0 20rpx;
        border-radius: 4rpx;
        line-height: 46rpx;
        font-size: 24rpx;
        border: 1px solid #ff4544;
        color: #ff4544;
      }
      .buy_list_4 {
        border-radius: 40rpx;
      }

      .buy_list_5 {
        padding: 0 20rpx;
        border-radius: 4rpx;
        line-height: 46rpx;
        background: #ff4544;
        color: #fff;
        font-size: 24rpx;
      }
    }
  }
  .goods_1,
  .goods_3 {
    border: 1px solid #f2f2f2;
  }

  .goods_2,
  .goods_3 {
    .price-bt {
      white-space: nowrap;
    }
  }
}

// 一行一个
.goods_list_1 {
  .goods {
    display: flex;
    margin-bottom: 10rpx;
    &:nth-last-child(1) {
      margin-bottom: 0;
    }

    .goods-name {
      line-height: 45rpx;
      height: 90rpx;
    }

    .buy_list_1 {
      padding: 0 20rpx;
      border-radius: 40rpx;
      line-height: 46rpx;
      background: #ff4544;
      color: #fff;
      font-size: 24rpx;
    }

    .buy_list_2,
    .buy_list_4 {
      padding: 0 20rpx;
      border-radius: 4rpx;
      line-height: 46rpx;
      font-size: 24rpx;
      border: 1px solid #ff4544;
      color: #ff4544;
    }
    .buy_list_4 {
      border-radius: 40rpx;
    }

    .buy_list_5 {
      padding: 0 20rpx;
      border-radius: 4rpx;
      line-height: 46rpx;
      background: #ff4544;
      color: #fff;
      font-size: 24rpx;
    }
  }

  .goods_1,
  .goods_3 {
    border: 1px solid #f2f2f2;
  }
}

// 一行两个
.goods_list_2 {
  display: flex;
  flex-wrap: wrap;
  .goods {
    width: 340rpx;
    margin-right: 22rpx;
    margin-bottom: 10rpx;
    &:nth-child(2n) {
      margin-right: 0;
    }
    &:nth-last-child(1),
    &:nth-last-child(2) {
      margin-bottom: 0;
    }

    .goods-name {
      line-height: 45rpx;
      height: 90rpx;
    }
  }
  .goods_1,
  .goods_3 {
    border: 1px solid #f2f2f2;
  }
}
</style>

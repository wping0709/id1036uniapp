<template>
  <view v-if="pageData" class="body">
    <swiper indicator-dots autoplay circular style="height: 750rpx">
      <swiper-item v-for="(item, index) in pageData.pic_list" :key="index">
        <image
          :src="item.pic_url"
          mode="aspectFill"
          style="width: 100%; height: 100%"
        />
      </swiper-item>
    </swiper>

    <div class="msg">
      <div class="goods-name">
        {{ pageData.name }}
      </div>
      <view class="m-y-20">
        <u-line-progress
          :percentage="pageData.percent"
          :showText="true"
          activeColor="#ffdb02"
          inactiveColor="#f2f2f2"
          height="20rpx"
        ></u-line-progress>
      </view>
      <view class="flex-x-sa flex-y-center p-b-20">
        <view class="flex-col flex-x-center flex-y-center">
          <view class="font-700 font-36 m-b-10">{{ pageData.people_num }}</view>
          <view class="flex-y-center">
            <text class="iconfont icon-yonghu font-32"></text>
            <text class="m-l-10 font-24">支持人数</text>
          </view>
        </view>
        <view class="flex-col flex-x-center flex-y-center">
          <view class="font-700 font-36 m-b-10">
            {{ pageData.had_crowdfund_price }}
          </view>
          <view class="flex-y-center">
            <text class="iconfont icon-yonghu font-32"></text>
            <text class="m-l-10 font-24">已筹金额</text>
          </view>
        </view>
        <view class="flex-col flex-x-center flex-y-center">
          <view class="font-700 font-36 m-b-10">
            <u-count-down
              :time="pageData.crowdfund.end_time * 1000 - new Date().getTime()"
              format="DD天HH时mm分"
            ></u-count-down>
          </view>
          <view class="flex-y-center">
            <text class="iconfont icon-yonghu font-32"></text>
            <text class="m-l-10 font-24">剩余时间</text>
          </view>
        </view>
      </view>
    </div>

    <div>
      <u-parse :content="pageData.detail"></u-parse>
    </div>

    <div class="bottom">
      <div class="fixed">
        <view class="flex-grow-1 flex-y-center flex-x-sa">
          <view
            @click="onShoucang"
            class="flex-y-center flex-x-center flex-col"
          >
            <text
              v-if="!pageData.user_collection"
              class="iconfont icon-collection font-50"
            ></text>
            <text
              v-else
              class="iconfont icon-collection-fill font-50"
              style="color: #bd9474"
            ></text>
            <text class="font-24 m-t-10"
              >收藏{{ pageData.collection_count }}</text
            >
          </view>
          <view
            @click="switchBoolean('showShare')"
            class="flex-y-center flex-x-center flex-col"
          >
            <text class="iconfont icon-share font-50"></text>
            <text class="font-24 m-t-10">分享</text>
          </view>
        </view>
        <view class="flex-grow-0">
          <div v-if="!isEnd" @click="submit" class="btn">
            去支付（￥{{ pageData.price }}）
          </div>
          <div v-else class="btn" style="background: #8c8c8c">已结束</div>
        </view>
      </div>
    </div>

    <AttrPopup :goodsId="id" ref="AttrPopup" type="crowdfund"></AttrPopup>

    <Share :showPopup.sync="showShare" :data="id" type="crowdfund"></Share>

    <QOfficialAccount></QOfficialAccount>
  </view>
</template>
<script>
import AttrPopup from '@/components/goods/AttrPopup';

import Share from '@/components/share/share';
import share from '@/mixins/share';
export default {
  mixins: [share],
  components: {
    Share,
    AttrPopup,
  },
  data() {
    return {
      id: '',
      pageData: '',
      showShare: false,
    };
  },
  onLoad(params) {
    this.id = params.id || '';

    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      const res = await this.$requestAll.crowdfund.details({
        id: this.id,
      });
      this.pageData = res.data;
      uni.setNavigationBarTitle({ title: res.data.name });
    },
    switchBoolean(key) {
      this[key] = !this[key];
    },
    async onShoucang() {
      const res = await this.$requestAll.crowdfund.collection(
        {
          status: Number(!this.pageData.user_collection),
          goods_id: this.id,
        },
        true
      );
      uni.$u.toast(res.msg);
      this.loadData();
    },
    submit() {
      this.$refs['AttrPopup'].showPopup('buy');
    },
  },
  computed: {
    shareData() {
      return {
        title: this.pageData.name,
        path:
          '/crowdfund/details/index' +
          uni.$u.queryParams({
            id: this.id,
            user_id: this.$store.getters['user/userInfo'].id || '',
            store_id: this.$store.getters['currentStore'].id || '',
            // #ifdef APP-PLUS
            _platform: 'app',
            // #endif
          }),
      };
    },
    isEnd() {
      if (this.pageData) {
        return this.pageData.crowdfund.end_time * 1000 <=  Number(new Date()) || this.pageData.percent >= 100;
      }
      return false;
    },
  },
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
  /deep/.u-count-down__text {
    line-height: initial;
  }
}

.msg {
  position: relative;
  top: -20rpx;
  border-radius: 20rpx 20rpx 0 0;
  background: #fff;
  padding: 0 40rpx;
  .goods-name {
    padding-top: 40rpx;
    font-weight: 700;
    font-size: 34rpx;
  }
}

.bottom {
  box-sizing: content-box;
  height: 100rpx;
  padding-bottom: env(safe-area-inset-bottom);
  .fixed {
    box-sizing: content-box;
    background: #fff;
    height: 100rpx;
    padding-bottom: env(safe-area-inset-bottom);
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    .iconfont {
      width: 50rpx;
      height: 50rpx;
    }

    .btn {
      margin-right: 20rpx;
      line-height: 80rpx;
      border-radius: 40rpx;
      padding: 0 30rpx;
      background: #bd9474;
      color: #fff;
      font-size: 32rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>

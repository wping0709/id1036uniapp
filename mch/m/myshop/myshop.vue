<template>
  <view v-if="pageData" class="body">
    <view class="shop-header flex-col flex-x-sb color-fff">
      <view class="price-switch-code flex-x-sb">
        <view class="switch-view">
          <view class="m-b-10">是否营业</view>
          <u-switch
            v-model="switchValue"
            @change="switchChange"
            activeColor="#1fa0ec"
            inactiveColor="#fff"
            size="18"
          ></u-switch>
        </view>
        <view class="price-box font-center">
          <view>今日付款金额(元)</view>
          <view class="font-50 m-t-30">{{ pageData.data1 }}</view>
        </view>
        <view
          @click="
            $utils.toUrl(
              '/pages/income-code/income-code?mch_id=' + pageData.mch.id
            )
          "
          class="code-box flex-col flex-y-center"
        >
          <view class="iconfont icon-QRcode font-50"></view>
          <view>收款码</view>
        </view>
      </view>

      <view class="shop-header-footer flex-x-sa flex-y-center font-30">
        <view class="flex-col flex-y-center flex-x-sb">
          <view>浏览人数</view>
          <view>{{ pageData.data2 }}</view>
        </view>
        <view class="flex-col flex-y-center flex-x-sb">
          <view>付款订单数</view>
          <view>{{ pageData.data3 }}</view>
        </view>
        <view class="flex-col flex-y-center flex-x-sb">
          <view>付款件数</view>
          <view>{{ pageData.data4 }}</view>
        </view>
      </view>
    </view>

    <div class="menu-box bg-fff">
      <div
        @click="$utils.toUrl('/mch/m/setting/setting')"
        class="menu-item flex-col flex-y-center flex-x-sb"
      >
        <image
          :src="wxapp_img.menu_1"
          mode="aspectFit"
          style="width: 100rpx; height: 100rpx"
        />
        <view class="m-t-20 font-28 color-666">店铺管理</view>
      </div>
      <div
        @click="$utils.toUrl('/mch/m/goods/goods')"
        class="menu-item flex-col flex-y-center flex-x-sb"
      >
        <image
          :src="wxapp_img.menu_2"
          mode="aspectFit"
          style="width: 100rpx; height: 100rpx"
        />
        <view class="m-t-20 font-28 color-666">商品管理</view>
      </div>
      <div
        @click="$utils.toUrl('/mch/m/cat/cat')"
        class="menu-item flex-col flex-y-center flex-x-sb"
      >
        <image
          :src="wxapp_img.icon_fenlei_active"
          mode="aspectFit"
          style="width: 100rpx; height: 100rpx"
        />
        <view class="m-t-20 font-28 color-666">分类管理</view>
      </div>
      <div
        @click="
          $utils.toUrl(
            '/mch/m/freight-list/freight-list?mch_id=' + pageData.mch.id
          )
        "
        class="menu-item flex-col flex-y-center flex-x-sb"
      >
        <image
          :src="wxapp_img.commander.menu_log_icon"
          mode="aspectFit"
          style="width: 100rpx; height: 100rpx"
        />
        <view class="m-t-20 font-28 color-666">运费规则</view>
      </div>

      <div
        @click="$utils.toUrl('/mch/m/order/order')"
        class="menu-item flex-col flex-y-center flex-x-sb"
      >
        <image
          :src="wxapp_img.menu_3"
          mode="aspectFit"
          style="width: 100rpx; height: 100rpx"
        />
        <view class="m-t-20 font-28 color-666">订单管理</view>
      </div>

      <div
        v-if="pageData.mchp.manghe"
        @click="$utils.toUrl('/mch/m/mhorder/order')"
        class="menu-item flex-col flex-y-center flex-x-sb"
      >
        <image
          :src="wxapp_img.menu_3"
          mode="aspectFit"
          style="width: 100rpx; height: 100rpx"
        />
        <view class="m-t-20 font-28 color-666">盲盒订单</view>
      </div>

      <div
        v-if="pageData.mchp.ms_root"
        @click="$utils.toUrl('/mch/m/order/order?pageType=ms')"
        class="menu-item flex-col flex-y-center flex-x-sb"
      >
        <image
          :src="wxapp_img.menu_3"
          mode="aspectFit"
          style="width: 100rpx; height: 100rpx"
        />
        <view class="m-t-20 font-28 color-666">秒杀订单管理</view>
      </div>
      <div
        v-if="pageData.mchp.pt_root"
        @click="$utils.toUrl('/mch/m/order/order?pageType=pt')"
        class="menu-item flex-col flex-y-center flex-x-sb"
      >
        <image
          :src="wxapp_img.menu_3"
          mode="aspectFit"
          style="width: 100rpx; height: 100rpx"
        />
        <view class="m-t-20 font-28 color-666">拼团订单管理</view>
      </div>
      <div
        v-if="pageData.mchp.book_root"
        @click="$utils.toUrl('/mch/m/order/order?pageType=yy')"
        class="menu-item flex-col flex-y-center flex-x-sb"
      >
        <image
          :src="wxapp_img.menu_3"
          mode="aspectFit"
          style="width: 100rpx; height: 100rpx"
        />
        <view class="m-t-20 font-28 color-666">预约订单管理</view>
      </div>
      <div
        @click="$utils.toUrl('/mch/m/tongji/tongji')"
        class="menu-item flex-col flex-y-center flex-x-sb"
      >
        <image
          :src="wxapp_img.menu_4"
          mode="aspectFit"
          style="width: 100rpx; height: 100rpx"
        />
        <view class="m-t-20 font-28 color-666">数据统计</view>
      </div>
      <div
        @click="$utils.toUrl('/mch/m/account/account')"
        class="menu-item flex-col flex-y-center flex-x-sb"
      >
        <image
          :src="wxapp_img.menu_5"
          mode="aspectFit"
          style="width: 100rpx; height: 100rpx"
        />
        <view class="m-t-20 font-28 color-666">资产</view>
      </div>
      <div
        @click="$utils.toUrl('/mch/m/shop-qrcode/shop-qrcode')"
        class="menu-item flex-col flex-y-center flex-x-sb"
      >
        <image
          :src="wxapp_img.menu_6"
          mode="aspectFit"
          style="width: 100rpx; height: 100rpx"
        />
        <view class="m-t-20 font-28 color-666">店铺二维码</view>
      </div>
      <!-- <div
        @click="
          $utils.toUrl(
            '/kefu/kefu?mch_id=' +
              pageData.mch.id +
              '&mobile=' +
              pageData.mch.service_tel
          )
        "
        class="menu-item flex-col flex-y-center flex-x-sb"
      >
        <image
          :src="wxapp_img.kefu"
          mode="aspectFit"
          style="width: 100rpx; height: 100rpx"
        />
        <view class="m-t-20 font-28 color-666">客服</view>
      </div> -->

      <!-- <div
        @click="$utils.toUrl('/mch/comment/comment')"
        class="menu-item flex-col flex-y-center flex-x-sb"
      >
        <image
          :src="wxapp_img.menu10"
          mode="aspectFit"
          style="width: 100rpx; height: 100rpx"
        />
        <view class="m-t-20 font-28 color-666">评论管理</view>
      </div> -->
    </div>

    <view
      @click="$utils.copy(pageData.pc_url, 'PC端管理网址已复制')"
      class="p-y-20 font-center font-30 color-999"
      style="padding-bottom: env(safe-area-inset-bottom)"
    >
      PC端管理网址
    </view>

    <!-- <u-popup v-model="showPcUrl" border="20" mode="center">
      <view style="width: 500rpx; padding: 40rpx 20rpx">
        <view class="font-center color-30 color-999">{{
          pageData.pc_url
        }}</view>
        <view class="font-center color-30 m-t-20" style="color: blue"
          >点击复制</view
        >
      </view>
    </u-popup> -->
  </view>
</template>

<script>
import share from '@/mixins/share.js';
export default {
  components: {},
  mixins: [share],
  data() {
    return {
      pageData: '',
      switchValue: false,
      showPcUrl: true,
      recommend_user_id: 0,
    };
  },
  onLoad(params) {
    if(params.scene) {
      params = this.$utils.wxParams(params)
      console.log(params);
      this.recommend_user_id = params.ruid||0
    }
    this.loadData();
  },
  methods: {
    async loadData() {
      uni.showLoading({
        title: '加载中',
      });
      const res = await this.$requestAll.mch.indexApply({}, true);
      // 如果没有申请过，或者申请未通过跳转apply
      if (!res.data.apply || res.data.apply.review_status != 1)
        this.$utils.toUrl(`/mch/apply/apply?recommend_user_id=${this.recommend_user_id}`, 'redirectTo');

      const res1 = await this.$requestAll.mch.userMyshop({}, true);
      this.pageData = res1.data;
      uni.setStorageSync('mch', res1.data.mch);
      this.switchValue = Boolean(res1.data.mch.is_business);
    },
    async switchChange() {
      await this.$requestAll.mch.userIsopen(
        {
          is_business: this.switchValue ? 1 : 0,
        },
        true
      );
    },
  },
  watch: {},
  computed: {},
};
</script>

<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
}
.shop-header {
  height: 380rpx;
  padding: 40rpx;
  background: -webkit-gradient(
    linear,
    0 0,
    0 bottom,
    from(#44b9fe),
    to(#028dde)
  );

  .switch-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #fff;
  }

  .shop-header-footer {
    > view {
      flex: 1;
      width: 0;
      height: 90rpx;
      &:nth-child(2) {
        border-left: 2rpx solid rgba($color: #fff, $alpha: 0.4);
        border-right: 2rpx solid rgba($color: #fff, $alpha: 0.4);
      }
    }
  }
}

.menu-box {
  padding: 20rpx 20rpx 20rpx;
  display: flex;
  flex-wrap: wrap;
  .menu-item {
    margin: 16rpx 0;
    width: 33.33%;
  }
}
</style>

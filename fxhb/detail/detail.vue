<template>
  <view v-if="pageData" class="body">
    <image class="body-bg" :src="wxapp_img.fxhb.bg" mode="aspectFill" />
    <div class="page-content">
      <div class="hongbao-info">
        <template v-if="pageData.hongbao.is_finish == 1 && pageData.my_coupon">
          <view class="p-t-20 font-center color-999"
            >恭喜您，已成功瓜分红包</view
          >

          <view
            :style="{
              background: 'url(' + wxapp_img.fxhb.coupon + ')',
              backgroundSize: '100% 100%',
              widht: '600rpx',
              height: '190rpx',
            }"
            class="flex-y-center flex-x-sb p-x-30"
          >
            <view class="flex-w-1" style="color: #8f4c1a">
              <view class="m-b-10 font-40">满减卷</view>
              <view>满{{ pageData.my_coupon.use_minimum }}可用</view>
            </view>
            <view class="font-700 font-40" style="color: #fe5b5c"
              >￥{{ pageData.my_coupon.money }}</view
            >
          </view>

          <button
            @click="$utils.toUrl('/pages/list/list')"
            class="button-initial share-bt flex-y-center flex-x-center"
          >
            <text>立即使用</text>
          </button>

          <button
            style="background: #ffb830"
            @click="$utils.toUrl('/fxhb/open/open')"
            class="button-initial share-bt flex-y-center flex-x-center"
          >
            <text>拆一个新红包</text>
          </button>
        </template>

        <!-- 未拆时间未到 -->
        <template v-else-if="pageData.rest_time > 0">
          <div class="user-list">
            <view
              class="user"
              v-for="(user, i) in pageData.hongbao_list"
              :key="i"
            >
              <image v-if="user" :src="user.avatar_url" mode="aspectFill" />
            </view>
          </div>

          <view class="font-center fon-22 color-666 m-t-20">
            <view
              >还差{{ pageData.rest_user_num }}人即可瓜分{{
                pageData.coupon_total_money
              }}元红包,快邀请好友来拆</view
            >
            <view class="m-t-10 flex-y-center flex-x-center">
              <u-count-down
                :time="pageData.rest_time * 1000"
                format="HH:mm:ss"
              ></u-count-down>
              <text>后结束</text>
            </view>
          </view>

          <template v-if="!parent_id">
            <button
              @click="switchShowPopup('showShare')"
              class="button-initial share-bt flex-y-center flex-x-center"
            >
              <i class="iconfont icon-wechat font-40 m-r-20"></i>
              <text>邀请好友一起拆</text>
            </button>
          </template>
          <template v-else>
            <button
              @click="onOpenAll"
              class="button-initial share-bt flex-y-center flex-x-center"
            >
              <text>一起拆红包</text>
            </button>
            <button
              @click="$utils.toUrl('/fxhb/open/open')"
              style="background: #ffb830"
              class="button-initial share-bt flex-y-center flex-x-center"
            >
              <i class="iconfont icon-wechat font-40 m-r-20"></i>
              <text>拆一个新红包</text>
            </button>
          </template>
        </template>

        <!-- 时间已经结束了 -->
        <template v-else>
          <view class="font-center fon-22 color-666 m-t-20">
            超过规定时间，该红包不能拆了
          </view>
          <view class="flex-y-center flex-x-center m-y-10">
            <image
              style="width: 200rpx; height: 200rpx"
              :src="wxapp_img.fxhb.cry"
              mode="aspectFit"
            />
          </view>

          <button
            @click="$utils.toUrl('/fxhb/open/open')"
            class="button-initial share-bt flex-y-center flex-x-center"
          >
            <text>拆一个新红包</text>
          </button>
        </template>
      </div>

      <view class="m-x-30">
        <u-divider
          text="更多商品推荐"
          textColor="#f2f2f2"
          lineColor="#f2f2f2"
        ></u-divider>
      </view>

      <GoodsList :goodsList="pageData.goods_list"></GoodsList>
    </div>

    <div class="rule">
      <view @click="switchShowPopup('showRule')">活动规则</view>
      <view @click="$utils.toUrl('/pages/index/index')">返回首页</view>
    </div>

    <u-modal
      @confirm="switchShowPopup('showRule')"
      :show="showRule"
      title="拆红包活动规则"
    >
      <view class="font-left">{{ pageData.rule }}</view>
    </u-modal>

    <u-popup
      :show="showYaoqing"
      @close="switchShowPopup('showYaoqing')"
      mode="center"
      :safeAreaInsetBottom="false"
      :round="10"
      closeable
    >
      <view
        class="popup-box"
        :style="{
          backgroundImage: 'url(' + wxapp_img.fxhb.share_modal_bg + ')',
        }"
      >
        <div class="popup-content">
          <view class="m-b-20"
            >还差
            <text
              class="m-x-10"
              style="font-size: 15pt; color: #ffc73f; font-weight: bold"
            >
              {{ pageData.rest_user_num }}
            </text>
            人即可拆红包</view
          >
          <view>
            一起瓜分
            <text
              class="m-x-10"
              style="font-size: 15pt; color: #ffc73f; font-weight: bold"
            >
              {{ pageData.hongbao.coupon_total_money }}
            </text>
            元
          </view>

          <button
            @click="switchShowPopup('showShare')"
            class="button-initial share-bt flex-y-center flex-x-center"
          >
            <i class="iconfont icon-wechat font-40 m-r-20"></i>
            <text>邀请好友一起拆</text>
          </button>
        </div>
      </view>
    </u-popup>

    <Share
      :showPopup.sync="showShare"
      :data="id"
      :isShowHB="false"
      type="chaihongbao"
    ></Share>

    <QOfficialAccount></QOfficialAccount>
    
  </view>
</template>
<script>
import GoodsList from '@/components/goods/GoodsList';
import share from '@/mixins/share';
import Share from '@/components/share/share';
export default {
  components: {
    GoodsList,
    Share,
  },
  mixins: [share],
  data() {
    return {
      id: '',
      pageData: '',
      showYaoqing: false,
      showRule: false,
      showShare: false,
    };
  },
  onLoad(params) {
    this.id = params.id;
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      const res = await this.$requestAll.fxhb.detail(
        {
          id: this.id,
        },
        true
      );
      this.pageData = res.data;
      if (
        res.data.rest_user_num > 0 &&
        !this.parent_id &&
        res.data.rest_time > 0
      ) {
        this.showYaoqing = true;
      }
    },
    switchShowPopup(key) {
      this[key] = !this[key];
    },
    // 俩人拆一个红包
    async onOpenAll() {
      const res = await this.$requestAll.fxhb.detailSubmit(
        {
          id: this.id,
          form_id: this.pageData.hongbao.form_id,
        },
        true
      );
      this.loadData();
    },
  },
  computed: {
    shareData() {
      return {
        title: this.pageData.share_title || '拆红包',
        imageUrl: this.pageData.share_pic || '',
        path: `/fxhb/detail/detail${uni.$u.queryParams({
          id: this.id,
          user_id: this.$store.getters['user/userInfo'].id || '',
          store_id:
            this.$store.getters['currentStore'].id || '',
          // #ifdef APP-PLUS
          _platform: 'app',
          // #endif
        })}`,
      };
    },
  },
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  position: relative;
  min-height: 100vh;
  background: #fe6b2e;
  /deep/.u-modal__title {
    padding-top: 20rpx;
  }
  /deep/.u-modal__content {
    padding-left: 20rpx;
    padding-right: 20rpx;
    justify-content: flex-start;
  }
  .body-bg {
    position: absolute;
    width: 100vw;
    height: 100vh;
  }
  .page-content {
    position: relative;
    z-index: 9;
    padding-top: 400rpx;
    .hongbao-info {
      background: rgba(255, 255, 255, 0.8);
      margin: 0 30rpx;
      padding: 20rpx;
      border-radius: 20rpx;
      .user-list {
        display: flex;
        flex-wrap: wrap;
        .user {
          width: 100rpx;
          height: 100rpx;
          border-radius: 50%;
          background: #fff;
          overflow: hidden;
          margin: 20rpx;
          border: 1px solid #ff5c5c;
          > image {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
  .rule {
    position: absolute;
    top: 60rpx;
    right: 0;
    z-index: 99;
    > view {
      margin-bottom: 20rpx;
      border-radius: 40rpx 0 0 40rpx;
      background: rgba(0, 0, 0, 0.4);
      color: #fff;
      padding: 10rpx 30rpx;
    }
  }
}

.popup-box {
  width: 606rpx;
  height: 816rpx;
  background-size: 100% 100%;
  padding-top: 70%;
  text-align: center;
  color: #888;
  font-size: 32rpx;
}
.share-bt {
  margin: 40rpx;

  line-height: 80rpx;
  border-radius: 40rpx;
  color: #fff;
  font-size: 32rpx;
  background: #ff5c5c;
}
</style>

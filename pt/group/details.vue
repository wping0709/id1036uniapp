<template>
  <view v-if="pageData" class="body">
	  <!-- #ifdef H5 -->
	  <!-- <view class="diy_header">
	  	<u-icon name="arrow-left" size="20" @click="backPrevious()"></u-icon>
	  </view> -->
	  <!-- #endif -->
    <div
      @click="$utils.toUrl('/pt/details/details?gid=' + goods.id)"
      v-for="(goods, i) in [pageData.goods]"
      :key="i"
      class="goods-item"
    >
      <image :src="goods.cover_pic" mode="aspectFill" />
      <div class="right flex-w-1">
        <view class="goods-name u-line-2">{{ goods.name }}</view>

        <view style="margin: 6rpx 0">
          <text class="price-color font-32">￥{{ goods.price }}</text>
          <text class="font-del color-999 m-l-20"
            >￥{{ goods.original_price }}</text
          >
        </view>

        <view class="btns">
          <view>{{ goods.group_num }}人团</view>
          <view>拼团省{{ goods.original_price - goods.price }}</view>
        </view>

        <image
          v-if="pageData.groupFail == 1"
          :src="wxapp_img.pt_success"
          class="status-img"
        ></image>
      </div>
    </div>

    <div class="pt-group">
      <div
        v-if="pageData.groupFail == 0"
        class="top-title flex-x-center flex-y-cneter"
      >
        还剩
        <text style="color: #ff5c5c">{{ pageData.surplus }}</text>
        人
        <template v-if="pageData.isLaunch">
          ，仅剩

          <u-count-down :time="countDown" format="DD:HH:mm:ss"></u-count-down>
          失效
        </template>
      </div>
      <div
        class="top-title flex-x-center flex-y-cneter"
        v-else-if="pageData.groupFail == 1"
      >
        拼团成功
      </div>
      <div
        class="top-title flex-x-center flex-y-cneter"
        v-else-if="pageData.groupFail == 2"
      >
        超过有效时间，
        <text>拼团失败</text>
      </div>
      <div
        class="top-title flex-x-center flex-y-cneter"
        v-else-if="pageData.groupFail == 3"
      >
        拼团结束
        <text v-if="pageData.inGroup">，未拼中</text>
      </div>

      <image :src="wxapp_img.pt.icon_pt_group_bg" mode="aspectFill" />

      <div class="head-pic flex-y-center flex-x-center">
        <div
          v-for="(group, i) in pageData.groupList"
          :key="i"
          class="head-pic-item"
        >
          <image
            v-if="group.avatar_url"
            :src="group.avatar_url"
            mode="aspectFill"
          />
          <image
            v-else
            :src="wxapp_img.pt.pt_no_group_num_pic"
            mode="aspectFill"
          ></image>
          <view v-if="i == 0">团长</view>
        </div>
      </div>
    </div>

    <div class="play-btn">
      <button
        v-if="!pageData.groupFail && pageData.inGroup"
        @click="showShare = true"
        class="button-initial pt_btn"
      >
        邀请好友
      </button>
      <button
        @click="$utils.toUrl('/pt/details/details?gid=' + pageData.goods.id)"
        class="button-initial pt_btn"
        v-if="pageData.groupFail && pageData.inGroup"
      >
        一键开团
      </button>
      <button
        @click="buyNow"
        class="button-initial pt_btn"
        v-if="!pageData.groupFail && !pageData.inGroup"
      >
        我要参团
      </button>
    </div>

    <div
      @click="
        $utils.toUrl('/pages/article-detail/article-detail?id=1&mch_id=0')
      "
      class="menu-item flex-y-center flex-x-sb"
    >
      <div class="left">拼团须知</div>

      <div class="color-999 flex-y-center">
        <text class="font-28">好友参团,人满发货,人不满退款</text>
        <text class="iconfont icon-arrow-right"></text>
      </div>
    </div>

    <div
      @click="$utils.toUrl('/pt/index/index')"
      class="menu-item flex-y-center flex-x-sb"
    >
      <div class="left">更多拼团</div>

      <div class="color-999 flex-y-center">
        <text class="font-28">更多</text>
        <text class="iconfont icon-arrow-right"></text>
      </div>
    </div>

    <view class="goods-list">
      <div
        @click="$utils.toUrl('/pt/details/details?gid=' + goods.id)"
        v-for="(goods, i) in pageData.goodsList"
        :key="i"
        class="goods-item"
      >
        <image :src="goods.cover_pic" mode="aspectFill" />
        <div class="right flex-w-1">
          <view class="goods-name u-line-2">{{ goods.name }}</view>

          <view style="margin: 6rpx 0">
            <text class="price-color font-32">￥{{ goods.price }}</text>
            <text class="font-del color-999 m-l-20"
              >￥{{ goods.original_price }}</text
            >
          </view>

          <view class="pt-info" v-if="goods.success_num > 0">
            <image :src="wxapp_img.vipcard.coupon_bg" mode="widthFix" />
            <div class="pt-content">
              <div class="pt-left">
                {{ goods.group_num }}人拼团，{{ goods.success_num }}人拼中商品
              </div>
              <div class="pt-right">未中奖励{{goods.subsidy_price}}元红包补贴</div>
            </div>
          </view>
        </div>
      </div>
    </view>

    <Share :showPopup.sync="showShare" type="pintuan" :data="{order_id}"></Share>
    <AttrPopup
      ref="AttrPopup"
      :showText="false"
      :pinTuanData="{ show: false, order_id: order_id }"
      type="pintuan"
      :goodsId="pageData.goods.id"
    ></AttrPopup>


    <QOfficialAccount></QOfficialAccount>

    
  </view>
</template>
<script>
import Share from '@/components/share/share';
import AttrPopup from '@/components/goods/AttrPopup';
import share from '@/mixins/share';
export default {
  components: {
    Share,
    AttrPopup,
  },
  mixins: [share],
  data() {
    return {
      pageData: '',
      order_id: '',
      user_id: '',
      showShare: false,
    };
  },
  onLoad(params) {
    this.order_id = params.oid;

    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      const res = await this.$requestAll.group.orderGroup({
        oid: this.order_id,
      });
      this.pageData = res.data;
    },
    // 我要参团
    buyNow() {
      this.$refs['AttrPopup'].showPopup('buy');
    },
	backPrevious() {
		uni.navigateBack({
				delta:1,
			})
	}
  },
  computed: {
    countDown() {
      if (this.pageData.limit_time_res) {
        let ss = this.pageData.limit_time_res.days * 24 * 60 * 60 * 1000;
        ss += this.pageData.limit_time_res.hours * 60 * 60 * 1000;
        ss += this.pageData.limit_time_res.mins * 60 * 1000;
        ss += this.pageData.limit_time_res.secs * 1000;
        return ss;
      }
      return 0;
    },
    shareData() {
      if (this.pageData) {
        return {
          title: `快来${this.pageData.goods.price}元拼 ${this.pageData.goods.name}`,
          path: `/pt/group/details${uni.$u.queryParams({
            oid: this.pageData.oid,
            user_id: this.$store.getters['user/userInfo'].id || '',
            store_id:
              this.$store.getters['currentStore'].id || '',
            // #ifdef APP-PLUS
            _platform: 'app',
            // #endif
          })}`,
        };
      }
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
  .diy_header{
	padding: 25rpx;
	background-color: #ffffff;
}
  .pt-group {
    position: relative;
    margin: 20rpx auto;
    width: 702rpx;

    // height: 214rpx;
    .top-title {
      color: #353535;
      padding-top: 52rpx;
      text-align: center;
    }

    > image {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }

    .head-pic {
      padding: 34rpx 40rpx 0 40rpx;
      flex-wrap: wrap;

      .head-pic-item {
        position: relative;

        > image {
          width: 70rpx;
          height: 70rpx;
          border-radius: 50%;
          margin: 0 10rpx;
        }

        > view {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translate(-50%, 50%);
          width: 56rpx;
          height: 30rpx;
          line-height: 30rpx;
          text-align: center;
          background-color: #ff5c5c;
          color: #fff;
          font-size: 20rpx;
          border-radius: 13rpx;
          position: absolute;
        }
      }
    }
  }

  .play-btn {
    margin: 20rpx 0;

    .pt_btn {
      margin: 0 auto;
      width: 650rpx;
      height: 88rpx;
      line-height: 88rpx;
      background-color: #ff5c5c;
      color: #fff;
      border-radius: 10rpx;
      color: #fff;
      font-size: 32rpx;
    }
  }

  .menu-item {
    height: 100rpx;
    background: #fff;
    padding: 0 20rpx;
    margin: 20rpx 0;
    font-size: 30rpx;
  }

  .goods-item {
    position: relative;
    background: #fff;
    padding: 20rpx;
    margin-bottom: 20rpx;
    display: flex;
    justify-content: space-between;

    > image {
      margin-right: 20rpx;
      width: 220rpx;
      height: 220rpx;
    }

    .goods-name {
      line-height: 40rpx;
      height: 80rpx;
      font-size: 30rpx;
    }

    .pt-info {
      position: relative;
      display: flex;
      width: 390rpx;

      .pt-content {
        position: absolute;
        width: 100%;
        height: 100%;
        padding: 0 10rpx;

        color: #fff;
        font-size: 24rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;

        > view {
          flex: 1;
          width: 0;
          text-align: center;

          &:nth-child(2) {
            flex: initial;
            width: 45%;
            margin-left: 25rpx;
            color: #ff643d;
          }
        }
      }
    }

    .btns {
      display: flex;

      > view {
        padding: 0 12rpx;
        background-color: #feeeee;
        margin-right: 8rpx;
        font-size: 26rpx;
        color: #ff5c5c;
      }
    }

    .status-img {
      position: absolute;
      right: 10rpx;
      bottom: 10rpx;
      width: 140rpx;
      height: 140rpx;
    }
  }
}
</style>

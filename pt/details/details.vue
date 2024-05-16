<template>
  <view v-if="pageData" class="body">
	  <!-- #ifdef H5 -->
	  <!-- <view class="diy_header">
	  	<u-icon name="arrow-left" size="20" @click="backPrevious()"></u-icon>
	  </view> -->
	  <!-- #endif -->
    <GoodsBanner
      :list="goodsData.pic_list"
      :goodsData="goodsData"
    ></GoodsBanner>

    <!-- 商品信息,  标题,价格,销量,七天无理由标签 -->
    <GoodsTitleMsg
      ref="GoodsTitleMsg"
      :goodsData="{ ...goodsData, goods_id: gid }"
      type="pintuan"
    ></GoodsTitleMsg>

    <!-- 选择规格 -->
    <view
      style="
        margin: 20rpx;
        border-radius: 30rpx;
        background: #fff;
        overflow: hidden;
      "
    >
      <AttrPopup
        :showText="true"
        ref="AttrPopup"
        :goodsId="gid"
        type="pintuan"
        :pinTuanData="{
          show: true,
          type: pintuan_type,
        }"
      ></AttrPopup>

      <view
        v-if="goodsData.brand_name"
        class="flex-y-center p-20 font-26"
        style="line-height: 50rpx"
      >
        <view class="color-999" style="margin-right: 30rpx">品牌</view>
        <view>{{ goodsData.brand_name }}</view>
      </view>

      <view
        v-if="goodsData.service.length"
        class="flex flex-wrap p-20 font-26"
        style="background: #fbfcfb; border-radius: 0 0 20rpx 20rpx"
      >
        <div
          class="flex-y-center m-r-10 color-666"
          style="line-height: 50rpx"
          v-for="(item, i) in goodsData.service"
          :key="i"
        >
          <i
            class="iconfont icon-success font-40"
            style="width: 50rpx; height: 50rpx"
          ></i>
          <text>{{ item }}</text>
        </div>
      </view>
    </view>

    <view class="group-list bg-fff m-y-20" v-if="pageData.groupList.length">
      <view class="flex-x-sb">
        <text class="font-w-700 font-30">
          <!-- 不需要团长展示已参团人数 -->
          <text v-if="goodsData.is_launch == 0" style="color: red">
            {{ pageData.groupList[0].now_join }}
          </text>
          <!-- 需要团长展示正在拼人 -->
          <text v-else style="color: red">
            {{ pageData.groupList.length }}
          </text>
          个团长正在拼团，可直接参与:
        </text>

        <view class="flex-y-center color-999">
          <!-- <text>更多</text>
          <text class="iconfont icon-arrow-right"></text> -->
        </view>
      </view>

      <view
        class="group-item flex-x-sb flex-y-center"
        v-for="(item, i) in pageData.groupList"
        :key="i"
      >
        <template v-if="!item.now_join">
          <view class="flex-y-center">
            <image class="user-avatar" :src="item.avatar_url"></image>
            <text class="m-l-20">{{ item.nickname }}</text>
          </view>
          <view class="flex-y-center">
            <view class="down-tieme font-24 font-center">
              <view style="color: red">还差{{ item.surplus }}人成团</view>
              <view class="flex-y-center">
                <text>还剩</text>
                <u-count-down
                  :time="countDown(item)"
                  format="HH:mm:ss"
                ></u-count-down>
              </view>
            </view>
            <div class="btn" @click="toCantuan(item)">去参团</div>
          </view>
        </template>

        <template v-else>
          <scroll-view scroll-x style="max-width: 260rpx; white-space: nowrap">
            <image
              v-for="(link, i) in item.avatar_url"
              :key="i"
              class="user-avatar"
              :src="link"
            ></image>
          </scroll-view>
          <view class="flex-y-center">
            <view class="down-tieme font-24 font-center">
              <view style="color: red">还差{{ item.surplus }}人成团</view>
              <view class="flex-y-center">
                <!-- <text>还剩</text>
                <u-count-down
                  :time="countDown(item)"
                  format="HH:mm:ss"
                ></u-count-down> -->
              </view>
            </view>
            <!-- <div class="btn" @click="toCantuan(item)">去参团</div> -->
          </view>
        </template>
      </view>
    </view>

    <div class="liucheng">
      <div class="flex-y-center flex-x-sb">
        <view class="font-w-700 font-30">拼团玩法</view>
        <view
          class="color-999 font-24"
          @click="$utils.toUrl('/pages/article-detail/article-detail?id='+pageData.groupRuleId)"
        >
          <text>详细规则</text>
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </div>
      <view v-if="goodsData.is_launch == 0" class="content p-t-20">
        <div class="img-text flex-col flex-y-center flex-x-center">
          <image
            :src="wxapp_img.pt.rule_1"
            mode="aspectFill"
            style="display: block; width: 50rpx; height: 50rpx"
          />
          <view>参与拼团</view>
          <view
            ><text class="price-color font-w-700">{{
              goodsData.group_num
            }}</text
            >人成团</view
          >
        </div>

        <image
          :src="wxapp_img.pt.rule_dian"
          mode="widthFix"
          style="width: 30rpx"
        />

        <div class="img-text flex-col flex-y-center flex-x-center">
          <image
            :src="wxapp_img.pt.rule_2"
            mode="aspectFill"
            style="display: block; width: 50rpx; height: 50rpx"
          />
          <view>
            <text class="price-color font-w-700">{{
              goodsData.success_num
            }}</text>
            人拼中发货
          </view>
          <view>
            <text class="price-color font-w-700">{{
              goodsData.group_num - goodsData.success_num
            }}</text>
            未拼中退款
          </view>
        </div>

        <template v-if="goodsData.subsidy_price > 0">
          <image
            :src="wxapp_img.pt.rule_dian"
            mode="widthFix"
            style="width: 30rpx"
          />

          <div class="img-text flex-col flex-y-center flex-x-center">
            <image
              :src="wxapp_img.pt.rule_3"
              mode="aspectFill"
              style="display: block; width: 50rpx; height: 50rpx"
            />
            <view>未拼中获得奖励</view>
            <view>
              <text class="price-color font-w-700"
                >￥{{ goodsData.subsidy_price }}</text
              >红包
            </view>
          </div>
        </template>
      </view>
    </div>

    <GoodsMch v-if="goodsData.mch_id > 0" :mchData="goodsData.mch"></GoodsMch>

    
    <GoodsComment :propsData="goodsData" type="pintuan"></GoodsComment>

    <GoodsDetail :goodsData="goodsData"></GoodsDetail>

    <!-- <div class="fixed-bottom">
      <div class="fixed">
        <div
          class="flex-col flex-x-center flex-y-center"
          @click="$utils.toUrl('/pages/index/index')"
        >
          <text class="iconfont icon-home font-50 color-666"></text>
          <text>首页</text>
        </div>
        <div class="right flex-w-1 flex-y-center flex-x-center">
          <div
            v-if="goodsData.is_only == 1"
            @click="onlyBuy"
            class="bt flex-col flex-x-center flex-y-center"
            :style="{
              background: '#feeeee',
              color: '#ff5c5c',
            }"
          >
            <view>￥{{ goodsData.single_price }}</view>
            <view>单独购买</view>
          </div>
          <div @click="submit" class="bt flex-col flex-x-center flex-y-center">
            <view>￥{{ goodsData.group_price }}</view>
            <view>立即参团</view>
          </div>
        </div>
      </div>
    </div> -->

    <GoodsFootNav
      @ok="submit"
      :goods.sync="goodsData"
      goodsType="PINTUAN"
      type="pintuan"
    ></GoodsFootNav>

    <QOfficialAccount></QOfficialAccount>
  </view>
</template>
<script>
import GoodsBanner from '@/pages/goods/components/goods-banner.vue';
import GoodsTitleMsg from '@/pages/goods/components/goods-title-msg';
import GoodsComment from '@/pages/goods/components/GoodsComment';
import GoodsMch from '@/pages/goods/components/goods-mch';

import GoodsFootNav from '@/pages/goods/components/GoodsFootNav';

import AttrPopup from '@/components/goods/AttrPopup';
import GoodsDetail from '@/pages/goods/components/GoodsDetail';
import share from '@/mixins/share.js';

export default {
  components: {
    GoodsBanner,
    GoodsTitleMsg,
    GoodsComment,
    GoodsMch,
    GoodsFootNav,
    AttrPopup,
    GoodsDetail,
  },
  mixins: [share],
  data() {
    return {
      pageData: '',
      goodsData: '',
      gid: '',
      pintuan_type: 'GROUP_BUY',
    };
  },
  onLoad(params) {
    this.gid = params.gid;
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.group.goodDetail({
        gid: this.gid,
      });
      if (
        !uni.getStorageSync('is_show_pt_xieyi') &&
        Number(res.data.setting && res.data.setting.is_prompt_box)
      ) {
        uni.showModal({
          title: '提示',
          content: res.data.setting.prompt_box_text,
          showCancel: true,
          cancelText: '不再提示',
          cancelColor: '#ff0000',
          success: ({ confirm, cancel }) => {
            cancel && uni.setStorageSync('is_show_pt_xieyi', true);
          },
        });
      }
      this.pageData = res.data;
      let pic_list = res.data.info.pic_list.map(item => {
        return { pic_url: item };
      });
      this.goodsData = { ...res.data.info, pic_list };
    },
    toCantuan(item) {
      if (this.countDown(item) <= 0 && typeof item.avatar_url == 'string')
        return uni.$u.toast('该拼团已结束');

      this.$utils.toUrl(
        `/pt/group/details?oid=${item.id}&user_id=${this.$store.getters['user/userInfo'].id}`
      );
    },
    onlyBuy() {
      this.pintuan_type = 'ONLY_BUY';
      this.$refs['AttrPopup'].showPopup('buy');
    },
    countDown(item) {
      if (item.limit_time) {
        let ss = item.limit_time.days * 24 * 60 * 60 * 1000;
        ss += item.limit_time.hours * 60 * 60 * 1000;
        ss += item.limit_time.mins * 60 * 1000;
        ss += item.limit_time.secs * 1000;
        return ss;
      }
      return 0;
    },
    submit(type) {
      if (type == 'buy') {
        this.pintuan_type = this.$options.data().pintuan_type;
        this.$refs['AttrPopup'].showPopup('buy');
      } else {
        this.onlyBuy();
      }
    },
	backPrevious() {
		uni.navigateBack({
				delta:1,
			})
	}
  },
  onShow() {},
  computed: {
    shareData() {
      return {
        title: this.goodsData.goods_share_title || this.goodsData.name,
        desc: this.goodsData.goods_share_desc || '',
        imgUrl: this.goodsData.goods_share_logo || '',
        path:
          '/pt/details/details' +
          uni.$u.queryParams({
            gid: this.gid,
            user_id: this.$store.getters['user/userInfo'].id || '',
            store_id: this.$store.getters['currentStore'].id || '',
            // #ifdef APP-PLUS
            _platform: 'app',
            // #endif
          }),
      };
    },
  },
  watch: {},
  onReachBottom() {},
  onPageScroll({ scrollTop }) {
    this.$refs['GoodsTitleMsg'].scroll({ scrollTop });
  },
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  .diy_header{
	padding: 25rpx;
	background-color: #ffffff;
}
  .group-list {
    padding: 20rpx;

    margin: 20rpx;
    border-radius: 30rpx;
    background: #fff;
    overflow: hidden;
    .group-item {
      border-radius: 10rpx;
      margin-top: 20rpx;
      height: 100rpx;
      background: #f5f5f5;
      padding: 0 20rpx;

      .user-avatar {
        width: 70rpx;
        height: 70rpx;
        border-radius: 50%;
        &:nth-child(n + 2) {
          margin-left: -25rpx;
        }
      }
      .btn {
        margin-left: 20rpx;
        width: 140rpx;
        height: 80rpx;
        line-height: 80rpx;
        text-align: center;
        font-size: 32rpx;
        background: #ff5c5c;
        color: #fff;
      }
    }
  }

  .liucheng {
    margin: 20rpx;
    border-radius: 30rpx;
    overflow: hidden;
    padding: 20rpx;
    background: #fff;

    .content {
      display: flex;
      align-items: center;
      justify-content: space-around;
      .img-text {
        font-style: 22rpx;
      }
    }
  }

  .fixed-bottom {
    height: 100rpx;
    height: calc(100rpx + env(safe-area-inset-bottom));
    .fixed {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 100rpx;
      height: calc(100rpx + env(safe-area-inset-bottom));
      background: #fff;
      padding: 0 20rpx 0 50rpx;
      padding-bottom: env(safe-area-inset-bottom);

      display: flex;
      align-items: center;
      .bt {
        margin-left: 20rpx;
        color: #fff;
        width: 540rpx;
        text-align: center;
        height: 70rpx;
        border-radius: 35rpx;
        background: linear-gradient(90deg, #f22300, #ff4c17);
        font-size: 22rpx;
      }
    }
  }
}
</style>

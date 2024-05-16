<template>
  <view v-if="pageData" class="body">
    <swiper
      :indicator-dots="true"
      :autoplay="false"
      :interval="5000"
      :duration="1000"
    >
      <swiper-item v-for="(item, i) in pageData.banner_list" :key="i">
        <view @click="$utils.toUrl(item.page_url)" class="swiper-item">
          <image
            :src="item.pic_url"
            mode="aspectFill"
            style="width: 100%; height: 100%"
          ></image>
        </view>
      </swiper-item>
    </swiper>

    <GoodsList
      :goodsList="goods_list"
      @onLottery="onLottery"
      showBt
    ></GoodsList>

    <BottomBar></BottomBar>

    <ToHomeButton></ToHomeButton>
  </view>
</template>
<script>
import GoodsList from "./components/GoodsList";
import ToHomeButton from "@/components/ToHomeButton";
import BottomBar from "./components/BottomBar.vue";
export default {
  components: {
    ToHomeButton,
    BottomBar,
    GoodsList,
  },
  data() {
    return {
      page: 1,
      load_more: "loadmore",
      goods_list: [],
      pageData: "",
      timeData: {},
    };
  },
  onLoad(params) {},
  onShow() {
    this.loadData();
  },
  methods: {
    async loadData() {
      if (this.load_more == "nomore") return;
      const res = await this.$requestAll.lottery.index(
        { page: this.page },
        true
      );
      this.pageData = res.data;
      this.goods_list.push(...res.data.new_list);
      this.page++;
      this.load_more = res.data.new_list.length < 5 ? "nomore" : "loadmore";
    },
    // 立即抽奖
    async onLottery(item) {
      console.log(item);
      await this.$utils.bindMessage(this.pageData.lottery_success_notice);
      this.$utils.toUrl(
        "/lottery/detail/detail" +
          uni.$u.queryParams({
            lottery_id: item.id,
            form_id: "",
          })
      );
    },
  },
  computed: {
    cpDown() {
      return function (endtime) {
        if (endtime) {
          let cTime = Math.round(new Date() / 1000);
          return (endtime - cTime) * 1000;
        }
        return 0;
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

swiper {
  height: 280rpx;

  .swiper-item {
    width: 100%;
    height: 100%;
  }
}

.list {
  .item {
    padding: 20rpx;
    background: #fff;
    margin-bottom: 20rpx;

    .left {
      margin-right: 20rpx;
      position: relative;

      > image {
        width: 220rpx;
        height: 220rpx;
        border-radius: 10rpx;
      }

      .num {
        position: absolute;
        left: 0;
        top: 0;
        border-radius: 0 20rpx 20rpx 0;
        background: #ffe4e7;
        padding: 0 10rpx;
        color: red;
      }
    }

    .right {
      .goods-name {
        line-height: 38rpx;
        height: 76rpx;
      }

      .goods-bt {
        line-height: 1.8;
        border-radius: 25rpx;
        background: #ff4544;
        color: #ffffff;
        padding: 0 20rpx;
      }
    }
  }
}
</style>

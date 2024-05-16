<template>
  <view class="body">
    <div class="head">
      <image :src="wxapp_img.blind.index_bg" mode="aspectFill" />
      <div class="head-content">
        <u-navbar
          @leftClick="$utils.backTo()"
          title="许愿盲盒"
          bgColor="initial"
          :safeAreaInsetTop="true"
          :placeholder="true"
        >
          <view slot="left">
            <text
              class="iconfont icon-arrow-left flex-y-center flex-x-center"
              style="color: #fff; font-size: 60rpx"
            ></text>
          </view>
        </u-navbar>

        <view class="blind-box">
          <scroll-view scroll-x style="width: 100%">
            <div class="blind-list">
              <view
                style="
                  background: #fff;
                  min-width: 560rpx;
                  border-radius: 20rpx;
                  margin-right: 20rpx;
                  padding: 24rpx;
                "
                v-for="item in hotBox"
                :key="item.id"
              >
                <BlindDetailRow :item="item" :option="option"></BlindDetailRow>
              </view>
              <!-- <div
                class="blind-item"
                @click="
                  $utils.toUrl('/blind/goods-detail/goods-detail?id=' + item.id)
                "
                
              >
                <image :src="item.cover_pic" mode="" />
                <div class="flex-w-1 flex-col flex-x-sb">
                  <view class="blind-name u-line-2">{{ item.name }}</view>
                  <view>
                    <view class="u-line-1 font-22 color-999"
                      >欧皇款价值¥{{ item.original_price }}</view
                    >
                    <view class="price-color">
                      <text>¥</text>
                      <text class="font-36">{{ item.price }}</text>
                    </view>
                  </view>
                </div>
              </div> -->
            </div>
          </scroll-view>
        </view>
      </div>
    </div>

    <div class="bottom-content">
      <view class="tabs">
        <view
          class="tab u-line-1"
          :class="i == tabIndex && 'activeTabs'"
          @click="switchTab(i)"
          v-for="(tab, i) in cat_list"
          :key="tab.id"
        >
          {{ tab.name }}
        </view>
      </view>
      <template v-if="box_list && box_list.length">
        <div class="blind-list">
          <div
            class="blind-item"
            @click="
              $utils.toUrl('/blind/goods-detail/goods-detail?id=' + item.id)
            "
            v-for="(item, i) in box_list"
            :key="i"
          >
            <image :src="item.cover_pic" mode="aspectFill" />
            <view class="p-10">
              <view class="blind-name u-line-2">{{ item.name }}</view>
              <view class="u-line-1 font-22 color-999"
                >{{ option.mh_prefix_price || "" }}¥{{ item.original_price }}</view
              >
              <view class="price-color flex-x-sb flex-y-end">
                <div>
                  <text>¥</text>
                  <text class="font-36">{{ item.price }}</text>
                </div>
                <text class="font-22 color-999" style="line-height:50rpx;">X1</text>
              </view>
            </view>
          </div>
        </div>
        <u-loadmore :status="status"></u-loadmore>
      </template>
      <u-empty v-else mode="data" :icon="wxapp_img.empty_data"></u-empty>
    </div>
  </view>
</template>
<script>
import BlindDetailRow from "../components/BlindDetailRow.vue";
export default {
  components: {
    BlindDetailRow,
  },
  data() {
    return {
      cat_list: "",
      hotBox: "",
      box_list: [],
      tabIndex: 0,
      page: 1,
      status: "loadmore",
      option: {},
    };
  },
  onLoad() {
    this.getCatList();
  },
  methods: {
    switchTab(i) {
      this.tabIndex = i;
      this.page = this.$options.data().page;
      this.status = this.$options.data().status;
      this.box_list = this.$options.data().box_list;
      this.getBoxList();
    },
    async getCatList() {
      const res = await this.$requestAll.blind.indexCatList({}, true);
      this.cat_list = res.data.catList;
      this.hotBox = res.data.hotBox;
      this.option = res.data.option
      this.getBoxList();
    },
    async getBoxList() {
      if (this.status == "nomore") return;
      const res = await this.$requestAll.blind.indexBoxList(
        {
          page: this.page,
          cat_id: this.cat_list[this.tabIndex].id,
        },
        true
      );
      this.box_list.push(...res.data.list);
      this.status = this.page >= res.data.page_count ? "nomore" : "loadmore";
      this.page++;
    },
  },
  onShow() {},
  computed: {},
  watch: {},
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: env(safe-area-inset-bottom);
  .head {
    position: relative;
    height: 776rpx;
    > image {
      display: block;
      width: 100%;
      height: 100%;
    }
    .head-content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      /deep/.u-navbar__content__title {
        color: #fff;
        font-weight: 600;
      }

      .blind-box {
        position: absolute;
        left: 0;
        bottom: 10rpx;
        width: 100%;
        height: 260rpx;
        padding: 0 20rpx;
        .blind-list {
          display: flex;
          white-space: nowrap;
          .blind-item {
            display: flex;
            padding: 24rpx;
            min-width: 560rpx;
            background: #fff;
            border-radius: 20rpx;
            margin-right: 20rpx;
            > image {
              margin-right: 20rpx;
              width: 200rpx;
              height: 200rpx;
            }
            .blind-name {
              white-space: initial;
              height: 84rpx;
              line-height: 42rpx;
              font-weight: 600;
            }
          }
        }
      }
    }
  }

  .bottom-content {
    border-radius: 20rpx 0 0 20rpx;
    .tabs {
      display: flex;
      background: #fff;
      white-space: nowrap;
      overflow-x: auto;
      padding: 10rpx 20rpx 0;
      > view {
        width: 140rpx;
        line-height: 70rpx;

        text-align: center;
      }
      .activeTabs {
        position: relative;
        color: red;
        &::before {
          content: "";
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translateX(-50%);
          width: 50rpx;

          height: 4rpx;
          background: red;
        }
      }
    }
    > .blind-list {
      display: flex;
      flex-wrap: wrap;
      padding: 0 20rpx;

      .blind-item {
        $width: 345rpx;
        width: $width;
        background: #fff;
        overflow: hidden;
        border-radius: 10rpx;
        margin: 20rpx 20rpx 0 0;
        &:nth-child(2n) {
          margin-right: 0;
        }
        > image {
          margin-right: 20rpx;
          width: $width;
          height: $width;
        }
        .blind-name {
          white-space: initial;
          height: 84rpx;
          line-height: 42rpx;
          font-weight: 600;
        }
      }
    }
  }
}
</style>

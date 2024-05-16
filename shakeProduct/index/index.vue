<template>
  <view class="body flex-col">
    <view class="head">
      <u-navbar :autoBack="false" placeholder>
        <view slot="left" class="flex-y-center">
          <view
            @click="$utils.backTo()"
            style="line-height: 64rpx; height: 60rpx"
            class="iconfont icon-arrow-left font-50"
          ></view>
        </view>
        <div class="tabs bg-fff" slot="center">
          <div
            :class="tabIndex == 0 && 'check'"
            @click="clickTab(0)"
            id="id_0"
            class="tab"
          >
            关注
          </div>
          <div
            :class="tabIndex == 1 && 'check'"
            @click="clickTab(1)"
            id="id_0"
            class="tab"
          >
            发现
          </div>
          <div
            :class="tabIndex == 2 && 'check'"
            @click="clickTab(2)"
            id="id_0"
            class="tab"
          >
            我的
          </div>
        </div>
      </u-navbar>
    </view>

    <view class="flex-h-1" v-show="tabIndex == 0">
      <Focus :shareData.sync="shareData"></Focus>
    </view>

    <view class="flex-h-1 flex-col" v-show="tabIndex == 1">
      <div class="cart-box bg-fff p-x-20">
        <div @click="$utils.toUrl('/shakeProduct/search/index')" class="search-box flex-y-center">
          <div class="search-input flex-y-center">
            <div class="iconfont icon-search font-40"></div>
            <div>请输入视频名称搜索</div>
          </div>
        </div>
        <div class="flex-y-center">
          <scroll-view scroll-x class="flex-w-1">
            <div
              class="tabs tabs1"
              style="
                padding: 0;
                width: initial;
                display: block;
                white-space: nowrap;
              "
            >
              <div
                v-for="(item, i) in cart_list"
                :key="i"
                :class="cart_id == item.id && 'check'"
                @click="switchCart(item)"
                id="id_0"
                class="tab tab1"
                style="max-width: initial"
              >
                {{ item.name }}
              </div>
            </div>
          </scroll-view>
          <view
            @click="showCartModal = true"
            class="m-l-20 iconfont icon-arrow-bottom"
          ></view>
        </div>
      </div>

      <view
        v-if="showCartModal"
        @click="showCartModal = false"
        class="modal"
        :style="{
          height: 'calc(100vh - 44px - ' + systemInfo.statusBarHeight + 'px)',
          top: 'calc(44px + ' + systemInfo.statusBarHeight + 'px)',
        }"
      >
        <view @click.stop class="modal-content bg-fff p-20">
          <view class="font-600-32 m-b-20 flex">
            <view>全部标签</view>
            <view class="font-22 color-999 m-l-20 p-t-10">点击查看标签</view>
          </view>
          <view class="tip-box">
            <div
              :class="cart_id == item.id && 'check'"
              @click="switchCart(item)"
              class="tip"
              v-for="(item, i) in cart_list"
              :key="i"
            >
              {{ item.name }}
            </div>
          </view>
        </view>
      </view>

      <scroll-view
        refresher-enabled
        :refresher-triggered="pullStatus"
        @refresherpulling="onPull"
        scroll-y
        @scrolltolower="loadData"
        class="flex-h-1"
      >
        <view class="p-20">
          <List ref="list" :list="pageData.list"></List>
          <u-loadmore :status="pageData.status"></u-loadmore>
        </view>
      </scroll-view>
    </view>

    <view class="flex-h-1" v-show="tabIndex == 2">
      <My></My>
    </view>

    <div
      @click="$utils.toUrl('/shakeProduct/issue/index')"
      class="fabu-box flex-col flex-y-center flex-x-center"
    >
      <view
        style="line-height: 40rpx"
        class="iconfont icon-xiangji font-40 font-w-600"
      ></view>
      <text> 发布 </text>
    </div>
  </view>
</template>
<script>
import My from "./components/my";
import Focus from "./components/focus";
import share from "@/mixins/share";
import List from './components/List.vue'
export default {
  components: {
    My,
    Focus,
    List
  },
  mixins: [share],
  data() {
    return {
      pageData: {
        list: [],
        status: "loadmore",
        page: 0,
      },
      pullStatus: false,
      userInfo: "",
      cart_list: [],
      cart_id: -1,
      tabIndex: 1,
      showCartModal: false, //分类modal
      shareData: {}, //分享数据
    };
  },
  onLoad(params) {
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      console.log('loadData');
      if (this.pageData.status == "nomore") return;
      const res = await this.$requestAll.vgoods.list(
        {
          page: this.pageData.page,
          cart_id: this.cart_id,
          type: "add",
          from: 0,
        },
        true
      );
      !this.cart_list.length && (this.cart_list = res.data.cart_list);
      this.pageData.list.push(...res.data.vgoods_list);
      this.pageData.page++;
      this.pageData.status =
        res.data.count <= this.pageData.list.length ? "nomore" : "loadmore";
    },
    // tab切换
    clickTab(i) {
      this.tabIndex = i;
    },
    // 分类切换
    switchCart(item) {
      this.cart_id = item.id;
      this.pageData = this.$options.data().pageData;
      this.$refs["list"].clear();
      this.loadData();
    },
   
    // 下拉刷新
    onPull() {
      if (this.pullStatus) return;
      this.pullStatus = true;
      this.pageData = this.$options.data().pageData;
      this.$refs["list"].clear();
      this.loadData().then(() => {
        this.pullStatus = false;
      });
    },
  },
  computed: {},
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  height: 100vh;
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */
}
.search-box {
  color: #666;
  height: 84rpx;
  .search-input {
    width: 0;
    flex: 1;
    padding: 0 24rpx;
    height: 64rpx;
    border-radius: 32rpx;
    background: #f2f2f2;
  }
}
.tabs {
  display: flex;
  width: 100vw;
  padding-right: 200rpx;
  padding-left: 80px;
  justify-content: center;
  .tab {
    padding: 0 16rpx;
    font-size: 30rpx;
    line-height: 80rpx;
    text-align: center;
    color: #666;
  }
  .check {
    font-weight: 700;
    color: #000;
    position: relative;
    font-size: 36rpx;
    // &::after {
    //   content: "";
    //   position: absolute;
    //   left: 50%;
    //   bottom: 10rpx;
    //   transform: translate(-50%, 0);
    //   width: 40rpx;
    //   height: 4rpx;
    //   background: #000;
    // }
  }
}
.tabs1 {
  justify-content: flex-start;
  height: 56rpx;
  .tab1 {
    line-height: 56rpx;
    font-size: 28rpx;
    display: inline-block;
    flex: initial;
    padding: 0 20rpx;
    max-width: 120rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;

    &::after {
      content: "";
      height: 0;
    }
  }
}



.modal {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 999;
  height: 100vh;
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */
  background: rgba(0, 0, 0, 0.4);
  .modal-content {
    border-radius: 0 0 20rpx 20rpx;
  }
  .tip-box {
    .tip {
      display: inline-block;
      margin-right: 20rpx;
      margin-bottom: 20rpx;
      min-width: 140rpx;
      max-width: 300rpx;
      line-height: 60rpx;
      border-radius: 10rpx;
      border: 1px solid #999;
      font-size: 30rpx;

      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      white-space: nowrap;
    }
    .check {
      border-color: red;
      color: red;
    }
  }
}

.fabu-box {
  position: fixed;
  bottom: calc(80rpx + env(safe-area-inset-bottom));
  right: 30rpx;
  color: #fff;
  background: #f0250e;
  border-radius: 50%;
  width: 100rpx;
  height: 100rpx;
  font-size: 26rpx;
}
</style>

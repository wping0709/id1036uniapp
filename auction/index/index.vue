<template>
  <view v-if="pageData" class="body">
    <view class="navbar-box">
      <!-- 占位用 -->
      <view
        :style="{
          paddingTop: systemInfo.statusBarHeight + 'px',
        }"
      ></view>

      <view
        :style="{
          position: 'fixed',
          paddingTop: systemInfo.statusBarHeight + 'px',
        }"
        class="navbar flex-y-center"
      >
        <view class="left flex-y-center flex-x-center">
          <text
            @click="$utils.backTo()"
            class="iconfont icon-arrow-left p-x-20 font-52"
          ></text>

          <text
            @click="$utils.toUrl('/auction/myauction/index')"
            class="iconfont icon-V font-50"
          ></text>
        </view>

        <view class="content flex-w-1 u-line-1 font-center font-32">
          <div class="tabs">
            <div
              @click="switchShowPopup('tabIndex', 0)"
              :class="['tab', !tabIndex && 'check']"
            >
              专属
            </div>
            <div
              @click="switchShowPopup('tabIndex', 1)"
              :class="['tab', tabIndex && 'check']"
            >
              推荐
            </div>
          </div>
        </view>

        <view class="right"></view>
      </view>
    </view>

    <view v-show="tabIndex" class="page-content">
      <div class="history bg-fff border-rd">
        <div class="font-600-32 p-y-10">历史卖出</div>
        <u-scroll-list :indicator="false">
          <view
            @click="$utils.toUrl('/auction/myauction/index')"
            class="history-item"
            v-for="(item, index) in [pageData.history]"
            :key="index"
          >
            <image class="border-rd" :src="item.cover_pic"></image>
            <view class="font-center font-24 color-666 m-t-10">已拍</view>
            <view class="font-center font-600-26 color-666"
              >{{ item.count }}件</view
            >
          </view>
        </u-scroll-list>
      </div>

      <div class="cat-tabs bg-fff border-rd">
        <div
          @click="switchShowPopup('catPopup', 1)"
          :class="['cat-tab', form.type_checked && 'check']"
        >
          {{ cpName }}
        </div>
        <div @click="clickCat('hot')" :class="['cat-tab', form.hot && 'check']">
          热门
        </div>
        <div @click="clickCat('price')" :class="['cat-tab']">
          <view>价格</view>
          <view class="flex-col flex-y-center flex-x-center m-l-10">
            <text
              :class="form.price == 1 && 'check'"
              class="iconfont icon-arrow-top font-22"
              style="height: 22rpx; line-height: 22rpx"
            ></text>
            <text
              :class="form.price == 2 && 'check'"
              class="iconfont icon-arrow-bottom font-22"
              style="height: 22rpx; line-height: 22rpx"
            ></text>
          </view>
        </div>
        <div @click="clickCat('new')" :class="['cat-tab', form.new && 'check']">
          最新
        </div>
        <div
          @click="switchShowPopup('catPopup', 2)"
          :class="['cat-tab', (form.ave_min || form.ave_max) && 'check']"
        >
          筛选
        </div>
      </div>

      <IndexList :catList="catList"></IndexList>
    </view>

    <view class="page-content" v-show="!tabIndex">
      <div
        v-if="!guanzhu.count"
        class="p-30 font-center color-999 font-24 bg-fff border-rd m-b-20"
      >
        <view>目前没有匠人上拍</view>
        <view>关注更多匠人，留住精彩</view>
      </div>

      <div v-else class="history bg-fff border-rd">
        <div class="font-600-26 p-y-10">
          有{{ guanzhu.count }}关注的匠人上拍了
        </div>
        <u-scroll-list :indicator="false">
          <view
            @click="$utils.toUrl('/auction/myauction/index')"
            class="history-item"
            v-for="(item, index) in guanzhu.list"
            :key="index"
          >
            <image
              class="border-rd"
              :src="item.logo"
              style="
                border-radius: 50%;
                border: 1px solid red;
                width: 80rpx;
                height: 80rpx;
              "
            ></image>
            <view class="font-center font-24 color-666 m-t-10">{{
              item.name
            }}</view>
          </view>
        </u-scroll-list>
      </div>

      <div class="cat-tabs bg-fff border-rd">
        <div @click="switchCat(0)" :class="['cat-tab', !status && 'check']">
          最新上拍
        </div>
        <div @click="switchCat(1)" :class="['cat-tab', status && 'check']">
          即将结拍
        </div>
      </div>

      <IndexList :catList="catList"></IndexList>
    </view>
    <DiyQuickNav></DiyQuickNav>

    <!-- fixed分类 -->
    <div
      class="popup-tabs"
      @click="switchShowPopup('catPopup')"
      v-show="catPopup"
      :style="{
        top: 'calc(44px + ' + systemInfo.statusBarHeight + 'px)',
        height: 'calc(100vh - 44px - ' + systemInfo.statusBarHeight + 'px)',
      }"
    >
      <div @click.stop class="popup-content bg-fff">
        <div class="cat-tabs bg-fff border-rd">
          <div
            @click="clickCat('other', 1)"
            :class="[
              'cat-tab',
              (form.type_checked || catTabIndex == 1) && 'check',
            ]"
          >
            {{ cpName }}
          </div>
          <div
            @click="clickCat('hot')"
            :class="['cat-tab', form.hot && 'check']"
          >
            热门
          </div>
          <div @click="clickCat('price')" :class="['cat-tab']">
            <view>价格</view>
            <view class="flex-col flex-y-center flex-x-center m-l-10">
              <text
                :class="form.price == 1 && 'check'"
                class="iconfont icon-arrow-top font-22"
                style="height: 22rpx; line-height: 22rpx"
              ></text>
              <text
                :class="form.price == 2 && 'check'"
                class="iconfont icon-arrow-bottom font-22"
                style="height: 22rpx; line-height: 22rpx"
              ></text>
            </view>
          </div>
          <div
            @click="clickCat('new')"
            :class="['cat-tab', form.new && 'check']"
          >
            最新
          </div>
          <div
            @click="clickCat('other', 2)"
            :class="[
              'cat-tab',
              (form.ave_min || form.ave_max || catTabIndex == 2) && 'check',
            ]"
          >
            筛选
          </div>
        </div>

        <scroll-view v-if="catTabIndex == 1" scroll-y class="type-list p-20">
          <view
            @click="clickCat('type_checked', item)"
            :class="['type-item', form.type_checked == item.id && 'check']"
            v-for="(item, index) in typeList"
            :key="index"
          >
            {{ item.name }}
          </view>
        </scroll-view>

        <view v-else-if="catTabIndex == 2" class="type-list">
          <view class="flex-y-center">
            <view class="flex-grow-1">
              <u-input
                v-model="ave_min"
                border="none"
                shape="circle"
                placeholder="请输入最底价"
              ></u-input>
            </view>
            <view class="p-x-30 flex-grow-0">至</view>
            <view class="flex-grow-1">
              <u-input
                v-model="ave_max"
                border="none"
                shape="circle"
                placeholder="请输入最高价"
              ></u-input>
            </view>
          </view>

          <view class="popup-bts">
            <view @click="clickReset">重置</view>
            <view @click="clickConfirm">完成</view>
          </view>
        </view>
      </div>
    </div>
  </view>
</template>
<script>
import DiyQuickNav from '@/pages/index/diy/DiyQuickNav';
import IndexList from './components/IndexList';
export default {
  components: {
    DiyQuickNav,
    IndexList,
  },
  data() {
    return {
      pageData: '',
      tabIndex: 1,
      catTabIndex: 1,
      form: {
        price: 0, //价格  1升序 2降序
        hot: 0, //热门 1:0
        new: 0, //最新 1:0
        ave_min: '', //筛选最底价
        ave_max: '', //筛选最高价
        cid: '-1', //商品分类
        type_checked: '', //全部商品筛选
      },
      ave_min: '', //筛选最底价
      ave_max: '', //筛选最高价
      typeList: [],
      catList: [],
      catPopup: false,
      status: 0,
      guanzhu: { count: 0, list: [] },
    };
  },
  onLoad(params) {
    this.form.cid = params.cid || '-1';
    this.getCommend();
    this.getList();
  },
  methods: {
    async getCommend() {
      const res = await this.$requestAll.auction.recommend({}, true);
      this.pageData = res.data;
    },
    async getList() {
      const res = await this.$requestAll.auction.recommendList(this.form, true);
      this.catList = res.data.auction_list;
    },
    async getTypeList() {
      const res = await this.$requestAll.auction.auctionType();
      this.typeList = res.data;
    },
    async getGuanzhu() {
      const res = await this.$requestAll.auction
        .exclusive()
        .catch(error => error);
      this.guanzhu = res.data;
    },
    clickCat(key, data) {
      switch (key) {
        case 'price':
          if (this.form.price == 2) {
            this.form.price = 0;
            break;
          }
          this.form.price++;
          break;
        case 'other':
          this.catTabIndex = data;

          break;
        case 'type_checked':
          if (this.form.type_checked == data.id) {
            this.form.type_checked = '';
          } else {
            this.form.type_checked = data.id;
          }
          this.catPopup = false;

          break;

        default:
          this.form[key] = Number(!this.form[key]);
          break;
      }
      this.getList();
    },

    async switchShowPopup(key, i) {
      console.log(key);
      if (key == 'catPopup') {
        this.catTabIndex = i;
        this.getTypeList();
      }
      if (key == 'tabIndex' && i) {
        await this.getList();
        this[key] = i;
        return;
      } else if (key == 'tabIndex' && !i) {
        await this.getGuanzhu();
        await this.getBottom();
        this[key] = i;
        return;
      }
      this[key] = !this[key];
    },

    clickConfirm() {
      this.form.ave_min = this.ave_min;
      this.form.ave_max = this.ave_max;
      this.catPopup = false;
      this.getList();
    },
    clickReset() {
      this.form.ave_min = '';
      this.form.ave_max = '';
      this.catPopup = false;
      this.getList();
    },

    switchCat(status) {
      this.status = status;
      this.getBottom();
    },
    async getBottom() {
      const res = await this.$requestAll.auction.exclusiveBottom(
        {
          status: this.status,
        },
        true
      );
      this.catList = res.data.auction_list;
    },
  },
  onShow() {},
  computed: {
    cpName() {
      if (this.typeList.length && this.form.type_checked) {
        return this.typeList.find(item => item.id == this.form.type_checked)
          .name;
      } else {
        return '全部商品';
      }
    },
  },
  watch: {},
  onReachBottom() {},
};
</script>
<style>
page {
  background: #f5f5f5;
}
</style>
<style lang="scss" scoped>
/deep/ .u-input {
  background: #eee;
}

.body {
  background: #f5f5f5;
}

.page-content {
  padding: 20rpx;
  .border-rd {
    border-radius: 20rpx;
  }
  .history {
    margin-bottom: 20rpx;
    padding: 20rpx;
    padding-bottom: 0;
    .history-item {
      margin-right: 20rpx;
      > image {
        width: 150rpx;
        height: 150rpx;
      }
    }
  }

  .page-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .page-item {
      background: #fff;
      margin-bottom: 20rpx;
      width: 344rpx;
      border-radius: 20rpx;
      overflow: hidden;
      &:nth-child(2n) {
        margin-left: 20rpx;
      }

      .top {
        position: relative;
        background: #f5f5f5;
        border-radius: 10rpx;

        > image {
          margin: auto;
          width: 340rpx;
          height: 340rpx;
        }
        .icon-bg {
          width: 30rpx;
          height: 30rpx;
          line-height: 30rpx;
          border-radius: 50%;
          background: red;
          text-align: center;
        }

        .time {
          position: absolute;
          bottom: 20rpx;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          height: 70rpx;
          padding: 0 10rpx;

          font-size: 24rpx;

          background: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .status {
          position: absolute;
          top: 20rpx;
          left: 20rpx;
          background: #ffecec;
          border-radius: 10rpx;

          display: flex;
          align-items: center;
          font-size: 22rpx;
          color: red;
        }
      }
      .bottom {
        padding: 20rpx;
        background: #fff;

        .user-pic {
          width: 40rpx;
          height: 40rpx;
          border-radius: 50%;
          margin-right: 20rpx;
        }
      }
    }
  }
}

.tabs {
  display: flex;
  align-items: center;
  justify-content: center;
  .tab {
    width: 120rpx;
    text-align: center;
    padding: 10rpx 0;
    font-size: 30rpx;
    color: #666;
  }
  .check {
    position: relative;
    font-weight: 600;
    color: #333;

    &::before {
      content: '';
      position: absolute;
      left: 50%;
      bottom: 4rpx;
      transform: translateX(-50%);
      width: 30rpx;
      height: 4rpx;
      background: #333;
    }
  }
}

.navbar-box {
  position: relative;

  > view {
    box-sizing: content-box;
    height: 44px;
  }

  .navbar {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    background: #fff;
    // top: env(safe-area-inset-top);

    z-index: 9999;
    height: 44px;

    .left {
      font-weight: 500;
      text-align: center;
      min-width: 100rpx;
    }

    .content {
      font-weight: 500;
    }

    .right {
      /* #ifdef MP-WEIXIN */
      min-width: 88px;
      /* #endif */
      /* #ifndef MP-WEIXIN */
      min-width: 100rpx;
      /* #endif */
    }
  }
}

.type-list {
  padding: 0 30rpx 20rpx;
  max-height: 50vh;
  .type-item {
    padding-bottom: 30rpx;
    font-size: 30rpx;
    color: #666;
  }
  .check {
    color: red;
  }
}

.cat-tabs {
  position: relative;
  z-index: 1000;
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;
  .cat-tab {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    color: #333;
    height: 100rpx;
  }

  .check {
    color: red;
  }
}

.popup-tabs {
  position: fixed;
  top: 44rpx;
  left: 0;
  right: 0;
  z-index: 1001;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  .popup-bts {
    padding-top: 20rpx;
    display: flex;
    border-top: 1px solid #eee;
    margin-top: 30rpx;
    > view {
      line-height: 70rpx;
      font-weight: 600;
      font-size: 32rpx;
      flex: 1;
      text-align: center;
      &:nth-child(2) {
        border-left: 1px solid #eee;
        color: red;
      }
    }
  }
}
</style>

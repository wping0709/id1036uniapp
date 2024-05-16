<template>
  <view v-if="catList" class="body flex-col">
    <view class="p-y-10">
      <view
        @click="$utils.toUrl('/mch/m/add-cat/add-cat')"
        class="cat-add font-center"
      >
        <text class="iconfont icon-add m-r-10"></text>
        <text>添加分类</text>
      </view>
    </view>

    <view class="env-bottom">
      <!-- 一级分类 -->
      <view v-for="(cat, i) in catList" :key="i" class="bg-fff cat-box">
        <div class="cat-level">一级</div>
        <div class="cat-item flex-y-center">
          <image :src="cat.icon" mode="aspectFill" />
          <view @click="catSwitchFold(cat)" class="flex-w-1 u-line-1 m-x-20">
            <view class="jia-jian">
              <template v-if="cat.child&&cat.child.length">
                <text
                  v-if="!cat.is_fold"
                  class="iconfont icon-jia m-r-10"
                ></text>
                <text v-else class="iconfont icon-jianhao m-r-10"></text>
              </template>
            </view>

            <text>ID {{ cat.id }}</text>
            <text>{{ cat.name }}</text>
          </view>
          <text class="sort u-line-1 m-x-20">排序{{ cat.sort }}</text>
          <view class="more-box">
            <text
              @click="
                showModify == cat.id
                  ? (showModify = false)
                  : (showModify = cat.id)
              "
              class="iconfont icon-gengduo-x font-50 p-x-10"
            ></text>
            <view
              v-if="showModify == cat.id"
              class="more-absolute flex-y-center"
            >
              <view
                @click="$utils.toUrl('/mch/m/add-cat/add-cat?id=' + cat.id)"
                class="flex-col flex-x-center flex-y-center p-x-20 p-y-10"
              >
                <text class="iconfont icon-bianji font-50"></text>
                <text class="font-20">编辑</text>
              </view>
              <view
                @click="delCatItem(cat)"
                class="flex-col flex-x-center flex-y-center p-x-20 p-y-10"
              >
                <text class="iconfont icon-bianji font-50"></text>
                <text class="font-20">删除</text>
              </view>
            </view>
          </view>
        </div>

        <!-- 二级分类 -->
        <template v-if="cat.is_fold">
          <view class="cat-box" v-for="(cat, i1) in cat.child" :key="i1">
            <div class="cat-level">二级</div>
            <div class="cat-item flex-y-center">
              <image :src="cat.icon" mode="aspectFill" />

              <view
                @click="catSwitchFold(cat)"
                class="flex-w-1 u-line-1 m-x-20"
              >
                <view class="jia-jian">
                  <template v-if="cat.child && cat.child.length">
                    <text
                      v-if="!cat.is_fold"
                      class="iconfont icon-jia m-r-10"
                    ></text>
                    <text v-else class="iconfont icon-jianhao m-r-10"></text>
                  </template>
                </view>
                <text>ID {{ cat.id }}</text>
                <text>{{ cat.name }}</text>
              </view>

              <text class="sort u-line-1 m-x-20">排序{{ cat.sort }}</text>

              <view class="more-box">
                <text
                  @click="
                    showModify == cat.id
                      ? (showModify = false)
                      : (showModify = cat.id)
                  "
                  class="iconfont icon-gengduo-x font-50 p-x-10"
                ></text>
                <view
                  v-if="showModify == cat.id"
                  class="more-absolute flex-y-center"
                >
                  <view
                    @click="$utils.toUrl('/mch/m/add-cat/add-cat?id=' + cat.id)"
                    class="flex-col flex-x-center flex-y-center p-x-20 p-y-10"
                  >
                    <text class="iconfont icon-bianji font-50"></text>
                    <text class="font-20">编辑</text>
                  </view>
                  <view
                    @click="delCatItem(cat)"
                    class="flex-col flex-x-center flex-y-center p-x-20 p-y-10"
                  >
                    <text class="iconfont icon-bianji font-50"></text>
                    <text class="font-20">删除</text>
                  </view>
                </view>
              </view>
            </div>

            <!-- 三级分类 -->
            <template v-if="cat.is_fold">
              <view class="cat-box" v-for="(cat, i2) in cat.child" :key="i2">
                <div class="cat-level">三级</div>
                <div class="cat-item flex-y-center">
                  <image :src="cat.icon" mode="aspectFill" />

                  <view
                    @click="catSwitchFold(cat)"
                    class="flex-w-1 u-line-1 m-x-20"
                  >
                    <view class="jia-jian">
                      <template v-if="cat.child && cat.child.length">
                        <text
                          v-if="!cat.is_fold"
                          class="iconfont icon-jia m-r-10"
                        ></text>
                        <text
                          v-else
                          class="iconfont icon-jianhao m-r-10"
                        ></text>
                      </template>
                    </view>
                    <text>ID {{ cat.id }}</text>
                    <text>{{ cat.name }}</text>
                  </view>

                  <text class="sort u-line-1 m-x-20">排序{{ cat.sort }}</text>

                  <view class="more-box">
                    <text
                      @click="
                        showModify == cat.id
                          ? (showModify = false)
                          : (showModify = cat.id)
                      "
                      class="iconfont icon-gengduo-x font-50 p-x-10"
                    ></text>
                    <view
                      v-if="showModify == cat.id"
                      class="more-absolute flex-y-center"
                    >
                      <view
                        @click="
                          $utils.toUrl('/mch/m/add-cat/add-cat?id=' + cat.id)
                        "
                        class="flex-col flex-x-center flex-y-center p-x-20 p-y-10"
                      >
                        <text class="iconfont icon-bianji font-50"></text>
                        <text class="font-20">编辑</text>
                      </view>
                      <view
                        @click="delCatItem(cat)"
                        class="flex-col flex-x-center flex-y-center p-x-20 p-y-10"
                      >
                        <text class="iconfont icon-bianji font-50"></text>
                        <text class="font-20">删除</text>
                      </view>
                    </view>
                  </view>
                </div>
              </view>
            </template>
          </view>
        </template>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      catList: '',
      selectId: false,
      showModify: false,
    };
  },
  onShow() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.mch.catList({}, true);
      this.catList = res.data.list;
    },
    delCatItem(cat) {
      uni.showModal({
        title: '警告',
        content: '您确定删除‘' + cat.name + '’吗？',
        success: async res => {
          if (res.confirm) {
            await this.$requestAll.mch.catDelete({ id: cat.id }, true);

            this.catList = this.catList.filter(item => item.id != cat.id);
          }
        },
      });
    },

    catSwitchFold(cat) {
      console.log(cat);
      cat.is_fold = !cat.is_fold;
      this.$forceUpdate();
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
  min-height: 100vh;

  .cat-add {
    width: 180rpx;
    line-height: 1.8;
    margin: 0 20rpx 0 auto;
    color: skyblue;

    border-radius: 28rpx;
    border: 1px solid skyblue;
  }

  .cat-box {
    position: relative;
    margin-bottom: 20rpx;
    .cat-box {
      margin-bottom: 0;
      border: 10rpx solid #f5f5f5;
      border-bottom: 0 solid #f5f5f5;
      .cat-box {
        margin-bottom: 0;
      }
    }

    .cat-item {
      padding: 0 20rpx;
      height: 100rpx;
      border-radius: 20rpx;
      // background: #fff;
      margin: 0 20rpx;

      font-size: 30rpx;
      > image {
        width: 50rpx;
        height: 50rpx;
      }

      .more-box {
        position: relative;

        .more-absolute {
          position: absolute;
          bottom: 80%;
          right: 0;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 10rpx;
          color: #fff;
          .iconfont {
            width: 50rpx;
            height: 50rpx;
            line-height: 50rpx;
          }
          &::after {
            content: '';
            position: absolute;
            top: 100%;
            right: 20rpx;
            border: 10rpx solid rgba(0, 0, 0, 0.5);
            border-bottom-color: transparent;
            border-left-color: transparent;
            border-right-color: transparent;
          }
        }
      }
      .sort {
        width: 160rpx;
      }
      .jia-jian {
        display: inline-block;
        width: 40rpx;
        text-align: center;
      }
    }

    .cat-level {
      position: absolute;
      left: 10rpx;
      top: 4rpx;
      font-size: 16rpx;
      color: red;
    }
  }
}
</style>

<template>
  <view v-if="catList" class="body flex-col">
    <view class="p-y-10">
      <view
        @click="
          $utils.toUrl('/mch/m/freight-modify/freight-modify?mch_id=' + mch_id)
        "
        class="cat-add font-center"
      >
        <text class="iconfont icon-add m-r-10"></text>
        <text>添加模板</text>
      </view>
    </view>

    <view class="env-bottom">
      <!-- 一级分类 -->
      <view v-for="(cat, i) in catList" :key="i" class="bg-fff cat-box">
        <div v-if="cat.is_enable" class="cat-level">默认</div>
        <div class="cat-item flex-y-center">
          <!-- <image :src="cat.icon" mode="aspectFill" /> -->
          <view class="flex-w-1 u-line-1">
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
            <text class="m-l-20">{{ cat.name }}</text>
          </view>
          <!-- <text class="sort u-line-1 m-x-20">排序{{ cat.sort }}</text> -->
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
                  $utils.toUrl(
                    '/mch/m/freight-modify/freight-modify?mch_id=' +
                      mch_id +
                      '&id=' +
                      cat.id
                  )
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
                <text class="iconfont icon-ashbin1 font-50"></text>
                <text class="font-20">删除</text>
              </view>
              <view
                v-if="!cat.is_enable"
                @click="setDefault(cat)"
                class="flex-col flex-x-center flex-y-center p-x-20 p-y-10"
              >
                <text class="iconfont icon-duihao font-50"></text>
                <text class="font-20">设为默认</text>
              </view>
            </view>
          </view>
        </div>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      mch_id: 0,
      catList: '',
      selectId: false,
      showModify: false,
    };
  },
  onLoad(params) {
    this.mch_id = params.mch_id;
  },
  onShow() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.mch.postageRulesList(
        {
          mch_id: this.mch_id,
        },
        true
      );
      this.catList = res.data.list;
    },
    delCatItem(cat) {
      uni.showModal({
        title: '警告',
        content: '您确定删除‘' + cat.name + '’吗？',
        success: async res => {
          if (res.confirm) {
            await this.$requestAll.mch.postageRulesDelete(
              { id: cat.id, mch_id: this.mch_id },
              true
            );

            this.catList = this.catList.filter(item => item.id != cat.id);
          }
        },
      });
    },
    setDefault(cat) {
      console.log(cat);
      uni.showModal({
        title: '提示',
        content: `您确定将‘${cat.name}’设为默认运费模板吗？`,
        showCancel: true,
        success: async ({ confirm, cancel }) => {
          if (confirm) {
            await this.$requestAll.mch.postageRulesSetEnable(
              { id: cat.id, mch_id: this.mch_id, type: Number(!cat.is_enable) },
              true
            );
            this.loadData();
          }
        },
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
          white-space: nowrap;
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

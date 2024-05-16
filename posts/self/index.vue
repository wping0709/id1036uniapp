<template>
  <view class="body flex-col">
    <view class="bg-fff tabs-box">
      <u-tabs
        :current="status"
        :list="list1"
        :activeStyle="{
          color: 'red',
        }"
        lineColor="red"
        @change="clickTab"
      ></u-tabs>
    </view>

    <scroll-view @scrolltolower="loadData" scroll-y class="content flex-h-1">
      <view class="scroll-box" v-if="pageData.list.length">
        <view
          class="item flex-x-sb"
          v-for="(item, index) in pageData.list"
          :key="index"
        >
          <view class="m-r-10">
            <image
              :src="item.user_info.avatar_url"
              mode=""
              style="width: 88rpx; height: 88rpx; border-radius: 50%"
            ></image>
          </view>
          <view class="flex-w-1">
            <view class="item-title flex-y-center flex-x-sb">
              <view class="title-left">
                <view>
                  {{ item.user_info.nickname }}
                </view>
                <view class="color-999 m-y-10 font-24">
                  {{ item.addtime }}
                </view>
              </view>
              <view class="more-box">
                <text
                  @click="clickMore(item)"
                  class="iconfont icon-gengduo-shuxiang p-20 bg-fff"
                ></text>
                <view
                  @click="updateStatus(item)"
                  class="more-bt"
                  :class="[item.more && 'width-switch']"
                  id="h-bt"
                  >{{ status > 0 ? '显示' : '隐藏' }}</view
                >
              </view>
            </view>
            <view>{{ item.content }}</view>
            <view>
              <u-album :urls="item.images" keyName="feil_url"></u-album>
            </view>
          </view>
        </view>
        <u-loadmore :status="more"></u-loadmore>
      </view>

      <view class="scroll-box" v-else>
        <u-empty
          mode="data"
          :icon="wxapp_img.empty_data"
        >
        </u-empty>
      </view>
    </scroll-view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      list1: [
        {
          name: '显示',
        },
        {
          name: '隐藏',
        },
      ],
      pageData: {
        list: [],
        page: 1,
        status: 'loadmore',
      },
      status: 0,
    };
  },
  onLoad(params) {
    this.loadData();
  },
  methods: {
    async loadData() {
      if (this.pageData.status == 'nomore') return;
      const res = await this.$requestAll.posts.selfList(
        {
          status: this.status + 1,
          page: 0,
        },
        true
      );
      this.pageData.list.push(...res.data.posts_list);
      this.pageData.status =
        res.data.posts_list.length < 10 ? 'nomore' : 'loadmore';
      this.pageData.page++;
    },
    clickTab({ index }) {
      this.status = index;
      this.pageData = this.$options.data().pageData;
      this.loadData();
    },
    clickMore(item) {
      this.pageData.list.forEach(v => {
        if (item.id == v.id) {
          v.more = !v.more;
        } else {
          v.more = false;
        }
      });
      this.$forceUpdate();
    },
    async updateStatus(item) {
      await this.$requestAll.posts.updateStatus(
        {
          status: this.status + 1,
          id: item.id,
        },
        true
      );
      var resultArr = this.pageData.list.filter(v => {
        if (v.id != item.id) return item;
      });
      this.$set(this.pageData, 'list', resultArr);
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
  height: 100vh;
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */
  .tabs-box {
    border-bottom: 2rpx solid #eee;
  }
  .scroll-box {
    .item {
      background: #fff;
      padding: 20rpx 46rpx;
      border-bottom: 2rpx solid #eee;
      .more-box {
        position: relative;
        .more-bt {
          display: none;
          position: absolute;
          right: 100%;
          top: 50%;
          transform: translate(0, -50%);
          background: #000;
          margin-right: 30rpx;
          width: 0;
          line-height: 60rpx;
          color: #fff;
          text-align: center;
          &::after {
            content: '';
            position: absolute;
            left: 100%;
            top: 50%;
            transform: translate(0, -50%);
            border: 10rpx solid transparent;
            border-left-color: #000;
          }
        }
        .width-switch {
          display: block;
          white-space: nowrap;
          animation: widthchange 0.1s linear 0s 1 forwards;
        }
        @keyframes widthchange {
          from {
            width: 0;
          }
          to {
            width: 140rpx;
          }
        }
      }
    }
  }
}
</style>

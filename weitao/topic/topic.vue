<template>
  <view class="body flex-col">
    <div class="search p-y-10 flex-y-center">
      <div class="search-input flex-w-1">
        <u-search
          bgColor="#efefef"
          placeholder="搜话题"
          v-model="topic_name"
          :showAction="false"
          @search="searchConfirm"
        ></u-search>
      </div>

      <div @click="$utils.toUrl('/weitao/my_conter/my_conter')" class="user">
        <image :src="user.head" mode="aspectFill" />
      </div>
    </div>

    <scroll-view @scrolltolower="getList" scroll-y class="flex-h-1">
      <view class="hot flex-y-center p-y-10">
        <image :src="wxapp_img.weitao.hot" mode="widthFix" />
        <text style="color: red">热门话题</text>
      </view>

      <div class="list">
        <div
          v-for="(item, i) in pageData.list"
          :key="i"
          :class="item.id == topic_id && 'check'"
          @click="onChekTopic(item)"
          class="item m-b-30"
        >
          <view class="font-600-30">#{{ item.topic_name }}#</view>
          <view class="font-26 color-999 m-t-10"
            >#{{ item.city_name }} {{ item.num }}人讨论</view
          >
        </div>
      </div>
    </scroll-view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: {
        list: [],
        page: 1,
        status: 'loadmore',
      },
      topic_name: '',
      topic_id: '',
      user: '',
    };
  },
  computed: {},
  watch: {},
  onLoad(params) {
    this.pageType = params.type;
    this.topic_id = params.topic_id;
    this.getList();
  },
  onShow() {},
  methods: {
    async getList() {
      if (this.pageData.status == 'nomore') return;
      const res = await this.$requestAll.weitao.getTopicList(
        {
          page: this.pageData.page,
          topic_name: this.topic_name,
          is_hot: 1,
        },
        true
      );
      if (!this.user) this.user = res.user;
      this.pageData.list.push(...res.data);
      this.pageData.page++;
      this.pageData.status = res.data.length < 10 ? 'nomore' : 'loadmore';
    },
    searchConfirm() {
      this.pageData = this.$options.data().pageData;
      this.getList();
    },
    onChekTopic(item) {
      console.log(item);
      if (this.pageType == 'select') {
        uni.setStorageSync('checkTopic', item);
        this.$utils.backTo();
      }
    },
  },
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  padding: 0 20rpx;
  height: 100vh;
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */
}

.search {
  padding: 10rpx 0;

  .user {
    width: 70rpx;
    height: 70rpx;
    overflow: hidden;
    border-radius: 50%;
    margin-left: 10rpx;

    > image {
      width: 100%;
      height: 100%;
    }
  }
}

.hot {
  > image {
    margin-right: 10rpx;
    width: 100rpx;
  }
}

.list {
  padding-bottom: env(safe-area-inset-bottom);
  .check {
    color: red;
    view {
      color: red;
    }
  }
}
</style>

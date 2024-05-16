<template>
  <view v-if="pageData" class="body">
    <div class="list">
      <div class="user" v-for="(item, index) in pageData.list">
        <div class="info">
          <div
            class="portrait"
            @click="
              $utils.toUrl(
                '/weitao/my_conter/my_conter?user_id=' + item.user_id
              )
            "
          >
            <img :src="item.userhead" alt="" />
          </div>
          <div>
            <div class="name">{{ item.nickname }}</div>
            <div class="time" v-if="item.time_before">
              <span class="time" v-if="item.time_before.day > 0"
                >{{ item.time_before.day }}天前</span
              >
              <span
                class="time"
                v-else-if="
                  item.time_before.day < 1 && item.time_before.hour > 0
                "
              >
                {{ item.time_before.hour }}小时前</span
              >
              <span
                class="time"
                v-else-if="
                  item.time_before.day < 1 &&
                  item.time_before.hour < 1 &&
                  item.time_before.min > 0
                "
              >
                {{ item.time_before.min }}分钟前</span
              >
              <span
                class="time"
                v-else-if="
                  item.time_before.day < 1 &&
                  item.time_before.hour < 1 &&
                  item.time_before.min < 1
                "
                >{{ item.time_before.sec }}秒前</span
              >
            </div>
          </div>
        </div>
        <div class="praise">
          <div class="icon">
            <img :src="wxapp_img.weitao.praise_w" alt="" />
          </div>
          <div class="hint">赞了你的动态</div>
          <!-- <div class="cont">{{ item.review }}</div> -->
        </div>
        <div
          class="dynamic"
          @click="
            $utils.toUrl(
              '/weitao/details/details?article_id=' + item.article_id
            )
          "
        >
          {{item.review_content ? item.review_content : item.article_content}}
        </div>
      </div>

      <u-loadmore status="nomore"></u-loadmore>
    </div>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: '',
    };
  },
  onLoad(params) {
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      const res = await this.$requestAll.weitao.getNotLike({}, true);
      this.pageData = res.data;
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
  min-height: 100vh;
}
.user {
  $wpx: 2rpx;
  margin: 0 15 * $wpx 26rpx;
  padding-bottom: 13 * $wpx;
  border-bottom: 1 * $wpx solid #eeeeee;
  .info {
    display: flex;
    .portrait img {
      width: 36 * $wpx;
      height: 36 * $wpx;
      border-radius: 50%;
      margin-right: 12 * $wpx;
    }
    .name {
      font-size: 14 * $wpx;
    }
    .time {
      font-size: 10 * $wpx;
      color: #9b9b9b;
    }
  }
  .praise {
    display: flex;
    padding: 10 * $wpx 0;
    .cont {
      font-size: 14 * $wpx;
    }
    .icon {
      width: 20 * $wpx;
      height: 20 * $wpx;
      background-color: #ff0000;
      border-radius: 50%;
      position: relative;
      margin-right: 5 * $wpx;
    }
    img {
      width: 12 * $wpx;
      height: 12 * $wpx;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
    }
    .hint {
      font-size: 14 * $wpx;
      color: #737373;
      padding-left: 10 * $wpx;
    }
  }
  .dynamic {
    line-height: 44 * $wpx;
    background-color: #f6f6f6;
    border-radius: 8 * $wpx;
    padding-left: 10 * $wpx;
    font-size: 14 * $wpx;
    color: #a3a3a3;
  }
}
</style>

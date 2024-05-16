<template>
  <view class="body">
    <div class="inform_box" v-for="(item, index) in list" :key="index">
      <div class="cont_box">
        <div class="cont">
          <div class="user_info">
            <div
              class="portrait"
              @click="
                $utils.toUrl(
                  '/weitao/my_conter/my_conter?user_id=' + item.user_id
                )
              "
            >
              <img :src="item.user_head ? item.user_head : ''" alt="" />
            </div>
            <div class="cont_text">
              <div class="name">{{ item.nickname }}</div>
              <div class="info">对方关注了你</div>
            </div>
          </div>

          <div class="time" v-if="item.time_before">
            <span class="time" v-if="item.time_before.day > 0"
              >{{ item.time_before.day }}天前</span
            >
            <span
              class="time"
              v-else-if="item.time_before.day < 1 && item.time_before.hour > 0"
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
          <!-- <div class="item">5天前</div> -->
        </div>
        <a class="more" @click="$utils.toUrl('/weitao/fans/fans')"
          >查看详情
          <text class="iconfont icon-arrow-right"></text>
        </a>
      </div>
    </div>
  </view>
</template>
<script>
export default {
  data() {
    return {
      list: [],
      page: 1,
      status: 'loadmore',
    };
  },
  onLoad(params) {
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      if (this.status == 'nomore') return;
      const res = await this.$requestAll.weitao.getNotFocus({
        page: 1,
        is_focus: 0,
      });
      this.list.push(...res.data.list);
      this.status = res.data.list.length < 10 ? 'nomore' : 'loadmore';
      this.page++;
    },
  },
  computed: {},
  watch: {},
  onReachBottom() {
    this.loadData();
  },
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  border-top: 1px solid #f5f5f5;
  background: #f5f5f5;
  min-height: 100vh;
}

/* 每条消息的距离 */
.inform_box {
  margin: 20 * 2rpx 10 * 2rpx 0;
}

/* 白色盒子 */
.inform_box .cont_box {
  background-color: #fff;
  border-radius: 8 * 2rpx;
  padding: 0 15 * 2rpx;
}

/* 主要内容 */
.inform_box .cont_box .cont {
  display: flex;
  justify-content: space-between;
  padding: 15 * 2rpx 0;
  border-bottom: 1 * 2rpx solid #f7f7f7;
}

.inform_box .cont_box .cont .user_info {
  display: flex;
}

.inform_box .cont_box .cont .item {
  font-size: 12 * 2rpx;
  color: #d2d2d2;
}

.inform_box .cont_box .cont .portrait img {
  width: 48 * 2rpx;
  height: 48 * 2rpx;
  border-radius: 50%;
  margin-right: 12 * 2rpx;
}

.inform_box .cont_box .cont .cont_text .name {
  font-size: 14 * 2rpx;
}

.inform_box .cont_box .cont .cont_text .info {
  font-size: 14 * 2rpx;
  color: #9c9c9c;
  padding-top: 6 * 2rpx;
}

.more {
  padding: 18 * 2rpx 0 20 * 2rpx;
  color: #9a9a9a;
  display: inline-block;
}

.more img {
  width: 10 * 2rpx;
  height: 10 * 2rpx;
  display: inline-block;
}

.inform_box .time_title {
  font-size: 12 * 2rpx;
  color: #9a9a9a;
  font-weight: bold;
  text-align: center;
  line-height: 24 * 2rpx;
  height: 24 * 2rpx;
  margin-bottom: 12 * 2rpx;
}

.inform_box .cont_box .title {
  height: 45 * 2rpx;
  line-height: 45 * 2rpx;
  display: flex;
  align-items: center;
  border-bottom: 1 * 2rpx solid #f7f7f7;
}

.inform_box .cont_box .title img {
  width: 25 * 2rpx;
  height: 25 * 2rpx;
  margin-right: 11 * 2rpx;
}

.inform_box .cont_box .Inform_cont {
  padding: 15 * 2rpx 0;
  border-bottom: 1 * 2rpx solid #f7f7f7;
}

.inform_box .cont_box .Inform_cont .name {
  font-size: 18 * 2rpx;
  font-weight: bold;
}

.inform_box .cont_box .Inform_cont .time_date {
  font-size: 14 * 2rpx;
  color: #999999;
}

.inform_box .cont_box .Inform_cont .cont_text {
  font-size: 14 * 2rpx;
  padding-top: 16 * 2rpx;
}
</style>

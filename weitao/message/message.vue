<template>
  <view v-if="pageData" class="body">
    <div
      @click="$utils.toUrl('/weitao/praise/praise')"
      class="go-url flex-y-center m-20"
    >
      <div class="portrait">
        <image
          :src="wxapp_img.weitao.news_aid"
          style="width: 100rpx; height: 100rpx"
          mode="aspectFill"
        />
      </div>
      <div class="cont m-l-20 flex-w-1">
        <view class="flex">
          <text class="flex-w-1 font-30"> 点赞 </text>

          <text
            class="color-999 font-24"
            v-if="
              pageData.linke_count && pageData.linke_count.like && pageData.linke_count.like.time_before
            "
          >
            <template v-if="pageData.linke_count.like.time_before.day > 0">
              {{ pageData.linke_count.like.time_before.day }}天前
            </template>

            <template
              v-else-if="
                pageData.linke_count.like.time_before.day < 1 &&
                pageData.linke_count.like.time_before.hour > 0
              "
            >
              {{ pageData.linke_count.like.time_before.hour }}小时前
            </template>
            <template
              v-else-if="
                pageData.linke_count.like.time_before.day < 1 &&
                pageData.linke_count.like.time_before.hour < 1 &&
                pageData.linke_count.like.time_before.min > 0
              "
            >
              {{ pageData.linke_count.like.time_before.min }}分钟前
            </template>
            <template
              v-else-if="
                pageData.linke_count.like.time_before.day < 1 &&
                pageData.linke_count.like.time_before.hour < 1 &&
                pageData.linke_count.like.time_before.min < 1
              "
            >
              {{ pageData.linke_count.like.time_before.sec }}秒前
            </template>
          </text>
        </view>
        <view class="flex m-t-10">
          <text class="flex-w-1 color-999">
            {{
              pageData.like_count.like.nickname
                ? pageData.like_count.like.nickname + '赞了您'
                : '平时多点赞，朋友常相伴'
            }}
          </text>
          <text v-if="pageData.like_count.count > 0" class="num">{{
            pageData.like_count.count
          }}</text>
        </view>
      </div>
    </div>
    <div
      @click="$utils.toUrl('/weitao/comment/comment')"
      class="go-url flex-y-center m-20"
    >
      <div class="portrait">
        <image
          :src="wxapp_img.weitao.news_praise"
          style="width: 100rpx; height: 100rpx"
          mode="aspectFill"
        />
      </div>
      <div class="cont m-l-20 flex-w-1">
        <view class="flex">
          <text class="flex-w-1 font-30"> 回复 </text>

          <text
            class="color-999 font-24"
            v-if="
              pageData.review_count.review &&
              pageData.review_count.review.time_before
            "
          >
            <template v-if="pageData.review_count.review.time_before.day > 0">
              {{ pageData.review_count.review.time_before.day }}天前
            </template>

            <template
              v-else-if="
                pageData.review_count.review.time_before.day < 1 &&
                pageData.review_count.review.time_before.hour > 0
              "
            >
              {{ pageData.review_count.review.time_before.hour }}小时前
            </template>
            <template
              v-else-if="
                pageData.review_count.review.time_before.day < 1 &&
                pageData.review_count.review.time_before.hour < 1 &&
                pageData.review_count.review.time_before.min > 0
              "
            >
              {{ pageData.review_count.review.time_before.min }}分钟前
            </template>
            <template
              v-else-if="
                pageData.review_count.review.time_before.day < 1 &&
                pageData.review_count.review.time_before.hour < 1 &&
                pageData.review_count.review.time_before.min < 1
              "
            >
              {{ pageData.review_count.review.time_before.sec }}秒前
            </template>
          </text>
        </view>
        <view class="flex m-t-10">
          <text class="flex-w-1 color-999">
            {{
              pageData.review_count.review.review
                ? pageData.review_count.review.review
                : '回复你的都在这'
            }}
          </text>
          <text v-if="pageData.review_count.count > 0" class="num">{{
            pageData.review_count.count
          }}</text>
        </view>
      </div>
    </div>
    <div
      @click="$utils.toUrl('/weitao/inform/inform')"
      class="go-url flex-y-center m-20"
    >
      <div class="portrait">
        <image
          :src="wxapp_img.weitao.news_praise"
          style="width: 100rpx; height: 100rpx"
          mode="aspectFill"
        />
      </div>
      <div class="cont m-l-20 flex-w-1">
        <view class="flex">
          <text class="flex-w-1 font-30"> 官方助手 </text>

          <text
            class="color-999 font-24"
            v-if="
              pageData.focus_count.fans && pageData.focus_count.fans.time_before
            "
          >
            <template v-if="pageData.focus_count.fans.time_before.day > 0">
              {{ pageData.focus_count.fans.time_before.day }}天前
            </template>

            <template
              v-else-if="
                pageData.focus_count.fans.time_before.day < 1 &&
                pageData.focus_count.fans.time_before.hour > 0
              "
            >
              {{ pageData.focus_count.fans.time_before.hour }}小时前
            </template>
            <template
              v-else-if="
                pageData.focus_count.fans.time_before.day < 1 &&
                pageData.focus_count.fans.time_before.hour < 1 &&
                pageData.focus_count.fans.time_before.min > 0
              "
            >
              {{ pageData.focus_count.fans.time_before.min }}分钟前
            </template>
            <template
              v-else-if="
                pageData.focus_count.fans.time_before.day < 1 &&
                pageData.focus_count.fans.time_before.hour < 1 &&
                pageData.focus_count.fans.time_before.min < 1
              "
            >
              {{ pageData.focus_count.fans.time_before.sec }}秒前
            </template>
          </text>
        </view>
        <view class="flex m-t-10">
          <text class="flex-w-1 color-999">
            {{
              pageData.focus_count.fans.nickname
                ? pageData.focus_count.fans.nickname + '关注了您'
                : '首单立减5元，新用户独享，速度'
            }}
          </text>
          <text v-if="pageData.focus_count.count > 0" class="num">{{
            pageData.focus_count.count
          }}</text>
        </view>
      </div>
    </div>

    <!-- 私信列表 -->
    <div
      v-for="(item, i) in pageData.list"
      @click="$utils.toUrl('/weitao/private_chat/private_chat?chat_user=' + item.chat_id)"
      class="go-url flex-y-center m-20"
    >
      <div class="portrait">
        <image
          :src="item.chat_head"
          style="width: 100rpx; height: 100rpx; border-radius: 50%"
          mode="aspectFill"
        />
      </div>
      <div class="cont m-l-20 flex-w-1">
        <view class="flex">
          <text class="flex-w-1 font-30"> {{ item.chat_nickname }} </text>

          <text class="color-999 font-24" v-if="item.time_before">
            <template v-if="item.time_before.day > 0">
              {{ item.time_before.day }}天前
            </template>

            <template
              v-else-if="item.time_before.day < 1 && item.time_before.hour > 0"
            >
              {{ item.time_before.hour }}小时前
            </template>
            <template
              v-else-if="
                item.time_before.day < 1 &&
                item.time_before.hour < 1 &&
                item.time_before.min > 0
              "
            >
              {{ item.time_before.min }}分钟前
            </template>
            <template
              v-else-if="
                item.time_before.day < 1 &&
                item.time_before.hour < 1 &&
                item.time_before.min < 1
              "
            >
              {{ item.time_before.sec }}秒前
            </template>
          </text>
        </view>
        <view class="flex m-t-10">
          <text class="flex-w-1 color-999">
            {{ item.content }}
          </text>
          <text v-if="item.unread_count > 0" class="num">{{
            item.unread_count
          }}</text>
        </view>
      </div>
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
  onLoad(params) {},
  onShow() {
    this.loadData();
  },
  methods: {
    async loadData(callback) {
      const res = await this.$requestAll.weitao.getMessage({}, true);
      this.pageData = res.data;
      callback && callback();
    },
  },
  computed: {},
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {
    this.loadData(() => uni.stopPullDownRefresh());
  },
};
</script>
<style lang="scss" scoped>
.body {
  min-height: 100vh;

  .go-url {
    .cont {
      .num {
        min-width: 36rpx;
        height: 36rpx;
        line-height: 36rpx;
        text-align: center;
        border-radius: 18rpx;
        background: red;
        color: #fff;
        font-size: 24rpx;
      }
    }
  }
}
</style>

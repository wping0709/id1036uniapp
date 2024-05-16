<template>
  <view class="bg-fff">
    <view class="title">这些达人也在{{ weitaoTitle.title }}</view>
    <scroll-view scroll-x class="">
      <div class="list">
        <div
          @click="
            $utils.toUrl('/weitao/my_conter/my_conter?user_id=' + item.store_user_id)
          "
          v-for="(item, i) in referrer"
          :key="i"
          class="item"
        >
          <div class="user-img-box">
            <image :src="item.head" mode="aspectFill" />
            <image :src="wxapp_img.weitao.person" mode="aspectFill" />
            <text
              @click.stop="onGuanzhu(item, i)"
              class="iconfont color-fff"
              :class="item.is_user_liked == 1 ? 'icon-duihao' : 'icon-jia'"
            ></text>
          </div>
          <div class="u-line-1">{{ item.nickname }}</div>
        </div>
      </div>
    </scroll-view>
  </view>
</template>

<script>
export default {
  props: {
    pageData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      referrer: [],
    };
  },
  watch: {
    pageData: {
      handler(v, olv) {
        v.referrer && (this.referrer = v.referrer);
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    async onGuanzhu(item, i) {
      await this.$requestAll.weitao.focusUser(
        {
          user_id: item.store_user_id,
          is_user_liked: item.is_user_liked ? 0 : 1,
        },
        true
      );

      let newItem = Object.assign(item, {
        is_user_liked: item.is_user_liked ? 0 : 1,
      });
      this.$set(this.referrer, i, newItem);
    },
  },
  computed: {
    weitaoTitle() {
      let page = uni.$u.page()
      let item = this.$store.getters['SHOP_CONFIG'].wx_bar_title.find(item =>`/${item.url}` == page)
      return item;
    },
  },
};
</script>

<style lang="scss" scoped>
.body {
  background: #fff;
}
.title {
  font-size: 32rpx;
  padding: 20rpx;
  font-weight: 600;
}
.list {
  display: flex;
  align-items: center;
  padding: 20rpx 0;

  .item {
    max-width: 200rpx;
    margin-left: 20rpx;
    margin-right: 20rpx;
    text-align: center;
    font-size: 24rpx;
    .user-img-box {
      margin-bottom: 20rpx;

      position: relative;
      > image:nth-child(1) {
        width: 110rpx;
        height: 110rpx;
        border-radius: 50%;
      }
      > image:nth-child(2) {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 36rpx;
        height: 36rpx;
      }
      > text:nth-last-child(1) {
        position: absolute;
        top: -10rpx;
        right: -10rpx;
        background: #f0250e;
        width: 36rpx;
        height: 36rpx;
        line-height: 36rpx;
        border-radius: 50%;
        font-size: 24rpx;
        font-weight: 900;
      }
    }
  }
}
</style>

<template>
  <view class="topic-body">
    <div @click="switchZhedie" class="title">
      <text>{{ isZhedie ? '展开话题' : '折叠话题' }}</text>
      <text
        class="iconfont"
        :class="isZhedie ? 'icon-arrow-bottom' : 'icon-arrow-top'"
      ></text>
    </div>
    <div class="list" v-if="!isZhedie">
      <div
        
        class="item"
        v-for="(item, i) in pageData.ask_answer"
        :key="i"
      >
        <div class="name">{{ item.topic_name }}</div>
        <div class="biaotai flex">
          <view @click="$utils.toUrl('/weitao/publish/publish?topic_id=' + item.id)">我要表态</view>
          <view @click="$utils.toUrl('/weitao/search_list/search_list?search_topic=' + item.topic_name)"  class="flex-y-center">
            <text class="iconfont icon-pinglun font-40 m-r-10"></text>
            <text>{{ item.article_count }}人已参与</text>
          </view>
        </div>
      </div>
    </div>
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
      isZhedie: true,
    };
  },
  methods: {
    switchZhedie() {
      this.isZhedie = !this.isZhedie;
    },
  },
};
</script>

<style lang="scss" scoped>
.topic-body {
  padding: 20rpx;
  background: #fff;
  font-size: 30rpx;
}
.title {
  border: 1px solid #eee;
  line-height: 60rpx;
  text-align: center;
}
.list {
  .item {
    padding: 20rpx;
    margin-top: 20rpx;
    border: 1px solid #eee;
    .name {
      display: inline-block;
      margin-right: auto;
      background: #fffcdd;
    }
    .biaotai {
      display: flex;
      align-items: center;
      margin-top: 20rpx;
      font-size: 28rpx;

      >view:nth-child(1) {
        padding: 0 20rpx;
        line-height: 2;
        border-radius: 10rpx;
        color: #fff;
        background: linear-gradient(to right, #0781fd, #48c2ed);
      }
      >view:nth-child(2) {
        margin: 10rpx;
      }
    }
  }
}
</style>

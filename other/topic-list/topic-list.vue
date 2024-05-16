<template>
  <view class="flex-col body">
    <view class="tabs-box bg-fff">
      <u-tabs
        :current="status"
        :list="list1"
        :activeStyle="{
          color: 'red',
        }"
        :scrollable="true"
        lineColor="red"
        @change="clickTab"
      ></u-tabs>
    </view>

    <scroll-view @scrolltolower="loadData()" scroll-y class="flex-h-1">
      <div class="scroll-box" v-if="pageData.list.length">
        <view
          class="item m-b-20 bg-fff"
          v-for="(item, index) in pageData.list"
          :key="index"
        >
          <BeiouItem :item="item" v-if="item.layout == 0"></BeiouItem>
          <ZhongshiItem :item="item" v-else></ZhongshiItem>
        </view>
        <u-loadmore :status="pageData.status"></u-loadmore>
      </div>
      <div v-else class="scroll-box">
        <u-empty mode="data" :icon="wxapp_img.empty_data"> </u-empty>
      </div>
    </scroll-view>
  </view>
</template>

<script>
import BeiouItem from '@/components/BeiouItem/BeiouItem.vue';
import ZhongshiItem from '@/components/ZhongshiItem/ZhongshiItem.vue';
export default {
  components: {
    BeiouItem,
    ZhongshiItem,
  },
  data() {
    return {
      list1: [
        {
          id: 0,
          name: '全部',
        },
        {
          id: -1,
          name: '精选',
        },
      ],
      status: 0,
      type: 0,
      pageData: {
        list: [],
        page: 1,
        status: 'loadmore',
      },
    };
  },
  onLoad(params) {
    this.type = params.type || 0;
    this.getCat();
  },
  methods: {
    async getCat() {
      const res = await this.$requestAll.default.topicType({});
      this.list1.push(...res.data.list);
      let index = this.list1.findIndex(item => item.id == this.type);
      this.status = index != -1 ? index : 0;
      this.loadData();
    },
    async loadData() {
      if (this.pageData.status == 'nomore') return;
      const res = await this.$requestAll.default.topicList(
        {
          page: this.pageData.page,
          reload: true,
          type: this.list1[this.status].id,
        },
        true
      );
      this.pageData.page++;
      this.pageData.status = res.data.list.length < 20 ? 'nomore' : 'loadmore';
      this.pageData.list.push(...res.data.list);
    },
    clickTab({ index }) {
      this.status = index;
      this.resetPageData();
    },
    resetPageData() {
      this.pageData = this.$options.data().pageData;
      this.loadData();
    },
  },
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
    margin-bottom: 20rpx;
  }
}
</style>

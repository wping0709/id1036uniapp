<template>
  <view>
    <div class="tabs">
      <div @click="switchTab(0)" :class="tabIndex == 0 && 'check'" class="tab">
        最新
      </div>
      <div @click="switchTab(1)" :class="tabIndex == 1 && 'check'" class="tab">
        热门
      </div>
      <div @click="switchTab(2)" :class="tabIndex == 2 && 'check'" class="tab">
        推荐
      </div>
      <div @click="switchTab(3)" :class="tabIndex == 3 && 'check'" class="tab">
        关注
      </div>
    </div>

    <List ref="List" :list="listCont" :listChange.sync="listCont"></List>
  </view>
</template>

<script>
import List from './List.vue';
export default {
  components: {
    List,
  },
  props: {
    pageData: {
      type: Object,
      default() {
        return {};
      },
    },
    address: {
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      tabIndex: 0,
      listCont: [],
      status: 'loadmore',
      page: 2,
    };
  },
  watch: {
    pageData: {
      handler(v, olv) {
        this.listCont = v.listcont[this.tabIndex] || [];
        this.status =
          v.listcont[this.tabIndex].length < 10 ? 'nomore' : 'loadmore';
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    switchTab(i) {
      this.tabIndex = i;
      this.page = 2;
      this.status =
        this.pageData.listcont[i].length < 10 ? 'nomore' : 'loadmore';
      this.listCont = this.pageData.listcont[i];
    },
    
    onScroll(e) {
      this.$refs['List'].onScroll(e)
    },

    async getListCont() {
      if (this.status == 'nomore') return;
      const res = await this.$requestAll.weitao.pageIndex(
        {
          page: this.page,
          city_name: !this.address.length ? '全国' : this.address[1].name,
          city_code: !this.address.length ? '100001' : this.address[1].id,
          search_type: this.tabIndex,
        },
        true
      );
      this.listCont.push(...res.data.list);
      this.status = res.data.list.length < 10 ? 'nomore' : 'loadmore';
      this.page++;
    },
  },
};
</script>

<style lang="scss" scoped>
.tabs {
  display: flex;
  align-items: center;
  padding: 10rpx 20rpx;
  .tab {
    line-height: 2;
    font-size: 30rpx;
    width: 100rpx;
    text-align: center;
    margin-right: 10rpx;
  }
  .check {
    position: relative;
    font-weight: 700;
    &::after {
      content: '';
      position: absolute;
      bottom: 0rpx;
      left: 50%;
      transform: translateX(-50%);
      height: 4rpx;
      width: 60rpx;
      background: #333;
    }
  }
}

</style>

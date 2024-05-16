<template>
  <view class="body" :style="{backgroundColor: list_setting.page_bar_color}">
    <div v-if="list_setting.page_pic" class="flex-x-center flex-y-center">
      <image :src="list_setting.page_pic" mode="aspectFill" style="width:710rpx;aspect-ratio:375/240;height:initial;"></image>
    </div>
    <template v-if="pageData.list.length">
      <GoodsList :goodsList="pageData.list" pageUrl="/pages/goods/goods"></GoodsList>
      <u-loadmore :status="pageData.status"></u-loadmore>
    </template>
    <template v-else>
      <u-empty mode="data" :icon="wxapp_img.empty_data"> </u-empty>
    </template>
  </view>
</template>
<script>
import GoodsList from '@/components/goods/GoodsList';
export default {
  components: {
    GoodsList,
  },
  data() {
    return {
      pageData: {
        list: [],
        page: 1,
        status: 'loadmore',
      },
      list_setting: '',
    };
  },
  onLoad() {
    this.loadData();
  },
  methods: {
    async loadData() {
      if (this.pageData.status == 'nomore') return;
      const res = await this.$requestAll.default.goodsList(
        {
          page: 1,
          sort: 0,
          sort_type: -1,
          buying_method: 1,
        },
        true
      );
      !this.list_setting && (this.list_setting = res.data.list_setting);

      this.pageData.list.push(...res.data.list);
      this.pageData.page++;
      this.pageData.status =
        res.data.page_count <= this.pageData.page ? 'nomore' : 'loadmore';
    },
  },
  onShow() {},
  computed: {},
  watch: {},
  onReachBottom() {
    this.loadData();
  },
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
}
</style>

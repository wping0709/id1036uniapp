<template>
  <view class="body flex-col">
    <view class="bg-fff p-y-10 p-x-20">
      <u-search
        placeholder="搜索名称或关键字添加商品"
        clearabled
        :actionText="!isSearch ? '搜索' : '取消'"
        @search="onSearch"
        @custom="onCustom"
        v-model="keyword"
      ></u-search>
    </view>
    <scroll-view @scrolltolower="loadData" scroll-y class="flex-h-1">
      <view
        class="scroll-box"
        v-if="isSearch ? searchData.list.length : pageData.list.length"
      >
        <GoodsList
          @switchAdd="switchAdd"
          :list="isSearch ? searchData.list : pageData.list"
        ></GoodsList>
        <u-loadmore
          :status="isSearch ? searchData.status : pageData.status"
        ></u-loadmore>
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
import GoodsList from './components/GoodsList.vue';
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
      searchData: {
        list: [],
        page: 1,
        status: 'loadmore',
      },
      keyword: '',
      anchor_id: '',
      isSearch: false,
    };
  },
  onLoad(params) {
    this.anchor_id = params.anchor_id;
    this.loadData();
  },
  methods: {
    // 获取我的商品
    async loadData() {
      if (this.pageData.status == 'nomore' && !this.isSearch) return;
      if (this.searchData.status == 'nomore' && this.isSearch) return;

      const formData = {
        anchor_id: this.anchor_id,
        type: this.isSearch ? 'search':  'live',
        page: this.isSearch ? this.searchData.page: this.pageData.page
      };
      
      const res = await this.$requestAll.lives.getGoodsList(formData, true);
      if (this.isSearch) {
        this.searchData.list.push(...res.data.list);
        this.searchData.status =
          res.data.list.length < 10 ? 'nomore' : 'loadmore';
        this.searchData.page++;
      } else {
        this.pageData.list.push(...res.data.list);
        this.pageData.status =
          res.data.list.length < 10 ? 'nomore' : 'loadmore';
        this.pageData.page++;
      }
    },
   
    // 搜索
    onSearch() {
      this.searchData = this.$options.data().searchData;
      this.isSearch = true;
      this.loadData();
    },
    // 点击搜索按钮
    onCustom() {
      if (this.isSearch) {
        this.pageData = this.$options.data().pageData;
        this.isSearch = false;
      } else {
        this.searchData = this.$options.data().searchData;
        this.isSearch = true;
      }
      this.loadData();
    },
    // 移出添加商品
    switchAdd(item, index) {
      uni.showModal({
        title: '提示',
        content: `确定要${item.is_add ? '移出' : '添加'}该商品吗?`,
        success: async res => {
          if (res.confirm) {
            const formData = {
              anchor_id: this.anchor_id,
              goods_id: item.goods_id,
            };
            this.$requestAll.lives.switchGoods(formData, true, !item.is_add);
            if (this.isSearch) {
              item.is_add = item.is_add < 1 ? 1 : 0;
              this.$set(this.searchData.list, index, item);
            } else {
              this.pageData = this.$options.data().pageData;
              this.loadData();
            }
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        },
      });
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
}
</style>

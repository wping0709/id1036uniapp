<template>
  <view v-if="pageData" class="body">
    <!-- 搜索框 -->
    <div class="search flex-y-center">
      <div @click="showAddress = true" class="address flex-y-center p-x-20">
        <PickerAddress
          :num="2"
          :valueChange.sync="checkAddress"
          isWholeCountry
        >
          <view class="u-line-1 flex-w-1">
            {{ checkAddress ? checkAddress[1].name : '全国' }}
          </view>
        </PickerAddress>
        <text class="iconfont icon-arrow-bottom"></text>
      </div>
      <div @click="$utils.toUrl('/weitao/search_list/search_list')" class="search-input p-x-20 flex-y-center flex-w-1">
        <text class="iconfont icon-sousuo"></text>
        <text class="m-l-10">搜帖子</text>
      </div>
      <div @click="$utils.toUrl('/weitao/message/message')" class="iconfont icon-xiaoxi p-x-10 font-w-700">
        <div v-if="pageData.message > 1" class="dian"></div>
      </div>
      <image @click="$utils.toUrl('/weitao/my_conter/my_conter')" :src="pageData.user.head" mode="aspectFill" />
    </div>

    <!-- 达人推荐 -->
    <DarenRecommend :pageData="pageData"></DarenRecommend>

    <!-- 话题 -->
    <Topic :pageData="pageData"></Topic>

    <ListCont
      ref="ListCont"
      :address="checkAddress"
      :pageData="pageData"
    ></ListCont>

    <div
      @click="$utils.toUrl('/weitao/publish/publish')"
      class="fabu iconfont icon-jia"
    ></div>

    <TabBar></TabBar>
  </view>
</template>
<script>
import DarenRecommend from './components/DarenRecommend';
import Topic from './components/Topic';
import ListCont from './components/ListCont';
import TabBar from '@/components/TabBar';
import PickerAddress from '@/components/picker-address/picker-address';

import share from '@/mixins/share'

export default {
  mixins: [share],
  components: {
    DarenRecommend,
    Topic,
    ListCont,
    TabBar,
    PickerAddress,
  },
  data() {
    return {
      pageData: '',
      showAddress: false,
      checkAddress: '',
    };
  },

  onLoad(params) {
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      const res = await this.$requestAll.weitao.index({}, true);
      this.pageData = res.data;
	  console.log(111111111,this.pageData)
    },
  },

  onPageScroll(e) {
    uni.$u.throttle(this.$refs['ListCont'].onScroll)
    
  },

  computed: {
    shareData() {
      return {
        title: this.$store.getters['SHOP_CONFIG'].wx_bar_title[17].title, //微淘的自定义导航栏标题
      }
    }
  },
  watch: {
    checkAddress(v) {
      this.loadData();
    },
  },
  onReachBottom() {
    this.$refs['ListCont'].getListCont();
  },
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  // background: #f5f5f5;
  min-height: 100vh;
}

.search {
  padding: 15rpx 0;
  background: #fff;
  .address {
    .u-line-1 {
      width: initial;
      max-width: 120rpx;
    }
  }
  .search-input {
    line-height: 60rpx;
    background: #eee;
    border-radius: 30rpx;
  }
  .icon-xiaoxi {
    position: relative;
    .dian{
      position: absolute;
      right: 5rpx;
      top: 5rpx;
      width: 8rpx;
      height: 8rpx;
      border-radius: 50%;
      background: red;
    }
  }
  > image {
    width: 50rpx;
    height: 50rpx;
    border-radius: 50%;
    margin: 0 10rpx;
  }
}

.fabu {
  background: red;
  position: fixed;
  right: 30rpx;
  z-index: 999;
  bottom: 150rpx;
  bottom: calc(150rpx + env(safe-area-inset-bottom));
  width: 70rpx;
  height: 70rpx;
  line-height: 70rpx;
  border-radius: 50%;

  text-align: center;
  font-size: 40rpx;
  color: #fff;
  font-weight: 700;
}
</style>

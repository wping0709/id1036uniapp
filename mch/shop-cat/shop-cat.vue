<template>
  <view class="body flex-col">
    <DiyHead :shopData="shopData"></DiyHead>

    <scroll-view scroll-y class="flex-h-1">
      <div class="cat-list">
        <div class="left" style="width: 180rpx">
          <Sidebar
            :list="catData"
            :current1="current1"
            @change="cat1Change"
          ></Sidebar>
        </div>
        <div class="flex-w-1 flex-col" style="position: relative">
          <!-- 二级分类 -->
          <div v-if="catData[current1] && catData[current1].list.length" class="cat2-box-style6">
            <view class="p-r-10">
              <u-tabs
                @change="cat2Change"
                :list="catData[current1].list"
                :current="current2"
                keyName="name"
                lineColor="#ff4544"
              >
                <view
                  slot="right"
                  style="padding: 20rpx"
                  @tap="cat2AllShow = !cat2AllShow"
                >
                  <u-icon
                    v-if="cat2AllShow"
                    name="arrow-up"
                    size="34rpx"
                  ></u-icon>
                  <u-icon v-else name="arrow-down" size="34rpx"></u-icon>
                </view>
              </u-tabs>
            </view>

            <!-- 二级分类 -->
            <view
              class="cat-fixed-style6"
              @click.native="cat2AllShow = !cat2AllShow"
              v-show="cat2AllShow"
            >
              <view
                @click.stop
                class="cat-2"
                v-if="catData[current1].list.length"
              >
                <view
                  @click="cat2Change({ index: i2 })"
                  v-for="(cat2, i2) in catData[current1].list"
                  :key="i2"
                  :class="['cat-2-item', cat2.id == cat_id && 'active-cat-2']"
                  >{{ cat2.name }}</view
                >
              </view>
              <view v-else class="flex-x-center flex-h-1">
                <u-empty mode="data" :icon="wxapp_img.empty_data"> </u-empty>
              </view>
            </view>
          </div>

          <!-- 二级商品 -->
          <scroll-view
            @scrolltolower="tolower"
            scroll-y
            v-if="goodsData.list.length"
            class="flex-h-1 bg-fff"
          >
            <view
              v-for="(goods, goodsIndex) in goodsData.list"
              :key="goodsIndex"
              class="goods-item-style6"
              @click="$utils.toUrl('/pages/goods/goods?id=' + goods.id)"
            >
              <view class="goods-img-box">
                <image :src="goods.cover_pic" mode="aspectFill" />
                <!-- 无库存图片 -->
                <!-- <image
                  v-if="!goods.surplus_num"
                  :src="wxapp_img.goods_num0"
                  mode="aspectFill"
                /> -->
              </view>
              <view class="goods-content-style6 flex-w-1 flex-col flex-x-sb">
                <view>
                  <view class="goods-title u-line-2">{{ goods.name }}</view>
                  <!-- <view v-if="store.is_sales" class="color-999 m-b-10 font-22"
                    >销量{{ goods.sales }}</view
                  > -->
                </view>
                <view>
                  <view class="flex-y-center flex-x-sb">
                    <view class="flex-w-1">
                      <view class="price-color">
                        ￥
                        <text class="font-30 font-w-600">{{
                          goods.price
                        }}</text>
                      </view>
                      <view
                        class="flex-y-center"
                        v-if="goods.is_level == '1' && store.is_member_price"
                      >
                        <text>￥{{ goods.goods_member_price }}</text>
                        <image
                          :src="wxapp_img.diy.black_bar"
                          style="width: 70rpx; height: 23rpx"
                          mode="aspectFill"
                        />
                      </view>
                    </view>
                    <!-- <view @click.stop="clickAdd(goods)" class="goods-bt">
                      选规格
                    </view> -->
                  </view>
                </view>
              </view>
            </view>
            <u-loadmore
              :status="goodsData.isBottom ? 'nomore' : 'loadmore'"
            ></u-loadmore>
          </scroll-view>
          <div v-else class="flex-x-center flex-h-1">
            <u-empty mode="data" :icon="wxapp_img.empty_data"> </u-empty>
          </div>
        </div>
      </div>
    </scroll-view>

    <TabBar v-if="mch_id" :params="{ mch_id }" type="shopTabBar"></TabBar>
  </view>
</template>

<script>
import TabBar from '@/components/TabBar';
import DiyHead from '@/mch/shop/components/DiyHead';
import Sidebar from '@/pages/cat/components/Sidebar';

export default {
  components: {
    TabBar,
    DiyHead,
    Sidebar,
  },
  data() {
    return {
      shopData: '', //店铺数据
      catData: '', //分类数据
      mch_id: '', //店铺id
      cat_id: '', //当前选中分类id
      current1: 0, //一级分类索引
      current2: 0, //二级分类索引
      cat2AllShow: false, //二级分类弹层
      goodsData: {
        page: 1,
        list: [],
        isBottom: false,
      }, //商品数据
    };
  },
  onLoad(param) {
    this.mch_id = param.mch_id;
    this.cat_id = param.cat_id
    this.getCatList();
     this.getShopData();
  },
  methods: {
    async getShopData() {
      const formData = {
        mch_id: this.mch_id,
        tab: 3,
      };
      const res = await this.$requestAll.mch.indexShop(formData, true);
      this.shopData = res.data;
    },
    async getCatList() {
      const res = await this.$requestAll.mch.getShopCat(
        { mch_id: this.mch_id },
        true
      );

      this.catData = res.data.list;
      if(this.cat_id) {
       let fIndex = this.catData.findIndex(item => item.id == this.cat_id)
       this.current1 = fIndex != -1 ? fIndex : 0
      }
      this.cat1Change({index:this.current1})
    },
    navTo(cat) {
      console.log(123);
      this.$utils.toUrl(
        `/mch/shop-goods/index?tab=2&mch_id=${this.mch_id}&cat_id=${cat.id}`,
        'redirectTo'
      );
    },
    // 获取商品
    async getGoodsList() {
      if (this.goodsData.isBottom) return;
      const formData = {
        mch_id: this.mch_id,
        tab: 2,
        page: this.goodsData.page,
        cat_id: this.cat_id,
      };
      const res = await this.$requestAll.mch.indexShop(formData, true);
      this.goodsData.list.push(...res.data.goods_list);
      this.goodsData.isBottom = res.data.goods_list.length < 20;
    },
    // 一级分类变化
    cat1Change(v) {
      this.current1 = v.index;
      this.current2 = 0;
      if (this.catData[this.current1].list[this.current2]) {
        this.cat_id = this.catData[this.current1].list[this.current2].id;
      } else {
        this.cat_id = this.catData[this.current1].id;
      }

      this.goodsData = this.$options.data().goodsData;
      this.getGoodsList();
    },

    // 二级分类变化
    cat2Change(index) {
      this.current2 = index.index;
      this.cat_id = this.catData[this.current1].list[this.current2].id;
      this.goodsData = this.$options.data().goodsData;
      this.getGoodsList();
    },
    // 商品触底事件
    tolower() {
      this.goodsData.page++;
      this.getGoodsList();
    },
  },
};
</script>

<style lang="scss" scoped>
.body {
  height: 100vh;
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */
  background: #f5f5f5;
}
.cat-list {
  height: 100%;
  display: flex;
  flex-direction: row;
  .cat2-box-style6 {
    background: #f5f5f5;
    .cat-fixed-style6 {
      position: absolute;
      top: 44px;
      left: 0;
      z-index: 9;
      width: 100%;
      background: rgba(0, 0, 0, 0.3);
      height: calc(100% - 44px);
      > view {
        border-radius: 0 0 20rpx 20rpx;
        background: #fff;
      }
    }
  }

  .goods-item-style6 {
    padding: 10rpx;
    margin-bottom: 10rpx;
    display: flex;
    justify-content: space-between;
    .goods-img-box {
      position: relative;
      image {
        width: 200rpx;
        height: 200rpx;
        &:nth-child(2) {
          position: absolute;
          left: 0;
          top: 0;
        }
      }
    }
    .goods-content-style6 {
      margin-left: 10rpx;
      .goods-bt {
        border-radius: 20rpx;
        padding: 4rpx 16rpx;
        background: #ff4544;
        color: #fff;
      }
    }
  }

  .cat-2 {
    display: flex;
    flex-wrap: wrap;
    padding: 0 20rpx;
    padding-bottom: 20rpx;
    .cat-2-item {
      border: 2rpx solid #eee;
      border-radius: 30rpx;
      padding: 10rpx 20rpx;
      margin: 20rpx 20rpx 0 0;
    }
    .active-cat-2 {
      border: 2rpx solid #ff4544;
      color: #ff4544;
    }
  }
}
</style>

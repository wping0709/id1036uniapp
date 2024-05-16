<template>
  <view v-if="catData" class="body flex-col">
    <view class="flex-col flex-h-1">
      <!-- 头部搜索 -->
      <CatHead
        :current1="current1"
        :catData="catData"
        :catList="catList"
        :cat_id="cat_id"
        @cat1Change="cat1Change"
        @cat2Change="cat2Change"
      ></CatHead>

      <!-- 大图 -->
      <view
        v-if="catData.cat_style == 2 || catData.cat_style == 1"
        class="flex-h-1 flex-x-sb"
      >
        <Sidebar
          :list="catData.list"
          :current1="current1"
          @change="cat1Change"
          v-if="catData.cat_style == 2"
        ></Sidebar>

        <scroll-view
          @scrolltolower="tolower"
          scroll-y
          class="flex-h-1 scroll-view-goods-style2"
        >
          <view
            v-for="(goods, goodsIndex) in goodsData.list"
            :key="goodsIndex"
            class="goods-item-style2"
            @click="$utils.toUrl('/pages/list/list?cat_id=' + this.cat_id)"
          >
            <image
              :src="goods.pic_url"
              mode="aspectFill"
              style="width: 100%; height: 300rpx"
            />
          </view>
          <u-loadmore
            :status="goodsData.isBottom ? 'nomore' : 'loadmore'"
          ></u-loadmore>
        </scroll-view>
      </view>

      <!-- 小图模式 -->
      <view
        v-if="catData.cat_style == 3 || catData.cat_style == 4"
        class="flex-h-1 flex-x-sb"
      >
        <Sidebar
          :list="catData.list"
          :current1="current1"
          @change="cat1Change"
          v-if="catData.cat_style == 4"
        ></Sidebar>
        <scroll-view
          scroll-y
          class="flex-h-1"
          style="height: 100%; padding: 0 15rpx"
        >
          <div v-if="catList.length" class="cat-box">
            <view
              v-for="(cat2, i2) in catList"
              :key="i2"
              class="cat2-item-style3 cat2-item-style4"
              :style="{
                width: catData.cat_style == 3 ? '25%' : '33.33%',
              }"
              @click="$utils.toUrl('/pages/list/list?cat_id=' + cat2.id)"
            >
              <image :src="cat2.pic_url" mode="aspectFill" />
              <view>{{ cat2.name }}</view>
            </view>
          </div>
          <div v-else class="flex-x-center">
            <u-empty mode="data" :icon="wxapp_img.empty_data"> </u-empty>
          </div>
        </scroll-view>
      </view>

      <!-- 商品列表模式 -->
      <view v-if="catData.cat_style == 5" class="flex-h-1 flex-col">
        <scroll-view @scrolltolower="tolower" scroll-y class="flex-h-1">
          <GoodsList :goodsList="goodsData.list"  :is_sales="store.is_sales"></GoodsList>
          <u-loadmore
            :status="goodsData.isBottom ? 'nomore' : 'loadmore'"
          ></u-loadmore>
        </scroll-view>
      </view>

      <!-- 列表模式 -->
      <view v-if="catData.cat_style == 6" class="flex-h-1 flex-x-sb">
        <Sidebar
          :list="catData.list"
          :current1="current1"
          @change="cat1Change"
        ></Sidebar>
        <view class="right-style6 flex-w-1 flex-col">
          <!-- 二级分类 -->
          <div
            v-if="catData.list[current1].list.length"
            class="cat2-box-style6"
          >
            <view class="p-r-10">
              <u-tabs
                @change="cat2Change"
                :list="catData.list[current1].list"
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
            <view
              class="cat-fixed-style6"
              @click.native="cat2AllShow = !cat2AllShow"
              v-show="cat2AllShow"
            >
              <view
                @click.stop
                class="cat-2"
                v-if="catData.list[current1].list.length"
              >
                <view
                  @click="cat2Change({ index: i2 })"
                  v-for="(cat2, i2) in catData.list[current1].list"
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
            class="flex-h-1 goods-box-style6"
          >
            <view
              v-for="(goods, goodsIndex) in goodsData.list"
              :key="goodsIndex"
              class="goods-item-style6"
              @click="$utils.toUrl('/pages/goods/goods?id=' + goods.id)"
            >
              <view class="goods-img-box">
                <image :src="goods.pic_url" mode="aspectFill" />
                <!-- 无库存图片 -->
                <image
                  v-if="!goods.surplus_num"
                  :src="wxapp_img.goods_num0"
                  mode="aspectFill"
                />
              </view>
              <view class="goods-content-style6 flex-w-1 flex-col flex-x-sb">
                <view>
                  <view class="goods-title u-line-2">{{ goods.name }}</view>
                  <view v-if="store.is_sales" class="color-999 m-b-10 font-22"
                    >销量{{ goods.sales }}</view
                  >
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
                    <view @click.stop="clickAdd(goods)" class="goods-bt">
                      选规格
                    </view>
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
        </view>
      </view>

      <!-- 三级分类模式（显示侧栏) -->
      <view v-if="catData.cat_style == 7" class="flex-h-1 flex-x-sb">
        <Sidebar
          :list="catData.list"
          :current1="current1"
          @change="cat1Change"
        ></Sidebar>

        <view class="right-style6 flex-w-1 flex-col">
          <scroll-view
            @scrolltolower="tolower"
            scroll-y
            v-if="catData.list[current1].list.length"
            class="flex-h-1 goods-box-style6"
          >
            <view
              v-for="(cat2, i2) in catData.list[current1].list"
              :key="i2"
              class="m-10 p-20"
              style="background: #f5f5f5; border-radius: 10rpx"
            >
              <!-- 二级分类标题 -->
              <view
                @click="$utils.toUrl('/pages/list/list?cat_id=' + cat2.id)"
                class="flex-y-center font-28"
              >
                <text>{{ cat2.name }}</text>
                <text
                  class="iconfont icon-arrow-right color-666 font-24"
                  style="margin-top: 6rpx"
                ></text>
              </view>
              <!-- 三级分类 -->
              <div v-if="cat2.list.length" class="cat-box">
                <view
                  v-for="cat3 in cat2.list"
                  :key="cat3.id"
                  class="cat2-item-style3"
                  :style="{
                    width: '25%',
                  }"
                  @click="$utils.toUrl('/pages/list/list?cat_id=' + cat3.id)"
                >
                  <image :src="cat3.pic_url" mode="aspectFill" />
                  <view class="font-center u-font-26">{{ cat3.name }}</view>
                </view>
              </div>
            </view>
          </scroll-view>
          <div v-else class="flex-x-center flex-h-1">
            <u-empty mode="data" :icon="wxapp_img.empty_data"> </u-empty>
          </div>
        </view>
      </view>

      <!-- 小图模式（顶部显示一级分类，侧栏显示二级分类） -->
      <view v-if="catData.cat_style == 8" class="flex-h-1 flex-x-sb">
        <Sidebar
          v-if="catData.list[current1].list.length"
          :list="catData.list[current1].list"
          :current1="current2"
          @change="cat2Change"
        ></Sidebar>

        <view class="right-style6 flex-w-1 flex-col">
          <scroll-view
            @scrolltolower="tolower"
            scroll-y
            v-if="goodsData.list.length"
            class="flex-h-1 goods-box-style6"
          >
            <view
              v-for="(goods, goodsIndex) in goodsData.list"
              :key="goodsIndex"
              class="goods-item-style6"
              @click="$utils.toUrl('/pages/goods/goods?id=' + goods.id)"
            >
              <view class="goods-img-box">
                <image :src="goods.pic_url" mode="aspectFill" />
                <!-- 无库存图片 -->
                <image
                  v-if="!goods.surplus_num"
                  :src="wxapp_img.goods_num0"
                  mode="aspectFill"
                />
              </view>
              <view class="goods-content-style6 flex-w-1 flex-col flex-x-sb">
                <view>
                  <view class="goods-title u-line-2">{{ goods.name }}</view>
                  <view v-if="store.is_sales" class="color-999 m-b-10 font-22"
                    >销量{{ goods.sales }}</view
                  >
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
                          style="width: 70rpx"
                          mode="widthFix"
                        />
                      </view>
                    </view>
                    <view @click.stop="clickAdd(goods)" class="goods-bt">
                      选规格
                    </view>
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
        </view>
      </view>

      <!-- -->
      <view v-if="catData.cat_style == 9" class="flex-h-1 flex-x-sb">
        <Sidebar
            v-if="catData.list[current1].list.length"
            :list="catData.list[current1].list"
            :current1="current2"
            @change="cat2Change"

        ></Sidebar>

        <view class="right-style6 flex-w-1 flex-col">
          <scroll-view
              @scrolltolower="tolower"
              scroll-y
              v-if="goodsData.list.length"
              class="flex-h-1 goods-box-style6"
          >
            <view class="advert goods-item-style9"

                  @click="$utils.toUrl(catData.list[current1].advert_url)"
                  v-if="catData.list[current1].advert_pic"
            >
              <view >
                <img  :src="catData.list[current1].advert_pic" class="guanggao" style="width: 100%;height: 200rpx;" alt="" />
              </view>
            </view>

            <view
                v-if="goodsData.cat_list.length > 0"
                v-for="item in goodsData.cat_list"
            >

              <view
                    style="color: black;
						  width: 180rpx;
						  font-size: 35rpx;
						  text-align: center;
						  font-weight: 800;">
                {{item.name}}
              </view>

              <view
                  v-for="(goods, goodsIndex) in goodsData.list"
                  :key="goodsIndex"
                  class="goods-item-style9"
                  v-if="goods.cat_id==item.id"
                  @click="$utils.toUrl('/pages/goods/goods?id=' + goods.id)">
                <view class="goodsBox">
                  <view class="goods-img-box">

                    <image :src="goods.pic_url" mode="aspectFill" />
                    <!-- 无库存图片 -->
                    <image
                        v-if="!goods.surplus_num"
                        :src="wxapp_img.goods_num0"
                        mode="aspectFill"
                    />
                  </view>
                  <view class="goods-content-style6 flex-w-1 flex-col flex-x-sb">
                    <view>
                      <view class="goods-title u-line-2">{{ goods.name }}</view>
                      <view v-if="store.is_sales" class="color-999 m-b-10 font-22"
                      >销量{{ goods.sales }}</view
                      >
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
                                style="width: 70rpx"
                                mode="widthFix"
                            />
                          </view>
                        </view>
                        <view @click.stop="clickAdd(goods)" class="goods-bt">
                          选规格
                        </view>
                      </view>
                    </view>
                  </view>
                </view>

              </view>

            </view>
            <view
                v-if="goodsData.cat_list.length == 0"
                v-for="(goods, goodsIndex) in goodsData.list"
                :key="goodsIndex"
                class="goods-item-style9"
                @click="$utils.toUrl('/pages/goods/goods?id=' + goods.id)">
              <view class="goodsBox">
                <view class="goods-img-box">

                  <image :src="goods.pic_url" mode="aspectFill" />
                  <!-- 无库存图片 -->
                  <image
                      v-if="!goods.surplus_num"
                      :src="wxapp_img.goods_num0"
                      mode="aspectFill"
                  />
                </view>
                <view class="goods-content-style6 flex-w-1 flex-col flex-x-sb">
                  <view>
                    <view class="goods-title u-line-2">{{ goods.name }}</view>
                    <view v-if="store.is_sales" class="color-999 m-b-10 font-22"
                    >销量{{ goods.sales }}</view
                    >
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
                              style="width: 70rpx"
                              mode="widthFix"
                          />
                        </view>
                      </view>
                      <view @click.stop="clickAdd(goods)" class="goods-bt">
                        选规格
                      </view>
                    </view>
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
        </view>
      </view>

      <!-- 选择规格弹框 -->
      <AttrPopup
        ref="AttrPopup"
        :showText="false"
        :goodsId="goodsId"
      ></AttrPopup>
    </view>

    <TabBar></TabBar>

    <QOfficialAccount></QOfficialAccount>
  </view>
</template>
<script>
import Search from './components/search';
import TabBar from '@/components/TabBar';
import GoodsList from '@/components/goods/GoodsList';
import Sidebar from './components/Sidebar';
import CatHead from './components/head';
import AttrPopup from '@/components/goods/AttrPopup';
import share from '@/mixins/share.js';

export default {
  mixins: [share],
  components: {
    TabBar,
    Search,
    GoodsList,
    Sidebar,
    CatHead,
    AttrPopup,
  },
  data() {
    return {
      catData: '', //分类数据
      cat_id: '',
      current1: 0, //1级分类索引
      current2: 0, //2级分类索引
      goodsList: [], //商品列表
      goodsData: {
        page: 1,
        list: [],
        cat_list: [],
        brr:[],
        isBottom: false,
      },
      cat2AllShow: false,
      goodsId: '',
    };
  },
  onLoad() {
    let switchTabParams = uni.getStorageSync('switchTabParams');

    if (
      switchTabParams &&
      switchTabParams[0] == '/pages/cat/cat' &&
      switchTabParams[1].split('=')[1]
    ) {
      // this.cat_id = switchTabParams[1].split('=')[1];
      this.cat_id = this.$utils.urlToJson(switchTabParams[1]).cat_id;
      uni.removeStorageSync('switchTabParams');
    }
    this.loadData();
  },
  
  methods: {
    // 获取分类数据
    async loadData() {
      const res = await this.$requestAll.default.catList({});
      this.catData = res.data;
      if ([4, 6, 7, 8, 9].some(item => res.data.cat_style)) {
        console.log(this.cat_id);
        if (this.cat_id) {
          this.getCurrent(res.data.list);
        } else if(res.data.list.length) {
          if (res.data.list[this.current1].list.length) {
            this.cat_id = res.data.list[this.current1].list[this.current2].id;
          } else {
            this.cat_id = res.data.list[this.current1].id;
          }
        }
      }
      this.getGoodsList();
    },
    // 获取商品
    async getGoodsList() {
      if (this.goodsData.isBottom) return;
      const { data } = await this.$requestAll.default.goodsList(
        {
          page: this.goodsData.page,
          cat_id: this.cat_id,
        },
        true
      );
      this.goodsData.cat_list.push(...data.cat_list);
      this.goodsData.list.push(...data.list);
      this.goodsData.isBottom = this.goodsData.list.length >= data.row_count;
    },

    // 一级分类变化
    cat1Change(v) {
      this.current1 = v.index;
      this.current2 = 0;
      if (
        [6,8, 9].some(item => item == this.catData.cat_style) &&
        this.catData.list[this.current1].list[this.current2]
      ) {
        this.cat_id = this.catData.list[this.current1].list[this.current2].id;
      } else {
        this.cat_id = this.catData.list[this.current1].id;
      }

      this.goodsData = this.$options.data().goodsData;
      this.getGoodsList();
    },
    // 二级分类变化
    cat2Change(index) {
      this.current2 = index.index;
      this.cat_id = this.catData.list[this.current1].list[this.current2].id;
      this.goodsData = this.$options.data().goodsData;
      this.getGoodsList();
    },
    // 商品触底事件
    tolower() {
      this.goodsData.page++;
      this.getGoodsList();
    },
    // 点击添加购物车
    clickAdd(goods) {
      console.log(goods);
      this.goodsId = goods.id;
      this.$refs['AttrPopup'].showPopup('addCart');
    },
    getCurrent(list) {
      // 查找一级
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        if (item.id == this.cat_id) {
          this.current1 = i;
          return;
        } else {
          // 查找二级
          for (let i1 = 0; i1 < item.list?.length; i1++) {
            const item1 = item.list[i1];
            if (item1.id == this.cat_id) {
              this.current1 = i;
              this.current2 = i1;
              return;
            } else {
              for (let i2 = 0; i2 < item1.list?.length; i2++) {
                const item2 = item1.list[i2];
                if (item2.id == this.cat_id) {
                  this.current1 = i;
                  this.current2 = i1;
                  return;
                }
              }
            }
          }
        }
      }
    },
  },
  onShow() {
    let switchTabParams = uni.getStorageSync('switchTabParams');

    if (
      switchTabParams &&
      switchTabParams[0] == '/pages/cat/cat' &&
      switchTabParams[1].split('=')[1]
    ) {
      this.cat_id = switchTabParams[1].split('=')[1];
      this.current2 = 0;
      this.goodsData = {
        page: 1,
        list: [],
        isBottom: false,
      };
      uni.removeStorageSync('switchTabParams');
      this.loadData();
    }
  },
  computed: {
    // 一级二级全部分类
    catList() {
      if (!this.catData) return;
      let list = this.catData.list;
      let arr = [];
      let style = this.catData.cat_style;
      if (style == 3 || style == 8 || style == 9) {
        list.forEach(cat1 => {
          arr.push(cat1, ...cat1.list);
        });
      } else if (style == 4) {
        arr = list[this.current1].list;
      }

      console.log(arr, 'arr');
      return arr;
    },
    store() {
      return this.$store.getters['SHOP_CONFIG'].store;
    },
    shareData() {
      return {
        path:
          '/pages/cat/cat' +
          uni.$u.queryParams({
            user_id: this.$store.getters['user/userInfo'].id || '',
            store_id: this.$store.getters['currentStore'].id || '',
            // #ifdef APP-PLUS
            _platform: 'app',
            // #endif
          }),
      };
    },
  },
  watch: {},
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  height: 100vh;
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */
  /deep/.u-tabs__wrapper__nav__line {
    bottom: 10rpx;
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

.scroll-view-goods-style2 {
  height: 100%;
  background: #f5f5f5;
  .goods-item-style2 {
    margin: 20rpx;
  }
}

.cat-box {
  display: flex;
  flex-wrap: wrap;

  .cat2-item-style3 {
    margin: 20rpx 0;
    width: 180rpx;
    > image {
      display: block;
      margin: 0 auto;
      width: 100rpx;
      height: 100rpx;
    }
    > view {
      text-align: center;
      margin-top: 20rpx;
    }
  }
  .cat2-item-style4 {
    margin: 20rpx 0;
    width: 33.33%;
  }
  .cat2-item-style8 {
    margin: 0 10rpx 0 0;
    padding: 10rpx 0;
    width: 120rpx;
    min-width: 120rpx;
    > image {
      width: 70rpx;
      height: 70rpx;
    }
  }
  .active-cat-8 {
    color: #ff4544;
  }
}

.right-style6 {
  position: relative;
  height: 100%;
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
  .goods-box-style6 {
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

    .goods-item-style9 {
      padding: 28rpx;
      margin-bottom: 20rpx;
      display: flex;
      flex-direction: column;
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
  }
}
.goodsBox{
	display: flex;
}

</style>

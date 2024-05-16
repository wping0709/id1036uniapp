<template>
  <view
    v-if="pageData"
    :style="{ backgroundColor: pageData.param.bg_color }"
    class="body"
  >
    <!-- 左侧菜单模式 -->
    <view
      v-if="pageData.param.cat_position == 1 && pageData.param.is_cat == 1"
      class="left-model flex-x-sb bg-fff"
    >
      <scroll-view
        v-if="
          pageData.param.is_cat == 1 &&
          pageData.param.list &&
          pageData.param.list.length > 1
        "
        scroll-y
        class="left-cat"
      >
        <view
          @click="clickCat(index)"
          :class="['u-line-1', 'cat-item', catIndex == index && 'active']"
          v-for="(item, index) in pageData.param.list"
          :key="index"
          >{{ item.name || item.cat_name }}</view
        >
      </scroll-view>
      <scroll-view scroll-y class="right-content flex-w-1">
        <view
          v-for="(goods, index) in pageData.param.list[catIndex].goods_list"
          :key="index"
          @click="$utils.toUrl(goods.page_url)"
          :class="[
            'goods-item',
            'flex-x-sb',
            pageData.param.style == 1 && 'border',
            pageData.param.style == 2 && 'center',
            pageData.param.style == 3 && 'center border',
          ]"
        >
          <view
            style="width: initial; height: initial"
            class="goods-left m-r-20"
          >
            <image
              :src="goods.pic_url"
              mode="aspectFill"
              class=""
              style="width: 140rpx; height: 140rpx"
            />
            <image
              v-if="pageData.param.mark"
              :src="pageData.param.mark_url"
              style="width: 30rpx; height: 30rpx"
              mode="aspectFit"
            />
          </view>
          <view class="goods-content flex-w-1">
            <!-- 商品名称 -->
            <view
              v-if="pageData.param.name"
              class="u-line-2 font-28 goods-name"
              >{{ goods.name }}</view
            >
            <!-- 商品优惠 -->
            <view
              v-if="pageData.param.full_minus"
              class="goods-full-minus"
              :class="[pageData.param.style >= 2 && 'flex-x-center']"
            >
              <view v-show="goods.sub_str"> {{ goods.sub_str }} </view>
            </view>

            <!-- 商品价格 -->
            <view class="flex-x-sb flex-y-center font-28 price-bt">
              <view v-if="pageData.param.price" class="price-color flex-w-1"
                >￥{{ goods.price }}</view
              >

              <view class="flex-y-center flex-w-1 flex-x-end">
                <!-- 原价 -->
                <view v-if="pageData.param.old_price" class="font-del"
                  >￥{{ goods.original_price }}</view
                >

                <!-- 按钮 -->
                <view class="m-l-10" v-if="pageData.param.buy">
                  <view
                    v-if="pageData.param.buy_list > 1"
                    :class="'bt' + pageData.param.buy_list"
                  >
                    {{
                      pageData.param.buy_content
                        ? pageData.param.buy_content
                        : pageData.param.buy_default
                    }}
                  </view>
                  <view
                    v-else-if="pageData.param.buy_list == 1"
                    class="jia flex-y-center flex-x-center"
                  >
                    <text class="iconfont icon-add"></text>
                  </view>
                  <view
                    v-else-if="pageData.param.buy_list == 0"
                    class="jia flex-y-center flex-x-center"
                  >
                    <text class="iconfont icon-cart-full"></text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    <!-- 顶部菜单模式 -->
    <view class="top-model" v-else>
      <!-- 分类区域 -->
      <scroll-view
        v-if="
          pageData.param.is_cat == 1 &&
          pageData.param.list &&
          pageData.param.list.length > 1
        "
        scroll-x
        class="bg-fff"
      >
        <view class="scroll-box flex border-b">
          <view
            v-for="(item, index) in pageData.param.list"
            :key="index"
            class="top-scroll-item"
            :class="{
              active0: pageData.param.cat_style == 0 && catIndex == index,
              active1: pageData.param.cat_style == 1 && catIndex == index,
            }"
            @click="clickCat(index)"
          >
            {{ item.name || item.cat_name }}
          </view>
        </view>
      </scroll-view>

      <!-- 商品区域 -->
      <view class="goods-box">
        <!-- 商品展示方式为一行一个 -->
        <template v-if="pageData.param.list_style == 1">
          <view
            v-for="(goods, index) in pageData.param.list[catIndex].goods_list"
            :key="index"
            @click="$utils.toUrl(goods.page_url)"
            style="margin-left: 0; margin-right: 0;"
            :class="[
              'goods-item',
              'flex-x-sb',
              pageData.param.style == 1 && 'border',
              pageData.param.style == 2 && 'center',
              pageData.param.style == 3 && 'center border',
            ]"
          >
            <view
              class="goods-left m-r-20"
              :style="{ width: 'initial', height: 'initial' }"
            >
              <image
                :src="goods.pic_url"
                mode="aspectFill"
                class=""
                style="width: 200rpx; height: 200rpx"
              />
              <image
                v-if="pageData.param.mark"
                :src="pageData.param.mark_url"
                style="width: 40rpx; height: 40rpx"
                mode="aspectFit"
              />
            </view>
            <view class="goods-content flex-w-1 flex-col flex-x-sb">
              <!-- 商品名称 -->
              <view
                v-if="pageData.param.name"
                class="u-line-2 font-28 m-t-10 goods-name"
                >{{ goods.name }}</view
              >
              <view>
                <!-- 商品优惠 -->
                <view
                  v-if="pageData.param.full_minus"
                  class="goods-full-minus"
                  :class="[pageData.param.style >= 2 && 'flex-x-center']"
                >
                  <view v-show="goods.sub_str"> {{ goods.sub_str }} </view>
                </view>

                <!-- 商品价格 -->
                <view class="flex-x-sb flex-y-end font-28 price-bt">
                  <view class="flex-w-1 price-color">
                    <div class="flex">
                      <div class="price-color" v-if="pageData.param.price">
                        ￥{{ goods.price }}
                      </div>

                      <!-- 原价 -->
                      <view v-if="pageData.param.old_price" class="font-del">
                        ￥{{ goods.original_price }}
                      </view>
                    </div>
                    <MemberPrice
                      v-if="pageData.param.price"
                      :memberPrice="goods.goods_member_price"
                    ></MemberPrice>
                  </view>

                  <view class="flex-y-center flex-w-1 flex-x-end">
                    <!-- 按钮 -->
                    <view class="m-l-10" v-if="pageData.param.buy">
                      <view
                        v-if="pageData.param.buy_list > 1"
                        :class="'bt' + pageData.param.buy_list"
                      >
                        {{
                          pageData.param.buy_content
                            ? pageData.param.buy_content
                            : pageData.param.buy_default
                        }}
                      </view>
                      <view
                        v-else-if="pageData.param.buy_list == 1"
                        class="jia flex-y-center flex-x-center"
                      >
                        <text class="iconfont icon-add"></text>
                      </view>
                      <view
                        v-else-if="pageData.param.buy_list == 0"
                        class="jia flex-y-center flex-x-center"
                      >
                        <text class="iconfont icon-cart-full"></text>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </template>

        <!-- 商品展示方式为大图模式 -->
        <template v-else-if="pageData.param.list_style == 0">
          <view
            v-for="(goods, index) in pageData.param.list[catIndex].goods_list"
            :key="index"
            @click="$utils.toUrl(goods.page_url)"
            style="margin-left: 0; margin-right: 0"
            :class="[
              'goods-item',
              pageData.param.style == 1 && 'border',
              pageData.param.style == 2 && 'center',
              pageData.param.style == 3 && 'center border',
            ]"
          >
            <view
              class="goods-left"
              :style="{
                height:
                  pageData.param.per == 1 ? 'calc(702rpx * 0.6666)' : '702rpx',
              }"
            >
              <!-- 当前图为3:2 -->
              <image
                v-if="pageData.param.per == 1"
                :src="goods.pic_url"
                mode="aspectFill"
                class="goods-img"
              />
              <!-- 当前图为1:1 -->
              <image
                v-else
                :src="goods.pic_url"
                mode="aspectFill"
                class="goods-img"
              />

              <image
                v-if="pageData.param.mark"
                :src="pageData.param.mark_url"
                style="width: 80rpx; height: 80rpx"
                mode="aspectFit"
              />
            </view>
            <view class="goods-content">
              <!-- 商品名称 -->
              <view
                v-if="pageData.param.name"
                style="height: initial"
                class="u-line-2 font-28 m-t-10 goods-name"
                >{{ goods.name }}</view
              >
              <!-- 商品优惠 -->
              <view
                v-if="pageData.param.full_minus"
                :class="[
                  'goods-full-minus',
                  pageData.param.style >= 2 && 'flex-x-center',
                ]"
              >
                <view v-show="goods.sub_str"> {{ goods.sub_str }} </view>
              </view>

              <!-- 商品价格 -->
              <view class="flex-x-sb flex-y-center font-28 price-bt">
                <view v-if="pageData.param.price" class="flex-w-1">
                  <div class="price-color">￥{{ goods.price }}</div>

                  <div>
                    <MemberPrice
                      :memberPrice="goods.goods_member_price"
                    ></MemberPrice>
                  </div>
                </view>
                <view
                  v-if="pageData.param.style < 2"
                  class="flex-y-center flex-w-1 flex-x-end"
                >
                  <view v-if="pageData.param.old_price" class="font-del m-r-20"
                    >￥{{ goods.original_price }}</view
                  >
                  <view v-if="pageData.param.buy">
                    <view
                      v-if="pageData.param.buy_list > 1"
                      :class="'bt' + pageData.param.buy_list"
                    >
                      {{
                        pageData.param.buy_content
                          ? pageData.param.buy_content
                          : pageData.param.buy_default
                      }}
                    </view>
                    <view
                      v-else-if="pageData.param.buy_list == 1"
                      class="jia flex-y-center flex-x-center"
                    >
                      <text class="iconfont icon-add"></text>
                    </view>
                    <view
                      v-else-if="pageData.param.buy_list == 0"
                      class="jia flex-y-center flex-x-center"
                    >
                      <text class="iconfont icon-cart-full"></text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </template>

        <!-- 商品展示方式为一行两个 -->
        <template v-else-if="pageData.param.list_style == 2">
          <view class="flex" style="flex-wrap: wrap">
            <view
              v-for="(goods, index) in pageData.param.list[catIndex].goods_list"
              :key="index"
              @click="$utils.toUrl(goods.page_url)"
              :class="[
                'list-style-2',
                'goods-item',
                pageData.param.style == 1 && 'border',
                pageData.param.style == 2 && 'center',
                pageData.param.style == 3 && 'center border',
              ]"
            >
              <view class="goods-left">
                <image
                  :src="goods.pic_url"
                  mode="aspectFill"
                  class="goods-img"
                />
                <image
                  v-if="pageData.param.mark"
                  :src="pageData.param.mark_url"
                  style="width: 60rpx; height: 60rpx"
                  mode="aspectFit"
                />
              </view>
              <view class="goods-content">
                <!-- 商品名称 -->
                <view
                  v-if="pageData.param.name"
                  class="u-line-2 font-28 m-t-10 goods-name"
                  >{{ goods.name }}</view
                >
                <!-- 商品优惠 -->
                <view
                  v-if="pageData.param.full_minus"
                  class="goods-full-minus"
                  :class="[pageData.param.style >= 2 && 'flex-x-center']"
                >
                  <view v-show="goods.sub_str"> {{ goods.sub_str }} </view>
                </view>

                <!-- 商品价格 -->
                <view class="flex-x-sb flex-y-end font-28 price-bt">
                  <view
                    v-if="pageData.param.price"
                    class="price-color flex-w-1"
                  >
                    <view
                      v-if="
                        pageData.param.style < 2 && pageData.param.old_price
                      "
                      class="font-del"
                    >
                      ￥{{ goods.original_price }}
                    </view>
                    <div class="price-color">￥{{ goods.price }}</div>
                    <div v-if="pageData.param.price">
                      <MemberPrice
                        :memberPrice="goods.goods_member_price"
                      ></MemberPrice>
                    </div>
                  </view>

                  <view
                    v-show="pageData.param.style < 2"
                    class="flex-y-center flex-w-1 flex-x-end"
                  >
                    <!-- 原价 -->
                    <view
                      v-if="
                        pageData.param.style >= 2 && pageData.param.old_price
                      "
                      class="font-del"
                    >
                      ￥{{ goods.original_price }}
                    </view>

                    <!-- 按钮 -->
                    <view v-if="pageData.param.buy">
                      <view
                        v-if="pageData.param.buy_list > 1"
                        :class="'bt' + pageData.param.buy_list"
                      >
                        {{
                          pageData.param.buy_content
                            ? pageData.param.buy_content
                            : pageData.param.buy_default
                        }}
                      </view>
                      <view
                        v-else-if="pageData.param.buy_list == 1"
                        class="jia flex-y-center flex-x-center"
                      >
                        <text class="iconfont icon-add"></text>
                      </view>
                      <view
                        v-else-if="pageData.param.buy_list == 0"
                        class="jia flex-y-center flex-x-center"
                      >
                        <text class="iconfont icon-cart-full"></text>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </template>
        <!-- 商品展示方式为一行三个 -->
        <template v-else-if="pageData.param.list_style == 3">
          <view class="flex" style="flex-wrap: wrap">
            <view
              v-for="(goods, index) in pageData.param.list[catIndex].goods_list"
              :key="index"
              @click="$utils.toUrl(goods.page_url)"
              :class="[
                'goods-item',
                'list-style-3',
                pageData.param.style == 1 && 'border',
                pageData.param.style == 2 && 'center',
                pageData.param.style == 3 && 'center border',
              ]"
            >
              <view class="goods-left">
                <image
                  :src="goods.pic_url"
                  mode="aspectFill"
                  class="goods-img"
                />
                <image
                  v-if="pageData.param.mark"
                  :src="pageData.param.mark_url"
                  style="width: 40rpx; height: 40rpx"
                  mode="aspectFit"
                />
              </view>
              <view class="goods-content">
                <!-- 商品名称 -->
                <view
                  v-if="pageData.param.name"
                  class="u-line-2 font-28 m-t-10 goods-name"
                  >{{ goods.name }}</view
                >
                <!-- 商品优惠 -->
                <view
                  v-show="pageData.param.full_minus"
                  class="goods-full-minus"
                  :class="[pageData.param.style >= 2 && 'flex-x-center']"
                >
                  <view v-show="goods.sub_str"> {{ goods.sub_str }} </view>
                </view>

                <view
                  v-if="pageData.param.style >= 2 && pageData.param.old_price"
                  class="font-del font-26"
                >
                  ￥{{ goods.original_price }}
                </view>

                <!-- 商品价格 -->
                <view
                  v-show="pageData.param.price"
                  class="font-26 price-bt price-color"
                >
                  ￥{{ goods.price }}
                </view>

                <view
                  v-if="pageData.param.old_price && pageData.param.style < 2"
                  class="font-del font-26"
                >
                  ￥{{ goods.original_price }}
                </view>

                <div v-if="pageData.param.price">
                  <MemberPrice
                    :memberPrice="goods.goods_member_price"
                  ></MemberPrice>
                </div>
              </view>
            </view>
          </view>
        </template>

        <!-- 商品展示方式为左右滑动 -->
        <template v-else-if="pageData.param.list_style == 4">
          <scroll-view scroll-x>
            <view class="flex scroll-box">
              <view
                v-for="(goods, index) in pageData.param.list[catIndex]
                  .goods_list"
                :key="index"
                @click="$utils.toUrl(goods.page_url)"
                :class="[
                  'goods-item list-style-3',
                  pageData.param.style == 1 && 'border',
                  pageData.param.style == 2 && 'center',
                  pageData.param.style == 3 && 'center border',
                ]"
              >
                <view
                  class="goods-left"
                  :style="{ width: 'initial', height: 'initial' }"
                >
                  <image
                    :src="goods.pic_url"
                    mode="aspectFill"
                    class=""
                    style="width: 200rpx; height: 200rpx"
                  />
                  <image
                    v-if="pageData.param.mark"
                    :src="pageData.param.mark_url"
                    style="width: 40rpx; height: 40rpx"
                    mode="aspectFit"
                  />
                </view>
                <view
                  :class="[
                    'goods-content',
                    pageData.param.style >= 2 && 'font-center',
                  ]"
                >
                  <!-- 商品名称 -->
                  <view
                    v-if="pageData.param.name"
                    class="u-line-2 font-28 m-t-10 goods-name"
                    >{{ goods.name }}</view
                  >
                  <!-- 商品优惠 -->
                  <view
                    v-if="pageData.param.full_minus"
                    class="goods-full-minus"
                    :class="[pageData.param.style >= 2 && 'flex-x-center']"
                  >
                    <view v-show="goods.sub_str"> {{ goods.sub_str }} </view>
                  </view>

                  <!-- 商品原价 -->
                  <view v-if="pageData.param.old_price" class="font-del">
                    ￥{{ goods.original_price }}
                  </view>

                  <!-- 商品价格 -->
                  <view v-if="pageData.param.price" class="price-color">
                    ￥{{ goods.price }}
                  </view>

                  <view v-if="pageData.param.price" class="">
                    <MemberPrice :memberPrice="goods.goods_member_price"></MemberPrice>
                  </view>
                </view>
              </view>
            </view>
          </scroll-view>
        </template>
      </view>
    </view>
  </view>
</template>

<script>
import MemberPrice from '@/components/member-price';
export default {
  components: {
    MemberPrice,
  },
  props: ['page_id', 'item', '_templateKey'],
  data() {
    return {
      catIndex: 0,
      pageData: '',
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      if (!this.page_id) {
        this.pageData = this.item;
      } else {
        const formData = {
          _template: this.item.type,
          _templateKey: this._templateKey,
          page_id: this.page_id,
          _templateItem: JSON.stringify(this.item),
        };
        const res = await this.$requestAll.home.getTemplateData(formData);
        this.pageData = res.data;
		console.log('详情跳转数据',res.data)
      }
    },
    clickCat(index) {
      this.catIndex = index;
    },
  },
};
</script>

<style lang="scss" scoped>
.body {
  padding: 10rpx 24rpx;
}
.top-model {
  > scroll-view {
    width: 100%;
    white-space: nowrap;
    .top-scroll-item {
      position: relative;
      padding: 20rpx 30rpx;
      font-size: 28rpx;
    }
    .active0 {
      color: red;
      font-weight: 600;
      &::after {
        content: '';
        position: absolute;
        bottom: 10rpx;
        left: 50%;
        height: 4rpx;
        width: 50rpx;
        border-radius: 2rpx;
        background: red;
        transform: translate(-50%, 0);
      }
    }
    .active1 {
      background: red;
      margin: 15rpx 10rpx;
      padding: 5rpx 20rpx;
      color: #fff;
      border-radius: 50rpx;
    }
  }
}

.goods-item {
  background: #fff;
  margin-bottom: 10rpx;
  
  .goods-left {
    position: relative;
    width: 702rpx;
    height: calc(702rpx * 0.6666);
    > image:nth-child(2) {
      position: absolute;
      left: 0;
      top: 0;
      width: 80rpx;
      height: 80rpx;
    }
  }
  .goods-img {
    width: 100%;
    height: 100%;
  }
  .goods-content {
    // 商品标题
    > .goods-name {
      line-height: 40rpx;
      height: 80rpx;
    }
    //   商品优惠
    > .goods-full-minus {
      display: flex;
      align-items: center;
      > view {
        margin: 10rpx 0;
        padding: 0 10rpx;
        border-radius: 5rpx;
        border: 2rpx solid #f00;
        color: #f00;
        font-size: 22rpx;
      }
    }
    .font-del {
      color: #999;
    }
    // 商品价格及button
    .price-bt {
      white-space: nowrap;
      .bt {
        line-height: 40rpx;
        padding: 0 20rpx;
        color: #fff;
        background: #f00;
        border-radius: 10rpx;
      }

      .bt2 {
        line-height: 40rpx;
        padding: 0 20rpx;
        color: #fff;
        background: #f00;
        border-radius: 20rpx;
      }
      .bt5 {
        line-height: 40rpx;
        padding: 0 20rpx;
        color: #fff;
        background: #f00;
        border-radius: 10rpx;
      }
      .bt3 {
        border: 2rpx solid #f00;
        line-height: 40rpx;
        padding: 0 20rpx;
        color: #f00;
        background: #fff;
        border-radius: 8rpx;
      }
      .bt4 {
        border: 2rpx solid #f00;
        line-height: 40rpx;
        padding: 0 20rpx;
        color: #f00;
        background: #fff;
        border-radius: 41rpx;
      }

      .jia {
        .iconfont {
          font-size: 46rpx;
          color: #f00;
        }
      }
    }
  }
}

.list-style-2 {
  width: calc((702rpx - 10rpx) / 2);
  border: 0;
  padding: 10rpx;
  margin: 0;
  margin-right: 10rpx;
  margin-bottom: 10rpx;
  margin-top: 10rpx;
  &:nth-child(2n) {
    margin-right: 0;
  }
  .goods-left {
    width: calc(((702rpx - 10rpx) / 2) - 20rpx);
    height: calc(((702rpx - 10rpx) / 2) - 20rpx);
  }
}
.list-style-3 {
  width: calc((702rpx - 20rpx) / 3);
  border: 0;
  padding: 10rpx;
  margin: 0;
  margin-right: 10rpx;
  margin-bottom: 10rpx;
  &:nth-child(3n) {
    margin-right: 0;
  }

  .goods-left {
    width: calc(((702rpx - 20rpx) / 3) - 20rpx);
    height: calc(((702rpx - 20rpx) / 3) - 20rpx);
  }
}
.scroll-box {
  .list-style-3 {
    margin-right: 20rpx;
  }
}

.border {
  border-radius: 5rpx;
  border: 2rpx solid #eee !important;
}
.center {
  text-align: center;
}

.left-model {
  max-height: 800rpx;
  .left-cat {
    width: 160rpx;
    line-height: 80rpx;
    background: #f5f5f5;
    .cat-item {
      text-align: center;
      font-size: 28rpx;
    }
    .active {
      position: relative;
      background: #fff;
      &::after {
        content: '';
        position: absolute;
        left: 6rpx;
        top: 50%;
        transform: translate(0, -50%);
        height: 60%;
        width: 4rpx;
        border-radius: 2rpx;
        background: #f00;
      }
    }
    .right-content {
      padding-bottom: 10rpx;
    }
  }
}
</style>

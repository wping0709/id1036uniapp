<template>
  <view v-if="pageData" class="body">
    <view class="top-model" v-if="pageData.param.cat_position == 0">
      <!-- 商品区域 -->
      <view class="goods-box bg-fff">
        <!-- 商品展示方式为一行一个 -->
        <template v-if="pageData.param.list_style == 1">
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
            <view class="goods-left m-r-20">
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
                mode="aspectFill"
              />
            </view>
            <view class="goods-content flex-w-1 flex-col flex-x-sb">
              <!-- 商品名称 -->
              <view
                v-show="pageData.param.name"
                class="u-line-2 font-28 goods-name"
                >{{ goods.name }}</view
              >
              <view>
                <!-- 秒杀倒计时 -->
                <view v-if="pageData.param.time == 1" class="flex-y-center">
                  <view class="iconfont icon-clock"></view>
                  <view class="flex-y-center">
                    <view>{{ goods.time_content }}</view>
                    <view
                      v-if="goods.time_content !== '已结束'"
                      style="margin-left: 10rpx; color: red"
                    >
                      <u-count-down
                        :time="goods.time * 1000"
                        format="DD天HH:mm"
                        autoStart
                      ></u-count-down>
                    </view>
                  </view>
                </view>

                <view class="price-color font-28"
                  >{{ goods.price_content }}￥{{ goods.price }}</view
                >

                <!-- 商品价格 -->
                <view class="flex-x-sb flex-y-center font-28 price-bt">
                  <view
                    v-if="pageData.param.price"
                    class="color-999 font-24 flex-w-1"
                    >{{ goods.original_price_content }}￥{{
                      goods.original_price
                    }}</view
                  >

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
            :class="[
              'goods-item',
              pageData.param.style == 1 && 'border',
              pageData.param.style == 2 && 'center',
              pageData.param.style == 3 && 'center border',
            ]"
          >
            <view class="goods-left">
              <!-- 当前图为3:2 -->
              <image
                v-if="pageData.param.per == 1"
                :src="goods.pic_url"
                mode="aspectFill"
                class=""
                style="width: 100%; height: 468rpx"
              />
              <!-- 当前图为1:1 -->
              <image
                v-else
                :src="goods.pic_url"
                mode="aspectFill"
                class=""
                style="width: 100%; height: 702rpx"
              />

              <image
                v-if="pageData.param.mark"
                :src="pageData.param.mark_url"
                style="width: 80rpx; height: 80rpx"
                mode="aspectFill"
              />
              <!-- 秒杀倒计时 -->
              <view
                v-if="pageData.param.time == 1"
                class="flex-x-sb flex-y-center down"
              >
                <view class="font-28">秒杀</view>
                <view class="flex-y-center">
                  <view>{{ goods.time_content }}</view>
                  <view
                    v-if="goods.time_content !== '已结束'"
                    style="margin-left: 10rpx"
                  >
                    <u-count-down
                      :time="goods.time * 1000"
                      format="DD天HH:mm"
                      autoStart
                    ></u-count-down>
                  </view>
                </view>
              </view>
            </view>

            <view class="goods-content">
              <!-- 商品名称 -->
              <view
                v-if="pageData.param.name"
                style="height: initial"
                class="u-line-2 font-28 goods-name"
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
                <view v-if="pageData.param.price" class="price-color flex-w-1"
                  >{{ goods.price_content }}￥{{ goods.price }}</view
                >
                <view
                  v-if="pageData.param.style < 2"
                  class="flex-y-center flex-w-1 flex-x-end"
                >
                  <view v-if="pageData.param.old_price" class="font-del m-r-20"
                    >{{ goods.original_price_content }}￥{{
                      goods.original_price
                    }}</view
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
          <view class="flex" style="flex-wrap: wrap; padding: 0 24rpx">
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
                  class=""
                  style="width: 100%; height: 320rpx"
                />
                <image
                  v-if="pageData.param.mark"
                  :src="pageData.param.mark_url"
                  style="width: 60rpx; height: 60rpx"
                  mode="aspectFill"
                />
                <!-- 秒杀倒计时 -->
                <view
                  v-if="pageData.param.time == 1"
                  style="line-height: 60rpx"
                  class="font-24 flex-x-sb flex-y-center down"
                >
                  <view class="">秒杀</view>
                  <view class="flex-y-center">
                    <view>{{ goods.time_content }}</view>
                    <view
                      v-if="goods.time_content !== '已结束'"
                      style="margin-left: 10rpx"
                    >
                      <u-count-down
                        :time="goods.time * 1000"
                        format="DD天HH:mm"
                        autoStart
                      ></u-count-down>
                    </view>
                  </view>
                </view>
              </view>
              <view class="goods-content">
                <!-- 商品名称 -->
                <view
                  v-show="pageData.param.name"
                  class="u-line-2 font-28 goods-name"
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
                  v-if="pageData.param.style < 2 && pageData.param.old_price"
                  class="color-999"
                >
                  {{ goods.original_price_content }}￥{{
                    goods.original_price
                  }}</view
                >

                <!-- 商品价格 -->
                <view class="flex-x-sb flex-y-center font-28 price-bt">
                  <view v-if="pageData.param.price" class="price-color flex-w-1"
                    >{{ goods.price_content }}￥{{ goods.price }}</view
                  >

                  <view
                    v-show="pageData.param.style < 2"
                    class="flex-y-center flex-w-1 flex-x-end"
                  >
                  </view>
                </view>
              </view>
            </view>
          </view>
        </template>
      </view>
    </view>
  </view>
</template>

<script>
export default {
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
      }
    },
    clickCat(index) {
      this.catIndex = index;
    },
  },
  computed: {
    downTime() {
      return function (endTime) {
        return new Date().getTime() - endTime * 1000;
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.body {
  background: #fff;
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
        bottom: 4rpx;
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
  padding: 10rpx;
  margin: 10rpx 14rpx;
  .goods-left {
    position: relative;
    > image:nth-child(2) {
      position: absolute;
      left: 0;
      top: 0;
      width: 80rpx;
      height: 80rpx;
    }
    .down {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 0 20rpx;
      color: #fff;
      line-height: 80rpx;
      background: linear-gradient(90deg, #f44, #ff8b8b);
    }
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
  width: 345rpx;
  border: 0;
  padding: 10rpx;
  margin: 0;
  margin-right: 10rpx;
  margin-bottom: 10rpx;
  margin-top: 10rpx;
  &:nth-child(2n) {
    margin-right: 0;
  }
}
.list-style-3 {
  width: 225rpx;
  border: 0;
  padding: 10rpx;
  margin: 0;
  margin-right: 15rpx;
  margin-bottom: 10rpx;
  &:nth-child(3n) {
    margin-right: 0;
  }
}
.scroll-box {
  padding: 20rpx 24rpx;
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
  margin: 20rpx 0;
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
        right: 6rpx;
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

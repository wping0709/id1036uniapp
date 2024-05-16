<template>
  <view class="bg-fff">
    <view class="goods-box">
      <view v-for="(item, index) in goodsList" :key="index" class="m-b-20">
        <view @click="toUrl(item)" class="flex-x-sb goods-item">
          <image :src="item.goods_pic" class="goods-img" mode="aspectFill" />
          <view class="item-right flex-w-1">
            <view class="goods-title u-line-2 font-26">{{
              item.goods_name
            }}</view>

            <div class="attr u-line-1">
              <text v-for="(attr, index) in item.attr_list" :key="index">
                {{ attr.attr_group_name }}：{{ attr.attr_name }}
              </text>
            </div>

            <div class="num-price flex-y-center flex-x-sb">
              <div class="price">
                <PriceText
                  :fontDel="item.is_level"
                  :price="item.original_price || item.price"
                  ySize="34rpx"
                  fSize="24rpx"
                ></PriceText>
              </div>
              <div class="num font-w-700 font-24">x{{ item.num }}</div>
            </div>

            <view v-if="item.is_level" class="price-color font-24">
              会员价 ￥{{ item.level_price }}
            </view>
          </view>
        </view>

        <view
          v-if="item.verify_card_list"
          class="give-other flex-x-sb flex-y-center"
        >
          <view class="left flex-w-1 u-line-1"
            >[赠送] 核销卡/{{ item.verify_card_list.content }}</view
          >
          <div class="right">x{{ item.num }}</div>
        </view>
        <view
          v-if="item.integral && shiftObj(item.integral).give > 0"
          class="give-other flex-x-sb flex-y-center"
        >
          <view class="left flex-w-1 u-line-1">[赠送] 订单完成赠送</view>
          <div class="right">
            {{ shiftObj(item.integral).give * (item.num || 1) }}积分
          </div>
        </view>

        <!-- <view style="background:#fff7f6;" class="font-24 p-y-20 p-l-20">订单完成赠送<text class="price-color">{{60}}</text>积分</view> -->

        <!-- 商品赠品 -->
        <view class="GiveGoods">
          <GiveGoods
            :goodsData="item.give_list"
            width="90rpx"
            height="90rpx"
            :title="['赠品', ' 任选其一']"
            :isClick="true"
            @clickGive="clickGive($event, item)"
          ></GiveGoods>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import GiveGoods from "@/components/goods/GiveGoods";
import PriceText from "@/components/price-text/index";
export default {
  components: {
    GiveGoods,
    PriceText,
  },
  props: {
    goodsList: {
      type: Array,
      default() {
        return [];
      },
    },
    type: {
      type: String,
      default: "",
    },
  },
  methods: {
    clickGive(id, item) {
      const list = item.give_list;
      for (let it in list) {
        if (list[it].id == id) {
          list[it].check = true;
        } else {
          list[it].check = false;
        }
      }
      item.give_id = id;
      this.$forceUpdate();
      this.$emit("goodsChange", this.goodsList);
    },
    toUrl(item) {
      switch (this.type) {
        case "pt":
          this.$utils.toUrl("/pt/details/details?gid=" + item.goods_id);

          break;

        default:
          // 判断商品是否为砍价商品
          if (item.bargain_order_id > 0) {
            return this.$utils.toUrl(
              "/bargain/goods/goods?goods_id=" + item.goods_id
            );
          }
          return this.$utils.toUrl("/pages/goods/goods?id=" + item.goods_id);
      }
    },
  },
  computed: {
    shiftObj() {
      return function (data) {
        if (data) {
          if (typeof data == "string") {
            return JSON.parse(data);
          } else {
            return data;
          }
        }
      };
    },
  },
  options: { styleIsolation: "shared" },
};
</script>
<style lang="scss" scoped>
.goods-box {
  background: #fff;
  padding: 0 28rpx;
  /deep/.give-box {
    margin: 20rpx 0 !important;
  }
  .goods-item {
    // margin-bottom: 20rpx;
    .goods-img {
      width: 174rpx;
      height: 174rpx;
      background: #f6f6f6;
      border-radius: 10rpx;
    }
    .item-right {
      flex: 1;
      margin-left: 20rpx;
      .goods-title {
        line-height: 38rpx;
        font-size: 28rpx;
        color: #262626;
        margin-bottom: 10rpx;
      }
      .attr {
        color: #999;
        font-size: 24rpx;
        margin-bottom: 12rpx;
      }
      .attr-price {
        .attr {
          > span {
            color: #666;
            margin-right: 10rpx;
          }
        }
        > view:nth-child(2) {
          text-align: right;
          color: #666;
          .price {
            color: red;
          }
        }
      }
    }
  }

  .give-other {
    margin: 20rpx 0;
    color: #999;
  }
}
</style>

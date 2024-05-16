<template>
  <view>
    <view class="evaluation" v-if="goodsData">
      <view class="evaluation-top">
        <view class="evaluation-top-left">
          {{ comment_title }}
        </view>
        <view class="evaluation-top-right" @click="quanbu()">
          全部 <span class="iconfont">&#xe7b5;</span>
        </view>
      </view>
      <view class="evaluation-bottom">
        <view
          class="evaluation-bottom-view"
          v-for="(item, index) of goodsData"
          :key="index"
        >
          <view class="evaluation-bottom-view-top">
            <image :src="item.avatar_url" mode=""></image>
            <view class="evaluation-bottom-view-top-view">
              <view class="text">
                {{ item.nickname }}
              </view>
              <view class="pf">
                <WEvaluate
                  :value.sync="item.score || 0"
                  fontSize="30"
                  :readonly="true"
                  activeColor="#ffcb34"
                  @change="jiuping"
                ></WEvaluate
                ><view>{{ item.score || 0 }}</view>
                <!-- <uni-rate :readonly="true" size="12" allow-half :value="item.score || 0" /> <view>{{item.score || 0}}</view> -->
              </view>
            </view>
          </view>
          <view class="evaluation-bottom-view-bottom p-x-20">
            <view class="u-line-3">
              {{ item.content }}
            </view>
            <image v-if="item.pic_url" :src="item.pic_url" mode="aspectFill"></image>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import WEvaluate from '@/components/w-evaluate/index.vue';
export default {
  data() {
    return {};
  },
  props: {
    goodsData: {
      type: Array,
    },
    goods_id: {
      type: Number,
    },
  },
  components: {
    // uniRate
    WEvaluate,
  },
  computed: {
    comment_title() {
      return (
        this.$store.getters['SHOP_CONFIG']?.push_info.comment_title || '酒评'
      );
    },
  },
  methods: {
    quanbu() {
      uni.navigateTo({
        url: '/wine/evaluationCont/evaluationCont?goods_id=' + this.goods_id,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.evaluation {
  width: 710rpx;
  // height: 300rpx;
  border-radius: 30rpx;
  margin-left: 20rpx;
  background-color: #fff;
  overflow: hidden;
  .evaluation-top {
    width: 670rpx;
    display: flex;
    justify-content: space-between;
    margin-left: 24rpx;
    margin-top: 30rpx;
    .evaluation-top-left {
      height: 42rpx;
      font-size: 30rpx;
      font-family: PingFang SC;
      font-weight: bold;
      color: #333333;
    }
    .evaluation-top-right {
      display: flex;
      align-items: center;
      height: 34rpx;
      font-size: 24rpx;
      font-family: PingFang SC;
      font-weight: 400;
      color: #999999;
      .iconfont {
      }
    }
  }
  .evaluation-bottom {
    width: 700rpx;
    overflow-x: scroll; /*添加横向滚动条*/
    white-space: nowrap; /*不换行*/
    margin-top: 34rpx;
    .evaluation-bottom-view {
      width: 490rpx;
      height: 248rpx;
      background: #f7f7f7;
      border-radius: 12rpx;
      display: inline-block;
      margin-left: 20rpx;
      overflow: hidden;
      .evaluation-bottom-view-top {
        width: 486rpx;
        margin-left: 20rpx;
        margin-top: 26rpx;
        display: flex;
        align-items: center;
        image {
          width: 60rpx;
          height: 60rpx;
          background: #f3f3f3;
          border-radius: 120rpx;
        }
        .evaluation-bottom-view-top-view {
          height: 60rpx;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-left: 20rpx;
          .text {
            height: 36rpx;
            line-height: 36rpx;
            font-size: 26rpx;
            font-family: PingFang SC;
            font-weight: bold;
            color: #333333;
          }
          .pf {
            height: 17rpx;
            display: flex;
            align-items: center;
            view {
              height: 34rpx;
              font-size: 24rpx;
              font-family: PingFang SC;
              font-weight: 400;
              color: #999999;
            }
          }
        }
      }
      .evaluation-bottom-view-bottom {
        width: 486rpx;
        height: 116rpx;
        margin-top: 20rpx;
        display: flex;
        justify-content: space-around;
        // margin-left: 20rpx;
        view {
          flex: 1;
          width: 0;
          height: 116rpx;
          font-size: 26rpx;
        }
        image {
          margin-left: 20rpx;
          width: 120rpx;
          height: 120rpx;
          // background: #A36767;
          border-radius: 10rpx;
        }
      }
    }
  }
}
</style>

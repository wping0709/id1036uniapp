<template>
  <div v-if="goodsData.length" class="give-box">
    <div class="flex-y-center">
      <scroll-view scroll-x class="flex-w-1">
        <div class="img-box">
          <img
            :style="{
              width,
              height,
              minWidth: width,
              minHeight: height,
            }"
            @click="clickImg(item.id)"
            :class="['goods-pic', item.check && 'goods-check']"
            v-for="item in goodsData"
            :key="item.id"
            :src="item.cover_pic"
            alt=""
          />
        </div>
      </scroll-view>
      <div class="give-title flex-y-center m-l-24">
        <view class="font-26">
          <view class="">{{ title[0] }}</view>
          <view style="color: red; font-weight: 700">
            {{ title[1] }}
          </view>
        </view>

        <view v-if="isClick" @click="previewImg" class="m-l-20 font-24 bt">
          查看大图
        </view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    goodsData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 标题
    title: {
      type: Array,
      default() {
        return ['购买即送', '任选其一'];
      },
    },
    // 是否为可点击图片
    isClick: {
      type: Boolean,
      default: false,
    },
    // 图片宽
    width: {
      type: String,
      default: '75px',
    },
    // 图片高
    height: {
      type: String,
      default: '75px',
    },
  },
  methods: {
    clickImg(id) {
      if (this.isClick) {
        this.$emit('clickGive', id);
      }
    },
    previewImg() {
      if (this.isClick) {
        let checkData = this.goodsData.find(item => item.check);
        uni.previewImage({
          current: checkData.check && checkData.cover_pic,
          urls: [checkData.check && checkData.cover_pic],
        });
      } else {
        let urls = this.goodsData.map(item => item.cover_pic);
        uni.previewImg({
          urls: urls,
        });
      }
    },
  },
  watch: {
    goodsData: {
      handler: function (val, ovl) {
        // 判断是否第一次加载给予默认选中
        if (!ovl && val.length) {
          console.log(val, ovl);
          this.clickImg(val[0].id);
        }
      },
      immediate: true,
    },
  },
};
</script>

<style lang="less" scoped>
.give-box {
  // margin: 20rpx 0;
  background: #fff;
  padding: 30rpx 20rpx;

  border-radius: 20rpx;
  background: #fff3f1;
}

.give-title {
  .bt {
    width: 130rpx;
    line-height: 50rpx;
    background: linear-gradient(91deg, #ff1c22 0%, #ff7333 100%);
    border-radius: 120rpx;
    font-size: 24rpx;
    color: #fff;
    text-align: center;
  }
}

.img-box {
  display: flex;
  flex-wrap: nowrap;

  .goods-pic {
    border-radius: 10rpx;
    margin-right: 18rpx;
  }

  .goods-check {
    border: 2rpx solid #f00;
  }
}
</style>

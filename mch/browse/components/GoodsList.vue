<template>
  <view class="list">
    <view
      @click="$utils.toUrl('/pages/goods/goods?id=' + item.id)"
      class="item"
      v-for="(item, index) in goodsList"
      :key="index"
    >
      <view>
        <image :src="item.cover_pic" mode="" />
      </view>
      <view class="m-x-10">
        <view class="u-line-1 font-30 m-y-10">
          {{ item.name }}
        </view>
        <view class="flex-y-center flex-x-sb">
          <view class="price-color"> ￥ {{ item.price }} </view>
          <view @click.stop="$emit('onDel', item)" v-if="!isModify">
            <view class="iconfont icon-ashbin1 font-50"></view>
          </view>
          <view @click.stop="clickCheck(item,index)" v-else>
            <text
              v-if="!item.check"
              class="iconfont icon-xuanzekuangmoren color-666 font-50"
            ></text>
            <text
              v-else
              class="iconfont icon-success price-color font-50"
            ></text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    isModify: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectData: [],
      goodsList: [],
      checkAll: false,
    };
  },
  watch: {
    list: {
      handler(val) {
        this.goodsList = val;
      },
      immediate: true,
    },
    goodsList: {
      handler(val) {
        if (!val.length) return (this.checkAll = false);
        let length = 0;
        val.forEach(goods => {
          if (goods.check) length++;
        });
        console.log(length, val.length);
        this.checkAll = length == val.length;
      },
      deep: true,
    },
    checkAll(v) {
      console.log(v, 'switch');
      this.$emit('allCheckChange', v);
    },
  },
  methods: {
    clickCheck(item, index) {
      console.log(item,index);
      item.check = !item.check;
      this.$set(this.goodsList, index, item);
    },
    switchAllCheck(b) {
      this.goodsList = this.goodsList.map(goods => {
        goods.check = b;
        return goods;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.list {
  padding: 0 10rpx;
  display: flex;
  flex-wrap: wrap;
  .item {
    border-radius: 10rpx;
    background: #fff;
    overflow: hidden;
    width: 360rpx;
    margin-bottom: 10rpx;
    image {
      width: 100%;
      height: 360rpx;
    }

    &:nth-child(2n + 1) {
      margin-right: 10rpx;
    }
  }
}
</style>

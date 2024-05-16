<template>
  <div class="evaluate flex-y-center">
    <template v-for="(item, i) in totalNum">
      <view
        @click="!readonly && clickItem(item)"
        class="iconfont icon-collection-fill"
        :style="{
          fontSize: fontSize + 'rpx',
          backgroundImage: backgroundImageStyle(item, value),
        }"
        :key="i"
      >
      </view>
    </template>
  </div>
</template>
<script>
export default {
  props: {
    // 五角星大小
    fontSize: {
      type: [Number, String],
      default: 60,
    },
    // 选中五角星数量
    value: {
      type: [Number, String],
      default: 0,
    },
    // 选中颜色
    activeColor: {
      type: String,
      default: 'red',
    },
    // 不可选中
    readonly: {
      type: [Boolean, String],
      default: true,
    },
    // 五角星总数
    totalNum: {
      type: Number,
      default:5
    }
  },
  methods: {
    clickItem(item) {
      this.$emit('update:value', item + 1);
      this.$emit('change', item + 1);
    },
  },
  computed: {
    // 五角星颜色
    backgroundImageStyle() {
      return function (item, value) {
        let isHalf = false;
        if (String(value).indexOf('.') != -1) {
          isHalf = true;
          var halfIndex = parseInt(String(value).split('.')[0]);
        }
        if (isHalf && item == halfIndex) {
          return `linear-gradient( to right, ${this.activeColor} 0%,  ${this.activeColor} 50%, #ececec 50%, #ececec 100% )`;
        } else if (item < value) {
          return `linear-gradient( to right, ${this.activeColor} 0%,  ${this.activeColor} 50%, ${this.activeColor} 50%, ${this.activeColor} 100% )`;
        } else {
          return `linear-gradient( to right, #ececec 0%,  #ececec 50%, #ececec 50%, #ececec 100% )`;
        }
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.evaluate {
  .iconfont {
    -webkit-background-clip: text;
    color: transparent;
  }
}
</style>

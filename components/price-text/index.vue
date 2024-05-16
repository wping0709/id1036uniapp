<template>
  <text
    :style="{
      color: color,
      lineHeight: ySize,
      fontWeight: fontWeight,
    }"
    class="price-text"
  >
    <!-- 字体显示模式 -->
    <template v-if="!Number(price) && Number(price) != 0">
      <text
        :style="{
          fontSize: fSize,
        }"
        >{{ yPrice }}</text
      >
    </template>

    <template v-else>
      <text
        :style="{
          fontSize: fSize,
        }"
      >
        ￥
      </text>
      <text
        :style="{
          fontSize: ySize,
          textDecoration: fontDel && 'line-through',
        }"
        >{{ yPrice || 0 }}</text
      >
      <text>.</text>
      <text
        :style="{
          fontSize: fSize,
          textDecoration: fontDel && 'line-through',
        }"
        >{{ fPrice || '00' }}</text
      >
    </template>
  </text>
</template>

<script>
Math.signFigures = function (arg1, arg2) {
var r1 = arg1.toString(), // 将传入的数据转化为字符串
r2 = arg2.toString(),
m, resultVal, d = arguments[2];
m = (r1.split(".")[1] ? r1.split(".")[1].length : 0) + (r2.split(".")[1] ? r2.split(".")[1].length : 0); // 获取两个数字的小数位数的和
// 乘积的算法就是去掉小数点做整数相乘然后除去10的所有小数位的次方
resultVal = Number(r1.replace(".", "")) * Number(r2.replace(".", "")) / Math.pow(10, m);
 
return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
}
export default {
  props: {
    price: {
      default: '0.00',
      type: [String, Number],
    },
    color: {
      default: 'red',
      type: [String],
    },
    ySize: {
      default: '40rpx',
      type: [String],
    },
    fSize: {
      default: '28rpx',
      type: [String],
    },
    fontWeight: {
      default: 700,
      type: [String, Number],
    },
    fontDel: {
      type: [String, Boolean],
      default: false,
    },
  },
  name: 'price-text',
  data() {
    return {
      yPrice: 0,
      fPrice: 0,
    };
  },
  watch: {
    price: {
      handler(price) {
        if(!price) return

        
        //当前不为数字
        console.log(price);
        if (!Number(price) && Number(price) != 0) {
          console.log('if', price);
          this.yPrice = price;
        } else {
          console.log('else', price);
          let num = String(Math.signFigures(price , 100));
          console.log(num, 'num');
          this.fPrice = num.substr(-2);
          if (this.fPrice.length < 2) this.fPrice = 0 + this.fPrice;
          this.yPrice = num.substr(0, num.length - 2);
        }
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss"></style>

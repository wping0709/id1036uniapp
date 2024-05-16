<template>
  <div class="super_brand-wrap m-y-20">
    <div class="super_brand-main">
      <div class="title">
        <span>{{param.name}}</span>
        <div @click="onNext">换一组</div>
      </div>
      <div class="super_brand-content">
        <div class="left">
          <scroll-view :scroll-top="scrollTop" scroll-with-animation scroll-y style="max-height:200rpx;">
            <view @click="switchCurrent(index)" class="m-y-20" v-for="(item, index) of param.list" :key="index">
              <view
                class="left-item u-line-1"
                :class="{ active: index == current }"
              >
                {{ item.name }}
              </view>
            </view>
          </scroll-view>
        </div>
        <div class="right">
          <swiper
            ref="right_swipe"
            autoplay
            :current="current"
            :duration="500"
            :interval="5000"
            @animationfinish="onChange"
            class="right-swipe"
            :height="120"
            :indicator-dots="false"
            vertical
          >
            <swiper-item v-for="(item, index) of param.list" :key="index">
              <div class="right-item">
                <div
                  class="right-item-item"
                  v-for="(goods, i) of item.goods_list"
                  :key="i"
                  @click="goToGoods(goods.id)"
                >
                  <div
                    class="right-item-item-img"
                    :style="'background-image: url(' + goods.pic_url + ')'"
                  >
                    <div class="u-line-1" v-if="goods.desc">
                      {{ goods.desc }}
                    </div>
                  </div>
                  <div class="price">￥{{ goods.price }}</div>
                  <div class="before_price">￥{{ goods.original_price }}</div>
                </div>
              </div>
            </swiper-item>
          </swiper>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DiySuperBrand",
  components: {},
  props: {
    param: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      current: 0,
      toView: 'scroll0',
      scrollTop:0
    };
  },
  methods: {
    switchCurrent(i) {
      this.current = i
    },
    onChange({ detail: { current } }) {
      this.current = current;
    },
    // 切换
    onNext() {
      if (this.current >= this.param.list.length - 1) {
        this.current = 0;
      } else {
        this.current++;
      }
    },
    goToGoods: function (id) {
      this.$utils.toUrl("/pages/goods/goods?id=" + id);
    },
    scrollChange() {
      this.toView = 'scrollid-' + this.current
      let pTop = 30 * this.current -50 + 20
      this.scrollTop = pTop <= 0? 0 : pTop
    }
  },
  watch:{
    current(v) {
      this.scrollChange()
    }
  }
};
</script>

<style lang="scss" scoped>
.left-swipe {
  overflow: initial;
}

.super_brand-wrap {
  padding: 0 13px;
}
.super_brand-main {
  background: #fff;
  padding-bottom: 10px;
  border-radius: 12px;
}
.super_brand-main .title {
  padding: 0 12px;
  height: 45px;
  line-height: 45px;
  position: relative;
  font-size: 14px;
  font-weight: 500;
}
.super_brand-main .title div {
  position: absolute;
  right: 12px;
  top: 0;
  font-size: 12px;
  padding-left: 17px;
  /* background: url(../../../assets/images/exchange.png) no-repeat left center; */
  background-size: 14px auto;
}
.super_brand-content {
  display: flex;
  position: relative;
}
.left {
  padding: 0 10px 10px 12px;
  position: relative;
  width: 75px;
  box-sizing: content-box;
}
.mask {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 2;
}
.left-swipe {
  height: 25px;
  position: relative;
  padding-top: 25px;
}
.left-item {
  background-color: #faf1d1;
  line-height: 20px;
  border-radius: 8px;
  font-size: 10px;
  color: #fff;
  text-align: center;
  padding: 0 5px;
  width: 60px;
}
.left-item.active {
  background-color: #f1d167;
  font-size: 13px;
  width: 75px;
}
.right {
  flex: 1;
  height: 120px;
  padding-right: 10px;
  overflow: hidden;
}
.right-item {
  display: flex;
  justify-content: flex-end;
  height: 120px;
}
.right-item-item {
  margin-right: 5px;
}
.right-item-item:last-child {
  margin-right: 0;
}
.right-item-item-img {
  width: 79px;
  height: 79px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border-radius: 8px;
  position: relative;
}
.right-item-item-img div {
  position: absolute;
  left: 0;
  bottom: 0;
  font-size: 10px;
  color: #fff;
  background: linear-gradient(90deg, #ff7c02, #ff4e00);
  border-radius: 0px 0px 8px 8px;
  width: 100%;
  text-align: center;
  height: 20px;
  line-height: 20px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.price {
  font-size: 14px;
  color: #ff1f1a;
  font-weight: bold;
  margin-top: 5px;
}
.before_price {
  font-size: 11px;
  color: #9a9a9a;
  text-decoration: line-through;
  font-weight: 100;
}
@media screen and (max-width: 390px) {
  .right-item-item-img {
    width: 69px;
    height: 69px;
  }
  .price {
    font-size: 13px;
  }
}
@media screen and (max-width: 369px) {
  .right-item-item-img {
    width: 60px;
    height: 60px;
  }
}
@media screen and (max-width: 340px) {
  .right-item-item-img {
    width: 50px;
    height: 50px;
  }
}
</style>

<template>
  <div style="overflow: hidden">
    <template v-if="param.style == 0">
      <!-- 跳转小程序  && 公众号 -->
      <wx-open-launch-weapp
        v-if="param.list[0].open_type == 'wxapp' && $utils.is_webpage()"
        :path="urlToJson(param.list[0].url).path"
        :username="urlToJson(param.list[0].url).gh_id"
      >
        <script type="text/wxtag-template">
          <!-- 选中图片 -->
          <img
            src="{{param.list[0].pic_url}}"
            style="width:100%;display:block;"
          />
        </script>
      </wx-open-launch-weapp>

      <view v-else @click="toUrl(param.list[0])">
        <image
          :src="param.list[0].pic_url"
          mode="widthFix"
          style="width: 100%; height: auto; display: block"
          show-menu-by-longpress="true"
        />
      </view>
    </template>
    <view
      v-else
      class="rubik-list"
      :style="{
        height: param.new_minHeight + 'rpx',
      }"
    >
      <view
        :style="{
          width: param.space > 0 ? item.new_width + 'rpx' : rpx2px(item.width) + 'px',
          height:
            param.space > 0 ? item.new_height + 'rpx' : rpx2px(item.height) + 'px',
          left:
            param.space > 0
              ? param.style == 8
                ? item.n_left
                : item.new_left + 'rpx'
              : rpx2px(item.new_left) + 'px',
          top:
            param.space > 0
              ? param.style == 8
                ? item.n_top
                : item.new_top + 'rpx'
              : rpx2px(item.new_top) + 'px',
        }"
        v-for="(item, index) of param.list"
        :key="index"
      >
        <!-- 跳转小程序  && 公众号 -->
        <wx-open-launch-weapp
          :style="{
            position: 'absolute',
            width:
              param.space > 0 ? item.new_width + 'rpx' : item.width + 'rpx',
            height:
              param.space > 0 ? item.new_height + 'rpx' : item.height + 'rpx',
          }"
          v-if="item.open_type == 'wxapp' && $utils.is_webpage()"
          :path="urlToJson(item.url).path"
          :username="urlToJson(item.url).gh_id"
        >
          <script type="text/wxtag-template">
            <div style="position: absolute;z-idnex:999; top: 0, left: 0;bottom:0;right:0;width: 100%;height: 100%; " >
               <img src="{{item.pic_url}}" style="width:100%;height:100%;object-fit: cover;"></img>
            </div>
          </script>
        </wx-open-launch-weapp>

        <image
          v-else
          @click="toUrl(item)"
          :src="item.pic_url"
          style="width: 100%; height: 100%"
          mode="aspectFill"
          show-menu-by-longpress="true"
        />
      </view>
    </view>
  </div>
</template>

<script>
import wxConfig from '@/utils/wxConfig';
export default {
  name: 'DiyRubik',
  props: {
    param: Object,
  },
  computed: {
    urlToJson() {
      return function (url) {
        return this.$utils.urlToJson(decodeURIComponent(url));
      };
    },
    rpx2px(){
      return function(rpx){
        const screenWidth = uni.getSystemInfoSync().screenWidth
        return (screenWidth * Number.parseInt(rpx)) / 750
      }
    }
  },
  created() {
    if (this.$utils.is_webpage()) {
      wxConfig.init([], ['wx-open-launch-weapp']);
    }
  },
  methods: {
    toFixed: function (number, precision) {
      const multiplier = Math.pow(10, precision + 1);
      const wholeNumber = Math.floor(number * multiplier);
      const fixedWholeNumber = Math.round(wholeNumber / 10) * 10;
      return fixedWholeNumber / multiplier;
    },
    toUrl(item) {
      if (item.open_type == 'wxapp') {
        this.$utils.toUrl(item.url, 'wxapp')
      } else {
        this.$utils.toUrl(item.url, item.open_type);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.rubik-list {
  position: relative;
  left: 0;
  width: 100%;
  overflow: hidden;
  // background: skyblue;
  > view {
    position: absolute;
  }
}
.rubik-one {
  position: absolute;
}
.fill-0 {
  background-size: contain;
}
.fill-1 {
  background-size: cover;
}
.rubik-img {
  background-position: center;
  width: 100%;
  height: 100%;
}
</style>

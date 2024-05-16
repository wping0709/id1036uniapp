/* 专题组件 */

<template lang="html">
  <view class="body" v-if="param">
    <view
      @click="$utils.toUrl('/pages/topic-list/topic-list')"
      v-if="param.style == 0"
      class="jiandan flex-y-center flex-x-sb"
    >
      <image
        style="width: 120rpx; max-height: 40rpx"
        :src="param['logo_' + param.count] || wxapp_img.home_page.icon_topic_1"
        mode="aspectFit"
        class="m-r-20"
      ></image>
      <view class="content-box flex-w-1">
        <swiper
          autoplay
          circular
          vertical
          class="swiper"
          :style="{
            lineHeight: '36rpx',
            height: 36 * param.count + 'rpx',
          }"
        >
          <swiper-item v-for="(item, i) in param.topic_list" :key="i">
            <view class="flex-y-center" v-for="(it, i1) in item" :key="i1">
              <image
                :src="param.heated"
                mode="aspectFill"
                style="width: 54rpx; height: 28rpx"
                class="m-r-10"
              />
              <view class="flex-w-1 u-line-1">{{ it.title }}</view>
            </view>
          </swiper-item>
        </swiper>

        <!-- <view v-for="item in param.count - 0" :key="item">
          <u-notice-bar
            :text="noticeText"
            :icon="param.heated"
            direction="column"
            bgColor="#ffffff"
            fontSize="26rpx"
          ></u-notice-bar>
        </view> -->
      </view>
      <view class="more">更多</view>
    </view>
    <view class="col-box" v-else>
      <!-- 分类区域 -->
      <scroll-view scroll-x>
        <view class="scroll-box flex">
          <view
            v-for="(item, index) in param.list"
            :key="index"
            class="top-scroll-item"
            :class="{
              active0: catIndex == index,
            }"
            @click="onClickNav(index)"
          >
            {{ item.cat_name }}
          </view>
        </view>
      </scroll-view>
      <view
        class="m-b-20"
        v-for="(item, index) in param.list[catIndex].goods_list"
        :key="index"
      >
        <!-- 北欧风格 -->
        <BeiouItem v-if="item.layout == 0" :item="item"></BeiouItem>

        <!-- 中式风格 -->
        <ZhongshiItem v-else :item="item"></ZhongshiItem>
      </view>
    </view>
  </view>
</template>

<script>
import BeiouItem from '@/components/BeiouItem/BeiouItem';
import ZhongshiItem from '@/components/ZhongshiItem/ZhongshiItem';
export default {
  components: {
    BeiouItem,
    ZhongshiItem,
  },
  name: 'DiyTopic',
  data() {
    return {
      list: [],
      catIndex: 0,
      pageData: '',
      param: '',
    };
  },
  props: {
    page_id: {
      default: '',
    },
    _templateKey: {
      default: '',
    },
    item: {
      default: '',
    },
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const formData = {
        page_id: this.page_id,
        _templateKey: this._templateKey,
        _templateItem: JSON.stringify(this.item),
        _template: this.item.type,
      };
      const res = await this.$requestAll.home.getTemplateData(formData);
      this.pageData = res.data;
      this.param = res.data.param;
    },
    onClickNav(index) {
      this.catIndex = index;
    },
    topBarScrollCenter: function () {},
  },
  computed: {
    noticeText() {
      if (!this.param.topic_list) return [];
      let arr = this.param.topic_list.map(item => {
        return item[0].title;
      });
      return arr;
    },
  },
};
</script>
<style scoped></style>
<style lang="scss" scoped>
.body {
  .jiandan {
    padding: 0 20rpx;

    background: #fff;
    line-height: 80rpx;
    height: 80rpx;
    .more {
      height: 30rpx;
      line-height: 30rpx;
      padding-left: 20rpx;

      border-left: 4rpx solid #eee;
    }
  }

  .col-box {
    scroll-view {
      background: #fff;

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

    .beiou {
      margin-top: 20rpx;
      background: #fff;
      padding: 20rpx;
      border-radius: 10rpx;

      .right {
        > image {
          width: 290rpx;
          height: 220rpx;
          border-radius: 10rpx;
        }
      }
    }

    .zhongshi {
      margin-top: 20rpx;
      background: #fff;
      padding: 20rpx;
      border-radius: 10rpx;

      .zhongshi-img {
        text-align: center;

        > image {
          width: 100%;
          min-height: 300rpx;
          max-height: 400rpx;
        }
      }
    }
  }
}
</style>

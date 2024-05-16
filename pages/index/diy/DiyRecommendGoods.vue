<!-- 
 使用该组件一定要传当前组件页的onPageScroll事件，需用当前事件做页面滚动效果
  -->

<template>
  <view
    v-if="!isShowLoading"
    class="rec-goods-goods_list"
    :style="{ backgroundColor: param.bg_color }"
    id="rec-goods-goods_list"
  >
    <!-- 粘性标题 -->
    <view
      v-if="item.type != 'blind_box' && isShowCatBox"
      :style="{
        top: upTop,
      }"
      class="rec-goods-title"
      ref="rec_goods_title"
    >
      <template v-for="(item, index) of param.list">
        <view
          :key="index"
          class="rec-goods-column"
          :class="{ current: pitch == index }"
          @click="clicktab(index)"
          v-if="item.name && item.title"
        >
          <view class="rec-goods-title_box">{{ item.name }}</view>
          <view
            class="rec-goods-subhead"
            :class="{ 'rec-goods-pitch': pitch == index }"
          >
            {{ item.title }}
          </view>
        </view>
      </template>
    </view>
    <div class="rec-goods-goods_scroll_1">
      <div class="goods-left">
        <div id="left">
          <view
            v-for="(item, index) in leftData"
            :key="index"
            class="rec-goods-goods_box m-r-10"
            @click="toUrl(item)"
          >
            <view class="rec-goods-goods_img">
              <image style="width: 100%" mode="widthFix" :src="item.pic_url" />
              <view v-if="item.num <= 0" class="goods-num0">
                <image
                  :src="wxapp_img.goods_num0"
                  style="width: 100%; height: 100%"
                  mode="aspectFill"
                ></image>
              </view>
            </view>
            <view class="rec-goods-goods_info">
              <view class="rec-goods-goods_name">{{ item.name }}</view>
              <view style="width: 100%; display: flex">
                <template v-if="item.minus_list && item.minus_list.length > 0">
                  <span
                    v-for="(minus, minus_index) in item.minus_list"
                    :key="minus_index"
                    style="
                      font-size: 12px;
                      padding: 0 2px;
                      border: 1px solid red;
                      color: red;
                      border-radius: 3px;
                      margin-right: 4px;
                    "
                    >{{ minus.full_price }}减{{ minus.minus_price }}</span
                  >
                </template>
                <template v-else>
                  <span
                    style="
                      font-size: 12px;
                      padding: 0 2px;
                      border: 1px solid red;
                      color: red;
                      border-radius: 3px;
                      margin-right: 4px;
                    "
                    v-if="item.max_reduction > 0"
                    >首单减{{ item.max_reduction }}</span
                  >
                  <span
                    style="
                      font-size: 12px;
                      padding: 0 2px;
                      border: 1px solid red;
                      color: red;
                      border-radius: 3px;
                    "
                    v-if="item.sub_str"
                    >{{ item.sub_str }}</span
                  >
                </template>
              </view>
              <view v-if="item.introduce" class="rec-goods-introduce">
                {{ item.introduce }}
              </view>
              <view class="rec-goods-goods_price">
                {{ item.is_negotiable ? '面议' : item.price }}
              </view>
              <div v-if="item.is_negotiable == 0">
                <MemberPrice
                  :memberPrice="item.goods_member_price"
                ></MemberPrice>
              </div>
              <view v-if="item.original_price" class="rec-goods-formerlyprice">
                ￥{{ item.original_price }}
              </view>
            </view>
          </view>
        </div>
      </div>
      <div class="goods-right">
        <div id="right">
          <view
            v-for="(item, index) in rightData"
            :key="index"
            class="rec-goods-goods_box m-r-10"
            @click="toUrl(item)"
          >
            <view class="rec-goods-goods_img">
              <image style="width: 100%" mode="widthFix" :src="item.pic_url" />
              <view v-if="item.num <= 0" class="goods-num0">
                <image
                  :src="wxapp_img.goods_num0"
                  style="width: 100%; height: 100%"
                  mode="aspectFill"
                ></image>
              </view>
            </view>
            <view class="rec-goods-goods_info">
              <view class="rec-goods-goods_name">{{ item.name }}</view>
              <view style="width: 100%; display: flex">
                <template v-if="item.minus_list && item.minus_list.length > 0">
                  <span
                    v-for="(minus, minus_index) in item.minus_list"
                    :key="minus_index"
                    style="
                      font-size: 12px;
                      padding: 0 2px;
                      border: 1px solid red;
                      color: red;
                      border-radius: 3px;
                      margin-right: 4px;
                    "
                    >{{ minus.full_price }}减{{ minus.minus_price }}</span
                  >
                </template>
                <template v-else>
                  <span
                    style="
                      font-size: 12px;
                      padding: 0 2px;
                      border: 1px solid red;
                      color: red;
                      border-radius: 3px;
                      margin-right: 4px;
                    "
                    v-if="item.max_reduction > 0"
                    >首单减{{ item.max_reduction }}</span
                  >
                  <span
                    style="
                      font-size: 12px;
                      padding: 0 2px;
                      border: 1px solid red;
                      color: red;
                      border-radius: 3px;
                    "
                    v-if="item.sub_str"
                    >{{ item.sub_str }}</span
                  >
                </template>
              </view>
              <view v-if="item.introduce" class="rec-goods-introduce">
                {{ item.introduce }}
              </view>
              <view class="rec-goods-goods_price">
                {{ item.is_negotiable ? '面议' : item.price }}
              </view>
              <div v-if="item.is_negotiable == 0">
                <MemberPrice
                  :memberPrice="item.goods_member_price"
                ></MemberPrice>
              </div>
              <view v-if="item.original_price" class="rec-goods-formerlyprice">
                ￥{{ item.original_price }}
              </view>
            </view>
          </view>
        </div>
      </div>
    </div>
  </view>

  <view v-else class="p-y-20">
    <u-loading-icon size="60" text="组件加载中" vertical></u-loading-icon>
  </view>
</template>

<script>
import MemberPrice from '@/components/member-price';
export default {
  components: {
    MemberPrice,
  },
  name: 'DiyRecommendGoods',
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
    _templateKey: {
      type: [String, Number],
      default: '',
    },
    page_id: {
      type: [String, Number],
      default: '',
    },
    templateList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      pitch: 0,
      goods_list: [],
      leftData: [],
      rightData: [],
      param: {},
      page: 1,
      status: 'loadmore',
      scrollTop: 0,
      isShowLoading: true,
	  itemType:''
    };
  },
  created() {
    this.loadData();
  },
  methods: {
	  toUrl(item){
		  if(this.itemType == "blind_box"){
			  this.$utils.toUrl('/blind/goods-detail/goods-detail?id=' + item.id);
		  }else{
			  this.$utils.toUrl('/pages/goods/goods?id=' + item.id);
		  }
	  },
    async loadData() {
      const formData = {
        page_id: this.page_id,
        _templateKey: this._templateKey,
        _templateItem: JSON.stringify(this.item),
        _template: this.item.type,
      };
	  this.itemType = this.item.type
      const res = await this.$requestAll.home.getTemplateData(formData);
      this.isShowLoading = false;
      this.param = res.data.param;

      this.clicktab(false);
    },
    async clicktab(index) {
      if (index === this.pitch) return;

      if (index !== false) {
        this.pitch = index;
        this.leftData = [];
        this.rightData = [];
      }
      // 重制分页页码
      this.page = 1;
      this.goods_list = JSON.parse(
        JSON.stringify(this.param.list[this.pitch].goods_list)
      );

      for (let i = 0; i < 5; i++) {
        if (i % 2 == 0) {
          this.leftData.push(...this.goods_list.splice(0, 1));
        } else {
          this.rightData.push(...this.goods_list.splice(0, 1));
        }
      }

      this.$nextTick(async () => {
        // 有分类显示的时候再判断是否滚动。
        if (this.item.type != 'blind_box' && this.isShowCatBox) {
          let dom = await this.$uGetRect('.rec-goods-goods_list');
          let domtitle = await this.$uGetRect('.rec-goods-title');
          // 判断当前是否需要重新滚动
          if (dom.top < domtitle.top) {
            uni.pageScrollTo({
              scrollTop: this.scrollTop,
              duration: 100,
            });
          }
        }

        this.imgLoad();
      });
    },
    async imgLoad() {
      if (this.goods_list.length) {
        let leftRect = await this.$uGetRect('#left');
        let rightRect = await this.$uGetRect('#right');
        if (leftRect.height <= rightRect.height) {
          let leftData = JSON.parse(JSON.stringify(this.leftData));
          leftData.push(...this.goods_list.splice(0, 1));
          this.leftData = leftData;
        } else {
          let rightData = JSON.parse(JSON.stringify(this.rightData));
          rightData.push(...this.goods_list.splice(0, 1));
          this.rightData = rightData;
        }
        this.$nextTick(() => {
          this.imgLoad();
        });
      }
    },

    async pageScroll(scrollTop) {
      if (this.isShowCatBox) {
        let dom = await this.$uGetRect('.rec-goods-goods_list');
        let domtitle = await this.$uGetRect('.rec-goods-title');
        this.scrollTop = scrollTop - domtitle.top + dom.top;
      }
    },
    async moreRecommendGoods(){
      // 按商品显示  不需要分页加载
      if(this.param.list[this.pitch].is_cat == 0){
        return true;
      }
      // 这里重新整理一下
      var templateItem = {
        is_cat:this.param.list[this.pitch].is_cat,
        cat_list:this.param.list[this.pitch].cat_list
      }
      const formData = {
        _templateItem: JSON.stringify(templateItem),
        page_id:this.page + 1
      };
      const res = await this.$requestAll.home.getMoreRecommendGoods(formData)
      if(res.code == 0){
        this.goods_list = res.data
        if(res.data.length > 0){
          this.page++;
        }
        this.$nextTick(() => {
          this.imgLoad();
        });
      }
      
    }
  },

  computed: {
    isShowCatBox() {
      if (this.param.list) {
        // 如果都没有填写昵称标题则不展示分类
        return !this.param.list.every(item => !item.name && !item.title);
      }
      return false;
    },
    // 计算粘性定位高度top
    upTop() {
      const tList = this.templateList;
      let search = 0;
      // #ifdef H5
      return `calc(${this.systemInfo.statusBarHeight}px + 80rpx)`;
      // #endif
      // #ifndef H5
      if (tList.some(item => item.type == 'search')) search = 40;
      return `calc(${search}px + ${this.systemInfo.statusBarHeight}px + 80rpx)`;
      //  #endif

      
      
    },
    store() {
      return this.$store.getters['SHOP_CONFIG'].store;
    },
  },
};
</script>
<style lang="scss" scoped>
$rpx: 2rpx;
.rec-goods-title {
  overflow: scroll;
  white-space: nowrap;
  height: 100rpx;
  margin-bottom: 12rpx;
  position: sticky;
  z-index: 100;
  background-color: #f5f5f5;
}

.rec-goods-title .rec-goods-column {
  display: inline-block;
  text-align: center;
  padding: 0 15 * $rpx;
  font-size: 0;
}

.rec-goods-title .rec-goods-column .rec-goods-title_box {
  font-size: 16 * $rpx;
  font-weight: bold;
  padding: 3 * $rpx 0;
}

.rec-goods-title .rec-goods-column .rec-goods-subhead {
  font-size: 12 * $rpx;
  color: #999999;
  line-height: 20 * $rpx;
  display: inline-block;
  padding: 0 8 * $rpx;
  border-radius: 20 * $rpx;
}

.rec-goods-title .rec-goods-column .rec-goods-pitch {
  color: #fff;
  background-color: #fc3e2d;
  padding: 0 8 * $rpx;
  border-radius: 20 * $rpx;
}

.rec-goods-goods_scroll {
  margin: 0 12 * $rpx;
}

.rec-goods-goods_scroll_1 {
  display: flex;
  margin: 0 24rpx;
  .goods-left {
    width: calc((100vw - 48rpx - 20rpx) / 2);
    margin-right: 20rpx;
  }
  .goods-right {
    width: calc((100vw - 48rpx - 20rpx) / 2);
  }
  .rec-goods-goods_box {
    width: calc((100vw - 48rpx - 20rpx) / 2);
  }
}

.rec-goods-goods_box {
  background-color: #fff;
  border-radius: 8 * $rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
}

.goods-num0 {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
}

.rec-goods-goods_box .rec-goods-goods_img {
  position: relative;
  width: 100%;
}
.rec-goods-goods_box .rec-goods-goods_img img {
  width: 100%;
  height: auto;
  background-color: #ccc;
}

.rec-goods-goods_box .rec-goods-goods_info {
  padding: 12 * $rpx;
}

.rec-goods-goods_box .rec-goods-goods_name {
  font-size: 13 * $rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  margin-bottom: 9 * $rpx;
}

.rec-goods-goods_box .rec-goods-introduce {
  font-size: 10 * $rpx;
  color: #f23030;
}

.rec-goods-goods_box .rec-goods-goods_price {
  font-size: 16 * $rpx;
  font-weight: bold;
  color: #fa2c19;
  padding-top: 6 * $rpx;
}

.rec-goods-goods_box .rec-goods-goods_price::before {
  content: '￥';
  font-size: 12 * $rpx;
}

.rec-goods-goods_box .rec-goods-vip_price {
  font-size: 12 * $rpx;
  font-weight: bold;
}

.rec-goods-goods_box .rec-goods-vip_price div {
  display: inline-block;
  position: relative;
}

.rec-goods-goods_box .rec-goods-vip_price image {
  width: 31 * $rpx;
  height: 10 * $rpx;
}

.rec-goods-goods_box .rec-goods-vip_price span {
  position: absolute;
  font-size: 8 * $rpx;
  color: #f5f38f;
  font-weight: bold;
  width: 24 * $rpx;
  height: 11 * $rpx;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}

.rec-goods-goods_box .rec-goods-formerlyprice {
  font-size: 11 * $rpx;
  color: #bfbfbf;
  text-decoration: line-through;
}

.rec-goods-goods_box .rec-goods-coupon {
  display: flex;
  margin: 4 * $rpx 0 6 * $rpx;
}

.rec-goods-goods_box .rec-goods-coupon div {
  font-size: 9 * $rpx;
  margin-right: 4 * $rpx;
}

.rec-goods-goods_box .rec-goods-coupon .rec-goods-deadline {
  border: 1 * $rpx solid #fea295;
  color: #ef270e;
  border-right: 0;
}
.rec-goods-goods_box .rec-goods-coupon .rec-goods-name {
  background-color: #f0260e;
  border: 1 * $rpx solid #f0260e;
  color: #fff;
  padding: 0 2 * $rpx;
}

.rec-goods-goods_box .rec-goods-coupon .rec-goods-border {
  padding: 0 2 * $rpx;
  color: #ef270e;
  border: 1 * $rpx solid #fea295;
  border-radius: 2 * $rpx;
}

.rec-goods-goods_box .rec-goods-heat {
  font-size: 11 * $rpx;
  color: #808080;
}

.rec-goods-goods_box .rec-goods-heat span {
  padding-right: 7 * $rpx;
}
</style>

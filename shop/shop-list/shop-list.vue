<template>
  <view v-if="!store.is_shenhe" class="body flex-col">
    <template v-if="pageData.page">
      <view class="search-box p-x-20 flex-y-center flex-x-sb">
        <view @click="clickTb(4)" class="left flex-y-center">
          <text class=" ">{{
            (addressData.city && addressData.city.name) || "定位失败"
          }}</text>
          <text class="iconfont icon-arrow-bottom"></text>
        </view>
        <view class="right flex-w-1">
          <u-search
            placeholder="请输入商家名称"
            clearabled
            @search="onSearch"
            @custom="onSearch"
            v-model="keyword"
            bgColor="#f0f1f2"
          ></u-search>
        </view>
      </view>

      <scroll-view @scrolltolower="loadData" scroll-y class="flex-h-1">
        <view class="scroll-view">
          <view>
            <swiper class="swiper" :indicator-dots="true" :autoplay="true">
                <swiper-item  v-for="(item, index) in banner" :key="index" @click="onClick(item)">
                  <image
                    :src="item.pic_url"
                    style="width: 100%; height: 100%"
                    mode=""
                  />
                </swiper-item>
            </swiper>
          </view>

          <view class="shop-list">
            <view class="list-title p-20 m-t-20 font-40 color-666 font-w-600">
              附近店铺
            </view>
            <view class="tbs p-x-20 flex-y-center flex-x-sb">
              <view @click="clickTb(0)" :class="['tb']">
                <text>{{ catName }}</text>
                <text class="iconfont icon-arrow-bottom font-30"></text>
              </view>
              <view @click="clickTb(1)" :class="['tb']">
                <text>{{ zhinengName }}</text>
                <text class="iconfont icon-arrow-bottom font-30"></text>
              </view>
              <view @click="clickTb(2)" :class="['tb']">
                <text>{{ fujinName }}</text>
                <text class="iconfont icon-arrow-bottom font-30"></text>
              </view>
              <view @click="clickTb(3)" :class="['tb']">
                <text>筛选</text>
                <text class="iconfont icon-arrow-bottom font-30"></text>
              </view>
            </view>
            <ShopList :list="pageData.list"></ShopList>
            <u-loadmore :status="pageData.status"></u-loadmore>
          </view>
        </view>
      </scroll-view>

      <!-- 弹框条件筛选 -->
      <view class="popup" @click="showTbs = false" v-if="showTbs">
        <view @click.stop class="popup-content">
          <view class="tbs flex-y-center flex-x-sb">
            <view
              @click="clickTb(i)"
              :class="['tb', selectTbIndex == i && 'select']"
              v-for="(tb, i) in tabs"
              :key="i"
            >
              <text>{{ tb.name }}</text>
              <text
                v-if="selectTbIndex != i"
                class="iconfont icon-arrow-bottom font-30"
              ></text>
              <text v-else class="iconfont icon-arrow-top font-30"></text>
            </view>
          </view>

          <!-- 分类选项 -->
          <view class="content-cat" v-if="selectTbIndex == 0">
            <scroll-view scroll-y style="max-height: 600rpx">
              <view
                :class="['item', 0 == mch_common_cat_id && 'select']"
                @click="catChange(0)"
              >
                全部
              </view>
              <view
                :class="['item', item.id == mch_common_cat_id && 'select']"
                @click="catChange(item.mch_common_cat_id)"
                v-for="(item, i) in store_cat"
                :key="i"
              >
                {{ item.name }}
              </view>
            </scroll-view>
          </view>

          <!-- 智能筛选 -->
          <view v-if="selectTbIndex == 1" class="content-zhineng">
            <view @click="sortChange(0)" :class="[sort_type == 0 && 'select']"
              >离我最近</view
            >
            <view @click="sortChange(1)" :class="[sort_type == 1 && 'select']"
              >好评优先</view
            >
            <view @click="sortChange(2)" :class="[sort_type == 2 && 'select']"
              >销量最高</view
            >
          </view>

          <!-- 附近选择 -->
          <view v-else-if="selectTbIndex == 2" class="content-fujin flex">
            <scroll-view scroll-y style="max-height: 600rpx" class="left">
              <view
                :class="district_id == -1 && 'select'"
                class="item u-line-1"
                @click="districtChange(-1)"
              >
                附近
              </view>
              <view
                :class="district_id == 0 && 'select'"
                class="item u-line-1"
                @click="districtChange(0)"
              >
                全城
              </view>
              <view
                :class="district_id == item.id && 'select'"
                @click="districtChange(item.id)"
                class="item u-line-1"
                v-for="(item, i) in addressData.district_list"
                :key="i"
              >
                {{ item.name }}
              </view>
            </scroll-view>
            <view class="right" v-if="district_id == -1">
              <view
                @click="districtChange(-1, 500)"
                :class="distance == 500 && 'select'"
                >0.5km</view
              >
              <view
                @click="districtChange(-1, 1000)"
                :class="distance == 1000 && 'select'"
                >1km</view
              >
              <view
                @click="districtChange(-1, 3000)"
                :class="distance == 3000 && 'select'"
                >3km</view
              >
              <view
                @click="districtChange(-1, 5000)"
                :class="distance == 5000 && 'select'"
                >5km</view
              >
              <view
                @click="districtChange(-1, 10000)"
                :class="distance == 10000 && 'select'"
                >10km</view
              >
            </view>
          </view>

          <!-- 配送方式筛选 -->
          <view v-else-if="selectTbIndex == 3" class="content-shaixuan">
            <view class="p-y-20 m-b-10">商家服务 (可多选)</view>
            <view class="list flex">
              <view
                @click="
                  peisong_type['express_delivery'] =
                    !peisong_type['express_delivery']
                "
                :class="[
                  'fuwu-item',
                  peisong_type['express_delivery'] && 'select-fuwu',
                ]"
              >
                快递配送
              </view>
              <view
                @click="
                  peisong_type['self_delivery'] = !peisong_type['self_delivery']
                "
                :class="[
                  'fuwu-item',
                  peisong_type['self_delivery'] && 'select-fuwu',
                ]"
              >
                门店自提
              </view>
              <view
                @click="
                  peisong_type['waimai_delivery'] =
                    !peisong_type['waimai_delivery']
                "
                :class="[
                  'fuwu-item',
                  peisong_type['waimai_delivery'] && 'select-fuwu',
                ]"
              >
                外卖配送
              </view>
            </view>
            <view class="bts">
              <view class="reset" @click="onReset('peisong_type')">清空</view>
              <view @click="onSearch" class="reset m-l-20">
                完成({{ shaixuanLength }})
              </view>
            </view>
          </view>

          <!-- 城市选择 -->
          <view v-else-if="selectTbIndex == 4" class="content-fujin flex">
            <scroll-view scroll-y style="max-height: 600rpx" class="left">
              <view
                @click="sIdChange(i)"
                :class="sIndex == i && 'select'"
                class="item u-line-1"
                v-for="(s, i) in addressList"
                :key="i"
              >
                {{ s.name }}
              </view>
            </scroll-view>
            <scroll-view scroll-y style="max-height: 600rpx" class="right">
              <view
                @click="cityChange(s.id)"
                :class="district_id == item.id && 'select'"
                class="item u-line-1"
                v-for="(s, i) in addressList[sIndex].list"
                :key="i"
              >
                {{ s.name }}
              </view>
            </scroll-view>
          </view>
        </view>
      </view>
    </template>

    <QOfficialAccount></QOfficialAccount>
  </view>
  <q-shenhe v-else></q-shenhe>
</template>
<script>
import ShopList from "./components/ShopList";
import share from "@/mixins/share.js";
export default {
  mixins: [share],
  components: {
    ShopList,
  },
  data() {
    return {
      pageData: {
        list: [],
        page: 0,
        status: "loadmore",
      },
      tabs: [
        {
          name: "店铺分类",
        },
        {
          name: "智能排序",
        },
        {
          name: "附近",
        },
        {
          name: "筛选",
        },
      ],
      delivery_method: {}, //配送方式
      banner: [], //banner数组
      store_cat: [], //门店分类
      addressData: {}, //地址信息
      addressList: [], //省市区列表
      keyword: "",
      showTbs: false,
      selectTbIndex: -1, //tabs 索引
      mch_common_cat_id: 0, // 店铺分类
      sort_type: 0, //智能排序
      distance: -1, //附近公里数  -1表示不选
      district_id: 0, //区县ID
      city_id: 0, //城市ID
      sIndex: 0,
      peisong_type: {
        express_delivery: false,
        self_delivery: false,
        waimai_delivery: false,
      },
    };
  },
  onLoad(params) {
    this.mch_common_cat_id = params.mch_common_cat_id || 0;
    this.getLocationData(this.loadData);
    this.getAddressList();
  },
  methods: {
    // 获取门店列表
    async loadData() {
      if (this.pageData.status == "nomore") return;
      const location = await this.$store.dispatch("GETLOCATION");

      const formData = {
        distance: this.distance,
        district_id: this.district_id == -1 ? 0 : this.district_id,
        city_id: this.city_id,
        sort_type: this.sort_type,
        mch_common_cat_id: this.mch_common_cat_id,
        keyword: this.keyword,
        page: this.pageData.page,
        longitude: location.longitude,
        latitude: location.latitude,
        peisong_type: (() => {
          for (const key in this.peisong_type) {
            this.peisong_type[key] = Number(this.peisong_type[key]);
          }
          return this.peisong_type;
        })(),
      };
      const res = await this.$requestAll.mch.getMchList(formData, true);
      this.pageData.page++;
      this.banner = res.data.banner;
      this.delivery_method = res.data.delivery_method;
      this.store_cat = res.data.store_cat;
      this.pageData.list.push(...res.data.list);
      this.pageData.status = res.data.list.length < 10 ? "nomore" : "loadmore";
    },
    // 获取定位信息
    async getLocationData(callback) {
      const location = await this.$store.dispatch("GETLOCATION");

      const res = await this.$requestAll.mch.locationInfo(
        {
          longitude: location.longitude,
          latitude: location.latitude,
        },
        true
      );

      this.addressData = res.data;
      callback();
    },
    // 获取省市区
    async getAddressList() {
      const res = await this.$requestAll.default.district({}, true);
      this.addressList = res.data;
    },
    onSearch() {
      this.showTbs = false;
      // 全部数据重置
      this.pageData = this.$options.data().pageData;
      this.loadData();
    },

    // 点击筛选tbs
    clickTb(i) {
      this.selectTbIndex = i;
      this.showTbs = true;
    },

    // 数据恢复初始化
    onReset(type) {
      const newType = this.$options.data()[type];
      this[type] = newType;
      console.log(newType, "数据初始化");
    },

    // 切换省份
    sIdChange(index) {
      this.sIndex = index;
    },

    // 切换市区
    cityChange(id) {
      this.city_id = id;
      this.onSearch();
      // 更新市区
      this.addressData.city = this.addressList[this.sIndex].list.filter(
        (item) => item.id == this.city_id
      )[0];
      // 更新地区
      this.addressData.district_list = this.addressData.city.list;
    },

    // 分类change
    catChange(id) {
      this.mch_common_cat_id = id;
      this.onSearch();
    },

    // 智能change
    sortChange(v) {
      this.sort_type = v;
      this.onSearch();
    },

    // 附近change
    districtChange(id, distance) {
      this.district_id = id;
      if (id == -1) {
        if (distance) {
          this.distance = distance;
          this.onSearch();
        }
      } else {
        this.distance = -1;
        this.onSearch();
      }
    },
    // 筛选选中
    onShaixuan(i) {},
	onClick(res){
		console.log(res.page_url,res.open_type)
		this.$utils.toUrl(res.page_url, res.open_type);
	}
  },
  onShow() {},
  computed: {
    shaixuanLength() {
      let l = 0;
      for (const key in this.peisong_type) {
        if (this.peisong_type[key]) {
          l++;
        }
      }
      return l;
    },
    catName() {
      if (this.mch_common_cat_id == 0 || !this.store_cat.length) {
        return "店铺分类";
      } else {
        return (
          this.store_cat.filter(
            (item) => item.mch_common_cat_id == this.mch_common_cat_id
          )[0]?.name || "店铺分类"
        );
      }
    },
    zhinengName() {
      const sort_type = this.sort_type;
      if (sort_type == 0) {
        return "离我最近";
      } else if (sort_type == 1) {
        return "好评优先";
      } else if (sort_type == 2) {
        return "销量最高";
      } else {
        return "智能分类";
      }
    },
    fujinName() {
      const district_id = this.district_id;
      if (district_id == -1) {
        return `${this.distance / 1000}km`;
      } else if (district_id == 0) {
        return "附近";
      } else {
        return this.addressData.district_list.filter(
          (item) => item.id == this.district_id
        )[0].name;
      }
    },
    shareData() {
      return {
        title: "店铺列表",
        path:
          "/shop/shop-list/shop-list" +
          uni.$u.queryParams({
            user_id: this.$store.getters["user/userInfo"].id || "",
            store_id: this.$store.getters["currentStore"].id || "",
            // #ifdef APP-PLUS
            _platform: "app",
            // #endif
          }),
      };
    },
  },
  watch: {},
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  position: relative;
  // background: #f5f5f5;
  height: 100vh;
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */
  .search-box {
    background: #fff;
    line-height: 100rpx;
    .left {
      margin-right: 10rpx;
      text-align: center;
      min-width: 100rpx;
      max-width: 200rpx;
      white-space: nowrap;
    }
  }

  .swiper {
    image {
      border-radius: 10rpx;
    }
    height: 190rpx;
    margin: 0 20rpx;
  }

  .scroll-view {
    padding-bottom: env(safe-area-inset-bottom);
    .shop-list {
      > view {
        padding-left: 20rpx;
        padding-right: 20rpx;
      }
    }
  }

  .tbs {
    line-height: 80rpx;
    .tb {
      font-weight: 600;
      color: #666;
    }
  }

  .popup {
    position: fixed;
    top: 100rpx;
    left: 0;
    width: 100%;
    height: calc(100vh - 100rpx);
    background: rgba(0, 0, 0, 0.3);
    color: #666;
    .popup-content {
      padding: 0 20rpx 20rpx;
      border-radius: 0 0 10rpx 10rpx;
      background: #fff;
      font-size: 28rpx;
      line-height: 40rpx;
    }
  }
  .content-zhineng,
  .content-fujin,
  .content-cat {
    line-height: 80rpx;
    font-size: 30rpx;
  }

  .content-fujin {
    .left {
      width: 300rpx;
    }
  }

  .content-shaixuan {
    .fuwu-item {
      margin-right: 20rpx;
      margin-bottom: 20rpx;
      line-height: 50rpx;
      background: #f5f5f5;
      padding: 0 20rpx;
    }
    .bts {
      // border-top: 2rpx solid #eee;
      display: flex;
      line-height: 80rpx;
      > view {
        text-align: center;
        flex: 1;
        background: #fff;
        border: 1px solid #e5e5e5;
        border-radius: 10rpx;
        &:nth-child(2) {
          background: #e1251b;
          color: #fff;
          border-color: #e1251b;
        }
      }
    }
  }

  .select {
    color: red !important;
  }

  .select-fuwu {
    background-color: #fff0f0 !important;
    color: #e1251b !important;
  }
}
</style>

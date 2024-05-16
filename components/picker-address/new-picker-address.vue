<template>
  <view class="">
    <div>
      {{ position }}
    </div>
    <u-popup
      :show="show"
      mode="bottom"
      :mask="false"
      :safe-area-inset-bottom="true"
      :mask-close-able="false"
    >
      <view class="picker-view-title">
        <div class="left" @click="$emit('update:show', false)">取消</div>
        <div class="right" @click="confirm">确定</div>
      </view>
      <picker-view
        v-if="show"
        indicator-style="height:50rpx;"
        :value="defaultIndex"
        @change="selectChange"
        class="picker-view"
      >
        <picker-view-column>
          <view
            class="item"
            v-for="(item, index) in districtList_1"
            :key="index"
            >{{ item.name }}</view
          >
        </picker-view-column>
        <picker-view-column>
          <view
            class="item"
            v-for="(item, index) in districtList_2"
            :key="index"
            >{{ item.name }}</view
          >
        </picker-view-column>
        <picker-view-column>
          <view
            class="item"
            v-for="(item, index) in districtList_3"
            :key="index"
            >{{ item.name }}</view
          >
        </picker-view-column>
      </picker-view>
    </u-popup>
  </view>
</template>

<script>
var district = [];
export default {
  props: {
    show: {
      type: [Boolean, String],
      default: false,
    },
    province_id: {
      type: [String, Number],
      default: "",
    },
    city_id: {
      type: [String, Number],
      default: "",
    },
    district_id: {
      type: [String, Number],
      default: "",
    },
  },
  data() {
    return {
      defaultIndex: [0, 0, 0],
      districtList_1: [],
      districtList_2: [],
      districtList_3: [],
      position: "请选择省市区",
    };
  },
  watch: {
    district_id(val) {
      this.setAddressList([this.province_id, this.city_id, this.district_id]);
    },
  },
  created() {
    console.log(this.province_id, this.district_id, this.city_id);
    this.getDistrict();
  },
  methods: {
    setAddressList(list = []) {
      let cityList,
        districtList,
        provinceIndex = 0,
        cityIndex = 0,
        districtIndex = 0;
      console.log(list);

      if (list && list.length) {
        // 获取市列表
        cityList = list[0]
          ? district.find((el) => String(list[0]) == el.id).list
          : district[0].list;
        // 获取市索引
        cityIndex = list[1]
          ? cityList.findIndex((el) => String(list[1]) == el.id)
          : 0;

        // 获取区列表
        districtList = list[1]
          ? cityList.find((el) => String(list[1]) == el.id).list
          : cityList[0].list;
        // 获取区索引
        districtIndex = list[2]
          ? districtList.findIndex((el) => String(list[2]) == el.id)
          : 0;

        // 获取省索引
        provinceIndex = list[0]
          ? district.findIndex((el) => String(list[0]) == el.id)
          : 0;

        // 设置选中省市区字体
        this.position = [
          district[provinceIndex].name,
          cityList[cityIndex].name,
          districtList[districtIndex].name,
        ].join("");
      } else {
        let cityAllItem = JSON.parse(JSON.stringify(district[0].list));
        cityList = cityAllItem;
        districtList = cityList[0].list;
      }

      this.districtList_2 = JSON.parse(JSON.stringify(cityList)).map((el) => {
        delete el.districtAll;
        return el;
      });
      this.districtList_3 = districtList;
      this.defaultIndex = [provinceIndex, cityIndex, districtIndex];
    },

    selectChange(e) {
      let indexs = e.detail.value;
      let yDefaultIndex = JSON.parse(JSON.stringify(this.defaultIndex));
      if (yDefaultIndex[0] != indexs[0]) {
        this.defaultIndex = [indexs[0], 0, 0];
      } else if (yDefaultIndex[1] != indexs[1]) {
        this.defaultIndex = [indexs[0], indexs[1], 0];
      } else {
        this.defaultIndex = indexs;
      }

      this.districtList_2 = district[this.defaultIndex[0]].list;
      this.districtList_3 =
        district[this.defaultIndex[0]].list[this.defaultIndex[1]].list;
    },
    async getDistrict(fn) {
      try {
        var res = await this.$requestAll.default.district({});
        district = JSON.parse(JSON.stringify(res.data));

        this.districtList_1 = res.data.map((item) => {
          delete item.list;
          return item;
        });

        if (this.province_id && this.city_id && this.district_id) {
          this.setAddressList([
            this.province_id,
            this.city_id,
            this.district_id,
          ]);
        } else {
          this.setAddressList();
        }

        fn && fn();
      } catch (e) {
        //TODO handle the exception
      }
    },
    confirm() {
      this.$emit("update:show", false);

      let val = this.defaultIndex;
      let [i1, i2, i3] = val;

      let province_id = this.districtList_1[i1].id;
      let city_id = this.districtList_2[i2].id;
      let district_id = this.districtList_3[i3].id;
      this.position = [
        this.districtList_1[i1].name,
        this.districtList_2[i2].name,
        this.districtList_3[i3].name,
      ].join("");
      this.$emit("update:province_id", province_id);
      this.$emit("update:city_id", city_id);
      this.$emit("update:district_id", district_id);

      this.$emit("confirm", {
        province_id: province_id,
        city_id: city_id,
        district_id: district_id,
        position: this.position,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.picker-view-title {
  padding: 20rpx;
  font-size: 28rpx;
  color: #1aa034;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left {
    color: #999;
  }
}

.picker-view {
  width: 750rpx;
  height: 500rpx;
}
.item {
  height: 50rpx;
  line-height: 50rpx;
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>

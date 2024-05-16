// 日历签到组件当前用于签到

<template>
  <view class="calendar-box">
    <view class="month">
      <view @click="lastMonth">
        <text class="iconfont icon-arrow-left color-666 font-50 p-10"></text>
      </view>
      <view class="m-x-30">{{ year }}年{{ month }}月</view>
      <view @click="nextMonth">
        <text class="iconfont icon-arrow-right font-50 color-666 p-10"></text>
      </view>
      <picker
        v-if="checkDate"
        class="picker"
        mode="date"
        fields="month"
        @change="changeDate"
      />
    </view>
    <view class="week">
      <view
        :style="'color:' + (weeks == weeked ? bgweek : '') + ';'"
        v-for="weeks in weekArr"
        >{{ weeks }}</view
      >
    </view>
    <view class="day">
      <view
        :class="[
          { checkday: days.date == '' },
          { choose: days.date == localDate },
        ]"
        :style="'background:' + (days.date == localDate ? bgday : '') + ';'"
        v-for="(days, index) in dayArr"
        :key="index"
        @click="signToday(days, index)"
      >
        {{ days.day }}
        <view
          :class="[
            { circle: days.flag },
            {
              sign:
                days.date ==
                `${year}-${month < 10 ? '0' + month : month}-${
                  day < 10 ? '0' + day : day
                }`,
            },
          ]"
        ></view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    lang: {
      type: String,
      default: "zh",
    },
    type: {
      type: String,
      default: "calendar",
    },
    checkDate: {
      type: Boolean,
      default: false,
    },
    bgweek: {
      type: String,
      default: "#FF8F22",
    },
    bgday: {
      type: String,
      default: "#FF8F22",
    },
    // 默认选中的日期
    defaultDate: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      weeked: "", // 今天周几
      dayArr: [], // 当前月每日
      localDate: "", // 今天日期
      day: new Date().getDate(), // 当前日
      year: new Date().getFullYear(), // 当前年
      month: new Date().getMonth() + 1, // 当前月
      weekArr: ["日", "一", "二", "三", "四", "五", "六"], // 每周
    };
  },
  mounted() {
    let that = this;
    // 初始日期
    that.initDate();
    // 今天日期
    that.localDate =
      that.year +
      "-" +
      that.formatNum(that.month) +
      "-" +
      that.formatNum(that.day);
    // 中英切换
    if (that.lang != "zh")
      that.weekArr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    // 今天周几
    that.weeked = that.weekArr[new Date().getDay()];
    // 签到功能
    if (that.type != "calendar") {
      for (let i in that.dayArr) {
        that.$set(that.dayArr[i], "flag", false);
      }
    }
  },
  methods: {
    // 选择年月
    changeDate(e) {
      let that = this;
      that.year = parseInt(e.detail.value.split("-")[0]);
      that.month = parseInt(e.detail.value.split("-")[1]);
      that.initDate();
    },
    // 点击签到
    signToday(obj, index) {
      console.log(obj, index);
      let that = this;
      // 指定签到类型可访问
      if (that.type == "calendar") return;
      // 限制本月可进行签到
      if (new Date().getMonth() + 1 != parseInt(obj.date.split("-")[1])) return;
      // 禁用非本月点击签到且限制签到日期小于等于本日
      //   if (obj.date != "" && obj.day <= that.day) {
      if (obj.date != "" && obj.day == that.day) {
        // 开启已签到提醒
        // if (that.dayArr[index].flag) {
        //   uni.showToast({
        //     title: "已签到",
        //     icon: "none",
        //   });
        // } else {
        //   uni.showToast({
        //     title: that.day > obj.day ? "补签成功" : "签到成功",
        //     icon: "success",
        //   });
        // that.$set(that.dayArr[index], "flag", true);
        that.$emit("change", obj.date);
        // }
      }
    },
    // 初始化日期
    initDate() {
      let that = this;
      that.dayArr = [];
      // 当前月总天数
      let totalDay = new Date(that.year, that.month, 0).getDate();
      // 遍历总天数将日期逐个添加至数组
      for (let i = 1; i <= totalDay; i++) {
        // 得到需补充天数
        let value = new Date(that.year, that.month - 1, i).getDay();
        // 补充前面空白日期
        if (i == 1 && value != 0) that.addBefore(value);
        // 添加本月日期
        let obj = {};
        obj.date =
          that.year +
          "-" +
          that.formatNum(that.month) +
          "-" +
          that.formatNum(i);
        obj.day = i;
        that.dayArr.push(obj);
        // 补充后面空白日期
        if (i == totalDay && value != 6) that.addAfter(value);
      }
    },
    // 补充前面空白日期
    addBefore(value) {
      let that = this;
      let totalDay = new Date(that.year, that.month - 1, 0).getDate();
      for (let i = 0; i < value; i++) {
        let obj = {};
        obj.date = "";
        obj.day = totalDay - (value - i) + 1;
        that.dayArr.push(obj);
      }
    },
    // 补充后空白日期
    addAfter(value) {
      let that = this;
      for (let i = 0; i < 6 - value; i++) {
        let obj = {};
        obj.date = "";
        obj.day = i + 1;
        that.dayArr.push(obj);
      }
    },
    // 格式化日期位数
    formatNum(num) {
      return num < 10 ? "0" + num : num;
    },
    // 上一个月
    lastMonth() {
      let that = this;
      if (that.month == 1) {
        that.year -= 1;
        that.month = 12;
      } else {
        that.month -= 1;
      }
      that.initDate();
    },
    // 下一个月
    nextMonth() {
      let that = this;
      if (that.month == 12) {
        that.year += 1;
        that.month = 1;
      } else {
        that.month += 1;
      }
      that.initDate();
    },
    // 设置默认选中已签到日期
    setDefaultDate(currentDate, defaultDate) {
      currentDate.forEach((c) => {
        const date = c.date
          ? `${this.year}/${this.month}/${c.day}`
          : "2022/2022/2022";

        // 组件和之前签到时间为多0  所以有时间戳判断
        const index = defaultDate.findIndex(
          (item) => new Date(item).getTime() == new Date(date).getTime()
        );
        if (index != -1) {
          c.flag = true;
        }
      });

      this.dayArr = currentDate;
    },
  },
  watch: {
    // 更改月份查找标记签到
    dayArr(val) {
      console.log("更换月份", val);
      this.setDefaultDate(this.dayArr, this.defaultDate);
    },
    // 更改选中查找标记签到
    defaultDate: {
      handler() {
        this.setDefaultDate(this.dayArr, this.defaultDate);
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.calendar-box {
  width: 100%;
  flex-direction: column;
  justify-content: center;
  background: #fff;
  width: initial;
  margin: 0 20rpx;
  border-radius: 20rpx;
}

.calendar-box,
.month,
.week,
.day {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.month,
.week,
.day {
  width: 700rpx;
}

.month {
  margin: 30rpx 0;
  position: relative;
  justify-content: center;
}

.picker {
  width: 160rpx;
  height: 40rpx;
  position: absolute;
  top: 20rpx;
  left: 50%;
  transform: translate(-50%, -50%);
}

.day {
  flex-wrap: wrap;
}

.week > view,
.day > view {
  width: 100rpx;
  height: 100rpx;
  text-align: center;
  position: relative;
  line-height: 100rpx;
}

.checkday {
  color: #999;
}

.choose {
  color: #ffffff;
  border-radius: 50%;
}

.circle {
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #f4a01a;
}

.sign {
  background-color: #0089fe;
}
</style>

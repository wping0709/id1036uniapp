<template>
  <view class="calendar">
    <view class="date-title flex-y-center flex-x-center">
      <view @click="switchMoth('jian')" style="padding-top: 4rpx">
        <text class="iconfont icon-sanjiao-left font-40"></text>
      </view>
      <view class="font-30 m-x-30">{{ y + ' 年 ' + m + ' 月' }}</view>
      <view @click="switchMoth('jia')" style="padding-top: 4rpx">
        <text class="iconfont icon-sanjiao-right font-40"></text>
      </view>
    </view>

    <view class="day-box">
      <view class="weeks">
        <view class="week" v-for="(item, index) in weekArr" :key="index">
          {{ item }}
        </view>
      </view>

      <view class="day-content weeks">
        <view
          @click="clickDate(item)"
          v-for="(item, index) in dayArr"
          :key="index"
          class="day-item week"
        >
          <view
            :class="[
              currentDate == item.date && 'currentDate',
              selectDate.date == item.date && 'selectDate',
              !item.date && 'displayDate'
            ]"
          >
            {{ item.d }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      y: '',
      m: '',
      d: '',
      currentDate: '',
      dayArr: [],
      weekArr: ['日', '一', '二', '三', '四', '五', '六'], // 每周
      selectDate: '',
    };
  },
  created() {
    this.getCurrentDate();
    this.initDate();
  },
  methods: {
    // 获取当前时间
    getCurrentDate() {
      const date = new Date();
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      var d = date.getDate();
      this.y = y;
      this.m = m;
      this.d = d;
      if (!this.currentDate) this.currentDate = `${y}-${m}-${d}`;
    },
    initDate() {
      this.dayArr = [];
      // 当前月总天数
      let totalDay = new Date(this.y, this.m, 0).getDate();
      for (let i = 1; i <= totalDay; i++) {
        // 得到需补充天数
        let value = new Date(this.y, this.m - 1, i).getDay();
        // 补充前面空白日期
        if (i == 1 && value != 0) this.addBefore(value);

        let obj = {};
        obj.date = `${this.y}-${this.m}-${i}`;
        obj.d = i;
        this.dayArr.push(obj);

        // 补充后面空白日期
        if (i == totalDay && value != 6) this.addAfter(value);
      }

      // 初次加载获取当前选中时间  默认为当前时间
      if(!this.selectDate) {
        const index = this.dayArr.findIndex(item => item.date == this.currentDate)
        this.clickDate(this.dayArr[index])
      }
    },
    // 切换月份
    switchMoth(type) {
      let m = this.m;
      let y = this.y;
      if (type == 'jia') {
        if (m == 12) {
          m = 1;
          y = y + 1;
        } else {
          m = m + 1;
        }
      } else {
        if (m == 1) {
          m = 12;
          y = y - 1;
        } else {
          m = m - 1;
        }
      }

      (this.m = m), (this.y = y);
      this.initDate()
    },

    clickDate(item) {
      if(!item.date) return
      this.selectDate = item;
      this.$emit('switchDate',item)
    },
    // 补充前面空白日期
    addBefore(value) {
      let that = this;
      let totalDay = new Date(that.y, that.m - 1, 0).getDate();
      for (let i = 0; i < value; i++) {
        let obj = {};
        obj.date = '';
        obj.d = totalDay - (value - i) + 1;
        that.dayArr.push(obj);
      }
    },
    // 补充后空白日期
    addAfter(value) {
      let that = this;
      for (let i = 0; i < 6 - value; i++) {
        let obj = {};
        obj.date = '';
        obj.d = i + 1;
        that.dayArr.push(obj);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.calendar {
  background: #fff;
  padding: 0 25rpx;
}
.weeks {
  display: flex;
  align-items: center;
  color: #666;
  .week {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100rpx;
    text-align: center;
    height: 100rpx;
    &:nth-child(1) {
      color: red;
    }
    &:nth-last-child(1) {
      color: red;
    }
  }
}

.day-content {
  flex-wrap: wrap;
  .day-item {
    display: flex;
    justify-content: center;
    align-items: center;
    &:nth-child(1) {
      color: initial;
    }
    &:nth-last-child(1) {
      color: initial;
    }
    > view {
      width: 60rpx;
      height: 60rpx;
      line-height: 60rpx;
    }
  }
}
.selectDate {
  border-radius: 50%;
  background: #ff629a;
  color: #fff;
}
.displayDate{
  color: #999;
}
.currentDate {
  border-radius: 50%;
  background: #874fb4;
  color: #fff;
}


</style>

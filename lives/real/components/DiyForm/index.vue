<template>
  <view>
    <view v-if="type == 'date'">
      <u-datetime-picker
        :show="showPicker == 'date'"
        :value="defaultValue || cDate"
        @cancel="showPicker = false"
        @confirm="pickerConfirm($event, 'date')"
        mode="date"
      ></u-datetime-picker>
      <view @click="showPicker = 'date'">
        <text v-if="defaultValue">{{ defaultValue }}</text>
        <text v-else class="color-999">请选择日期</text>
      </view>
    </view>
    <view v-else-if="type == 'time'">
      <u-datetime-picker
        :show="showPicker == 'time'"
        :value="defaultValue || cTime"
        @cancel="showPicker = false"
        @confirm="pickerConfirm($event, 'time')"
        mode="time"
      ></u-datetime-picker>
      <view @click="showPicker = 'time'">
        <text v-if="defaultValue">{{ defaultValue }}</text>
        <text v-else class="color-999">请选择时间</text>
      </view>
    </view>
    <view v-else-if="type == 'text'">
      <u-input
        :value="defaultValue"
        @change="inputChange"
        placeholder="请输入"
        border="none"
      ></u-input>
    </view>
    <view v-else-if="type == 'textarea'">
      <u-textarea
        :value="defaultValue"
        @input="textareaChange"
        placeholder="请输入"
        border="none"
        autoHeight
      ></u-textarea>
    </view>
    <view v-else-if="type == 'uploadImg'">
      <Upload
        type="image"
        :fileList.sync="fileList"
      ></Upload>
    </view>
    <view v-else-if="type == 'radio'" class="flex flex-wrap">
      <view
        @click="radioChange(i)"
        v-for="(itm, i) in item.default_list"
        :key="i"
        :class="['redio-bt', itm.is_selected && 'check']"
        >{{ itm.name }}</view
      >
    </view>
    <view v-else-if="type == 'checkbox'" class="flex flex-wrap">
      <view
        @click="checkBoxChange(i)"
        v-for="(itm, i) in item.default_list"
        :key="i"
        :class="['redio-bt', itm.is_selected && 'check']"
        >{{ itm.name }}</view
      >
    </view>
  </view>
</template>

<script>
import Upload from '@/components/Upload';
export default {
  props: {
    defaultValue: {},
    type: {
      type: String,
      default: 'text',
    },
    item: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components: {
    Upload,
  },
  data() {
    return {
      showPicker: false,
      fileList: [],
      itemData: '',
    };
  },
  computed: {
    cDate() {
      return uni.$u.timeFormat('', 'yyyy-mm-dd');
    },
    cTime() {
      return uni.$u.timeFormat('', 'hh:MM');
    },
  },
  watch: {
    defaultValue: {
      handler(v) {
        if (v && this.type == 'uploadImg') {
          this.fileList = [
            {
              url: v,
              type: 'image',
            },
          ];
        }
      },
      immediate: true,
      deep: true,
    },
    fileList: {
      handler(v, olv) {
        if (v[0]?.url) {
          this.$emit('update:valueChange', v[0].url);
        }
      },
      immediate: true,
      deep: true,
    },
    item: {
      handler(v) {
        this.itemData = v;
      },
      immediate: true,
      deep: true,
    },
    itemData: {
      handler(v, olv) {
        if (!olv) return;
        this.$emit('itemChange', v);
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    dateConfirm(e, item) {
      console.log(e);
    },
    textareaChange(e) {
      this.$emit('update:valueChange', e);
    },
    inputChange(e) {
      this.$emit('update:valueChange', e);
    },
    radioChange(i) {
      this.itemData.default_list = this.itemData.default_list.map(
        (item, i1) => {
          if (i == i1) {
            item.is_selected = 1;
          } else {
            item.is_selected = 0;
          }
          return item;
        }
      );
    },
    checkBoxChange(i) {
      var is_selected = this.itemData.default_list[i].is_selected;
      this.itemData.default_list[i].is_selected = is_selected == 1 ? 0 : 1;
    },
    pickerConfirm(e, type) {
      console.log(e);
      if (type == 'date') {
        this.$emit(
          'update:valueChange',
          uni.$u.timeFormat(e.value, 'yyyy-mm-dd')
        );
      } else {
        this.$emit('update:valueChange', e.value);
      }
      this.showPicker = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.redio-bt {
  font-size: 24rpx;
  padding: 6rpx 20rpx;
  border-radius: 40rpx;
  border: 1px solid #999;
  margin: 10rpx 10rpx 10rpx 0;
}
.check {
  border-color: red;
  color: red;
}
</style>

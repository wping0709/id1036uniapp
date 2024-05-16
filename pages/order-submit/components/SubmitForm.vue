<template>
  <view class="p-x-20 form-box">
    <div v-if="form.name" class="form-title">{{ form.name }}</div>
    <u-form labelWidth="120rpx">
      <view
        v-for="(formItem, i) in form.list"
        :key="i"
        :class="
          ['uploadImg', 'textarea', 'checkbox'].indexOf(formItem.type) != -1 &&
          'row'
        "
      >
        <u-form-item
          :label="formItem.name"
          :required="formItem.required == 1"
          :borderBottom="i < form.list.length - 1"
        >
          <!-- 單選选择类型 -->
          <div
            @click="onShowRadio(i)"
            style="flex: 1"
            class="flex-y-center"
            v-if="formItem.type == 'radio'"
          >
            <div class="flex-y-center color-999 p-y-20 flex-w-1">
              <view class="flex-w-1 u-line-1">
                {{ radioText(formItem.default_list) }}
                <u-picker
                  :show="formItem.show"
                  :columns="[formItem.default_list]"
                  keyName="name"
                  @confirm="switchRadio($event, i)"
                  @cancel="formItem.show = false"
                ></u-picker>
              </view>
              <view class="iconfont icon-arrow-right"></view>
            </div>
          </div>

          <div v-else-if="formItem.type == 'checkbox'" class="radio checkbox">
            <div
              @click="selectChecked(i, i2)"
              :class="[
                'radio-item',
                checkbox.is_selected == 1 && 'radio-checked',
              ]"
              v-for="(checkbox, i2) in formItem.default_list"
              :key="i2"
            >
              {{ checkbox.name }}
            </div>
          </div>

          <!-- 时间选择类型 -->
          <div
            style="width: 100%"
            @click="onShowFormTime(i)"
            v-else-if="formItem.type == 'time'"
          >
            <div class="flex color-999">
              <view class="flex-w-1">{{
                !formItem.default ? '请选择' : formItem.default
              }}</view>
              <text class="iconfont icon-arrow-right"></text>
            </div>
            <u-datetime-picker
              v-if="formItem.default"
              :show="showFormTime === i"
              :value="formItem.default"
              mode="time"
              @confirm="formTimeConfirm($event, i)"
              @cancel="showFormTime = false"
            >
            </u-datetime-picker>
          </div>

          <!-- 日期选择类型 -->
          <div
            style="width: 100%"
            @click="onShowFormDate(i)"
            v-else-if="formItem.type == 'date'"
          >
            <div class="flex color-999">
              <view class="flex-w-1">{{
                !formItem.default ? '请选择' : formItem.default
              }}</view>
              <text class="iconfont icon-arrow-right"></text>
            </div>
            <u-datetime-picker
              v-if="formItem.default"
              :minDate="Number(new Date('1970'))"
              :show="showFormDate === i"
              :value="formItem.default"
              :mode="formItem.type"
              @confirm="formDateConfirm($event, i)"
              @cancel="showFormDate = false"
            >
            </u-datetime-picker>
          </div>

          <!-- 单行文本 -->
          <u-input
            v-else-if="formItem.type == 'text'"
            height="96"
            :value="formItem.default"
            :placeholder="formItem.tip"
            @change="inputChange($event, i)"
            border="none"
          >
          </u-input>

          <!-- 多行文本 -->
          <u-textarea
            v-else-if="formItem.type == 'textarea'"
            :value="formItem.default"
            :placeholder="formItem.tip"
            @input="textareaChange($event, i)"
            border="none"
            maxlength="-1"
            :placeholderStyle="{ fontSize: '26rpx' }"
          ></u-textarea>

          <div v-else-if="formItem.type == 'uploadImg'">
            <Upload
              type="image"
              width="128rpx"
              height="128rpx"
              :maxCount="1"
              :fileList="uploadImg(formItem.default)"
              @change="uploadChange($event, i)"
            ></Upload>
          </div>
        </u-form-item>
      </view>
    </u-form>
  </view>
</template>

<script>
import Upload from '@/components/Upload';
export default {
  components: { Upload },
  props: {
    form: {
      type: [Object, String],
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      showFormDate: false, //时间选择框
      showFormTime: false, //时间选择框
    };
  },
  methods: {
    // formChange事件处理
    formChange(form) {
      this.$emit('update:form', form);
      this.$emit('formChange', form);
    },
    onShowRadio(index) {
      let form = JSON.parse(JSON.stringify(this.form));
      let formItem = form.list[index];
      formItem.show = !formItem.show;
      this.formChange(form);
    },
    // 文本框change
    textareaChange(e, index) {
      let form = JSON.parse(JSON.stringify(this.form));
      let formItem = form.list[index];

      formItem.default = e;
      this.formChange(form);
    },
    // 输入框change
    inputChange(e, index) {
      let form = JSON.parse(JSON.stringify(this.form));
      let formItem = form.list[index];

      formItem.default = e;
      this.formChange(form);
    },
    // 单选切换选择
    switchRadio(e, index) {
      let radioIndex = e.indexs[0];
      let form = JSON.parse(JSON.stringify(this.form));
      let formItem = form.list[index];

      formItem.default_list.forEach((radio, i) => {
        if (i == radioIndex) {
          radio.is_selected = 1;
        } else {
          radio.is_selected = 0;
        }
      });
      formItem.show = false;
      this.formChange(form);
    },
    // 多选选中
    selectChecked(index, checkboxIndex) {
      let form = JSON.parse(JSON.stringify(this.form));
      let formItem = form.list[index];

      formItem.default_list[checkboxIndex].is_selected =
        formItem.default_list[checkboxIndex].is_selected > 0 ? 0 : 1;
      this.formChange(form);
    },
    // 日期显示
    onShowFormDate(index) {
      let form = JSON.parse(JSON.stringify(this.form));
      let formItem = form.list[index];

      if (!formItem.default) {
        formItem.default = uni.$u.timeFormat(new Date(), 'yyyy-mm-dd');
      }
      this.showFormDate = index;
      this.formChange(form);
    },
    // 时间显示
    onShowFormTime(index) {
      let form = JSON.parse(JSON.stringify(this.form));
      let formItem = form.list[index];
      if (!formItem.default) {
        formItem.default = uni.$u.timeFormat(new Date(), 'hh:MM');
      }
      this.showFormTime = index;
      this.formChange(form);
    },
    // 日期选择确定
    formDateConfirm(val, index) {
      let form = JSON.parse(JSON.stringify(this.form));
      let formItem = form.list[index];
      console.log(val);
      formItem.default = uni.$u.timeFormat(new Date(val.value), 'yyyy-mm-dd');
      this.showFormDate = false;
      this.formChange(form);
    },
    //时间选择确定
    formTimeConfirm(val, index) {
      let form = JSON.parse(JSON.stringify(this.form));
      let formItem = form.list[index];

      formItem.default = val.value;
      this.showFormTime = false;
      this.formChange(form);
    },
    uploadChange(e, index) {
      let form = JSON.parse(JSON.stringify(this.form));
      let formItem = form.list[index];
      if (e.length) {
        formItem.default = e[0].url;
      } else {
        formItem.default = '';
      }
      this.formChange(form);
    },
  },
  computed: {
    radioText() {
      return function (radioArr) {
        let check = radioArr.find(item => item.is_selected);
        if (check) {
          return check.name;
        } else {
          return '请选择';
        }
      };
    },
    uploadImg() {
      return function (url) {
        if (url && url.length) {
          return [
            {
              type: 'image',
              url: url,
            },
          ];
        } else {
          return [];
        }
      };
    },
    cmpPickerColumns() {
      return function (formItem) {
        return [formItem.default_list];
      };
    },
  },
  options: {
    styleIsolation: 'shared',
  },
};
</script>
<style lang="scss">
.form-box {
  background: #fff;
  margin: 24rpx;
  border-radius: 20rpx;
  padding: 24rpx 30rpx;

  /deep/.u-line {
    border: 2rpx solid #f2f2f2;
  }

  /deep/.u-form-item__body {
    padding: 0;
    min-height: 100rpx;

    .u-form-item__body__left {
      margin-right: 60rpx;
      line-height: 96rpx;

      .u-form-item__body__left__content {
        padding-right: 0;
        width: 0;

        .u-form-item__body__left__content__label {
          display: block;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          word-break: break-all;
          width: 100%;
          font-size: 26rpx;
          color: #262626;
        }

        .u-form-item__body__left__content__required {
          line-height: 96rpx;
        }
      }
    }

    .u-form-item__body__right {
      font-size: 26rpx;

      .icon-arrow-right {
        width: 32rpx;
        height: 32rpx;
        line-height: 32rpx;
      }

      .u-form-item__body__right__content__slot {
        height: 100%;
        justify-content: center;

        .u-input {
          padding: 0 !important;

          input {
            font-size: 26rpx !important;
            height: 96rpx;
            line-height: 96rpx;

            &::placeholder {
              font-size: 26rpx !important;
              font-weight: 400;
              color: #624b2f;
            }
          }
        }
      }
    }
  }

  /deep/.row {
    .u-form-item__body {
      display: block;

      .u-textarea {
        padding: 0;
        padding-bottom: 20rpx;
        font-size: 26rpx;
      }

      .u-form-item__body__left {
        width: 100% !important;
        margin-right: 0;
      }

      .u-form-item__body__right {
        .u-form-item__body__right__content__slot {
          height: 100%;
          justify-content: flex-start;

          .u-input {
            font-size: 26rpx;
            padding: 0 !important;
            height: 96rpx;
            line-height: 96rpx;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.form-box {
  .form-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #262626;
  }

  .radio {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 6rpx;

    .radio-item {
      padding: 0rpx 30rpx;
      margin-right: 24rpx;
      margin-bottom: 24rpx;
      max-width: 200rpx;
      border-radius: 25rpx;
      background: #f2f2f2;
      border: 1px solid #f2f2f2;

      height: 52rpx;
      line-height: 52rpx;
      border-radius: 120rpx;
      font-size: 24rpx;
    }

    .radio-checked {
      color: #ff1b22;
      border: 1px solid #ff0021;
      background: #fef2f0;
    }
  }
}
</style>

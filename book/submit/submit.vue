<template>
  <view v-if="pageData" class="body">
    <view class="goods module flex-x-sb m-b-20">
      <image :src="pageData.goods.cover_pic" mode="aspectFill" />
      <div class="goods-right flex-w-1 m-l-20">
        <view class="name">{{ pageData.goods.name }}</view>

        <div class="m-y-10 font-26 color-999 attr-box u-line-1">
          <text v-for="(attr, i) in goods_info[0].attr" :key="i">
            <text>{{ attr.attr_group_name }}</text>
            ：
            <text style="color: #ff6845; margin-right: 10rpx">{{
              attr.attr_name
            }}</text>
          </text>
        </div>

        <div class="price-box font-right">
          <text class="old-price font-del color-999">
            ￥{{ pageData.goods.original_price }}
          </text>
          <text class="price font-34 price-color m-l-20"
            >￥{{ pageData.goods.price }}</text
          >
        </div>
      </div>
    </view>

    <div class="module" v-if="pageData.form_list.length">
      <image :src="wxapp_img.yy_form_title" mode="widthFix"></image>

      <!-- 表单 -->
      <SubmitForm
        class="SubmitFrom"
        :form.sync="form"
      ></SubmitForm>
    </div>

    <div class="bottom-fixed">
      <div class="fixed">
        <view @click="submit">提交预约</view>
      </div>
    </div>
  </view>
</template>
<script>
import OrderPay from '@/mixins/OrderPay';
import SubmitForm from '@/pages/order-submit/components/SubmitForm.vue';
export default {
  components: {
    SubmitForm,
  },
  mixins: [OrderPay],
  data() {
    return {
      pageData: '',
      form: '',
      goods_info: '',
      datePickerShow: false,
      timePickerShow: false,
    };
  },
  computed: {
    cDate() {
      return new Date().getTime();
    },
  },
  onLoad(params) {
    this.goods_info = JSON.parse(params.goods_info);
    this.loadData();
  },
  methods: {
    switchShow(key) {
      this[key] = !this[key];
    },
    timeConfirm(e, item) {
      console.log(e, item);
      item.default = e.value;
      this.switchShow('timePickerShow');
    },
    async loadData() {
      const res = await this.$requestAll.book.submitPreview({
        gid: this.goods_info[0].id,
        attr: JSON.stringify(this.goods_info[0].attr),
      });
      this.pageData = res.data;

      this.form = {
        list: res.data.form_list.map(item => {
          if (item.type == 'radio' || item.type == 'checkbox') {
            item.default_list = item.default.map(it => {
              it.is_selected = it.selected;
              return it;
            });
          }
          return item;
        }),
      };
    },
    dateConfirm(event, item) {
      const date = new Date(event.value);
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? '0' + m : m;
      let d = date.getDate();
      d = d < 10 ? '0' + d : d;
      item.default = `${y}-${m}-${d}`;
      this.datePickerShow = false;
    },
    async submit() {
      try {
        // 表单验证
        this.form.list.forEach(item => {
          // 判断数组default_list是否有选中项
          if (item.type == 'radio' || item.type == 'checkbox') {
            if (!item.default_list.some(it => it.is_selected))
              throw '请选择' + item.name;
          }
          // 判断必填项是否有输入
          else if (item.required && !item.default.trim().length)
            throw '请输入' + item.name;
        });

        let form_list = this.form.list.map(item => {
          if (item.type == 'radio' || item.type == 'checkbox') {
            item.default = item.default_list.map(it => {
              it.selected = it.is_selected;
              return it;
            });
          }
          return item;
        });

        await this.$utils.bindMessage(this.pageData.send_tpl);

        const formData = {
          gid: this.goods_info[0].id,
          form_list: JSON.stringify(form_list),
          attr: JSON.stringify(this.goods_info[0].attr),
          form_id: '',
        };

        this.orderSubmit(formData, 'yuyue');
      } catch (err) {
        return uni.$u.toast(err || '系统出错');
      }
    },
  },
  onShow() {},
  computed: {},
  watch: {},
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
  padding: 20rpx;

  /deep/.SubmitFrom {
    margin: 0;
  }

  > .module {
    background: #fff;
    border-radius: 10rpx;
  }

  .goods {
    > image {
      width: 200rpx;
      height: 200rpx;
    }

    .goods-right {
      .name {
        font-size: 30rpx;
        height: 90rpx;
        line-height: 45rpx;
      }
    }
  }

  /deep/.form-box {
    margin: 0;
    padding-bottom: 0;
  }

  .bottom-fixed {
    height: 100rpx;
    height: calc(100rpx + env(safe-area-inset-bottom));

    .fixed {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 100rpx;
      height: calc(100rpx + env(safe-area-inset-bottom));
      padding-bottom: env(safe-area-inset-bottom);

      > view {
        height: 100%;
        background: #ff4544;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
      }
    }
  }
}
</style>

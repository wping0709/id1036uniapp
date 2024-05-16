<template>
  <view v-if="pageData" class="body env-bottom">
    <view class="bg-fff p-20">
      <u--form
        :model="formData"
        :rules="rules"
        ref="form1"
        labelWidth="180rpx"
        labelAlign="center"
        errorType="toast"
      >
        <u-form-item label="模板名称" prop="name" borderBottom>
          <u--input
            v-model="formData.name"
            border="none"
            placeholder="请输入模板名称"
          ></u--input>
        </u-form-item>
        <u-form-item label="计费方式" prop="type">
          <u-radio-group v-model="formData.type" column="row">
            <u-radio :name="1" label="按重计费"></u-radio>
            <u-radio :name="2" label="按件计费"></u-radio>
          </u-radio-group>
        </u-form-item>
      </u--form>

      <view @click="addDetail" class="add-item">+ 新增条目</view>

      <view class="detail-item" v-for="(item, i) in formData.detail" :key="i">
        <u-form
          :model="item"
          :ref="'detailItem' + i"
          labelWidth="180rpx"
          labelAlign="center"
          errorType="toast"
        >
          <u-form-item label="首重(克)" prop="frist" borderBottom>
            <u-input
              v-model="item.frist"
              border="none"
              type="number"
              placeholder="请输入首重"
            ></u-input>
          </u-form-item>
          <u-form-item label="首费(元)" prop="frist_price" borderBottom>
            <u--input
              v-model="item.frist_price"
              border="none"
              type="number"
              placeholder="请输入首费"
            ></u--input>
          </u-form-item>
          <u-form-item label="续重(克)" prop="second" borderBottom>
            <u--input
              v-model="item.second"
              border="none"
              type="number"
              placeholder="请输入续重"
            ></u--input>
          </u-form-item>
          <u-form-item label="续费(元)" prop="second_price">
            <u--input
              v-model="item.second_price"
              border="none"
              type="number"
              placeholder="请输入续费"
            ></u--input>
          </u-form-item>
          <u-form-item
            @click="showAddressPopup(i)"
            prop="province_list"
            label="地区选择"
          >
            <view v-if="!item.province_list.length" class="color-999"
              >请选择地区</view
            >
            <view v-else class="color-999">
              <text v-for="(item1, i1) in item.province_list">
                <text>{{ item1.name }}</text>
                <text v-if="i1 + 1 < item.province_list.length">，</text>
              </text>
            </view>
          </u-form-item>
        </u-form>

        <div
          @click="delDetail(i)"
          v-if="formData.detail.length > 1"
          class="detail-close iconfont icon-close"
        ></div>
      </view>
    </view>

    <u-popup
      :show="showAddress"
      :safeAreaInsetBottom="false"
      @close="showAddress = false"
      mode="center"
      round="10px"
    >
      <scroll-view scroll-y class="address-popup">
        <view v-for="(item, i) in pageData.province_list" :key="i">
          <div class="address-item">
            <view @click="switchZhankai(i)" class="color-666">
              <text
                v-if="!item.is_zhankai"
                class="iconfont icon-arrow-bottom font-50"
              ></text>
              <text v-else class="iconfont icon-arrow-right font-50"></text>
            </view>

            <view>
              <text>{{ item.name }}</text>
            </view>

            <view @click="checkItem(item, 'all')" class="color-666">
              <text
                v-if="!item.check"
                class="iconfont icon-xuanzekuangmoren font-50"
              ></text>
              <text
                v-else
                class="iconfont icon-success font-50 price-color"
              ></text>
            </view>
          </div>

          <!-- 市级 -->
          <view
            class="flex-wrap flex p-l-30"
            style="padding-left: 80rpx"
            v-if="item.is_zhankai"
          >
            <div
              v-for="(item1, i1) in item.city"
              @click="checkItem(item1, '', item)"
              :key="item1.id"
              class="address-item address-item_1"
            >
              <view>
                <text
                  v-if="!item1.check"
                  class="iconfont icon-xuanzekuangmoren font-50"
                ></text>
                <text
                  v-else
                  class="iconfont icon-success font-50 price-color"
                ></text>
              </view>

              <view>
                <text>{{ item1.name }}</text>
              </view>
            </div>
          </view>
        </view>
      </scroll-view>

      <view @click="addressSubmit" class="popup-bt">确定选择</view>
    </u-popup>

    <view @click="submitForm" class="popup-bt">提交</view>
  </view>
</template>
<script>
const detailItem = function () {
  return {
    frist: 1000, //首重
    frist_price: 0, //首费
    second: 1000, //续重
    second_price: 0, //续费
    // 选中城市
    province_list: [],
  };
};
export default {
  data() {
    return {
      id: '',
      mch_id: 0,
      pageData: '',
      showAddress: false,
      checkIndex: 0, //当前选中的索引
      formData: {
        name: '',
        type: 1,
        detail: [detailItem()],
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入模板名称',
            trigger: ['blur', 'change'],
          },
        ],
      },
    };
  },
  onLoad(params) {
    this.mch_id = params.mch_id;
    this.id = params.id;
    this.getInfo();
  },

  onShow() {},
  methods: {
    async getInfo() {
      const res = await this.$requestAll.mch.postageRulesInfo({
        mch_id: this.mch_id,
        id: this.id,
      });
      this.pageData = res.data;

      // 如果表单内容为真赋值表单参数
      if (res.data.model) {
        this.formData = Object.assign(res.data.model, {
          detail: JSON.parse(res.data.model.detail),
        });
      }

      this.$nextTick(() => {
        console.log(this.$refs);
        this.$refs['form1'].setRules(this.rules);
        // this.$refs['detailItem0'][0].setRules(this.itemRules);
      });
    },
    addDetail() {
      this.formData.detail.push(detailItem());
      // this.$nextTick(() => {
      //   this.$refs[
      //     'detailItem' + (this.formData.detail.length - 1)
      //   ][0].setRules(this.itemRules);
      // });
    },
    delDetail(i) {
      this.formData.detail.splice(i, 1);
    },
    // 地址选择弹框显示
    showAddressPopup(index) {
      uni.showLoading({
        title: '',
        mask: true,
      });
      this.pageData.province_list.forEach(item => {
        if (item.city.length) {
          // 判断是否已有选中地区 给与已选中的为true
          if (this.formData.detail[index].province_list.length) {
            // 循环市级列表
            item.city.forEach(item1 => {
              // 判断已选中是否有当前市级，给与选中
              item1.check = this.formData.detail[index].province_list.some(
                item2 => item2.id == item1.id
              );
            });

            // 判断当前省内所有市级是否全部选中，给与省份选中
            item.check = item.city.every(item2 => item2.check);
          }
          // 如果没有默认设置选中状态false
          else {
            item.city.forEach(item1 => {
              item1.check = false;
            });
            item.check = false;
          }
        }
      });
      this.checkIndex = index;
      uni.hideLoading();
      this.showAddress = true;
    },
    // 展开市级
    switchZhankai(i) {
      let item = this.pageData.province_list[i];
      item.is_zhankai = !item.is_zhankai;
      this.$set(this.pageData.province_list, i, item);
    },
    // 选择城市
    checkItem(item, type, itemAll) {
      if (type == 'all') {
        item.city = item.city.map(cityItem => {
          cityItem.check = !item.check;
          return cityItem;
        });
        item.check = !item.check;
      } else {
        item.check = !item.check;
        itemAll.check = itemAll.city.every(item => item.check);
      }
      this.$forceUpdate();
    },
    addressSubmit() {
      let checkAll = this.filterCity(this.pageData.province_list);
      this.formData.detail[this.checkIndex].province_list = JSON.parse(
        JSON.stringify(checkAll)
      );
      this.showAddress = false;
    },
    // 获取选中城市
    filterCity(all) {
      let resultAll = [];
      all.forEach(item => {
        if (item.check) {
          resultAll.push(...item.city);
        } else {
          let fAll = item.city.filter(item1 => item1.check);
          resultAll.push(...fAll);
        }
      });
      return resultAll;
    },
    // 表单提交
    submitForm() {
      // 验证大表单
      this.$refs['form1'].validate().then(async () => {
        // 验证小表单
        try {
          for (let i = 0; i < this.formData.detail.length; i++) {
            const item = this.formData.detail[i];
            if (!String(item.frist)) {
              throw [{ message: '请输入首重' }];
            } else if (!String(item.frist_price)) {
              throw [{ message: '请输入首费' }];
            } else if (!String(item.second)) {
              throw [{ message: '请输入续重' }];
            } else if (!String(item.second_price)) {
              throw [{ message: '请输入续费' }];
            } else if (!item.province_list.length) {
              throw [{ message: '请选择至少一个市级' }];
            }
          }

          console.log('表单验证通过');

          let formData = {
            ...this.formData,
            detail: JSON.stringify(this.formData.detail),
            id: this.id,
            mch_id: this.mch_id,
          };
          await this.$requestAll.mch.postageRulesEdit(formData, true);
          uni.showModal({
            title: '提示',
            content: '提交成功',
            showCancel: false,
            success: ({ confirm, cancel }) => {
              confirm && this.$utils.backTo();
            },
          });
        } catch (error) {
          console.log(error, 'error');
          uni.$u.toast(error[0].message);
        }
      });
    },
  },
  computed: {},
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
  /deep/.u-radio {
    margin-right: 20rpx;
  }
  /deep/.u-line {
    transform: initial;
    border-color: #e5e5e5 !important;
    margin-top: 0!important;
  }
  /deep/.u-form-item__body {
    min-height: 100rpx;
  }

  .add-item {
    width: 200rpx;
    border-radius: 26rpx;
    border: 1px solid rgb(27, 27, 202);
    margin: 0 auto;
    margin-bottom: 20rpx;

    text-align: center;
    line-height: 50rpx;
    font-size: 24rpx;
    color: rgb(27, 27, 202);
  }
  .detail-item {
    border: 1px solid red;
    position: relative;
    border-radius: 20rpx;
    margin-bottom: 20rpx;

    .detail-close {
      position: absolute;
      right: 10rpx;
      top: 10rpx;
      z-index: 999;
      width: 40rpx;
      height: 40rpx;
      background: red;
      border-radius: 50%;

      text-align: center;
      line-height: 40rpx;
      color: #fff;
    }
  }

  .address-popup {
    padding: 20rpx 0;
    width: 90vw;
    height: 60vh;

    .address-item {
      display: flex;
      justify-content: space-between;
      align-items: center;

      font-size: 32rpx;
      padding: 0 30rpx;
    }

    .address-item_1 {
      padding: 0;
      margin-right: 20rpx;
    }
  }

  .popup-bt {
    margin: 20rpx auto;
    width: 80%;
    background: #ed2a07;
    line-height: 80rpx;
    border-radius: 40rpx;

    text-align: center;
    color: #fff;
    font-size: 32rpx;
  }
}
</style>

<template>
  <view @click.stop="onShowPicker">
    <u-picker
      :show="show"
      :columns="columns"
      ref="uPicker"
      keyName="name"
      @cancel="show = false"
      @change="changeHandler"
      @confirm="confirmHandler"
    >
    </u-picker>
    <slot>
      <div  :style="{
        color: textColor,
        fontSize: textFontSize,
      }">{{address}}</div>
    </slot>
  </view>
</template>

<script>
var addressList = [];
export default {
  props: {
    // 地区列表
    addressList: {
      type: Array,
      default() {
        return [];
      },
    },
    // 地区列表插入全国
    isWholeCountry: {
      type: Boolean,
      default: false,
    },
    // 显示列数
    num: {
      type: Number,
      default: 3,
    },
    // 默认选中索引
    defaultIndexs: {
      type: Array,
      default() {
        return [0, 0, 0];
      },
    },
    textColor: {
      type: String,
      default: '#666'
    },
    textFontSize: {
      type: [String],
      default: '28rpx'
    }
  },
  data() {
    return {
      show: false,
      checkArr: [],
      columns: [],
    };
  },
  created() {
    this.getAddressList();
  },

  computed: {
    address() {
      if (!this.checkArr.length) return '请选择地区';
      return this.checkArr.map(item => item.name).join(' ');
    },
  },
  watch: {},
  methods: {
    async getAddressList() {
      if (this.addressList && this.addressList.length) {
        addressList = this.addressList;
      } else {
        const res1 = await this.$requestAll.default.district({});
        if (this.isWholeCountry) {
          addressList = [
            {
              id: '100001',
              name: '全国',
              list: [
                {
                  id: '100001',
                  name: '全国',
                  list: [
                    {
                      id: '100001',
                      name: '全国',
                    },
                  ],
                },
              ],
            },
            ...res1.data,
          ];
        } else {
          addressList = res1.data;
        }

        if (!addressList.length) return (this.columns = []);
        if (this.num == 3) {
          this.columns = [
            addressList,
            addressList[0].list,
            addressList[0].list[0].list,
          ];
        } else if (this.num == 2) {
          this.columns = [addressList, addressList[0].list];
        }
      }
    },
    onShowPicker() {
      this.show = true;
    },
    changeHandler(e) {
      const {
        columnIndex,
        indexs,
        // 微信小程序无法将picker实例传出来，只能通过ref操作
        picker = this.$refs.uPicker,
      } = e;
      // // 当第一列值发生变化时，变化第二列(后一列)对应的选项
      if (columnIndex === 0) {
        // picker为选择器this实例，变化第二列对应的选项
        picker.setColumnValues(1, addressList[indexs[0]].list);
        this.num == 3 &&
          picker.setColumnValues(
            2,
            addressList[indexs[0]].list[indexs[1]].list
          );
      } else if (columnIndex == 1) {
        // picker为选择器this实例，变化第二列对应的选项
        this.num == 3 &&
          picker.setColumnValues(
            2,
            addressList[indexs[0]].list[indexs[1]].list
          );
      }
    },
    confirmHandler(e) {
      // console.log(e);
      this.checkArr = e.value;
      this.show = false;
      this.$emit('update:valueChange', e.value);
      this.$emit('onChange', e.value);
    },
  },
};
</script>

<style></style>

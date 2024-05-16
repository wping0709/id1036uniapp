<template>
  <view class="body">
    <u-form :model="form" ref="uForm" labelWidth="130rpx">
      <u-form-item
        @click="pickerShow = 'parent_id'"
        required
        label="父级分类"
        prop=""
        borderBottom
      >
        <u-picker
          ref="parent_id"
          :show="pickerShow == 'parent_id'"
          :columns="[catList]"
          keyName="name"
          @cancel="pickerShow = false"
          @confirm="pickerConfirm"
        ></u-picker>
        <view class="color-999 flex-x-end">
          <text>{{ form.parent_id.id > 1 ? form.parent_id.name : '无' }}</text>
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </u-form-item>

      <u-form-item required label="分类名称" borderBottom>
        <view>
          <u-input
            v-model.trim="form.name"
            placeholder="请输入"
            border="none"
          ></u-input>
        </view>
      </u-form-item>

      <u-form-item label="排序" borderBottom>
        <view>
          <u-input
            v-model.number="form.sort"
            type="number"
            placeholder="请输入"
            border="none"
          ></u-input>
        </view>
      </u-form-item>

      <u-form-item label="分类图标" prop="">
        <view>
          <Upload
            type="image"
            width="200rpx"
            height="200rpx"
            :fileList.sync="form.icon"
          ></Upload>
        </view>
      </u-form-item>
    </u-form>

    <div class="submit" @click="submit">保存</div>
  </view>
</template>
<script>
import Upload from '@/components/Upload';
export default {
  components: {
    Upload,
  },
  data() {
    return {
      id: '',
      mch_id: '',
      form: {
        name: '',
        sort: '',
        parent_id: {
          id: 0,
          name: '无',
        },
        icon: [],
      },

      catList: [],
      pickerShow: false,
      page: 1,
      status: 'loadmore',
    };
  },
  onLoad(params) {
    if (params.id) {
      this.id = params.id;
      uni.setNavigationBarTitle({
        title: '编辑分类',
      });
    }

    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      await this.getCatList();
      if (this.id) this.getCatDetail();
    },
    // 获取分类列表
    async getCatList() {
      var res = await this.$requestAll.mch.getCat({}, true);
      // 如果是编辑查找当前父分类 用于选择展示
      var catList;
      if (this.id) {
        catList = res.data.list.filter(item => item.id != this.id);
      } else {
        catList = res.data.list;
      }

      this.catList = [{ id: 0, name: '无' }, ...catList];
      this.mch_id = res.data.mch_id;
    },
    // 获取分类详情
    async getCatDetail() {
      const res = await this.$requestAll.mch.getCatDetail(
        { id: this.id },
        true
      );
      this.form = {
        name: res.data.name,
        sort: res.data.sort,
        icon: res.data.icon && [{ url: res.data.icon }],
      };
      if (res.data.parent_id < 1) {
        this.form.parent_id = this.$options.data().form.parent_id;
      } else {
        this.form.parent_id = this.catList.filter(
          item => item.id == res.data.parent_id
        )[0];
      }
    },
    pickerConfirm(e) {
      console.log(e);
      const { value } = e;
      this.form.parent_id = value[0];
      this.pickerShow = false;
    },
    async submit() {
      if (!this.form.name) return uni.$u.toast('分类名称不能为空');
      var formData = {
        ...this.form,
        parent_id: this.form.parent_id.id,
        icon: this.form.icon[0]?.url || '',
        mch_id: this.mch_id,
      };
      console.log(formData);
      const res = await this.$requestAll.mch.catEdit(
        {
          form: JSON.stringify(formData),
          id: this.id,
        },
        true
      );
      uni.$u.toast(res.msg);
      this.$utils.backTo();
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
  /deep/.u-form {
    .u-form-item__body {
      padding: 20rpx 30rpx;
      min-height: 100rpx;
      background: #fff;
    }
    .u-line {
      border-color: #ccc;
    }
  }

  .submit {
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    width: 702rpx;
    margin: 80rpx 24rpx;
    font-size: 28rpx;
    color: #fff;
    background-color: #446dfd;
    border-radius: 40rpx;
  }
}
</style>

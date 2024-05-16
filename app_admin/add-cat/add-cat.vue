<template>
  <view class="body">
    <u-form :model="form" ref="uForm" labelWidth="initial">
      <u-form-item
        @click="pickerShow = 'choose_cat_id'"
        required
        label="父级分类"
        prop=""
        borderBottom
      >
        <u-picker
          ref="choose_cat_id"
          :show="pickerShow == 'choose_cat_id'"
          :columns="[catList]"
          keyName="name"
          @cancel="pickerShow = false"
          @confirm="pickerConfirm($event, 'choose_cat_id')"
        ></u-picker>
        <view class="color-999 flex-x-end">
          <text>{{
            form.choose_cat_id.id > 1 ? form.choose_cat_id.name : '无'
          }}</text>
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
            :fileList.sync="form.pic_url"
          ></Upload>
        </view>
      </u-form-item>
      <u-form-item label="分类大图" prop="">
        <view>
          <Upload
            type="image"
            width="200rpx"
            height="200rpx"
            :fileList.sync="form.advert_pic"
          ></Upload>
        </view>
      </u-form-item>
      <u-form-item label="分类广告" prop="">
        <view>
          <Upload
            type="image"
            width="200rpx"
            height="200rpx"
            :fileList.sync="form.big_pic_url"
          ></Upload>
        </view>
      </u-form-item>

      <u-form-item
        @click="pickerShow = 'choose_link_value'"
        required
        label="分类广告链接"
        prop=""
        borderBottom
      >
        <u-picker
          ref="choose_link_value"
          :show="pickerShow == 'choose_link_value'"
          :columns="[pickLink]"
          keyName="name"
          @cancel="pickerShow = false"
          @confirm="pickerConfirm($event, 'choose_link_value')"
        ></u-picker>
        <view class="color-999 flex-x-end">
          <text>{{
            form.choose_link_value.link ? form.choose_link_value.name : '无'
          }}</text>
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </u-form-item>

      <u-form-item label="显示" borderBottom>
        <view class="flex-x-end">
          <u-switch v-model="form.is_show"></u-switch>
        </view>
      </u-form-item>
    </u-form>

    <div class="submit" @click="submit">{{ id ? '保存修改' : '保存' }}</div>
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
      detail: '',
      id: '',
      form: {
        name: '', //名称
        sort: '', //排序
        choose_cat_id: {
          id: 0,
          name: '无',
        }, //分类父级
        choose_link_value: {
          id: 0,
          name: '无',
        }, //广告信息
        pic_url: [], //分类图标
        advert_pic: [], //分类大图
        big_pic_url: [], //广告图
        is_show: false,
      },

      catList: [],
      pickLink: [],
      pickerShow: false,
    };
  },
  onLoad(params) {
    if (params.id) {
      this.id = params.id;
      uni.setNavigationBarTitle({ title: '编辑分类' });
    }
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      if (this.id) {
        await this.getDetail();
      }
      await this.getCatList();
      await this.getPickLink();
    },
    async getDetail() {
      var formData = { id: this.id };
      const { data } = await this.$requestAll.admin.catEdit(formData, true);
      this.detail = data;
      this.form = Object.assign(this.form, {
        pic_url: data.pic_url && [{ type: 'image', url: data.pic_url }],
        advert_pic: data.advert_pic && [
          { type: 'image', url: data.advert_pic },
        ],
        big_pic_url: data.big_pic_url && [
          { type: 'image', url: data.big_pic_url },
        ],
        sort: data.sort,
        name: data.name,
        is_show: Boolean(data.is_show),
      });
    },
    async getCatList() {
      const { data } = await this.$requestAll.admin.getCat({}, true);

      var catList = data.list;
      // 如果是编辑查找当前父分类 用于选择展示
      if (this.id) {
        this.form.choose_cat_id = catList.find(
          item => item.id == this.detail.parent_id
        );
        catList = catList.filter(item => item.id != this.id);
      }
      this.catList = catList;
    },
    async getPickLink() {
      const { data } = await this.$requestAll.admin.pickLink({}, true);
      this.pickLink = JSON.parse(data.list);

      // 如果是编辑查找当前父分类 用于选择展示
      if (this.id && this.detail.advert_url) {
        this.form.choose_link_value = this.pickLink.find(
          item => item.link == this.detail.advert_url
        );
      }
    },

    pickerConfirm(e, key) {
      console.log(e);
      const { value } = e;
      this.form[key] = value[0];
      this.pickerShow = false;
    },
    async submit() {
      var form = JSON.parse(JSON.stringify(this.form));
      var formData = {
        ...form,
        choose_cat_id: form.choose_cat_id.id,
        choose_link_value: form.choose_link_value.link,
        pic_url: form.pic_url[0]?.url || '',
        advert_pic: form.advert_pic[0]?.url || '',
        big_pic_url: form.big_pic_url[0]?.url || '',
        big_pic_url: form.big_pic_url[0]?.url || '',
        is_show: Number(form.is_show),
      };
      const { msg } = await this.$requestAll.admin.catEditPost(
        { form: JSON.stringify(formData), id: this.id },
        true
      );
      uni.showModal({
        title: '提示',
        content: msg,
        showCancel: false,
        success: ({ confirm, cancel }) => {
          confirm && this.$utils.backTo()
        }
      })
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
  /* #ifdef H5 */
  min-height: calc(100vh - 44px);
  /* #endif */
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

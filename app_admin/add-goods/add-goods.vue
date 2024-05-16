<template>
  <view class="body">
    <u-form
      ref="uForm"
      labelWidth="initial"
      :rules="rules"
      :model="form"
      errorType="toast"
    >
      <div class="form-title">基本信息</div>
      <u-form-item required label="商品图片" borderBottom>
        <Upload
          type="image"
          width="160rpx"
          height="160rpx"
          maxCount="9"
          uploadText="商品图片\n(最多9张)"
          :fileList.sync="form.pic_url"
        ></Upload>
      </u-form-item>
      <u-form-item label="商品视频" borderBottom>
        <Upload
          type="video"
          width="160rpx"
          height="160rpx"
          uploadUrl="/default/upload-video"
          uploadText="上传视频"
          :fileList.sync="formVideo"
        ></Upload>
      </u-form-item>

      <u-form-item required label="商品名称" prop="name" borderBottom>
        <u-input
          v-model="form.name"
          placeholder="请输入"
          border="none"
          :adjustPosition="true"
        ></u-input>
      </u-form-item>

      <u-form-item
        @click="pickerShow = 'cats'"
        required
        label="商品分类"
        prop="cats"
        borderBottom
      >
        <u-picker
          ref="cats"
          :show="pickerShow == 'cats'"
          @cancel="pickerShow = false"
          @change="changeHandler($event, 'cats', 'cat')"
          @confirm="pickerConfirm($event, 'cats')"
          :columns="cpCatList(catList)"
          keyName="name"
        ></u-picker>
        <view class="color-999 flex-x-end">
          <text>{{ form.cats ? form.cats.name : "请选择" }}</text>
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </u-form-item>

      <u-form-item
        v-if="mch_id"
        @click="pickerShow = 'mchCats'"
        label="多商户分类"
        borderBottom
      >
        <u-picker
          ref="mchCats"
          :show="pickerShow == 'mchCats'"
          @cancel="pickerShow = false"
          @confirm="pickerConfirm($event, 'mchCats')"
          @change="changeHandler($event, 'mchCats', 'cat')"
          :columns="cpCatList(mchCatList)"
          keyName="name"
        ></u-picker>
        <view class="color-999 flex-x-end">
          <text>{{ form.mchCats ? form.mchCats.name : "请选择" }}</text>
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </u-form-item>

      <u-form-item required label="单位" prop="unit" borderBottom>
        <u-input
          v-model="form.unit"
          placeholder="请输入"
          border="none"
        ></u-input>
      </u-form-item>

      <u-form-item label="商品排序" borderBottom>
        <u-input
          v-model="form.sort"
          placeholder="请输入"
          border="none"
        ></u-input>
      </u-form-item>

      <div class="form-title">价格、规格、库存</div>
      <u-form-item required label="成本价" prop="cost_price" borderBottom>
        <u-input v-model="form.cost_price" placeholder="请输入" border="none">
          <view slot="suffix">￥</view>
        </u-input>
      </u-form-item>

      <u-form-item required label="原价" prop="original_price" borderBottom>
        <u-input
          v-model="form.original_price"
          placeholder="请输入"
          border="none"
        >
          <view slot="suffix">￥</view>
        </u-input>
      </u-form-item>

      <u-form-item required label="售价" prop="price" borderBottom>
        <u-input v-model="form.price" placeholder="请输入" border="none">
          <view slot="suffix">￥</view>
        </u-input>
      </u-form-item>
      <u-form-item label="重量" borderBottom>
        <u-input v-model="form.weight" placeholder="请输入" border="none">
          <view slot="suffix">克</view>
        </u-input>
      </u-form-item>
      <u-form-item label="货号" borderBottom>
        <u-input v-model="form.goods_no" placeholder="请输入" border="none">
          <div
            @click="onSaoyisao()"
            class="iconfont icon-saoyisao font-w-600 flex-y-center flex-x-center"
            style="width: 40rpx; height: 40rpx; font-size: 40rpx"
            slot="suffix"
          ></div>
        </u-input>
      </u-form-item>
      <u-form-item required label="库存" prop="goods_num" borderBottom>
        <u-input v-model="form.goods_num" placeholder="请输入" border="none">
        </u-input>
      </u-form-item>

      <view class="form-item">
        <view @click="form.use_attr = 1" v-if="!form.use_attr" class="attr-bt">
          <text class="iconfont icon-add m-r-10"></text>
          <text>增加规格组</text>
        </view>
        <view v-else>
          <view class="flex-y-center">
            <view>规格组</view>
            <view class="flex-w-1 p-x-10">
              <u-input
                v-model="attrGroupValue"
                @confirm="addAttrGroup"
                placeholder="如：颜色，尺码，套餐"
                border="none"
              ></u-input>
            </view>
            <view class="flex-y-center">
              <text
                @click="form.use_attr = 0"
                class="iconfont icon-jian"
                style="color: red; font-size: 56rpx"
              ></text>
              <text
                @click="addAttrGroup"
                class="iconfont icon-add"
                style="color: skyblue; font-size: 56rpx"
              ></text>
            </view>
          </view>
          <view v-for="(group, i) in attr" :key="i">
            <view class="flex-y-center">
              <view>{{ group.attr_group_name }}</view>
              <view class="flex-w-1 p-x-10">
                <u-input
                  v-model="group.input"
                  @confirm="addAttrList(i)"
                  placeholder="如： 红色，黄色"
                  border="none"
                ></u-input>
              </view>
              <view class="flex-y-center">
                <text
                  @click="delAttrList(i)"
                  class="iconfont icon-jian"
                  style="color: red; font-size: 56rpx"
                ></text>
                <text
                  @click="addAttrList(i)"
                  class="iconfont icon-add"
                  style="color: skyblue; font-size: 56rpx"
                ></text>
              </view>
            </view>

            <view v-if="group.attr_list.length" class="p-y-20 attr-box">
              <view
                v-for="(attr1, i2) in group.attr_list"
                :key="i2"
                class="attr-item"
              >
                <text>{{ attr1.attr_name }}</text>
                <text v-if="i2 < group.attr_list.length - 1">，</text>
                <text
                  @click="delAttr(i, i2)"
                  class="iconfont icon-jian"
                  style="color: red; font-size: 56rpx"
                ></text>
              </view>
            </view>
          </view>

          <view class="attr-form" v-for="(item, i) in form.attr" :key="i">
            <view class="flex-y-center form-item">
              <view class="form-label">规格组</view>
              <view class="flex-w-1 p-20">
                <text v-for="(attr1, i2) in item.attr_list" :key="i2">
                  <text>{{ attr1.attr_name }}</text>
                  <text v-if="i2 < item.attr_list.length - 1">，</text>
                </text>
              </view>
            </view>
            <u-line color="#ccc"></u-line>

            <view class="flex-y-center form-item">
              <view class="form-label">价格</view>
              <view class="flex-w-1">
                <u-input
                  v-model="item.price"
                  placeholder="请输入"
                  border="none"
                >
                  <view slot="suffix">￥</view>
                </u-input>
              </view>
            </view>
            <u-line color="#ccc"></u-line>
            <view class="flex-y-center form-item">
              <view class="form-label">库存</view>
              <view class="flex-w-1">
                <u-input
                  v-model="item.num"
                  placeholder="请输入"
                  border="none"
                ></u-input>
              </view>
            </view>
            <u-line color="#ccc"></u-line>
            <view class="flex-y-center form-item">
              <view class="form-label">货号</view>
              <view class="flex-w-1">
                <u-input v-model="item.no" placeholder="请输入" border="none">
                  <div
                    @click="onSaoyisao(item)"
                    class="iconfont icon-saoyisao font-w-600 flex-y-center flex-x-center"
                    style="width: 40rpx; height: 40rpx; font-size: 40rpx"
                    slot="suffix"
                  ></div>
                </u-input>
              </view>
            </view>
          </view>
        </view>
      </view>

      <div class="form-title">运费、包邮、限购</div>
      <u-form-item @click="pickerShow = 'yunfei'" label="运费设置" borderBottom>
        <u-picker
          :show="pickerShow == 'yunfei'"
          @cancel="pickerShow = false"
          @confirm="pickerConfirm($event, 'freight_id')"
          :columns="[postAgeList]"
          keyName="name"
        ></u-picker>
        <view class="color-999 flex-x-end">
          <text>{{ form.freight ? form.freight.name : "请选择" }}</text>
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </u-form-item>

      <u-form-item label="满件包邮" borderBottom>
        <u-input
          v-model="form.pieces"
          placeholder="请输入"
          border="none"
        ></u-input>
      </u-form-item>
      <div class="form-tip">如果设置0或空，则不支持满额包邮</div>

      <u-form-item label="限购" borderBottom>
        <u-input
          v-model="form.confine_count"
          placeholder="请输入"
          border="none"
        ></u-input>
      </u-form-item>
      <div class="form-tip">如果设置0或空，则不限购</div>

      <u-form-item
        @click="toGoodsDetail"
        required
        label="商品详情图"
        prop="detail"
        borderBottom
      >
        <view class="color-999 flex-x-end">
          <text>{{ form.detail ? "已添加" : "未添加" }}</text>
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </u-form-item>

      <u-form-item label="积分抵扣" borderBottom>
        <u-input
          v-model="form.forehead_integral"
          placeholder="请输入"
          border="none"
        ></u-input>
      </u-form-item>
      <div class="form-tip">
        如果不填或填0，则不支持积分抵扣，如果带%则为按成交价格的比例计算抵扣多少元。
      </div>

      <u-form-item label="服务内容">
        <u-input
          v-model="form.service"
          placeholder="请输入"
          border="none"
        ></u-input>
      </u-form-item>
      <div class="form-tip">
        例子：正品保障,极速发货,7天退换货。多个请使用英文逗号,分隔
      </div>
    </u-form>

    <div class="send" @click="submit">添加</div>
  </view>
</template>
<script>
import Upload from "@/components/Upload";
export default {
  components: {
    Upload,
  },
  data() {
    return {
      mch_id: "",
      id: "",
      catList: [],
      mchCatList: [],
      postAgeList: [], //运费模板
      pickerShow: false,
      attrGroupValue: "",
      attr: [],
      form: {
        use_attr: 0, // 是否开启规格组
        attr: [], //规格组数据
        pic_url: [], //商品图
        name: "", //商品名称
        unit: "件", //商品单位
        cats: "", //商品分类
        mchCats: -1, //多商户分类
        cost_price: "", //进价
        original_price: "", //原价
        price: "", //售价
        goods_num: "", //商品库存
        pieces: "", //满件包邮
        confine_count: "", //限购
        service: "", //服务
        freight_id: "", //运费模板id
        freight: "", //运费模板信息
        forehead_integral: "", //积分抵扣
        detail: "", //商品详情
        sort: 100, //商品排序
        // 以下为默认选项
        is_level: 0,
        video_url: "",
        individual_share: 0,
        cards: [],
        services: [],
        status: 0,
        virtual_sales: 0,
        cover_pic: "",
        accumulative: 1,
        member_price: {},
      },
      rules: {
        name: [
          {
            required: true,
            message: "请填写商品名称",
            trigger: ["blur", "change"],
          },
        ],
        cats: [
          {
            required: true,
            type: "object",
            message: "请选择商品分类",
            trigger: ["blur", "change"],
          },
        ],
        mchCats: [
          {
            required: true,
            message: "请选择多商户分类",
            trigger: ["blur", "change"],
          },
        ],
        unit: [
          {
            required: true,
            message: "请填写单位",
            trigger: ["blur", "change"],
          },
        ],
        cost_price: [
          {
            required: true,
            message: "请填写成本价",
            trigger: ["blur", "change"],
          },
        ],
        original_price: [
          {
            required: true,
            message: "请填写原价",
            trigger: ["blur", "change"],
          },
        ],
        price: [
          {
            required: true,
            message: "请填写售价",
            trigger: ["blur", "change"],
          },
        ],
        goods_num: [
          {
            required: true,
            message: "库存不能为空",
          },
        ],
        detail: [
          {
            required: true,
            message: "请填写商品详情图",
            trigger: ["change", "blur"],
          },
        ],
      },
    };
  },
  computed: {
    cpCatList() {
      return function (catList) {
        // 没有分类
        if (!catList.length) {
          return [];
        }
        // 没有二级分类
        else if (!catList[0].cat.length) {
          return [catList, [], []];
        }

        // 没有三级分类
        else if (!catList[0].cat[0]?.cat?.length) {
          return [catList, catList[0].cat, []];
        }
        return [catList, catList[0].cat, catList[0].cat[0].cat];
      };
    },
    formVideo: {
      get() {
        if (this.form.video_url) {
          return [
            {
              type: "video",
              url: this.form.video_url,
            },
          ];
        }
        return [];
      },
      set(val) {
        this.form.video_url = val[0].url;
      },
    },
  },
  onLoad(params) {
    this.mch_id = params.mch_id || 0;
    if (params.id) {
      this.id = params.id;
      uni.setNavigationBarTitle({ title: "编辑商品" });
    }
    this.loadData();
  },
  onShow() {
    this.form.detail = uni.getStorageSync("goodsDetailHtml");
    uni.removeStorageSync("goodsDetailHtml");
  },
  methods: {
    async loadData() {
      await this.getPostAge();
      this.id && this.getGoods();
      this.getCat();
      this.getMchCat();
    },
    // 获取商品详情
    async getGoods() {
      const res = await this.$requestAll.admin.getGoods(
        {
          id: this.id,
        },
        true
      );
      console.log(res);
      this.attr = JSON.parse(res.data.attr_group_list);
      this.form = res.data.goods;

      uni.setStorageSync("goodsDetailHtml", res.data.goods.detail);

      this.form.freight_id = res.data.goods.freight;
      // 判断是否默认规格获取货号参数
      res.data.goods.use_attr == 0 &&
        (this.form.goods_no = res.data.goods.attr[0].no);
      this.form.freight = this.postAgeList.filter(
        (item) => item.id == res.data.goods.freight
      )[0];
      this.form.confine_count = res.data.goods.confine_count || 0;
      // 商品分类
      this.form.cats = {
        id: res.data.cat_info.cat_id,
        name: res.data.cat_info.cat_name,
      };
      // 商家分类
      this.form.mchCats = {
        id: res.data.mch_cat_info.cat_id,
        name: res.data.mch_cat_info.cat_name,
      };
      // 积分抵扣
      this.form.forehead_integral = JSON.parse(
        res.data.goods.integral
      ).forehead;
      // 满件包邮
      let full_cut = JSON.parse(res.data.goods.full_cut);
      this.form.pieces = full_cut ? full_cut.pieces : "";
      // 商品图
      this.form.pic_url = res.data.goods_pic_list.map((item) => {
        return {
          url: item.pic_url,
        };
      });
    },
    // 获取商品分类
    async getCat() {
      const res = await this.$requestAll.admin.getGoodsCat(
        {
          mch_id: this.mch_id,
        },
        true
      );
      this.catList = res.data.list;
    },
    // 获取商户分类
    async getMchCat() {
      const res = await this.$requestAll.admin.getMchCat(
        {
          mch_id: this.mch_id,
        },
        true
      );
      this.mchCatList = res.data.list;
    },
    // 获取运费模板
    async getPostAge() {
      const res = await this.$requestAll.admin.postAge(
        {
          mch_id: this.mch_id,
        },
        true
      );
      if (!res.data.list.length)
        uni.showModal({
          title: "提示",
          content: "请先在后端配置运费模板",
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
              this.$utils.backTo();
            }
          },
        });
      this.postAgeList = res.data.list;
    },
    // 打开扫描二维码，扫描值
    async onSaoyisao(item) {
      const res = await this.$utils.scanCode();
      console.log(res);
      if (res.errMsg == "scanCode:ok") {
        console.log(res.result);
        if(!item) {
          this.form.goods_no = res.result;
        } else {
          item.no = res.result
        }
      } else {
        uni.$u.toast(res.errMsg);
      }
    },
    toGoodsDetail() {
      uni.setStorageSync("goodsDetailHtml", this.form.detail);
      this.$utils.toUrl("/app_admin/goods-detail/goods-detail");
    },
    addAttrGroup() {
      if (!this.attrGroupValue) return uni.$u.toast("请输入规格名称");
      this.attr.push({
        attr_group_name: this.attrGroupValue,
        attr_list: [],
      });
      this.attrGroupValue = "";
      this.changeSku();
    },
    addAttrList(i) {
      this.attr[i].attr_list.push({
        attr_group_name: this.attr[i].attr_group_name,
        attr_name: this.attr[i].input,
      });
      delete this.attr[i].input;
      this.changeSku();
    },
    delAttrList(i) {
      this.attr[i].attr_list = [];
      this.changeSku();
    },
    delAttr(i, i2) {
      console.log(123);
      this.attr[i].attr_list.splice(i2, 1);
      this.changeSku();
    },
    changeSku() {
      function forma_array(attr, data = []) {
        let attr_list = attr.attr_list;
        let rows = [];

        if (data.length == 0) {
          for (let i = 0; i < attr_list.length; i++) {
            let row = [];
            row.push({
              ...attr_list[i],
              attr_group_name: attr.attr_group_name || "",
              attr_group_id: 0,
            });
            rows.push(row);
          }
        } else {
          for (let j = 0; j < data.length; j++) {
            for (let i = 0; i < attr_list.length; i++) {
              let row = [...data[j]];
              row.push({
                ...attr_list[i],
                attr_group_name: attr.attr_group_name || "",
                attr_group_id: 0,
              });
              rows.push(row);
            }
          }
        }
        console.log(rows);
        return rows;
      }

      for (const key in this.attr) {
        const item = this.attr[key];
        if (item.attr_list.length) {
          var data = forma_array(item, data);
        }
      }
      let originalAttr = JSON.parse(JSON.stringify(this.form.attr));

      this.form.attr = data.map((item, i) => {
        // 查找原数据
        let val = originalAttr.find((v, i) => {
          return v.attr_list.every((v1, i1) => {
            return item.some(
              (v2) =>
                v2.attr_name == v1.attr_name &&
                v2.attr_group_name == v1.attr_group_name
            );
          });
        });
        // console.log(item, val);
        return {
          price: val ? val.price : "",
          num: val ? val.num : "",
          no: val ? val.no : "",
          attr_list: item,
        };
      });
    },
    changeHandler(e, ref, key) {
      console.log(e);
      const {
        columnIndex,
        indexs,
        values,
        // 微信小程序无法将picker实例传出来，只能通过ref操作
        picker = this.$refs[ref],
      } = e;
      let [i1, i2] = indexs;
      console.log(picker);
      if (!picker) return;
      // 当第一列值发生变化时，变化第二列(后一列)对应的选项
      if (columnIndex === 0) {
        // console.log(values[0][i1][key],'111111111');
        // picker为选择器this实例，变化第二列对应的选项
        picker.setColumnValues(1, values[0][i1][key] || []);

        picker.setColumnValues(
          2,
          (values[0][i1][key][i2] && values[0][i1][key][i2][key]) || []
        );
      } else if (columnIndex == 1) {
        picker.setColumnValues(
          2,
          (values[0][i1][key][i2] && values[0][i1][key][i2][key]) || []
        );
      }
    },
    pickerConfirm(e, key) {
      console.log(e);
      const { value } = e;
      if (key == "freight_id") {
        this.form[key] = value[0].id;
        this.form.freight = value[0];
      } else if (key == "cats" || key == "mchCats") {
        let newValue = value.filter((item) => item);
        console.log(newValue);
        this.form[key] = newValue[newValue.length - 1];
      }
      this.pickerShow = false;
    },
    async submit() {
      if (!this.form.pic_url.length) return uni.$u.toast("请上传商品图片");

      console.log(this.form);

      var formData = { ...this.form };
      formData.cats = [this.form.cats.id];
      formData.mchCats = [this.form.mchCats.id];
      formData.pic_url = this.form.pic_url.map((item) => {
        return {
          pic_url: item.url,
        };
      });

      console.log(formData);
      if (!this.mch_id && !this.id) formData.status = 1;

      this.$refs["uForm"].validate().then(async (r) => {
        const res = await this.$requestAll.admin.goodsEdit(
          {
            form: JSON.stringify({ ...formData, mch_id: this.mch_id }),
            id: this.id,
          },
          true
        );
        uni.showModal({
          title: "提示",
          content: res.msg,
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
              this.$utils.backTo();
            }
          },
        });
      });
    },
  },

  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  padding-bottom: env(safe-area-inset-bottom);
  background: #f5f5f5;

  // padding-bottom: env(safe-area-inset-bottom);
  /deep/.u-form-item__body__left {
    margin-right: 20rpx;
  }
  /deep/.u-input {
    padding: 10rpx 20rpx !important;
  }
  /deep/.u-form {
    text,
    view {
      font-size: 30rpx;
    }
    .u-line {
      border-color: #ccc;
      margin-top: 0 !important;
    }
    .u-form-item__body {
      background: #fff;
      min-height: 100rpx;
      padding: 10rpx 30rpx;
    }
  }
  .form-item {
    background: #fff;
    min-height: 100rpx;
    padding: 10rpx 30rpx;
  }
  .form-title {
    padding: 0 30rpx;
    line-height: 80rpx;
    background: #f5f5f5;
  }
  .form-tip {
    padding: 10rpx 30rpx;
    background: #f5f5f5;

    color: #999;
    font-size: 20rpx;
  }

  .attr-bt {
    margin: 0 auto;
    text-align: center;
    width: 230rpx;
    line-height: 2;
    border-radius: 30rpx;
    border: 1px solid skyblue;
    color: skyblue;
  }
}
.attr-box {
  display: flex;
  flex-wrap: wrap;
  .attr-item {
    position: relative;
    display: inline-block;
    font-size: 26rpx;
    color: #999;
    margin-bottom: 14rpx;
    margin-right: 36rpx;
    &:nth-last-child(1) {
      padding-right: 26rpx;
    }

    .icon-jian {
      position: absolute;
      right: 0;
      top: 0;
      z-index: 999;
      transform: translate(50%, -50%);
      width: 56rpx;
      height: 56rpx;
      line-height: 56rpx;
    }
  }
}

.attr-form {
  overflow: hidden;
  border: 1px solid #ccc;
  border-radius: 20rpx;
  margin-bottom: 20rpx;
}
.send {
  
  width: 702rpx;
  background-color: #446dfd;
  border-radius: 40rpx;
  margin: 80rpx 24rpx 0;

  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  font-size: 28rpx;
  color: #fff;
}
</style>

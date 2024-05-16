<template>
  <view class="body" v-if="!store.is_shenhe">
    <view @click="!posts_id && clickOrder()" v-if="type_id == 1" class="order">
      {{ order ? order.order_no : "选择所晒订单" }}
    </view>

    <view class="content">
      <u--textarea
        v-model="value"
        border="none"
        height="500rpx"
        placeholder="内容 跟邻居们说点什么"
      ></u--textarea>
    </view>

    <view class="upload-box">
      <Upload
        ref="Upload"
        :fileList.sync="fileList1"
        :type="upType"
        :uploadUrl="
          upType == 'video' ? '/default/upload-video' : '/default/upload-image'
        "
        :maxCount="upType == 'video' ? 1 : 9"
        :isSlot="true"
        width="200rpx"
        height="200rpx"
      >
        <view
          class="up-slot flex-y-center flex-x-center"
          @click.capture.stop="clickUpload"
        >
          <text class="iconfont icon-jia" style="font-size: 50rpx"></text>
        </view>
      </Upload>
    </view>

    <view @click="checkAddress" class="address color-666 u-line-1">
      <text class="iconfont icon-dingwei font-30"></text>
      <text>{{ address ? address.address : "请选择地理位置" }}</text>
    </view>

    <view class="upload"> </view>

    <div class="submit" @click="submit">发布</div>

    <u-popup :show="showPopup" @close="showPopup = false" mode="bottom">
      <div class="popup-box">
        <div class="popup-title">订单列表</div>
        <scroll-view scroll-y class="popup-content">
          <div
            v-for="(order, i) in orderList"
            :key="i"
            @click="selectOrder(order)"
            class="order-item"
          >
            <view>订单号：{{ order.order_no }}</view>
            <view>订单金额：{{ order.total_price }}</view>
            <view>订单商品：{{ order.goods_name }}</view>
          </div>
        </scroll-view>
      </div>
    </u-popup>
  </view>
  <q-shenhe v-else></q-shenhe>
</template>
<script>
import Upload from "@/components/Upload/index.vue";
import request from "@/utils/request";
export default {
  components: {
    Upload,
  },
  data() {
    return {
      orderList: "",
      order: "",
      address: "",
      type_id: "",
      id: 1,
      value: "",
      fileList1: [],
      upType: "",
      showPopup: false,
      posts_id: "",
    };
  },
  onLoad(param) {
    this.id = param.id;
    if (param.posts_id) {
      this.posts_id = param.posts_id;
      this.getPostsInfo();
    }
    this.isPower();
  },
  methods: {
    async getPostsInfo() {
      const res = await this.$requestAll.posts.getItem(
        { id: this.posts_id },
        true
      );
      this.value = res.data.content;
      // 地址信息处理
      if (res.data.address) {
        this.address = {
          address: res.data.address,
        };
      }

      // 图片
      if (res.data.pic_list_url) {
        this.upType = 'image'
        let pic_list_url = res.data.pic_list_url.split(",");
        this.fileList1 = pic_list_url.map((item) => {
          return {
            type: "image",
            url: item,
          };
        });
      }

      // 视频
      if(res.data.video_list_url) {
        this.upType = 'video'
        this.fileList1 = [{type: 'video',url: res.data.video_list_url,imgUrl: res.data.video_pic_list_url}]
      }

      if (res.data.order_id) {
        this.order = {
          order_no: res.data.order_no,
          id: res.data.order_id,
        };
      }
    },
    
    // 上传前选择上传类型
    clickUpload() {
      // 未选择上传类型

      if (!this.fileList1.length) {
		  uni.showModal({
		  	title:'提示',
			content:'是否允许系统打开设备相机?用于上传图片/视频',
			success: ({confirm,cancel}) => {
				if(confirm) {
					uni.showActionSheet({
					  itemList: ['视频', '图片'],
					  itemColor: '#333333',
					  success: res => {
					    this.upType = !res.tapIndex ? 'video' : 'image';
					    this.$nextTick(() => {
					      this.$refs['Upload'].clickUpload();
					    });
					  },
					});
				}
			}
		  })
    
      }
      // 已选择上传类型
      else {
        this.$refs['Upload'].clickUpload();
      }
    },
    async submit() {
      try {
        uni.showLoading({
          title: "发布中...",
        });
        if (this.type_id == "1" && !this.order)
          throw {
            msg: "请选择订单",
          };
        if (this.id == "1" && !this.content && !this.fileList1.length)
          throw {
            msg: "请填写内容或上传图片或视频",
          };
        var formData = {
          id: this.posts_id,
          type_id: this.type_id,
          cart_id: this.id,
          title: "",
          content: this.value,
          order_id: this.order.id || "",
          order_no: this.order.order_no || "",
          address: this.address.address || "",
          video_list_url: "",
          video_pic_list_url: "",
          pic_list: "",
          pic_list_url: "",
        };

        var urlArr = this.fileList1.map((item) => item.url);
        if (this.upType == "image") {
          formData.pic_list = urlArr.join(",");
          formData.pic_list_url = urlArr.join(",");
        } else {
          formData.video_list_url = urlArr[0];
          formData.video_pic_list_url = this.fileList1[0]?.imgUrl || ''
        }
        await this.$requestAll.posts.addPosts(formData);

        this.$utils.backTo();
      } catch (error) {
        console.log(error);
        uni.hideLoading();
        uni.$u.toast(error.msg || "服务器出错");
      }
    },
    // 新增图片
    async afterRead(event) {
      console.log("afterRead", event);
      this.upType = event.file[0].type;
      this[event.name] = this[event.name].concat(event.file);
    },
    deletePic(event) {
      console.log("deletePic", event);
      this[event.name].splice(event.index, 1);
      if (this[event.name].length <= 0) this.upType = "media";
    },
    async getOrderList() {
      const res = await this.$requestAll.posts.getOrder({}, true);
      this.orderList = res.data;
    },

    checkAddress() {
		uni.showModal({
			title:'提示',
			content:'是否允许系统获取您的位置信息?用于定位地址',
			success: ({confirm,cancel}) => {
				if(confirm) {
					uni.chooseLocation({
					  success: (res) => {
					    this.address = res;
					  },
					});
				}
			}
		})

    },
    selectOrder(order) {
      this.order = order;
      this.showPopup = false;
    },

    async clickOrder() {
      if (!this.orderList) {
        await this.getOrderList();
      }
      this.showPopup = true;
    },
    async isPower() {
      const res = await this.$requestAll.posts.isPower({
        cart_id: this.id,
      });
      this.type_id = res.posts_type;
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
  // background: #f5f5f5;
  padding: 20rpx;

  .order {
    line-height: 80rpx;
    border-bottom: 2rpx solid #f3f3f3;
  }

  .content {
    /deep/.u-textarea {
      padding-left: 0;
      padding-right: 0;
    }
  }

  .address {
    line-height: 80rpx;
    border: 2rpx solid #f3f3f3;
    border-left: 0 solid #000;
    border-right: 0 solid #000;
  }

  .submit {
    margin: 70rpx auto 0;
    border-radius: 40rpx;
    background: #ee3a3a;
    width: 80%;
    line-height: 80rpx;

    text-align: center;
    font-size: 32rpx;
    font-weight: 600;
    color: #fff;
  }

  .popup-box {
    padding: 0 20rpx;

    .popup-title {
      font-size: 32rpx;
      text-align: center;
      line-height: 80rpx;
      margin-bottom: 10rpx;
    }

    .popup-content {
      height: 60vh;

      .order-item {
        margin-bottom: 20rpx;
        padding: 20rpx;
        border-radius: 10rpx;
        background: #f3f3f3;
        color: #666;
      }
    }
  }
}

.up-slot {
  width: 200rpx;
  height: 200rpx;
  border: 1px solid #eee;
  border-radius: 20rpx;
}
</style>

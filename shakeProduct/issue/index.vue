<template>
  <view class="body">
    <view>
      <u-input v-model="title" placeholder="标题~" border="bottom"></u-input>
    </view>
    <view>
      <u-textarea
        v-model="textareaValue"
        maxlength="60"
        placeholder="请描述你想发布的内容~"
        border="none"
        height="250rpx"
        count
      ></u-textarea>
    </view>

    <view>
      <view v-if="type == 'video'" class="m-b-10">
        <Upload
          ref="Upload1"
          :fileList.sync="cover_pic"
          type="image"
          :maxCount="1"
          :isSlot="true"
          width="200rpx"
          height="200rpx"
        >
          <view class="up-slot flex-col flex-y-center flex-x-center">
            <view class="">
              <text
                class="iconfont icon-jia color-999"
                style="font-size: 50rpx"
              ></text>
            </view>
            <view class="font-24 color-999"> 封面图 </view>
          </view>
        </Upload>
      </view>
      <Upload
        ref="Upload"
        :fileList.sync="fileList"
        :type="type"
        :uploadUrl="uploadUrl"
        :maxCount="type == 'video' ? 1 : 9"
        :isSlot="true"
        width="200rpx"
        height="200rpx"
        @deletePic="type = ''"
      >
        <view
          class="up-slot flex-y-center flex-x-center"
          @click.stop="clickUpload"
        >
          <text
            class="iconfont icon-jia color-999"
            style="font-size: 50rpx"
          ></text>
        </view>
      </Upload>

      <view class="p-y-20 price-color font-24">
        上传视频需上传封面图，图片默认第一张为封面图。
      </view>
    </view>

    <!-- 地址 -->
    <view @click="showCart = 'cart'" class="menu-item flex-y-center">
      <div class="left flex-w-1 flex-y-center">
        <text class="iconfont icon-lianjie font-40"></text>
        <text>添加分类</text>
      </div>
      <div class="right flex-y-center">
        <text>{{ checkCart ? checkCart.name : "" }}</text>
        <text class="iconfont icon-arrow-right"></text>
      </div>
    </view>
    <u-picker
      :show="showCart == 'cart'"
      :columns="[cartList]"
      keyName="name"
      @confirm="pickerCofirm"
      @cancel="showCart = false"
    ></u-picker>

    <!-- 带货 -->
    <view
      @click="$utils.toUrl('/shakeProduct/commodity/index')"
      class="menu-item flex-y-center"
    >
      <div class="left flex-y-center">
        <text class="iconfont icon-shangpin font-40"></text>
        <text>添加商品</text>
      </div>
      <div class="right flex-w-1 flex-y-center">
        <scroll-view scroll-x class="m-x-20 flex-w-1">
          <div class="goods-list">
            <image
              v-for="(goods, i) in goods_list"
              :key="i"
              :src="goods.cover_pic"
              mode="aspectFill"
            />
          </div>
        </scroll-view>
        <view class="flex-y-center">
          <text>点击添加</text>
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </div>
    </view>

    <div class="bottom-fixed">
      <view>
        <div @click="$u.debounce(submit)" class="submit">发布</div>
      </view>
    </div>
  </view>
</template>
<script>
import Upload from "@/components/Upload";
import request from "@/utils/request";
export default {
  components: {
    Upload,
  },
  data() {
    return {
      showCart: false,
      title: "",
      pageData: "",
      cartList: "",
      checkCart: "",
      textareaValue: "",
      fileList: [],
      cover_pic: "",
      type: "image",
      topic: "",
      topic_id: "",
      goods: "",
      goods_list: [],
    };
  },
  onLoad(params) {
    this.loadData();
  },
  onShow() {
    // 选中商品
    let issue_goods = uni.getStorageSync("issue_goods");
    if (issue_goods) {
      this.goods_list = issue_goods;
      uni.removeStorageSync("issue_goods");
    }
  },
  methods: {
    async loadData() {
      this.getCartList();
    },
    async getCartList() {
      const res = await this.$requestAll.vgoods.cartList({}, true);
      this.cartList = res.data.list;
      this.checkCart = res.data.list[0] || "";
    },
    async getTopick() {
      const res = await this.$requestAll.weitao.addArticleView({
        topic_id: this.topic_id,
      });
      this.topic = res.data.topic;
    },

    // 上传服务器
    uploadFilePromise(url, type, file) {
      uni.showLoading({
        title: "上传中...",
        mask: true,
      });
      var uploadUrl =
        type == "video" ? "/default/upload-video" : "/default/upload-image";
      var obj = {};
      if (url) {
        obj = {
          filePath: url,
        };
      } else {
        obj = {
          file: file,
        };
      }
      return new Promise((resolve, reject) => {
        uni.uploadFile({
          url: request.API_URL() + uploadUrl, // 仅为示例，非真实的接口地址
          ...obj,
          name: type,
          formData: {},
          success: (res) => {
            console.log(res);
            res = JSON.parse(res.data);
            uni.hideLoading();
            if (res.code == 0) {
              resolve(res.data.url);
            } else {
              uni.$u.toast(res.msg || "上传失败");
              reject();
            }
          },
          fail: (err) => {
            uni.hideLoading();
            reject(err);
          },
        });
      });
    },

    // 上传
    clickUpload() {
      // 未选择上传类型
      if (!this.fileList.length) {
        uni.showActionSheet({
          itemList: ["视频", "图片"],
          itemColor: "#333333",
          success: (res) => {
            this.cover_pic = this.$options.data().cover_pic;

            switch (res.tapIndex) {
              case 0:
                this.type = "video";
                // #ifdef MP-WEIXIN
                uni.chooseMedia({
                  count: 1,
                  mediaType: ["video"],
                  success: async (res) => {
                    if (res.errMsg == "chooseMedia:ok") {
                      var { tempFilePath, thumbTempFilePath } =
                        res.tempFiles[0];
                      console.log(tempFilePath, thumbTempFilePath);
                      try {
                        const imgUrl = await this.uploadFilePromise(
                          thumbTempFilePath,
                          "image"
                        );
                        const videoUrl = await this.uploadFilePromise(
                          tempFilePath,
                          "video"
                        );
                        this.cover_pic = [{ type: "image", url: imgUrl }];
                        this.fileList = [{ type: "video", url: videoUrl }];
                      } catch (error) {
                        uni.showModal({
                          title: "上传出错",
                          contetn: JSON.stringify(error),
                        });
                      }
                    }
                  },
                  file: (res) => {},
                });
                // #endif
                // #ifndef MP-WEIXIN
                uni.chooseVideo({
                  success: async (res) => {
                    console.log(res);
                    var tempFilePaths = res.tempFilePath;
                    try {
                      const videoUrl = await this.uploadFilePromise(
                        tempFilePaths,
                        "video"
                      );
                      this.fileList = [{ type: "video", url: videoUrl }];
                      // #ifndef APP-PLUS
                      const imgUrl = await this.getVideoPoster(
                        res.tempFilePath,
                        res.width,
                        res.height
                      );
                      this.cover_pic = [{ type: "video", url: imgUrl }];
                      // #endif
                    } catch (error) {
                      uni.showModal({
                        title: "上传出错",
                        content: JSON.stringify(error),
                      });
                    }
                  },
                });
                // #endif
                break;

              default:
                this.type = "image";
                this.$nextTick(() => {
                  this.$refs["Upload"].clickUpload();
                });
                break;
            }
          },
        });
      }
      // 已选择上传类型
      else {
        this.$refs["Upload"].clickUpload();
      }
    },
    async submit() {
      if (!this.textareaValue) return uni.$u.toast("内容不能为空");
      if (!this.checkCart) return uni.$u.toast("请选择分类");
      if (this.type == "video" && !this.cover_pic.length)
        return uni.$u.toast("请上传封面图");
      var formData = {
        title: this.title,
        content: this.textareaValue,
        cart_id: this.checkCart.id,
        type: this.type == "video" ? 0 : 1,
      };

      this.goods_list.length &&
        (formData.goods_ids = JSON.stringify(
          this.goods_list.map((item) => item.id)
        ));

      if (this.type == "image") {
        formData.type = 1;
        formData.cover_pic = this.fileList.length && this.fileList[0].url;
        formData.pic_list_url = JSON.stringify(
          this.fileList.map((item) => {
            return { url: item.url };
          })
        );
      } else {
        formData.type = 0;
        formData.pic_list_url = "[]";
        formData.cover_pic = this.cover_pic[0].url;
        formData.video_list_url = JSON.stringify(
          this.fileList.map((item) => {
            return { url: item.url };
          })
        );
      }
      console.log(formData, "123123123123");
      const res = await this.$requestAll.vgoods.addVgoods(formData, true);
      uni.showModal({
        title: "提示",
        content: res.msg,
        showCancel: false,
        success: (res) => {
          res.confirm && this.$utils.toUrl("/shakeProduct/index/index");
        },
      });
    },
    pickerCofirm(e) {
      const { value } = e;
      if ((this.showCart = "cart")) {
        this.checkCart = value[0];
      }
      this.showCart = false;
    },
    // h5 canvas第一帧
    getVideoPoster(url, width, height) {
      return new Promise((resolve, reject) => {
        let video = document.createElement("video");
        video.setAttribute("crossOrigin", "Anonymous"); // 处理跨域，H5需后台支持，请求的视频资源响应投标需有Access-Control-Allow-Origin
        video.setAttribute("src", url);
        video.setAttribute("width", width);
        video.setAttribute("height", height);
        video.setAttribute("preload", "auto");
        // uni.chooseVideo选择视频，当选用手机拍摄的视频时，地址是相对地址，如 _doc/uniapp_temp_1650594368317/camera/1650594390147.mp4
        // 可播放，但是loadeddata一直不执行，会触发error事件，视频加载失败
        // 应先转换成本地地址
        video.addEventListener("loadeddata", async () => {
          // console.log("视频第一帧加载完");
          let canvas = document.createElement("canvas");
          let width = video.width; // canvas的尺寸和图片一样
          let height = video.height;
          canvas.width = width;
          canvas.height = height;
          canvas.getContext("2d").drawImage(video, 0, 0, width, height); // 绘制canvas
          const dataURL = canvas.toDataURL("image/jpeg"); // 转换为base64

          let arr = dataURL.split(",");
          let mime = arr[0].match(/:(.*?);/)[1]; //设置file文件流的type名称
          let suffix = mime.split("/")[1]; //设置file文件流的name名称
          const bstr = window.atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          let file = new File([u8arr], `image.${suffix}`, {
            type: mime,
          });
          const imgUrl = await this.uploadFilePromise("", "image", file);
          resolve(imgUrl);
        });

        video.addEventListener("error", (err) => {
          uni.$u.toast("截取第一帧加载失败");
          reject(err);
          console.log("截取第一帧加载失败", err);
        });
      });
    },
  },
  computed: {
    uploadUrl() {
      return this.type == "video"
        ? "/default/upload-video"
        : "/default/upload-image";
    },
  },
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  padding: 20rpx;
  min-height: 100vh;
}
.menu-item {
  height: 100rpx;
  border-bottom: 1px solid #eee;
  .tag {
    padding: 0 20rpx;
    border-radius: 25rpx;
    background: #f5f5f5;
    line-height: 50rpx;
    max-width: 200rpx;
    color: blue;
    > .u-line-1 {
      width: initial;
    }
  }
  .goods-list {
    white-space: nowrap;
    > image {
      display: inline-block;
      margin-right: 20rpx;
      width: 80rpx;
      height: 80rpx;
      border-radius: 10rpx;
      background: #f5f5f5;
    }
  }
}
.up-slot {
  width: 200rpx;
  height: 200rpx;
  border: 1px solid #eee;
  border-radius: 20rpx;
}

.bottom-fixed {
  height: 100rpx;
  height: calc(100rpx + env(safe-area-inset-bottom));
  > view {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding-bottom: env(safe-area-inset-bottom);
    height: 100rpx;
    height: calc(100rpx + env(safe-area-inset-bottom));

    .submit {
      margin: 10rpx auto;
      width: 90vw;
      line-height: 80rpx;
      border-radius: 40rpx;
      background: linear-gradient(to right, #ff4f18, red);
      text-align: center;
      font-size: 32rpx;
      color: #fff;
    }
  }
}
</style>

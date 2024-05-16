// uview uploade文档地址 https://www.uviewui.com/components/upload.html

<template>
  <u-upload
    ref="upload"
    :fileList="fileList1"
    @afterRead="afterRead"
    @delete="deletePic"
    :accept="type"
    :uploadText="uploadText"
    :width="width"
    :height="height"
    name="1"
    multiple
    :maxCount="maxCount"
    :previewFullImage="true"
  >
    <slot>
      <view
        v-if="!isSlot"
        :style="{
          width: width,
          height: height,
        }"
        class="flex-col flex-x-center flex-y-center default-style"
      >
        <u-icon name="camera" size="56rpx"></u-icon>
        <view v-if="uploadText" class="tip" style="white-space: pre-wrap">
          {{ uploadText }}
        </view>
      </view>
    </slot>
  </u-upload>
</template>

<script>
import request from "@/utils/request";
export default {
  props: {
    // all | media | image | file | video
    type: {
      type: String,
      default: "media",
    },
    // 图片数组绑定
    fileList: {
      type: [Array],
      defualt() {
        return [];
      },
    },
    // 上传地址   //默认为上传图片地址
    uploadUrl: {
      type: String,
      default: "/default/upload-image",
    },
    // 上传区域提示文字
    uploadText: {
      type: String,
      default: "",
    },
    // 最多上传数量
    maxCount: {
      type: [String, Number],
      default: 1,
    },
    // 自定义上传样式
    isSlot: {
      type: Boolean,
      default: false,
    },
    // 显示上传图片的宽
    width: {
      type: [String, Number],
      default: "80px",
    },
    // 显示上传图片的高
    height: {
      type: [String, Number],
      default: "80px",
    },
  },
  data() {
    return {
      fileList1: [],
    };
  },
  watch: {
    // 传递数据赋值给当前组件
    fileList: {
      handler(val) {
        val && (this.fileList1 = val);
      },
      immediate: true,
      deep: true,
    },
    // 当前上传文件发生变化更改父组件数据
    // fileList1: {
    //   handler(val, ovl) {
    //     return this.$emit('update:fileList', val);
    //   },
    //   deep: true,
    // },
  },
  methods: {
    // 删除图片
    deletePic(event) {
      this.fileList1.splice(event.index, 1);
      this.$emit("deletePic", event);
      this.$emit("update:fileList", this.fileList1);
      this.$emit("change", this.fileList1);
    },
    // 新增图片
    async afterRead(event) {
      console.log(event);
      // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
      let lists = [].concat(event.file);
      let fileListLen = this.fileList1.length;
      lists.map((item) => {
        this.fileList1.push({
          ...item,
          status: "uploading",
          message: "上传中",
        });
      });
      for (let i = 0; i < lists.length; i++) {
        try {
          const url = await this.uploadFilePromise(lists[i].url, lists[i].type);
          let item = this.fileList1[fileListLen];
          this.fileList1.splice(
            fileListLen,
            1,
            Object.assign(item, {
              status: "success",
              message: "",
              url: url,
            })
          );
          fileListLen++;
        } catch (error) {
          this.fileList1.splice(fileListLen, 1);
        }
      }
      this.$emit("update:fileList", this.fileList1);
      this.$emit("change", this.fileList1);
    },

    // 上传服务器
    uploadFilePromise(url, type) {
      let uploadUrl =
        type == "video" ? "/default/upload-video" : "/default/upload-image";
      // var obj = {};
      // if (url) {
      //   obj = {
      //     filePath: url,
      //   };
      // } else {
      //   obj = {
      //     file: file,
      //   };
      // }
      return new Promise((resolve, reject) => {
        uni.uploadFile({
          url: request.API_URL() + uploadUrl, // 仅为示例，非真实的接口地址
          filePath: url,
          name: type,
          formData: {},
          success: (res) => {
            res = JSON.parse(res.data);
            if (res.code == 0) {
              resolve(res.data.url);
            } else {
              uni.$u.toast(res.msg || "上传失败");
              reject();
            }
          },
        });
      });
    },
    // 手动触发上传事件
    clickUpload() {
      console.log("上传拦截处理视频第一帧");
      if (this.type == "video") {
        // 使用微信默认api获取视频第一帧
        // #ifdef MP-WEIXIN
        uni.chooseMedia({
          count: 1,
          mediaType: ["video"],
          success: async (res) => {
            console.log(res);
            if (res.errMsg == "chooseMedia:ok") {
              var { tempFilePath, thumbTempFilePath } = res.tempFiles[0];
              console.log(tempFilePath, thumbTempFilePath);
              const imgUrl = await this.uploadFilePromise_custom(
                thumbTempFilePath,
                "image"
              );
              const videoUrl = await this.uploadFilePromise_custom(
                tempFilePath,
                "video"
              );
              this.fileList1.push({
                type: "video",
                url: videoUrl,
                imgUrl: imgUrl,
              });
              this.$emit("update:fileList", this.fileList1);
              this.$emit("change", this.fileList1);
            }
          },
          file: (res) => {
            console.log(res);
            uni.hideLoading();
          },
        });
        // #endif

        // 当前主要处理h5获取第一帧
        // #ifndef MP-WEIXIN
        uni.chooseVideo({
          success: async (res) => {
            console.log(res);
            var tempFilePaths = res.tempFilePath;
            const videoUrl = await this.uploadFilePromise_custom(
              tempFilePaths,
              "video"
            );
            const imgUrl = await this.getVideoPoster(
              res.tempFilePath,
              res.width,
              res.height
            );
            this.fileList1.push({
              type: "video",
              url: videoUrl,
              imgUrl: imgUrl,
            });
            this.$emit("update:fileList", this.fileList1);
            this.$emit("change", this.fileList1);
          },
        });
        // #endif
      } else {
        this.$refs["upload"].chooseFile();
      }
    },
    // 上传服务器
    uploadFilePromise_custom(url, type, file) {
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
      console.log(uploadUrl);
      return new Promise((resolve, reject) => {
        uni.uploadFile({
          url: request.API_URL() + uploadUrl, // 仅为示例，非真实的接口地址
          ...obj,
          name: type,
          formData: {},
          success: (res) => {
            res = JSON.parse(res.data);
            uni.hideLoading();
            if (res.code == 0) {
              resolve(res.data.url);
            } else {
              uni.$u.toast(res.msg || "上传失败");
              reject();
            }
          },
        });
      });
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
};
</script>

<style lang="scss" scoped>
.default-style {
  border-radius: 10rpx;
  background: #eee;
  .tip {
    text-align: center;
    font-size: 26rpx !important;
    color: #666;
  }
}
</style>

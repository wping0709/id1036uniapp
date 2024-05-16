<template>
  <view>
    <view class="m-y-20 m-x-20 border-b p-b-20" v-if="show == 0">
      <u-textarea
        v-model="evaluation"
        placeholder="添加标题"
        auto-height
        placeholder-class="grey"
				border="none"
      />
    </view>
    <view class="m-y-20 m-x-20">
      <u-textarea
        v-model="evaluationTwo"
        height="300rpx"
        :placeholder="show == 0 ? '填写补充内容' : '填写内容'"
        maxlength="1000"
        border="none"
				count
      ></u-textarea>
    </view>
		<div class="m-30">
			<Upload :maxCount="9" :fileList.sync="imglist" width="160rpx" height="160rpx" type="image" uploadText="上传图片"></Upload>
		</div>
    <!-- <view class="imgList">
      <view class="imgList-tianjia" @click="shangchuan">
        <span class="iconfont">&#xeca5;</span>
      </view>
      <view class="imageView">
        <view class="xhView" v-for="(item, index) of imglist" :key="index">
          <image :src="item" mode="aspectFill"></image>
          <view class="delete" @click="deleteS(item, index)"> - </view>
        </view>
      </view>
    </view> -->
    <!-- v-if="show==0" -->
    <view class="site" v-if="show == 0">
      <view class="site-view"> 分类 </view>
      <view
        v-for="(item, index) of guigeList"
        :key="index"
        :class="guigeShow == item.id ? 'site-huang' : 'site-hui'"
        @click="qiehuan(item.id)"
      >
        {{ item.name }}
      </view>
    </view>
    <view class="bottom">
      <view @click="fabu"> 发布 </view>
    </view>
  </view>
</template>

<script>
import request from '@/utils/request';
import wine from '@/api/wine.js';
import Upload from '@/components/Upload'
export default {
	components: {
		Upload
	},
  data() {
    return {
      number: 0,
      evaluationTwo: '',
      evaluation: '',
      show: -1,
      imglist: [],
      id: null,
      ids: null,
      topic: null,
      screeningShow: false,
      guigeList: [],
      guigeName: null,
      guigeShow: null,
    };
  },
  onLoad(e) {
    this.id = e.id;
    this.show = e.show;
    this.guige();
    if (this.show == 0) {
      uni.setNavigationBarTitle({
        title: '写问题',
      });
    } else {
      uni.setNavigationBarTitle({
        title: '写回答',
      });
    }
  },
  methods: {
    // 删除图片
    deleteS(e, index) {
      // var imgIndex = this.imglist.findIndex(value=>value == e)
      this.imglist.splice(index, 1);
      console.log(index, 'imgIndeximgIndeximgIndex');
    },
    qiehuan(e) {
      console.log(e);
      this.guigeShow = e;
      this.ids = e;
    },
    // 请求规格
    guige() {
      wine.answerGetCatList().then(res => {
        console.log(res, '规格规格');
        if (res.code == 0) {
          this.guigeList = res.data;
        }
      });
    },
    fabu() {
      if (this.show != 0) {
        if (this.evaluationTwo == null) {
          uni.showToast({
            title: '请输入内容',
            icon: 'none',
          });
        } else {
          let data = {
            content: this.evaluationTwo,
            pic_list_url: JSON.stringify(this.imglist.map(item => item.url)),
            type: this.show,
            question_id: this.id,
          };
          wine.answerAddPush(data).then(res => {
            console.log(res);
            if (res.code == 0) {
              uni.showToast({
                title: '回答成功',
              });
              setTimeout(item => {
                uni.navigateBack({
                  delta: -2,
                });
              }, 2000);
            }
          });
        }
      } else {
        if (this.evaluation == null) {
          uni.showToast({
            title: '请输入内容',
            icon: 'none',
          });
        }
        else if(this.imglist.length <= 0 || this.imglist.some(item => !item.url)){
        	uni.showToast({
        		title:"请上传至少一张图片",
        		icon:"none"
        	})
        }
        else if (this.ids == null) {
          uni.showToast({
            title: '请选择则分类',
            icon: 'none',
          });
        } else {
          let data = {
            question: this.evaluation,
            content: this.evaluationTwo,
            pic_list_url: JSON.stringify(this.imglist.map(item => item.url)),
            type: this.show,
            cat_id: this.ids,
          };
          wine.answerAddPush(data).then(res => {
            console.log(res);
            if (res.code == 0) {
              uni.showToast({
                title: '提交成功',
              });
              setTimeout(item => {
                uni.navigateBack({
                  delta: -1,
                });
              }, 2000);
            }
          });
        }
      }
    },
    imageForList(e) {
      console.log(e, 'eeeee');
      uni.showToast({
        title: '上传中',
        icon: 'loading',
        duration: 1000,
      });
      uni.uploadFile({
        url: request.API_URL() + '/default/upload-image',
        filePath: e,
        name: 'image',
        formData: {},
        success: res => {
          console.log(res, '图片img');
          let data = JSON.parse(res.data);
          console.log(data, 'mmmmmm');
          this.imglist.push(data.data.url);
          console.log(this.imglist, 'llllllll');
        },
      });
    },
    shangchuan() {
      let that = this;
      uni.chooseImage({
        count: 9, // 最多可以选择的图片张数，默认9
        sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
        sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
        success: function (res) {
          console.log(res);
          if (res.errMsg == 'chooseImage:ok') {
            console.log(res, 'res11111111');
            for (let i = 0; i <= res.tempFilePaths.length; i++) {
              that.imageForList(res.tempFilePaths[i]);
            }
            // console.log(that.imglist)
          } else {
            uni.showToast({
              title: '上传失败',
              icon: 'none',
            });
          }
        },
      });
    },
  },
  watch: {
    evaluationTwo(e, a) {
      console.log(e);
      this.number = e.length;
    },
  },
};
</script>

<style lang="scss" scoped>
.top {
  width: 650rpx;
  height: 120rpx;
  margin-left: 52rpx;
  margin-top: 30rpx;
  border-bottom: 1rpx solid #f2f2f2;
}

.fwb {
  width: 650rpx;
  height: 272rpx;
  margin-left: 52rpx;
  margin-top: 40rpx;

  .fwb-text {
    height: 134rpx;
  }

  .fwb-zs {
    height: 32rpx;
    font-size: 22rpx;
    font-family: PingFang SC;
    font-weight: 400;
    color: #8c8c8c;
    text-align: right;
  }
}

.imgList {
  width: 650rpx;
  margin-left: 52rpx;
  display: flex;
  align-items: center;

  .imgList-tianjia {
    width: 160rpx;
    height: 160rpx;
    background: #ffffff;
    border: 2rpx dashed #e5e5e5;
    border-radius: 10rpx;
    text-align: center;
    line-height: 160rpx;
    color: #e5e5e5;

    .iconfont {
      font-size: 60rpx;
    }
  }

  .imageView {
    width: 490rpx;
    height: 160rpx;
    margin-left: 10rpx;
    overflow-x: scroll;
    white-space: nowrap;
    .xhView {
      width: 160rpx;
      height: 160rpx;
      position: relative;
      display: inline-block;
      margin-left: 10rpx;
      image {
        width: 160rpx;
        height: 100%;
        // display: inline-block;
      }
      .delete {
        width: 40rpx;
        height: 40rpx;
        background-color: red;
        border-radius: 50%;
        text-align: center;
        line-height: 40rpx;
        color: #fff;
        position: absolute;
        top: 0rpx;
        right: 0;
      }
    }
  }
}

.site {
  width: 650rpx;
  // height: 108rpx;
  margin-left: 52rpx;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 118rpx;
  .site-view {
    height: 50rpx;
    line-height: 50rpx;
    text-align: center;
    font-size: 30rpx;
    margin-top: 10rpx;
  }
  .site-hui {
    min-width: 70rpx;
    height: 50rpx;
    text-align: center;
    line-height: 50rpx;
    border: 1rpx solid #e5e5e5;
    border-radius: 50rpx 50rpx;
    padding-left: 30rpx;
    padding-right: 30rpx;
    margin-left: 20rpx;
    color: #8c8c8c;
    margin-top: 10rpx;
  }
  .site-huang {
    min-width: 70rpx;
    height: 50rpx;
    text-align: center;
    line-height: 50rpx;
    // border: 1rpx solid #FECE38;
    color: #f3c434;
    background-color: #fbff0338;
    border-radius: 50rpx 50rpx;
    padding-left: 30rpx;
    padding-right: 30rpx;
    margin-left: 20rpx;
    margin-top: 10rpx;
  }
}

.bottom {
  width: 100%;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 224rpx;

  view {
    width: 690rpx;
    height: 80rpx;
    background: linear-gradient(270deg, #ffcb34 0%, #f8df51 100%);
    border-radius: 120rpx;
    font-size: 32rpx;
    font-family: PingFang SC;
    font-weight: bold;
    color: #353430;
    text-align: center;
    line-height: 80rpx;
  }
}
</style>

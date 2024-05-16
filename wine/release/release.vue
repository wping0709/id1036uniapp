<template>
  <view>
    <view class="top">
      <view class="top-title"> 评价 </view>
      <view class="top-pj">
        <!-- <uni-rate :readonly="false" allowHalf activeColor="#FFCB34" v-model="jpConte" size="25" @change="jiuping" /> -->
        <WEvaluate
          :value.sync="jpConte"
          :readonly="false"
          activeColor="#ffcb34"
          @change="jiuping"
        ></WEvaluate>
      </view>
    </view>
    <view class="center">
      <view class="center-title"> 维度评分 </view>
      <view class="center-pingjia">
        <view
          class="center-pingjia-view"
          v-for="(item, index) of wdList"
          :key="index"
        >
          <view class="center-pingjia-view-left">
            <view>
              {{ item.name }}
            </view>
            <!-- <uni-rate :readonly="false" activeColor="#FFCB34" size="25" :value="item.value"
							class="center-pj" @change="wdClick($event,index)" /> -->
            <WEvaluate
              :value.sync="item.value"
              :readonly="false"
              @change="wdClick(item.value, index)"
              activeColor="#ffcb34"
            ></WEvaluate>
          </view>
          <view class="center-pingjia-view-right">
            {{ item.text }}
          </view>
        </view>
      </view>
    </view>
    <view class="fwb">
      <u-textarea
        v-model="evaluation"
        maxlength="1000"
        height="200rpx"
        placeholder="添加标题"
        border="none"
        count
        :placeholder-style="{padding: 0}"
      ></u-textarea>
    </view>
    <view class="imgList">
      <view class="imgList-tianjia" @click="shangchuan">
        <span class="iconfont">&#xeca5;</span>
      </view>
      <view class="imageView">
        <view class="xhView" v-for="(item, index) of imglist" :key="index">
          <image :src="item" mode="aspectFill"></image>
          <view class="delete" @click="deleteS(item, index)"> - </view>
        </view>
      </view>
    </view>
    <view class="site">
      <view class="site-left">
        <!-- <image src="../img/map.png" mode="" class="site-left-image"></image> -->
        <span class="iconfont">&#xe683;</span>
        <view> 位置 </view>
      </view>
      <view class="site-right">
        <switch
          :checked="switchShow"
          @change="switchCli"
          style="transform: scale(0.9, 0.8)"
        />
      </view>
    </view>
    <view class="site">
      <view class="site-left">
        <span class="iconfont">&#xe888;</span>
        <view> 宝贝 </view>
      </view>
      <view class="site-center">
        <image :src="wineXuan.pic_url || ''" mode="aspectFill"> </image>
        <view>
          {{ wineXuan.name || '' }}
        </view>
      </view>
      <view class="site-right" @click="tianjia">
        点击添加 <span class="iconfont">&#xe7b5;</span>
      </view>
    </view>
    <view class="bottom">
      <view @click="fabu"> 发布 </view>
    </view>
    <view class="chengkai"> </view>
  </view>
</template>

<script>
import wine from '@/api/wine.js';
// import uniRate from "@/wine/comme/uni-rate.vue"
import WEvaluate from '@/components/w-evaluate/index.vue';
import request from '@/utils/request';
export default {
  data() {
    return {
      // 富文本文字输入
      evaluation: '',
      // 酒评星数
      jpConte: 0,
      // 判断输入文字是否大于1000
      number: 0,
      // 上传到图片数组
      imglist: [],
      // 维度评分数组
      wdList: [],
      // switch开关
      switchShow: false,
      // 酒评选中的商品
      wineXuan: null,
      lat: '',
      lgd: '',
      // 是否开启
      address_show: 0,
      height: '',
    };
  },
  onShow() {
    this.wineXuan = uni.getStorageSync('wine_goods');
    let id = '#textareawrap';
    let query = uni.createSelectorQuery(); //创建查询对象
    query.select(id).boundingClientRect(); //获取view的边界及位置信息
    query.exec(function (res) {
      console.log(res, 'rerererereres');
      this.height = res[0].height + 'px';
    });
    console.log(query, 'queryqueryquery');
    console.log(this.wineXuan);
  },
  onLoad() {
    wine.AddPushView().then(res => {
      console.log(res);
      if (res.code == 0) {
        this.wdList = res.data;
        this.wdList.forEach(item => {
          item.text = '非常推荐';
        });
      }
    });
    uni.setNavigationBarTitle({
      title: `发布${this.comment_title}`,
    });
  },
  components: {
    // uniRate
    WEvaluate,
  },
  onUnload() {
    uni.removeStorage({
      key: 'wine_goods',
    });
  },
  computed: {
    comment_title() {
      return (
        this.$store.getters['SHOP_CONFIG']?.push_info.comment_title || '酒评'
      );
    },
  },
  methods: {
    switchCli(e) {
      console.log(e.detail.value);
      if (e.detail.value == true) {
        // this.getAuthorizeInfo()
        this.address_show = 1;
        // if(uni.getStorageSync("locationData") == undefined){
        // 	this.lat = ""
        // 	this.lgd = ""
        // 	this.address_show = 0
        // }else{
        // 	this.lat = uni.getStorageSync("locationData").latitude
        // 	this.lgd = uni.getStorageSync("locationData").longitude
        // 	this.address_show = 1
        // }
      } else if (e.detail.value == false) {
        this.lat = '';
        this.lgd = '';
        this.address_show = 0;
      }
      console.log(this.lat, this.lgd, '6648');
    },
    // 删除图片
    deleteS(e, index) {
      // var imgIndex = this.imglist.findIndex(value=>value == e)
      this.imglist.splice(index, 1);
      console.log(index, 'imgIndeximgIndeximgIndex');
    },
    getAuthorizeInfo() {
      const that = this;
      uni.authorize({
        scope: 'scope.userLocation',
        success() {
          // 允许授权
          // 隐藏拒绝授权的页面样式
          that.Toauthorize = false;
          // 调用地理位置方法
          that.getLocationInfo();
          uni.showToast({
            title: '获取地理位置成功',
            icon: 'none',
            duration: 1000,
          });
        },
        fail() {
          // 拒绝授权
          // 显示拒绝授权的页面样式
          that.Toauthorize = true;
          uni.showToast({
            title: '你拒绝了授权，无法获得周边信息',
            icon: 'none',
            duration: 1000,
          });
        },
      });
    },
    getLocationInfo() {
      uni.getLocation({
        type: 'gcj02',
        success(res) {
          uni.openSetting(); // 打开地图权限设置
        },
      });
    },
    wdClick(e, a) {
      console.log(e, a);
      this.wdList[a].value = e;
      if (this.wdList[a].value <= 1) {
        this.wdList[a].text = '不推荐';
      } else if (this.wdList[a].value > 1 && this.wdList[a].value <= 3) {
        this.wdList[a].text = '推荐';
      } else if (this.wdList[a].value > 3 && this.wdList[a].value <= 5) {
        this.wdList[a].text = '非常推荐';
      }

      console.log(this.wdList[a]);
    },
    jiuping(e) {
      console.log(e);
      this.jpConte = e;
    },
    tianjia() {
      uni.navigateTo({
        url: '../topic/topic?id=' + 0,
      });
    },
    fabu() {
      console.log(this.imglist, 'lllsssssl');
      if (this.evaluation == '') {
        uni.showToast({
          title: '请填写内容',
          icon: 'none',
        });
        return;
      } else if (this.wineXuan == null || this.wineXuan == '') {
        uni.showToast({
          title: '请选择商品',
          icon: 'none',
        });
        return;
      } else {
        let data = {
          type: 0,
          content: this.evaluation,
          address_show: this.address_show,
          goods_id: this.wineXuan.id,
          // address_latitude:this.lat,
          // address_longitude:this.lgd,
          pic_list_url: JSON.stringify(this.imglist),
          syn_score: JSON.stringify(this.wdList),
          score: this.jpConte,
        };
        wine.AddPush(data, 2).then(res => {
          console.log(res);
          if (res.code == 0) {
            uni.showToast({
              title: '已发布',
            });
            uni.removeStorage({
              key: 'wine_goods',
            });
            setTimeout(item => {
              uni.navigateBack({
                delta: -1,
              });
            }, 2000);
          }
        });
      }
      // uni.navigateTo({
      // 	url:"../tao/tao"
      // })
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
	  // #ifdef APP-PLUS
	  if(this.systemInfo.osName !== 'ios'){
		  uni.showModal({
		  	title:'提示',
		  		content:'是否允许系统打开设备相机?用于上传图片',
		  		success: ({confirm,cancel}) => {
		  			if(confirm) {
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
		  			}
		  		}
		  })
	  }else {
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
	  }
	  // #endif
	  // #ifdef MP-WEIXIN || H5
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
	  // #endif

    },
  },
  watch: {
    evaluation(e, a) {
      // console.log(e.length)
      this.number = e.length;
      if (this.number > 1000) {
        uni.showToast({
          title: '字数过多',
          icon: 'none',
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.top {
  width: 650rpx;
  height: 172rpx;
  margin-left: 52rpx;
  border-bottom: 1rpx solid #f2f2f2;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .top-title {
    height: 44rpx;
    font-size: 32rpx;
    font-family: PingFang SC;
    font-weight: bold;
    color: #262626;
  }

  .top-pj {
    height: 48rpx;
    margin-top: 22rpx;
  }
}

.center {
  width: 650rpx;
  // height: 348rpx;
  margin-left: 52rpx;
  margin-top: 20rpx;

  .center-title {
    height: 44rpx;
    font-size: 32rpx;
    font-family: PingFang SC;
    font-weight: bold;
    color: #262626;
  }

  .center-pingjia {
    // height: 244rpx;
    margin-top: 8rpx;

    .center-pingjia-view {
      height: 40rpx;
      display: flex;
      justify-content: space-between;
      margin-top: 20rpx;

      .center-pingjia-view-left {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 28rpx;
        font-family: PingFang SC;
        font-weight: 400;
        color: #8c8c8c;

        .center-pj {
          margin-left: 20rpx;
        }
      }

      .center-pingjia-view-right {
        font-size: 28rpx;
        font-family: PingFang SC;
        font-weight: 400;
        color: #8c8c8c;
      }
    }
  }
}

.fwb {
  width: 650rpx;
  // height: 272rpx;
  margin-left: 52rpx;
  margin-top: 30rpx;

  .fwb-text {
    // height: 234rpx;
    min-height: 100rpx;
    // max-height: 300rpx;
    overflow: hidden;
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
  height: 108rpx;
  margin-left: 52rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1rpx solid #f2f2f2;

  .site-left {
    width: 100rpx;
    height: 42rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .site-left-image {
      width: 28rpx;
      height: 34rpx;
    }

    view {
      height: 42rpx;
      font-size: 30rpx;
      font-family: PingFang SC;
      font-weight: 400;
      color: #262626;
    }
  }

  .site-center {
    width: 200rpx;
    height: 42rpx;
    display: flex;
    margin-left: -100rpx;

    image {
      width: 38rpx;
      height: 38rpx;
      border-radius: 50%;
    }

    view {
      width: 160rpx;
      font-size: 28rpx;
      font-family: PingFang SC;
      font-weight: 400;
      color: #262626;
      margin-left: 15rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .site-right {
    // width: 80rpx;
    height: 48rpx;
    font-size: 30rpx;
    font-family: PingFang SC;
    font-weight: 400;
    color: #8c8c8c;
    display: flex;

    .switch {
      width: 100%;
      height: 100%;
    }

    .iconfont {
      color: #888888;
      margin-left: 10rpx;
    }
  }
}

.bottom {
  width: 100%;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 64rpx;

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
.chengkai {
  width: 100%;
  height: 150rpx;
}
</style>

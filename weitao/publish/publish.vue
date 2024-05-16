<template>
  <view class="body">
    <view>
      <u-textarea
        v-model="textareaValue"
        maxlength="500"
        placeholder="写点什么和大家分享一下吧~"
        border="none"
        height="250rpx"
        count
      ></u-textarea>
    </view>

    <view>
		<!-- <cl-upload v-model="list" cloudType="other" :action="action" :headers="headers" @onSuccess="onSuccess" ></cl-upload> -->
    <Upload
        ref="Upload"
        :fileList.sync="fileList"
        :type="type"
        :uploadUrl="type == 'video' ? '/default/upload-video':'/default/upload-image'"
        :maxCount="type == 'video' ? 1 : 9"
        :isSlot="true"
        width="200rpx"
        height="200rpx"
      >
        <view
          class="up-slot flex-y-center flex-x-center"
          @click.stop="clickUpload"
        >
          <text class="iconfont icon-jia" style="font-size: 50rpx"></text>
        </view>
      </Upload>
    </view>

    <!-- 标签 -->
    <view class="menu-item flex-y-center">
      <view
        v-if="!topic"
        class="tag flex-y-center"
        @click="
          $utils.toUrl('/weitao/topic/topic?type=select&topic_id=' + topic.id)
        "
      >
        <text>添加标签</text>
      </view>
      <view
        @click="
          $utils.toUrl('/weitao/topic/topic?type=select&topic_id=' + topic.id)
        "
        class="tag flex-y-center"
        v-else
      >
        <text class="flex-w-1 u-line-1">{{ topic.topic_name }}</text>
        <text
          @click.stop="topic = ''"
          class="iconfont icon-close p-l-10"
          style="color: red"
        ></text>
      </view>
    </view>
    <!-- 地址 -->
    <view class="menu-item flex-y-center">
      <div class="left flex-w-1 flex-y-center">
        <text class="iconfont icon-dingwei font-40"></text>
        <text>{{
          (addressInfo.address && addressInfo.address.name) || ''
        }}</text>
      </div>
      <div class="right">
        <u-switch v-model="isAddress" size="20"></u-switch>
      </div>
    </view>
    <!-- 带货 -->
    <view
      @click="
        $utils.toUrl(
          '/weitao/addgoods/addgoods?type=select&goods_id=' + goods.id
        )
      "
      class="menu-item flex-y-center"
    >
      <div class="left flex-y-center">
        <text class="iconfont icon-shangpin font-40"></text>
        <text>宝贝</text>
      </div>
      <div class="right flex-w-1 flex-y-center">
        <view class="m-x-20 m-l-30 flex-w-1 flex-y-center">
          <template v-if="goods">
            <image
              :src="goods.pic_url"
              style="width: 50rpx; height: 50rpx; border-radius: 50%"
              mode="aspectFill"
            />
            <view class="u-line-1 flex-w-1 m-l-10">{{ goods.name }}</view>
          </template>
        </view>
        <view class="flex-y-center">
          <text>点击添加</text>
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </div>
    </view>

    <div class="bottom-fixed">
      <view>
        <div @click="submit" class="submit">发布</div>
      </view>
    </div>
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
		list: [],
		action: "https://gy.ysxdgy.com/v1/common/upload",
		headers: {
			token: 'e672c63d4e034fc08054f83ad479ee3e'
		},
      addressInfo: '',
      textareaValue: '',
      fileList: [],
	  fileType:'',
      type: 'image',
      isAddress: false,
      topic: '',
      topic_id: '',
      goods: '',
      locationData: '',
    };
  },
  onLoad(params) {
    this.topic_id = params.topic_id;
    this.loadData();
  },
  onShow() {
    let checkTopic = uni.getStorageSync('checkTopic');
    if (checkTopic) {
      this.topic = checkTopic;
      uni.removeStorageSync('checkTopic');
    }

    let checkGoods = uni.getStorageSync('checkGoods');
    if (checkGoods) {
      this.goods = checkGoods;
      uni.removeStorageSync('checkGoods');
    }
  },
  methods: {
    async loadData() {
      this.locationInfo();
      this.topic_id && this.getTopick();
    },
    async locationInfo() {
      this.locationData = await this.$store.dispatch('GETLOCATION')

      const res = await this.$requestAll.mch.locationInfo(
        {
          longitude: this.locationData.longitude,
          latitude: this.locationData.latitude,
        },
        true
      );
      this.addressInfo = res.data;
    },
    async getTopick() {
      const res = await this.$requestAll.weitao.addArticleView({
        topic_id: this.topic_id,
      });
      this.topic = res.data.topic;
    },

    // 上传
    clickUpload() {
      // 未选择上传类型
      if (!this.fileList.length) {
        uni.showActionSheet({
          itemList: ['视频', '图片'],
          itemColor: '#333333',
          success: res => {
            this.type = res.tapIndex == 0 ? 'video' : 'image';
            this.$nextTick(() => {
              this.$refs['Upload'].clickUpload();
            });
          },
        });
      }
      // 已选择上传类型
      else {
        this.$refs['Upload'].clickUpload();
      }
    },
    async submit() {
      if (!this.textareaValue) return uni.$u.toast('内容不能为空');
      if (!this.topic) return uni.$u.toast('话题不能为空');
      if (!this.locationData) return uni.$u.toast('定位获取失败');
      var formData = {
        content: this.textareaValue,
        address_show: this.isAddress ? 1 : 0,
        topic_id: this.topic.id || '',
        goods_id: this.goods.id || '',
        address_latitude: this.locationData.latitude,
        address_longitude: this.locationData.longitude,
      };

      if (this.type == 'image') {
        formData.pic_list_url = JSON.stringify(
          this.fileList.map(item => item.url)
        );
      } else {
        formData.video_list_url = JSON.stringify(
          this.fileList.map(item => item.url)
        );
      }
	  
	 //  if(this.list){
		//   this.list.map((item)=>{
		// 	  if(item.search('jpg') !== -1){
		// 		 this.type = 'image'
		// 		  console.log('zhaobudao',this.type)
		// 	  }else{
		// 		  this.type = 'vedio'
		// 	  }
		//   })
		// if(this.type == 'image'){
		// 	formData.pic_list_url = JSON.stringify(
		// 					this.list.map(item => item)
		// 	  );
		// }else {
		// 	formData.video_list_url = JSON.stringify(
		// 	    this.list.map(item => item)
		// 	  );
		// }
		 
			
	 //  }
      console.log(formData, '123123123123');
      const res = await this.$requestAll.weitao.addArticle(formData, true);
      uni.showModal({
        title: '提示',
        content: res.msg,
        showCancel: false,
        success: res => {
          res.confirm && this.$utils.toUrl('/weitao/index/index');
        },
      });
    },
	onSuccess(reslut) {
		// 把服务端返回的图片地址添加到list中与组件数据同步
		this.list.push(reslut.data.link)
		console.log(11111111111111,this.list)
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
  padding: 20rpx;
  height: 100vh;
  // #ifdef H5
  height: calc(100vh - 44px);
  // #endif
  .header {
  	margin-bottom: 10rpx;
  }
  
  .header text {
  	font-family: inherit;
  	font-weight: 600;
  	color: #757bf7;
  }
  
  .delete {
  	position: absolute;
  	width: 20px;
  	height: 20px;
  	background: #ff6f6f;
  	right: -10px;
  	top: -10px;
  	z-index: 1;
  	border-radius: 50%;
  	display: flex;
  	align-items: center;
  	justify-content: center;
  
  }
  
  .newAddImg {
  	width: 100%;
  	height: 100%;
  	display: flex;
  	flex-direction: column;
  	align-items: center;
  	justify-content: center;
  	font-size: 50px;
  	border: 1px solid #757bf7;
  	border-radius: 20rpx;
  	color: #757bf7;
  	
  	
  }
  
  .newAddImg text {
  	font-size: 28rpx;
  	margin-top: 20rpx;
  }
  
  /deep/.uni-group__content {
  	padding: 20rpx;
  }
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

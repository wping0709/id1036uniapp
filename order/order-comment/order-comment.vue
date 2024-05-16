<template>
  <view v-if="pageData" class="body">
    <view
      v-for="(goods, i) in pageData.goods_list"
      :key="i"
      class="m-b-20 bg-fff p-y-20"
    >
      <div class="score-box flex-y-center">
        <image
          :src="goods.goods_pic"
          mode="aspectFill"
          style="width: 90rpx; height: 90rpx"
        />
        <view class="flex-w-1 flex-y-center flex-x-sa">
          <view
            @click="checkedTate(3, i)"
            :class="[
              'flex-y-center',
              (!goods.score || goods.score == 3) && 'checked',
            ]"
          >
            <text class="iconfont icon-haoping font-40"></text>
            <text>好评</text>
          </view>
          <view
            @click="checkedTate(2, i)"
            :class="['flex-y-center', goods.score == 2 && 'checked']"
          >
            <text class="iconfont icon-zhongping font-40"></text>
            <text>中评</text>
          </view>
          <view
            @click="checkedTate(1, i)"
            :class="['flex-y-center', goods.score == 1 && 'checked']"
          >
            <text class="iconfont icon-chaping font-40"></text>
            <text>差评</text>
          </view>
        </view>
      </div>

      <div class="value-box">
        <u--textarea
          v-model="goods.content"
          border="none"
          maxlength="-1"
          placeholder="请输入评价内容"
          height="300rpx"
        >
        </u--textarea>
      </div>

      <div class="p-t-20 p-x-20">
        <Upload :fileList.sync="goods.fileList1" type="image" :maxCount="6"></Upload>
      </div>
    </view>

    <div class="submit-box">
      <div class="fixed">
        <div class="submit" @click="submit">提交</div>
      </div>
    </div>

    <canvas
      :style="{
        width: `${systemInfo.windowWidth}px`,
        height: `${systemInfo.windowWidth}px`,
        position: 'absolute',
        zIndex: '-1',
        left: '-10000rpx',
        top: '-10000rpx',
      }"
      canvas-id="zipCanvas"
    ></canvas>
  </view>
</template>
<script>
import request from '@/utils/request';
import Upload from '@/components/Upload';
export default {
  components: {
    Upload,
  },
  data() {
    return {
      pageType: '',
      id: '',
      pageData: '',
      rate: 3,
      value: '',
      fileList1: [],
    };
  },
  onLoad(param) {
    this.id = param.id;
    this.pageType = param.pageType;
    this.loadData();
  },
  methods: {
    async loadData() {
      if (this.pageType == 'miaosha') {
        var res = await this.$requestAll.miaosha.commentPreview({
          order_id: this.id,
        });
      } else if (this.pageType == 'integral') {
        var res = await this.$requestAll.order.orderCommentPreview({
          order_id: this.id,
          type: 'IN',
        });
      } else if (this.pageType == 'pt') {
        var res = await this.$requestAll.group.commentPreview({
          order_id: this.id,
        });
      } else {
        var res = await this.$requestAll.order.orderCommentPreview({
          order_id: this.id,
          type: 'mall',
        });
      }
      this.pageData = res.data;
    },
    checkedTate(num, index) {
      // this.rate = num;
      this.pageData.goods_list[index].score = num;
      this.$set(
        this.pageData.goods_list,
        index,
        this.pageData.goods_list[index]
      );
    },
 
    async submit() {
      // uni.showLoading({
      //   title: '正在提交',
      // });
      // var urlArr = [];
      // for (let i = 0; i < this.fileList1.length; i++) {
      //   let res = await request.UPLOAD_IMAGE(
      //     this.fileList1[i].url,
      //     '/default/upload-' + this.fileList1[i].type,
      //     this.fileList1[i].type
      //   );
      //   urlArr.push(res.data.url);
      // }

      // var formData = {
      //   order_id: this.id,
      //   type: 'mall',
      //   goods_list: JSON.stringify([
      //     Object.assign(this.pageData.goods_list[0], {
      //       score: this.rate,
      //       content: this.value,
      //       pic_list: this.fileList1.map(file => file.url),
      //       uploaded_pic_list: urlArr,
      //     }),
      //   ]),
      // };
      let goods_list = JSON.parse(JSON.stringify(this.pageData.goods_list));
      goods_list = goods_list.map(item => {
        if (item.fileList1 && item.fileList1.length) {
          item.uploaded_pic_list = item.fileList1.map(item => item.url);
        }
        delete item.fileList1;

        !item.score && (item.score = 3);
				return item
      });

      let formData = {
        order_id: this.id,
        type: 'mall',
        goods_list: JSON.stringify(goods_list),
      };

      if (this.pageType == 'miaosha') {
        var { msg } = await this.$requestAll.miaosha.orderComment(
          formData,
          true
        );
      } else if (this.pageType == 'integral') {
        formData.type = 'IN';
        var { msg } = await this.$requestAll.order.orderComment(formData, true);
      } else if (this.pageType == 'pt') {
        var { msg } = await this.$requestAll.group.comment(formData, true);
      } else {
        var { msg } = await this.$requestAll.order.orderComment(formData, true);
        
        // 更改订单列表评论状态
        uni.$emit('modifyCommentStatus',this.id,1)
      }

      uni.showModal({
        title: '提示',
        content: msg || '提交成功',
        success: res => {
          if (res.confirm) {
            console.log('用户点击确定');
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        },
        complete: () => this.$utils.backTo(),
      });
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
  background: #f5f5f5;
  min-height: 100vh;

  .scroll-x-goods {
    box-sizing: border-box;
    padding: 0 20rpx;

    .goods-list {
      white-space: nowrap;

      .goods-item {
        display: inline-block;
        margin-right: 20rpx;

        &:nth-last-child(1) {
          margin-right: 0;
        }

        > image {
          border-radius: 10rpx;
          width: 200rpx;
          height: 200rpx;
        }
      }
    }
  }

  .score-box {
    margin: 2rpx 0;
    padding: 0 20rpx;
    font-size: 32rpx;
    color: #666;
    height: 100rpx;

    .iconfont {
      margin-right: 10rpx;
    }

    .checked {
      color: red;
    }
  }

  .value-box {
    padding: 0 20rpx;
    margin: 2rpx 0;
  }

  .submit-box {
    height: 100rpx;
    height: calc(100rpx + env(safe-area-inset-bottom));
    background: #f5f5f5;
  }

  .fixed {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100rpx;
    height: calc(100rpx + env(safe-area-inset-bottom));
    line-height: 100rpx;
    background: #f5f5f5;

    color: #fff;
    text-align: center;

    .submit {
      background: #ff4544;
    }
  }
}
</style>

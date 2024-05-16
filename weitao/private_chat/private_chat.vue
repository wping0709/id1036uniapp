<template>
  <view v-if="userInfo" class="body flex-col">
    <scroll-view scroll-y :scroll-top="topNum" class="page-content flex-h-1">
      <div id="page-content">
        <view v-for="(item, i) in list" :key="i">
          <div v-if="item.user_id == chat_user" class="item flex">
            <image
              @click="
                $utils.toUrl(
                  '/weitao/my_conter/my_conter?user_id=' + item.user_id
                )
              "
              :src="item.chat_head"
              mode="aspectFill"
              class="user-img"
            />
            <div class="item-content">
              <div class="neirong flex">
                <div class="neirong-content">{{ item.content }}</div>
              </div>
              <div class="font-24 color-999 font-left m-t-10">
                {{ $u.timeFormat(item.add_time, 'yyyy-mm-dd hh:MM') }}
              </div>
            </div>
          </div>

          <div v-else class="item-r flex">
            <div class="item-content">
              <div class="neirong flex-x-end">
                <div class="neirong-content">{{ item.content }}</div>
              </div>
              <div class="font-24 color-999 font-right m-t-10">
                {{ $u.timeFormat(item.add_time, 'yyyy-mm-dd hh:MM') }}
                {{ item.is_read == 1 ? '已读' : '未读' }}
              </div>
            </div>
            <image
              @click="
                $utils.toUrl(
                  '/weitao/my_conter/my_conter?user_id=' + item.user_id
                )
              "
              :src="item.chat_head"
              mode="aspectFill"
              class="user-img"
            />
          </div>
        </view>
      </div>
    </scroll-view>
    <div class="bottom-input">
      <view class="flex-w-1 m-r-20">
        <u-input
          border="none"
          shape="circle"
          @confirm="onConfirm"
          placeholder="说点什么~"
          v-model="send_content"
        ></u-input>
      </view>
      <view @click="onConfirm">发送</view>
    </div>
  </view>
</template>
<script>
export default {
  data() {
    return {
      userInfo: '',
      list: [],
      time: '',
      chat_user: '',
      send_content: '',
      topNum: 0,
    };
  },
  onLoad(params) {
    this.chat_user = params.chat_user;
  },
  onShow() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.time && clearInterval(this.time);

      const res = await this.$requestAll.weitao.userChat({
        chat_user_id: this.chat_user,
      });
      this.userInfo = res.data.user_info;
      this.list = res.data.list;
      uni.setNavigationBarTitle({
        title: res.data.user_info.nickname,
      });

      this.time = setInterval(async () => {
        const res = await this.$requestAll.weitao.userChat({
          chat_user_id: this.chat_user,
        });
        this.userInfo = res.data.user_info;
        this.list = res.data.list;
      }, 1500);
    },
    async onConfirm() {
      if (!this.send_content.length) return;
      await this.$requestAll.weitao.sendUserChat(
        {
          send_content: this.send_content,
          chat_user_id: this.chat_user,
        },
        true
      );
      this.send_content = '';
      this.loadData();
    },
  },
  computed: {},
  watch: {
    list() {
      // 获取滚动高度滚动到底部
      this.$nextTick(() => {
        const query = uni.createSelectorQuery().in(this);
        query
          .select('#page-content')
          .boundingClientRect(data => {
            this.topNum = data.height;
          })
          .exec();
      });
    },
  },
  onUnload() {
    console.log('监听页面卸载');
    this.time && clearInterval(this.time);
  },
  onHide() {
    console.log('页面隐藏');
    this.time && clearInterval(this.time);
  },
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  height: 100vh;
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */
  .bottom-input {
    padding: 10rpx 30rpx;
    padding: 10rpx 30rpx calc(10rpx + env(safe-area-inset-bottom));
    display: flex;
    align-items: center;
    box-sizing: content-box;
    background: #fff;
    /deep/.u-input {
      background: #f5f5f5;
    }
  }
}

.item,
.item-r {
  padding: 20rpx 0;
  .user-img {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    margin: 0 20rpx;
  }
  .item-content {
    flex: 1;
    width: 0;
    margin-right: 130rpx;
    .neirong-content {
      background: #fff;
      border-radius: 20rpx;
      padding: 20rpx;
    }
  }
}

.item-r {
  .item-content {
    margin-right: 0;
    margin-left: 90rpx;
  }
}
</style>

<template>
  <view
    v-if="param"
    :style="{
      background: param.backgroundColor || '#fff',
    }"
  >
    <u-scroll-list
      :indicator="param.is_slide == 'true'"
      indicatorColor="#dbdbdb"
      indicatorActiveColor="#000"
    >
      <view class="scroll-x">
        <template v-for="(item, i) in scrollItemLength()">
          <view :key="i" class="scroll-item">
            <view class="item-box">
              <template v-for="(it, i2) in scrollItemData(i)">
                <view
                  v-if="it.open_type == 'business_contacts'"
                  :style="navWidth"
                  class="p-t-10 item-t flex-col flex-x-center flex-y-center"
                  :key="i2"
                  @click="toUrl(it)"
                >
                  <image
                    class="img"
                    :src="it.pic_url"
                    style="width: 90rpx; height: 90rpx"
                    mode="aspectFill"
                  >
                  </image>
                  <view class="font-24">
                    <text>{{ it.name }}</text>
                    <!-- #ifdef MP-WEIXIN -->
                    <qy-kefu
                      startmessage="startmessage"
                      completemessage="completemessage"
                      :plugid="it.url"
                    >
                    </qy-kefu>
                    <!-- #endif -->
                  </view>
                </view>
                <view
                  v-else-if="it.open_type == 'wxapp'"
                  :style="navWidth"
                  class="p-t-10 item-t flex-col flex-x-center flex-y-center"
                  :key="i2"
                  @click="$utils.toUrl(it.url, 'wxapp')"
                >
                  <image
                    class="img"
                    :src="it.pic_url"
                    style="width: 90rpx; height: 90rpx"
                    mode="aspectFill"
                  >
                  </image>
                  <view class="font-24">{{ it.name }}</view>
                </view>
                <button
                  v-else-if="it.open_type == 'webKefu'"
                  open-type="contact"
                  :style="navWidth"
                  class="button-initial p-t-10 item-t flex-col flex-x-center flex-y-center"
                  :key="i2"
                >
                  <image
                    class="img"
                    :src="it.pic_url"
                    style="width: 90rpx; height: 90rpx"
                    mode="aspectFill"
                  >
                  </image>
                  <view class="font-24">{{ it.name }}</view>
                </button>

                <view
                  v-else
                  :style="navWidth"
                  class="p-t-10 item-t flex-col flex-x-center flex-y-center"
                  :key="i2"
                  @click="toUrl(it)"
                >
                  <image
                    class="img"
                    :src="it.pic_url"
                    style="width: 90rpx; height: 90rpx"
                    mode="aspectFill"
                  >
                  </image>
                  <view class="font-24">{{ it.name }}</view>
                </view>
              </template>
            </view>
          </view>
        </template>
      </view>
    </u-scroll-list>
  </view>
</template>

<script>
export default {
  props: ["page_id", "_templateKey", "item", "mch_id"],
  data() {
    return {
      param: "",
    };
  },
  computed: {
    // 总共需要渲染几个scroll-item
    scrollItemLength() {
      return function () {
        const num = this.param.col * this.param.count;
        if (!this.param) return 0;
        if (this.param.is_slide == "false") return 1;
        return Math.ceil(this.param.list.length / num);
      };
    },
    // 每个item-box内的10个数据
    scrollItemData() {
      return function (index) {
        const num = this.param.col * this.param.count;
        console.log(index);
        return this.param.list.slice(index * num, index * num + num);
      };
    },
    // 计算宽度
    navWidth() {
      const param = this.param;
      return `width:${100 / param.count}%`;
    },
  },
  created() {
    this.getTemplateInfo();
  },
  methods: {
    async getTemplateInfo() {
      if (!this.page_id) {
        this.param = this.item.param;
      } else {
        const formData = {
          page_id: this.page_id,
          _templateKey: this._templateKey,
          _templateItem: JSON.stringify(this.item),
          _template: this.item.type,
        };
        const res = await this.$requestAll.home.getTemplateData(formData);
        this.param = res.data.param;
      }
    },
    async toUrl(item) {
      if (!this.page_id) {
        if (item.url.split("?")[1]) {
          let pageUrl = this.mch_id
            ? item.url + "&mch_id=" + this.mch_id
            : item.url;
          this.$utils.toUrl(pageUrl);
        } else {
          let pageUrl = this.mch_id
            ? item.url + "?mch_id=" + this.mch_id
            : item.url;
          this.$utils.toUrl(pageUrl);
        }
      } else {
        // if (item.page_name == '分销中心') {
        //   this.$store.dispatch('user/getUserInfo', {
        //     success: () => {
        //       let share_setting =
        //         this.$store.getters['SHOP_CONFIG'].share_setting;
        //       let userInfo = this.$store.getters['user/userInfo'];
        //       if (!userInfo) return uni.$utils.toUrl('/login/login/login_page');
        //       console.log(userInfo);
        //       if (userInfo.is_distributor == 0) {
        //         switch (share_setting.share_condition) {
        //           case '1':
        //             this.$utils.toUrl('/pages/add-share/index');
        //             break;
        //           case '0':
        //             uni.showModal({
        //               title: '申请成为分销商',
        //               content: '是否申请?',
        //               success: async res => {
        //                 if (res.confirm) {
        //                   await this.$requestAll.share.join({}, true);
        //                   this.$utils.toUrl('/pages/add-share/index');
        //                 }
        //               },
        //             });
        //             break;

        //           default:
        //             uni.showModal({
        //               title: '申请成为分销商',
        //               content: '是否申请?',
        //               success: async res => {
        //                 if (res.confirm) {
        //                   await this.$requestAll.share.join({}, true);
        //                   this.$utils.toUrl(item.url, item.open_type);
        //                 }
        //               },
        //             });
        //             break;
        //         }
        //       } else if (userInfo.is_distributor == 2) {
        //         this.$utils.toUrl('/pages/add-share/index');
        //       } else {
        //         this.$utils.toUrl(item.url, item.open_type);
        //       }
        //     },
        //   });
        // } else {
        if (item.open_type == "qrcode_cart") {
          let result = await this.$utils.scanCode();
          // 获取商品添加购物车需要的信息
          const res = await this.$requestAll.cart.cartGoods(
            {
              no: result.result,
            },
            true
          );

          // 添加购物车
          const res1 = await this.$requestAll.cart.cartOffline(
            {
              num: 1,
              attr: res.data.return_str,
              goods_id: res.data.id,
            },
            true
          );
        }
        this.$utils.toUrl(item.url);

        // }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.scroll-x {
  white-space: nowrap;

  .scroll-item {
    display: inline-block;
    width: 750rpx;

    .item-box {
      padding: 10rpx 0;
      width: 100%;
      display: flex;
      flex-wrap: wrap;

      .item-t {
        overflow: hidden;
        position: relative;
        width: 20%;

        qy-kefu {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          opacity: 0;
        }
      }
    }
  }
}
</style>

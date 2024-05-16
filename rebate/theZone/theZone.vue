<template>
  <view>
    <view class="top">
      <image :src="infoData.pic_url" mode=""></image>
      <view>
        剩余
        <text>
          {{ dd || "" }} 天 {{ hh || "" }} 小时{{ mm || "" }} 分钟{{
            ss || ""
          }}秒
        </text>
        结束
      </view>
    </view>
    <view class="center">
      <view class="center-view" v-for="(item, index) of list" :key="index">
        <image
          :src="item.cover_pic"
          mode=""
          @click="xiangqing(item.id)"
        ></image>
        <view class="center-view-text" @click="xiangqing(item.id)">
          <view class="center-view-text-title">
            {{ item.name }}
          </view>
          <view class="center-view-text-yueShou"> 月售 {{ item.sales }} </view>
          <view class="center-view-text-num"> ￥{{ item.price }} </view>
        </view>
        <view
          class="center-view-guige"
          @click="submit('goods', item.id, index, item.mch_id, item.goodsIndex)"
        >
          选规格
          <view v-if="item.fool != 0">
            {{ item.fool }}
          </view>
        </view>
      </view>
    </view>
    <AttrPopup
      :showText="false"
      :goodsId="goodsId"
      ref="AttrPopup"
      type="goodsAttr"
      @confirm="confirm"
    ></AttrPopup>
    <u-popup
      :show="showCartPopup"
      mode="bottom"
      round="10"
      zIndex="999"
      :overlayStyle="{ zIndex: 999 }"
      closeable
      @close="switchBoolean('showCartPopup')"
    >
      <view class="goods-popup">
        <view class="p-y-24 font-center font-32 font-w-600">已选商品</view>
        <scroll-view scroll-y style="min-height: 30vh">
          <view v-if="yixuanGoods.length != 0" class="goods-list">
            <div
              class="goods flex"
              v-for="(item1, i2) in yixuanGoods"
              :key="i2"
            >
              <div class="left">
                <image :src="item1.img" mode="aspectFill" />
              </div>
              <div class="right flex-w-1">
                <view class="goods-name u-line-2">{{ item1.name }}</view>
                <view class="font-24 color-999 flex">
                  规格：<view
                    v-for="(item2, index) of item1.attr"
                    :key="index"
                    >{{ item2.attr_name }}</view
                  >
                </view>
                <view class="price-attr flex-y-center flex-x-sb">
                  <div class="price">
                    <PriceText
                      :price="item1.price"
                      ySize="30rpx"
                      fSize="24rpx"
                    ></PriceText>
                  </div>
                  <!-- :disabled="item1.num > goodsBuyNum" -->
                  <!-- :min="0"
					  :max="yixuanGoods.length > goodsBuyNum?goodsBuyNum:item1.num"
					  :disablePlus = "yixuanGoods.length >= goodsBuyNum && item1.num >= goodsBuyNum" -->
                  <div class="attr-bt" style="background: initial">
                    <u-number-box
                      bgColor="transparent"
                      inputWidth="92rpx"
                      v-model="item1.num"
                      :min="0"
                      @change="valChange($event, i2, item1.goods_id)"
                    ></u-number-box>
                  </div>
                </view>
              </div>
            </div>
          </view>

          <u-empty v-else mode="data" :icon="wxapp_img.empty_data"> </u-empty>
        </scroll-view>
        <view class="chengkai"> </view>
        <view
          class="submit-bt"
          @click="popupOk('showCartPopup')"
          v-if="yixuanGoods.length != 0"
        >
          我选好了
        </view>
      </view>
    </u-popup>
    <view class="chengkai">
      <!-- /pages/goods/goods?id=718 -->
    </view>
    <view class="bottom">
      <view class="bottom-top">
        <view class="bottom-top-view">
          <view class="bottom-top-view-number" v-if="yixuanGoods.length != 0">
            {{ num }}
          </view>
          <view
            class="bottom-top-view-left"
            @click="switchBoolean('showCartPopup')"
          >
            <text class="iconfont icon-cart-full"></text>
            金额: <text>￥{{ infoData.activity_price || "" }}</text>
          </view>
          <view class="bottom-top-view-right" @click="submitGo"> 去结算 </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import wine from "@/api/wine.js";
import AttrPopup from "@/components/goods/AttrPopup";
export default {
  data() {
    return {
      showCartPopup: false,
      // 定时器 离开要清理
      time: null,
      // 商品列表
      list: [],
      // 显示的倒计时
      djsTime: null,
      // 其余信息 比如图片 底部内容等
      infoData: null,
      // 结束时间
      endTime: null,
      // 商品id
      goodsId: null,
      // 索引值
      index: null,
      //活动id
      id: null,
      // 选择的当前商品的 mchid
      mch_id: null,
      // 要提交的数据
      mch_lists: [],
      // 限制购买的数量
      goodsBuyNum: null,
      // 单商户提交
      tijiao: {
        mch_id: null,
        activity_id: null,
        goods_list: [],
      },
      num: 0,
      numTwo: 0,
      dd: "",
      hh: "",
      mm: "",
      ss: "",
      // 已选择的商品的操作
      yixuanGoods: [],
    };
  },
  components: {
    AttrPopup,
  },
  onUnload() {
    clearInterval(this.time);
  },
  onLoad(e) {
    console.log(e);
    this.huoqu(e.id);
    this.id = e.id;
    this.time = setInterval((item) => {
      this.djs(this.endTime);
    }, 1000);
  },
  methods: {
    // 弹出层中我选好了的点击
    popupOk(key) {
      console.log(this.tijiao.goods_list);

      this.tijiao.goods_list.forEach((item, index) => {
        if (item.num < 1) {
          console.log(index, "小于1的值");
          var yaArr = this.tijiao.goods_list.splice(index, 1);
          this.tijiao.goods_list = yaArr;
        }
      });
      this.tijiao.goods_list = [];
      this.tijiao.goods_list = this.yixuanGoods;
      let acctr = [];
      this.tijiao.goods_list.forEach((item, index) => {
        acctr.push(item.num);
        console.log(item.num, "每一个num");
      });
      this.num = acctr.reduce((prev, next) => {
        return prev + next;
      }, 0);
      console.log(this.tijiao.goods_list, "修改后的goods_list");
      this[key] = !this[key];
    },
    valChange(e, a, id) {
      console.log(e, a, id);
      console.log(this.yixuanGoods, "查看");
      setTimeout((item) => {
        if (this.yixuanGoods[a].num == 0) {
          this.yixuanGoods.splice(a, 1);
        }
      }, 100);
      this.$forceUpdate();
      var index = this.list.findIndex((value) => value.id == id);
      var yixuanIndex = this.yixuanGoods.findIndex(
        (value) => value.goods_id == id
      );
      console.log(yixuanIndex, "yixuanIndexyixuanIndexyixuanIndex");
      var index2 = this.tijiao.goods_list.findIndex(
        (value) => value.goods_id == id
      );
      // this.yixuanGoods[yixuanIndex].num = e.value
      if (this.yixuanGoods[yixuanIndex].num <= 0) {
        console.log("走进来了");
        // this.yixuanGoods.splice(index2,1)
        console.log(this.list[index]);
        this.list[index].fool = 0;
        this.tijiao.goods_list.splice(index2, 1);
        this.$forceUpdate();
      } else {
        console.log("走出来了");
        // this.yixuanGoods[a].num = e.value
        this.list[index].fool = e.value;
      }
    },
    switchBoolean(key) {
      this.tijiao.goods_list = [];
      this.tijiao.goods_list = this.yixuanGoods;
      this[key] = !this[key];
      console.log(this.yixuanGoods);
    },
    btnCli() {
      console.log(1);
      this.show = true;
    },
    // 单商户
    confirm(data) {
      console.log(data, "选择后的数据");
      this.singleGoods(data);
      let acctr = [];
      this.yixuanGoods.forEach((item, index) => {
        acctr.push(item.num);
        console.log(item.num, "每一个num");
      });
      this.num = acctr.reduce((prev, next) => {
        return prev + next;
      }, 0);
      // console.log(this.tijiao.goods_list, "this.tijiao.goods_listthis.tijiao.goods_listthis.tijiao.goods_list")
    },
    singleGoods(data) {
      let guigeDetile = {
        goods_id: null,
        num: null,
        attr: [
          {
            attr_id: null,
            attr_name: null,
          },
        ],
      };
      let chooseDetile = {
        img: null,
        name: null,
        goods_id: null,
        num: null,
        attr: [
          {
            attr_id: null,
            attr_name: null,
          },
        ],
      };
      guigeDetile.goods_id = data.goods_id;
      guigeDetile.num = data.num;
      guigeDetile.attr = data.attrData.attr_list;
      chooseDetile.goods_id = data.goods_id;
      chooseDetile.num = data.num;
      chooseDetile.attr = data.attrData.attr_list;
      chooseDetile.img = data.imgUrl;
      chooseDetile.name = data.goodsName;
      // var goods_index = this.yixuanGoods.findIndex(value=>value.goods_id == data.goods_id)
      var list_index = this.list.findIndex(
        (value) => value.id == data.goods_id
      );
      // var tijiao_index = this.tijiao.goods_list.findIndex(value=>value.goods_id == data.goods_id)
      let newType = this.yixuanGoods.findIndex(
        (value) => value.goods_id == data.goods_id
      );
      console.log(newType, "找到购物车中相同的商品的下标");
      if (this.yixuanGoods.length == 0) {
        this.yixuanGoods.push(chooseDetile);
        this.list[this.index].fool = guigeDetile.num;
      } else if (this.yixuanGoods.length != 0 && newType != -1) {
        console.log(this.yixuanGoods[newType]);
        let comparison = this.yixuanGoods.findIndex(
          (item) =>
            JSON.stringify(item.attr) === JSON.stringify(chooseDetile.attr)
        );
        console.log("我找到了相同的商品", this.comparison);
        if (comparison != -1) {
          this.yixuanGoods[comparison].num += data.num;
        } else {
          this.yixuanGoods.push(chooseDetile);
        }
        this.list[list_index].fool += data.num;
      } else {
        // 查看已选择的商品数组
        this.yixuanGoods.push(chooseDetile);
        // 即将提交的商品数组
        // this.tijiao.goods_list.push(guigeDetile)
        this.list[this.index].fool = guigeDetile.num;
      }
    },
    // 多商户
    moreGoods(data) {
      let guigeDetile = {
        mch_id: null,
        activity_id: null,
        goods_list: [
          {
            goods_id: null,
            num: null,
            attr: [
              {
                attr_id: null,
                attr_name: null,
              },
            ],
          },
          {
            goods_id: null,
            num: null,
            attr: [
              {
                attr_id: null,
                attr_name: null,
              },
            ],
          },
        ],
      };
      let accr = {
        goods_id: null,
        num: null,
        attr: [
          {
            attr_id: null,
            attr_name: null,
          },
        ],
      };
      // 商户id
      guigeDetile.mch_id = this.mch_id;
      // 活动id
      guigeDetile.activity_id = this.id;
      console.log(guigeDetile);
      accr.goods_id = data.goods_id;
      accr.num = data.num;
      accr.attr = data.attrData.attr_list;
      console.log(data, "typetypetypetypetypetypetypetype");
      guigeDetile.goods_list = accr;
      this.list[this.index].mch_data = guigeDetile;
      this.mch_lists.push(guigeDetile);
      console.log(this.mch_lists, "修改后提交的数组");
    },
    submit(type, e, index, mch_id) {
      console.log(this.yixuanGoods, this.num, "判断大于时的值");
      let acctr = [];
      this.yixuanGoods.forEach((item, index) => {
        acctr.push(item.num);
        console.log(item.num, "每一个num");
      });
      this.num = acctr.reduce((prev, next) => {
        return prev + next;
      }, 0);
      if (this.yixuanGoods.length >= this.goodsBuyNum) {
        uni.showToast({
          title: "商品数量超过规定数量",
          icon: "none",
        });
      } else if (this.num >= this.goodsBuyNum) {
        uni.showToast({
          title: "商品数量超过规定数量",
          icon: "none",
        });
      } else {
        this.goodsId = e;
        this.index = index;
        this.mch_id = mch_id;
        console.log(type, e, "typetypetypetypetypetypetypetype");
        this.$refs["AttrPopup"].showPopup(type);
      }
      // this.goodsId = e
      // this.index = index
      // this.mch_id = mch_id
      // console.log(type, e, "typetypetypetypetypetypetypetype")
      // this.$refs['AttrPopup'].showPopup(type);
    },
    // 提交时
    submitGo() {
      this.tijiao.mch_id = 0;
      this.tijiao.activity_id = this.id;
      this.tijiao.goods_list = this.yixuanGoods;
      let acctr = [];
      this.tijiao.goods_list.forEach((item, index) => {
        acctr.push(item.num);
        console.log(item.num, "每一个num");
      });
      this.num = acctr.reduce((prev, next) => {
        return prev + next;
      }, 0);
      console.log(
        this.tijiao.goods_list,
        "this.tijiao.goods_listthis.tijiao.goods_listthis.tijiao.goods_list"
      );
      if (
        this.tijiao.goods_list.length < this.goodsBuyNum &&
        this.num < this.goodsBuyNum
      ) {
        uni.showToast({
          title: `至少选择${this.goodsBuyNum}件商品`,
          icon: "none",
        });
      } else {
        let arr = [];
        arr.push(this.tijiao);
        let data = {
          mch_list: JSON.stringify(arr),
        };
        wine.orderNewSubmitPreview(data).then((res) => {
          console.log(res);
          if (res.code == 0) {
            this.$utils.toUrl(
              "/pages/order-submit/order-submit?goodsData=" +
                encodeURIComponent(JSON.stringify(res.data.mch_list))
            );
          }
        });
      }
    },
    countTime(e) {
      var that = this;
      let nowTime = new Date().getTime(); //当前时间
      let endtime = e * 1000;
      let leftTime = endtime - nowTime;
      if (nowTime < endtime) {
        that.dd = that.checkTime(Math.floor(leftTime / 1000 / 60 / 60 / 24));
        that.hh = that.checkTime(Math.floor((leftTime / 1000 / 60 / 60) % 24));
        that.mm = that.checkTime(Math.floor((leftTime / 1000 / 60) % 60));
        that.ss = that.checkTime(Math.floor((leftTime / 1000) % 60));
      } else if (nowTime > e * 1000) {
        //当前时间大于结束时间，不显示倒计时的操作
        console.log("结束了");
        uni.showToast({
          title: `活动${this.infoData.activity_name}已结束`,
          icon: "none",
        });
        uni.navigateBack({
          delta: -1,
        });
        that.list[index].show = 1;
      }
    },
    xiangqing(e) {
      uni.navigateTo({
        url: `/pages/goods/goods?id=${e}&activity_id=${this.id}`,
      });
    },
    djs() {
      this.countTime(this.endTime);
    },
    checkTime(index) {
      if (index < 10) {
        return "0" + index;
      } else {
        return index;
      }
    },
    huoqu(e) {
      let data = {
        activity_id: e,
      };
      wine.orderActivityDetail(data, 1).then((res) => {
        console.log(res);
        if (res.msg == "活动已结束") {
          uni.navigateBack({
            delta: -1,
          });
          clearInterval(this.time);
        } else {
          this.infoData = res.info;
          this.list = res.data;
          this.list.forEach((item, index) => {
            item.goodsIndex = index;
          });
          this.endTime = res.info.end_time;
          this.goodsBuyNum = res.info.activity_num;
          uni.showModal({
            title: "提示",
            showCancel: false,
            content: `您只能选择${this.goodsBuyNum}件商品`,
            success: function (res) {},
          });
          uni.setNavigationBarTitle({
            title: res.info.activity_name,
          });
        }
        // this.text = res.info.activity_name
      });
    },
  },
};
</script>
<style>
page {
  width: 100%;
  height: 100%;
  background-color: #f6f6f6;
}
</style>
<style scoped lang="scss">
.top {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  image {
    width: 100%;
    height: 360rpx;
  }

  view {
    // width: 280rpx;
    height: 54rpx;
    background: #ffffff;
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 28rpx 0px 0px 28rpx;
    position: absolute;
    bottom: 18rpx;
    right: 0;
    text-align: center;
    line-height: 54rpx;

    text {
      color: #f0250e;
      padding-left: 5rpx;
      padding-right: 5rpx;
    }
  }
}

.center {
  width: 750rpx;
  background-color: #fff;
  margin-top: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .center-view {
    width: 680rpx;
    height: 248rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;

    image {
      width: 192rpx;
      height: 192rpx;
      border-radius: 10rpx;
    }

    .center-view-text {
      width: 346rpx;
      height: 192rpx;
      margin-left: 20rpx;

      .center-view-text-title {
        width: 312rpx;
        height: 82rpx;
        font-size: 30rpx;
        font-family: PingFang SC;
        font-weight: bold;
        color: #262626;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }

      .center-view-text-yueShou {
        height: 34rpx;
        font-size: 24rpx;
        font-family: PingFang SC;
        font-weight: 400;
        color: #8c8c8c;
        margin-top: 10rpx;
      }

      .center-view-text-num {
        height: 52rpx;
        font-size: 38rpx;
        font-family: PingFang SC;
        font-weight: bold;
        color: #f0250e;
        margin-top: 10rpx;
      }
    }

    .center-view-guige {
      width: 100rpx;
      height: 44rpx;
      background: #ffc91f;
      border-radius: 22rpx;
      text-align: center;
      line-height: 44rpx;
      position: relative;
      margin-top: 150rpx;
      font-weight: bold;

      view {
        position: absolute;
        right: -15rpx;
        top: -20rpx;
        width: 32rpx;
        height: 32rpx;
        text-align: center;
        line-height: 32rpx;
        background: #f84a33;
        border-radius: 120rpx;
        color: #fff;
        font-size: 20rpx;
        font-family: PingFang SC;
        font-weight: bold;
      }
    }
  }
}

.chengkai {
  height: 200rpx;
}
.goods {
  .left {
    margin-right: 20rpx;
    width: 160rpx;
    height: 160rpx;
    border-radius: 10rpx;
    overflow: hidden;
    image {
      width: 100%;
      height: 100%;
    }
  }

  .right {
    .goods-name {
      font-weight: 600;
      line-height: 42rpx;
      height: 84rpx;
    }

    .price-attr {
      .attr-bt {
        position: relative;
        left: 0;
        right: 0;
        background: #ff0000;
        color: #fff;
        text-align: center;
        padding: 6rpx 16rpx;
        border-radius: 20rpx;
        font-size: 24rpx;
        .attr-num {
          position: absolute;
          right: 0;
          top: 0;
          transform: translate(50%, -50%);
          background: #fff;
          border: 1px solid red;
          color: red;
          font-size: 22rpx;
          line-height: 30rpx;
          height: 30rpx;
          min-width: 30rpx;
          border-radius: 30rpx;
        }
      }
    }
  }
}
.goods-popup {
  padding-bottom: 130rpx;
  position: relative;
  .chengkai {
    height: 85rpx;
    width: 100%;
  }
  .submit-bt {
    flex: 1;
    width: 640rpx;
    height: 76rpx;
    border-radius: 35rpx;
    background: linear-gradient(90deg, #f22407 0%, #f84d17 100%);
    position: absolute;
    bottom: 10rpx;
    text-align: center;
    line-height: 76rpx;
    margin-left: 60rpx;
    font-size: 26rpx;
    font-weight: 600;
    color: #ffffff;
  }
  scroll-view {
    max-height: 50vh;
    .goods-list {
      padding: 0 24rpx;
    }
  }
}
.bottom {
  width: 100%;
  height: 168rpx;
  position: fixed;
  bottom: 0;
  background: #ffffff;

  .bottom-top {
    height: 112rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .bottom-top-view {
      width: 694rpx;
      height: 80rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      .bottom-top-view-number {
        width: 32rpx;
        height: 32rpx;
        text-align: center;
        line-height: 32rpx;
        background: #f84a33;
        border-radius: 120rpx;
        color: #fff;
        font-size: 20rpx;
        font-family: PingFang SC;
        font-weight: bold;
        position: absolute;
        top: 4rpx;
        left: 20rpx;
      }
      .iconfont {
        width: 68rpx;
        height: 68rpx;
        line-height: 68rpx;
        font-size: 50rpx;
      }
      .bottom-top-view-left {
        font-size: 24rpx;
        font-family: PingFang SC;
        font-weight: 600;
        color: #262626;

        text {
          font-size: 40rpx;
          font-family: PingFang SC;
          font-weight: bold;
          color: #262626;
        }
      }

      .bottom-top-view-right {
        width: 224rpx;
        height: 80rpx;
        text-align: center;
        line-height: 80rpx;
        font-size: 32rpx;
        font-family: PingFang SC;
        font-weight: bold;
        color: #262626;
        background: #ffc91f;
        border-radius: 120rpx;
      }
    }
  }
}
</style>

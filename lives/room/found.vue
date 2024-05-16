<template>
  <view v-if="pageData" class="body">
    <!-- #ifdef H5 -->
    <div id="live-pusher">当前环境不支持直播，请改用小程序直播</div>
    <!-- #endif -->

    <!-- #ifndef H5 -->
    <live-pusher
      v-if="room_info.push_url"
      id="live-pusher"
      :mode="mode"
      :waiting-image="room_info.pic_url"
      :beauty="beauty"
      :whiteness="whiteness"
      :enable-mic="enable_mic"
      :enable_ans="enable_ans"
      @statechange="statechange"
      :url="room_info.push_url"
    >
    </live-pusher>
    <!-- #endif -->

    <div v-if="pageData.room_type != 'liveing'" class="live-push">
      <WNavbar fixed bgColor="initial" color="color">
        <div
          @click="checkLocation"
          class="nav-title flex-y-center"
          slot="center"
        >
          <text class="iconfont icon-dingwei font-40"></text>
          <text class="flex-w-1 u-line-1 font-left">
            {{ location ? location.address : '定位' }}
          </text>
        </div>
      </WNavbar>

      <!-- 菜单选项 -->
      <view class="menus flex-x-end flex-y-center">
        <div
          @click="clickMenu('meihua')"
          class="menu flex-col flex-x-center flex-y-center"
        >
          <text class="iconfont icon-ziyuan font-50"></text>
          <text>美化</text>
        </div>

        <div
          @click="clickMenu('goods')"
          class="menu flex-col flex-x-center flex-y-center"
        >
          <text class="iconfont icon-shangpin font-50"></text>
          <text>商品</text>
        </div>

        <div
          @click="clickMenu('setting')"
          class="menu flex-col flex-x-center flex-y-center"
        >
          <text class="iconfont icon-shezhi font-50"></text>
          <text>直播设置</text>
        </div>

        <div
          v-if="room_info"
          @click="showShare = true"
          class="menu flex-col flex-x-center flex-y-center"
        >
          <text class="iconfont icon-zhuanfa font-50"></text>
          <text>分享</text>
        </div>
      </view>

      <!-- 封面主播信息 -->
      <view class="cover-box bg-rd-rgba flex-y-center">
        <div class="left" @click="uploadLivePic">
          <image
            :src="live_pic ? live_pic : userInfo.avatar_url"
            style="width: 100%; height: 100%"
            mode="aspectFill"
          />
          <div class="tip">{{ live_pic ? '更换封面' : '上传封面' }}</div>
        </div>
        <div class="right flex-w-1 m-l-20">
          <view class="font-30 m-b-10">{{ pageData.live_info.name }}</view>
          <view
            @click="chek_address = !chek_address"
            class="flex-y-center font-26"
          >
            <text
              v-if="chek_address"
              class="iconfont icon-success-fill price-color font-40"
            ></text>
            <text v-else class="iconfont icon-xuanzekuangmoren font-40"></text>
            <text class="u-line-1"
              >显示位置: {{ location.address || '定位' }}</text
            >
          </view>
        </div>
      </view>

      <!-- 直播间标题及商品 -->
      <view class="live-title-goods bg-rd-rgba">
        <div @click="clickMenu('goods')" class="goods-check font-center">
          已选直播商品({{ checkGoods.length }})
        </div>

        <div class="m-y-30">
          <input type="text" v-model="room_title" placeholder="直播间标题" />
        </div>

        <template v-if="!room_info">
          <view
            @click="is_pre_play = !is_pre_play"
            class="flex-y-center flex-x-center"
          >
            <text
              v-if="is_pre_play"
              class="iconfont icon-success-fill price-color font-40"
            ></text>
            <text v-else class="iconfont icon-xuanzekuangmoren font-40"></text>
            <text> 是否为预播 </text>
          </view>

          <view v-if="is_pre_play" class="font-center font-26">
            <view class="m-t-20">
              <picker
                mode="date"
                :value="pre_play_date"
                @change="dateTimeChange($event, 'pre_play_date')"
              >
                直播日期:{{ pre_play_date || '请选择' }}
              </picker>
            </view>
            <view class="m-t-20">
              <picker
                mode="time"
                :value="pre_play_time"
                @change="dateTimeChange($event, 'pre_play_time')"
              >
                直播时间: {{ pre_play_time || '请选择' }}
              </picker>
            </view>
          </view>
        </template>

        <view v-else class="font-30 font-center">
          预播时间：{{ room_info.pre_play_date }} {{ room_info.pre_play_time }}
        </view>
      </view>

      <view
        v-if="is_pre_play && pageData.room_type == 'pre'"
        class="submit-push"
        @click="timeStartLive(true)"
      >
        开始视频直播
      </view>
      <view v-else class="submit-push" @click="submit">
        <template v-if="is_pre_play">创建直播间</template>
        <template v-else>开始视频直播</template>
      </view>
    </div>

    <!-- 正在开播 -->
    <div v-else class="live-box">
      <!-- <u-navbar @leftClick="$utils.backTo()" bgColor="initial" leftIconColor="#fff" placeholder>
				
			</u-navbar> -->

      <WNavbar fixed :isZhanwei="false" bgColor="initial" color="#f5f5f5">
        <div
          @click="checkLocation"
          class="nav-title color-fff live-nav-title flex-y-center"
          slot="center"
        >
          <image :src="userInfo.avatar_url" mode="aspectFill" />
          <view class="flex-w-1">
            <view>{{ pageData.live_info.desc }}</view>
            <view class="u-line-1 flex font-22">
              <text
                v-if="room_info.address && room_info.address != 'false'"
                class="flex-w-1 u-line-1 m-r-10"
              >
                {{ room_info.address }}
              </text>
              <text>{{ room_info.look_num }}观看</text>
            </view>
          </view>
        </div>
      </WNavbar>

      <div class="bottom-menus">
        <div @click="clickInputBt" class="input-bt">聊点什么吧~</div>
        <div class="right-bt flex-w-1">
          <text
            @click="clickMenu('meihua')"
            class="iconfont icon-ziyuan"
          ></text>
          <text @click="onEnd" class="iconfont icon-kaiguan"></text>
          <text
            @click="clickMenu('setting')"
            class="iconfont icon-gengduo-x"
          ></text>
        </div>
      </div>
      <!-- 商品bt -->
      <div class="goods-icon-box" @click="clickMenu('goods')">
        <div class="iconfont icon-shangpin font-50"></div>
        <div class="num">
          {{ startGoods.length }}
        </div>
      </div>

      <div class="chat-box">
        <scroll-view
          :scroll-into-view="
            commentList.length
              ? 'item' + commentList[commentList.length - 1].id
              : ''
          "
          scroll-y
          style="height: 100%"
        >
          <div class="item flex color-999" style="background: initial">
            <text> 平台提醒：</text>
            <text>{{ pageData.tips }}</text>
          </div>
          <div
            :class="[item.type == 0 && 'type-0']"
            v-for="item in commentList"
            :key="item.id"
            class="item flex"
            :id="'item' + item.id"
          >
            <text :style="{ color: item.color }">
              <template v-if="item.type == 0">
                <template v-if="item.user_id == userInfo.id"> 主播： </template>
                <template v-else>{{ item.nickname }}</template>
              </template>
              <template v-else-if="item.type == 3">提示：</template>
            </text>
            <text>{{ item.content }}</text>
          </div>
        </scroll-view>
      </div>

      <div v-if="chatInput" class="chat-input">
        <u-input
          @blur="chatInput = false"
          @confirm="chatSubmit"
          v-model="catValue"
          type="text"
          :focus="chatInput"
          placeholder="聊点什么吧~"
          border="initial"
        >
        </u-input>
      </div>
    </div>

    <u-popup
      :show="showSettingPopup"
      round="20rpx"
      @close="showSettingPopup = false"
      :bgColor="
        clickType == 'goods' || clickType == 'setting' ? '#fff' : '#121212'
      "
      mode="bottom"
      closeable
    >
      <!-- 选择美颜 -->
      <div v-if="clickType == 'meihua'" class="meihua-popup color-fff">
        <div class="slider-box flex-y-center">
          <div class="flex-w-1">
            <!-- 美白 -->
            <slider
              v-if="meihua_type == 1"
              v-model="whiteness"
              @change="sliderChange($event, 'whiteness')"
              min="0"
              max="9"
              activeColor="#ff0000"
              block-size="14"
              step="1"
              show-value
            />
            <!-- 美艷 -->
            <slider
              v-if="meihua_type == 2"
              v-model="beauty"
              @change="sliderChange($event, 'beauty')"
              min="0"
              max="9"
              activeColor="#ff0000"
              block-size="14"
              step="1"
              show-value
            />
          </div>
        </div>
        <div class="tabs-setting">
          <div class="tab check">美化</div>
        </div>
        <div class="item-box">
          <div
            @click="meihua_type = 1"
            :class="[meihua_type == 1 && 'check']"
            class="item"
          >
            <text class="iconfont icon-ziyuan"></text>
            <text>美白</text>
          </div>
          <div
            @click="meihua_type = 2"
            :class="[meihua_type == 2 && 'check']"
            class="item"
          >
            <text class="iconfont icon-ziyuan"></text>
            <text>美颜</text>
          </div>
        </div>
      </div>

      <!-- 选择商品 -->
      <div v-else-if="clickType == 'goods'" class="goods-list-popup flex-col">
        <!-- 直播商品 -->
        <template v-if="room_info && pageData.room_type != 'pre'">
          <div class="title">{{ room_info ? '直播商品' : '添加商品' }}</div>
          <scroll-view scroll-y class="flex-h-1">
            <div
              @click="$utils.toUrl('/pages/goods/goods?id=' + goods.goods_id)"
              class="goods-item flex"
              v-for="(goods, i) in startGoods"
              :key="i"
            >
              <div class="left">
                <image :src="goods.cover_pic" mode="aspectFill" />
                <div class="num color-fff">{{ i + 1 }}</div>
              </div>
              <div class="right">
                <view class="u-line-2">{{ goods.name }}</view>

                <view class="price-num m-y-20">
                  <text class="price-color">
                    ￥<text class="font-36">{{ goods.price }}</text>
                  </text>
                  <text class="color-999 font-24 m-l-20">
                    <template v-if="!room_info || pageData.room_type == 'pre'">
                      剩余{{ goods.goods_num }}件
                    </template>
                  </text>
                </view>

                <div @click.stop class="yongjin-bt flex-x-sb flex-y-center">
                  <template v-if="!room_info || pageData.room_type == 'pre'">
                    <text style="color: #ff7e00">佣金{{ goods.reward }}</text>
                    <text
                      @click="switchGoods(goods, i)"
                      :class="['bt', !goods.check && 'check']"
                      >{{ goods.check ? '移出' : '添加' }}</text
                    >
                  </template>
                </div>
              </div>
            </div>
          </scroll-view>
        </template>

        <!-- 待开播商品 -->
        <template v-else>
          <div class="title">{{ room_info ? '直播商品' : '添加商品' }}</div>
          <scroll-view scroll-y class="flex-h-1">
            <div
              @click="$utils.toUrl('/pages/goods/goods?id=' + goods.goods_id)"
              class="goods-item flex"
              v-for="(goods, i) in liveGoods"
              :key="i"
            >
              <div class="left">
                <image :src="goods.cover_pic" mode="aspectFill" />
                <div class="num color-fff">{{ i + 1 }}</div>
              </div>
              <div class="right">
                <view class="u-line-2">{{ goods.name }}</view>

                <view class="price-num m-y-20">
                  <text class="price-color">
                    ￥<text class="font-36">{{ goods.price }}</text>
                  </text>
                  <text class="color-999 font-24 m-l-20">
                    <template v-if="!room_info || pageData.room_type == 'pre'">
                      剩余{{ goods.goods_num }}件
                    </template>
                  </text>
                </view>

                <div @click.stop class="yongjin-bt flex-x-sb flex-y-center">
                  <template v-if="!room_info || pageData.room_type == 'pre'">
                    <text style="color: #ff7e00">佣金{{ goods.reward }}</text>
                    <text
                      @click="switchGoods(goods, i)"
                      :class="['bt', !goods.check && 'check']"
                      >{{ goods.check ? '移出' : '添加' }}</text
                    >
                  </template>
                </div>
              </div>
            </div>
          </scroll-view>
        </template>
      </div>

      <!-- 直播设置 -->
      <div v-if="clickType == 'setting'" class="setting-box">
        <div class="title">直播设置</div>

        <div class="list-title">直播画面</div>
        <div class="list">
          <div @click="mode = 'SD'" class="item">
            <text
              v-if="mode == 'SD'"
              class="iconfont icon-success-fill price-color font-36"
            ></text>
            <text v-else class="iconfont icon-xuanzekuangmoren font-36"></text>
            <text>标清</text>
          </div>
          <div @click="mode = 'HD'" class="item">
            <text
              v-if="mode == 'HD'"
              class="iconfont icon-success-fill price-color font-36"
            ></text>
            <text v-else class="iconfont icon-xuanzekuangmoren font-36"></text>
            <text>高清</text>
          </div>
          <div @click="mode = 'FHD'" class="item">
            <text
              v-if="mode == 'FHD'"
              class="iconfont icon-success-fill price-color font-36"
            ></text>
            <text v-else class="iconfont icon-xuanzekuangmoren font-36"></text>
            <text>超清</text>
          </div>
          <div @click="mode = 'RTC'" class="item">
            <text
              v-if="mode == 'RTC'"
              class="iconfont icon-success-fill price-color font-36"
            ></text>
            <text v-else class="iconfont icon-xuanzekuangmoren font-36"></text>
            <text>实时通话</text>
          </div>
        </div>

        <div class="list-title">播放设置</div>
        <div class="flex-y-center flex-x-sb m-b-20">
          <text>麦克风</text>
          <u-switch
            v-model="enable_mic"
            activeColor="#5ac725"
            size="20"
          ></u-switch>
        </div>
        <div class="flex-y-center flex-x-sb m-b-20">
          <text>音频噪声抑制</text>
          <u-switch
            v-model="enable_ans"
            activeColor="#5ac725"
            size="20"
          ></u-switch>
        </div>

        <!-- 菜单选项 -->
        <div class="list-title">其他</div>

        <view class="menus flex-y-center">
          <div
            @click="switchCamera"
            class="menu flex-col flex-x-center flex-y-center"
          >
            <text class="iconfont icon-fanzhuanjingtou font-50"></text>
            <text>翻转</text>
          </div>

          <div
            v-if="room_info"
            @click="showShare = true"
            class="menu flex-col flex-x-center flex-y-center"
          >
            <text class="iconfont icon-zhuanfa font-50"></text>
            <text>分享</text>
          </div>
        </view>
      </div>
    </u-popup>

    <Share :showPopup.sync="showShare" type="lives" :isShowWx="false" :data="room_info.id"></Share>

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
import Share from '@/components/share/share';
import request from '@/utils/request';
import WNavbar from '@/components/w-navbar';
export default {
  components: {
    Share,
    WNavbar,
  },
  data() {
    return {
      pageData: '',
      location: '',
      chek_address: false, //是否显示位置
      is_pre_play: false, //是否为预播
      pre_play_time: '', //预播时间
      pre_play_date: '', //预播日期
      showSettingPopup: false, //设置弹框开关
      showShare: false, //分享弹框
      clickType: '', //当前选项类型
      room_title: '',
      liveGoods: [], //直播可以带货商品列表
      startGoods: [], //开播带货商品
      live_pic: '', //直播间封面
      mode: 'RTC', //推流视频清晰度SD HD FHD RTC实时通话
      beauty: 5, //美颜范围 0-9
      whiteness: 5, //美白取值范围0-9
      enable_mic: true, //麦克风开关
      enable_ans: false, //音频噪声抑制
      meihua_type: 1, //1美白, 2美颜
      room_info: '', //推流数据
      liveContext: '', //推流dom
      catValue: '', //聊天value
      chatInput: false,
      commentList: [], // 聊天列表
      intervalComment: '', //获取聊天列表计时
      timeout: '', //倒计时
    };
  },
  onLoad() {
    this.loadData();
  },
  onShow() {
    uni.setKeepScreenOn({
      keepScreenOn: true,
    });
    if (this.pageData.room_type == 'liveing') {
      this.getComment();
      this.intervalComment = setInterval(() => {
        this.getComment();
      }, 4500);
    }
  },
  onHide() {
    clearInterval(this.intervalComment);
    uni.setKeepScreenOn({
      keepScreenOn: false,
    });
  },

  onUnload() {
    clearInterval(this.intervalComment);
    uni.setKeepScreenOn({
      keepScreenOn: false,
    });
  },
  onReady() {
    // 注意：需要在onReady中 或 onLoad 延时
    /* #ifndef H5*/
    this.liveContext = uni.createLivePusherContext('live-pusher', this);
    this.liveContext.startPreview();
    /* #endif */
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.lives.liveGetInfo({});
      this.pageData = res.data;

      if (res.data.room_info) {
        this.room_info = res.data.room_info;
        this.$nextTick(() => {
          this.liveContext.start()
        })

        if (this.pageData.room_type == 'liveing') {
          await this.getComment();
          this.intervalComment = setInterval(() => {
            this.getComment();
          }, 4500);
        }
      }
    },
    async getLiveGoods() {
      if (this.room_info && this.pageData.room_type != 'pre') {
        if (this.startGoods.length) return;
        const res = await this.$requestAll.lives.getGoods(
          {
            room_id: this.pageData.room_info.id,
          },
          true
        );
        this.startGoods = res.data.list;
      } else {
        if (this.liveGoods.length) return;
        const res = await this.$requestAll.lives.getGoodsList(
          {
            type: 'live',
            anchor_id: this.pageData.live_info.id,
          },
          true
        );
        this.liveGoods = res.data.list;
        // 如果是预约
        if (
          this.pageData.room_type == 'pre' &&
          this.room_info.goods_id.length
        ) {
          this.liveGoods = this.liveGoods.map(goods => {
            if (this.room_info.goods_id.indexOf(goods.goods_id) != -1) {
              goods.check = true;
            }
            return goods;
          });
        }
      }
    },
    async getComment() {
      const res = await this.$requestAll.lives.getComment({
        last_id: this.commentList[this.commentList.length - 1]?.id,
        like_count: 0,
        room_id: this.room_info.id,
      });
      this.commentList.push(...res.data.list);
    },
    checkLocation() {
      var that = this;
      uni.chooseLocation({
        success: function (res) {
          that.location = res;
        },
      });
    },
    async clickMenu(type) {
      this.clickType = type;
      if (type == 'goods') {
        await this.getLiveGoods();
      }
      this.showSettingPopup = true;
    },
    switchCamera() {
      this.liveContext.switchCamera();
    },
    // 商品添加切換
    switchGoods(goods, index) {
      goods.check = !goods.check;
      this.$set(this.liveGoods, index, goods);
    },
    // 预播日期change
    dateTimeChange(e, val) {
      console.log(e, val);
      this[val] = e.detail.value;
    },
    // 美白進度條切換
    sliderChange({ detail }, val) {
      this[val] = detail.value;
    },
    // 上传封面
    uploadLivePic() {
      uni.chooseImage({
        count: 1,
        success: async chooseImageRes => {
          const tempFilePaths = chooseImageRes.tempFilePaths[0];
          const res = await request.UPLOAD_IMAGE(
            tempFilePaths,
            '/default/upload-image'
          );
          this.live_pic = res.data.url;
        },
      });
    },
    // 开播
    async submit() {
      if (!this.room_title) return uni.$u.toast('请填写直播间标题');
      if (!this.live_pic) return uni.$u.toast('请上传封面图');
      if (this.chek_address && !this.location)
        return uni.$u.toast('请选择地址');
      if (this.is_pre_play && (!this.pre_play_date || !this.pre_play_time))
        return uni.$u.toast('请选择预约时间');

      // 获取选中商品id组
      let goods_id = [];
      for (var i = 0; i < this.liveGoods.length; i++) {
        if (this.liveGoods[i].check) {
          goods_id.push(this.liveGoods[i].goods_id);
        }
      }
      var formData = {
        cat_id: this.pageData.live_info.cat_id,
        chek_address: this.chek_address || 0,
        address: (this.chek_address && this.location.address) || '',
        live_pic: this.live_pic,
        goods_id: JSON.stringify(goods_id),
        room_title: this.room_title,
        is_pre_play: this.is_pre_play,
        pre_play_date:
          (this.is_pre_play && this.pre_play_date) ||
          uni.$u.timeFormat(new Date(), 'yyyy-mm-dd'),
        pre_play_time: (this.is_pre_play && this.pre_play_time) || '',
      };
      console.log(formData);

      //是预约需以预约接口提交开播
      //如果是预约模式，先判断是否时间已到，如果已到或已选时间小于当前时间则提示开播
      //如果未到时间，开始倒计时开播。第一次进入页面也需判断是否是预约根据时间倒计时开播
      //this.loadData()用来获取直播间信息主要判断当前直播间类型。

      // if (this.pageData.room_type == 'pre') {
      //   formData.room_id = this.room_info.id;
      //   await this.$requestAll.lives.startLiveByPre(formData, true);
      //   this.loadData();
      // } else {
      if (this.is_pre_play) {
        // 创建预播间  // 更新直播间信息
        await this.$requestAll.lives.livePush(formData, true);
        this.loadData();
        // 倒计时开播
        await this.timeStartLive();
      } else {
        console.log('开播');
        await this.$requestAll.lives.livePush(formData, true);
        this.loadData();
      }
      // }
    },
    async timeStartLive(isPre) {
      let goods_id = [];
      this.checkGoods.length &&
        this.checkGoods.forEach(goods => {
          goods_id.push(goods.goods_id);
        });
      var formData = {
        room_id: this.room_info.id || '',
        cat_id: this.pageData.live_info.cat_id,
        chek_address: this.chek_address,
        address: this.chek_address && this.location.address,
        live_pic: this.live_pic,
        goods_id: JSON.stringify(goods_id),
        room_title: this.room_title,
        is_pre_play: false,
      };

      // 时间未倒 手动强制开播
      if (isPre) {
        await this.$requestAll.lives.startLiveByPre(formData, true);
        this.loadData();
        return;
      }

      const time = new Date(
        this.pre_play_date + ' ' + this.pre_play_time
      ).getTime();
      const cTime = new Date().getTime();

      this.timeout = setTimeout(() => {
        uni.showModal({
          title: '提示',
          content: '当前预约时间已到是否直接开播？',
          success: async res => {
            if (res.confirm) {
              if (this.pageData.room_type == 'pre') {
                await this.$requestAll.lives.startLiveByPre(formData, true);
              } else {
                await this.$requestAll.lives.livePush(formData, true);
              }
              this.loadData();
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          },
        });
      }, time - cTime);
    },
    // 结束直播
    onEnd() {
      var that = this;
      uni.showModal({
        title: '提示',
        content: '您确定结束直播吗？',
        success: async function (res) {
          if (res.confirm) {
            that.$utils.toUrl('/lives/room/end', 'redirectTo');
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        },
      });
    },
    // 点击评论显示输入框
    clickInputBt() {
      this.chatInput = true;
    },

    // 评论发送
    async chatSubmit() {
      console.log('fasong', this.catValue);
      await this.$requestAll.lives.addComment({
        content: this.catValue,
        room_id: this.room_info.id,
      });
      this.catValue = '';
      this.getComment();
    },
    // 推流状态改变
    statechange(detail) {
      console.log(detail);
    },
  },
  computed: {
    checkGoods() {
      return this.liveGoods.length
        ? this.liveGoods.filter(item => item.check)
        : [];
    },
    userInfo() {
      return uni.getStorageSync('userInfo');
    },
    isStart() {
      return this.room_info && !this.pageData.room_info == 'pre';
    },
  },
  watch: {
    room_info(val) {
      console.log('room_infochange', val);
      if (val) this.getLiveGoods();

      // 判断是否预约直播对应赋值
      if (this.pageData.room_type == 'pre') {
        this.room_title = val.desc;

        this.live_pic = val.pic_url;
        this.is_pre_play = true;
        this.pre_play_date = val.pre_play_date;
        this.pre_play_time = val.pre_play_time;

        if (val.address != 'false') {
          this.location = {
            address: val.address,
          };
          this.chek_address = true;
        }
      } else {
        this.liveContext &&
          this.liveContext.start({
            success: a => {
              console.log('livePusher.start:' + JSON.stringify(a));
            },
          });
      }

      if (this.pageData.room_type == 'pre' && !this.timeout)
        this.timeStartLive();
    },
  },
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  position: relative;
  top: 0;
  left: 0;
  background: #000;
  font-size: 30rpx;
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  #live-pusher {
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: #000;
    display: flex;
    justify-content: center;
    align-items: center;
    color: red;
  }
}

.nav-title {
  width: 100%;
  height: 44px;
}

.live-nav-title {
  > image {
    width: 70rpx;
    height: 70rpx;
    border-radius: 50%;
    margin-right: 20rpx;
  }
}

// 美颜选择弹框
.meihua-popup {
  padding: 0 30rpx 30rpx;
  font-size: 28rpx;

  .slider-box {
    position: absolute;
    top: -100rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 80vw;
  }

  .tabs-setting {
    line-height: 80rpx;
    margin-bottom: 20rpx;

    .tab {
      display: inline-block;
      padding: 0 20rpx;
    }

    .check {
      position: relative;

      &::after {
        content: '';
        position: absolute;
        left: 50%;
        bottom: 6rpx;
        transform: translateX(-50%);
        width: 40rpx;
        height: 4rpx;
        background: #fff;
      }
    }
  }

  .item-box {
    display: flex;

    .item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-right: 20rpx;
      font-size: 24rpx;

      .iconfont {
        width: 100rpx;
        height: 100rpx;
        line-height: 100rpx;
        text-align: center;
        border-radius: 50%;
        background: #323232;
        margin-bottom: 10rpx;
      }
    }

    .check {
      color: #ff0000;

      .iconfont {
        color: #ffffff;
        border: 1px solid #ff0000;
      }
    }
  }
}

// 商品选择弹框
.goods-list-popup {
  padding: 0 30rpx 30rpx;
  color: #333;
  height: 50vh;

  .title {
    line-height: 100rpx;
    text-align: center;
    font-size: 36rpx;
    font-weight: 700;
  }

  .goods-item {
    margin-bottom: 20rpx;

    .left {
      position: relative;
      width: 220rpx;
      height: 220rpx;

      > image {
        width: 100%;
        height: 100%;
      }

      .num {
        position: absolute;
        left: 0;
        top: 0;
        line-height: 50rpx;
        padding: 0 30rpx;
        border-radius: 25rpx 0 25rpx 0;
        background: rgba(0, 0, 0, 0.3);
      }
    }

    .right {
      margin-left: 20rpx;
      flex: 1;
      width: 0;
      font-size: 26rpx;

      .yongjin-bt {
        .bt {
          width: 100rpx;
          text-align: center;
          line-height: 48rpx;
          border: 2rpx solid #999;
          border-radius: 24rpx;
        }

        .check {
          border-color: #ff0000;
          color: #ff0000;
        }
      }
    }
  }
}

.setting-box {
  padding: 0 30rpx 30rpx;
  color: #333;

  .title {
    line-height: 100rpx;
    text-align: center;
    font-size: 36rpx;
    font-weight: 700;
  }

  .list-title {
    color: #999;
    font-weight: 700;
    font-size: 24rpx;
    margin-bottom: 20rpx;
  }

  .list {
    display: flex;
    flex-wrap: wrap;

    .item {
      display: flex;
      align-items: center;
      margin-right: 20rpx;
      margin-bottom: 20rpx;
    }
  }
}

.menus {
  height: 100rpx;
  font-size: 24rpx;

  .menu {
    padding: 0 20rpx;
  }
}

.live-push {
  position: relative;
  z-index: 99;
  height: 100%;
  width: 100vw;
  height: 100vh;
  color: #fff;

  .bg-rd-rgba {
    padding: 10rpx;
    margin: 20rpx 50rpx;
    background: rgba($color: #000, $alpha: 0.4);
    border-radius: 20rpx;
  }

  .cover-box {
    margin-top: 50rpx;

    .left {
      position: relative;
      width: 120rpx;
      height: 120rpx;

      .tip {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.4);
        line-height: 1.6;
        font-size: 20rpx;
        text-align: center;
      }
    }
  }

  .live-title-goods {
    margin-top: 30rpx;
    padding-top: 30rpx;
    padding-bottom: 30rpx;

    input {
      height: 80rpx;
      line-height: 80rpx;

      font-size: 42rpx;
      text-align: center;

      &::placeholder {
        line-height: 80rpx;
      }
    }
  }

  .submit-push {
    position: absolute;
    bottom: env(safe-area-inset-bottom);
    left: 50%;
    transform: translateX(-50%);
    width: 70vw;
    line-height: 100rpx;
    background: #fb2020;
    border-radius: 50rpx;

    text-align: center;
    font-size: 34rpx;
    color: #fff;
  }
}

.live-box {
  width: 100vw;
  height: 100vh;
  font-size: 28rpx;

  .bottom-menus {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0 20rpx;

    box-sizing: content-box;
    padding-bottom: env(safe-area-inset-bottom);

    display: flex;
    align-items: center;
    color: rgba($color: #fff, $alpha: 0.8);

    .input-bt {
      width: 300rpx;
      height: 72rpx;
      line-height: 72rpx;
      border-radius: 36rpx;
      text-align: center;

      background: rgba(0, 0, 0, 0.4);
    }

    .right-bt {
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .iconfont {
        margin-left: 40rpx;
        width: 72rpx;
        height: 72rpx;
        line-height: 72rpx;
        text-align: center;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.4);
        font-size: 40rpx;
      }
    }
  }

  .goods-icon-box {
    position: absolute;
    right: 20rpx;
    bottom: 160rpx;
    bottom: calc(160rpx + env(safe-area-inset-bottom));
    width: 80rpx;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.4);
    color: rgba($color: #fff, $alpha: 0.8);

    .num {
      position: absolute;
      top: 10rpx;
      right: 10rpx;
      transform: translate(50%, -50%);
      height: 30rpx;
      line-height: 30rpx;
      min-width: 30rpx;
      border-radius: 15rpx;
      background: #ff0000;
      color: #ffffff;
      font-size: 22rpx;
    }
  }

  .chat-input {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0 20rpx;
    background: #fff;
    color: #454545;
  }

  .chat-box {
    position: absolute;
    left: 20rpx;
    bottom: 100rpx;
    bottom: calc(env(safe-area-inset-bottom) + 100rpx);
    height: 30vh;
    width: 500rpx;

    // background: #fff;
    .item {
      margin-bottom: 20rpx;
      padding: 10rpx;
      border-radius: 10rpx;
      background: rgba(0, 0, 0, 0.4);
      color: rgba($color: #fff, $alpha: 0.8);
      font-size: 24rpx;

      > text:nth-child(1) {
        margin-right: 10rpx;
      }
    }

    .type-0 {
      background: linear-gradient(to right, #728e9b, #6a7e9a);
    }
  }
}
</style>

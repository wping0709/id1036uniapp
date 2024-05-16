<template>
  <view class="commentList">
    <view class="evaluateList">
      <template v-for="(item, index) in list">
        <view
          :style="{
            background: !showHuifu
              ? 'linear-gradient(180deg, #F9F9FB 0%, #FFFFFF 100%)'
              : 'initial',
          }"
          class="evaluateItem"
          :key="index"
        >
          <view class="head">
            <view class="user" style="flex: 1; width: 0">
              <view class="user-avatar">
                <image :src="item.avatar_url" mode="aspectFill"></image>
              </view>
              <view class="user-name">
                <view class="name">{{ item.nickname }}</view>
                <view class="starList">
                  <!-- <i class="iconfont icon-collection-fill" v-for="item in item.score - 0" :key="item"></i> -->
                  {{ item.addtime }}
                </view>
              </view>
            </view>
            <!-- <view class="head-date font-24">
						{{item.addtime}}
					</view> -->
          </view>
          <view class="content">
            <view class="evaluateContent">{{ item.content }}</view>
            <view class="picList" v-if="item.pic_list && item.pic_list.length">
              <view
                class="picItem pic-box"
                v-for="(pic, picIndex) in item.pic_list"
                :key="picIndex"
              >
                <image
                  :src="pic"
                  mode="aspectFill"
                  @click.stop="preview(picIndex, item.pic_list)"
                />
              </view>
            </view>
            <view class="skuList" v-if="item.attr && item.attr.length">
              <text v-for="(sku, skuIndex) in item.attr" :key="skuIndex"
                >{{ sku.attr_group_name }}{{ sku.attr_name
                }}{{ skuIndex == item.attr.length - 1 ? '' : '，' }}</text
              >
            </view>
            <view
              v-if="item.reply_content && showHuifu"
              style="
                margin-top: 20rpx;
                background: #f0f0f0;
                padding: 10rpx;
                font-size: 24rpx;
                border-radius: 14rpx;
                color: #000000;
                line-height: 2;
              "
            >
              <text style="color: #ff6247">回复：</text>{{ item.reply_content }}
            </view>
          </view>
        </view>

        <view
          v-if="showHuifu"
          style="border-bottom: 1px solid #f2f2f2; margin: 0 40rpx"
        ></view>
      </template>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    list: {
      default: () => {
        return [];
      },
    },
    showHuifu: {
      type: Boolean,
      default: true,
    },
  },
  computed: {},
  methods: {
    // 点击评价图片预览图片
    preview(index, list) {
      uni.previewImage({
        current: index,
        urls: list,
        success(res) {
          // uni.setStorageSync("usePreviewImgApi", "true");
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.evaluateList {
  background-color: #fff;
}

.evaluateItem {
  margin: 20rpx;
  padding: 20rpx;
  border-radius: 20rpx;
  background: linear-gradient(180deg, #f9f9fb 0%, #ffffff 100%);
  .head {
    display: flex;
    align-items: center;

    .user {
      display: flex;
      align-items: center;

      .user-avatar {
        width: 64rpx;
        height: 64rpx;

        image {
          width: 100%;
          height: 100%;
          display: block;
          border-radius: 50%;
        }
      }

      .user-name {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 1.6vw;

        .name {
          font-size: 26rpx;
          font-family: PingFang SC;
          font-weight: 700;
        }

        .starList {
          // display: flex;
          // align-items: center;
          font-size: 24rpx;
          color: #999;

          .iconfont {
            color: #f84e18;
            margin-right: 1.067vw;
            font-size: 30rpx;
          }
        }
      }
    }
  }

  .content {
    padding-top: 20rpx;

    .evaluateContent {
      font-size: 26rpx;
      font-family: PingFang SC;
      font-weight: 400;
      color: #333;
      word-break: break-all;
    }

    .picList {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin-top: 20rpx;

      .picItem {
        width: 150rpx;
        height: 150rpx;
        margin-right: 8rpx;
        margin-bottom: 8rpx;
        overflow: hidden;
        &:nth-child(4n) {
          margin-right: 0;
        }

        image {
          width: 100%;
          height: 100%;
          display: block;
          border-radius: 1.6vw;
        }
      }

      .pic-box:nth-child(4n + 4) {
        margin-right: 0;
      }
    }

    .skuList {
      margin-top: 3.2vw;
      display: flex;
      align-items: center;
      font-size: 22rpx;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 32rpx;
      color: #8c8c8c;
    }
  }
}

.evaluateItem:last-child {
  border-bottom: 0 none;
}
</style>

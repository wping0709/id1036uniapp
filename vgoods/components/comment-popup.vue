<template>
  <u-popup
    :show="newShow"
    mode="bottom"
    @close="$emit('update:close', false)"
    round="10px"
  >
    <div class="popup-box flex-col">
      <div class="title p-y-10 font-600-32 font-center">
        共{{ comment.list.length }}条评论
      </div>
      <scroll-view scroll-y class="flex-h-1">
        <div class="list" v-if="comment.list.length">
          <div class="item" v-for="(item, i) in comment.list" :key="i">
            <view class="flex">
              <div @click="onSelect(item)" class="left flex flex-w-1">
                <image :src="item.avatar_url" mode="aspectFill" />
                <view class="left-content flex-col flex-w-1">
                  <view class="color-666">{{ item.nickname }}</view>
                  <view class="m-t-10 comment">{{ item.comment }}</view>
                  <view class="color-999 font-20 m-t-10">{{
                    item.add_time
                  }}</view>
                </view>
              </div>

              <div
                @click="onDianzan(item)"
                class="right p-x-10 flex-col flex-y-center flex-x-center"
              >
                <view
                  :style="{
                    color: item.is_like && 'red',
                  }"
                  class="iconfont icon-dianzan color-999"
                ></view>
                <view>{{ item.like_count }}</view>
              </div>
            </view>

            <!-- 二级评论 -->
            <template v-if="item.reply_list.length">
              <view
                v-for="(item1, i1) in item.reply_list"
                :key="i1"
                style="padding-left: 100rpx"
                class="flex"
              >
                <div @click="onSelect(item1)" class="left flex flex-w-1">
                  <image :src="item1.avatar_url" mode="aspectFill" />
                  <view class="left-content flex-col flex-w-1">
                    <view class="color-666">{{ item1.nickname }}</view>
                    <view class="m-t-10 comment">{{ item1.comment }}</view>
                    <view class="color-999 font-20 m-t-10">{{
                      item1.add_time
                    }}</view>
                  </view>
                </div>

                <div
                  @click="onDianzan(item1)"
                  class="right p-x-10 flex-col flex-y-center flex-x-center"
                >
                  <view
                    :style="{
                      color: item1.is_like && 'red',
                    }"
                    class="iconfont icon-dianzan color-999"
                  ></view>
                  <view>{{ item1.like_count }}</view>
                </div>
              </view>
            </template>
          </div>
        </div>
        <u-empty v-else mode="data" :icon="wxapp_img.empty_data"></u-empty>
      </scroll-view>
      <div class="input-box">
        <u-input
          @confirm="onSubmit"
          @blur="focus = !focus"
          :focus="focus"
          v-model="inputValue"
          :placeholder="inputPh"
          border="none"
        >
          <view @click="onSubmit" slot="suffix" class="suffix"> 提交 </view>
        </u-input>
      </div>
    </div>
  </u-popup>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    cItem: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      comment: {
        list: [],
        status: 'loadmore',
        page: 1,
      },
      checkItem: '',
      inputValue: '',
      focus: false,
      newShow: false,
      isReset: false,
    };
  },
  computed: {
    inputPh() {
      if (!this.checkItem) return '说点什么呗~';
      return `回复 ${this.checkItem.nickname}`;
    },
    userInfo() {
      return this.$store.getters['user/userInfo'];
    },
  },
  watch: {
    cItem: {
      handler(v, ovl) {
        console.log('vItemChange',ovl,v);
        if ((!ovl && v) || ovl.id != v.id) {
          this.isReset = true;
        } else {
          this.isReset = false;
        }
      },
      immediate: true,
    },
    show(v) {
      console.log('ShowChange');

      if (v && this.cItem && this.isReset) {
        this.isReset = false;
        const { comment, inputValue } = this.$options.data();
        this.comment = comment;
        this.inputValue = inputValue;
        this.checkItem = '';
        this.getComment().then(() => {
          this.newShow = v;
        });
        return;
      }
      this.newShow = v;
    },
  },
  methods: {
    async getComment() {
      const res = await this.$requestAll.vgoods.getVgoodsComment(
        {
          page: this.comment.page,
          id: this.cItem.id,
        },
        true
      );
      this.comment.list.push(...res.data.comment_list);
      this.comment.page++;
      this.comment.status =
        res.data.count <= this.comment.list.length ? 'nomore' : 'loadmore';
    },
    onSelect(item) {
      this.checkItem = item;
      this.focus = true;
    },
    async onDianzan(item) {
      await this.$requestAll.vgoods.commentGood(
        {
          id: item.id,
          status: Number(!item.is_like),
        },
        true
      );
      item.is_like = !item.is_like;
      item.like_count += item.is_like ? 1 : -1;
    },
    async onSubmit(e) {
      var formData = {
        comment: this.inputValue,
        reply_id: this.checkItem.user_id,
        vgoods_id: this.checkItem.vgoods_id,
        parent_id: Number(this.checkItem.parent_id)
          ? this.checkItem.parent_id
          : this.checkItem.id,
      };
      if (!this.checkItem) {
        formData.reply_id = 0;
        formData.vgoods_id = this.cItem.id;
        formData.parent_id = 0;
      }
      const res = await this.$requestAll.vgoods.addVgoodsComment(
        formData,
        true
      );

      if (!this.checkItem) {
        this.comment.list.unshift(res.data);
      } else {
        var i = -1;

        if (!Number(this.checkItem.parent_id)) {
          i = this.comment.list.findIndex(item => item.id == this.checkItem.id);
        } else {
          i = this.comment.list.findIndex(
            item => item.id == this.checkItem.parent_id
          );
        }
        this.comment.list[i].reply_list.unshift(res.data);
      }
      this.checkItem = '';
      this.inputValue = '';
    },
  },
};
</script>

<style lang="scss" scoped>
.popup-box {
  height: 60vh;
  .list {
    .item {
      padding: 10rpx 20rpx;
      .left {
        > image {
          width: 70rpx;
          height: 70rpx;
          border-radius: 50%;
          margin-right: 20rpx;
        }
        .left-content {
          .comment {
            width: 100%;
            word-break: break-all;
          }
        }
      }
      .right {
        height: 140rpx;
      }
    }
  }

  .input-box {
    border-radius: 30rpx;
    padding: 10rpx 20rpx;
    margin: 0 20rpx;
    background: #f5f5f5;
    .suffix {
      padding: 0 10rpx;
      font-weight: 500;
      font-size: 30rpx;
    }
  }
}
</style>

<template>
  <div class="index-rec-topic">
    <!-- left1 -->
    <div class="index-rec-box">
      <div class="index-rec-title">
        <div class="index-rec-name">{{ param.left_1_name }}</div>
        <div class="index-rec-subhead">
          <div>
            <img :src="param.left_1_icon" />
          </div>
          <!-- <div class="time"><span>00</span>:<span>00</span>:<span>00</span></div> -->
        </div>
      </div>
      <div class="index-rec-hint" style="color: #fe5a14">
        {{ param.left_1_title }}
      </div>
      <div class="index-rec-exhibition">
        <div
          @click="onClick(param.left_1_img_1_open_type, param.left_1_img_1_url)"
          style="background: linear-gradient(0deg, #ffffff, #ffefed)"
        >
          <div
            class="index-rec-img"
            :style="'background-image: url(' + param.left_1_img_1 + ');'"
          ></div>
        </div>
        <div
          @click="onClick(param.left_1_img_2_open_type, param.left_1_img_2_url)"
          style="background: linear-gradient(0deg, #ffffff, #ffefed)"
        >
          <div
            class="index-rec-img"
            :style="'background-image: url(' + param.left_1_img_2 + ');'"
          ></div>
        </div>
      </div>
    </div>
    <!-- left1 end -->

    <!-- right1 -->
    <div class="index-rec-box">
      <div class="index-rec-title">
        <div class="index-rec-name">{{ param.right_1_name }}</div>
        <div class="index-rec-subhead">
          <div>
            <img :src="param.right_1_icon" />
          </div>
        </div>
      </div>
      <div class="index-rec-hint" style="color: #fa427b">
        {{ param.right_1_title }}
      </div>
      <div class="index-rec-exhibition">
        <div
          @click="
            onClick(param.right_1_img_1_open_type, param.right_1_img_1_url)
          "
        >
          <div
            class="index-rec-img"
            :style="'background-image: url(' + param.right_1_img_1 + ');'"
          ></div>
          <img
            v-if="param.right_1_img_1_icon"
            class="index-rec-icon"
            :src="param.right_1_img_1_icon"
          />
        </div>
        <div
          @click="
            onClick(param.right_1_img_2_open_type, param.right_1_img_2_url)
          "
        >
          <div
            class="index-rec-img"
            :style="'background-image: url(' + param.right_1_img_2 + ');'"
          ></div>
          <img
            v-if="param.right_1_img_2_icon"
            class="index-rec-icon"
            :src="param.right_1_img_2_icon"
          />
        </div>
      </div>
    </div>
    <!-- right1 end -->

    <!-- left2 -->
    <div class="index-rec-box">
      <div class="index-rec-title">
        <div class="index-rec-name">{{ param.left_2_name }}</div>
        <div class="index-rec-subhead">
          <div>
            <img :src="param.left_2_icon" />
          </div>
        </div>
      </div>
      <div class="index-rec-hint" style="color: #fa427b">
        {{ param.left_2_title }}
      </div>
      <div class="index-rec-exhibition">
        <div
          @click="onClick(param.left_2_img_1_open_type, param.left_2_img_1_url)"
          style="background: linear-gradient(0deg, #ffffff, #f6f1fe)"
        >
          <div
            class="index-rec-img"
            :style="'background-image: url(' + param.left_2_img_1 + ');'"
          ></div>
        </div>
        <div
          @click="onClick(param.left_2_img_2_open_type, param.left_2_img_2_url)"
          style="background: linear-gradient(0deg, #ffffff, #f6f1fe)"
        >
          <div
            class="index-rec-img"
            :style="'background-image: url(' + param.left_2_img_2 + ');'"
          ></div>
        </div>
      </div>
    </div>
    <!-- left2 end -->

    <!-- right2 -->
    <div class="index-rec-box">
      <div class="index-rec-title">
        <div class="index-rec-name">{{ param.right_2_name }}</div>
        <div class="index-rec-subhead">
          <div>
            <img :src="param.right_2_icon" />
          </div>
        </div>
      </div>
      <div class="index-rec-hint" style="color: #22daa8">
        {{ param.right_2_title }}
      </div>
      <div class="index-rec-exhibition">
        <div
          @click="
            onClick(param.right_2_img_1_open_type, param.right_2_img_1_url)
          "
        >
          <div
            class="index-rec-img"
            :style="'background-image: url(' + param.right_2_img_1 + ');'"
          ></div>
        </div>
        <div
          @click="
            onClick(param.right_2_img_2_open_type, param.right_2_img_2_url)
          "
        >
          <div
            class="index-rec-img"
            :style="'background-image: url(' + param.right_2_img_2 + ');'"
          ></div>
        </div>
      </div>
    </div>
    <!-- right2 end -->

    <!-- left3 -->
    <div class="index-rec-box">
      <div class="index-rec-title">
        <div class="index-rec-name">{{ param.left_3_name }}</div>
        <div class="index-rec-subhead">
          <div>
            <img :src="param.left_3_icon" />
          </div>
        </div>
      </div>
      <div class="index-rec-hint" style="color: #8d55f2">
        {{ param.left_3_title }}
      </div>
      <div class="index-rec-exhibition">
        <div
          @click="onClick(param.left_3_img_1_open_type, param.left_3_img_1_url)"
          style="background: linear-gradient(0deg, #ffffff, #f6f1fe)"
        >
          <div
            class="index-rec-img"
            :style="'background-image: url(' + param.left_3_img_1 + ');'"
          ></div>
        </div>
        <div
          @click="onClick(param.left_3_img_2_open_type, param.left_3_img_2_url)"
          style="background: linear-gradient(0deg, #ffffff, #f6f1fe)"
        >
          <div
            class="index-rec-img"
            :style="'background-image: url(' + param.left_3_img_2 + ');'"
          ></div>
        </div>
      </div>
    </div>
    <!-- left3 end -->

    <!-- right3 -->
    <div class="index-rec-box">
      <div class="index-rec-title">
        <div class="index-rec-name">{{ param.right_3_name }}</div>
        <div class="index-rec-subhead">
          <div>
            <img :src="param.right_3_icon" />
          </div>
        </div>
      </div>
      <div class="index-rec-hint" style="color: #fa427b">
        {{ param.right_3_title }}
      </div>
      <div class="index-rec-exhibition">
        <div
          @click="
            onClick(param.right_3_img_1_open_type, param.right_3_img_1_url)
          "
        >
          <div
            class="index-rec-img"
            :style="'background-image: url(' + param.right_3_img_1 + ');'"
          ></div>
        </div>
        <div
          @click="
            onClick(param.right_3_img_2_open_type, param.right_3_img_2_url)
          "
        >
          <div
            class="index-rec-img"
            :style="'background-image: url(' + param.right_3_img_2 + ');'"
          ></div>
        </div>
      </div>
    </div>
    <!-- right3 end -->
  </div>
</template>

<script>
export default {
  name: "DiyIndexRecommend",
  props: {
    param: {},
  },
  methods: {
    onClick: function (type, url) {
      // if (type == 'navigate') {
      // 	// this.$router.push({path: url})
      // }
      this.$utils.toUrl(url, type);
    },
  },
};
</script>

<style lang="scss" scoped>
$rpx: 2rpx;

.index-rec-topic {
  background-color: #fff;
  border-radius: 10 * $rpx;
  margin: 10 * $rpx 12 * $rpx;
  padding: 12 * $rpx 12 * $rpx 0;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.index-rec-topic .index-rec-box {
  width: 50%;
}

.index-rec-topic .index-rec-box:nth-child(odd) {
  width: calc(50% - 5 * $rpx);
}

.index-rec-topic .index-rec-box .index-rec-title {
  display: flex;
  height: 20 * $rpx;
}

.index-rec-topic .index-rec-box .index-rec-title .index-rec-name {
  font-size: 16 * $rpx;
  font-weight: bold;
}

.index-rec-topic .index-rec-box .index-rec-title .index-rec-subhead {
  color: #fc3e2d;
}

.index-rec-topic
  .index-rec-box
  .index-rec-title
  .index-rec-subhead
  .index-rec-time {
  position: relative;
  top: -2 * $rpx;
}

.index-rec-topic .index-rec-box .index-rec-title .index-rec-subhead span {
  font-size: 10 * $rpx;
  font-weight: bold;
  display: inline-block;
  width: 15 * $rpx;
  height: 15 * $rpx;
  text-align: center;
  line-height: 15 * $rpx;
  background-color: #fc3e2d;
  border-radius: 3 * $rpx;
  color: #fff;
  margin: 0 2 * $rpx;
}

.index-rec-topic .index-rec-box .index-rec-title .index-rec-subhead img {
  width: 75 * $rpx;
  height: 16 * $rpx;
  margin-top: 3 * $rpx;
  margin-left: 7 * $rpx;
}

.index-rec-topic .index-rec-box .index-rec-hint {
  font-size: 12 * $rpx;
  padding-top: 2 * $rpx;
}

.index-rec-topic .index-rec-box .index-rec-exhibition {
  margin-bottom: 12 * $rpx;
}

.index-rec-topic .index-rec-box .index-rec-exhibition .index-rec-img {
  width: 100%;
}

.index-rec-topic .index-rec-box .index-rec-exhibition .index-rec-img,
.index-rec-topic .index-rec-box .index-rec-exhibition > div {
  height: 79 * $rpx;
  border-radius: 7 * $rpx;
  background-color: transparent;
  display: inline-block;
  position: relative;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}

.index-rec-topic .index-rec-box .index-rec-exhibition > div {
  margin-top: 5 * $rpx;
  width: 50%;
}

.index-rec-topic .index-rec-box .index-rec-exhibition > div:nth-child(1) {
  width: calc(50% - 5 * $rpx);
}

.index-rec-topic .index-rec-box .index-rec-exhibition .index-rec-icon {
  position: absolute;
  width: 15 * $rpx;
  height: 15 * $rpx;
  top: 5 * $rpx;
  right: 5 * $rpx;
}
</style>

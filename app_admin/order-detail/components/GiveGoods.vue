<template>
  <div >
    <div class="goods-list">
      <div>
        <div
          class="goods-item border-bottom"
          v-for="(item, index) in list"
          :key="index"
        >
          <img :src="item.cover_pic" />
          <div class="goods-mes">
            <div class="goods-name">{{ item.name }}</div>
            <div class="" style="color:red;">{{ title }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "OrderGoods",
  props: {
    list: [Array],
    title: {
      type: String,
      default: "满减赠品"
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="less" scoped>
.goods-list {
  margin-bottom: 10px;
  background-color: #fff;
  padding: 12px 10px 0;
  > div:nth-child(1) {
    line-height: 30px;
    font-size: 16px;
  }
  .goods-item {
    padding-bottom: 12px;
    display: flex;
    justify-content: space-between;
    > img {
      width: 78px;
      height: 78px;
    }
    .goods-mes {
      flex: 1;
      margin-left: 10px;
      .goods-name {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        line-height: 20px;
        margin-bottom: 2px;
        height: 40px;
      }
    }
  }
}

</style>

<template>
  <div class="diy-goods-modal" v-if="goods">
    <div class="diy-goods-modal-content">
      <img @click="onClose" src="../../../assets/images/pond-details.png" alt="" class="diy-goods-close">
      <div class="diy-goods-modal-name u-line-1">{{goods.name}}</div>
      <div class="picker-main">
        <div class="guigelist">
          <div class="guigebox" v-for="(item, index) in attr_group_list" :key="index">
            <template v-if="item.attr_list.length > 0">
              <div class="tit">{{item.attr_group_name}}</div>
              <div class="spanbox">
                <span :class="{current: it.checked, 'attr-num-0': it.attr_num_0}" v-for="(it, i) in item.attr_list" :key="i" @click="storeAttrClick(item.attr_group_id, it.attr_id)">{{it.attr_name}}</span>
              </div>
            </template>
          </div>
        </div>
        <div class="countbox">
          <div class="tit">购买数量</div>
          <div class="shop-arithmetic">
            <a href="javascript:;" class="minus" :class="{numBtnDisabled: buyNum <= 1}" @click="subBuyNum">-</a>
            <!-- <span class="num"><input type="num" v-model="buyNum">{{buyNum}}</span> -->
            <input type="number" class="num" v-model="buyNum"/>
            <a href="javascript:;" class="plus" @click="addBuyNum">+</a>
          </div>
        </div>
      </div>
      <div class="diy-goods-modal-footer flex-row">
        <div class="flex-grow-1" style="text-align:left;color: #ff4544">
          ￥{{showPrice}}
        </div>
        <div class="flex-grow-1" style="text-align:right">
          <span class="diy-goods-modal-buy-btn" @click="addCart">加入购物车</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '@/api'
import Utils from '@/utils'

export default {
  name: 'DiyGoodsModal',
  props: {
    goods: Object
  },
  data() {
    return {
      buyNum: 1,
      price: 0,
      num: 1,
      attr_group_list: {}
    }
  },
  computed: {
    showPrice: function () {
      return this.price > 0 ? this.price : this.goods.price
    }
  },
  methods: {
    onClose: function () {
      this.$emit('closeDiyGoodsModal')
    },
    subBuyNum: function () {
      if (this.buyNum <= 1) {
        return false
      }
      this.buyNum--
    },
    addBuyNum: function () {
      this.buyNum++
    },
    selectDefaultAttr: function () {
      if (this.goods.use_attr != 0) {
        return
      }
      for (var i in this.goods.attr_group_list) {
        for (var j in this.goods.attr_group_list[i].attr_list) {
          if (i == 0 && j == 0)
            this.goods.attr_group_list[i].attr_list[j]['checked'] = true;
        }
      }
    },
    addCart: function () {
      var attr_group_list = this.goods.attr_group_list
      var attr_list = this.goods.attr
      var checked_attr_list = [];
      for (var i in attr_group_list) {
        var attr = false;
        for (var j in attr_group_list[i].attr_list) {
          if (attr_group_list[i].attr_list[j].checked) {
            attr = {
              attr_id: attr_group_list[i].attr_list[j].attr_id,
              attr_name: attr_group_list[i].attr_list[j].attr_name,
            };
            break;
          }
        }
        if (!attr) {
          this.$toast('请选择' + attr_group_list[i].attr_group_name);
          return true;
        } else {
          checked_attr_list.push({
            attr_group_id: attr_group_list[i].attr_group_id,
            attr_group_name: attr_group_list[i].attr_group_name,
            attr_id: attr.attr_id,
            attr_name: attr.attr_name,
          });
          for(var i in attr_list){
              if(attr_list[i].attr_list[0].attr_id == attr.attr_id){
                this.num = attr_list[i].num;
              }
          }
        }
      }
      if (this.buyNum > this.num) {
        this.$toast('库存不足')
        return
      }
      if(this.goods.verify_card_id){
        this.$toast('核销卡商品请直接购买!')
        this.$store.commit('goodsAttr', false)
        var goods_list = [];
        goods_list.push({
            goods_id: this.goods.id,
            num: this.buyNum,
            attr: JSON.stringify(checked_attr_list)
        });
        var goods = this.goods;
        var mch_id = 0;
        if (goods.mch != null) {
            mch_id = goods.mch.id
        }
        var mch_list = [];
        mch_list.push({
            mch_id: mch_id,
            goods_list: goods_list
        });
        this.$router.push({ name: 'OrderSubmit', query: {mch_list: JSON.stringify(mch_list)}})

      }else{
        this.$loading.show('正在提交');
        this.$http.post(Api.cart.add_cart,{
          goods_id: this.goods.id,
          attr: JSON.stringify(checked_attr_list),
          num: this.buyNum,
        }).then((res) => {
          this.$loading.hide();
          this.$emit('closeDiyGoodsModal')
          this.$toast(res.data.msg, {durtaion: 1500});
        })
      }
      
    },
    storeAttrClick: function (groupId, attrId) {
      let attr_group_id = groupId;
      let attr_id = parseInt(attrId);
      let attr_group_list = JSON.parse(JSON.stringify(this.attr_group_list));
      let attrs = this.goods.attr;
      let checkedAttr = [];
      if (typeof attrs == 'string') {
        attrs = JSON.parse(attrs);
      }

      for (let i in attr_group_list) {
        if (attr_group_list[i].attr_group_id != attr_group_id) {
          continue;
        }

        // TODO 重新写个for循环是为了解决bug,如有更好方案再修改
        for (let j in attr_group_list[i].attr_list) {
          let aGList = attr_group_list[i].attr_list[j];

          if (parseInt(aGList.attr_id) === attr_id && aGList.checked) {
            aGList.checked = false;
          } else {
            aGList.checked = parseInt(aGList.attr_id) === attr_id;
          }
        }
      }


      for (let i in attr_group_list) {
        for (let j in attr_group_list[i].attr_list) {
          if (attr_group_list[i].attr_list[j].checked) {
            checkedAttr.push(attr_group_list[i].attr_list[j].attr_id)
          }
        }
      }
      for (let i in attr_group_list) {
        // 如果库存为0 则不往下执行
        for (let j in attr_group_list[i].attr_list) {
          let aGList = attr_group_list[i].attr_list[j];
          if (aGList.attr_id === attr_id && aGList.attr_num_0 === true) {
            return;
          }
        }
      }

      // 无库存规格样式 start
      let attrNum_0 = [];
      for (let i in attrs) {
        let arr = [];
        let sign = 0;
        for (let j in attrs[i].attr_list) {
          if (!Utils.inArray(attrs[i].attr_list[j].attr_id, checkedAttr)) {
            sign += 1;
          }

          arr.push(attrs[i].attr_list[j].attr_id);
        }

        if (attrs[i].num === 0 && sign <= 1) {
          attrNum_0.push(arr)
        }
      }

      let checkedAttrLength = checkedAttr.length;
      let attrGroupListLength = attr_group_list.length;

      let newAttrNum_0 = [];
      if (attrGroupListLength - checkedAttrLength <= 1) {
        for (let i in checkedAttr) {
          for (let j in attrNum_0) {
            if (Utils.inArray(checkedAttr[i], attrNum_0[j])) {
              for (let k in attrNum_0[j]) {
                if (attrNum_0[j][k] !== checkedAttr[i]) {
                  newAttrNum_0.push(attrNum_0[j][k])
                }
              }
            }
          }
        }
      }

      //库存为0的规格添加标识
      for (let i in attr_group_list) {
        for (let j in attr_group_list[i].attr_list) {
          let cAttr = attr_group_list[i].attr_list[j];
          if (Utils.inArray(cAttr.attr_id, newAttrNum_0) && !Utils.inArray(cAttr.attr_id, checkedAttr)) {
            cAttr.attr_num_0 = true;
          } else {
            cAttr.attr_num_0 = false;
          }
        }
      }

      this.attr_group_list =  attr_group_list
      this.goods.attr_group_list =  attr_group_list

      let check_attr_list = [];
      let check_all = true;

      for (var i in attr_group_list) {
        let group_checked = false;
        for (let j in attr_group_list[i].attr_list) {
          if (attr_group_list[i].attr_list[j].checked) {
            check_attr_list.push(attr_group_list[i].attr_list[j].attr_id);
            group_checked = true;
            break;
          }
        }
        if (!group_checked) {
          check_all = false;
          break;
        }
      }

      // TODO ..
      if (!check_all) {
        return;
      }

      this.$loading.show('正在加载')

      var httpUrl = Api.default.goods_attr_info;
      let group_checked = 0;

      this.$http.get(httpUrl, {
        params: {
          goods_id: this.goods.id,
          group_id: undefined, // TODO 商城没有该字段
          attr_list: JSON.stringify(check_attr_list),
          type: '',
          group_checked: group_checked,
        }
      }).then((res) => {
        this.$loading.hide();
        if (res.data.code == 0) {
          if (!res.data.data) {
            return
          }
          this.price = res.data.data.price
          this.num = res.data.data.num
          //如果库存小于选择的数量，那么把选择的数量设置为库存数量
          if (this.num < this.buyNum) {
            this.buyNum = this.num < 1 ? 1 : this.num
          }
          if (this.buyNum == 0 && this.num >= 1) {
            this.buyNum = 1
          }
        }
      }).catch((error) => {
        console.log(error)
      }).then(() => {
        this.$loading.hide()
      })
    },
  },
  created() {
    this.attr_group_list =  this.goods.attr_group_list
    this.selectDefaultAttr()
  }
}
</script>

<style scoped>
.diy-goods-modal {
  position: fixed;
  width: 100%;
  height: 100vh;
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}
.diy-goods-modal-content {
  width: 80%;
  background: #fff;
  border-radius: 5px;
  padding: 0 20px;
  position: relative;
  min-height: 100px;
}
.diy-goods-close {
  width: 30px;
  height: 30px;
  position: absolute;
  right: 10px;
  top: 10px;
}
.diy-goods-modal-name {
  font-size: 15px;
  padding-right: 30px;
  margin-top: 15px;
}
.diy-goods-modal-footer {
  height: 60px;
  display: flex;
  align-items: center;
  border-top: 1px solid #eee;
}
.diy-goods-modal-buy-btn {
  padding: 5px 10px;
  background: #ff4544;
  color: #fff;
  border-radius: 20px;
}
.numBtnDisabled {
  opacity: 0.4;
}
.picker-main {
	padding-bottom: 10px;
	box-sizing: border-box;
	max-height: 500px;
	overflow-y: scroll;
	color: #666;
}
.guigelist{
	padding:4px 0 8px;
}
.guigebox{
	padding: 10px 0 0;
}
.guigebox .tit{
	margin-bottom: 10px;
	font-size: 15px;
}
.guigebox span{
	display: inline-block;
	line-height: 32px;
	height: 32px;
	padding: 0 16px;
	background-color: #f7f7f7;
	margin-right: 16px;
	margin-bottom: 16px;
    border-radius: 3px;
    color: #111;
}
.guigebox span.current{
	background-color: #ff4544;
	color: #fff;
}
.guigebox span.attr-num-0{
    color: #959595;
}
.countbox{
	padding: 10px 0;
	border-top: 1px solid #eee;
	position: relative;
}
.countbox .tit{
	font-size: 15px;
	padding: 16px 0;
}
.shop-arithmetic{
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	-webkit-transform: translateY(-50%);
	right: 0;
	width:120px;
	height: 32px;
	line-height: 32px;
	white-space:nowrap;
	display: flex;
	flex-direction: row;
	align-items: center;
}
.shop-arithmetic .minus{
	width: 32px;
	text-align: center;
	background-color: #f7f7f7;
	font-size: 20px;
}
.shop-arithmetic .plus{
	width: 32px;
	text-align: center;
	background-color: #f7f7f7;
	font-size: 20px;
}
.shop-arithmetic .num{
	width:52px;
	margin: 0 2px;
	text-align:center;
	background-color: #f7f7f7;
	border:none;
	display: inline-block;
	height:100%;
	box-sizing:border-box;
	vertical-align:top;
}
</style>



<template>
	<view class="search">
		<view class="conent-box">
			<view class="search-input">
				<u--input prefixIcon="search" placeholder="请输入商品名称" border="none" v-model="searchValue"
					@change="inputChange" @confirm="confirm"></u--input>
			</view>
			<view class="hot" v-if="hotShow">
				<view class="title">
					热门搜索
				</view>
				<view class="hot_list">
					<view class="hot_item" v-for="(item,index) in hotList" :key="index" @click="checkHot(item)">
						{{item.name}}
					</view>
				</view>
			</view>
			<view class="goods_list" v-if="!emptyShow">
				<view class="goods_item" v-for="(goods,index) in shopcarList" :key="index">
					<view style="display: flex;align-items: center;">
						<view class="image">
							<image :src="goods.pic_url" mode=""></image>
						</view>
						<view class="text">
							<view class="name">
								{{goods.name}}
							</view>
							<view class="miaoshu">
								{{goods.desc}}
							</view>
							<view class="num">
								月售 <text>{{goods.sales}}</text>
							</view>
							<view class="price">
								<text
									style="font-size: 34rpx;color: red;font-weight: bold;">￥{{goods.price}}</text><text
									style="text-decoration: line-through;color: #b8b8b8;font-size: 24rpx;margin-left: 5rpx;">￥{{goods.original_price}}</text>
							</view>
						</view>
					</view>
					<view class="single_box" v-if="goods.use_attr == 0">
						<!-- <view class="single" @click="handlePlus(goods,index)">
							<u-icon name="plus" color="#ffffff"></u-icon>
						</view> -->
						<view class="step">
							<u-number-box v-model="goods.num_init" @change="stepChange()" integer min="0">
								<view slot="minus" class="minus" @click="handleMinus(goods)">
									<u-icon name="minus" size="11" color=" #FF0000"></u-icon>
								</view>
								<text slot="input" style="width: 10px;text-align: center;"
									class="input">{{goods.num_init}}</text>
								<view slot="plus" class="plus" @click="handlePlus(goods,index)">
									<u-icon name="plus" color="#FFFFFF" size="11"></u-icon>
								</view>
							</u-number-box>
						</view>
					</view>
					<view class="guige" @click="select_guige(goods)" v-if="goods.use_attr == 1">
						选规格
						<view class="mark">
							{{goods.num_init}}
						</view>
					</view>
				</view>
			</view>
			<view v-else>
				<u-empty mode="data" icon="http://cdn.uviewui.com/uview/empty/car.png">
				</u-empty>
			</view>

		</view>
		<view class="footer">
			<view class="shop_car" @click=" checkShopCar()">
				<view class="left" :class="carTotal > 0 && 'redcar'">
					<u-icon name="shopping-cart-fill" color="#ffffff" size="38"></u-icon>
					<view class="mark">
						{{carTotal}}
					</view>
				</view>
				<view class="" style="font-weight: bold;" v-if="carTotal == 0">
					未选购商品
				</view>
			</view>
			<view class="button" :class="carTotal > 0 && 'redbutton'" @click="submit()">
				选好了
			</view>
		</view>
		<!-- 选规格 -->
		<u-popup :show="popupShow" @close="close" closeable mode="bottom" :round="10">
			<view class="popup_box">
				<view class="goods">
					<view class="image">
						<image :src="attrList.pic_url" mode=""></image>
					</view>
					<view class="text">
						<view class="name">
							{{attrList.name}}
						</view>
						<view class="miaoshu">
							已选：<text>700克/原味</text>
						</view>
						<view class="price">
							<text style="font-size: 34rpx;color: red;font-weight: bold;">￥{{attrList.price}}</text>
						</view>
					</view>
				</view>
				<view class="popup-num">
					<view class="name" style="font-weight: bold;">
						数量
					</view>
					<view class="step">
						<u-number-box v-model="attrList.num_init" @change="stepChange()" integer min="0">
							<view slot="minus" class="minus" @click="handleMinus(goods)">
								<u-icon name="minus" size="12" color=" #FF0000"></u-icon>
							</view>
							<text slot="input" style="width: 50px;text-align: center;"
								class="input">{{attrList.num_init}}</text>
							<view slot="plus" class="plus" @click="moreAttrplus(goods,index)">
								<u-icon name="plus" color="#FFFFFF" size="12"></u-icon>
							</view>
						</u-number-box>
					</view>
				</view>
				<view>
					<view class="att-box" v-for="(item, i) in attr_group_list" :key="item.attr_group_id">
						<view class="att-title">{{ item.attr_group_name }}</view>
						<view class="att-content">
							<view :class="[
							        item1.checked && 'weight_active',
							        item1.attr_num_0 && 'display',
							      ]" @click="onSelectAttr(item.attr_group_id, item1.attr_id, i, i1)" v-for="(item1, i1) in item.attr_list"
								:key="item1.attr_id">
								{{ item1.attr_name }}
							</view>
						</view>
					</view>
				</view>
				<view class="button1" @click="selecetOk()" v-if="selectAttr.attr_list.length < 2">
					选好了
				</view>
				<view class="button" @click="selecetOk()" v-else>
					选好了
				</view>
			</view>
		</u-popup>
		<u-popup :show="shopCatShow" @close="close" closeable mode="bottom" :round="10" :closeable="false">
			<view class="shopcat_box">
				<view class="top">
					<view class="title">
						已选商品
					</view>
					<view class="clear" @click="clearShopCar()">
						<view class="icon">
							<u-icon name="trash" size="20" color="#7f7f7f"></u-icon>
						</view>
						<view style="color: #979797;margin-left: 8rpx;font-size: 24rpx;">
							清空购物车
						</view>
					</view>
				</view>
				<scroll-view scroll-y="true" class="shopcarlist_scroll">
					<view class="shopcar_list">
						<view class="shopcar_item" v-for="(s,index) in selectList" :key="index">
							<view v-if="s.num_init > 0">
								<view class="left">
									<view class="image">
										<image :src="s.pic_url" mode=""></image>
									</view>
									<view class="text">
										<view class="name">
											{{s.name}}
											<view class="attr-box" style="display: flex;" v-if="s.use_attr == 1">
												<view class="attr-item" v-for="item in s.selectAttr" :key="item.attr_id"
													style=" color: #b8b8b8;font-size: 24rpx;margin-right: 10rpx;">
													{{item.attr_name}}
												</view>
											</view>
										</view>

										<view class="price">
											￥{{s.price}}
										</view>
									</view>

								</view>
								<view class="step">
									<u-number-box v-model="s.num_init" @change="stepChange()" integer min="0">
										<view slot="minus" class="minus" @click="handleMinus(goods)">
											<u-icon name="minus" size="12" color=" #FF0000"></u-icon>
										</view>
										<text slot="input" style="width: 10px;text-align: center;"
											class="input">{{s.num_init}}</text>
										<view slot="plus" class="plus" @click="shopCarhandlePlus(goods,index)">
											<u-icon name="plus" color="#FFFFFF" size="12"></u-icon>
										</view>
									</u-number-box>
								</view>
							</view>

						</view>
					</view>
				</scroll-view>
				<!-- 底部购物车 -->
				<view class="shopcar_bottom">
					<view class="shopcar_left">
						<view class="shop_car" @click=" checkShopCar()">
							<view class="left" :class="carTotal > 0 && 'redcar'">
								<u-icon name="shopping-cart-fill" color="#ffffff" size="38"></u-icon>
								<view class="mark">
									{{carTotal}}
								</view>
							</view>
							<view class="" style="font-weight: bold;">
								未选购商品
							</view>
						</view>
					</view>
					<view class="button" :class="carTotal > 0 && 'redbutton'" @click="submit()">
						选好了
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				paramas: {},
				carTotal: 0,
				emptyShow: false,
				hotShow: true,
				searchValue: '',
				selectList: [],
				hotList: [],
				attr_group_list: [],
				selectAttr: {
					goods_id: this.goodsId,
					num: 1,
					attr_list: [],
				},
				page: 1,
				shopCatShow: false,
				stepValue: 0,
				shopcarList: [],
				shopcarList: [],
				popupShow: false,
				attrList: {},
				topdata: {}
			}
		},
		onLoad(option) {
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: '#ff1b22',
				animation: {
					duration: 400,
					timingFunc: 'easeIn',
				},
			});
			this.selectList = uni.getStorageSync('selectList');
			this.carTotal = uni.getStorageSync('carTotal');
			this.paramas = uni.getStorageSync('params');
			this.topdata = JSON.parse(option.topdata)
			this.loadData();
		},
		// watch: {
		// 	shopcarList: {
		// 		handler(val, old) {
		// 			var arr = [];
		// 			val.forEach((item) => {
		// 				if (item.num_init > 0) {
		// 					arr.push(item)
		// 				}
		// 			})
		// 			console.log('shopcarList发生变化了', arr)
		// 			this.selectList = arr;
		// 		},
		// 		deep: true
		// 	}
		// },
		methods: {
			async loadData() {
				const res = await this.$requestAll.orderingfood.getHotSearch({
					store_id: 1,
					mch_id: parseInt(this.paramas.mch_id),
				}, true)
				console.log(res)
				if (res.code == 0) {
					this.hotList = res.data
				}
			},
			checkShopCar() {
				let sum = this.selectList.reduce((acc, curr) => acc + curr.num_init, 0);
				console.log(sum)
				this.carTotal = sum
				this.shopCatShow = true;
			},
			clearShopCar() {
				this.selectList = [];
				this.carTotal = 0;
				this.shopcarList.forEach((i) => {
					i.num_init = 0
				})
			},
			inputChange(val) {
				console.log(val)
			},
			async confirm() {
				const res = await this.$requestAll.orderingfood.getSearchList({
					store_id: 1,
					mch_id: parseInt(this.paramas.mch_id),
					page: this.page,
					keyword: this.searchValue
				}, true)
				console.log('搜索出来的数据', res)
				if (res.code == 0) {
					this.hotShow = false;
					this.shopcarList = res.data.list;
					if (this.shopcarList.length > 0) {
						this.emptyShow = false;
					} else {
						this.emptyShow = true;
					}
				}
			},
			async checkHot(item) {
				console.log(item)
				let keyword = item.name;
				const res = await this.$requestAll.orderingfood.getSearchList({
					store_id: 1,
					mch_id: parseInt(this.paramas.mch_id),
					page: this.page,
					keyword: keyword
				}, true)
				console.log('搜索出来的数据', res)
				if (res.code == 0) {
					this.hotShow = false;
					this.shopcarList = res.data.list
					if (this.shopcarList.length > 0) {
						this.emptyShow = false;
					} else {
						this.emptyShow = true;
					}
				}
			},
			select_guige(item) {
				console.log(item)
				this.attrList = item;
				this.attr_group_list = this.attrList.attr_group_list
				this.attr = this.attrList.attr
				console.log('规格数据', this.attr_group_list)
				this.popupShow = true;
			},
			close() {
				this.popupShow = false;
				this.shopCatShow = false;
			},
			stepChange(val) {
				console.log(val)
			},
			handleMinus(item) {
				// if(this.singleValue == 0){
				// 	this.showNumBox = false;
				// }
				if (this.carTotal > 0) {
					this.carTotal--
				}
				console.log(item.num_init)
			},
			handlePlus(item, index) {
				console.log('item', item)
				this.carTotal++
				console.log('arr', this.shopcarList)
				if (item.use_attr == 0) {
					this.selectList.push(item)
					if (this.selectList.length > 0) {
						this.selectList = this.selectList.filter((item, index, array) => {
							return array.findIndex(obj => obj.name === item.name && obj.id === item.id) === index;
						});
					}
					console.log('购物车中的数据', this.selectList)
					uni.setStorageSync('searchselectList', this.selectList);
					uni.setStorageSync('searchcarTotal', this.carTotal);
				}
			},
			moreAttrplus() {
				this.carTotal++
				console.log(this.attrList)

			},
			selecetOk() {
				console.log(this.attrList)
				console.log(this.selectAttr.attr_list)
				if (this.selectAttr.attr_list.length < 2) {
					return;
				}
				this.popupShow = false;
				this.selectList.push({
					name: this.attrList.name,
					pic_url: this.attrList.pic_url,
					num_init: this.attrList.num_init,
					price: this.attrList.price,
					use_attr: 1,
					selectAttr: this.selectAttr.attr_list,
					id: this.attrList.id
				})
			},
			async submit() {
				if (this.topdata.pack) {
					var num = 0;
					var goods_id = 0;
					var arr = [];
					if (this.selectList) {
						this.selectList.forEach((item) => {
							if (item.use_attr == 0) {
								var singleArr = [{
									attr_group_id: '1',
									attr_group_name: '规格',
									attr_id: '1',
									attr_name: '默认'
								}];
								let o = {};
								o.num = item.num_init;
								o.goods_id = item.id;
								o.attr = singleArr;
								arr.push(o)
							} else {
								let o = {};
								o.num = item.num_init;
								o.goods_id = item.id;
								o.attr = item.selectAttr;
								arr.push(o)
							}

						})
					}

					console.log(num, goods_id)
					let data = {
						mch_id: parseInt(this.paramas.mch_id),
						goods_list: arr
					}
					let mch_list = [];
					mch_list.push(data)
					this.$utils.toUrl(
						'/pages/order-submit/order-submit?mch_list=' + JSON.stringify(mch_list) + '&topdata=' +
						JSON.stringify(this.topdata)
					)
				} else {
					var num = 0;
					var goods_id = 0;
					var arr = [];
					if (this.selectList) {
						this.selectList.forEach((item) => {
							if (item.use_attr == 0) {
								var singleArr = [{
									attr_group_id: '1',
									attr_group_name: '规格',
									attr_id: '1',
									attr_name: '默认'
								}];
								let o = {};
								o.num = item.num_init;
								o.goods_id = item.id;
								o.attr = singleArr;
								arr.push(o)
							} else {
								let o = {};
								o.num = item.num_init;
								o.goods_id = item.id;
								o.attr = item.selectAttr;
								arr.push(o)
							}

						})
					}

					console.log(num, goods_id)
					let data = {
						mch_id: parseInt(this.paramas.mch_id),
						goods_list: arr
					}
					let mchlist = [];
					mchlist.push(data)
					let mch_list = JSON.stringify(mchlist);
					console.log('带给后端的参数', mch_list)
					const result = await this.$requestAll.orderingfood.newSubmitPreview({
							mch_list
						},
						true
					);
					console.log('预下单接口返回数据', result)
					if (result.code == 0) {
						result.data.mch_list[0].offline = 0
						console.log(result.data)
						let mchlist = result.data.mch_list;
						let mch_list = JSON.stringify(mchlist)
						console.log('11111111111111', mch_list)
						const res = await this.$requestAll.orderingfood.orderNewSubmit({
								mch_list,
								table_id: parseInt(this.topdata.table_id),
								food_type: this.topdata.store ? 0 : this.topdata.pack,
								diners_number: this.topdata.num,
								order_id: this.order_id ? this.order_id : ''
							},
							true
						);
						if (res.code == 0) {
							let order_id;
							order_id = res.data.order_id
							this.$utils.toUrl(
								'/ordering-food/order-detail/order-detail?id=' + order_id
							)
						}
						console.log('下单接口数据', res)
					}
				}

			},
			// 当前已选规格与无库存组合比对，返回需禁用规格id
			disableAttr(num0Arr, checkedAttrIds) {
				let disabledArr = [];

				// 循环无库存组合，查找与已选规格配对无库存id
				num0Arr.forEach((item) => {
					let length = 0;
					let disabledArr_1 = [];
					item.attr_list.forEach((item2) => {
						if (checkedAttrIds.some((cItem) => cItem == item2.attr_id)) {
							length++;
						} else {
							disabledArr_1.push(item2.attr_id);
						}
					});

					if (length && length == checkedAttrIds.length) {
						disabledArr.push(...disabledArr_1);
					}
				});
				return disabledArr;
			},
			// 点击规格 规格组索引
			onSelectAttr(i, i1, index = 0, index1 = 0) {
				// let attr_group_id = typeof i != 'number' ? -1 : i;
				// let attr_id = typeof i1 != 'number' ? -1 : i1;
				// if (this.goodsData.goods_add_type == 1 && this.type != "goodsAttr")
				//   return;
				if (this.attr_group_list[index].attr_list[index1].attr_num_0)
					return uni.$u.toast("当前规格无库存");
				// 规格组
				let attr_group_list = JSON.parse(JSON.stringify(this.attr_group_list));
				// 规格组合数组
				let attrs = JSON.parse(this.attr);
				console.log('88888888888', attrs)
				//选中的规格id
				let checkedAttr = [];
				// 选中的规格
				let attr_list = [];

				let num0Arr = attrs.filter((it) => {
					return !Number(it.num);
				}); //无库存规格组
				console.log(num0Arr, this.attr);
				let disabledArr = []; //无库存规格标识

				// 只有一个规格组，先标识无库存才能选择,
				// 如果是多个规格组，需先选再进行匹配无库存规格组合
				if (attr_group_list.length == 1) {
					if (
						num0Arr.length &&
						(!this.selectData.attr_list || !this.selectData.attr_list.length)
					) {
						// 无库存标识
						num0Arr.forEach((it) => {
							for (const key in attr_group_list[0].attr_list) {
								const item = attr_group_list[0].attr_list[key];

								if (item.attr_id == it.attr_list[0].attr_id) {
									item.attr_num_0 = true;
									break;
								}
							}
						});
					}
				}

				// 只要没有无库存标识则选中
				if (!attr_group_list[index].attr_list[index1].attr_num_0) {
					attr_group_list.forEach((it, itIndex) => {
						it.attr_list.forEach((item, i) => {
							if (itIndex == index) {
								// 当前循环项已被选中，且当前再次点击选择应改为取消选中
								if (i == index1 && item.checked) {
									item.checked = false;
								} else {
									item.checked = i == index1;
								}
							}

							if (item.checked) {
								attr_list.push({
									attr_group_id: attr_group_list[index].attr_group_id,
									attr_id: item.attr_id,
									attr_name: item.attr_name,
									attr_group_name: it.attr_group_name,
								});
								checkedAttr.push(item.attr_id);
							}
						});
					});
				}

				// 与无库存组合比对返回无库存组合id，进行标识
				if (attr_group_list.length > 1) {
					if (checkedAttr.length == attr_group_list.length) {
						for (let i = 0; i < checkedAttr.length; i++) {
							let disableResult = this.disableAttr(
								num0Arr,
								checkedAttr.filter((it, ni) => i != ni)
							);
							disabledArr.push(...disableResult);
						}
					} else {
						disabledArr = this.disableAttr(num0Arr, checkedAttr);
					}

					// 无库存进行标识
					attr_group_list.forEach((attr_group) => {
						attr_group.attr_list.forEach((attr) => {
							attr.attr_num_0 = disabledArr.some((item) => item == attr.attr_id);
						});
					});
				}

				console.log("需要禁用的attr_id", disabledArr);

				// 跟新group_list
				this.attr_group_list = attr_group_list;
				// 设置选中规格id
				this.selectAttr.attr_list = attr_list;
				uni.setStorageSync('attr_list', this.selectAttr.attr_list);
				console.log(this.selectAttr.attr_list);
				// 获取规格信息
				this.getGoodsAttr();

				return;

				// 点击选中及取消
				for (let i in attr_group_list) {
					let group = attr_group_list[i];

					for (let j in attr_group_list[i].attr_list) {
						let attr = attr_group_list[i].attr_list[j];

						// 如果当前选中状态库存为0 不做任何操作
						if (attr.attr_id === attr_id && attr.attr_num_0) return;

						// 只有当前选中规格，和当前为真的取消选中。
						// 查找当前规格组,不然，其他规格组也将赋值为未选中
						if (attr_group_list[i].attr_group_id == attr_group_id) {
							if (parseInt(attr.attr_id) === attr_id && attr.checked) {
								attr.checked = false;
							} else {
								attr.checked = parseInt(attr.attr_id) === attr_id;
							}
						}

						// 获取选中规格数据
						if (attr.checked) {
							// 获取选中id
							checkedAttr.push(attr.attr_id);
							// 获取选中数据
							attr_list.push({
								attr_group_id: group.attr_group_id,
								attr_group_name: group.attr_group_name,
								attr_id: attr.attr_id,
								attr_name: attr.attr_name,
							});
						}
					}
				}

				//无库存标识添加逻辑
				//1.循环sku组合，

				// 无库存规格样式 start
				let attrNum_0 = [];
				attrs.forEach((attr) => {
					let arr = [];
					let sign = 0;
					attr.attr_list.forEach((attr_list_attr) => {
						// 当前规格不在选中规格中
						if (!checkedAttr.some((cId) => cId == attr_list_attr.attr_id)) sign++;
						arr.push(attr_list_attr.attr_id);
					});

					// 库存不足 && 当前循环
					if (attr.num <= 0 && sign <= 1) {
						attrNum_0.push(arr);
					}
				});
				console.log(attrNum_0);

				let checkedAttrLength = checkedAttr.length;
				let attrGroupListLength = attr_group_list.length;
				let newAttrNum_0 = [];
				if (attrGroupListLength - checkedAttrLength <= 1) {
					// 循环选中数据
					for (let i in checkedAttr) {
						// 循环无库存规格组合
						for (let j in attrNum_0) {
							// 如果当前选中数据存在，无规格组合，将这组规格组合未选中的放入无库存标识数组。
							if (this.$utils.inArray(checkedAttr[i], attrNum_0[j])) {
								for (let k in attrNum_0[j]) {
									if (attrNum_0[j][k] !== checkedAttr[i]) {
										newAttrNum_0.push(attrNum_0[j][k]);
									}
								}
							}
						}
					}

					// // 规格组只有一组 添加无库存标识  当前为未选中的时候就做判断是否有无库存规格组合
					attrs.forEach((attrData) => {
						if (attrData.num <= 0) {
							attrData.attr_list[0] &&
								newAttrNum_0.push(attrData.attr_list[0].attr_id);
						}
					});
				}

				//库存为0的规格添加标识
				for (let i in attr_group_list) {
					for (let j in attr_group_list[i].attr_list) {
						let cAttr = attr_group_list[i].attr_list[j];

						//  cAttr.attr_num_0 =
						//   newAttrNum_0.some(item => item == cAttr.attr_id) &&
						//   !checkedAttr.some(item => item == cAttr.attr_id);

						cAttr.attr_num_0 =
							this.$utils.inArray(cAttr.attr_id, newAttrNum_0) &&
							!this.$utils.inArray(cAttr.attr_id, checkedAttr);
					}
				}

				// 跟新group_list
				this.attr_group_list = attr_group_list;
				// 设置选中规格id
				this.selectAttr.attr_list = attr_list;
				// 获取规格信息
				this.getGoodsAttr();
			},
			// 获取选中规格信息
			getGoodsAttr() {
				// 当前表示规格种类只有一种..  可根据规格信息判断库存.
				const attr_list = this.selectAttr.attr_list;
				const attr_group_list = this.attr_group_list;
				const attr = JSON.parse(this.attr);
				console.log('9999999999999999', attr)
				if (attr_list.length == attr_group_list.length) {
					// 获取选中规格数据
					console.log("选择完成");
					attr.forEach((attrData) => {
						let i = 0;
						attrData.attr_list.forEach((attr) => {
							if (attr_list.some((s) => s.attr_id == attr.attr_id)) {
								i++;
							}
							if (i == attr_list.length) {
								this.attrData = attrData;
							}
						});
					});
					this.getAttrInfo();
				}
			},
			async getAttrInfo() {
				if (this.type == "goods") {
					var res = await this.$requestAll.default.goodsAttrInfo({
							goods_id: this.goodsId,
							attr_list: JSON.stringify(
								this.selectAttr.attr_list.map((item) => {
									return item.attr_id;
								})
							),
							number: this.selectAttr.num,
						},
						true
					);
					this.attrInfo = res.data;
				} else if (this.type == "pintuan") {
					var res = await this.$requestAll.group.goodsAttrInfo({
							goods_id: this.goodsId,
							group_id: this.pintuanGroupId,
							attr_list: JSON.stringify(
								this.selectAttr.attr_list.map((item) => {
									return item.attr_id;
								})
							),
							number: this.selectAttr.num,
						},
						true
					);
					this.attrInfo = res.data;
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.search {
		position: relative;
		height: 100vh;
		background-color: #ffffff;

		.step {
			.minus {
				width: 22px;
				height: 22px;
				border-width: 2px;
				border-color: #FF0000;
				border-style: solid;
				border-top-left-radius: 100px;
				border-top-right-radius: 100px;
				border-bottom-left-radius: 100px;
				border-bottom-right-radius: 100px;
				@include flex;
				justify-content: center;
				align-items: center;
			}

			.input {
				padding: 0 10px;
			}

			.plus {
				width: 22px;
				height: 22px;
				background-color: #FF0000;
				border-radius: 50%;
				/* #ifndef APP-NVUE */
				display: flex;
				/* #endif */
				justify-content: center;
				align-items: center;
			}
		}

		.conent-box {
			padding: 0 30rpx;

			.search-input {
				height: 70rpx;
				background-color: #f2f2f2;
				border-radius: 50rpx;

				/deep/ .input-placeholder {
					font-size: 26rpx;
				}
			}

			.hot {
				margin-top: 40rpx;

				.title {
					font-weight: bold;
				}

				.hot_list {
					margin-top: 30rpx;
					display: flex;
					align-items: center;
					flex-wrap: wrap;

					.hot_item {
						margin-right: 20rpx;
						background-color: #f8f8f8;
						padding: 15rpx;
						border-radius: 15rpx;
						color: #6a6a6a;
						margin-bottom: 20rpx;
					}
				}
			}

			.goods_list {
				margin-top: 30rpx;

				.goods_item {
					display: flex;
					align-items: flex-end;
					justify-content: space-between;
					margin-bottom: 30rpx;

					.image {
						width: 180rpx;
						height: 180rpx;
						border-radius: 20rpx;
						background-color: #ececec;

						>image {
							width: 100%;
							height: 100%;
						}
					}

					.text {
						display: flex;
						flex-direction: column;
						margin-left: 20rpx;

						.name {
							font-weight: bold;
							font-size: 28rpx;
						}

						.miaoshu {
							color: #b8b8b8;
						}

						.num {
							color: #b8b8b8;
						}
					}

					.guige {
						position: relative;
						width: 120rpx;
						height: 45rpx;
						margin-left: 40rpx;
						background-color: #f4240d;
						color: #ffffff;
						border-radius: 40rpx;
						text-align: center;
						line-height: 45rpx;

						.mark {
							position: absolute;
							top: -15rpx;
							right: -15rpx;
							width: 32rpx;
							font-size: 24rpx;
							height: 32rpx;
							background-color: #f84a33;
							border-radius: 50%;
							text-align: center;
							line-height: 32rpx;
						}
					}
				}
			}
		}

		.footer {
			padding: 0 30rpx;
			position: fixed;
			z-index: 999;
			display: flex;
			align-items: center;
			justify-content: space-between;
			bottom: 0;
			width: 100%;
			height: 170rpx;
			background-color: #ffffff;

			.shop_car {
				position: relative;
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 250rpx;

				.left {
					width: 90rpx;
					height: 90rpx;
					background-color: #8c8c8c;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
				}

				.redcar {
					width: 90rpx;
					height: 90rpx;
					background-color: #FF0000;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
				}

				.mark {
					position: absolute;
					top: -10rpx;
					right: 155rpx;
					width: 32rpx;
					font-size: 24rpx;
					height: 32rpx;
					background-color: #f84a33;
					border-radius: 50%;
					text-align: center;
					line-height: 32rpx;
					color: #ffffff;
				}
			}

			.button {
				width: 210rpx;
				height: 85rpx;
				background-color: #9f9f9f;
				border-radius: 40rpx;
				text-align: center;
				line-height: 85rpx;
				color: #ffffff;
			}

			.redbutton {
				width: 210rpx;
				height: 85rpx;
				background-color: #f84a33;
				border-radius: 40rpx;
				text-align: center;
				line-height: 85rpx;
				color: #ffffff;
			}
		}

		.popup_box {
			padding: 25rpx;
			height: 950rpx;
			display: flex;
			flex-direction: column;

			.goods {
				display: flex;
				margin-bottom: 40rpx;

				.image {
					width: 180rpx;
					height: 180rpx;
					border-radius: 20rpx;
					background-color: #ececec;

					>image {
						width: 100%;
						height: 100%;
					}
				}

				.text {
					height: 150rpx;
					display: flex;
					flex-direction: column;
					margin-left: 20rpx;
					justify-content: space-between;

					.name {
						font-weight: bold;
						font-size: 28rpx;
					}

					.miaoshu {
						color: #b8b8b8;
					}

				}
			}

			.popup-num {
				margin-bottom: 40rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;


			}

			// 多规格弹框样式
			.att-box {


				.att-title {
					line-height: 80rpx;
					font-size: 26rpx;
					font-weight: 700;
				}

				.att-content {
					display: flex;
					flex-wrap: wrap;

					>view {
						width: 200rpx;
						height: 75rpx;
						background-color: #f8f8f8;
						border-radius: 20rpx;
						text-align: center;
						line-height: 75rpx;
						margin-right: 20rpx;
						font-weight: bold;
						margin-bottom: 20rpx;
						// text-align: center;
						// min-width: 100rpx;
					}

					.weight_active {
						border: 1px solid #FF0000;
						color: #FF0000;
						background-color: #fff3f1;
					}

					.check {
						background: #fbeceb;
						color: #ff191d;
					}

					.display {
						background: #f5f5f5;
						color: #8c8c8c;
						text-decoration: line-through;
						border: 0;
					}
				}

				.attr-box-item_1 {
					border-bottom: 2rpx solid #eee;
					// &:nth-last-child(1) {
					//   border-bottom: 0 solid #000;
					// }
				}
			}

			.weight {
				margin-bottom: 40rpx;

				.weight_list {
					margin-top: 20rpx;
					display: flex;

					.weight_item {
						width: 200rpx;
						height: 75rpx;
						background-color: #f8f8f8;
						border-radius: 20rpx;
						text-align: center;
						line-height: 75rpx;
						margin-right: 20rpx;
						font-weight: bold;
					}

					.weight_active {
						border: 1px solid #FF0000;
						color: #FF0000;
						background-color: #fff3f1;
					}
				}
			}

			.spicy {
				.spicy_list {
					margin-top: 20rpx;
					display: flex;

					.spicy_item {
						width: 200rpx;
						height: 75rpx;
						background-color: #f8f8f8;
						border-radius: 20rpx;
						text-align: center;
						line-height: 75rpx;
						margin-right: 20rpx;
						font-weight: bold;
					}

					.spicy_active {
						border: 1px solid #FF0000;
						color: #FF0000;
						background-color: #fff3f1;
					}
				}
			}

			.button {
				margin-top: 70rpx;
				height: 75rpx;
				background-color: #ff1b22;
				border-radius: 40rpx;
				text-align: center;
				line-height: 75rpx;
				color: #ffffff;
			}

			.button1 {
				margin-top: 70rpx;
				height: 75rpx;
				background-color: #8c8c8c;
				border-radius: 40rpx;
				text-align: center;
				line-height: 75rpx;
				color: #ffffff;
			}
		}

		.shopcat_box {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			padding: 25rpx;

			.top {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.title {
					font-weight: bold;
				}

				.clear {
					display: flex;
					align-items: center;
				}
			}

			.shopcarlist_scroll {
				height: 500rpx;

				.shopcar_list {
					.shopcar_item {

						>view {
							display: flex;
							justify-content: space-between;
							align-items: flex-end;
							margin-bottom: 20rpx;

							.left {
								display: flex;
								align-items: center;

								.image {
									margin-right: 20rpx;
									width: 110rpx;
									height: 110rpx;
									background-color: #f2f2f2;
									border-radius: 15rpx;

									>image {
										width: 100%;
										height: 100%;
									}
								}

								.text {
									height: 110rpx;
									display: flex;
									flex-direction: column;
									justify-content: space-between;
									margin-bottom: 10rpx;

									.name {
										font-weight: bold;

										.ladu {
											font-weight: 400;
											font-size: 24rpx;
											color: #a5a5a5;
										}
									}

									.price {
										color: #ff1b22;
										font-weight: bold;
									}
								}
							}
						}

					}
				}
			}

			.shopcar_bottom {
				width: 100%;
				height: 170rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.shopcar_left {
					display: flex;
					align-items: center;

					.shop_car {
						position: relative;
						display: flex;
						align-items: center;
						justify-content: space-between;
						width: 250rpx;

						.left {
							width: 90rpx;
							height: 90rpx;
							background-color: #8c8c8c;
							border-radius: 50%;
							display: flex;
							align-items: center;
							justify-content: center;
						}

						.redcar {
							width: 90rpx;
							height: 90rpx;
							background-color: #FF0000;
							border-radius: 50%;
							display: flex;
							align-items: center;
							justify-content: center;
						}

						.mark {
							position: absolute;
							top: -10rpx;
							right: 155rpx;
							width: 32rpx;
							font-size: 24rpx;
							height: 32rpx;
							background-color: #f84a33;
							border-radius: 50%;
							text-align: center;
							line-height: 32rpx;
							color: #ffffff;
						}
					}

				}

				.button {
					width: 210rpx;
					height: 85rpx;
					background-color: #ff1b22;
					border-radius: 40rpx;
					text-align: center;
					line-height: 85rpx;
					color: #ffffff;
				}
			}
		}
	}
</style>
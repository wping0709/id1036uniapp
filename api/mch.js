import request from '@/utils/request.js'
export default {
	orderAgree(data, loading) {
		return request.GET('/mch/order/agree', data, loading)
	},
	orderJujue(data, loading) {
		return request.GET('/mch/order/jujue', data, loading)
	},
	payData(data, loading) {
		return request.GET('/mch/index/pay-data', data, loading)
	},
	postageRulesEdit(data, loading) {
		return request.POST('/mch/postage-rules/edit', data, loading)
	},
	postageRulesInfo(data, loading) {
		return request.GET('/mch/postage-rules/info', data, loading)
	},
	postageRulesSetEnable(data, loading) {
		return request.GET('/mch/postage-rules/set-enable', data, loading)
	},
	postageRulesDelete(data, loading) {
		return request.GET('/mch/postage-rules/delete', data, loading)
	},
	postageRulesList(data, loading) {
		return request.GET('/mch/postage-rules/list', data, loading)
	},
	getMchList(data, loading) {
		return request.GET('/mch/index/mch-list', data, loading)
	},
	getShopCat(data, loading) {
		return request.GET('/mch/index/shop-cat', data, loading)
	},
	indexApply(data, loading) {
		return request.GET('/mch/index/apply', data, loading)
	},
	indexApplySubmit(data, loading) {
		return request.POST('/mch/index/apply-submit', data, loading)
	},
	userMyshop(data, loading) {
		return request.GET('/mch/user/myshop', data, loading)
	},
	userIsopen(data, loading) {
		return request.GET('/mch/user/is-open', data, loading)
	},
	locationInfo(data, loading) {
		return request.GET('/mch/index/location-info', data, loading)
	},
	shopNavbar(data, loading) {
		return request.GET('/mch/index/shop-navbar', data, loading)
	},
	indexShop(data, loading) {
		return request.GET('/mch/index/shop', data, loading)
	},
	mchCommentList(data, loading) {
		return request.GET('/mch/index/mch-comment-list', data, loading)
	},
	userSetting(data, loading) {
		return request.GET('/mch/user/setting', data, loading)
	},
	settingSubmit(data, loading) {
		return request.POST('/mch/user/setting-submit', data, loading)
	},
	mchGoodsList(data, loading) {
		return request.GET('/mch/goods/list', data, loading)
	},
	goodsSetStatus(data, loading) {
		return request.GET('/mch/goods/set-status', data, loading)
	},
	goodsDelete(data, loading) {
		return request.GET('/mch/goods/delete', data, loading)
	},
	catEdit (data, loading) {
    return request.POST('/mch/cat/edit', data, loading)
  },
	catList (data, loading) {
    return request.GET('/mch/cat/list', data, loading)
  },
  catDelete (data, loading) {
    return request.POST('/mch/cat/delete', data, loading)
  },
  getCat (data, loading) {
    return request.POST('/mch/cat/get-cat', data, loading)
  },
  getCatDetail (data, loading) {
    return request.GET('/mch/cat/edit', data, loading)
  },
  tongjiMonthData (data, loading) {
    return request.GET('/mch/user/tongji-month-data', data, loading)
  },
  shopQrcode (data, loading) {
    return request.GET('/mch/user/shop-qrcode', data, loading)
  },
  userAccount (data, loading) {
    return request.GET('/mch/user/account', data, loading)
  },
  cashPreview (data, loading) {
    return request.GET('/mch/user/cash-preview', data, loading)
  },
  accountLog (data, loading) {
    return request.GET('/mch/user/account-log', data, loading)
  },
  cashLog (data, loading) {
    return request.GET('/mch/user/cash-log', data, loading)
  },
  settleLog (data, loading) {
    return request.GET('/mch/user/settle-log', data, loading)
  },
  userCash (data, loading) {
    return request.POST('/mch/user/cash', data, loading)
  },

  // 普通订单api
  orderList (data, loading) {
    return request.GET('/mch/order/list', data, loading)
  },
  orderDetail (data, loading) {
    return request.GET('/mch/order/detail', data, loading)
  },
  orderSend (data, loading) {
    return request.POST('/mch/order/send', data, loading)
  },
  orderRefund (data, loading) {
    return request.POST('/mch/order/refund', data, loading)
  },
  orderSend (data, loading) {
    return request.POST('/mch/order/send', data, loading)
  },
  refundDetail (data, loading) {
    return request.GET('/mch/order/refund-detail', data, loading)
  },
  editPrice (data, loading) {
    return request.POST('/mch/order/edit-price', data, loading)
  },
  
  
  // 秒杀
  msList (data, loading) {
    return request.GET('/mch/order/ms-list', data, loading)
  },
  msDetail (data, loading) {
    return request.GET('/mch/order/ms-detail', data, loading)
  },
  msSend (data, loading) {
    return request.POST('/mch/order/ms-send', data, loading)
  },
  msRefundDetail (data, loading) {
    return request.GET('/mch/order/ms-refund-detail', data, loading)
  },
  msRefund (data, loading) {
    return request.POST('/mch/order/ms-refund', data, loading)
  },

  // 拼团
  orderPtList (data, loading) {
    return request.GET('/mch/order/pt-list', data, loading)
  },
  ptDetail (data, loading) {
    return request.GET('/mch/order/pt-detail', data, loading)
  },
  ptSend (data, loading) {
    return request.POST('/mch/order/pt-send', data, loading)
  },

  // 盲盒
  orderMhList (data, loading) {
    return request.GET('/mch/order/mh-list', data, loading)
  },
  mhDetail (data, loading) {
    return request.GET('/mch/order/mh-detail', data, loading)
  },
  mhSend (data, loading) {
    return request.POST('/mch/order/mh-send', data, loading)
  },

  // 预约
  yyList(data, loading) {
    return request.GET('/mch/order/yy-list', data, loading)
  },
  yyDetail (data, loading) {
    return request.GET('/mch/order/yy-detail', data, loading)
  },
	yySend (data, loading) {
    return request.POST('/mch/order/yy-send', data, loading)
  },
  yyRefund (data, loading) {
    return request.POST('/mch/order/yy-refund', data, loading)
  },
  yyRefundDetail (data, loading) {
    return request.GET('/mch/order/yy-refund-detail', data, loading)
  },
  shopGoodsList(data,loading) {
    return request.GET('/mch/index/shop-goods-list',data,loading)
  },
}

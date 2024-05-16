import requestAll from '@/api/index.js'

export default {
  init (jsApiList,openTagList) {
    return new Promise(async (resolve, reject) => {
      var jWeixin = require('@/static/h5/jweixin-sdk')
      var url = window.location.href.split("#")[0]
      if (process.env.NODE_ENV == 'development') url = 'http://qjonline.cyyvip.com/webpage'
      var { data } = await requestAll.wechat.wechatConfig({ url })

      jWeixin.config({
        debug: false, // 开启调试模式,调用的所有 api 的返回值会在客户端 alert 出来，若要查看传入的参数，可以在 pc 端打开，参数信息会通过 log 打出，仅在 pc 端时才会打印。
        appId: data.app_id, // 必填，公众号的唯一标识
        timestamp: data.timestamp,// 必填，生成签名的时间戳
        nonceStr: data.noncestr, // 必填，生成签名的随机串
        signature: data.signature,// 必填，签名
        jsApiList: jsApiList,
        openTagList: openTagList
      });

      jWeixin.ready(() => {
        resolve(jWeixin)
      })

      jWeixin.error((err) => {
        console.log('jWeixin报错', err);
        reject(err)
      })

    })

  }
}

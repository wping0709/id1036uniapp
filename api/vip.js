import request from '@/utils/request'

export default {
    vipcardIndex(data, loading) {
        return request.GET('/vip-card/index', data, loading)
    },
    vipcardInfo(data, loading) {
        return request.GET('/vip-card/info', data, loading)
    }
}

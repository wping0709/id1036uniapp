import request from '@/utils/request'

export default {
    getAddressList(data, loading) {
        return request.GET('/user/address-list', data, loading)
    }
}

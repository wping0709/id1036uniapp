import request from '@/utils/request.js'
export default {
    submit(data, loading) {
        return request.GET('/svcard/submit', data, loading)
    }
}

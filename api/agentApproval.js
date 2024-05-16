import request from '@/utils/request.js';
export default {
    index(data, loading) {
        return request.GET('/agent-approval/index', data, loading);
    },
    submit(data, loading) {
        return request.POST('/agent-approval/submit', data, loading);
    },
    getInfo(data, loading) {
        return request.GET('/agent-approval/get-info', data, loading);
    },
    getOrder(data, loading) {
        return request.GET('/agent-approval/get-order', data, loading);
    },
    getPrice(data, loading) {
        return request.GET('/agent-approval/get-price', data, loading);
    },
    apply(data, loading) {
        return request.POST('/agent-approval/apply', data, loading);
    },
    cashDetail(data, loading) {
        return request.GET('/agent-approval/cash-detail', data, loading);
    }
};

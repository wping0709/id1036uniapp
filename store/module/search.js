export default {
    namespaced: true,
    state: {
        searchList: []
    },
    getters: {
        searchList(state) {
            if (!state.searchList.length) {
                return uni.getStorageSync('SEARCH_HISTORY_LIST')
            } else {
                return state.searchList
            }
        }
    },
    mutations: {
        setSearchList(state, value) {
            value = value.trim()
            if (value.length) {
                var list = uni.getStorageSync('SEARCH_HISTORY_LIST') || []
                var index = list.indexOf(value)
                if (index == -1) {
                    list.unshift(value)
                } else {
                    list.splice(index, 1)
                    list.unshift(value)
                }
                uni.setStorageSync('SEARCH_HISTORY_LIST', list)
                state.searchList = list
            }

        },
        // 清空搜索缓存
        resetHistory(state) {
            uni.removeStorageSync('SEARCH_HISTORY_LIST');
            state.searchList = []
        }
    },
}

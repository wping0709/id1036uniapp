import request from '@/utils/request'
export default {
  postsReport (data, loading) {
    return request.POST('/posts/posts-report', data, loading)
  },
  selfList (data, loading) {
    return request.POST('/posts/self-list', data, loading)
  },
  postsList (data, loading) {
    return request.POST('/posts/list', data, loading)
  },
  updateStatus (data, loading) {
    return request.GET('/posts/update-status', data, loading)
  },
  postsGood (data, loading) {
    return request.POST('/posts/good', data, loading)
  },
  getOrder (data, loading) {
    return request.POST('/posts/get-order', data, loading)
  },
  isPower (data, loading) {
    return request.POST('/posts/is-power', data, loading)
  },
  addPosts (data, loading) {
    return request.POST('/posts/add-posts', data, loading)
  },
  getComment (data, loading) {
    return request.POST('/posts/get-comment', data, loading)
  },
  addComment (data, loading) {
    return request.POST('/posts/add-comment', data, loading)
  },
  getItem (data, loading) {
    return request.GET('/posts/get-item', data, loading)
  },
  postsItem (data, loading) {
    return request.GET('/posts/posts-item', data, loading)
  },
  selfList (data, loading) {
    return request.GET('/posts/self-list', data, loading)
  },
  delSelfItem (data, loading) {
    return request.GET('/posts/del-self-item', data, loading)
  },


}

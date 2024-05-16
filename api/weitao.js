import request from '@/utils/request'

export default {
  index (data, loading) {
    return request.GET('/weitao/index', data, loading)
  },
  focusUser (data, loading) {
    return request.GET('/weitao/focus-user', data, loading)
  },
  pageIndex (data, loading) {
    return request.GET('/weitao/page-index', data, loading)
  },
  likeArticle (data, loading) {
    return request.GET('/weitao/like-article', data, loading)
  },
  searchList (data, loading) {
    return request.GET('/weitao/search-list', data, loading)
  },
  articleDetail (data, loading) {
    return request.GET('/weitao/article-detail', data, loading)
  },
  articleReview (data, loading) {
    return request.GET('/weitao/review-article', data, loading)
  },
  addArticle (data, loading) {
    return request.POST('/weitao/add-article', data, loading)
  },
  getTopicList (data, loading) {
    return request.GET('/weitao/get-topic-list', data, loading)
  },
  getMessage (data, loading) {
    return request.GET('/weitao/get-message', data, loading)
  },
  getNotReview (data, loading) {
    return request.GET('/weitao/get-not-review', data, loading)
  },
  getNotLike (data, loading) {
    return request.GET('/weitao/get-not-like', data, loading)
  },
  userCenter (data, loading) {
    return request.GET('/weitao/user-center', data, loading)
  },
  deleteArticle (data, loading) {
    return request.GET('/weitao/delete-article', data, loading)
  },
  getNotFocus (data, loading) {
    return request.GET('/weitao/get-not-focus', data, loading)
  },
  userChat (data, loading) {
    return request.GET('/weitao/user-chat', data, loading)
  },
  sendUserChat (data, loading) {
    return request.GET('/weitao/send-user-chat', data, loading)
  },
  userCenter (data, loading) {
    return request.GET('/weitao/user-center', data, loading)
  },
  editUserCenter (data, loading) {
    return request.POST('/weitao/edit-user-center', data, loading)
  },
  addArticleView (data, loading) {
    return request.GET('/weitao/add-article-view', data, loading)
  },

}

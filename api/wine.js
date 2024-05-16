import request from '@/utils/request';

export default{
	AddPushView(data,loading){
		return request.GET('/note/add-push-view', data, loading)
	}, 
	defaultSearch(data,loading){
		return request.GET('/note/search', data, loading)
	},
	getTopicList(data,loading){
		return request.GET('/note/get-topic-list', data, loading)
	},
	AddPush (data, loading) {
	  return request.POST('/note/add-push', data, loading)
	},
	getTopicDetail(data,loading){
	  return request.GET('/note/get-topic-detail', data, loading)
	},
	noteDetail(data,loading){
	  return request.GET('/note/note-detail', data, loading)
	},
	noteLikeArticle(data,loading){
	  return request.GET('/note/like-article', data, loading)
	},
	noteReviewArticle(data,loading){
		return request.GET('/note/review-article', data, loading)
	},
	noteFocusUser(data,loading){
		return request.GET('/note/focus-user', data, loading)
	},
	answerGetAnswerList(data,loading){
		return request.GET('/answer/get-answer-list', data, loading)
	},
	answerGetCatList(data,loading){
		return request.GET('/answer/get-cat-list', data, loading)
	},
	answerAnswerShare(data,loading){
		return request.GET('/answer/answer-share', data, loading)
	},
	answerAddPush(data,loading){
		return request.POST('/answer/add-push', data, loading)
	},
	answerQuestionDetail(data,loading){
		return request.GET('/answer/question-detail', data, loading)
	},
	answerLikeAnswer(data,loading){
		return request.GET('/answer/like-answer', data, loading)
	},
	answerReview(data,loading){
		return request.GET('/answer/review', data, loading)
	},
	answerAnswerShare(data,loading){
		return request.GET('/answer/answer-share', data, loading)
	},
	userMyPush(data,loading){
		return request.GET('/user/my-push', data, loading)
	},
	answerAnswerDetail(data,loading){
		return request.GET('/answer/answer-detail', data, loading)
	},
	userFanceView(data,loading){
		return request.GET('/user/fance-view', data, loading)
	},
	userLikeView(data,loading){
		return request.GET('/user/like-view', data, loading)
	},
	defaultAllComment(data,loading){
		return request.GET('/default/all-comment', data, loading)
	},
	defaultCommentDetail(data,loading){
		return request.GET('/default/comment-detail', data, loading)
	},
	defaultNotePost(data,loading){
		return request.POST('/default/note-post', data, loading)
	},
	orderActivityList(data,loading){
		return request.GET('/order/activity-list', data, loading)
	},
	orderActivityDetail(data,loading){
		return request.GET('/order/activity-detail', data, loading)
	},
	orderNewSubmitPreview(data,loading){
		return request.POST('/order/new-submit-preview', data, loading)
	},
	userFocusView(data,loading){
		return request.GET('/user/focus-view', data, loading)
	},
}

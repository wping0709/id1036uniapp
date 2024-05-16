<template>
	<u-popup mode="bottom" :show="show" round="10px" @close="$emit('update:close', false)">
		<div class="popup-box ">
			<view class="popup-title p-y-20 font-center">评论</view>
			<scroll-view scroll-y class=" popup-content" style="min-height:45vh; max-height:70vh;">
				<div class="scroll-box">
					<div class="popst-item p-b-20" v-for="(item, i) in pageData.list" :key="i">
						<image :src="item.avatar_url" mode="aspectFill" />
						<view class="flex-w-1 m-l-20">
							<view class="font-30">{{ item.nickname }}</view>
							<view class="flex">
								<view class="flex-w-1">{{ item.comment }}</view>
								<view class="m-l-10 color-999 font-24">{{
                  item.add_time
                }}</view>
							</view>
						</view>
					</div>
				</div>
			</scroll-view>

			<div class="popup-bottom flex-y-center">
				<view class="flex-w-1 m-x-20">
					<u-input :adjustPosition="true" @confirm="searchConfirm" v-model="keyword" placeholder="评论~"
						shape="circle"></u-input>
				</view>
				<view class="add-bt" @click="searchConfirm">发送</view>
			</div>
		</div>
	</u-popup>
</template>
<script>
	export default {
		props: {
			show: {
				type: Boolean,
				default: false,
			},
			postsId: {
				type: [String, Number],
				default: '',
			},
		},
		data() {
			return {
				pageData: {
					list: [],
					page: 1,
					status: 'loadmore',
				},
				keyword: '',
			};
		},
		computed: {},
		watch: {
			postsId: {
				handler(v, ovl) {
					console.log(v, ovl, '123123');
					if (v != ovl) {
						this.pageData = this.$options.data().pageData;
						this.getCommentList();
					}
				},
				immediate: true,
			},
		},
		methods: {
			async getCommentList() {
				if (this.pageData.status == 'nomore') return;
				const res = await this.$requestAll.posts.getComment({
					id: this.postsId,
					page: this.pageData.page - 1,
				});
				this.pageData.list.push(...res.data.comment_list);
				this.pageData.page++;
				this.pageData.status =
					res.data.comment_list.length < 10 ? 'nomore' : 'loadmore';
			},
			async searchConfirm() {
				try {
					const res = await this.$requestAll.posts.addComment({
						comment: this.keyword,
						posts_id: this.postsId,
						reply_id: 0,
					});
					this.pageData = this.$options.data().pageData;
					this.keyword = '';
					this.getCommentList();
				} catch (error) {}
			},
		},
		onReachBottom() {},
		onPullDownRefresh() {},
	};
</script>
<style lang="scss" scoped>
	.popup-box {
		padding: 0 20rpx;
		min-height: 50vh;
	}

	.scroll-box {
		.popst-item {
			display: flex;

			>image {
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
			}
		}
	}

	.add-bt {
		line-height: 68rpx;
		border-radius: 34rpx;
		padding: 0 30rpx;
		background: #f95e00;
		color: #fff;
	}
</style>

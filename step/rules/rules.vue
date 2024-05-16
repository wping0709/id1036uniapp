<template>
	<view v-if="pageData" class="body">
		<div class="title">{{rulesTitle}}</div>
		<div class="rules">{{rules}}</div>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				pageData: '',
				rules:"",
				rulesName:'',
				rulesTitle:"",
			};
		},
		onLoad(params) {
			console.log(params);
			this.rulesName = params.rules;
			this.loadData();
		},
		onShow() {},
		methods: {
			async loadData() {
				const res = await this.$requestAll.step.setting({}, true);
				this.pageData = res.data;
				if(this.rulesName == 'activity_rule'){
					this.rules = this.pageData.activity_rule
					this.rulesTitle = '挑战规则';
				}else{
					this.rules = this.pageData.rule;
					this.rulesTitle = '兑换规则';
				}
			},
		},
		computed: {},
		watch: {},
		onReachBottom() {},
		onPullDownRefresh() {},
	};
</script>
<style lang="scss" scoped>
	.body {
		padding-top: 20rpx;
		background: #f5f5f5;
		min-height: 100vh;
		background: #fff;

		.title {
			margin: 0 20rpx;
		}

		.rules {
			margin-top: 20rpx;
			padding: 0 20rpx;
		}
	}
</style>

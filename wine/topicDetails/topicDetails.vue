<template>
	<view>
		<detile :topic_info = "topic_info" @gzDian = "gzDian"></detile>
		<pingLun :plType = "0" :ids = "ids" :plList.sync = "list" @giveALike = "Like" @commentPl = "pinglun" @chufa="cz"></pingLun>
		<bottom :types = "0" :topic_info = "topic_info" :num_obg = "num_obg" :default_show = "default_show" :ids = "ids" :is_like="is_like" @plHou='childPl' @giveALike = "Like" ></bottom>
	</view>
</template>

<script>
	import pingLun from "../comme/pingLun.vue"
	import detile from "../comme/detile.vue"
	import bottom from "../comme/bottom.vue"
	import wine from "@/api/wine.js"
	import share from '../../mixins/share'
	export default {
		mixins: [share],
		data() {
			return {
				id:null,
				ids:null,
				topic_info:{},
				list:[],
				num_obg:{
					like_count:null,
					review_count:null,
					share_count:null
				},
				is_like:null,
				default_show:null
			};
		},
		onShow(){
			if(this.default_show != undefined || this.default_show != null){
				this.jiuDetile()
			}else{
				this.detileS(this.ids)
			}
		},
		onUnload() {
			// uni.clearStorageSync('commentPl')
			uni.setStorageSync('commentPl', {
				focusState: false,
				num: 0
			})
		},
		onLoad(e){
			console.log(e)
			this.id = Number(e.id) 
			this.ids = e.article_id
			this.default_show = e.default_show
			// this.ids = e.id
			// console.log(this.ids)
			
		},
		components:{
			pingLun,
			detile,
			bottom
		},
		
		methods:{
			// 关注
			gzDian(e,a){
				console.log(e,a)
				let num = null;
				if(e==0){
					num = 1
				}else{
					num = 0
				}
				let data = {
					user_id:a,
					is_user_liked:num
				}
				wine.noteFocusUser(data)
				.then(res=>{
					console.log(res)
					if(res.code == 0){
						uni.showToast({
							title:"关注成功"
						})
						this.detileS(this.ids)
					}
				})
			},
			// 子组件触发后   点赞
			Like(){
				console.log(999)
				// this.detileS(this.id)
				if(this.default_show != undefined || this.default_show != null){
					this.jiuDetile()
				}else{
					this.detileS(this.ids)
				}
				
			},
			childPl(){
				if(this.default_show != undefined || this.default_show != null){
					this.jiuDetile()
				}else{
					this.detileS(this.ids)
				}
			},
			cz(e){
				console.log(e,"父组件触发")
				this.list[e].show = true
				this.$forceUpdate()
				console.log(this.list)
			},
			wenda(){
				uni.navigateTo({
					url:"../TheZone/TheZone"
				})
			},
			jiuDetile(e){
				let data = {
					note_id:this.ids
				}
				wine.defaultCommentDetail(data)
				.then(res=>{
					console.log(res,"酒")
					if(res.code == 0){
						this.topic_info = res.topic_info
						this.num_obg.share_count = res.share_count
						this.num_obg.like_count = res.like_count
						this.num_obg.review_count = res.review_count 
						console.log(this.num_obg,"this.num_obgthis.num_obgthis.num_obg")
						this.is_like = res.is_like
						this.list = res.review
						this.list.forEach(item=>{
							item.show = false
						})
						console.log(this.list)
					}
				})
			},
			detileS(e){
				let data = {
					topic_id:e
				}
				wine.noteDetail(data,1)
				.then(res=>{
					console.log(res)
					if(res.code == 0){ 
						this.topic_info = res.topic_info
						this.num_obg.share_count = res.share_count
						this.num_obg.like_count = res.like_count
						this.num_obg.review_count = res.review_count 
						console.log(this.num_obg,"this.num_obgthis.num_obgthis.num_obg")
						this.is_like = res.is_like
						this.list = res.review
						this.list.forEach(item=>{
							item.show = false
						})
						console.log(this.list)
					}
				})
			}
		},
		computed: {
			shareData() {
				return {
					title: '详情',
					path:
          "/wine/topicDetails/topicDetails" +
          uni.$u.queryParams({
            id: this.id,
            article_id: this.ids,
						default_show: this.default_show,
            user_id: this.$store.getters["user/userInfo"].id || "",
            store_id: this.$store.getters["currentStore"].id || "",
            // #ifdef APP-PLUS
            _platform: "app",
            // #endif
          }),
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	
</style>

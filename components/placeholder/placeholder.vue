<template>
	<view>
		<template v-if="type == 'diy' && is_shop_info && is_search">
			<view class="shop_info" :style="{height: shop_info_height + 'rpx'}" v-if="is_shop_info"></view>
			<view class="search" :style="{height: search_height+'rpx'}" v-if="is_search"></view>
		</template>
		<template v-else>
			<view class="default_height" :style="{height: default_height+'rpx', background: bar_color.backgroundColor}">
				<view class="title" :style="{top: systemInfo.statusBarHeight + 'rpx'}">
					<span :style="{color: bar_color.frontColor}">{{title}}</span>
				</view>
			</view>
			<view :style="{height: default_height + rpx}">
			</view>
		</template>
	</view>
</template>

<script>
	export default {
		name: "placeholder",
		props: {
			template: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				is_shop_info: false,
				is_search: false,
				shop_info_height: 0,
				search_height: 78,
				default_height: 0,
				bar_color: {
					frontColor: '#000000',
					backgroundColor: '#ffffff',
				}
			};
		},
		methods: {
			px2rpx: function(px) {
				const screenWidth = this.systemInfo.screenWidth
				return (750 / screenWidth) * px
			},
			attached: function() {
				var is_shop_info = false
				var is_search = false
				var shop_info_height = 0
				var default_height = this.px2rpx(this.systemInfo.statusBarHeight) + 88
				// var bar_color = getApp().core.getStorageSync(getApp().const.NAVIGATION_BAR_COLOR)
				var bar_color = '#ff7f9e'
				if (this.type == 'diy' && this.template.length > 0) {
					if (this.template[0].type == 'shop_info') {
						is_shop_info = true
						shop_info_height = this.px2rpx(this.systemInfo.statusBarHeight) + 85
					}
					if (this.template[1].type == 'search') {
						is_search = true
					}
				}
				this.bar_color = bar_color
				this.is_shop_info = is_shop_info
				this.is_search = is_search
				this.shop_info_height = shop_info_height
				this.default_height = default_height
			}
		}
	}
</script>

<style lang="scss">

</style>

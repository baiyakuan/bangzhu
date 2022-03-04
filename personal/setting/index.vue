<template>
	<div class="pdt20">
		<uni-list>
			<!-- <uni-list-item title="用户协议" @click="law"></uni-list-item> -->
			<uni-list-item title="用户协议" @click="law" :isFirstChild="true"></uni-list-item>
			<!-- <uni-list-item title="版本号"  rightText="v3.0.1" :showArrow="false"></uni-list-item> -->
			<uni-list-item title="隐私协议"  :showArrow="true"  @click="privacy"></uni-list-item>
		</uni-list>
	</div>
</template>

<script>
import store from '@/store';
import uniList from '@/components/uni-list/uni-list.vue';
import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
export default {
	data() {
		return {
			visible: false
		};
	},
	// #ifdef MP-WEIXIN
	// 微信分享小程序给朋友
	onShareAppMessage() {
		return {
			title: '推荐一个好用的停车工具',
			path: '/pages/index/index'
		};
	},
	// #endif
	components: {
		uniList,
		uniListItem
	},
	methods: {
		law() {
			uni.navigateTo({
				url: '/personal/law/index?type=2'
			});
		},
		privacy(){
			uni.navigateTo({
				url: '/personal/law/privacy'
			});
		}
	}
};
</script>

<style lang="stylus">

</style>

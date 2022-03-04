<template>
	<div>
		<div class="mgt20 bgw">
			<uni-list>
				<uni-list-item title="停车问题" @click="park" :isFirstChild="true"></uni-list-item>
				<uni-list-item title="费用问题" @click="cost"></uni-list-item>
				<!-- <uni-list-item title="其他问题" url='/personal/service/problem/other/index'></uni-list-item> -->
			</uni-list>
		</div>
	</div>
</template>

<script>
import uniList from '@/components/uni-list/uni-list.vue';
import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
export default {
	components: {
		uniList,
		uniListItem
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
	methods: {
		// 停车问题
		async park() {
			wx.navigateTo({
				url: `/personal/service/problem/park/index`
			});
		},
		// 费用问题
		async cost() {
			wx.navigateTo({
				url: `/personal/service/problem/cost/index`
			});
		}
	}
};
</script>

<style lang="stylus">

</style>

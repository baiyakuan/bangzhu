<template>
	<div class="pdt20">
		<uni-list>
			<uni-list-item title="操作指南" @click="parkguide" :isFirstChild="true"></uni-list-item>
			<!-- <uni-list-item title="常见问题" @click="problem"></uni-list-item>
        <uni-list-item title="举报违停" @click="reportviolation"></uni-list-item> -->
			<!-- <uni-list-item title="故障上报" @click="failurereport"  ></uni-list-item> -->
			<uni-list-item title="拨打客服" @click="visible = true" :only-tap-footer="true" :onlyTapFooter="true" :rightText="servicePhone"></uni-list-item>
		</uni-list>
		<Modal v-if="visible" ok-text="是" cancel-text="否" @ok="bindOk" @cancel="visible = false">
			<view class="pd40-y">
				<view>是否拨打？</view>
				<view>{{ servicePhone }}</view>
			</view>
		</Modal>
	</div>
</template>

<script>
import Modal from '@/components/Modal/index.vue';
import uniList from '@/components/uni-list/uni-list.vue';
import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
import { getServicePhone, thirdlogin } from '@/api';
import store from '@/store';
export default {
	data() {
		return {
			visible: false,
			servicePhone: ''
		};
	},
	components: {
		Modal,
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
		//举报违停
		async reportviolation() {
			wx.navigateTo({
				url: `/personal/service/feedback/index`
			});
		},
		//操作指南
		async parkguide() {
			wx.navigateTo({
				url: `/personal/service/parkguide/index`
			});
		},
		//常见问题
		async problem() {
			wx.navigateTo({
				url: `/personal/service/problem/index`
			});
		},
		//故障上报
		async failurereport() {
			wx.navigateTo({
				url: `/personal/service/malfunction/index`
			});
		},
		bindOk() {
			wx.makePhoneCall({
				phoneNumber: this.servicePhone,
				success: () => {
					this.visible = false;
				}
			});
		}
	},
	onShow() {
		getServicePhone().then(res => {
			this.servicePhone = res.data.obj.sevicePhoneList[0].servcePhone;
		});
	}
};
</script>

<style lang="stylus">

</style>

<template>
	<div class="page">
		<div class="title pdl40 pdt60 pdb80 ft50 ftweight rgb51">昵称</div>
		<div class="ipt-box"><input type="text" class="ipt pdl40" placeholder-class="placeholder" placeholder="请输入昵称" v-model="usersNickName" /></div>
		<div class="footer"><div class="btn ft30 ftweight" @click="onClick">提交</div></div>
		<div class="f"></div>
	</div>
</template>

<script>
import store from '@/store';
import { updateUserInfo } from '@/api';
export default {
	data() {
		return {
			usersNickName: ''
		};
	},
	computed: {
		userInfo() {
			return store.state.userInfo;
		}
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
	mounted() {
		this.usersNickName = this.userInfo.usersNickName;
	},
	methods: {
		onChange(e) {
			this.usersNickName = e.mp.detail.detail.value;
		},
		async onClick() {
			if (this.usersNickName) {
				const { data } = await updateUserInfo({
					usersNickName: this.usersNickName,
					updateType: 2,
					istrue: true
				});
				if (data.code == '1') {
					wx.showToast({
						title: '修改成功',
						icon: 'none'
					});
					setTimeout(() => {
						// store.dispatch('getUsersInfo')
						// .then(() => {
						// setTimeout(() => {
						wx.navigateBack({
							delta: 1
						});
						// }, 2000);
						// })
					}, 1000);
				}
			} else {
				wx.showToast({
					title: '请输入昵称',
					icon: 'none'
				});
			}
		}
	}
};
</script>

<style lang="stylus">
page
	height 100%
	background #F6F8FB
.page
	height 100%
	display flex
	flex-direction column
.title
	background #fff
	/* box-shadow 0 0 20rpx 0 rgba(27,25,33,0.2) */
.ipt-box
	height 118rpx
	line-height 118rpx
	background #F6F8FB
.ipt
	height 118rpx
	line-height 118rpx
	font-size 32rpx
	font-weight bold
	color #333333
	background rgb(246, 248, 251)
.placeholder
	color #aaa
	font-size 24rpx
.footer
	background #fff
.btn
	width 670rpx
	height 100rpx
	line-height 100rpx
	background #fe3535
	border-radius 10px
	color #ffffff
	margin 200rpx auto 0
	text-align center
.f
	flex 1
	background #fff
</style>

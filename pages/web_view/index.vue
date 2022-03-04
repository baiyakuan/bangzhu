<template>
	<view>
		<web-view v-if="url" :src="url" @message="handleGetMessage"></web-view>
		<login-modal ref="login" @loginCallBack="loginCallBack" @cancelLogin="cancelLogin"></login-modal>
		<get-location-modal ref="getLocationRef"></get-location-modal>
	</view>
</template>

<script>
import loginModal from '@/components/loginModal/loginModal.vue';
import getLocationModal from '@/components/getLocationModal/getLocationModal.vue';
export default {
	components: {
		loginModal,
		getLocationModal
	},
	data() {
		return {
			url: '',
			loginCallBack: () => {},
			cancelLogin: () => {}
		};
	},
	computed: {
		token() {
			return this.$store.state.token;
		},
		shareUrl() {
			let index1 = this.url.indexOf('?');
			let index2 = this.url.indexOf('#');
			return this.url.slice(0, index1 + 1) + 'token={token}' + this.url.slice(index2);
		}
	},
	// #ifdef MP-WEIXIN
	// 微信分享小程序给朋友
	onShareAppMessage() {
		let title = '帮驻'
		let path = '/pages/index/index'
		if(this.url.indexOf('pages/parkingCard/index1') >-1){
			 title = '帮TA付，自在出行'
			 path = '/pages/web_view/index?url=' + encodeURIComponent(this.shareUrl)
		}
		return {
			title: title,
			path: path,
			imageUrl: this.$store.state.webUrl + '/images/mobile/small_routine_share_surface.jpg'
		};
	},
	// #endif
	onLoad(option) {
		let url = decodeURIComponent(option.url || '');
		if (url.indexOf('{token}') > -1) {
			if (this.token) {
				url = url.replace('{token}', this.token);
				this.url = url;
				console.log(this.url);
			} else {
				this.$refs.login.getUserInfoStep();
				this.loginCallBack = async () => {
					url = url.replace('{token}', this.token);
					this.url = url;
					console.log(this.url);
				};
				this.cancelLogin = async () => {
					uni.reLaunch({
						url: '/pages/index/index'
					});
				};
			}
		} else {
			this.url = url;
			console.log(this.url);
		}
	},
	methods: {
		handleGetMessage(e) {
			console.log(e.detail.data);
			if (e.detail && e.detail.data && e.detail.data.length) {
				const index = e.detail.data.length - 1;
				if (e.detail.data[index].value !== undefined) {
					uni.$emit('update', e.detail.data[index].value);
				} else {
					uni.$emit('update');
				}
			}
		}
	}
};
</script>

<style></style>

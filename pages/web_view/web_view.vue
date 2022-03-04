<template>
	<view>
		<web-view v-if="url" :src="url" @message="handleGetMessage"></web-view>
		<login-modal ref='login' @loginCallBack="loginCallBack" navigateState='1'></login-modal>
		<get-location-modal ref="getLocationRef"></get-location-modal>
	</view>
</template>

<script>
	import {
		mapQuery,
		get
	} from '@/utils/miniLodash';
	import loginModal from '@/components/loginModal/loginModal.vue'
	import getLocationModal from '@/components/getLocationModal/getLocationModal.vue';
	export default {
		components: {
			loginModal,
			getLocationModal
		},
		data() {
			return {
				option: {},
				url: '',
				loginCallBack: () => {},
			};
		},
		onLoad: function(option) {
			// option.needLogin = true
			this.option = option
			if (option.needLogin) {
				// 地理位置授权
				if (!this.longitude) {
					console.log(1)
					this.$refs.getLocationRef.getLocation((res) => {
						this.checkLogin()
					});
				} else {
					console.log(2)
					this.checkLogin()
				}
			} else {
				let url = option.url || '';
				let path = option.path ? decodeURIComponent(option.path) : '';
				delete option.url;
				delete option.path;
				let params = mapQuery(option);
				if (params) {
					params = '?' + params;
				}
				this.url = decodeURIComponent(url) + params + path;
				console.log(this.url);
			}

		},
		computed: {
			longitude() {
				return this.$store.state.location.longitude
			},
			latitude() {
				return this.$store.state.location.latitude
			},
			isLogin() {
				return Object.keys(get(this.$store.state, 'userInfo', {})).length > 0;
			}
		},
		methods: {
			handleGetMessage(e) {
				console.log(e.detail.data)
				if (e.detail && e.detail.data && e.detail.data.length) {
					const index = e.detail.data.length - 1
					if (e.detail.data[index].value !== undefined) {
						uni.$emit('update', e.detail.data[index].value)
					} else {
						uni.$emit('update')
					}
				}
			},
			async checkLogin() {
				// 登录授权
				if (!this.isLogin) {
					this.$refs.login.getUserInfoStep();
					this.loginCallBack = async () => {
						this.url = this.$store.state.h5Url + '?token=' + this.$store.state.token + '&lat=' + this.latitude +
							'&lng=' + this.longitude + '#/' + decodeURIComponent(this.option.url)
					};
				} else {
					this.url = this.$store.state.h5Url + '?token=' + this.$store.state.token + '&lat=' + this.latitude +
						'&lng=' + this.longitude + '#/' + decodeURIComponent(this.option.url)
				}
			},
		}
	};
</script>

<style></style>

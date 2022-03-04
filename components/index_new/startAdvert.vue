<template>
	<u-popup v-model="show" mode="center" transparent="true" :maskCloseAble="false">
		<view class="main">
			<view class="content" @click="goUrl(advList[0])"><image class="image" :src="Imgpath + advList[0].icon"></image></view>
			<view class="close"><image @click="show = false" src="@/static/img/close.png"></image></view>
		</view>
	</u-popup>
</template>

<script>
import { goLink } from '@/utils/link';
import { get, mapQuery } from '@/utils/miniLodash';
import { mapState, mapActions, mapMutations } from 'vuex';
export default {
	data() {
		return {
			show: false,
			type: 16
		};
	},
	computed: {
		...mapState('commonModule', ['advList']),
		staticImg() {
			return this.$store.state.staticImg;
		},
		Imgpath() {
			return this.$store.state.Imgpath;
		},
		isLogin() {
			return Object.keys(get(this.$store.state, 'userInfo', {})).length > 0;
		}
	},
	methods: {
		...mapActions('commonModule', ['getAdvList', 'saveAdvertClickRecord']),
		async getData() {
			this.getAdvList({ type: this.type }).then(res => {
				if (this.advList.length) {
					this.show = true;
				} else {
					this.show = false;
				}
			});
		},
		checkLogin(callback) {
			if (this.isLogin) {
				callback();
			} else {
				// 发起登录请求
				this.$bus.$emit('needLogin');
				// 登录成功回调
				this.$bus.$on('loginSuccess', () => {
					callback();
				});
			}
		},
		//广告位跳转
		goUrl(item) {
			//advId: 广告id , putRecordId: 广告投放记录id
			this.show = false;
			if (item.isOpen) {
				this.checkLogin(() => {
					this.intent(item.miniprogramurl);
					if (item.miniprogramurl) {
						this.saveAdvertClickRecord({
							advId: item.id,
							putRecordId: item.putRecordId
						});
					}
				});
			} else {
				this.intent(item.miniprogramurl);
				if (item.miniprogramurl) {
					this.saveAdvertClickRecord({
						advId: item.id,
						putRecordId: item.putRecordId
					});
				}
			}
		},
		intent(url, appid) {
			if (!url) {
				return;
			}
			if (url[0] == '/') {
				if (appid) {
					// #ifdef MP-WEIXIN
					wx.navigateToMiniProgram({
						appId: appid, // 要跳转的小程序的appid
						path: url // 跳转的目标页面
					});
					// #endif
				} else {
					uni.navigateTo({
						url
					});
					// 跳转到小程序其他页面时更新一下位置
					this.$store.dispatch('updataLocation');
				}
			} else if (url.indexOf('/h5/ugc') > -1) {
				const index = url.indexOf('#');
				const completeUrl =
					url.slice(0, index) +
					'?' +
					mapQuery({
						token: this.$store.state.token,
						lat: this.$store.state.location.latitude,
						lng: this.$store.state.location.longitude
					}) +
					url.slice(index);
				uni.navigateTo({
					url: '/pages/web_view/index?url=' + encodeURIComponent(completeUrl)
				});
			} else {
				uni.navigateTo({
					url: '/pages/web_view/index?url=' + encodeURIComponent(url)
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.main {
	width: 590rpx;
	height: 920rpx;
}
.content {
	height: 800rpx;
	border-radius: 20rpx;
	background-color: #fff;
	overflow: hidden;
	position: relative;
	.image {
		width: 100%;
		height: 100%;
		border-radius: 20rpx;
	}
}
.close {
	height: 120rpx;
	text-align: center;
	image {
		margin-top: 60rpx;
		width: 60rpx;
		height: 60rpx;
	}
}
</style>

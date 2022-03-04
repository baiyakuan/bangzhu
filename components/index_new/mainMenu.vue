<template>
	<view class="menu">
		<swiper style="height: 256rpx;" @change="change">
			<swiper-item v-for="(item, index1) in swiperList" :key="index1">
				<view style="display: flex;flex-wrap: wrap;padding: 0 10rpx;box-sizing: border-box;">
					<view v-for="(menu, index) in item.menuList" :key="index" class="menu_item" @click.stop="clickMenu(menu)">
						<image :src="Imgpath + menu.icon"></image>
						<view class="label">{{ menu.menuName }}</view>
					</view>
				</view>
			</swiper-item>
		</swiper>

		<!-- swiper指示点 -->
		<view v-if="swiperCount > 1" class="list"><view v-for="(item, index) in swiperCount" :key="index" class="item" :class="{ active: activeIndex == index }"></view></view>
	</view>
</template>

<script>
import store from '@/store';
import { get, mapQuery } from '@/utils/miniLodash';
import { getNearStation, selectByManage } from '@/api';

export default {
	data() {
		return {
			swiperList: [],
			swiperCount: 0,
			activeIndex: 0
		};
	},
	computed: {
		Imgpath() {
			return store.state.Imgpath;
		},
		isLogin() {
			return Object.keys(get(this.$store.state, 'userInfo', {})).length > 0;
		},
		menuList() {
			return store.getters.menu.indexMenuList;
		},
		refuelAdList() {
			return store.getters.refuelAdList;
		}
	},
	watch: {
		menuList(newList) {
			newList.forEach(item => {
				if (item.miniprogramUrl == '/basic/parking/parking') {
					item.isOPen = false;
				}
			});
			this.swiperList = [];
			this.swiperCount = Math.ceil(this.menuList.length / 10);
			for (let i = 0; i < this.swiperCount; i++) {
				this.swiperList.push({
					menuList: this.menuList.slice(i * 10, (i + 1) * 10)
				});
			}
		}
	},
	mounted() {},
	methods: {
		change(event) {
			this.activeIndex = event.detail.current;
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
		clickMenu(item) {
			const that = this;
			if (item.isOnline) {
				if (item.isOPen) {
					this.checkLogin(() => {
						if (item.miniprogramUrl == '/basic/addOil/addOil') {
							// 需要判断附近是否有加油站
							that.goAddOil(item.miniprogramUrl);
						} else if (item.miniprogramUrl) {
							that.intent(item.miniprogramUrl, item.miniprogramOtherAppid);
						}
					});
				} else {
					if (item.miniprogramUrl == '/basic/addOil/addOil') {
						// 需要判断附近是否有加油站
						that.goAddOil(item.miniprogramUrl);
					} else if (item.miniprogramUrl) {
						that.intent(item.miniprogramUrl, item.miniprogramOtherAppid);
					}
				}
			} else {
				uni.showToast({
					title: item.notOnlineHint,
					icon: 'none'
				});
			}
		},
		async goAddOil(url) {
			const location = this.$store.state.location;
			const that = this;
			// 需要判断附近是否有加油站
			const { data } = await getNearStation({
				longitude: location.longitude,
				latitude: location.latitude,
				range: '',
				istrue: true
			});
			if (data.code == 1 && data.obj && data.obj.refuelStationInfo && data.obj.refuelStationInfo.length) {
				uni.navigateTo({
					url: url
				});
			} else {
				let h5url = '';
				if (that.refuelAdList && that.refuelAdList.length) {
					h5url = that.refuelAdList[0].miniprogramurl;
					const completeUrl =
						h5url +
						'?' +
						mapQuery({
							token: this.$store.state.token,
							lat: this.$store.state.location.latitude,
							lng: this.$store.state.location.longitude
						}) +
						'#/';
					uni.navigateTo({
						url: '/pages/web_view/index?url=' + encodeURIComponent(completeUrl)
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
.menu {
	background-color: #fff;
	margin: 0 20rpx;
	border-radius: 40rpx;
	margin-top: 30rpx;
	padding: 20rpx 0;
	position: relative;
	top: -40rpx;
	.menu_item {
		text-align: center;
		width: 20%;
		padding: 16rpx 0;
		image {
			width: 56rpx;
			height: 56rpx;
		}
		.label {
			font-size: 24rpx;
			color: #24282b;
			font-family: PingFang SC;
			font-weight: 400;
		}
	}
}
.list {
	width: 200rpx;
	height: 6rpx;
	margin: 0 auto;
	display: flex;
	align-items: center;
	border-radius: 10rpx;
}
.item {
	flex: 1;
	background-color: #f5f5f5;
	height: 100%;
	// transition: background-color 1s;
}
.active {
	background-color: #f33535;
	border-radius: 10rpx;
}
</style>

<template>
	<view class="page">
		<view class="left" id="left">
			<view class="item" v-for="(item, index) in leftList" :key="index" @click="goWebView(item)">
				<image :src="Imgpath + item.imgPath" mode="widthFix"></image>
				<view class="title">{{ item.adName }}</view>
			</view>
		</view>
		<view class="right" id="right">
			<view class="item" v-for="(item, index) in rightList" :key="index" @click="goWebView(item)">
				<image :src="Imgpath + item.imgPath" mode="widthFix"></image>
				<view class="title">{{ item.adName }}</view>
			</view>
		</view>
	</view>
</template>

<script>
import { get } from '@/utils/miniLodash';

export default {
	data() {
		return {
			leftList: [],
			rightList: [],
			index: 0
		};
	},
	computed: {
		isLogin() {
			return Object.keys(get(this.$store.state, 'userInfo', {})).length > 0;
		},
		flowList() {
			return this.$store.getters.waterList;
		},
		Imgpath() {
			return this.$store.state.Imgpath;
		}
	},
	watch: {
		flowList() {
			this.leftList = [];
			this.rightList = [];
			this.index = 0;
			this.addElement('left');
		}
	},
	methods: {
		addElement(flag) {
			if (this.index > this.flowList.length - 1) {
				return;
			}
			if (flag == 'left') {
				this.leftList.push(this.flowList[this.index]);
			} else if (flag == 'right') {
				this.rightList.push(this.flowList[this.index]);
			} else {
				return;
			}
			this.index++;
			const that = this;
			setTimeout(() => {
				that.getElementHeight('#left', res1 => {
					that.getElementHeight('#right', res2 => {
						if (res2 < res1) {
							that.addElement('right');
						} else {
							that.addElement('left');
						}
					});
				});
			}, 200);
		},
		getElementHeight(id, callback) {
			const query = uni.createSelectorQuery().in(this);
			query
				.select(id)
				.boundingClientRect(data => {
					if (callback) {
						callback(data.height);
					}
				})
				.exec();
		},
		goWebView(item) {
			const that = this;
			if (this.isLogin || !item.isOPen) {
				that.intent(item.miniprogramUrl, item.miniprogramOtherAppid);
			} else {
				// 发起登录请求
				this.$bus.$emit('needLogin');
				// 登录成功回调
				this.$bus.$on('loginSuccess', () => {
					that.intent(item.miniprogramUrl, item.miniprogramOtherAppid);
				});
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
				}
			} else {
				uni.navigateTo({
					url: '/pages/web_view/index?url=' + encodeURIComponent(url)
				});
			}
		}
	}
};
</script>

<style scoped lang="scss">
.page {
	margin: 0 20rpx;
	margin-top: 30rpx;
	border-radius: 40rpx;
	box-sizing: border-box;
	display: flex;
	flex-direction: row;
	align-items: flex-start;
	position: relative;
	top: -40rpx;
}
.left {
	flex: 1;
}
.right {
	flex: 1;
	margin-left: 10rpx;
}
.item {
	width: 100%;
	margin-bottom: 10rpx;
	font-size: 0;
	image {
		width: 100%;
		border-radius: 20rpx 20rpx 0 0;
	}
	.title {
		width: 100%;
		background-color: #fff;
		padding: 24rpx;
		box-sizing: border-box;
		border-radius: 0 0 20rpx 20rpx;
		font-size: 24rpx;
	}
}
</style>

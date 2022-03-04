<template>
	<view class="swiper_wrapper" v-if="advList.length && show">
		<swiper class="swiper" @change="change" :autoplay="autoplay" :interval="interval">
			<swiper-item v-for="(item, index) in advList" :key="index">
				<view class="swiper-item uni-bg-red" @click="goUrl(item)"><image :src="Imgpath + item.icon"></image></view>
			</swiper-item>
		</swiper>
		<!-- swiper指示点 -->
		<view v-if="advList.length > 1" class="list"><view v-for="(item, index) in advList" :key="index" class="item" :class="{ active: activeIndex == index }"></view></view>
	</view>
</template>

<script>
import { goLink } from '@/utils/link';
import { mapState, mapActions, mapMutations } from 'vuex';
export default {
	computed: {
		...mapState('commonModule', ['advList']),
		Imgpath() {
			return this.$store.state.Imgpath;
		},
		staticImg() {
			return this.$store.state.staticImg;
		}
	},
	props: {
		type: {
			type: Number
		}
	},
	mounted() {
		console.log(this.type);
		this.getAdvList({ type: this.type });
	},
	data() {
		return {
			show: true,
			activeIndex: 0,
			autoplay: true,
			interval: 2000
		};
	},
	methods: {
		...mapActions('commonModule', ['getAdvList', 'saveAdvertClickRecord']),
		change(event) {
			this.activeIndex = event.detail.current;
		},
		//广告位跳转
		goUrl(item) {
			console.log(item);
			//advId: 广告id , putRecordId: 广告投放记录id

			this.intent(item.miniprogramurl);
			if (item.miniprogramurl) {
				this.saveAdvertClickRecord({
					advId: item.id,
					putRecordId: item.putRecordId
				});
			}
		},
		intent(url, appid) {
			console.log(url);
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

<style lang="scss">
.swiper_wrapper {
	// padding: 40rpx;

	.list {
		height: 4rpx;
		margin: 20rpx auto 0;
		padding-bottom: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 10rpx;
		flex-wrap: nowrap;
		.item {
			width: 40rpx;
			margin-right: 20rpx;
			background: rgba(27, 25, 18, 0.1);
			height: 100%;
			border-radius: 4rpx;
			overflow: hidden;
			&:last-child {
				margin-right: 0;
			}
			&.active {
				background-color: #f33535;
			}
		}
	}
	.swiper {
		width: 670rpx;
		height: 240rpx;
		border-radius: 20rpx;
		overflow: hidden;
		margin: 0 auto;
		.swiper-item {
			width: 100%;
			height: 100%;
			border-radius: 20rpx;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
				border-radius: 20rpx;
				overflow: hidden;
			}
		}
	}
}
</style>

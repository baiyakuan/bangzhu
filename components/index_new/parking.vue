<template>
	<view class="recommend">
		<view class="title">附近推荐</view>
		<view class="parking">
			<view class="parking_top" @click.stop="nav2parkLotDetail">
				<image :src="Imgpath + recommendParking.imgList[0]" style="width: 160rpx;height: 124rpx;border-radius: 20rpx;flex-shrink: 0;"></image>
				<view style="flex: 1;height: 120rpx;display: flex;flex-direction: column;justify-content: space-between;margin-left: 24rpx;">
					<view style="display: flex;align-items: center;width: 446rpx;">
						<view class="name">{{ recommendParking.name }}</view>
						<view class="distance">{{ targetText }}{{ recommendParking.distance }}</view>
					</view>
					<view class="address">{{ recommendParking.address }}</view>
					<view style="display: flex;align-items: center;">
						<view class="charge" v-if="recommendParking.price !== null">{{ recommendParking.price }}元/时</view>
						<view v-if="recommendParking.cardTypeStr" style="display: flex;align-items: center;" @click.stop="">
							<view v-if="recommendParking.cardTypeStr.indexOf('1') > -1" class="rent">周租</view>
							<view v-if="recommendParking.cardTypeStr.indexOf('2') > -1" class="rent">月租</view>
							<view v-if="recommendParking.cardTypeStr.indexOf('3') > -1" class="rent">年租</view>
						</view>
					</view>
				</view>
			</view>
			<view class="parking_bottom">
				<view style="display: flex;align-items: center;font-size: 22rpx;">
					空位/总车位
					<view style="color: #f33535;margin-left: 20rpx;">{{ recommendParking.carNum }}</view>
					/{{ recommendParking.carTotalNum }}
				</view>
				<view class="navigation" @click.stop="nav2target(recommendParking)">
					<image :src="staticImg + 'static/image/navigation.png'"></image>
					导航
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { get } from '@/utils/miniLodash';

export default {
	props: {
		recommendParking: {
			default: {}
		}
	},
	computed: {
		Imgpath() {
			return this.$store.state.Imgpath;
		},
		staticImg() { return this.$store.state.staticImg },
		isLogin() {
			return Object.keys(get(this.$store.state, 'userInfo', {})).length > 0;
		},
		ownLongitude() {
			return this.$store.state.location.longitude;
		},
		ownLatitude() {
			return this.$store.state.location.latitude;
		}
	},
	mounted() {
		this.$bus.$on('changeTargetLocation', location => {
			if (location.longitude == 0 || location.latitude == 0) {
				return false;
			}
			this.checkTargetText(location);
		});
	},
	data() {
		return {
			image: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2354995984,3688316368&fm=26&gp=0.jpg',
			targetText: '距目的地'
		};
	},
	methods: {
		// 导航去停车场详情
		nav2parkLotDetail() {
			const item = this.recommendParking;
			if (this.isLogin) {
				if (item.ptype == 'bg') {
					uni.navigateTo({
						url: `/basic/parkLotDetail/index?id=${item.code}&distance=${item.distance}&islogin=${this.isLogin}`
					});
				} else {
					uni.navigateTo({
						url: `/basic/parkLotDetail/index?name=${item.name}&address=${item.address}&lnt=${item.lnt}&lat=${item.lat}&islogin=${this.isLogin}`
					});
				}
			} else {
				// 发起登录请求
				this.$bus.$emit('needLogin');
				// 登录成功回调
				this.$bus.$on('loginSuccess', () => {
					if (item.ptype == 'bg') {
						uni.navigateTo({
							url: `/basic/parkLotDetail/index?id=${item.code}&distance=${item.distance}&islogin=${this.isLogin}`
						});
					} else {
						uni.navigateTo({
							url: `/basic/parkLotDetail/index?name=${item.name}&address=${item.address}&lnt=${item.lnt}&lat=${item.lat}&islogin=${this.isLogin}`
						});
					}
				});
			}
		},
		nav2target(item) {
			uni.openLocation({
				latitude: parseFloat(item.lat),
				longitude: parseFloat(item.lnt),
				name: item.name,
				address: item.address
			});
		},
		checkTargetText(location) {
			if(location.longitude && location.latitude){
				if (String(location.longitude).slice(0, 6) == String(this.ownLongitude).slice(0, 6) && String(location.latitude).slice(0, 6) == String(this.ownLatitude).slice(0, 6)) {
					this.targetText = '距您';
				} else {
					this.targetText = '距目的地';
				}
			}else{
				this.targetText = '距您';
			}
			
		}
	}
};
</script>

<style lang="scss" scoped>
.recommend {
	width: 710rpx;
	box-sizing: border-box;
	background-image: linear-gradient(to right, #f33535, #ff4610);
	margin: 0 20rpx;
	border-radius: 40rpx;
}
.title {
	height: 54rpx;
	color: #fff;
	padding: 0 40rpx;
	box-sizing: border-box;
	line-height: 54rpx;
	font-size: 24rpx;
	font-weight: bold;
}
.parking {
	background-color: #fff;
	border-radius: 40rpx;
	box-sizing: border-box;
	.parking_top {
		height: 184rpx;
		display: flex;
		align-items: center;
		padding: 0 40rpx;
		padding-top: 10rpx;
		box-sizing: border-box;
		.address {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: 22rpx;
			width: 446rpx;
			color: #7a818d;
			font-weight: 400;
			font-family: PingFang SC;
		}
		.name {
			font-size: 30rpx;
			font-weight: bold;
			color: #1b1912;
			font-family: PingFang SC;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.distance {
			flex-shrink: 0;
			margin-left: auto;
			color: #f33535;
			height: 32rpx;
			line-height: 32rpx;
			box-sizing: border-box;
			font-size: 20rpx;
			border: 2rpx solid #f33535;
			border-radius: 20rpx;
			padding: 0 20rpx;
			font-family: PingFang SC;
		}
		.charge {
			font-size: 22rpx;
			font-weight: 400;
			color: #f33535;
			margin-right: 40rpx;
			font-family: PingFang SC;
		}
		.rent {
			width: 60rpx;
			height: 30rpx;
			line-height: 30rpx;
			border-radius: 8rpx;
			background-color: #f33535;
			color: #fff;
			font-size: 20rpx;
			font-family: PingFang SC;
			font-weight: bold;
			text-align: center;
			margin-right: 20rpx;
		}
	}
	.parking_bottom {
		height: 94rpx;
		display: flex;
		align-items: center;
		background-color: #f0f0f0;
		border-radius: 0 0 40rpx 40rpx;
		padding: 0 40rpx;
		box-sizing: border-box;
		.navigation {
			width: 144rpx;
			height: 60rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			background-color: #1b1912;
			border-radius: 20rpx;
			margin-left: auto;
			color: #fff;
			font-size: 22rpx;
			image {
				width: 20rpx;
				height: 20rpx;
				margin-left: 30rpx;
				margin-right: 10rpx;
			}
		}
	}
}
</style>

<template>
	<drawer ref="myDrawer" width="750" :transparent="true">
		<view class="page" @click="close" :style="{ 'padding-top': (statusBarHeight + inputTop) * rate + 'rpx' }">
			<view style="border-radius: 20rpx;box-sizing: border-box;margin: 0 30rpx;" @click.stop="">
				<view style="display: flex;align-items: center;">
					<view class="input">
						<image :src="staticImg + 'static/image/search_icon.png'"></image>
						<input v-if="showInput" v-model="searchVal" class="search_input" placeholder-class="placeholder" @input="_lazySearch" placeholder="搜目的地，找停车位..." />
					</view>
					<view class="cancel" @click="close">取消</view>
				</view>

				<scroll-view
					:style="{ height: (screenHeight - statusBarHeight - 150) * rate + 'rpx' }"
					style="padding-top: 40rpx;box-sizing: border-box;width: 110%;"
					:scroll-y="true"
					:scroll-with-animation="true"
				>
					<!-- 历史记录 -->
					<view v-if="searchVal == ''">
						<view v-for="(item, index) in historyList" :key="index" class="history" @click.stop="clickHistory(item)">
							<image :src="staticImg + 'static/image/history.png'" style="width: 20rpx;height: 20rpx;flex-shrink: 0;"></image>
							<view style="width: 542rpx;display: flex;flex-direction: column;height: 100%;justify-content: space-between;margin: 0 24rpx;">
								<view class="name">{{ item.title }}</view>
								<view class="address">{{ item.address }}</view>
							</view>
							<image @click.stop="deleteHistory(index)" :src="staticImg + 'static/image/close1.png'" style="width: 16rpx;height: 16rpx;flex-shrink: 0;padding: 20rpx;"></image>
						</view>
					</view>

					<view v-if="searchVal">
						<view v-for="(item, index) in list" :key="index" class="item" @click.stop="nav2ParkingDetails(item)">
							<view style="display: flex;flex-direction: column;height: 100%;width: 550rpx;margin-left: 20rpx;">
								<view class="info">
									<view class="name">{{ item.parkingName }}</view>
									<view class="own">自营</view>
									<view v-if="item.t == 1" class="tip">
										<view>空位</view>
										<view class="count">{{ item.carNum }}</view>
										<view class="amount" v-if="item.carTotalNum">/{{ item.carTotalNum }}</view>
									</view>
									<view v-else>空位未知</view>
								</view>
								<view class="address">{{ item.address }}</view>
							</view>
							<view style="text-align: center;height: 100%;width: 120rpx;flex-shrink: 0;">
								<image :src="staticImg + 'static/img/parking-09.png'" style="width: 40rpx;height: 40rpx;" @click.stop="nav2target(item)"></image>
								<view style="font-size: 16rpx;font-weight: bold;color: #f33535;margin-top: auto;">距您 {{ item.distance }}</view>
							</view>
						</view>
					</view>

					<view v-if="searchVal">
						<view v-for="(item, index) in listmapaddress" :key="index" class="item" @click.stop="nav2parkposition(item)">
							<view style="display: flex;flex-direction: column;height: 100%;width: 550rpx;margin-left: 20rpx;">
								<view class="info">
									<view class="name">{{ item.title }}</view>
									<!-- <view class="tip">空位未知</view> -->
								</view>
								<view class="address">{{ item.address }}</view>
							</view>
							<view style="text-align: center;height: 100%;width: 120rpx;flex-shrink: 0;">
								<image :src="staticImg + 'static/img/parking-09.png'" style="width: 40rpx;height: 40rpx;" @click.stop="nav2target(item)"></image>
								<view style="font-size: 16rpx;font-weight: bold;color: #f33535;margin-top: auto;">距您 {{ item._distance }}</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</drawer>
</template>

<script>
import drawer from '@/components/uni-drawer/uni-drawer.vue';
import { getSearchParkingOfAddress } from '@/api';
import { get, debounce } from '@/utils/miniLodash';
import QQMapWX from '@/plugins/qqmap-wx-jssdk.min';

export default {
	components: {
		drawer
	},
	props: {
		inputTop: {
			type: Number,
			default: 92
		},
		inParkingPage: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			statusBarHeight: 0, // 状态栏高度
			screenHeight: 0, // 屏幕高度
			rate: 0,
			searchVal: '',
			historyList: [],
			listmapaddress: [], // 地图POI搜索结果
			list: [], // 帮驻后台搜索结果
			showInput: false
		};
	},
	computed: {
		location() {
			return this.$store.state.location;
		},
		staticImg() { return this.$store.state.staticImg },
		isLogin() {
			return Object.keys(get(this.$store.state, 'userInfo', {})).length > 0;
		}
	},
	mounted() {
		// debounce搜索 防止频繁调用接口
		this._lazySearch = debounce(this.getParkingOfAddress, 500);
	},
	created() {
		uni.getSystemInfo({
			complete: res => {
				this.statusBarHeight = res.statusBarHeight;
				this.screenHeight = res.screenHeight;
				this.rate = 750 / res.screenWidth;
			}
		});
	},
	methods: {
		open() {
			const that = this;
			uni.getStorage({
				key: 'history_list',
				success: function(res) {
					that.historyList = JSON.parse(res.data);
				}
			});
			this.$refs.myDrawer.open();
			setTimeout(() => {
				this.showInput = true;
			}, 500);
		},
		close() {
			this.$refs.myDrawer.close();
			this.$emit('close');
			this.showInput = false;
			this.searchVal = '';
			this.listmapaddress = [];
			this.list = [];
		},
		// 获取搜索停车场
		async getParkingOfAddress() {
			this.listmapaddress = [];
			this.list = [];
			if (this.searchVal == '') {
				return;
			}
			var that = this;
			if (that.searchVal) {
				const params = {
					str: that.searchVal,
					lnt: this.location.longitude,
					lat: this.location.latitude
				};
				// 实例化API核心类
				let demo = new QQMapWX({
					key: 'KRKBZ-G4LC2-6RZU2-CUHUP-63UMK-FTB46' // 必填
				});
				// 调用接口
				demo.search({
					keyword: that.searchVal,
					// filter: 'category=停车场',
					success: function(res) {
						that.listmapaddress = res.data.sort((a, b) => {
							var val1 = a._distance;
							var val2 = b._distance;
							if (val1 > val2) {
								return 1;
							} else if (val1 < val2) {
								return -1;
							} else {
								return 0;
							}
						});
						that.listmapaddress = that.listmapaddress.map(item => {
							item._distance = item._distance >= 1000 ? (item._distance / 1000).toFixed(2) + 'km' : item._distance.toFixed(0) + 'm';
							item.parkType = 'point';
							item.latitude = item.location.lat;
							item.longitude = item.location.lng;
							return item;
						});
					}
				});
				let { data } = await getSearchParkingOfAddress(params);
				if (data.code == '1') {
					that.list = data.obj.gatesList.map(item => {
						item.price = parseInt(item.price).toFixed(1);
						item.parkType = 'ownPark';
						item.title = item.parkingName;
						// let distance = calculateDistance(that.location, item)
						item.distance = item.distance >= 1000 ? (item.distance / 1000).toFixed(1) + 'km' : item.distance.toFixed(0) + 'm';
						return item;
					});
				}
			}
		},
		clickHistory(item) {
			this.searchVal = item.title;
			this.getParkingOfAddress()
		},
		// 点击地图导航
		nav2target(item) {
			uni.openLocation({
				latitude: parseFloat(item.latitude),
				longitude: parseFloat(item.longitude),
				name: item.title,
				address: item.address
			});
		},
		// 去停车场详情页
		nav2ParkingDetails(item) {
			const that = this;
			uni.navigateTo({
				url: '/basic/parkLotDetail/index?id=' + item.parkingId + '&islogin=' + that.isLogin
			});
			setTimeout(() => {
				that.close();
			}, 1000);
			this.saveHistory(item);
		},
		// 去停车页
		nav2parkposition(item) {
			const that = this;
			if (this.inParkingPage) {
				this.close();
				this.$emit('searchChange', { lng: item.longitude, lat: item.latitude, parkType: item.parkType, parkingId: item.parkingId });
			} else {
				uni.navigateTo({
					url: '/basic/parking/parking?lng=' + item.longitude + '&lat=' + item.latitude + '&parkType=' + item.parkType + '&parkingId=' + item.parkingId
				});
				setTimeout(() => {
					that.close();
				}, 1000);
			}
			this.saveHistory(item);
		},
		saveHistory(obj) {
			const existence = this.historyList.some(item => {
				return item.title == obj.title;
			});
			if (!existence) {
				this.historyList.unshift(obj);
				uni.setStorage({
					key: 'history_list',
					data: JSON.stringify(this.historyList)
				});
			}
		},
		deleteHistory(index) {
			this.historyList.splice(index, 1);
			uni.setStorage({
				key: 'history_list',
				data: JSON.stringify(this.historyList)
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.page {
	width: 100%;
	height: 100%;
	background-color: rgba(255, 255, 255, 0.9);
	position: fixed;
	top: 0;
	box-sizing: border-box;
}
.input {
	display: flex;
	align-items: center;
	background-color: #fff;
	flex: 1;
	height: 80rpx;
	border-radius: 20rpx;
	image {
		margin-left: 14rpx;
		width: 30rpx;
		height: 30rpx;
	}
	.search_input {
		flex: 1;
		height: 100%;
		border: none;
		outline: none;
		box-sizing: border-box;
		font-size: 24rpx;
		font-weight: bold;
		margin-left: 24rpx;
		color: #1b1912;
		font-family: PingFang SC;
		padding-right: 20rpx;
	}
	// input::-webkit-input-placeholder {
	// 	color: #1b1912;
	// 	opacity: 0.5;
	// 	font-size: 24rpx;
	// 	font-weight: bold;
	// }
	// .placeholder {
	// 	color: #1b1912;
	// 	opacity: 0.5;
	// 	font-size: 22rpx;
	// 	font-weight: bold;
	// }
}
.cancel {
	color: #666;
	font-size: 24rpx;
	font-weight: bold;
	margin-left: 30rpx;
	margin-right: 10rpx;
}
.item {
	height: 72rpx;
	margin-bottom: 40rpx;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	.info {
		display: flex;
		align-items: center;
	}
	.name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 24rpx;
		font-weight: bold;
		color: #1b1912;
		font-family: PingFang SC;
	}
	.own {
		width: 60rpx;
		height: 30rpx;
		line-height: 30rpx;
		border-radius: 8rpx;
		background-color: #f33535;
		font-size: 20rpx;
		font-weight: bold;
		color: #fff;
		margin-left: 22rpx;
		text-align: center;
		flex-shrink: 0;
	}
	.tip {
		font-size: 22rpx;
		font-weight: 400;
		color: #7a818d;
		font-family: PingFang SC Regular;
		margin-left: 22rpx;
		display: flex;
		align-items: center;
		flex-shrink: 0;
	}
	.count {
		font-size: 22rpx;
		font-weight: 400;
		color: #f33535;
		font-family: PingFang SC Bold;
	}
	.amount {
		font-size: 22rpx;
		font-weight: 400;
		color: #1b1912;
		font-family: PingFang SC Regular;
	}
	.address {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-top: auto;
		font-size: 20rpx;
		font-weight: 400;
		color: #7a818d;
		font-family: PingFang SC;
	}
}
.history {
	width: 690rpx;
	display: flex;
	align-items: center;
	height: 72rpx;
	margin-bottom: 40rpx;
	padding-left: 24rpx;
	box-sizing: border-box;
	.name {
		font-size: 24rpx;
		font-weight: bold;
		color: #1b1912;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.address {
		font-size: 20rpx;
		font-weight: 400;
		color: #7a818d;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}
.item:first-child {
	// margin-top: 40rpx;
}
.history:first-child {
	// margin-top: 40rpx;
}
</style>

<template>
	<u-popup v-model="showSearchModal" mode="bottom" length="100%">
		<view class="page" @click="close" :style="{ 'padding-top': (statusBarHeight + inputTop) * rate + 'rpx' }">
			<view style="border-radius: 20rpx;box-sizing: border-box;" @click.stop="">
				<view style="display: flex;align-items: center;margin:30rpx;">
					<view class="input">
						<view class="toBottomIcon"  @click.stop="close">
							<!-- <image :src="staticImg+ ''" mode=""></image> -->
							<image :src="staticImg + 'static/img/touchRaw.png'" mode=""></image>
						</view>
						<image :src="staticImg + 'static/image/search_icon.png'"></image>
						<input focus v-if="showInput" v-model="searchVal" class="search_input" placeholder-class="placeholder" @input="_lazySearch" placeholder="请输入目的地" />
					</view>
				</view>
		
				<view class="searchDownWrapper">
					<scroll-view
						:style="{ height: (screenHeight - statusBarHeight - inputTop - 60) * rate + 'rpx' }"
						style="padding-top: 28rpx;box-sizing: border-box;width: 110%;"
						:scroll-y="true"
						:scroll-with-animation="true"
					>
						<!-- 历史记录 -->
						<view v-if="searchVal == ''">
							<view class="history-title" v-if="historyList.length > 0">
								历史搜索
							</view>
							<view v-for="(item, index) in historyList" :key="index" class="history" @click.stop="clickHistory(item)">
								<image :src="staticImg + 'static/image/history.png'" style="width: 20rpx;height: 20rpx;flex-shrink: 0;"></image>
								<view style="width: 542rpx;display: flex;align-items: center;height: 100%;justify-content: space-between;margin: 0 24rpx;">
									<view class="name">{{ item.title }}</view>
									<!-- <view class="address">{{ item.address }}</view> -->
								</view>
								<image @click.stop="deleteHistory(index)" :src="staticImg + 'static/image/close1.png'" style="width: 16rpx;height: 16rpx;flex-shrink: 0;padding: 20rpx;"></image>
							</view>
						</view>
			
						<view v-if="searchVal">
							<view v-for="(item, index) in list" :key="index" @click.stop="nav2ParkingDetails(item)" style="margin-bottom: 40rpx;">
								<search-card :parking="item"></search-card>
							</view>
						</view>
			
						<view v-if="searchVal">
							<view v-for="(item, index) in listmapaddress" :key="index" class="item" @click.stop="nav2parkposition(item)" style="justify-content: space-between;">
								<view style="display: flex;flex-direction: column;height: 100%;width: 550rpx;margin-left: 20rpx;">
									<view class="info">
										<view class="name">{{ item.title }}</view>
										<!-- <view class="tip">空位未知</view> -->
									</view>
									<view class="address">{{ item.address }}</view>
								</view>
								<view style="text-align: center;height: 100%;width: 40rpx;flex-shrink: 0; justify-content: flex-end;" class="fst ">
									<image :src="staticImg + 'static/img/parking-09.png'" style="width: 40rpx;height: 40rpx;" @click.stop="nav2target(item)"></image>
									<!-- <view style="font-size: 16rpx;font-weight: bold;color: #f33535;margin-top: auto;">距您 {{ item._distance }}</view> -->
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
	</u-popup>
</template>

<script>
import SearchCard from './searchCard.vue'
import { getSearchParkingOfAddress } from '@/api';
import { get, debounce } from '@/utils/miniLodash';
import QQMapWX from '@/plugins/qqmap-wx-jssdk.min';

export default {
	components: {
		SearchCard
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
			showInput: false,
			showSearchModal: false
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
			this.showSearchModal = true;
			setTimeout(() => {
				this.showInput = true;
			}, 500);
		},
		close() {
			this.showSearchModal = false
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
						// item.price = (item.parkPrice || 0).toFixed(1);
						item.price = item.price ? item.price.toFixed(1) : 0;
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
	position: relative;
	font-family: PingFang SC;
}
.searchDownWrapper {
	background-color: #F6F8FB;
}
.input {
	display: flex;
	align-items: center;
	background-color: #F6F8FB;
	flex: 1;
	height: 80rpx;
	border-radius: 20rpx;
	image {
		margin-left: 14rpx;
		width: 30rpx;
		height: 30rpx;
	}
	.toBottomIcon {
		position: absolute;
		top: 150rpx;
		left: 50%;
		transform: translateX(-50%);
		// background-color: red;
		image {
			width: 80rpx;
			height: 16rpx;
		}
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
	margin: 0 40rpx;
	width: 80%;
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
	}
}
.history-title {
	font-weight: bold;
	color: #1B1912;
	opacity: 0.5;
	margin: 5rpx 0 30rpx 50rpx ;
}
.history {
	width: 690rpx;
	display: flex;
	align-items: center;
	height: 72rpx;
	margin-bottom: 40rpx;
	padding-left: 24rpx;
	box-sizing: border-box;
	margin: 0 26rpx 40rpx;
	.name {
		font-size: 24rpx;
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

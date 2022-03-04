<template>
	<scroll-view :style="{ height: screenHeight * rate + 'rpx' }" :scroll-y="true" :scroll-with-animation="true">
		<view class="bg" :class="{ vague: showSearch }" :style="{ 'padding-top': (statusBarHeight + 44) * rate + 'rpx' }">
			<image
				v-if="topBarInfo && topBarInfo.showType == 1 && topBarInfo.topAdInfo && topBarInfo.topAdInfo.imgPath"
				:src="imgPath + topBarInfo.topAdInfo.imgPath"
				style="width: 100%;position: absolute;top: 0;"
				mode="widthFix"
				@click.stop="clickTopAd(topBarInfo.topAdInfo)"
			></image>
			<image
				v-else-if="topBarInfo && topBarInfo.showType == 2 && topBarInfo.weatherInfo && topBarInfo.weatherInfo.isWxShow == 1 && topBarInfo.weatherInfo.imgPath"
				:src="imgPath + topBarInfo.weatherInfo.imgPath"
				style="width: 100%;position: absolute;top: 0;"
				mode="widthFix"
			></image>
			<image v-else :src="staticImg + 'static/image/bg.png'" mode="widthFix" class="default_bg"></image>

			<view class="header">
				<image style="width: 44rpx;height: 44rpx;padding: 22rpx;" @click.stop="openLeftMenu" :src="staticImg + 'static/image/head.png'"></image>
				<view class="city">{{ city }}</view>
				<!-- <image style="margin-left: auto;" :src="staticImg + 'static/image/home_msg.png'"></image> -->
				<image style="margin-left: auto;padding: 26rpx;" @click.stop="scan" :src="staticImg + 'static/image/home_scan.png'"></image>
			</view>

			<view class="map">
				<map
					id="myMap"
					:latitude="ownLocation.latitude"
					:longitude="ownLocation.longitude"
					subkey="KRKBZ-G4LC2-6RZU2-CUHUP-63UMK-FTB46"
					@updated="mapReady"
					@tap="clickTap"
					@regionchange="changeregion"
					:show-location="true"
					:scale="16"
					:markers="markers"
					@markertap="clickMarker"
				></map>

				<!-- <image class="map_icon" style="left: 10rpx;top: 10rpx;" @click="openSearch" :src="staticImg + 'static/image/map_search.png'"></image> -->
				<carouselMessage
					class="carouselMessage"
					:brandNum="brandNum"
					ref="carouselMessage"
					@clickAddCar="clickAddCar"
					@clickNotice="clickNotice"
					:isLogin="isLogin"
					:noticeList="noticeInfo"
					@openKeyBoard="show = true"
				></carouselMessage>
				<image class="map_icon" style="right: 10rpx;top: 10rpx;" :src="staticImg + 'static/image/map_big.png'" @click="goParking()"></image>
				<image class="map_icon" style="right: 10rpx;bottom: 60rpx;" @click="reset" :src="staticImg + 'static/image/map_reset.png'"></image>
				<image class="map_center" mode="widthFix" :src="staticImg + 'static/img/dtcenter.png'"></image>
			</view>

			<u-keyboard v-model="show" mode="car" :autoAddBrand="true" :showChangeLan="false" @finish="show = false"></u-keyboard>

			<mySwiper ref="swiper" :recommendParking="recommendParking"></mySwiper>

			<mainMenu @goParking="goParking"></mainMenu>

			<advertisement></advertisement>

			<left-menu ref="leftMenu"></left-menu>

			<login-modal ref="login" @loginCallBack="loginCallBack" @cancelLogin="cancelLogin"></login-modal>
			<get-location-modal ref="getLocationRef"></get-location-modal>

			<remindModal ref="remindModal" @userTap="requestSubscribeMessage"></remindModal>

			<startAdvert ref="startAdvert"></startAdvert>
		</view>

		<search ref="search" @close="showSearch = false"></search>
	</scroll-view>
</template>

<script>
import store from '@/store';
import carouselMessage from '@/components/index_new/carouselMessage.vue';
import leftMenu from '@/components/index_new/leftMenu.vue';
import recharge from '@/components/index_new/recharge.vue';
import mainMenu from '@/components/index_new/mainMenu.vue';
import search from '@/components/index_new/search.vue';

import advertisement from '@/components/index_new/advertisement.vue';
import mySwiper from '@/components/index_new/swiper.vue';
import loginModal from '@/components/loginModal/loginModal.vue';
import getLocationModal from '@/components/getLocationModal/getLocationModal.vue';
import remindModal from '@/components/index_new/remindModal.vue';
import startAdvert from '@/components/index_new/startAdvert.vue';

import { searchParkingByRange, getPayPageData, getPayDataByPayCode, scanQrCode, getWeather, getParkingRentDetailOfCode, getOpenId,parkingOrderView } from '@/api';
import { calculateDistance, formatDistance, isValidResponse } from '@/utils';
import { getSetting, requestSubscribeMessage } from '@/utils/subscribeMsgUtils';
import { goLink } from '@/utils/link';
import { get, mapQuery } from '@/utils/miniLodash';
export default {
	components: {
		carouselMessage,
		leftMenu,
		recharge,
		mainMenu,
		search,
		advertisement,
		mySwiper,
		loginModal,
		getLocationModal,
		remindModal,
		startAdvert
	},
	data() {
		return {
			ownLocation: {
				// 自己当前位置
				longitude: '116.702152',
				latitude: '35.417764',
				istrue: true
			},
			targetLocation: {
				longitude: 0,
				latitude: 0
			},
			city: '',
			province: '',
			adcode: '',
			statusBarHeight: 0, // 状态栏高度
			screenHeight: 0, // 屏幕高度
			rate: 1,
			showSearch: false,
			mapContext: undefined,
			scrollID: '',
			selectMarkerId: '',
			parkLotList: [],
			recommendParking: {},
			markers: [],
			msg: '', // 接口返回提示
			interval_order: null, //循环查询订单
			loginCallBack: () => {},
			cancelLogin: () => {},
			// isMoveToLocation: false,
			show: false,
			openStartAdv: false, // 是否需要打开首页广告，优先弹出消息订阅
			longTmplIds: []
		};
	},
	computed: {
		isLogin() {
			return Object.keys(get(this.$store.state, 'userInfo', {})).length > 0;
		},
		// 会员等级
		memberName() {
			return this.$store.state.userInfo ? this.$store.state.userInfo.memberName : '';
		},
		// 地图左下角轮播广告
		noticeInfo() {
			return this.$store.getters.orderAdList;
		},
		// 顶部广告、天气
		topBarInfo() {
			return this.$store.getters.topBarInfo;
		},
		brandNum() {
			return this.$store.state.userInfo.brandNum;
		},
		imgPath() {
			return this.$store.state.Imgpath;
		},
		webUrl() {
			return this.$store.state.webUrl;
		},
		staticImg() {
			return this.$store.state.staticImg;
		}
	},
	// #ifdef MP-WEIXIN
	// 微信分享小程序给朋友
	onShareAppMessage() {
		return {
			title: '车主福利来袭！请查收，手慢无！',
			path: '/pages/index/index',
			imageUrl: this.webUrl + '/images/mobile/small_routine_share_surface.jpg'
		};
	},
	// #endif
	onUnload() {
		console.log('onUnload');
		uni.closeSocket();
	},
	onLoad() {
		const that = this;
		this.getScreenSize();
		this.$store.dispatch('getUsersInfo');

		if (this.isLogin) {
			getSetting(['YMqIMTRIKs6UG5RMks6vQPkS-aU-2TrPPrvVJvbsMLI', 'rxnDrYTvcmRrLSTpNdQYdTbCPXgqRD1uiDycoYP8TTU', 'lcrLJmp0Y2RVAdTAHgYU8szLY8WRco8JXAs2--YE9mQ'], tmplIds => {
				that.longTmplIds = tmplIds;
				if (that.longTmplIds.length) {
					that.$refs.remindModal.open();
				} else {
					that.openStartAdv = true;
				}
			});
			// that.longTmplIds = ['YMqIMTRIKs6UG5RMks6vQPkS-aU-2TrPPrvVJvbsMLI', 'rxnDrYTvcmRrLSTpNdQYdTbCPXgqRD1uiDycoYP8TTU', 'lcrLJmp0Y2RVAdTAHgYU8szLY8WRco8JXAs2--YE9mQ'];
			// that.$refs.remindModal.open();
		} else {
			that.openStartAdv = true;
		}

		// 监听组件的登录请求
		this.$bus.$on('needLogin', () => {
			that.$refs.login.getUserInfoStep();
			that.loginCallBack = () => {
				this.$bus.$emit('loginSuccess');
			};
		});

		this.$bus.$on('changeTargetLocation1', location => {
			if (location.longitude == 0 || location.latitude == 0) {
				return;
			}
			this.targetLocation = location;
			setTimeout(() => {
				// that.isMoveToLocation = true;
				this.mapContext &&
					this.mapContext.moveToLocation({
						longitude: Number(location.longitude),
						latitude: Number(location.latitude)
						// success() {
						// 	that.moveToLocation = false;
						// }
					});
			}, 600);
		});
		// 菜单
		store.dispatch('getMenuAction', { version: this.$store.state.version, requestType: 'miniprogram', istrue: true });
	},
	onUnload() {
		console.log('unload');
	},
	onShow() {
		// this.$store.dispatch('updataLocation');
		// 显示首页时开启循环
		this.$store.dispatch('wallet');
		this.$store.dispatch('selectNotGainCoupon');
		this.$store.dispatch('getHomeOrderList', { istrue: true });
		this.interval_order = setInterval(() => {
			this.$store.dispatch('wallet');
			this.$store.dispatch('getHomeOrderList', { istrue: true });
		}, 2 * 60 * 1000);
	},
	onHide() {
		// 离开首页时关闭循环
		if (this.interval_order) {
			clearInterval(this.interval_order);
		}
	},
	methods: {
		getOpenId(callback) {
			const that = this;
			uni.login({
				success: async ({ code }) => {
					const { data } = await getOpenId({
						code,
						istrue: true
					});
					store.commit('set_openid', data.obj.openid);
					callback();
				}
			});
		},
		requestSubscribeMessage() {
			const that = this;
			if (store.state.openid) {
				requestSubscribeMessage(that.longTmplIds);
			} else {
				that.getOpenId(() => {
					requestSubscribeMessage(that.longTmplIds);
				});
			}
		},
		async getWeather() {
			const { data } = await getWeather({ adCode: this.adcode });
		},
		// 判断是否登录
		logon(callback) {
			const that = this;
			if (that.isLogin) {
				callback();
			} else {
				that.$refs.login.getUserInfoStep();
				that.loginCallBack = () => {
					this.loginSuccess();
					callback();
				};
			}
		},
		openLeftMenu() {
			const that = this;
			that.logon(() => {
				that.$refs.leftMenu.open();
			});
		},
		loginSuccess() {
			store.dispatch('wallet');
		},
		// 获取屏幕大小
		getScreenSize() {
			const that = this;
			uni.getSystemInfo({
				complete: res => {
					that.statusBarHeight = res.statusBarHeight;
					that.screenHeight = res.screenHeight;
					that.rate = 750 / res.screenWidth;
					store.commit('setSystemInfo', res);
				}
			});
		},
		getLocation(callback) {
			this.$refs.getLocationRef.getLocation(callback);
		},
		afterGetLocation(res) {
			const that = this;
			this.ownLocation.latitude = res.latitude;
			this.ownLocation.longitude = res.longitude;
			this.city = get(res, 'data.regeocode.addressComponent.city') || get(res, 'result.address_component.city');
			this.province = get(res, 'data.regeocode.addressComponent.province') || get(res, 'result.address_component.province');
			this.adcode = get(res, 'data.regeocode.addressComponent.adcode') || get(res, 'result.ad_info.adcode');
			store.commit('set_address', {
				city: this.city,
				province: this.province,
				detail: get(res, 'data.regeocode.formatted_address') || get(res, 'result.address'),
				adcode: this.adcode
			});
			this.searchParkingByRange(this.ownLocation.latitude, this.ownLocation.longitude);
			store.dispatch('getHomeShow', { requestType: 'miniprogram', version: this.$store.state.version, decode: this.adcode, istrue: true });
			setTimeout(() => {
				// 打开广告弹窗
				if (that.openStartAdv && store.state.isShowAdv) {
					this.$refs.startAdvert.getData();
					store.commit('setAdv', false);
				}
			}, 1000);
		},
		mapReady() {
			if (!this.mapContext) {
				this.mapContext = uni.createMapContext('myMap', this);
				this.getLocation(this.afterGetLocation);
				// setTimeout(() => {
				// 	this.getLocation();
				// }, 1500);
			}
		},
		reset() {
			// let that = this;
			// this.targetLocation = this.ownLocation;
			// this.isMoveToLocation = true;
			this.mapContext
				.moveToLocation
				// {
				// 	success() {
				// 		that.isMoveToLocation = false;
				// 	}
				// }
				();
			this.targetLocation = {
				longitude: 0,
				latitude: 0
			};
			// this.searchParkingByRange(this.ownLocation.latitude, this.ownLocation.longitude);
			// this.$bus.$emit('changeTargetLocation', {
			// 	longitude: this.targetLocation.longitude,
			// 	latitude: this.targetLocation.latitude
			// })
		},
		showAddCarPop() {
			this.$refs.carouselMessage.showAddCarPop();
		},
		clickNotice(detail) {
			const that = this;
			if (!detail.miniprogramUrl) return;
			this.loginCallBack = () => {
				goLink(detail.miniprogramUrl);
			};
			if (detail.isOPen && !this.isLogin) {
				this.logon();
			} else {
				this.loginCallBack();
			}
		},
		clickAddCar() {
			if (this.isLogin) {
				this.showAddCarPop();
			} else {
				this.logon(() => {
					this.showAddCarPop();
				});
			}
		},
		goParking(res) {
			if (res) {
				this.targetLocation = {
					longitude: res.longitude,
					latitude: res.latitude
				};
			}
			uni.navigateTo({
				url:
					'/basic/parking/parking?' +
					mapQuery({
						lng: this.targetLocation.longitude,
						lat: this.targetLocation.latitude
					})
			});
		},
		// 扫一扫
		async scan() {
			// const completeUrl =
			// 	'http://10.192.84.14:8080/?' +
			// 	mapQuery({
			// 		token: this.$store.state.token,
			// 		lat: this.$store.state.location.latitude,
			// 		lng: this.$store.state.location.longitude
			// 	}) + '#/pages/parkingCard/index';
			// uni.navigateTo({
			// 	url: '/pages/web_view/index?url=' + encodeURIComponent(completeUrl)
			// });
			const that = this;
			that.logon(() => {
				wx.scanCode({
					success: async res => {
						that.onscan(res.result);
					}
				});
			});
		},
		//扫码返回处理
		async onscan(data, value) {
			var that = this;
			if (data.indexOf('/s/') !== -1) {
				let i = data.indexOf('/s/');
				let val = data.slice(i + 3);
				getPayPageData({
					merchantId: val
				}).then(res => {
					if (res.data.code == 1) {
						wx.navigateTo({
							url: `/pages/confirm/scanpay/index?merchantId=${val}`
						});
					} else {
					}
				});
			} else if (data.indexOf('/o/') !== -1) {
				//帮品支付
				let j = data.indexOf('/o/');
				let value = data.slice(j + 3);
				// 获取商户详情
				getPayDataByPayCode({
					payCode: value,
					istrue: true
				}).then(function(data) {
					var data = data.data;
					if (data.code != 1) {
						wx.showToast({
							title: data.msg,
							icon: 'none'
						});
					} else {
						wx.navigateTo({
							url: `/pages/confirm/bangpinpay/index?payCode=${value}`
						});
					}
				});
			} else if (data.indexOf('/dk/') !== -1) {
				//绑定车牌领取优惠券
				let k = data.indexOf('/dk/');
				let value = data.slice(k + 4);
				scanQrCode({
					key: value,
					istrue: true
				}).then(({ data }) => {
					if (data.code == 1) {
						uni.navigateTo({
							url: `/pages/receiveCoupon/bindCarNumber?key=${data.obj.advAndCoupon.key}&parkingName=${data.obj.advAndCoupon.parkingName}&couponTypeName=${
								data.obj.advAndCoupon.couponTypeName
							}`
						});
					} else {
						setTimeout(() => {
							wx.showToast({
								title: data.msg,
								icon: 'none'
							});
						}, 1000);
					}
				});
			} else if (data.indexOf('/pp/') !== -1) {
				// 出场
				let h = data.indexOf('/pp/');
				let value = data.slice(h + 4);
				parkingOrderView({
					serialno: value,
					istrue: true
				}).then(({ data }) => {
					store.commit('saveOutOrderInfo', data);
					if( data.code == 1 ){
						if(data.obj.isUnlicensedVehicle && !data.obj.currentOrder.payMoney){
							uni.navigateTo({
								url: `/pages/noPlateCar/out?serialno=${value}`
							});
						}else{
							uni.navigateTo({
								url: `/personal/order/orderPay/index?serialno=${value}`
							});
						}
					}else{
						uni.navigateTo({
							url: `/personal/order/orderPay/index?serialno=${value}`
						});
					}
				})
			} else if (data.indexOf('/uv/') !== -1) {
				// 入场（无牌车）
				let h = data.indexOf('/uv/');
				let value = data.slice(h + 4);
				uni.navigateTo({
					url: `/pages/noPlateCar/in?serialno=${value}`
				});
			} else if (data.indexOf('/cz/') !== -1) {
				uni.navigateTo({
					url: '/personal/wallet/recharge/index?entryType=2'
				});
			} else if (data.indexOf('/doubleNinth') !== -1) {
				//重阳节活动
				uni.navigateTo({
					url: '/pages/activity/doubleNinth/index?url=' + encodeURIComponent(data)
				});
			} else if (data.indexOf('lease') !== -1) {
				uni.navigateTo({
					url: '/personal/carRental/index'
				});
			} else if (data.indexOf('/rent/') !== -1) {
				let h = data.indexOf('/rent/');
				let value = data.slice(h + 6);
				getParkingRentDetailOfCode({
					parkingCode: value,
					rentInfoCode: 1,
					istrue: true,
					type: 1
				}).then(({ data }) => {
					if (data.code == 1) {
						if (data.obj.data.length) {
							uni.navigateTo({
								url: '/personal/carRental/parkDetail/index?pageStatus=carRental&parkingCode=' + value
							});
						} else {
							wx.showToast({
								title: '暂无商品',
								icon: 'none'
							});
						}
					} else {
						setTimeout(() => {
							wx.showToast({
								title: data.msg,
								icon: 'none'
							});
						}, 2000);
					}
				});
			} else if (data.indexOf('myCar') !== -1) {
				uni.navigateTo({
					url: '/personal/carinfo/index'
				});
			} else if (data.indexOf('/vehicle/') !== -1) {
				let code = data.split('/').pop();
				getParkingRentDetailOfCode({
					parkingCode: code,
					rentInfoCode: 1,
					istrue: true,
					type: 2
				}).then(({ data }) => {
					if (data.code == 1) {
						if (data.obj.data.length) {
							uni.navigateTo({
								url: '/personal/carRental/parkDetail/index?pageStatus=manageCar&rentInfoCode=1&parkingCode=' + code
							});
						} else {
							uni.showToast({
								title: '暂无商品',
								icon: 'none'
							});
						}
					} else {
						setTimeout(() => {
							uni.showToast({
								title: data.msg,
								icon: 'none'
							});
						}, 2000);
					}
				});
			} else if (data.indexOf('10.192.84.12:8080') > -1) {
				const index = data.indexOf('#');
				const completeUrl =
					data.slice(0, index) +
					'?' +
					mapQuery({
						token: this.$store.state.token,
						lat: this.$store.state.location.latitude,
						lng: this.$store.state.location.longitude
					}) +
					data.slice(index);
				uni.navigateTo({
					url: '/pages/web_view/index?url=' + encodeURIComponent(completeUrl)
				});
			} else if (data.indexOf('k8s.zhongbanglaixi.com/h5/ugc') > -1) {
				const index = data.indexOf('#');
				const completeUrl =
					data.slice(0, index) +
					'?' +
					mapQuery({
						token: this.$store.state.token,
						lat: this.$store.state.location.latitude,
						lng: this.$store.state.location.longitude
					}) +
					data.slice(index);
				uni.navigateTo({
					url: '/pages/web_view/index?url=' + encodeURIComponent(completeUrl)
				});
			} else if (data.indexOf('dev.zhongbanglaixi.com/h5/ugc') > -1) {
				const index = data.indexOf('#');
				const completeUrl =
					data.slice(0, index) +
					'?' +
					mapQuery({
						token: this.$store.state.token,
						lat: this.$store.state.location.latitude,
						lng: this.$store.state.location.longitude
					}) +
					data.slice(index);
				uni.navigateTo({
					url: '/pages/web_view/index?url=' + encodeURIComponent(completeUrl)
				});
			} else {
				uni.showToast({
					title: '二维码无效',
					icon: 'none',
					duration: 2000
				});
			}
		},

		// 地图视野变化
		changeregion(e) {
			if (e.type == 'end' && e.causedBy == 'drag') {
				this.getCenterLocation(e.causedBy);
				// } else if (e.type == 'end' && this.isMoveToLocation) {
				// 	setTimeout(() => this.getCenterLocation(e.causedBy), 1000);
				// }
			} else if (e.type == 'end') {
				setTimeout(() => this.getCenterLocation(e.causedBy), 1000);
			}
		},
		// 获取地图中心位置
		async getCenterLocation(causedBy) {
			const that = this;
			this.mapContext.getCenterLocation({
				success: res => {
					if (res.latitude != 0 && res.longitude != 0) {
						that.searchParkingByRange(res.latitude, res.longitude, () => {
							if (causedBy == 'drag') {
								// that.targetLocation = res.location;
								that.goParking({ longitude: res.longitude, latitude: res.latitude });
							} else {
								that.$bus.$emit('changeTargetLocation', {
									longitude: res.longitude,
									latitude: res.latitude
								});
							}
						});
					}
				}
			});
		},
		clickTap(e) {
			let that = this;
			// this.isMoveToLocation = true;
			this.mapContext.moveToLocation({
				longitude: Number(e.detail.longitude),
				latitude: Number(e.detail.latitude)
				// success() {
				// 	that.isMoveToLocation = false;
				// }
			});
			this.goParking({ longitude: e.detail.longitude, latitude: e.detail.latitude });
		},
		// 获取地图中心3km内停车场
		async searchParkingByRange(lat, lnt, callback) {
			const that = this;
			const { data } = await searchParkingByRange({
				range: 3000,
				lat,
				lnt,
				istrue: true
			});
			if (data.code == 1) {
				data.obj.forEach(item => {
					item.imgList = item.parkingPic ? item.parkingPic.split(',') : [];
					// console.log(item.price);
					// item.price = item.price || item.price === 0 ? parseInt(item.price).toFixed(1) : null;
					// console.log(item.price);
					item.distance = formatDistance(calculateDistance({ lng: item.lnt, lat: item.lat }, { lng: lnt, lat: lat }));
					return item;
				});
				if (data.obj.length) {
					that.scrollID = data.obj[0].code;
				}
				that.parkLotList = data.obj;
				if (that.parkLotList.length) {
					that.recommendParking = that.parkLotList[0];
				} else {
					that.recommendParking = {};
				}
				that.createMarkers();
				if (typeof callback == 'function') callback();
			}
		},
		// 创建地图markers
		createMarkers() {
			const that = this;
			that.markers = that.parkLotList.map((item, index) => {
				return {
					id: item.code,
					width: 34,
					height: 34,
					iconPath:
						index == 0
							? that.staticImg + 'static/img/icon2/jian.png'
							: item.ptype == 'lot'
							? that.staticImg + 'static/img/parkLot.png'
							: item.carNum >= 100
							? that.staticImg + 'static/img/icon2/99+.png'
							: that.staticImg + `static/img/icon2/${item.carNum}.png`,
					latitude: item.lat,
					longitude: item.lnt
				};
			});
		},
		// 点击地图标记点
		clickMarker(e) {
			let item = {};
			for (let i = 0; i < this.markers.length; i++) {
				if (this.markers[i].id == e.detail.markerId) {
					item = this.markers[i];
					break;
				}
			}
			uni.navigateTo({
				url: '/pages/parking/parking?lng=' + item.longitude + '&lat=' + item.latitude + '&parkType=ownPark' + '&parkingId=' + item.id
			});
		},
		// 打开搜索
		openSearch() {
			this.$refs.search.open();
			this.showSearch = true;
		},
		clickTopAd(info) {
			const that = this;
			if (!info.miniprogramUrl) {
				return;
			}
			if (this.isLogin || !info.isOPen) {
				goLink(info.miniprogramUrl);
			} else {
				that.logon(() => {
					goLink(info.miniprogramUrl);
				});
			}
		}
	}
};
</script>

<style scoped lang="scss">
.bg {
	background-size: 100% auto;
	background-position: top;
	background-repeat: no-repeat;
	background-color: #f6f8fb;
	padding-bottom: 40rpx;
	box-sizing: border-box;
	font-size: 24rpx;
}
.vague {
	filter: blur(30rpx);
}
.default_bg {
	width: 100%;
	position: absolute;
	top: 0;
}
.header {
	display: flex;
	align-items: center;
	height: 88rpx;
	padding-left: 14rpx;
	padding-right: 4rpx;
	.city {
		color: #1b1912;
		font-size: 28rpx;
		font-weight: bold;
		font-family: PingFang SC;
		margin-left: 8rpx;
		z-index: 1;
	}
	image {
		width: 36rpx;
		height: 36rpx;
	}
}
.map {
	width: 710rpx;
	height: 500rpx;
	margin: 0 20rpx;
	border-radius: 20rpx;
	box-sizing: border-box;
	position: relative;
	background-color: #fff;
	overflow: hidden;
	z-index: 99;
}

#myMap {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	transform: translate3d(0, 0, 0);
}
.carouselMessage {
	bottom: 60rpx;
	position: absolute;
}
.map_icon {
	position: absolute;
	border-radius: 15rpx;
	width: 60rpx;
	height: 60rpx;
}
.map_center {
	width: 30rpx;
	position: absolute;
	left: 0;
	right: 0;
	top: -50rpx;
	bottom: 0;
	margin: auto;
}
</style>

<template>
	<view>
		<!-- 车场banner -->
		<view class="swiper-box" :style="{ opacity: 1 - scrollTop / (540 * (windowWidth / 750)) }">
			<swiper class="d_swiper" :interval="2000" :duration="800" :circular="true" :autoplay="true" @change="swiperChange">
				<block v-for="item in imgUrls" :key="item">
					<swiper-item><image :src="item" mode="scaleToFill" class="slide-image" /></swiper-item>
				</block>
			</swiper>
			<!-- 指示点 -->
			<view class="fcx dots"><view v-for="(item, index) in imgUrls" :key="index" class="dot" :class="index == swiperIndex ? 'active' : ''"></view></view>
		</view>
		<view style="width:100%;height:540rpx;"></view>
		<view class="body pd40-x">
			<view class="header">
				<view class="name pd50-y ft38 ftweight">{{ parkingName }}</view>
				<view class="location fst" @click="nav2ParkingDetail">
					<image :src="staticImg + 'static/img/orderIconAddress.png'" class="locationIcon"></image>
					<view class="address ft24 mgl20 text-ellipsis">{{ address }}</view>
					<view><uni-icons type="arrowright" size="30" class="mgt4"></uni-icons></view>
				</view>
			</view>
			<view class="service">
				<view class="ft26 ftweight mgt50 mgb22 rgb74">选择服务</view>
				<view v-if="typeList.length">
					<view v-for="(item, index) in typeList" :key="index">
						<view
							class="card fs pd20-x mgb20"
							:style="{ border: selectedCardType.id === item.id ? '1px solid #f33535' : '1px solid transparent' }"
							@click="selectCardType(index)"
						>
							<view class="card-type">
								<view class="fst card-type-title mgb12">
									<view class="ft26 ftweight rgb27">{{ item.cardType }}</view>
									<view class="ft26 ftweight rgb27 mgl20" v-if="item.rentType">——{{ item.rentType == 2 ? item.areaName : '全车场' }}</view>
								</view>
								<view class="fst ft20 rgb74" v-if="pageStatus == 'carRental'">
									<view class="fst" v-if="!item.allDay">
										<view class="mgr15" style="flex-shrink: 0;" v-if="item.weekDay">工作日 {{ item.weekDay }}</view>
										<view class="mgr15" style="flex-shrink: 0;" v-if="item.holiday">节假日 {{ item.holiday }}</view>
									</view>
									<view v-if="item.allDay" style="flex-shrink: 0;">每天 {{ item.allDay }}</view>

									<view class="rent_time" v-if="pageStatus == 'carRental'">
										{{ item.parkingTime == 2 ? '日间租赁' : item.parkingTime == 3 ? '夜间租赁' : '全天租赁' }}
									</view>
									<view class="rent_time">{{ item.isFixedParkingSpace }}</view>
									<view class="rent_time" v-if="item.rentType == 2">专属区车位</view>
								</view>
							</view>
							<image v-if="pageStatus == 'carRental' && item.parkingTime == 2" class="time_mark" src="@/static/img/day.png"></image>
							<image v-else-if="pageStatus == 'carRental' && item.parkingTime == 3" class="time_mark" src="@/static/img/night.png"></image>
							<view class="price ft20 ftweight tac">￥{{ item.price }}</view>
						</view>
					</view>
					<view :v-if="typeList.length && selectedCardType.buyNum > 0 && selectedCardType.continueType">
						<view class="ft26 ftweight mgt50 mgb22 rgb74">{{ selectedCardType.continueType }}</view>
						<view class="consecutive-monthly fsa ft30">
							<u-number-box ref="numberBoxRef" bg-color="#FFF" :min="1" :max="maxBuy" v-model="selectedNum"></u-number-box>
						</view>
					</view>
				</view>
				<view v-if="!typeList.length"><view class="ft24 rgb74">暂无商品。</view></view>
			</view>

			<view v-if="selectedCardType.isFixedFlag" class="">
				<view class="ft26 ftweight mgt50 mgb22 rgb74">选择泊位</view>
				<view class="fs" @click="chooseBerth">
					<view class="berth fc">
						<text class="ft30 ftweight rgb74 mgr20 text-ellipsis">{{ selectedArea.areaName || '无' }}</text>
						<uni-icons type="arrowright" size="30" class="mgt4"></uni-icons>
					</view>
					<view class="berth fc">
						<text class="ft30 ftweight rgb74 mgr20">{{ selectedLot.lotCode || '无' }}</text>
						<uni-icons type="arrowright" size="30" class="mgt4"></uni-icons>
					</view>
				</view>
			</view>
			<view>
				<view class="ft26 ftweight mgt50 mgb22 rgb74">选择车辆</view>
				<view class="fs plate pd40-x pd20-y bgw" @click="showBrandSelector">
					<view class="fst">
						<view class="ft30 ftweight rgb74">
							<view v-if="!!selectedBrand.brandNumber" class="fi">
								<view>{{ selectedBrand.brandNumber }}</view>
								<view v-if="selectedBrand.isDefault" class="default">默认</view>
							</view>
							<view v-else>请添加车辆</view>
						</view>
					</view>
					<view class="rgb74"><uni-icons type="arrowright" size="30" class="mgt4"></uni-icons></view>
				</view>
			</view>

			<view>
				<view class="ft26 ftweight mgt50 mgb22 rgb74">服务开始时间</view>
				<view class="fs plate pd40-x pd20-y bgw" @click="showCalendar">
					<view class="ft30 ftweight rgb74">{{ date }}</view>
					<view class="fe">
						<text class="ft20 ftweight rgb74 mgr30">选择时间</text>
						<image :src="staticImg + 'static/img/parkingIcon4.png'" style="width: 28rpx;height: 30rpx;" class=""></image>
					</view>
				</view>
			</view>
			<view class="service">
				<view class="ft26 ftweight mgt50 mgb22 rgb74">{{ pageStatus == 'carRental' ? '产品说明' : '服务说明' }}</view>
				<view class="ft24 rgba74">{{ selectedCardType.product_description }}</view>
			</view>
			<view class="service" v-if="selectedCardType.refundRules !== '不可退款' && pageStatus == 'carRental'">
				<view class="ft26 ftweight mgt50 mgb22 rgb74">退费规则</view>
				<view class="ft24 rgb74">七个工作日支持退费办理。</view>
			</view>
			<view class="fst" v-if="pageStatus == 'carRental'">
				<view class="fst pdt50 pdb50" @click="agree = !agree">
					<image v-if="agree" :src="staticImg + 'static/img/check.png'" style="width: 30rpx;height: 30rpx;"></image>
					<image v-else :src="staticImg + 'static/img/unChecked.png'" style="width: 30rpx;height: 30rpx;"></image>
					<text class="mgl10 mgr20 ft24 ftweight">同意</text>
				</view>
				<text class="ft24 agreement" @click="showProtocol">《帮驻智停车位租赁服务协议》</text>
			</view>
			<view style="width: 100%; height: 160rpx;"></view>
		</view>
		<view class="footer"><view class="footer_btn" @click="nav2OrderDetail">立刻开通</view></view>
		<!-- 车牌选择器 -->
		<u-select
			v-model="selectPlateVisible"
			mode="single-column"
			:list="getBrandListName"
			cancelText="选择车辆"
			confirmText="新增"
			@confirm="finishSelectedBrand"
			:showAddPlate="true"
			@addPlate="showAddBland"
		></u-select>
		<!-- 新增车牌键盘 -->
		<u-keyboard
			ref="uKeyboard"
			mode="car"
			v-model="addBrandVisible"
			:autoAddBrand="true"
			:isDefault="setDefaultBrand"
			:showChangeLan="false"
			@finish="finishAddBrand"
		></u-keyboard>
		<!-- 日历选择器 -->
		<u-calendar
			v-model="calendarVisible"
			mode="date"
			:change-year="false"
			:closeable="false"
			:minDate="minDate"
			maxDate="3333-12-31"
			active-bg-color="#FFF"
			active-color="#1B1A22"
			@change="finishSelectCalendar"
		></u-calendar>
		<!-- 泊位选择器 -->
		<u-select
			v-model="selectBerthVisible"
			mode="single-column"
			:list="getLotNameList"
			:zone="getAreaNameList"
			:zoneCurrent="zoneCurrent"
			cancelText="泊位"
			:maskCloseAble="false"
			@changeZone="changeZone"
			:berthClass="berthClass"
			:berth="true"
			@changeBerth="changeBerth"
		></u-select>
		<login-modal ref="login" @loginCallBack="loginCallBack" navigateState="1"></login-modal>
	</view>
</template>

<script>
import loginModal from '@/components/loginModal/loginModal.vue';
import { get, searchIndex } from '@/utils/miniLodash';
import { mapState, mapActions, mapMutations } from 'vuex';

import { getBrandList } from '@/api';
import { calculateDistance, relativeDate, getSelectedCardType, getSelectedArea, getSelectedLot, getSelectedBrand, caculatePrice } from '@/utils';
import { cardTypeCollection } from '@/constants/carRental.js';

export default {
	components: {
		loginModal
	},
	data() {
		return {
			currentPark: {},

			// 页面显示
			pageStatus: 'carRental',
			swiperIndex: 0,
			windowWidth: 0, // 窗口宽度
			scrollTop: 0, // 页面滚动高度

			// 连续包月
			selectedNum: 1,

			// 选中停车场信息
			selectedCardType: {},
			selectedArea: {},
			selectedLot: {},
			zoneCurrent: 0,
			selectBerthVisible: false,

			// 选中车牌信息
			selectedBrand: {},
			selectPlateVisible: false, // 选择车牌号弹出框显隐
			addBrandVisible: false, // 新增车牌键盘组件可见

			// 日历选择
			calendarVisible: false,
			date: relativeDate(1, 1),
			minDate: relativeDate(1, 1),

			// 协议
			agree: true
		};
	},
	// #ifdef MP-WEIXIN
	onShareTimeline() {
		var query = 'parkingCode=' + this.currentPark.parkingCode + '&rentInfoCode=' + this.currentPark.rentInfoCode + '&pageStatus=' + this.pageStatus;
		return {
			title: this.parkingName,
			query: query,
			imageUrl: this.webUrl + '/images/mobile/small_routine_share_surface.jpg'
		};
	},
	// 微信分享小程序给朋友
	onShareAppMessage() {
		return {
			title: this.parkingName,
			path:
				'/personal/carRental/parkDetail/index?parkingCode=' +
				this.currentPark.parkingCode +
				'&rentInfoCode=' +
				this.currentPark.rentInfoCode +
				'&pageStatus=' +
				this.pageStatus,
			imageUrl: this.webUrl + '/images/mobile/small_routine_share_surface.jpg'
		};
	},
	// #endif
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	computed: {
		...mapState('carRentalModule/carRentalDetailModule', {
			address: state => state.address,
			parkingName: state => state.parkingName,
			imgUrls: state => state.imgUrls,
			typeList: state => state.typeList,
			rentLocation: state => state.location
		}),
		...mapState('userModule', { brandList: state => state.brandList || [] }),
		...mapState({ location: state => state.location }),
		getBrandListName() {
			return this.brandList.map(item => ({ label: item.brandNumber, value: item.brandId }));
		},
		getLotNameList() {
			return get(this.selectedArea, 'parkingLots', []).map(item => ({ label: item.lotCode, value: item.lotId }));
		},
		getAreaNameList() {
			return get(this.selectedCardType, 'parkingLotInfo', []).map(item => item.areaName);
		},
		maxBuy() {
			const endTime = new Date(this.selectedCardType.rentEndTime);
			const startTime = new Date(this.date);
			const cardTypeObj = cardTypeCollection.find(item => item.mark == this.selectedCardType.cType);
			if (!cardTypeObj) {
				return Infinity;
			}
			return get(cardTypeObj, 'maxBuy', Infinity);
		},
		setDefaultBrand() {
			return this.brandList.length > 0 ? 0 : 1;
		},
		staticImg() {
			return this.$store.state.staticImg;
		},
		webUrl() {
			return this.$store.state.webUrl;
		},
		isLogin() {
			return Object.keys(get(this.$store.state, 'userInfo', {})).length > 0;
		}
	},

	methods: {
		...mapActions('carRentalModule/carRentalDetailModule', ['getParkingRentDetailOfCodeAction', 'addRentOrderAction', 'getNewPortOfTypeAction']),
		...mapActions('userModule', ['getBrandListAction']),
		...mapMutations('carRentalModule/carRentalDetailModule', ['updateRentalDetailReadied']),

		//服务类型
		selectCardType(index) {
			this.updateCardType(index);
		},

		// 泊位逻辑
		chooseBerth() {
			if (get(this.selectedCardType, 'parkingLotInfo', []).length == 0 && this.selectedCardType.isFixedFlag == 1) {
				uni.showToast({
					icon: 'none',
					title: '暂无空闲车位'
				});
			} else {
				this.selectBerthVisible = true;
			}
		},
		changeZone(e) {
			this.updateArea(e);
			this.zoneCurrent = e;
		},
		changeBerth(e) {
			this.updateLot(e);
		},

		updateCardType(index, typeList) {
			this.selectedCardType = getSelectedCardType(this.selectedCardType, typeList || this.typeList || [], index);
			this.updateArea(0);
			this.selectedNum = 1;
		},
		updateArea(index) {
			this.selectedArea = getSelectedArea(this.selectedArea, get(this, 'selectedCardType.parkingLotInfo', []), index);
			this.updateLot(0);
		},
		updateLot(index) {
			this.selectedLot = getSelectedLot(this.selectedLot, get(this, 'selectedArea.parkingLots', []), index);
		},

		// 车牌 逻辑
		showBrandSelector() {
			if (this.brandList.length == 0) {
				this.addBrandVisible = true;
			} else {
				this.selectPlateVisible = true;
			}
		},
		updateBrandList(index) {
			let that = this;
			this.getBrandListAction().then(brandList => {
				const searchedIndex = index || searchIndex(brandList, item => item.isDefault == 1);
				that.selectedBrand = getSelectedBrand(that.selectedBrand, brandList, searchedIndex);
			});
		},
		finishSelectedBrand(brand) {
			this.selectedBrand = this.brandList.find(item => item.brandId === brand[0].value) || {};
		},
		finishAddBrand() {
			const index = searchIndex(this.brandList, item => item.brandNumber == this.selectedBrand.brandNumber);
			this.updateBrandList(index);
		},
		showAddBland() {
			this.addBrandVisible = true;
		},
		// 选择日历逻辑
		showCalendar() {
			this.calendarVisible = true;
		},
		// 确定选择时间
		finishSelectCalendar(e) {
			this.date = e.result;
		},

		nav2ParkingDetail() {
			uni.openLocation({
				latitude: this.rentLocation.latitude,
				longitude: this.rentLocation.longitude,
				name: this.parkingName,
				address: this.address
			});
		},

		// 跳转下单详情
		nav2OrderDetail() {
			if (!this.agree && this.pageStatus == 'carRental') {
				uni.showToast({
					icon: 'none',
					title: '请同意帮驻智停车位租赁服务协议'
				});
			} else if (!this.selectedBrand.brandNumber) {
				uni.showToast({
					icon: 'none',
					title: '未添加车辆'
				});
			} else if (this.selectedCardType.parkingLotInfo && this.selectedCardType.parkingLotInfo.length == 0 && this.selectedCardType.isFixedFlag == 1) {
				uni.showToast({
					icon: 'none',
					title: '暂无空闲车位'
				});
			} else {
				const that = this;
				this.addRentOrderAction({
					roleId: this.selectedCardType.id,
					cardCount: this.selectedNum,
					areaId: get(this, 'selectedArea.areaId', ''),
					lotId: get(this, 'selectedLot.lotId', ''),
					price: caculatePrice(this.selectedCardType.price, this.selectedNum),
					parkingCode: this.currentPark.parkingCode,
					carNum: this.selectedBrand.brandNumber,
					startTime: `${this.date} 00:00:00`,
					type: this.pageStatus == 'carRental' ? 1 : 2
				}).then(res => {
					const { orderId, money, payMoney, validTime, invalidTime } = res;
					const { selectedCardType, selectedBrand, selectedLot, address, imgUrls, parkingName, currentPark } = that;
					that.updateRentalDetailReadied({
						orderId,
						money,
						payMoney,
						validTime,
						invalidTime,
						selectedBrand,
						selectedCardType,
						selectedLot,
						address,
						parkingName,
						imgUrls,
						parkingCode: currentPark.parkingCode
					});
					uni.redirectTo({
						url: '/personal/carRental/rentalOrderDetail/index?pageStatus=' + this.pageStatus
					});
				});
			}
		},
		showProtocol() {
			uni.navigateTo({
				url: '/personal/law/rental?type=8'
			});
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
		loginSuccess() {
			this.$store.dispatch('wallet');
		}
	},
	onLoad(option) {
		if (option.pageStatus) {
			this.pageStatus = option.pageStatus;
		}
		this.currentPark = option;
		let windowWidth = this.windowWidth;
		uni.getSystemInfo({
			success: function(res) {
				windowWidth = res.windowWidth;
			}
		});
	},
	onShow() {
		this.getParkingRentDetailOfCodeAction({
			parkingCode: this.currentPark.parkingCode,
			rentInfoCode: 1,
			type: this.pageStatus == 'carRental' ? 1 : 2
		}).then(typeList => {
			let searchedIndex = searchIndex(typeList, item => item.rentInfoCode == this.currentPark.rentInfoCode);
			this.updateCardType(searchedIndex < 0 ? 0 : searchedIndex, typeList);
			this.logon(() => {
				this.updateBrandList();
			});
		});
	},
	swiperChange(e) {
		this.swiperIndex = e.detail.current;
	}
};
</script>

<style lang="scss">
.swiper-box {
	width: 100%;
	height: 540rpx;
	position: fixed;
	top: 0;
}
.d_swiper {
	height: 540rpx;
	position: relative;
}
.slide-image {
	width: 100%;
	height: 100%;
}
.icon {
	width: 30rpx;
	height: 30rpx;
}
::-webkit-scrollbar {
	width: 0;
	height: 0;
	color: transparent;
}
.dots {
	width: 100%;
	height: 10rpx;
	position: absolute;
	bottom: 70rpx;
	left: 0;
	.dot {
		width: 10rpx;
		height: 10rpx;
		margin: 0 8rpx;
		border-radius: 50%;
		background: rgba(255, 255, 255, 1);
	}
	.active {
		background: rgba(243, 53, 53, 1);
	}
}
.body {
	position: relative;
	top: -40rpx;
	background: #f6f8fb;
	min-height: 100vh;
	border-radius: 40rpx 40rpx 0 0;
	.header {
		.name {
			width: 100%;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			color: #2c2837;
		}
		.location {
			color: #4a5361;
			.locationIcon {
				width: 22rpx;
				height: 22rpx;
				margin-top: 4rpx;
			}
			.address {
				display: inline-block;
			}
		}
	}
}
.service {
	.card {
		width: 670rpx;
		height: 116rpx;
		box-sizing: border-box;
		border: 1px solid transparent;
		border-radius: 20rpx;
		background: #fff;
		position: relative;
		.price {
			width: 120rpx;
			height: 48rpx;
			line-height: 48rpx;
			border-radius: 24rpx;
			background: #f33535;
			color: #ffffff;
		}
		.time_mark {
			width: 60rpx;
			height: 60rpx;
			position: absolute;
			right: 160rpx;
			top: 50%;
			transform: translateY(-50%);
		}
	}
	.card-type {
		display: flex;
		flex-direction: column;
		.card-type-title {
			align-items: center;
		}
		.rent_time {
			flex-shrink: 0;
			height: 28rpx;
			line-height: 24rpx;
			border: 2rpx solid #f23434;
			border-radius: 14rpx;
			font-size: 16rpx;
			color: #f23434;
			padding: 0 10rpx;
			box-sizing: border-box;
			margin-left: 10rpx;
		}
	}
}
.label {
	background: #56c9cc;
	font-size: 14rpx;
	font-weight: bold;
	color: #ffffff;
	padding: 4rpx;
	border-radius: 4rpx;
}
.consecutive-monthly {
	width: 262rpx;
	height: 82rpx;
	line-height: 82rpx;
	background: #fff;
	border-radius: 20rpx;
}
.plate {
	border-radius: 20rpx;
}
.default {
	width: 36rpx;
	height: 26rpx;
	text-align: center;
	line-height: 26rpx;
	background: #56c9cc;
	border-radius: 4rpx;
	font-size: 14rpx;
	font-weight: bold;
	color: #ffffff;
	margin-left: 30rpx;
}
.berth {
	width: 316rpx;
	height: 82rpx;
	line-height: 82rpx;
	background: #ffffff;
	border-radius: 20rpx;
}
.agreement {
	color: rgba(243, 53, 53, 1);
	text-decoration: underline;
}
.footer {
	position: fixed;
	bottom: 0;
	width: 100%;
	height: 160rpx;
	background: #fff;
	.footer_btn {
		width: 670rpx;
		height: 100rpx;
		margin: 30rpx auto 0;
		line-height: 100rpx;
		text-align: center;
		font-size: 34rpx;
		font-weight: bold;
		color: #ffffff;
		background-color: #1b1921;
		border-radius: 20rpx;
	}
}
</style>

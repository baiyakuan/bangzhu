<template>
	<view>
		<scroll-view  :style="{ height: screenHeight * rate + 'rpx' }" :scroll-y="true" :scroll-with-animation="true">
			<view class="map_box">
				<map
					v-if="longitude > 0"
					id="mapOil" 
					:markers="markers" 
					:show-location='true' 
					:scale='scale' 
					subkey="KRKBZ-G4LC2-6RZU2-CUHUP-63UMK-FTB46"
					:longitude='longitude'
					:latitude='latitude'
					:style="{position:'relative',width: width, height: scrollHeight + 'px'}"
					@regionchange="changeregion" 
					@markertap="markerTap"
					@updated="mapReady">
				</map>
				<!-- 地图中心点 -->
				<img :src="staticImg + 'static/img/addOil_dtcenter.png'" class="dtcenter"></img>
				<!-- 自己的位置 -->
				<image :src="staticImg + 'static/image/map_reset.png'" class="reload" @click="nav2ownLocation" />
				<image  v-if="advertisement" :src="Imgpath + advertisement.icon" class="gift" mode="widthFix" @click="navDetail"></image>
			</view>
			<view class="scrollView">
				<view class="content_box">
					<view class="addOil">
						<add-oil-box 
							ref="addOilBox"
							@openOilsBox="openOilsBox" @openOilsGunBox="openOilsGunBox" 
							@showPay="showPay" @getMoney="getMoney"
							:gasTypeNum='oilTypeIndex' :gasGunTypeNum='oilGunTypeIndex'>
						</add-oil-box>
					</view>
					<view style="position: relative;">
						
						<view class="filter">
							<filter 
								:filterData='filterData' :defaultIndex='defaultIndex' 
								@onSelected='onSelected'>
							</filter>
						</view>

						<view class="oilStation">
							<oil-station 
								v-for="(item,index) in stationList" :key="index" 
								v-if="stationList.length" 
								class="station" :station='item'>
							</oil-station>
							<view v-if="!stationList.length" class="noData">暂无数据</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 选择燃油标号 -->
			<u-popup v-model="oilsPopup" mode="bottom" border-radius="50">
				<view class="grayBox oilsBox">
					<view class="ft28 ftweight title">燃油标号</view>
					<view class="fst oils">
						<view class="oil fcy " 
							:class="{'active' : oilTypeIndex == index}" v-for="(item,index) in nearStation.gasList"
							:key="index" @click="checkGasType(item,index)">
							<view class="ft32 ftweight mgb20">
								{{item.gasType}}#
							</view>
							<view class="ft24 ftweight">
								￥{{item.bzPrice}}/L
							</view>
						</view>
					</view>
				</view>
			</u-popup>
			<!-- 选择油枪号 -->
			<u-popup v-model="oilsGunPopup" mode="bottom" border-radius="50">
				<view class="grayBox oilsBox oilsGunBox">
					<view class="ft28 ftweight title">选择油枪号</view>
					<view class="fst oils">
						<view class="oil fcx" 
							:class="{'active' : oilGunTypeIndex == index}" 
							v-for="(item,index) in 20" :key="index"
							@click="checkGunType(item,index)">
							<view class="ft30">{{item + 1}}</view>号枪
						</view>
					</view>
				</view>
			</u-popup>
			<!-- 支付 -->
			<Pay 
				:visible="showPayTypeModal" :amount="wallet.amount" :payamount="payMoney" 
				@cancel="showPayTypeModal=false"
				@enterPay="orderPay"></Pay>
		</scroll-view>
		<login-modal ref='login' @loginCallBack="loginCallBack" navigateState='1' ></login-modal>
		<get-location-modal ref="getLocationRef" ></get-location-modal>
	</view>
</template>

<script>
import { calculateDistance } from '@/utils'
import { goLink } from '@/utils/link'
import addOilBox from './component/addOilBox.vue'
import filter from './component/filter/filter.vue'
import oilStation from './component/oilStation.vue'
import { mapQuery, get } from '@/utils/miniLodash';
import loginModal from '@/components/loginModal/loginModal.vue'
import getLocationModal from '@/components/getLocationModal/getLocationModal.vue';
import {
	mapState,
	mapActions,
	mapMutations
} from 'vuex'
export default {
	components: {
		addOilBox,
		filter,
		oilStation,
		loginModal,
		getLocationModal
	},
	data() {
		return {
			mapHeight: 500,
			selectMarkerId: undefined,
			isChangeRegion: false,
			
			screenHeight: 0, // 屏幕高度
			statusBarHeight: 0, // 状态栏高度
			rate: 1,
			scale: 16, // 地图缩放级别
			markers: [], // 地图上停车场标志
			width: '750rpx', // 地图组件宽度
			height: '100vh', // 地图组件高度
			oilsPopup: false,
			oilsGunPopup: false,
			scrollHeight: 200,
			filterData: [
				[{
					text: '500m内',
					text2: 500,
					value: 0
				}, {
					text: '1km内',
					text2: 1000,
					value: 1
				}, {
					text: '2km内',
					text2: 2000,
					value: 2
				}, {
					text: '50km内',
					text2: 50000,
					value: 3
				}],
				[{
					text: '92#',
					value: 0
				}, {
					text: '95#',
					value: 1
				}, {
					text: '98#',
					value: 2
				}],
				[{
					text: '智能排序',
					value: 0
				}]
			],
			defaultIndex: [3, 0, 0],
			mapCenterLocation: {
				latitude:0,
				longitude:0
			},
			
			range: '50000',
			gasType: '92',
			pageIndex: 1,
			
			showPayTypeModal: false,
			oilTypeIndex: 0,
			oilGunTypeIndex: 0,
			inputMoney: '',
			originalMoney: 0,
			loginCallBack: () => {},
			payMoney2:''
		};
	},
	// #ifdef MP-WEIXIN
		onShareTimeline(){
			var query = ''
			return {
				title: '加油站',
				query: query,
				imageUrl:  this.webUrl + '/images/mobile/small_routine_share_surface.jpg'
			}
		},
		// 微信分享小程序给朋友
		onShareAppMessage () {
			return {
				title: '车主福利来袭！请查收，手慢无！',
				path: '/basic/addOil/addOil',
				imageUrl: this.webUrl + '/images/mobile/small_routine_share_surface.jpg'
			};
		},
	// #endif
	async onLoad(options) {
		this.getScreenSize();
		// 地理位置授权
		if (!this.longitude) {
			this.$refs.getLocationRef.getLocation((res) => {
				this.mapCtx = uni.createMapContext('mapOil', this);
				this.checkLogin()
			});
		} else {
			this.mapCtx = uni.createMapContext('mapOil', this);
			this.checkLogin()
		}
	},
	onShow() {
		this.resetData()
		this.$store.dispatch('wallet');
		this.$store.dispatch("updataLocation")
	},
	computed: {
		...mapState('addOilModule', ['nearStation', 'stationList', 'gasList','payMoney','discountMoney']),
		...mapState("commonModule",['advertisement']),
		longitude() { return  this.$store.state.location.longitude  },
		latitude() { return  this.$store.state.location.latitude  },
		Imgpath() { return this.$store.state.Imgpath },
		webUrl(){ return this.$store.state.webUrl},
		wallet() { return this.$store.state.wallet},
		staticImg() { return this.$store.state.staticImg },
		isLogin() { return Object.keys(get(this.$store.state, 'userInfo', {})).length > 0; }
	},
	watch:{
		stationList(val){
			if(!val.length){
				this.navDetail()
			}
		}
	},
	methods: {
		...mapMutations('addOilModule', ['updateNearStation','clearStationData']),
		...mapActions('addOilModule', ['getNearStation', 'toPay','selectByManage']),
		...mapActions('commonModule',['getAdvertisement']),
		async checkLogin() {
			// 登录授权
			if (this.isLogin) {
				await this.getPageData(this.latitude,this.longitude)
				this.getAdverUrl();
			} else {
				this.$refs.login.getUserInfoStep();
				this.loginCallBack = async () => {
					await this.getPageData(this.latitude,this.longitude)
					this.$store.dispatch('wallet');
					this.getAdverUrl();
				};
			}
		},
		// 获取广告位信息
		getAdverUrl(){
			this.getAdvertisement({type: 8})//1-待支付卡片 2-扫码缴费页 3-缴费完成页 4-停车场详情页 5-新手指南 6-领停车券 7-UGCBanner管理'     8-加油活动
		},
		//广告位跳转
		navDetail(){
			goLink( this.advertisement.miniprogramurl, { 
					path: '#/',
					token: this.$store.state.token,
					lat: this.$store.state.location.latitude,
					lng: this.$store.state.location.longitude})
		},
		// 获取屏幕大小
		getScreenSize() {
			const that = this;
			uni.getSystemInfo({
				complete: res => {
					that.screenHeight = res.screenHeight - res.statusBarHeight - 44;
					that.rate = 750 / res.screenWidth;
				}
			});
		},
		openOilsBox() {
			this.oilsPopup = true
		},
		openOilsGunBox() {
			this.oilsGunPopup = true
		},
		checkGasType(item, index) {
			this.oilTypeIndex = index
			this.oilsPopup = false
		},
		checkGunType(item, index) {
			this.oilGunTypeIndex = index
			this.oilsGunPopup = false
		},
		getMoney(data) {
			this.originalMoney = data.originalMoney;
		},
		resetData(){
			this.oilTypeIndex = 0
			this.oilGunTypeIndex = 0
			this.$refs.addOilBox.reset()
		},
		// 判断是否可支付
		showPay() {
			if (this.gasList.length) {
				// 判断自己和加油站的距离
				let stationLocation = {
					longitude: this.nearStation.longitude,
					latitude: this.nearStation.latitude
				}
				let ownLocation = {
					longitude: this.longitude,
					latitude: this.latitude
				}
				let distance = calculateDistance(ownLocation, stationLocation)
				if (distance > 2000) {
					uni.showToast({
						title: '您还未到达加油站，请前往加油站再进行支付！',
						icon: 'none'
					})
				} else {
					if (this.oilGunTypeIndex < 0) {
						uni.showToast({
							title: '请选择油枪号！',
							icon: 'none'
						})
					} else {
						this.showPayTypeModal = true
					}
				}
			} else {
				uni.showToast({
					title: '您附近没有加油站！',
					icon: 'none'
				})
			}
		
		},
		// 支付逻辑
		orderPay(payType) {
			let that = this;
			that.payMoney2 = that.payMoney
			// 余额支付
			let data = {
				payType: payType, // 支付方式
				payMoney: that.payMoney, // 实际支付价格
				// bzPrice: that.nearStation.bzPrice, // 小帮价折扣
				orderPrice: that.originalMoney, // 订单金额（用户输入的价格）
				stationPrice: that.gasList[that.oilTypeIndex].gasPrice, // 油站价
				refuleType: that.gasList[that.oilTypeIndex].gasType, // 加油型号
				stationName: that.nearStation.stationName, // 加油站名称
				stationCode: that.nearStation.stationCode, // 加油站编码
				// oilGun: parseInt(that.nearStation.gunNUm[that.oilGunTypeIndex]), // 油枪型号
				oilGun: ( this.oilGunTypeIndex + 1 )+ '号枪',
				wxAppType: 1, // 
				istrue: true
			}
			that.toPay(data).then(res => {
				if (payType == "BALANCE") {
					if (res.result) {
						uni.showToast({
							title: '支付成功！',
							icon: 'none',
							duration:2000
						})
						setTimeout(() => {
							that.showPayTypeModal = false
							// uni.navigateTo({
							//   url:"/personal/order/index?tabName=加油"
							// })
							uni.navigateTo({ 
							  url:"/basic/addOil/success?money=" + that.payMoney2
							})
						}, 1000)
					}
				} else {
					let {
						appId,
						...query
					} = res;
					uni.requestPayment({
						...query,
						orderInfo: query.data,
						success: function(res) {
							uni.showToast({
								title: '支付成功',
								icon: 'none',
								duration:2000
							});
							setTimeout(() => {
								that.showPayTypeModal = false
								uni.navigateTo({
								  url:"/basic/addOil/success?money=" + that.payMoney2
								})
							}, 1000)
						},
						fail: function(res) {
							uni.showToast({
								title: '支付失败',
								icon: 'none'
							});
							setTimeout(() => {
								that.showPayTypeModal = false
							}, 2000)
						}
					})
				}
			})
		},
		
		// 筛选项选中
		onSelected(res) {
			let that = this;
			res.forEach((item, index) => {
				if (index == 0) {
					if (item[0].value < 0) {
						that.range = ''
					} else {
						that.range = parseInt(item[0].text2);
					}
				}
				if (index == 1) {
					if (item[0].value < 0) {
						that.gasType = ''
					} else {
						that.gasType = parseInt(item[0].text);
					}
				}
			})
			if(that.mapCenterLocation.latitude && that.mapCenterLocation.longitude){
				that.getPageData(that.mapCenterLocation.latitude,that.mapCenterLocation.longitude)
			}else{
				that.getPageData(that.latitude,that.longitude)
			}
			
		},
		
		// 以下为地图渲染
		mapReady() {
			if (!this.mapCtx) {
				this.mapCtx = uni.createMapContext('mapOil', this);
			}
		},
		// 返回自己的位置
		nav2ownLocation() {
			this.mapCtx.moveToLocation()
			this.getPageData(this.latitude,this.longitude)
		},
		// marker点击
		markerTap(e) {
			let that = this;
			that.selectMarkerId = e.detail.markerId
			that.stationList.forEach(item => {
				if (item.id == e.detail.markerId) {
					that.updateNearStation(item)
				}
			})
		},
		changeregion(e){
			if (['update', 'upudate'].indexOf(e.detail.causedBy) < 0 ) {
				if (e.type == 'begin') {
					this.isChangeRegion = true
				}
				if(e.type == 'end'){
					this.getCenterLocation()
				};
			}
		},
		getCenterLocation(){
			let that = this
			this.mapCtx.getCenterLocation({
				success:(res)=>{
					if(res.latitude == 0 && res.longitude == 0){
						that.getPageData(this.latitude,this.longitude);
					} else {
						that.mapCenterLocation.latitude = res.latitude
						that.mapCenterLocation.longitude = res.longitude
						that.getPageData(res.latitude,res.longitude);
					}
				},
				fail(res){
					that.getPageData(this.latitude,this.longitude);
				},
			})
		},
		async getPageData(lat,lnt){
			this.oilTypeIndex = 0
			this.oilGunTypeIndex = 0
			this.getNearStation({
				latitude:lat,
				longitude:lnt,
				range: this.range,
				gasType: this.gasType,
			}).then(() => {
				this.createMarkers()
			})
		},
		// 创建地图markers
		createMarkers() {
			const that = this;
			that.markers = that.stationList.map((item, index) => {
				return {
					...item,
					width: 30,
					height: 36,
					iconPath: that.staticImg + 'static/img/icon2/addOilIcon.png',
					latitude: item.latitude,
					longitude: item.longitude,
				}
			});
		},
	}
};
</script>

<style lang="scss">
	page {
		background-color: #FFFFFF;
	}

	.scrollView {
		width: 100%;
	}

	.dtcenter {
		width: 40rpx;
		height: 70rpx;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -100%);
		visibility: visible;
	}
	
	.gift{
		position: absolute;
		bottom: 130rpx;
		right: 12rpx;
		width: 120rpx;
	}
	
	.reload {
		position: absolute;
		bottom: 40rpx;
		right: 30rpx;
		width: 60rpx;
		height: 60rpx;
	}

	.fixed {
		position: fixed;
		width: 100%;
		top: 0;
		z-index: 1000;
	}

	.map_box {
		position: relative;
		overflow: hidden;
	}

	.content_box {
		.addOil {
			padding-bottom: 40rpx;
		}

		.filter {
			background: $bg-gray;
			border-radius: 50rpx 50rpx 0 0;
		}

		.oilStation {
			// margin-top: 120rpx;
			background: $bg-gray;
			padding: 0 40rpx 50rpx;

			.noData {
				text-align: center;
				line-height: 100rpx;
			}
		}

	}

	.mask {
		z-index: 666;
		position: fixed;
		// top: calc(var(--status-bar-height) + 44px);
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0);
		transition: background-color 0.15s linear;

		&.show {
			background-color: rgba(0, 0, 0, 0.4);
		}

		&.hide {
			display: none;
		}
	}

	// 燃油标号弹窗
	.grayBox {
		padding: 40rpx;
		background: $bg-gray;
		border-radius: 50rpx;

		.title {
			color: $main-black;
		}
	}

	.oilsBox {
		border-radius: 50rpx 50rpx 0 0;

		.oils {
			flex-wrap: wrap;

			.oil {
				width: 200rpx;
				height: 160rpx;
				background: $main-white;
				margin-top: 40rpx;
				border-radius: 20rpx;
				margin-right: 34rpx;
				box-shadow: 0px 10rpx 40rpx rgba(0, 0, 0, 0.1);

				&:nth-child(3n+0) {
					margin-right: 0;
				}

				view {
					color: $main-gray;
				}

				&.active {
					background: $main-red;

					view {
						color: $main-white;
					}
				}

			}
		}
	}

	.oilsGunBox {
		.oils {
			.oil {
				width: 100rpx;
				height: 100rpx;
				text-align: center;
				line-height: 100rpx;
				color: $main-gray;
				font-weight: bold;
				font-size: 20rpx;
				box-shadow: 0px 10rpx 40rpx rgba(0, 0, 0, 0.1);
				margin-right: 40rpx;
				align-items: baseline;
				&:nth-child(3n+0) {
					margin-right: 40rpx;
				}

				&:nth-child(5n+0) {
					margin-right: 0;
				}

				&.active {
					background: $main-red;
					color: $main-white;
				}
			}
		}
	}
</style>

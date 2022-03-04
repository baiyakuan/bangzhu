<template>
	<view class="bg" :style="{ height: screenHeight * rate + 'rpx' }">
		<view class="header" :style="{ top: (statusBarHeight + 50) * rate + 'rpx' }" v-if="showClose">
			<view class="headerImg headerClose"  @click="back" >
				<image :src="staticImg + 'static/image/squareClose.png'" ></image>
			</view>
		</view>
		<view class="map-box">
			<map
				v-if="longitude > 0"
				id="parkingMap"
				show-location
				scale='16'
				subkey="KRKBZ-G4LC2-6RZU2-CUHUP-63UMK-FTB46"
				:longitude='longitude'
				:latitude='latitude'
				:style="{position:'relative',width: '100%', height: mapHeight + 'rpx'}"
				:markers="markerList"
				@regionchange='changeregion'
				@markertap='markerTap'
				@updated="mapReady"
			>
				<image :src="staticImg + 'static/img/dtcenter.png'" class="dtcenter"></image>
			</map>
			
		</view>
		<view class="reset_map" style="top: 70%;" v-if="!showRecommendPark" @click="reset">
			<image :src="staticImg + 'static/image/map_reset.png'"></image>
		</view>
		
		<view id="recommendPark" 
			:class="{greybg: showToBottom}"
			:style="{top: recommendParkStyle.top, transition: recommendParkStyle.transition}"
			v-show="showRecommendPark"
		>
			<carouselMessage
				class="carouselMessage"
				style="	top: -20rpx;"
				:brandNum="brandNum"
				ref="carouselMessage"
				@clickAddCar="clickAddCar"
				@clickNotice="clickNotice"
				:isLogin="isLogin"
				:noticeList="noticeInfo"
				@openKeyBoard="show = true"
			></carouselMessage>
			<view class="reset_map" style="	top: -80rpx;" v-if="!showToBottom" @click="reset">
				<image :src="staticImg + 'static/image/map_reset.png'"></image>
			</view>
			<view class="toBottom" :style="{top: -32 * rate  +'rpx'}" v-if="showToBottom">
				<image :src="staticImg + 'static/img/to_bottom.png'" @click="setBottomTask">
			</view>
			<view :class="['searchWrapper', {  
				'hiddenSearch': hiddenSearch
			}]" id="searchView" @click="openSearch">
				<image class="search_icon" :src="staticImg + 'static/image/search_icon.png'"></image>
				<!-- <input class="search_input" placeholder-class="placeholder"  placeholder="请输入目的地" /> -->
				<text class="search_input">
					请输入目的地
				</text>
				<image class="touchRaw" :src="staticImg + 'static/img/touchRaw.png'" mode=""></image>
			</view>
			<view @touchstart="wrapTouchstart" @touchend="wrapTouchend" v-if="Object.keys(recommendPark).length>0">
				<recommend
					:parking="recommendPark" @clickCard="nav2parkLotDetail" 
					:longitude="longitude" :latitude='latitude'
					id="recommend_park"
				></recommend>
			</view>
			<view @touchstart="moreParkTouchstart" @touchend="moreParkTouchend">
				<scroll-view
					style="width: 100%;" 
					:scroll-y="canScroll" :scroll-with-animation="true"
					@scroll="moreParkScroll"
					:style="{height: (screenHeight - statusBarHeight - 146 - recommendParkHeight)*rate + 'rpx'}"
				>
					<view style="box-sizing: border-box;padding-bottom: 30rpx;">
						<parking-info 
							id="parking_info" 
							:parkingList="morePark" 
							@clickCard="nav2parkLotDetail"
						></parking-info>
					</view>
				</scroll-view>
			</view>
		</view>
		<search ref='search' inputTop="50" @searchChange="searchChange" :inParkingPage="true" @close="hiddenSearch = false"></search>
		<login-modal ref='login' @loginCallBack="loginCallBack" navigateState='1' ></login-modal>
		<u-keyboard v-model="show" mode="car" :autoAddBrand="true" :showChangeLan="false" @finish="show = false"></u-keyboard>
		<get-location-modal ref="getLocationRef"></get-location-modal>
	</view>
</template>

<script>
import recommend from './component/recommend.vue';
import parkingInfo from './component/parkingInfo.vue';
import loginModal from '@/components/loginModal/loginModal.vue'
import search from '@/components/search/search.vue'
import carouselMessage from '@/components/index_new/carouselMessage.vue';
import getLocationModal from '@/components/getLocationModal/getLocationModal.vue';
import { Toucher, get, debounce } from '@/utils/miniLodash'
import { searchParkingByRange } from '@/api'
import { calculateDistance, formatDistance } from '@/utils'
import { goLink } from '@/utils/link'

const createMarkerHelper = (parkLotList,Imgpath) => (
	parkLotList.map(
		(item, index) => ({
			id: item.markerId,
			width: 34,
			height: 34,
			iconPath: index==0? Imgpath + '/static/img/icon2/jian.png':item.ptype=="lot"? Imgpath +'/static/img/parkLot.png':item.carNum>=100?Imgpath +'/static/img/icon2/99+.png':Imgpath +`/static/img/icon2/${item.carNum}.png`,
			latitude:item.lat,
			longitude:item.lnt,
			anchor:{ x:.5, y:.5}
		})
	)
)


const formatParkLotList = (parkLotList, longitude, latitude, Imgpath) => {
	return parkLotList.map((item, index) => {
		return {
			...item,
			distance: formatDistance(
				calculateDistance({lng:item.lnt,lat:item.lat}, {lng:longitude, lat:latitude})
			),
			parkingPic: Imgpath + get(item, 'parkingPic', '').split(',')[0],
			markerId: Number(item.code.replace(/[^0-9]/ig,"")),
		}
	})
}

export default {
	components: {
		parkingInfo,
		recommend,
		loginModal,
		search,
		carouselMessage,
		getLocationModal
	},
	data() {
		return {
			statusBarHeight: 0, // 状态栏高度
			screenHeight: 0, // 屏幕高度
			rate: 1,
			canScroll: false,
			showToBottom: false,
			showClose: true,
			recommendToucher: {},
			moreParkToucher: {},
			recommendParkStyleData: {},
			markerList: [],
			parkLotList: [],
			mapCenter: {
				latitude: 0,
				longitude: 0
			},
			selectMarkerId: undefined,
			showMorePark: true,
			isChangeRegion: false,
			loginCallBack: () => {},
			canTouchMorePark: true,
			targetLocation: {
				longitude: 0,
				latitude: 0
			},
			isMoveToLoaction: false,
			afterMarkerQueen: [],
			recommendParkHeight: 0,
			parkingInfoHeight: 0,
			searchViewHeight: 0,
			show: false,
			hiddenSearch: false
		};
	},
	// #ifdef MP-WEIXIN
		// 微信分享小程序给朋友
		onShareAppMessage () {
			return {
				title: '车主福利来袭！请查收，手慢无！',
				path: '/pages/index/index',
				imageUrl: this.webUrl + '/images/mobile/small_routine_share_surface.jpg'
			};
		},
	// #endif
	async onLoad(options) {
		
		uni.getSystemInfo({
			complete: res => {
				this.statusBarHeight = res.statusBarHeight;
				this.screenHeight = res.screenHeight;
				this.rate = 750 / res.screenWidth;
			}
		});
		if (this.longitude == 0 && Object.keys(options) == 0) {
			this.$refs.getLocationRef.getLocation((res) => {
				this.mapCtx = uni.createMapContext('parkingMap', this);
				options = {
					lng: res.longitude,
					lat: res.latitude
				}
				this.searchChange(options, true)
			});
		} else {
			this.mapCtx = uni.createMapContext('parkingMap', this);
			this.searchChange(options, true)
		}
	},
	onShow() {
		this.$store.dispatch('updataLocation');
	},
	watch:{
		parkLotList(newValue,oldValue) {
			// if (newValue.length == oldValue.length) return //添加search 加这层判断容易出问题
			setTimeout(() => {
				let selector = uni.createSelectorQuery().in(this)
				selector.select('#recommend_park').boundingClientRect(result => {
					if (get(result, 'height')) {
						this.recommendParkHeight = result.height
					} else {
						this.recommendParkHeight = 0
					}
				}).exec();
				selector.select('#parking_info').boundingClientRect(result => {
					if (get(result, 'height')) {
						this.parkingInfoHeight  = result.height
					} else {
						this.parkingInfoHeight = 0
					}
				}).exec();
				selector.select('#searchView').boundingClientRect(result => {
					if (get(result, 'height')) {
						this.searchViewHeight  = result.height
					}
				}).exec();
				this.setBottomTask()
			},60)
		}
	},
	computed: {
		longitude: {
			get() {
				return this.mapCenter.longitude == 0 ? (this.$store.state.location.longitude || 0) : this.mapCenter.longitude
			},
			set(longitude) {
				this.mapCenter.longitude = longitude
			}
		},
		latitude: {
			get() {
				return this.mapCenter.latitude == 0 ? (this.$store.state.location.latitude || 0) : this.mapCenter.latitude
			},
			set(latitude) {
				this.mapCenter.latitude = latitude
			}
		},
		staticImg() { return this.$store.state.staticImg },
		searchHeight() {
			return this.searchViewHeight
		},
		cardHeight() {
			// console.log(this.searchViewHeight)
			if (this.parkLotList.length == 0) return (this.searchHeight + 40) * this.rate
			let maxCardH = this.screenHeight - this.statusBarHeight - 75
			let cardH = this.recommendParkHeight + this.parkingInfoHeight + this.searchHeight + 50 
			// console.log(cardH, 'cardHeight', maxCardH, 'maxCardH')
			return cardH > maxCardH ? maxCardH*this.rate : cardH*this.rate
		},
		bottomCardHeight() {
			if (this.parkLotList.length == 0) return (this.searchHeight + 40) * this.rate
			let maxCardH = this.screenHeight*.5
			let cardH = this.recommendParkHeight + this.parkingInfoHeight + this.searchHeight + 50 
			// console.log(cardH, 'bottomCardHeight', maxCardH, 'maxCardH')
			return cardH > maxCardH ? maxCardH*this.rate : cardH*this.rate
		},
		mapHeight() {
			let height
			if (this.showToBottom) {
				height = this.screenHeight * this.rate - this.cardHeight
			} else {
				height = this.screenHeight * this.rate - this.bottomCardHeight
			}
			// console.log(height, 'mapHeight')
			return height
		},
		recommendParkStyle: {
			set(style) {
				this.recommendParkStyleData = style
			},
			get() {
				return this.recommendParkStyleData
			}
		},
		Imgpath() { return this.$store.state.Imgpath },
		webUrl(){ return this.$store.state.webUrl},
		recommendPark() {
			let resultPark = {}
			if (this.selectMarkerId) {
				resultPark = {
					...this.parkLotList.find((item) => item.markerId == this.selectMarkerId),
					recommendText: '当前车场'
				}
			} else if(this.parkLotList.length > 0) {
				resultPark = {
					...this.parkLotList[0],
					recommendText: '附近推荐'
				}
			}
			return  resultPark
		},
		showRecommendPark() {
			return typeof this.recommendPark == 'object'
		},
		morePark() {
			return this.parkLotList.filter((item) => item.markerId != this.recommendPark.markerId)
		},
		isLogin() {
			return Object.keys(get(this.$store.state, 'userInfo', {})).length > 0;
		},
		brandNum() {
			return this.$store.state.userInfo.brandNum;
		},
		// 地图左下角轮播广告
		noticeInfo() {
			return this.$store.getters.orderAdList;
		},
	},
	methods: {
		showAddCarPop() {
			this.$refs.carouselMessage.showAddCarPop();
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
		},
		back() {
			const pages = getCurrentPages()
			if (pages.length>1) {
				uni.navigateBack();
			} else {
				uni.navigateTo({
					url:'/pages/index/index'
				})
			}
			
			this.$bus.$emit('changeTargetLocation1', {
				longitude: this.targetLocation.longitude,
				latitude: this.targetLocation.latitude
			})
		},
		// 打开搜索
		openSearch() {
			this.$refs.search.open();
			this.hiddenSearch = true
		},
		async searchChange(options, isOnload) {
			if (options && options.lng && options.lng != 0 && options.lat != 0) {
				this.latitude = options.lat
				this.longitude = options.lng
				this.targetLocation = this.mapCenter
			}
			if (!!isOnload) {
				await this.searchParkingByRange(this.latitude, this.longitude)
				this.tapPark(options)
			} else {
				this.isMoveToLoaction = true
				this.afterMarkerQueen.push(() => this.tapPark(options))
				setTimeout(() => this.isMoveToLoaction = false, 700)
			}
		},
		tapPark(options) {
			if (options.parkType == 'ownPark') {
				const findPark = this.parkLotList.find((item) => item.code == options.parkingId) || {}
				this.selectMarkerId = findPark.markerId
				this.markerTap({detail: {markerId: this.selectMarkerId}})
			}
		},
		reset() {
			this.targetLocation = {
				longitude: this.$store.state.location.longitude,
				latitude: this.$store.state.location.latitude
			}
			this.isMoveToLoaction = true
			this.mapCtx.moveToLocation({
				complete() {
					this.isMoveToLoaction = false
				}
			})
		},
		mapReady() {
			if (!this.mapCtx) {
				this.mapCtx = uni.createMapContext('parkingMap', this);
			}
		},
		changeregion(e){
			if (['update', 'upudate'].indexOf(e.detail.causedBy) < 0 || this.isMoveToLoaction) {
				if (e.type == 'begin') {
					this.isChangeRegion = true
				}
				let time = this.isMoveToLoaction ? 800 : 0
				if(e.type == 'end'){
					setTimeout(() => {
						this.selectMarkerId = ''
						this.getCenterLocation(true)
						this.showMorePark = true
						this.isChangeRegion = false
					}, time)
				};
			}
		},
		
		getLocation() {
			this.$refs.getLocationRef.getLocation((res) => {
				this.mapCtx = uni.createMapContext('parkingMap', this);
				options = {
					lng: res.longitude,
					lat: res.latitude
				}
				this.searchChange(options, true)
			});
		},
		getCenterLocation(changeTarget){
			let that = this
			this.mapCtx.getCenterLocation({
				success:(res)=>{
					if(res.latitude != 0 && res.longitude != 0){
						that.mapCenter.latitude = res.latitude
						that.mapCenter.longitude = res.longitude
						that.searchParkingByRange(res.latitude,res.longitude);
						if (changeTarget) this.targetLocation = this.mapCenter
					}
				}
			})
		},
		async searchParkingByRange(lat,lnt){
			const { data } = await searchParkingByRange({ range:3000, lat, lnt, istrue:true })
			if(data.code == 1){
				this.parkLotList = formatParkLotList(data.obj, lnt, lat, this.Imgpath)
				this.createMarkers();
				this.setBottomTask()
			}
		},
		createMarkers(){
			this.markerList = createMarkerHelper(this.parkLotList,this.staticImg)
			
			// console.log(this.markerList)
			if (this.afterMarkerQueen.length > 0) {
				this.afterMarkerQueen.forEach((fn) => fn())
				setTimeout(() => {this.afterMarkerQueen = []}, 300)
			}
		},
		markerTap(e){
			this.selectMarkerId = e.detail.markerId
			this.markerList = this.markerList.map((item,index)=>{
				if(item.id === e.detail.markerId){
					return {
						...item,
						width: 40,
						height: 40,
					}
				} else {
					return {
						...item,
						width: 34,
						height: 34,
					}
				}
			});
			this.setBottomTask()
		},
		nav2parkLotDetail(item) {
			if(item.ptype == 'bg'){
				uni.navigateTo({
				  url: `/basic/parkLotDetail/index?id=${item.code}&distance=${item.distance}`
				})
			} else {
				uni.navigateTo({
				  url: `/basic/parkLotDetail/index?name=${item.name}&address=${item.address}&lnt=${item.lnt}&lat=${item.lat}`
				})
			}
		},
		moreParkTouchstart(event) {
			if (!this.canScroll || this.canTouchMorePark) {
				this.startTouch('morePark', event)
			}
		},
		moreParkTouchend(event) {
			if (!this.canScroll || this.canTouchMorePark) {
				this.endTouch('morePark', event)
			}
		},
		wrapTouchstart(event) {
			this.startTouch('recommend', event)
		},
		wrapTouchend(event) {
			this.endTouch('recommend', event)
		},
		startTouch(type,event) {
			let touch = new Toucher()
			touch.setStart(event.changedTouches[0].clientX, event.changedTouches[0].clientY)
			if (type == 'recommend') {
				this.recommendToucher = touch
			} else {
				this.moreParkToucher = touch
			}
		},
		endTouch(type,event) {
			let touch = type == 'recommend' ? this.recommendToucher : this.moreParkToucher
			touch.setEnd(event.changedTouches[0].clientX, event.changedTouches[0].clientY)
			const direction = touch.getTouchDirection()
			if (direction == 'top') {
				this.setTopTask()
			} else if (direction == 'bottom') {
				this.setBottomTask()
			}
		},
		setTopTask() {
			if (this.isChangeRegion == false && this.parkLotList.length >= 2) {
				this.setTopStyle()
				this.canScroll = true
				this.showToBottom = true
				this.showClose = false
			}
		},
		setBottomTask() {
			if (this.isChangeRegion == false) {
				this.setBottomStyle()
				this.canScroll = false
				this.showToBottom = false
				this.showClose = true
			}
		},
		setTopStyle() {
			setTimeout(() => {
				this.recommendParkStyle = {
					top: (this.screenHeight * this.rate - this.cardHeight) + 'rpx',
					transition: 'all .5s',
				}
			}, 150)
		},
		setBottomStyle() {
			setTimeout(() => {
				// console.log(this.bottomCardHeight, 'setBottomStyle', this.mapHeight)
				this.recommendParkStyle = {
					top: (this.screenHeight * this.rate - this.bottomCardHeight) + 'rpx',
					transition: 'all .5s'
				}
			}, 150)
		},
		moreParkScroll(res) {
			if (res.detail.scrollTop < 7) {
				this.canTouchMorePark = true
			} else {
				this.canTouchMorePark = false
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.bg {
	overflow-y: hidden;
	position: relative;
}
.greybg {
	background-color: #eff4f8;
}
.header {
	position: absolute;
	z-index: 99;
	width: 90%;
	left: 5%;
	display: flex;
	justify-content: flex-end;
}
.headerImg {
	width: 88rpx;
	height: 88rpx;
	display: flex;
	box-sizing: border-box;
	image {
		margin: auto;
	}
}
.headerSearch {
	image {
		width: 60rpx;
		height: 60rpx;
	}
}
.headerClose {
	image {
		width: 47rpx;
		height: 47rpx;
	}
}

.toBottom {
	position: absolute;
	    z-index: 99;
	    right: 46rpx;
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	image {
		width: 30rpx;
		height: 30rpx;
		margin: auto;
	}
}
#recommendPark {
	position: absolute;
	width: 100%;
	transition: all .7s;
}
.dtcenter{
	width: 30rpx;
	height: 53rpx;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%,-100%);
	visibility: visible;
}
.carouselMessage{
	position: absolute;
	z-index: 999;
	left: 38rpx;
}
.reset_map {
	position: absolute;
	width: 60rpx;
	height: 60rpx;
	z-index: 999;
	right: 38rpx;
}
.reset_map image {
	border-radius: 15rpx;
	width: 60rpx;
	height: 60rpx;
	z-index: 999;
}
.hiddenSearch {
	display: none;
}
.searchWrapper {
	display: flex;
	align-items: center;
	background-color: #FFFFFF;
	flex: 1;
	height: 80rpx;
	border-radius: 20rpx;
	margin: 50rpx 15rpx 20rpx;
	position: relative;
	.search_icon {
		margin-left: 14rpx;
		width: 30rpx;
		height: 30rpx;
	}
	.touchRaw {
		position: absolute;
		width: 80rpx;
		height: 16rpx;
		left: 50%;
		top: -35rpx;
		transform: translateX(-50%) rotate(180deg);
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
		padding-right: 20rpx;
		display: flex;
		align-items: center;
		color: #7a818d;
	}
}
</style>

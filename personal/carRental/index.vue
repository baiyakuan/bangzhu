<template>
	<view class="">
		<view class="pd50-y pd40-x fs">
			<view class="ft50 ftweight rgb27">{{pageStatus == 'carRental' ? '车位租赁' : '车辆管理'}} </view>
			<view class="ft30 ftweight rgb27" @click="nav2Order">{{pageStatus== 'carRental' ? '我的租赁' : '我的车辆管理'}}</view>  
		</view>
		<view class="pd40-x">
			<view class="fs">
				<view :class="['fst input-box bgw pdl30', { 'rental-input': pageStatus == 'carRental' }]" @click="search">
					<image :src="staticImg + 'static/img/ic_search.png'" class="searchIcon"></image>
					<text class="input mgl20">输入目的地</text>
				</view>
				<view class="filter-box bgw fcx" @click="toFiltrate" v-if="pageStatus == 'carRental'">
					<image :src="staticImg + 'static/img/filterIcon.png'" class="filterIcon"></image>
					<text class="ft24 ftweight mgl10 filterText">筛选</text>
				</view>
			</view>
			<view class="parking_mescroll">
				<mescroll-uni
					ref="mescrollRef"
					 height="75%"
					 top="30"
					 :down="downOption" 
					 @down="downCallback"
					 :up="upOption"
					 @up="upCallback"
				>
					<mescroll-empty :option="emptyOption" v-if="parkingArray.length == 0 && !isLoading"></mescroll-empty>
					<parking-list
						:parkingArray="parkingArray" 
						:v-if="parkingArray.length>0"
						:Imgpath="Imgpath"
						:pageStatus="pageStatus"
					></parking-list>
				</mescroll-uni>
			</view>
		</view>
		<login-modal ref="login" @loginCallBack="loginCallBack" @cancelLogin="cancelLogin"></login-modal>
		<get-location-modal ref="getLocationRef"></get-location-modal>
	</view>
</template>

<script>

	import store from '@/store';
	import { mapState } from 'vuex'
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";
	import MescrollEmpty from '@/components/mescroll-uni/components/mescroll-empty.vue';
	import ParkingList from './component/parkingList/parkingList.vue'
	import loginModal from '@/components/loginModal/loginModal.vue';
	import getLocationModal from '@/components/getLocationModal/getLocationModal.vue';
	import { get, set } from '@/utils/miniLodash'
	import { getMescrollConfig } from '@/utils'
	
	const { downOption, upOption } = getMescrollConfig((configObj) => set(configObj, 'upOption.empty.use', false));
	export default {
		mixins: [MescrollMixin,MescrollMoreItemMixin],
		components:{
			MescrollEmpty,
			ParkingList,
			loginModal,
			getLocationModal
		},
		data() {
			return {
				downOption,
				upOption,
				isLoading: true,
				pageStatus: 'carRental',
				loginCallBack: () => {},
				cancelLogin: () => {},
			}
		},
		computed: {
			isLogin() {
				return Object.keys(get(this.$store.state, 'userInfo', {})).length > 0;
			},
			...mapState('carRentalModule',{
				filterRule: (state) => state.parkingFilter.filterRule
			}),
			staticImg() { return this.$store.state.staticImg },
			Imgpath(){
				return this.$store.state.Imgpath
			},
			parkingArray() {
				return this.$store.state.carRentalModule.rentalParkings
			},
			emptyOption() {
				return getMescrollConfig((configObj) => set(configObj, 'upOption.empty.tip', '暂无此类型下的搜索结果')).upOption.empty
				// let isFilter = Object.keys(this.filterRule).find((key) => this.filterRule[key] > 0)
				// return isFilter ? 
				// getMescrollConfig((configObj) => set(configObj, 'upOption.empty.tip', '暂无此类型下的搜索结果')).upOption.empty : 
				// getMescrollConfig((configObj) => set(configObj, 'upOption.empty.tip', '暂无可租赁的停车场')).upOption.empty
			}
		},
		onLoad(options) {
			// 新增 start
			const that = this;
			
			// start login
			this.checkLogin(()=>{
				this.getLocation(this.afterGetLocation);
			})
			// end login
			
			this.getScreenSize();
			this.$store.dispatch('getUsersInfo');
			// 监听组件的登录请求
			this.$bus.$on('needLogin', () => {
				that.$refs.login.getUserInfoStep();
				that.loginCallBack = () => {
					this.$bus.$emit('loginSuccess');
				};
			});
			// this.$bus.$on('changeTargetLocation', location => {
			// 	if (location.longitude == 0 || location.latitude == 0) {
			// 		return;
			// 	}
			// 	this.targetLocation = location;
			// 	setTimeout(() => {
			// 		that.isMoveToLocation = true;
			// 		this.mapContext &&
			// 			this.mapContext.moveToLocation({
			// 				longitude: Number(location.longitude),
			// 				latitude: Number(location.latitude),
			// 				success() {
			// 					that.moveToLocation = false;
			// 				}
			// 			});
			// 	}, 600);
			// });
			// 菜单
			store.dispatch('getMenuAction', { version: this.$store.state.version, requestType: 'miniprogram', istrue: true });
			// 新增 end
			
			this.$store.commit('carRentalModule/updateRentalParkings', [])
			if (options.pageStatus) {
				this.pageStatus = options.pageStatus
			}
			this.$store.commit('carRentalModule/resetFilterParkings')
			
			// start login
			// this.checkLogin(()=>{
			// 	this.getLocation(this.afterGetLocation);
			// })
			// end login
		},
		onShow() {
			setTimeout(() => {
				this.mescroll.resetUpScroll();
			}, 300)
		},
		methods:{
			
			// 进入筛选页面
			toFiltrate(){
				uni.navigateTo({
					url:'/personal/carRental/filtrate/index'
				})
			},
			// 跳转租赁订单列表
			nav2Order(){
				uni.navigateTo({
					url:`/personal/carRental/rentList2/index?id=1&isInvoice=0&pageStatus=${this.pageStatus}`
				})
			},
			// 进入搜索页
			search(){
				this.$store.commit('carRentalModule/clearSearchResults')
				uni.navigateTo({
					url:`/personal/carRental/search/index?pageStatus=${this.pageStatus}`
				})
			},
			downCallback() {
				setTimeout(() => {
					this.$store.commit('carRentalModule/resetFilterParkings')
					this.mescroll.resetUpScroll();
				},200)
			},
			async upCallback() {
				this.isLoading = true
				const parkings = await this.$store.dispatch('carRentalModule/getParkingOfRentAction', {type: this.pageStatus == 'carRental' ? 1 : 2})
				this.mescroll.endSuccess(parkings.length, false)
				this.isLoading = false
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
			afterGetLocation(res) {
				// 获取地址成功 重新获取车位租赁列表
				this.mescroll.resetUpScroll();
			},
			loginSuccess() {
				store.dispatch('wallet');
			},
		}
	}
</script>

<style lang="scss">
	.translucent{
		opacity: 0.5;
	}
	.rental-input {
		width: 510rpx !important;
	}
	.input-box{
		width: 100%;
		height: 82rpx;
		border-radius: 20rpx;
		box-sizing: border-box;
		.searchIcon{
			width: 40rpx;
			height: 40rpx;
		}
		.input{
			font-size:22rpx;
			font-weight:400;
			color:#7A818D;
		}
	}
	.filter-box{
		width:140rpx;
		height:82rpx;
		border-radius:20rpx;
		.filterIcon{
			width: 24rpx;
			height: 24rpx;
		}
		.filterText{
			color:#4A5361;
		}
	}
	.mescroll-uni {
		width: 109% !important;
	}
	.parking_mescroll {
		overflow-x: hidden;
		.mescroll-upwarp {
			display: none;
		}
	}
</style>

<template>
  <div id="main">
		<!-- 车场banner -->
		<div class="swiper-box" :style="{opacity:1-(scrollTop/(540*(windowWidth/750)))}">
			<swiper class="d_swiper"
				:interval="interval" 
				:duration="duration" 
				:circular="circular" 
				:autoplay="autoplay"
				@change="swiperChange">
				<block v-for="item in imgUrls" :key='item'>
					<swiper-item>
						<image :src="item" mode='scaleToFill' class="slide-image" />
					</swiper-item>
				</block>
			</swiper>
			<!-- 指示点 -->
			<div class="fcx dots">
				<div v-for="(item,index) in imgUrls" :key='index' class="dot" :class="index == swiperIndex ? 'active':''"></div>
			</div>
		</div>
		<view style="width:100%;height:540rpx;"></view>
		<view style="height:100vh;position:relative;background:#fff;">
			<div class="infoBox bgw pdt40">
			  <!-- 车场名字 -->
			  <div class="fs mg40-x" style="align-items: flex-end;">
				  <div class="ft38 parkingName ftweight rgb44">{{parkInfo.parkingName}}</div>
				  <div class="distance ftweight ft24" style="margin-left: auto;">距离您{{distance}}</div>
			  </div>
			  
			  <!-- 车场地址及导航 -->
			  <div class="pd40-y mg40-x ft24 rgb44">
				  <div v-if="isbg" class="mgb20 ft24">当前空余：{{parkInfo.remainCarNum}}</div>
				  <div class="address ft24">{{parkInfo.address}}</div>
				  <div v-if="parkInfo.isOpenInvoice" style="display: flex;align-items: center;margin-top: 20rpx;">
					  <image style="width: 18rpx;height: 18rpx;" src="@/static/img/star.png"></image>
					  <text style="margin-left: 10rpx;color: #4A5361;font-size: 20rpx;">支持电子发票</text>
				  </div>
			  </div>
			  <!-- 广告位 -->
			  <div v-if="isRent && advertisement" @click="navDetail" class="mg40-x">
				<image :src=" Imgpath + advertisement.icon"  style="width:100%;height: 214rpx;"/>
			  </div>
			</div>
			
	  	<!-- 收费标准 -->
		<view class="chargeBoxContent">
		<view v-for="(chargeObj,index) in charge" v-if="isbg&&charge" >
	  	<div class="pd40-x chargeBox" >
				<div class="ft26 ftweight rgb44">收费标准 {{chargeObj.license_plate_type == '1' ? '燃油车' : chargeObj.license_plate_type == '2' ? '新能源' : ''}}</div>
				<div class="mg40-y fwrap"> 
					<div class="ft22 fi width50 mgb20 ftweight" v-if="chargeObj.freeTime">
					   <image :src="staticImg + 'static/img/parkingIcon1.png'" class="parkingIcon mgr20"></image>
					   免费时长{{chargeObj.freeTime}}min
					</div>
					<div class="ft22 fi width50 mgb20 ftweight" v-if="chargeObj.charge_type != 2 && chargeObj.dayMaxCharge">
					   <image :src="staticImg + 'static/img/parkingIcon2.png'" class="parkingIcon mgr20"></image>
					   24小时上限{{chargeObj.dayMaxCharge}}元
					</div>	
					<div class="ft22 fi width50 mgb20 ftweight" v-if="chargeObj.charge_type == 2 && chargeObj.workDayMaxCharge && chargeObj.dayMaxCharge">
					   <image :src="staticImg + 'static/img/parkingIcon2.png'" class="parkingIcon mgr20"></image>
					   工作日24小时上限{{chargeObj.workDayMaxCharge}}元
					</div>
					<div class="ft22 fi width50 mgb20 ftweight" v-if="chargeObj.charge_type == 2 && chargeObj.workDayMaxCharge && !chargeObj.dayMaxCharge">
					   <image :src="staticImg + 'static/img/parkingIcon2.png'" class="parkingIcon mgr20"></image>
					   24小时上限{{chargeObj.workDayMaxCharge}}元
					</div>	
					<div class="ft22 fi width50 mgb20 ftweight" v-if="chargeObj.isRecharge">
					   <image :src="staticImg + 'static/img/parkingIcon6.png'" class="parkingIcon mgr20"></image>
					   满24小时重新计费
					</div>
					<div class="ft22 fi width50 mgb20 ftweight" v-if="chargeObj.charge_type == 2 && chargeObj.dayMaxCharge">
					   <image :src="staticImg + 'static/img/parkingIcon2.png'" class="parkingIcon mgr20"></image>
					   节假日24小时上限{{chargeObj.dayMaxCharge}}元
					</div>	
					<div class="ft22 fi width50 mgb20 ftweight" v-if="chargeObj.charge_type == 2">
					   <image :src="staticImg + 'static/img/parkingIcon6.png'" class="parkingIcon mgr20"></image>
					   高峰期:{{chargeObj.peakStartTime}}-{{chargeObj.peakEndTime}}
					</div>
				</div>
	  	    <!-- chargetype = 1  普通版 -->
	  	    <view class="content" v-if="chargeObj.charge_type == 1">
	  			<view class="genaral-area">
	  				<view class="flex-box tc thead">
	  					<view class="item-3 fcx"></view>
	  					<view class="item-3 fcx"><image :src="staticImg + 'static/img/parkingIcon4.png'" class="parkingIcon mgr8"></image>停车时长</view>
	  					<view class="item-3 fcx"><image :src="staticImg + 'static/img/parkingIcon5.png'" class="parkingIcon mgr8"></image>收费金额</view>
	  				</view>
	  				<view class="flex-box table tc">
	  					<view class="item-3">
	  						首段收费
	  					</view>
	  					<view class="item-3">
	  						{{chargeObj.time1}}
	  					</view>
	  					<view class="item-3">
	  						{{chargeObj.charge1}}元
	  					</view>
	  				</view>
	  				<view class="flex-box table tc">
	  					<view class="item-3">
	  						间隔收费
	  					</view>
	  					<view class="item-3">
	  						{{chargeObj.time2}}
	  					</view>
	  					<view class="item-3">
	  						{{chargeObj.charge2}}元
	  					</view>
	  				</view>
	  			</view>
	  		</view>
	  	    <!-- chargetype = 2 节假日版 -->
	  		<view class="content" v-if="chargeObj.charge_type == 2">
	  		    <view  class="advance-area">
	  				<view class="flex-box tc thead">
	  					<view class="item-4"></view>
	  					<view class="item-4"></view>
	  					<view class="item-4 fcx"><image :src="staticImg + 'static/img/parkingIcon4.png'" class="parkingIcon mgr8"></image>停车时长</view>
	  					<view class="item-4 fcx"><image :src="staticImg + 'static/img/parkingIcon5.png'" class="parkingIcon mgr8"></image>收费金额</view>		 		
	  				</view>
	  				<!-- 工作日高峰 -->
	  				<view class="flex-box table tc">
	  					<view class="item-4">
	  						{{chargeObj.charge1 && chargeObj.charge2 ? '工作日高峰' :'高峰'}}
	  					</view>
	  					<view class="item-4">
	  						<view class="table-flex">
	  							<view class="item">首段收费</view>
	  							<view class="item">间隔收费</view>
	  						</view>
	  					</view>
	  					<view class="item-4">
	  						<view class="table-flex">
	  							<view class="item">{{chargeObj.time3}}</view>
	  							<view class="item">{{chargeObj.time4}}</view>
	  						</view>
	  					</view>
	  					<view class="item-4">
	  						<view class="table-flex">
	  							<view class="item">{{chargeObj.charge3}}元</view>
	  							<view class="item">{{chargeObj.charge4}}元</view>
	  						</view>
	  					</view>
	  				</view>
	  				<!-- 工作日非高峰 -->
	  				<view class="flex-box table tc">
	  					<view class="item-4">
	  						{{chargeObj.charge1 && chargeObj.charge2 ? '工作日非高峰' :'非高峰'}}
	  					</view>
	  					<view class="item-4">
	  						<view class="table-flex">
	  							<view class="item">首段收费</view>
	  							<view class="item">间隔收费</view>
	  						</view>
	  					</view>
	  					<view class="item-4">
	  						<view class="table-flex">
	  							<view class="item">{{chargeObj.time5}}</view>
	  							<view class="item">{{chargeObj.time6}}</view>
	  						</view>
	  					</view>
	  					<view class="item-4">
	  						<view class="table-flex">
	  							<view class="item">{{chargeObj.charge5}}元</view>
	  							<view class="item">{{chargeObj.charge6}}元</view>
	  						</view>
	  					</view>
	  				</view>
	  				<!-- 节假日 -->
	  				<view class="flex-box table tc" v-if="chargeObj.charge1 && chargeObj.charge2">
	  					<view class="item-4">
	  						节假日
	  					</view>
	  					<view class="item-4">
	  						<view class="table-flex">
	  							<view class="item">首段收费</view>
	  							<view class="item">间隔收费</view>
	  						</view>
	  					</view>
	  					<view class="item-4">
	  						<view class="table-flex">
	  							<view class="item">{{chargeObj.time1}}</view>
	  							<view class="item">{{chargeObj.time2}}</view>
	  						</view>
	  					</view>
	  					<view class="item-4">
	  						<view class="table-flex">
	  							<view class="item">{{chargeObj.charge1}}元</view>
	  							<view class="item">{{chargeObj.charge2}}元</view>
	  						</view>
	  					</view>
	  				</view>
	  			</view>
	  		</view> 
	  		 <!-- chargetype = 3  分时段版 -->
	  		<view class="content" v-if="chargeObj.charge_type == 3">
	  		  <view class="genaral-area">
	  			<view class="flex-box tc thead">
	  				<view class="item-2 fcx"><image :src="staticImg + 'static/img/parkingIcon4.png'" class="parkingIcon mgr8"></image>停车时长</view>
	  				<view class="item-2 fcx"><image :src="staticImg + 'static/img/parkingIcon5.png'" class="parkingIcon mgr8"></image>收费金额</view>
	  			</view>
	  			<view class="flex-box table tc" v-if="chargeObj.time1">
	  				<view class="item-2">
	  					{{chargeObj.time1}}
	  				</view>
	  				<view class="item-2">
	  					{{chargeObj.charge1}}元
	  				</view>
	  			</view>
	  			<view class="flex-box table tc" v-if="chargeObj.time2">
	  				<view class="item-2">
	  					{{chargeObj.time2}}
	  				</view>
	  				<view class="item-2">
	  					{{chargeObj.charge2}}元
	  				</view>
	  			</view>
	  			<view class="flex-box table tc" v-if="chargeObj.time3">
	  				<view class="item-2">
	  					{{chargeObj.time3}}
	  				</view>
	  				<view class="item-2">
	  					{{chargeObj.charge3}}元
	  				</view>
	  			</view>
	  			<view class="flex-box table tc" v-if="chargeObj.time4">
	  				<view class="item-2">
	  					{{chargeObj.time4}}
	  				</view>
	  				<view class="item-2">
	  					{{chargeObj.charge4}}元
	  				</view>
	  			</view>
	  			<view class="flex-box table tc" v-if="chargeObj.time5">
	  				<view class="item-2">
	  					{{chargeObj.time5}}
	  				</view>
	  				<view class="item-2">
	  					{{chargeObj.charge5}}元
	  				</view>
	  			</view>
	  			<view class="flex-box table tc" v-if="chargeObj.time6">
	  				<view class="item-2">
	  					{{chargeObj.time6}}
	  				</view>
	  				<view class="item-2">
	  					{{chargeObj.charge6}}元
	  				</view>
	  			</view>
	  			<view class="flex-box table tc" v-if="chargeObj.time7">
	  				<view class="item-2">
	  					{{chargeObj.time7}}
	  				</view>
	  				<view class="item-2">
	  					{{chargeObj.charge7}}元
	  				</view>
	  			</view>
	  			<view class="flex-box table tc" v-if="chargeObj.time8">
	  				<view class="item-2">
	  					{{chargeObj.time8}}
	  				</view>
	  				<view class="item-2">
	  					{{chargeObj.charge8}}元
	  				</view>
	  			</view>
	  			<view class="flex-box table tc" v-if="chargeObj.time9">
	  				<view class="item-2">
	  					{{chargeObj.time9}}
	  				</view>
	  				<view class="item-2">
	  					{{chargeObj.charge9}}元
	  				</view>
	  			</view>
	  			<view class="flex-box table tc" v-if="chargeObj.time10">
	  				<view class="item-2">
	  					{{chargeObj.time10}}
	  				</view>
	  				<view class="item-2">
	  					{{chargeObj.charge10}}元
	  				</view>
	  			</view>
	  			<view class="flex-box table tc" v-if="chargeObj.time11">
	  				<view class="item-2">
	  					{{chargeObj.time11}}
	  				</view>
	  				<view class="item-2">
	  					{{chargeObj.charge11}}元
	  				</view>
	  			</view>
	  			<view class="flex-box table tc" v-if="chargeObj.time12">
	  				<view class="item-2">
	  					{{chargeObj.time12}}
	  				</view>
	  				<view class="item-2">
	  					{{chargeObj.charge12}}元
	  				</view>
	  			</view>
	  			<view class="flex-box table tc" v-if="chargeObj.time13">
	  				<view class="item-2">
	  					{{chargeObj.time13}}
	  				</view>
	  				<view class="item-2">
	  					{{chargeObj.charge13}}元
	  				</view>
	  			</view>
	  			<view class="flex-box table tc" v-if="chargeObj.time14">
	  				<view class="item-2">
	  					{{chargeObj.time14}}
	  				</view>
	  				<view class="item-2">
	  					{{chargeObj.charge14}}元
	  				</view>
	  			</view>
	  			<view class="flex-box table tc" v-if="chargeObj.time15">
	  				<view class="item-2">
	  					{{chargeObj.time15}}
	  				</view>
	  				<view class="item-2">
	  					{{chargeObj.charge15}}元
	  				</view>
	  			</view>
	  			<view class="flex-box table tc" v-if="chargeObj.time16">
	  				<view class="item-2">
	  					{{chargeObj.time16}}
	  				</view>
	  				<view class="item-2">
	  					{{chargeObj.charge16}}元
	  				</view>
	  			</view>
	  		  </view>
	  		</view>  
	  		<!-- chargetype = 4  基础版 -->
	  		<view class="content" v-if="chargeObj.charge_type == 4">
	  		  <view class="genaral-area">
	  			<view class="flex-box tc thead">
	  				<view class="item-2 fcx"><image :src="staticImg + 'static/img/parkingIcon4.png'" class="parkingIcon mgr8"></image>停车时长</view>
	  				<view class="item-2 fcx"><image :src="staticImg + 'static/img/parkingIcon5.png'" class="parkingIcon mgr8"></image>收费金额</view>
	  			</view>
	  			<view class="flex-box table tc" v-if="chargeObj.time1">
	  				<view class="item-2">
	  					{{chargeObj.time1}}
	  				</view>
	  				<view class="item-2">
	  					{{chargeObj.charge1}}元
	  				</view>
	  			</view>
	  		  </view>
	  		</view>
	  			
	  	</div>
		</view>
		
	  	<view v-else class="">
	  		<view class="item-3 fcs pdl40"><image :src="staticImg + 'static/img/parkingIcon5.png'" class="parkingIcon mgr8"></image>收费标准以现场车场公示收费细则为准</view>
	  	</view>
	  	<!-- 导航 -->
	  	<div class="pd40 navigationBox">
	  	  <div class="navigation" @click="mapnavigation">开始导航</div>
	  	</div>
		</view>
		</view>
		<login-modal ref='login' @loginCallBack="loginCallBack" navigateState='1' ></login-modal>
  </div>
</template>

<script>
import { getParkingInfo, getParkingByCode , getParkingLotMsg,getRentAdvByParkingCode} from '@/api'
import { calculateDistance, formatDistance } from '@/utils'
import { get } from '@/utils/miniLodash'
import { goLink } from '@/utils/link'
import store from '@/store'
// import { mapActions, mapState } from 'vuex'
import loginModal from '@/components/loginModal/loginModal.vue'
export default {
  data () {
    return {
			swiperIndex:0,
			duration:800,
			interval:2000,
			circular:true,
			indicatorDots:false,
			autoplay:true,
			parkInfo:{
				parkingName:'',
				remainCarNum:'',
				address:'',
			},
			charge:{},
			isRent:false,
			imgUrls:[],
			distance:'', // 与当前位置距离
			isbg:true, // 是否是自营停车场
			windowWidth:0, // 窗口宽度
			scrollTop:0, // 页面滚动高度
			advertisement:{}
    }
  },
	components:{
		loginModal
	},
	computed:{
		// ...mapState("commonModule",['advertisement']),
		Imgpath(){return this.$store.state.Imgpath},
		staticImg() { return this.$store.state.staticImg } ,
		isLogin() {
			return Object.keys(get(this.$store.state, 'userInfo', {})).length > 0;
		},
		webUrl() {
			return this.$store.state.webUrl;
		},
	},
	onPageScroll(e){
		this.scrollTop = e.scrollTop;
	},
	// #ifdef MP-WEIXIN
		onShareTimeline(){
			if(this.isbg){
				var query = `id=${this.parkingId}`
			} else {
				var query = `name=${this.parkInfo.parkingName}&address=${this.parkInfo.address}&lnt=${this.parkInfo.longitude}&lat=${this.parkInfo.latitude}`
			}
		  return {
		    title: this.parkInfo.parkingName,
		    query: query,
		    imageUrl:  this.webUrl + '/images/mobile/small_routine_share_surface.jpg'
		  }
		},
		// 微信分享小程序给朋友
		onShareAppMessage() {
			if(this.isbg){
				var path = `/basic/parkLotDetail/index?id=${this.parkingId}`
			} else {
				var path = `/basic/parkLotDetail/index?name=${this.parkInfo.parkingName}&address=${this.parkInfo.address}&lnt=${this.parkInfo.longitude}&lat=${this.parkInfo.latitude}`
			}
			return {
				title: this.parkInfo.parkingName,
				path: path,
				imageUrl: this.webUrl + '/images/mobile/small_routine_share_surface.jpg'
			};
		},
	// #endif
  onLoad(option){
    let that = this;
		uni.getSystemInfo({
			success: function (res) {
				that.windowWidth = res.windowWidth;
			}
		});
		if(option.id){
			that.isbg = true;
			that.parkingId = option.id;
			// that.getParkingInfo();
		} else {
			that.isbg = false;
			that.parkingId = option.code;
			that.parkInfo = {
				parkingName:option.name,
				address:option.address,
				longitude:option.lnt,
				latitude:option.lat
			}
			that.imgUrls = ['/static/img/lotParking.png']
			// that.getLocation();
			// that.getParkingLotMsg();
		}
  },
  onShow () {
    var that = this;
		//停车场详情
		that.getParkingInfo();
		that.getAdverUrl();
		uni.onSocketMessage(function (res) {
		  var data= JSON.parse(res.data);
			switch (data.msgType){
				case 'bgParkInfoMsg':
					// 停车场信息变化
					that.getParkingInfo();
					break;
			}
			// that.getParkingOrder();
		})
   },
  methods: {
	  // ...mapActions('commonModule',['getAdvertisement']),
	// 获取广告位信息
	async getAdverUrl(){
		// this.getAdvertisement({type: 4})//1-待支付卡片 2-扫码缴费页 3-缴费完成页 4-停车场详情页 5-新手指南 6-领停车券 7-UGCBanner管理'     8-加油活动
		const {data} = await getRentAdvByParkingCode({
			parkingCode:this.parkingId,
			requestType: 'miniprogram',
			version:this.$store.state.version
		})
		if(data.code == 1){
			this.advertisement = data.obj.list[0]
		}
 	},
	//广告位跳转
	navDetail(){
		if(this.advertisement.isOpen){ //true需要登录
			this.logon(() => {
				goLink(this.advertisement.miniprogramurl , {parkingCode:this.parkInfo.parkingCode})
			});
		}else{
			goLink(this.advertisement.miniprogramurl , {parkingCode:this.parkInfo.parkingCode})
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
    //点击导航
    mapnavigation(){
		uni.openLocation({
			latitude: this.parkInfo.latitude,
			longitude: this.parkInfo.longitude,
			name:this.parkInfo.parkingName,
			address:this.parkInfo.address
		})
    },
    // 自营停车场详情
    async getParkingInfo () {
      let that = this;
      const { data } = await getParkingByCode({
				parkingCode:that.parkingId
      })
      if (data.code === '1') {
        that.parkInfo = data.obj.parking
			that.charge = data.obj.charge
			that.isRent = data.obj.isRent
			
			that.charge.forEach((item,index)=>{
					
				
				// 普通版
				if(item.charge_type == 1){
					item.time1 = that.changeHourMinutestr(item.time1);
					item.time2 = that.changeHourMinutestr(item.time2);
				}
				// 节假日版
				if(item.charge_type == 2){
					item.time1 = that.changeHourMinutestr(item.time1);
					item.time2 = that.changeHourMinutestr(item.time2);
					item.time3 = that.changeHourMinutestr(item.time3);
					item.time4 = that.changeHourMinutestr(item.time4);
					item.time5 = that.changeHourMinutestr(item.time5);
					item.time6 = that.changeHourMinutestr(item.time6);
				}
				// 分时段版
				if(item.charge_type == 3){
					item.time1 = that.changeHourMinutestr(item.time1);
					item.time2 = that.changeHourMinutestr(item.time2);
					item.time3 = that.changeHourMinutestr(item.time3);
					item.time4 = that.changeHourMinutestr(item.time4);
					item.time5 = that.changeHourMinutestr(item.time5);
					item.time6 = that.changeHourMinutestr(item.time6);
					item.time7 = that.changeHourMinutestr(item.time7);
					item.time8 = that.changeHourMinutestr(item.time8);
					item.time9 = that.changeHourMinutestr(item.time9);
					item.time10 = that.changeHourMinutestr(item.time10);
					item.time11 = that.changeHourMinutestr(item.time11);
					item.time12 = that.changeHourMinutestr(item.time12);
					item.time13 = that.changeHourMinutestr(item.time13);
					item.time14 = that.changeHourMinutestr(item.time14);
					item.time15 = that.changeHourMinutestr(item.time15);
					item.time16 = that.changeHourMinutestr(item.time16);
				}
				// 基础版
				if(item.charge_type == 4){
					item.time1 = that.changeHourMinutestr(item.time1);
				}
			})
			let imgUrls = data.obj.parking.parkingPic || ''
			that.imgUrls = imgUrls.split(',').map(item => store.state.BASE_URL+`/file/downloadImg?path=${item}`);
					if(!this.distance){
						this.getLocation();
					}
		  };
		},
		// // 抓包停车场详情
		// async getParkingLotMsg(){
		// 	let that = this;
		// 	const { data } = await getParkingLotMsg({
		// 		parkingCode:that.parkingId
		// 	})
		// 	console.log(data)
		// },
		// 分钟转化小时分钟
		changeHourMinutestr (str) {
			let hours = Math.floor(str/60)
			let minutes = (str % 60)
			if (str !== '0' && str !== '' && str !== null) {
				return (hours ? hours + '小时' : '')+ (minutes ? minutes + '分钟' : '')
			} else {
				return ''
			}
		},
		// 得到当前位置
		getLocation() {
			const that = this;
			that.getOpenSetting = false;
			uni.getLocation({
				type:'gcj02',
				success({longitude,latitude}){
					that.location = {longitude, latitude};
					let distance = calculateDistance(that.location, that.parkInfo)
					that.distance = distance >= 1000 ? (distance / 1000).toFixed(1) + 'km' : distance + 'm' ;
				}
			});
		},
		swiperChange(e){
			this.swiperIndex = e.detail.current
		}
  },
}
</script>

<style lang='stylus'>
/* @import '../../styles/color.scss' */
page
  background-color #fff
.parkLot:last-child
  padding-bottom  50rpx
.crl
  width 90rpx
  height 90rpx
  font-size 30rpx
  border-radius 50%
  text-align center
  line-height 90rpx
  background-color #f33535
  color #fff
.isEmpty
  color #0dba46
.position 
  position: relative;
  padding-left 40rpx
  div
    display: inline-block;
    word-break: break-all;
    vertical-align: top 
.swiper-box
	width 100%
	height 540rpx
	position fixed
	top 0
.d_swiper
  height 540rpx
  position relative
.slide-image
  width 100%
  height 100%
.icon
  width 30rpx
  height 30rpx
.rgb150
  color rgb(150,150,150)
.credit
  height 40rpx
  line-height 40rpx
  border-radius 20rpx
  background-color #eff4f8
.credit-1
  width 120rpx
  height 36rpx
  line-height 36rpx
  border-radius 18rpx
  background-color #56c9cc
.icon-Dog
  width 26rpx
  height 26rpx
.btn-ok
  height 80rpx
  line-height 80rpx
  border-radius 10rpx
.parkcontainer
  height 500rpx
.car-icon
  width 20rpx
  height 40rpx
.iconpm
  width 50rpx
  height 50rpx
.plus
  margin-top 100rpx
  margin-left 80%
.minus
  margin-top 50rpx
  margin-left 80%
.compass
  margin-top 50rpx
  margin-left 40rpx
  width 24rpx
  height 72rpx
.btn-gray
  background-color rgb(150,150,150)
.btn-black
  background-color #1b1921
.footer
  box-sizing border-box
  position fixed
  height 160rpx
  bottom 0
  width 100%
  z-index 3
.icon-nav
  width 70rpx
  height 70rpx
.pkSpaNam_num
  color rgb(27,25,33)
  font-size 36rpx
  font-weight bold
.pkSpaNam_eqt
  width 120rpx
  height 36rpx
  margin-left 40rpx
  text-align center
  border-radius 18rpx
  background-color #56c9cc
  color #fff
  font-size 24rpx
.pkSpaNam_full
  width 120rpx
  height 36rpx
  margin-left 40rpx
  text-align center
  border-radius 18rpx
  background-color rgb(218,110,106)
  color #fff
  font-size 24rpx
.pkSpaNam_litle
  width 120rpx
  height 36rpx
  margin-left 40rpx
  text-align center
  border-radius 18rpx
  background-color rgb(227,191,115)
  color #fff
  font-size 24rpx
.pkSpaNam_plenty
  width 120rpx
  height 36rpx
  margin-left 40rpx
  text-align center
  border-radius 18rpx
  background-color rgb(116,198,202)
  color #fff
  font-size 24rpx
.pkcolor_full
  background rgb(53,243,102)
  border-radius 50%
.pkcolor_litle
  background rgb(242,185,60)
  border-radius 50%
.pkcolor_plenty
  background rgb(243,53,53)
  border-radius 50%
.pkSpaBtn
  height: 60rpx;
  line-height: 60rpx;
  color: #fff;
  font-weight: bold;
  font-size: 32rpx;
.order
  background-color rgb(106,118,129)
  margin-right 30rpx
.blur
  filter blur(10rpx)
.dialog
  width 590rpx
  background #fff
  border-radius 20rpx
.car_title
  color rgba(74,83,97,0.5)
  font-size 28rpx
  font-weight bold
.car_information
  color rgb(27,25,33)
  font-size 28rpx
  font-weight bold
.dialog_footer
  border-top 1px solid #EFF4F8
.dialog_cancel
  display inline-block
  width 50%
  text-align center
.dialog_sure
  display inline-block
  box-sizing border-box
  width 50%
  border-left 1px solid #EFF4F8
  color rgb(243,53,53)
  text-align center
.open_img
  width 500rpx
  height 323rpx
  position absolute
  top 400rpx
  left 50%
  margin-left -245rpx
.pro_box
  width 300rpx
  height 100rpx
  position absolute
  top 730rpx
  left 50%
  margin-left -150rpx
  text-align center
::-webkit-scrollbar{
  width: 0;
  height: 0;
  color: transparent; 
}
.fixedPage
  position fixed
  width 100%
  height 100%
  overflow hidden
  
.infoBox
	position relative
	top -40rpx
	border-top-left-radius 30rpx
	border-top-right-radius 30rpx
	border-bottom 2rpx dashed  rgba(239,244,248,1)
.parkingName 
	width 500rpx
.address
	width 500rpx
.parkingIcon
	width 22rpx
	height 22rpx
	margin-right 8rpx
.fwrap
 display flex
 flex-wrap wrap
.width50
	width 50%
.chargeBoxContent
	padding-bottom 100rpx
.chargeBox
	padding-bottom 80rpx
.navigationBox
	width 100%
	position fixed
	bottom 0
	box-sizing border-box
	background #FFFFFF
.navigation
	height 100rpx
	line-height 100rpx
	text-align center
	background rgba(26,25,33,1)
	border-radius 20rpx
	color #FFFFFF
/* 表格 */
.content 
	display flex
	flex 1
	flex-direction column
	background rgba(239,244,248,0.5)
	border-radius 20rpx
.flex-box 
	display flex
	flex-wrap wrap
.flex-box>.item-2 
	flex 0 0 50%
.flex-box>.item-3 
	flex 0 0 33.3333%
.flex-box>.item-4 
	flex 0 0 25%
.title
	margin 20rpx 0
	color red
/* 普通表格 */
.genaral-area 
	.item-2 ,.item-3 ,.item-4 
		font-size 20rpx
		border 1rpx solid #FFFFFF
		border-width 1rpx 1rpx 0 0
		height 60rpx
		line-height 60rpx
		box-sizing border-box
		text-align center
		&first-child 
			border-left-width 1rpx
		&last-child 
			border-right-width 1rpx
	.thead 
		.item-2 ,.item-3 ,.item-4 
			font-weight bold
			box-sizing border-box
	.table 
		&last-child 
			border-bottom 1rpx solid #FFFFFF
		.item-2 ,.item-3 ,.item-4 
			display flex
			justify-content center
			align-items center
			box-sizing border-box

 /* 多行合并表格 */
.advance-area 
		.item-3 ,.item-4 
			font-size 20rpx
			border 1rpx solid #FFFFFF
			border-width 1rpx 1rpx 0 0
			box-sizing border-box
			text-align center	
			&first-child 
				border-left-width 1rpx	
			&last-child 
				border-right-width 1rpx	
		.thead 
			.item-3 ,.item-4 
				font-weight bold
				height 60rpx
				line-height 60rpx
				box-sizing border-box	
		.table 
			&last-child 
				border-bottom 1rpx solid #FFFFFF	
			.item-3 ,.item-4 
				display flex
				justify-content center
				align-items center
				box-sizing border-box	
		.table-flex 
			flex 1	
			.item 
				border-bottom 1rpx solid #FFFFFF
				height 60rpx
				line-height 60rpx
				box-sizing border-box
				&last-child 
					border-width 0	
					
					
.dots
	width 100%
	height 10rpx
	position absolute
	bottom 70rpx
	left 0
	.dot
		width 10rpx
		height 10rpx
		margin 0 8rpx
		border-radius:50%;
		background:rgba(255,255,255,1);
		&.active
			background:rgba(243,53,53,1);
			
</style>

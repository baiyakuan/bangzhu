<template>
	<view class="">
		<!-- 地理位置授权：-->
		<view v-if="getOpenSetting" class="fcy pf">
		  <view class="authorize">
		    <view class="mgt40 ft35 ftweight ">
		      授权提示
		    </view>
		    <view class="fcy">
		      <view class="mgt40 ft30 gray-t" >
		        若需使用帮驻，需要获取您的&nbsp;
		      </view>
		      <view class="gray-t mgt15 ft30 mgb40">
		        地理位置&nbsp;&nbsp;
		      </view>
		    </view>
		    <view style="height:1rpx;background:#e5e5e5"></view>
		    <view>
		      <view>
						<!-- #ifdef MP-WEIXIN -->
		        <button class="okgetUserInfo" style="margin:0 auto;" @opensetting="openSettingHandler" open-type="openSetting">授权</button>
						<!-- #endif -->
						<!-- #ifdef MP-ALIPAY -->
						<button class="okgetUserInfo" style="margin:0 auto;" @click="getLocation">授权</button>
						<!-- #endif -->
		      </view>
		    </view>
		  </view>
		</view>
		
		<toastes :visibile="toastVisibile">{{ msg }}</toastes>
	</view>
</template>

<script>
	import store from '@/store';
	import QQMapWX from '@/plugins/qqmap-wx-jssdk.min';
	import { baseUtil } from '@/utils/miniLodash'
	export default {
		data() {
			return {
				getOpenSetting: false,
				hasLocationAuth: false,
				callback: () => {}
			};
		},
		updated() {
			
		},
		methods:{
			openSettingHandler() {
				this.getLocation(this.callback)
			},
			checkAuth () {
			  let that = this;
			  uni.getSetting({
			    success: res => {
					// #ifdef MP-WEIXIN
						let auth = res.authSetting
						let str  = 'scope.userLocation'
						if (!auth.str) {
						  that.getOpenSetting =true;
						}else{
						  uni.showToast({
							title:'未获取到地理位置信息',
								icon:'none',
								mask:true
						  })
						}
					// #endif
					// #ifdef MP-ALIPAY
						if (!res.authSetting.location) {
							that.getOpenSetting =true;
						}
					// #endif
			    }
			  })
			},
			getLocation(callback) {
				const that = this;
				let isFn = baseUtil.isFunction(callback)
				if (isFn) that.callback = callback
				that.getOpenSetting = false;
				uni.getLocation({
					type: 'gcj02',
					success: function({ longitude, latitude }) {
						store.commit('setLocationInfo', { longitude, latitude });
						// #ifdef MP-WEIXIN
						// 微信小程序逆地理位置解析
						const location = new QQMapWX({
							key: 'KRKBZ-G4LC2-6RZU2-CUHUP-63UMK-FTB46'
						});
						location.reverseGeocoder({
							location: {
								latitude,
								longitude
							},
							success: res => {
								that.hasLocationAuth = true
								isFn && callback({...res, longitude, latitude}) 
							}
						});
						// #endif
						// #ifdef MP-ALIPAY
						//支付宝小程序逆地理位置解析
						my.request({
							url: 'https://restapi.amap.com/v3/geocode/regeo?output=JSON&location=' + longitude + ',' + latitude + '&key=397ae5264ac6643137a6aff9fe07c1b8&radius=0',
							method: 'POST',
							success: (res) => {
								isFn && callback({...res, longitude, latitude})
							}
						});
						// #endif
					},
					fail: err => {
						that.checkAuth();
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
.authorize {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 600rpx;
	text-align: center;
	border-radius: 10rpx;
	background: white;
}
.okgetUserInfo {
	width: 50%;
	border: none;
	outline: none;
	background: white;
	line-height: 90rpx;
	font-size: 35rpx;
	font-weight: bold;
	color: #f44a3e;
}
.okgetUserInfo::after {
	display: none;
}
</style>

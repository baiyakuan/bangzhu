<template>
	<drawer ref="myDrawer" width="520" @closeDrawer="closeDrawer">
		<scroll-view scroll-y="true" :style="{height: maxHeight + 'px' , paddingTop: statusBarHeight + 'px', opacity:opacity }">
			<view class="top pd60-x">
				<div class="fi" @click="clickinformation" :style="{paddingTop: statusBarHeight + 'px'}">
					<div class="avatar">
						<img v-if="!alreadyAuth" :src="userInfo.usersPic ? baseUrl + '/file/downloadImg?path=' + userInfo.usersPic : staticImg + 'static/img/admin.png'"
						 alt="" class="user_avatar" />
						<button v-if="alreadyAuth" class="okgetUserInfo fcy" @getuserinfo="bindGetUserInfo" open-type="getUserInfo">
							<img :src="userInfo.usersPic ? baseUrl + '/file/downloadImg?path=' + userInfo.usersPic : staticImg + 'static/img/admin.png'"
							 alt="" class="user_avatar" />
						</button>
					</div>
					<div class="mgl60">
						<div class="ft32 ftweight name" v-if="userInfo.usersNickName">{{ userInfo.usersNickName }}</div>
						<div class="ft36 ftweight name" v-else>{{ unphone }}</div>
						<!-- <div class="credit fcx white-t mgt20 fc " v-if="userInfo.isPlus == 1" :class="userInfo.plusIsExpired ? 'bgcolor-9' : 'bgcolor-J' ">
							<img class="icon-Dog" src="/static/img/PlusDogTag.png" alt="" />
							<div class="ft22 white-t mgl10">PLUS会员</div>
						</div>
						<div class="credit2 fcx white-t mgt20 bgcolor-R" v-else>
							<div class="ft22 white-t mgl10 ">{{ userInfo.memberName }}</div>
						</div> -->
					</div>
				</div>
				<view class="memberBg">
					<image :src="staticImg + 'static/img/memberBg.png'" @click="navToDetail('member')"></image>
				</view>
				<div class="bgw">
					<!--<div class="fi pd26-y" @click="member">
						<div class="mgt10"><image class="icon" :src="staticImg + 'static/img/member.png'" /></div>
						<div class="fs mgl20" style="width:100%" v-if="userInfo.isPlus == 1"><div class="ftweight ft30">我的PLUS会员</div></div>
						<div class="fs mgl20" style="width:100%" v-else><div class="ftweight ft30">PLUS会员</div></div>
					</div> -->
					<div class="fi pd26-y" @click="navToDetail(item.miniprogramUrl)" v-for="(item,index) in menu.menuList" :key="index">
						<div class="mgt10">
							<image class="icon" :src="Imgpath+item.icon" />
						</div>
						<div class="ftweight ft30 mgl20 name">{{item.menuName}}</div>
					</div>
				</div>
			</view>
		</scroll-view>
		<view class="scrollBox  pd60-x">
			 <touch-slide  :winW="520" ref="touchslide"
			 :top="scrollBoxHeightTop" :bottom="scrollBoxHeightBottom"
			 @getBoxTop="setOpacity"
			 @end="end">
			 <template slot="slot1">
				 <view class="content">
				  	<view :class="arrowClass" @click="toggleTop"></view>
				  	<view class="fst">
				  		<view class="fcy icon1" @click="navToDetail(item.miniprogramUrl)" v-for="(item,index) in menu.menuGroupList" :key="index">
				  			<image :src="Imgpath+item.icon" class="iconImg"></image>
				  			<view class="text">{{item.menuName}}</view>
				  		</view>
				  	</view>
				 </view>
			</template>
			</touch-slide>
		 </view>
		 <view class="xieyi fcx" id="xieyi">
		 	<view @click="navSetting">法律条款与平台规则</view> <view class="addcar_arrow"></view>
		 </view>
	</drawer>
</template>

<script>
	import drawer from '@/components/uni-drawer/uni-drawer.vue';
	import touchSlide from '@/components/touch-slide/touch-slide.vue'
	import store from '@/store';
	import {
		OrderListOfUser,
		getServicePhone,
		thirdlogin,
		get3rdSession,
		decodeUserInfo,
		updateUserInfo,
		getBgWhiteListByUser
	} from '@/api';
	import {
		mapState
	} from "vuex"
	import { mapQuery } from '@/utils/miniLodash';
	export default {
		components: {
			drawer,
			touchSlide
		},
		data() {
			return {
				topHeight:0,
				scrollBoxHeightTop: 0,
				scrollBoxHeightBottom:0,
				
				arrowClass: 'arrowBottom',
				code: '',
				visible: false,
				servicePhone: '',
				servicetext: '请联系客服',
				unphone: '',
				alreadyAuth: false,
				whiteList: [],
				windowWidth:0, // 窗口宽度
				windowHeight: 0,
				statusBarHeight: 0,
				direction:"toTop",
				opacity:0,
			}
		},
		mounted() {
			this.caculateF()
		},
		computed: {
			baseUrl() {
				return store.state.BASE_URL;
			},
			userInfo() {
				if (store.state.userInfo.usersPhone) {
					this.unphone = store.state.userInfo.usersPhone.substring(0, 3) + '****' + store.state.userInfo.usersPhone.substring(7);
				} else {
					this.unphone = '未登录';
				}
				return store.state.userInfo;
			},
			menu() {
				return store.state.menuModule.menu
			},
			Imgpath() {
				return store.state.Imgpath
			},
			staticImg() { return store.state.staticImg },
		},
		methods: {
			setOpacity(data){
				this.direction = data.direction
				this.opacity = 1-data.opacity
			},
			end(res){
				this.arrowClass = (res.direction == "toTop") ? 'arrowTop' : 'arrowBottom'
			},
			//点击头部
			async clickinformation() {
				wx.navigateTo({
					url: `/personal/information/index`
				});
			},
			navSetting(){
				uni.navigateTo({
					url:'/personal/setting/index'
				})
			},
			closeDrawer(){
				this.$refs.touchslide.btnClick('toBottom');
			},
			toggleTop(){
				this.direction = (this.direction == 'toTop') ? 'toBottom' : 'toTop'
				this.$refs.touchslide.btnClick(this.direction);
			},
			caculateF() {
				let that = this;
				uni.getSystemInfo({
					success: function(res) {
						that.statusBarHeight = res.statusBarHeight
						that.windowHeight = res.windowHeight;
						that.windowWidth = res.windowWidth
					}
				});
				let view = uni.createSelectorQuery().in(that).select(".content");
				view.boundingClientRect(data => {
					that.scrollBoxHeightTop = that.statusBarHeight
					that.scrollBoxHeightBottom = that.windowHeight  - parseInt(((236/375)*that.windowWidth))
				}).exec();
			},

			open() {
				this.$refs.myDrawer.open();
				setTimeout(() => {
					this.caculateF()
				}, 1000)
			},
			// 栏目跳转
			navToDetail(url) {
				if(url == 'member'){
					url = '/personal/member/index'
				}
				if(url.substr(0,1) == '/'){
					wx.navigateTo({
						url: url
					});
				} else if (url.indexOf('/h5/ugc') > -1) {
					const index = url.indexOf('#');
					const completeUrl =
						url.slice(0, index) +
						'?' +
						mapQuery({
							token: this.$store.state.token,
							lat: this.$store.state.location.latitude,
							lng: this.$store.state.location.longitude
						}) +
						url.slice(index);
					uni.navigateTo({
						url: '/pages/web_view/index?url=' + encodeURIComponent(completeUrl)
					});
				} else {
					uni.navigateTo({
						url: '/pages/web_view/index?url=' + encodeURIComponent(url)
					});
				}
			},
			// 获取白名单列表
			async getBgWhiteListByUser() {
				const {
					data
				} = await getBgWhiteListByUser();
				if (data.code == '1') {
					this.whiteList = data.obj.whiteList;
				}
			},
			call() {
				wx.makePhoneCall({
					phoneNumber: this.servicePhone,
					success: () => {
						this.visible = false;
					}
				});
			},
			//查看是否授权
			viewAuthorization() {
				let that = this;
				if (store.state.userInfo.usersPic) {
					that.alreadyAuth = false;
				} else {
					that.alreadyAuth = true;
				}
			},
			bindGetUserInfo(e) {
				//第三方微信验证信息
				var that = this;
				if (e.mp.detail.errMsg.indexOf('ok') >= 0) {
					wx.login({
						success: async ({
							code
						}) => {
							get3rdSession({
								code: code,
								istrue: true
							}).then(res => {
								// 已经授权，可以直接调用 getUserInfo 获取头像昵称
								decodeUserInfo({
									encryptedData: e.mp.detail.encryptedData,
									iv: e.mp.detail.iv,
									session: res.data.obj.session
								}).then(ress => {
									if (ress.data.code == 1) {
										if (!store.state.userInfo.usersPic) {
											updateUserInfo({
												usersPic: ress.data.obj.avatarUrl,
												updateType: 1,
												istrue: true
											}).then(resss => {
												if (resss.data.code == 1) {
													if (!store.state.userInfo.usersNickName) {
														updateUserInfo({
															usersNickName: ress.data.obj.nickName,
															updateType: 2,
															istrue: true
														}).then(ressss => {
															if (ressss.data.code == 1) {
																store.dispatch('getUsersInfo').then(bbb => {
																	wx.navigateTo({
																		url: `/personal/information/index`
																	});
																});
															}
														});
													} else {
														store.dispatch('getUsersInfo').then(aaa => {
															wx.navigateTo({
																url: `/personal/information/index`
															});
														});
													}
												}
											});
										} else {
											wx.navigateTo({
												url: `/personal/information/index`
											});
										}
									}
								});
							});
						}
					});
				} else {
					wx.navigateTo({
						url: `/personal/information/index`
					});
				}
			}
		},
		onShow() {
			const that = this;
			this.getBgWhiteListByUser();
			this.viewAuthorization();
			store.dispatch('getUsersInfo').then(({
				data
			}) => {
				store.commit('set_userInfo', data.obj);
			});
			getServicePhone().then(res => {
				this.servicePhone = res.data.obj.sevicePhoneList[0].servcePhone;
			});
			uni.onSocketMessage(function(res) {
				var data = JSON.parse(res.data);
				switch (data.msgType) {
					case 'bgWhiteListMsg':
						// 白名单信息变化
						that.getBgWhiteListByUser();
						break;
				}
			});
		}
	};
</script>
<style lang="stylus">
	.top{
		padding-bottom: 100rpx;
	}
	.xieyi{
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		position: fixed;
		bottom: 0;
		left: 0;
		font-size: 20rpx;
		font-weight: bold;
		color: #BFBFBF;
		text-align: center;
		// padding-bottom: 30rpx;
		z-index 1000
		border-top: 2rpx solid #EEEEEE;
		.addcar_arrow{
			width: 10rpx;
			height: 10rpx;
			border-top: 2rpx solid #BFBFBF;
			border-right: 2rpx solid #BFBFBF;
			transform: rotate(45deg);
		}
	}
	.scrollBox
		width: 100%;
		// height: 396rpx;
		overflow hidden
		line-height: 100rpx;
		// position: fixed;
		// bottom: 100rpx;
		// left: 0;
		background #FFFFFF
		z-index 100
		
		box-sizing: border-box;	
		text-align center
		.arrowBottom,.arrowTop 
			// position: absolute;
			// right: 50%;
			// top: 0;
			// transform: translateX(50%);
			margin 0 auto 40rpx
			width: 0;
			height: 0;
			border-left: 8rpx solid transparent;
			border-right: 8rpx solid transparent;
		.arrowBottom
			border-top: 8rpx solid transparent;
			border-bottom: 8rpx solid #D1D3D7;
		.arrowTop
			border-bottom: 8rpx solid transparent;
			border-top: 8rpx solid #D1D3D7;
		.fst
			width: 100%;
			flex-wrap: wrap;
			.icon1
				width 88rpx!important
				margin-right 68rpx
				margin-bottom 40rpx
				&:nth-child(3n+0){
					margin-right 0
				}
				.iconImg
					width 88rpx!important
					height 88rpx!important
					border-radius 50%
					margin-bottom 14rpx
				.text
					height: 28rpx;
					line-height 28rpx
					font-size: 20rpx;
					font-weight: bold;
					color: #D1D3D7;

		
	.avatar
		height 100rpx
	.user_avatar
		width 100rpx
		height 100rpx
		border-radius 50%
	.memberBg
		width 400rpx
		height 128rpx
		margin-top 44rpx
		margin-bottom 20rpx
		image
			width 400rpx
			height 128rpx
	.name
		color #313131
	.icon
		width 30rpx
		height 30rpx
		background-size cover
	.credit
		width 176rpx
		height 40rpx
		line-height 40rpx
		border-radius 20rpx
	.credit2
		width 140rpx
		height 40rpx
		line-height 40rpx
		border-radius 20rpx
	.border
		border-bottom 2rpx solid #EFF4F8
	.footer
		position fixed
		bottom 0
		width 100%
		height 140rpx
	.icon-Dog
		width 24rpx
		height 24rpx
	.bgcolor-J
		background-color rgb(255, 194, 24)
	.bgcolor-R
		background-color #f33535
	.bgcolor-9
		background-color #999999
	.okgetUserInfo
		width 100%
		height 100%
		border none
		background-color rgb(255, 255, 255, 0)
	button::after
		border none
	.activate
		display flex
		flex-direction row-reverse
	.activateBtn
		height 106rpx
		width 215rpx
		background-image url('~@/assets/activate_bg.png')
		background-size cover
		background-position center center
</style>

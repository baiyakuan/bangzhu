<template>
	<div :class="[memberuserInfo.isplusmember == 0 ? 'bg bgw' : '']" style="height: 100%;">
		<div style="padding-bottom: 100rpx;">
		<div class="ft50 ftweight pdt20 pd40-x bgw">{{ memberuserInfo.isplusmember == 1 ? 'PLUS会员中心' : '会员中心' }}</div>
		<div class="bgw pd40-x pdt50">
			<div class="membercard pd40">
				<div style="align-items: flex-end;" class="fst" :class="[memberuserInfo.isplusmember != 1 ? 'gold-t' : memberuserInfo.plusmember?' gold-t':' gray-t']">
					<view class="ft34  ftweight"  style="line-height: 34rpx;">PLUS会员</view>
					<view class="pdl20 ft20"  style="line-height: 20rpx;" v-if="memberuserInfo.isplusmember == 1 && memberuserInfo.isLifetime == 0">{{ memberuserInfo.duetime }} 到期</view>
					<view class="pdl20 ft20"  style="line-height: 20rpx;" v-if="memberuserInfo.isplusmember == 1 && memberuserInfo.isLifetime == 1">终身会员</view>
				</div>
				<div class="ft24 mgt30 ftweight" :class="[memberuserInfo.isplusmember != 1 ? 'gold-t' : memberuserInfo.plusmember ?' gold-t':' gray-t']">帮驻·智慧停车PLUS会员</div>
				<div class="mgt130 fs">
					<div v-if="memberuserInfo.isplusmember == 1"><button class="memberbtn ft24 gold-t ftweight" @click="purchase">立即续费</button></div>
					<div v-else><button class="memberbtn ft24 gold-t ftweight" @click="purchase">立即开通</button></div>
					<div class="ft24 gold-t mgt15" v-if="memberuserInfo.isplusmember == 1">NO.{{ memberuserInfo.plusCardNumber }}</div>
				</div>
			</div>
		</div>
		<div v-if="memberuserInfo.isplusmember == 1">
			<div class="fs bte bgw">
				<!-- 停车打折 -->
				<div class="left50 pdt50 pdl40 bgw fi bre pdb50" @click="percent">
					<img class="icon" :src="staticImg + 'static/img/member-01.png'" />
					<div class="pdl30">
						<div class="ft32 ftweight rgb27">停车打折</div>
						<div class="ft24 rgb27 pdt10 fst">
							共计节约：
							<view class="rgb198">¥{{ memberuserInfo.totalDiscount }}</view>
						</div>
					</div>
				</div>
				<!-- 购物省钱 -->
				<div class="left50 pdt50 pdl40 bgw fi pdb50" @click="shopingsave">
					<img class="icon" :src="staticImg + 'static/img/member-19.png'" />
					<div class="pdl30">
						<div class="ft32 ftweight rgb27">购物省钱</div>
						<div class="ft24 rgb27 pdt10 fst">
							累计节省：
							<view class="rgb198">¥{{ memberuserInfo.buyDiscount }}</view>
						</div>
					</div>
				</div>
			</div>
			<div class="fs bte bgw">
				<!-- 帮贝奖励 -->
				<div class="left50 pdt50 pdl40 bgw fi pdb50 bre" @click="doublebb">
					<img class="icon" :src="staticImg + 'static/img/member-02.png'" />
					<div class="pdl30">
						<div class="ft32 ftweight rgb27">帮贝奖励</div>
						<div class="ft24 rgb27 pdt10 fst">
							累计多得：
							<view class="rgb198">{{ memberuserInfo.totalIntegral }}</view>
						</div>
					</div>
				</div>
				<!-- 专属优惠券 -->
				<div class="left50 pdt50 pdl40 bgw fi pdb50" @click="pluscoupon">
					<img class="icon" :src="staticImg + 'static/img/member-03.png'" />
					<div class="pdl30">
						<div class="ft32 ftweight rgb27">专属优惠券</div>
						<div class="ft24 rgb27 pdt10 fst">
							<view>领取会员福利</view>
							<img class="icon-c mgl20" :src="staticImg + 'static/img/member-icon-c.png'" />
						</div>
					</div>
				</div>
			</div>
			<div class="fs bte bgw">
				<!-- 联名VIP -->
				<div class="left50 pdt50 pdl40 bgw fi pdb50 bre" @click="jointlyVip">
					<img class="icon" :src="staticImg + 'static/img/member-05.png'" />
					<div class="pdl30">
						<div class="ft32 ftweight rgb27">联名VIP</div>
						<div class="ft24 rgb27 pdt10 fst">
							<view>联名优质服务</view>
							<img class="icon-c mgl20" :src="staticImg + 'static/img/member-icon-c.png'" />
						</div>
					</div>
				</div>
				<!-- 七折购锁 -->
<!-- 				<div class="left50 pdt50 pdl40 bgw fi pdb50" @click="visible = true">
					<img class="icon" :src="staticImg + 'static/img/member-06.png'" />
					<div class="pdl30">
						<div class="ft32 ftweight rgb27">七折购锁</div>
						<div class="ft24 rgb27 pdt10 fst">
							<view>立即购买</view>
							<img class="icon-c mgl68" :src="staticImg + 'static/img/member-icon-c.png'" />
						</div>
					</div>
				</div> -->
				<!-- 私人客服 -->
				<div class="left50 pdt50 pdl40 bgw fi pdb50">
					 <img class="icon" :src="staticImg + 'static/img/member-04.png?t=1'"/>
					 <div class="pdl30">
						<div class="ft32 ftweight rgb27">专属客服</div>
						<div class="ft24 rgb27 pdt10 fst">
						  <view>7*24小时在线</view>
						  <!-- <img class="icon-c mgl20" :src="staticImg + 'static/img/member-icon-c.png'"/> -->
						</div>
					</div>
				</div> 
					   
			</div>
		</div>
		<div class="pd40 bgw mgt10" v-else>
			<div class="fs">
				<div class="ft34 ftweight">{{'PLUS会员专属特权'}}</div>
				<div class="ft24 fi" @click="morePrivilege">
					<view>更多特权</view>
					<div class="mgt10"><img class="icon-d mgl20" :src="staticImg + 'static/img/member-icon-d.png'" /></div>
				</div>
			</div>
			<div class="fs pdt50">
				<div class="fcy" @click="sale0">
					<img class="icon-b" :src="staticImg + 'static/img/member-11.png'" />
					<div class="ft28 mgt20">停车打折</div>
				</div>
				<div class="fcy" @click="save1">
					<img class="icon-b" :src="staticImg + 'static/img/member-20.png'" />
					<div class="ft28 mgt20">购物省钱</div>
				</div>
				<div class="fcy" @click="doublebb2">
					<img class="icon-b" :src="staticImg + 'static/img/member-12.png'" />
					<div class="ft28 mgt20">帮贝奖励</div>
				</div>
				<div class="fcy" @click="pluscoupon3">
					<img class="icon-b" :src="staticImg + 'static/img/member-13.png'" />
					<div class="ft28 mgt20">优惠券</div>
				</div>
			</div>
			<div class="fs pdt60">
				<div class="fcy" @click="benefits4">
					<img class="icon-b" :src="staticImg + 'static/img/member-14.png'" />
					<div class="ft28 mgt20">专属商品</div>
				</div>
				<div class="fcy" @click="birthday5">
					<img class="icon-b" :src="staticImg + 'static/img/member-15.png'" />
					<div class="ft28 mgt20">生日特权</div>
				</div>
				<div class="fcy" @click="namesvip6">
					<img class="icon-b" :src="staticImg + 'static/img/member-16.png'" />
					<div class="ft28 mgt20">联名VIP</div>
				</div>
				<div class="fcy" @click="privateservice7">
					<img class="icon-b" :src="staticImg + 'static/img/member-17.png?t=1'" />
					<div class="ft28 mgt20">专属客服</div>
				</div>
			</div>
		</div>
		</div>
		<div class="bgw purchase" @click="purchase">
			<div class="btn fcy ft34 white-t" v-if="memberuserInfo.isplusmember == 1">立即续费</div>
			<div class="btn fcy ft34 white-t" v-else>立即开通</div>
		</div>
		<Modal v-if="visible" ok-text="是" cancel-text="否" @ok="bindOk" @cancel="visible = false">
			<view class="pd40-y" style="color:#333333">请联系客服：{{ servicePhone }}</view>
		</Modal>
	</div>
</template>
<script>
import Modal from '@/components/Modal/index.vue';
import { memberinfo, getServicePhone } from '@/api';
export default {
	data() {
		return {
			memberuserInfo: {},
			visible: false,
			servicePhone: '',
			actions: [
				{
					name: '取消'
				},
				{
					name: '拨打 ',
					color: '#f44a3e'
				}
			],
			duetime: ''
		};
	},
	components: {
		Modal
	},
	computed:{
		staticImg() { return this.$store.state.staticImg } ,
	},
	// #ifdef MP-WEIXIN
	// 微信分享小程序给朋友
	onShareAppMessage() {
		return {
			title: '推荐一个好用的停车工具',
			path: '/pages/index/index'
		};
	},
	// #endif
	methods: {
		//点击2倍帮贝
		doublebb() {
			wx.navigateTo({
				url: `/personal/member/doublebb/index`
			});
		},
		//点击停车9折
		percent() {
			wx.navigateTo({
				url: `/personal/member/percent/index`
			});
		},
		//点击购物省钱
		shopingsave() {
			wx.navigateTo({
				url: `/personal/member/shopingsave/index`
			});
		},
		//点击福利券
		pluscoupon() {
			wx.navigateTo({
				url: `/personal/member/pluscoupon/index`
			});
		},
		//购买会员
		purchase() {
			if (this.memberuserInfo.isplusmember == 1 && this.memberuserInfo.isLifetime == 1) {
				//终身会员
				wx.showToast({
					title: '您已是终身会员,无需续费!',
					icon: 'none'
				});
			} else {
				//立即开通或立即续费
				wx.navigateTo({
					url: `/personal/member/purchase/index`
				});
			}
		},
		//联名VIP
		jointlyVip() {
			wx.navigateTo({
				url: `/personal/member/testJointlyVip/index`
			});
		},
		//会员特权
		morePrivilege() {
			wx.navigateTo({
				url: `/personal/member/privilege/index?page=0`
			});
		},
		//停车打折
		sale0() {
			wx.navigateTo({
				url: `/personal/member/privilege/index?page=0`
			});
		},
		//购物省钱
		save1() {
			wx.navigateTo({
				url: `/personal/member/privilege/index?page=1`
			});
		},
		//帮贝奖励
		doublebb2() {
			wx.navigateTo({
				url: `/personal/member/privilege/index?page=2`
			});
		},
		//福利券
		pluscoupon3() {
			wx.navigateTo({
				url: `/personal/member/privilege/index?page=3`
			});
		},
		//专享福利
		benefits4() {
			wx.navigateTo({
				url: `/personal/member/privilege/index?page=4`
			});
		},
		//生日礼包
		birthday5() {
			wx.navigateTo({
				url: `/personal/member/privilege/index?page=5`
			});
		},
		//联名VIP
		namesvip6() {
			wx.navigateTo({
				url: `/personal/member/privilege/index?page=6`
			});
		},
		//私人客服
		privateservice7(){
		  wx.navigateTo({
		    url: `/personal/member/privilege/index?page=7`
		  })
		},
		//七折购锁
		// buylock7() {
		// 	wx.navigateTo({
		// 		url: `/personal/member/privilege/index?page=7`
		// 	});
		// },
		//拨打客服
		bindOk() {
			wx.makePhoneCall({
				phoneNumber: this.servicePhone,
				success: () => {
					this.visible = false;
				}
			});
		},
		//会员详情
		async memberinfo() {
			let that = this;
			const { data } = await memberinfo();
			if (data.code == 1) {
				that.$store.commit('set_memberuserInfo', data.obj.userInfo);
				that.memberuserInfo = data.obj.userInfo;

				that.memberuserInfo.buyDiscount = (data.obj.userInfo.buyDiscount * 1).toFixed(2);
				that.memberuserInfo.totalDiscount = (data.obj.userInfo.totalDiscount * 1).toFixed(2);

				that.memberuserInfo.plusCardNumber = that.memberuserInfo.plusCardNumber.replace(/\s/g, '').replace(/(.{4})/g, '$1 ');
				that.memberuserInfo.duetime = that.memberuserInfo.duetime.replace(new RegExp('-', 'gm'), '.');
			}
		}
	},
	onShow() {
		let that = this;
		that.memberinfo();
		getServicePhone().then(res => {
			this.servicePhone = res.data.obj.sevicePhoneList[0].servcePhone;
		});
	}
};
</script>

<style lang="stylus">
page
	background-color #FFFFFF
	height 100%
.membercard
	// width 590rpx
	// height 290rpx
	background-image url('~@/assets/membercard.png')
	// background-image url('https://www.renren-bang.com/renrenbang/wxImg/PLUS.png') // 正式服务器
	// background-image url('https://test.renren-bang.com/benevolenceParking/file/downloadImg?path=/upload/default/PLUS.png') // 测试服务器
	background-size contain
	background-repeat no-repeat
.memberbtn
	width 220rpx
	height 50rpx
	line-height 45rpx
	background-color rgba(0, 0, 0, 0) !important
	border-radius 25rpx
	border-style solid
	border-width 1px
	border-color rgb(255, 228, 177)
.member
	position absolute
	left 0
	margin-top 130rpx
	margin-left 80rpx
.icon
	width 70rpx
	height 70rpx
.icon-c
	width 15rpx
	height 15rpx
.icon-d
	width 30rpx
	height 30rpx
.icon-b
	width 110rpx
	height 110rpx
.rgb198
	color rgb(198, 158, 104)
.rgb27
	color rgb(27, 25, 33)
.btn
	height 100rpx
	width 100%
	background-color #e7c78c
.content 
	padding-bottom 150rpx
.footer
	position fixed
	bottom 0rpx
	width 100%
.bg
	height 100vh
.purchase
	position fixed
	bottom 0
	left 0
	 width 100%
</style>

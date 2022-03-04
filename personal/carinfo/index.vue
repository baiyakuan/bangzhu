<template>
	<div>
		<div class="title pdl40 pdt60 pdb80"><div class="ft50 ftweight rgb51">我的车辆</div></div>
		<div class="fcy" v-if="!brandlist.length && dataLoaded">
			<img class="bg" :src="staticImg + 'static/img/nocar.png'" alt="" />
			<div class="ft28 rgb51">暂无车辆信息，去添加吧</div>
			<view class="toAdd ft30 tac" @click="nav2addCar">添加车辆</view>
			<!-- <navigator hover-class='none' class="toAdd ft30 tac" url="/personal/carinfo/add/index">添加车辆</navigator>  -->
		</div>
		<div v-if="brandlist.length">
			<div class="bar"></div>
			<div class="item" v-for="item in brandlist" :key="item.brandId">
				<div class="mgt60 pd40-x  ft28 ftweight rgb51 fs">
					<div class="fi">
						<div class="carIcon fcy"><image :src="staticImg + 'static/img/carNumber.png'" mode=""></image></div>
						<div class="rgb51 ft36 ftweight">{{ item.brandNumberText1 }} {{ item.brandNumberText2 }}</div>
					</div>
					<div class="fi">
						<!-- #ifdef MP-WEIXIN -->
						<div class="fst" @click="toNoFeelPay(item)">
							<text class="rgb51 ft24 ftweight mgr20">无感支付</text>
							<uni-icons type="arrowright" size="30" class="mgt4 arrowRight"></uni-icons>
						</div>
						<!-- #endif -->
						<!-- #ifdef MP-ALIPAY -->
						<evan-switch :value="item.noFeelingToPay ? true : false" size="30" inactive-color="#EFF4F8" active-color="#F33535" @aaa="aaa(item)"></evan-switch>
						<!-- #endif -->
					</div>
				</div>
				<div class="pd40-x mgt50 mgb30 fs">
					<div class="fst" @click="defualt(item)">
						<img class="icon" :src="staticImg + 'static/img/withdrawalSuccess.png'" v-if="item.isDefault" alt="" />
						<img class="icon" :src="staticImg + 'static/img/uncheck.png'" v-else alt="" />
						<div class="ft24 mgl20">默认车牌</div>
					</div>
					<div class="fst">
						<!-- <navigator class="rgb74 ft24" hover-class='none' :url="'/personal/carinfo/add/index?brandId=' + item.brandId +  '&isDefault=' + item.isDefault ">编辑</navigator> -->
						<div class="rgb74 mgl40 ft24" @click="onOk(item)">解绑</div>
					</div>
				</div>
				<div class="line"></div>
			</div>
			<div class="zhan"></div>
			<div class="btn-box">
				<!-- <navigator hover-class='none' url="/personal/carinfo/add/index" class="btn ft30 ftweight tac">新增车辆</navigator> -->
				<view class="btn ft30 ftweight tac" @click="nav2addCar">新增车辆</view>
			</div>
		</div>
		<Modal v-if="visible" ok-css="color:#f73c3c;font-size:30rpx;font-weight:bold;" ok-text="是" cancel-text="否" @ok="delBrandById" @cancel="visible = false">
			<view class="pd40-y">是否解绑此车牌号?</view>
		</Modal>
		<Modal v-if="closeVisible" ok-css="color:#f73c3c;font-size:30rpx;font-weight:bold;" ok-text="确定" cancel-text="取消" @ok="ddd" @cancel="ccc">
			<image :src="staticImg + 'static/img/withdrawFail.png'" style="width: 120rpx;height: 120rpx;" class="mgt60"></image>
			<view class="ft34 rgb51 ftweight pdt60">系统提示</view>
			<view class="pd30-y pd40-x ft28 rgb74" style="line-height: 60rpx;width: 504rpx; text-align: center;">您是否确定关闭帮驻智停无感支付服务?</view>
		</Modal>

		<Modal v-if="openVisible" ok-css="color:#f73c3c;font-size:30rpx;font-weight:bold;" ok-text="我已阅读并开通" cancel-text="再考虑下" @ok="bbb" @cancel="ccc">
			<view class="ft34 rgb51 ftweight pdt60">帮驻智停无感支付说明</view>
			<view class="pd30-y pd40-x ft28 rgb74" style="line-height: 60rpx;width: 540rpx;">
				<p style="text-indent: 60rpx;text-align:justify">
					当您开启无感支付功能,并且账户有足够余额时,车辆在进出支持无感支付的停车场,可自动完成车辆的支付和出场,全程无需您的各类操作。
				</p>
				<p style="text-indent: 60rpx;text-align:justify">
					无感支付功能依赖道闸一体机的摄像头识别车牌,会有极少数识别错误的情况,如对无感支付订单有疑意,可拨打客服电话反馈及投诉。
				</p>
			</view>
		</Modal>
		<Modal v-if="maxVisible" ok-css="color:#f73c3c;font-size:30rpx;font-weight:bold;" :show-cancel="false" ok-text="确定" @ok="maxVisible = false">
			<view class="img-box mgt80"><img class="failTips" :src="staticImg + 'static/img/failTips.png'" alt="" /></view>
			<view class="mgt30 ft28 ftweight rgb51">我也是有限度的</view>
			<view class="mgt20 rgb153 ft24 ftweight mgb30">添加已满,请解绑后重试</view>
		</Modal>
		<login-modal ref='login' @loginCallBack="getBrandList" navigateState='1'></login-modal>
	</div>
</template>

<script>
import Modal from '@/components/Modal/index.vue';
import loginModal from '@/components/loginModal/loginModal.vue'
import EvanSwitch from '@/components/evan-switch/evan-switch.vue';
import { get } from '@/utils/miniLodash';
import { getOpenId, getWxNoFeelPayGuideInfo, getBrandList, delBrand, updateBrand, getBrandInfo, setNoFeelingToPay } from '@/api';
import store from '@/store';

export default {
	components: {
		Modal,
		EvanSwitch,
		loginModal
	},
	data() {
		return {
			brandlist: [],
			brandInfo: {},
			visible: false,
			closeVisible: false,
			openVisible: false,
			isopen: true,
			dataLoaded: false,
			brandId: '',
			openid: '', // 微信用户ID
			maxVisible: false //最大限度弹窗可见性
		};
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
	
	onLoad() {
		if (!this.isLogin) {
			this.$refs.login.getUserInfoStep();
		}
	},
	
	async onShow() {
		const that = this;
		// 车辆列表
		await this.getBrandList();
	},
	computed:{
		staticImg() { return this.$store.state.staticImg } ,
		isLogin() { return Object.keys(get(this.$store.state, 'userInfo', {})).length > 0; }
	},
	methods: {
		// 导航去新增车辆
		nav2addCar() {
			if (this.brandlist.length >= 3) {
				this.maxVisible = true;
			} else if (this.brandlist.length == 0) {
				uni.navigateTo({
					url: '/personal/carinfo/add/index?back=back'
				});
			} else {
				uni.navigateTo({
					url: '/personal/carinfo/add/index?back=back&noFirst=noFirst'
				});
			}
		},
		// 车辆列表
		async getBrandList() {
			this.dataLoaded = false
			const { data } = await getBrandList({ istrue: true });
			this.dataLoaded = true
			if (data.code == '1') {
				var list = data.obj.brandList.forEach(item => {
					item.brandNumber = item.brandNumber;

					item.brandNumberText1 = item.brandNumber.slice(0, 2);
					item.brandNumberText2 = item.brandNumber.slice(2);
				});
				var sortFun = function(isDefault) {
					return function(obj1, obj2) {
						var value1 = obj1[isDefault];
						var value2 = obj2[isDefault];
						if (value1 > value2) {
							return -1;
						} else if (value1 < value2) {
							return 1;
						} else {
							return 0;
						}
					};
				};
				this.brandlist = data.obj.brandList.sort(sortFun('isDefault'));
			}
		},
		// 获取车牌详情
		async getBrandInfo(brandId) {
			const { data } = await getBrandInfo({
				brandId: brandId,
				istrue: true
			});
			if (data.code == '1') {
				this.brandInfo = data.obj.brand;
				delete this.brandInfo['brandType'];
			}
		},
		// 设为默认
		async defualt(item) {
			var that = this;
			if (item.isDefault == 1) {
				// item.isDefault = 0
				uni.showToast({
					title: '您需默认一个车辆',
					icon: 'none'
				});
				return;
			} else {
				item.isDefault = 1;
			}
			await that.getBrandInfo(item.brandId);
			const { data } = await updateBrand({ ...that.brandInfo, isDefault: item.isDefault, istrue: true });
			if (data.code == '1') {
				await that.getBrandList();
				uni.showToast({
					title: '设置成功',
					icon: 'none'
				});
			}
		},
		// 是否删除
		onOk(item) {
			this.visible = true;
			this.brandId = item.brandId;
		},
		// 确认删除
		async delBrandById() {
			const { data } = await delBrand({
				brandId: this.brandId
			});
			if (data.code == '1') {
				uni.showToast({
					title: '解绑成功',
					icon: 'none'
				});
				this.getBrandList();
			} else {
				uni.showToast({
					title: data.msg,
					icon: 'none'
				});
			}
			this.visible = false;
		},
		// 跳转无感支付开通
		toNoFeelPay(item) {
			// var brandDetail = JSON.stringify(item)
			uni.navigateTo({
				url: `/personal/carinfo/noFeelPay/index?brandId=${item.brandId}&brandNumber=${item.brandNumber}`
			});
		},
		aaa(item) {
			this.brandId = item.brandId;
			this.brandNumber = item.brandNumber;
			if (item.noFeelingToPay) {
				this.closeVisible = true;
			} else {
				this.openVisible = true;
			}
		},
		async bbb() {
			this.openVisible = false;
			const { data } = await setNoFeelingToPay({
				brandId: this.brandId,
				status: 1,
				type: 1
			});
			if (data.code == 1) {
				await this.getBrandList();
				uni.showToast({
					title: '开启成功',
					icon: 'none'
				});
			}
		},
		async ddd() {
			this.closeVisible = false;
			const { data } = await setNoFeelingToPay({
				brandId: this.brandId,
				status: 0,
				type: 1
			});
			if (data.code == 1) {
				uni.showToast({
					title: '关闭成功',
					icon: 'none'
				});
				this.getBrandList();
			}
		},
		ccc() {
			this.closeVisible = false;
			this.openVisible = false;
		}
	}
};
</script>

<style lang="stylus">
page
	background-color #fff
.title
	/* box-shadow:0 0 20rpx 0 rgba(27,25,33,0.2) */
.bg
	width 323rpx
	height 203rpx
	margin 270rpx 0 50rpx
.toAdd
	width 320rpx
	height 80rpx
	line-height 80rpx
	border 1px solid #f33535
	border-radius 10rpx
	margin 50rpx auto
	color #f33535
	font-weight 500
.icon
	width 32rpx
	height 32rpx
.line
	width 750rpx
	height 16rpx
	background #f6f8fb
.btn-box
	width 750rpx
	height 150rpx
	background #fff
	position fixed
	bottom 0
.btn
	width 670rpx
	height 100rpx
	line-height 100rpx
	background #f33535
	border-radius 10px
	margin 0 auto
	color #fff
.zhan
	width 750rpx
	height 150rpx
	background #fff
.carIcon
	width 76rpx
	height 76rpx
	border-radius 50%
	margin-right 36rpx
	background rgba(246, 248, 251, 1)
	image
		width 48rpx
		height 32rpx
		background-size 100%
.switch
	transform scale(0.6)
	margin-right -30rpx
.img-box:after
	display block
	content ''
	clear both
.failTips
	float left
	width 80rpx
	height 80rpx
	transform translate(-50%, 0)
	margin-left 50%
</style>

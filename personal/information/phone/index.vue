<template>
	<div>
		<div class="conatainer fcx" style="padding-top:140rpx">
			<div class="login_b">
				<div class="form_item">
					<img class="iconp pdl20" :src="staticImg + 'static/img/phone.png'" />
					<input @input="input" placeholder-class="gray" class="d_input pdl75 pdb10" v-model="form.phone" type="number" maxlength="11" placeholder="请输入手机号" />
				</div>
				<div class="form_item">
					<img class="iconp pdl20" :src="staticImg + 'static/img/imgcode.png'" />
					<div><input placeholder-class="gray" class="d_input pdl75 pdb10" v-model="vCode" type="number" maxlength="4" placeholder="请输入图形验证码" /></div>
					<div><img :src="imgsrc" alt="" class="img_code" @click="shiftvCode" /></div>
				</div>
				<div class="form_item">
					<img class="iconp pdl20" :src="staticImg + 'static/img/password.png'" />
					<div><input placeholder-class="gray" class="d_input pdl75 pdb10" v-model="form.messageCode" type="number" maxlength="4" placeholder="请输入验证码" /></div>
					<div><Dcutdown className="cutdown" :disabled="disabled" :phone="form.phone" :vCode="vCode"></Dcutdown></div>
				</div>
				<div class="fcy" v-if="form.messageCode.length > 4 || form.messageCode.length == 4">
					<button class="bindbtn" type="gradient" @click="onClick" :loading="loading">确认登录</button>
					<div class="agreement">
						<text class="gray">已阅读并同意</text>
						<text @click="personallaw" style="color:#f44a3e">《帮驻用户协议》</text>
					</div>
				</div>
				<div class="fcy" v-if="form.messageCode.length < 4">
					<button class="bindbtnb" type="gradient" :loading="loading">确认登录</button>
					<div class="agreement">
						<text class="gray">已阅读并同意</text>
						<text @click="personallaw" style="color:#f44a3e">《帮驻用户协议》</text>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Dcutdown from '@/components/CutDown';
import { validatePhone } from '@/utils/validate';
import { getImgCode } from '@/api';
import store from '@/store';
export default {
	components: {
		Dcutdown
	},
	data() {
		return {
			form: {
				phone: '',
				messageCode: '',
				regId: '',
				appType: '3',
				inviteCode: ''
			},
			vCode: '',
			loading: false,
			imgsrc: 'http://k8s.zhongbanglaixi.com/benevolenceParking/file/downloadValidateCodeImg?phone=1',
			navigateState: ''
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
	methods: {
		//用户协议
		personallaw() {
			wx.navigateTo({
				url: '/personal/law/index?type=2'
			});
		},
		// 验证手机号，获取图形验证码
		async input() {
			if (validatePhone(this.form.phone)) {
				var num = Math.ceil(Math.random() * 10); //生成一个随机数（防止缓存）
				this.imgsrc = store.state.BASE_URL + '/file/downloadValidateCodeImg?phone=' + this.form.phone + '&t=' + num;
			}
		},
		async shiftvCode() {
			if (validatePhone(this.form.phone)) {
				var num = Math.ceil(Math.random() * 10); //生成一个随机数（防止缓存）
				this.imgsrc = store.state.BASE_URL + '/file/downloadValidateCodeImg?phone=' + this.form.phone + '&t=' + num;
			}
		},
		async onClick() {
			const res = await store.dispatch('userLogin', this.form);
			if (res.code == '1') {
				if (this.navigateState == 1) {
					uni.navigateBack({
						delta: 1
					})
				} else {
					wx.reLaunch({
						url: '/pages/index/index'
					});
				}
				store.dispatch('wallet');
				setTimeout(() => {
					store.state.userModule.loginCallback && store.state.userModule.loginCallback()
					store.commit('userModule/resetLoginCallback')
				}, 100)
			}
		}
	},
	computed: {
		// 是否可以发送验证码
		disabled() {
			return this.vCode.length !== 4 || !validatePhone(this.form.phone);
		},
		staticImg() { return store.state.staticImg } ,
	},
	onLoad(options) { this.navigateState = options.navigateState },
	onShow() {}
};
</script>

<style lang="stylus">
/* @import '../../../styles/color.scss' */

page
	background-color #fff
	width 100%
	height 100%
.cutdown
	position absolute
	text-align center
	width 100rpx
	right 20rpx
	margin-top -40rpx
	left 400rpx
.form_code
	margin-right 200rpx
.form_item
	display flex
	align-items center
	margin-bottom 80rpx
	position relative
	font-size 28rpx
	color #999
	border-bottom thin solid #e5e5e5
	// padding: 12rpx 24rpx
	// border-radius: 50px
	// background-color #f5f5f5
	input
		font-size 28rpx
		color #666666
.conatainer
	width 100%
	height 100%
	background-size 100%
	background-repeat no-repeat
	position relative
	overflow hidden
.bindbtn
	width 600rpx
	height 88rpx
	line-height 88rpx
	font-size 32rpx
	color white
	border-radius 10rpx
	background-color rgb(74, 83, 97) !important
	// background -webkit-gradient(linear, left top, left bottom, from(#f87c73), to(#f44a3e));
.bindbtnb
	width 600rpx
	height 88rpx
	line-height 88rpx
	font-size 32rpx
	color white
	border-radius 10rpx
	background-color rgb(213, 213, 213) !important
.agreement
	margin-top 40rpx
.phcolor
	color #cccccc
.login_b
	background #ffffff
	width 600rpx
	border-radius 16rpx
	box-sizing border-box
.iconp
	position absolute
	margin-top -5rpx
	width 40rpx
	height 40rpx
.img_code
	width 200rpx
	height 60rpx
	// background #eee
	margin-left 20rpx
</style>

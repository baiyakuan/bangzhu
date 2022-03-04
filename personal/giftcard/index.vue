<template>
	<div class="bgw page">
		<div class="pd50-x pdt20 rgb16 ft34 title">激活尊享卡</div>
		<div class="pd50-x mg40-y">
			<input type="text" placeholder="请输入激活码" class="pd20-y pdl30 input" 
				v-model="activateCode" placeholder-class="ft26 rgb192"/>
		</div>
		<div class="pd50-x mgb70"><div class=" ftw ft32  btn" @click="actRefillCard">点击激活</div></div>
		<div class="mg50-x pd50 explain">
			<div class="mgb35 rgb231 ft30 explain_top">说明</div>
			<div class="list">
				<ul class="rgb85">
					<li class="mgb30">1.此卡激活码只可激活一次，重复激活无效</li>
					<li class="mgb30">2.此卡帮品消费金只可在帮品店消费，不可提现</li>
					<li class="mgb30">3.权益在卡片激活后立即生效</li>
				</ul>
			</div>
		</div>
		<div class="pf" style="background:rgba(0,0,0,0.6);z-index:11;" v-if="dialogShow">
			<div class="dialog  bgw fcy" v-if="status == 'success'">
				<img :src="staticImg + 'static/img/activatesuccess.png'" style="width:107rpx;height:84rpx;" />
				<div class="mgt40 rgb16">恭喜你，激活成功</div>
			</div>
			<div class="dialog  bgw fcy" v-if="status == 'fail'">
				<img :src="staticImg + 'static/img/activatefail.png'" style="width:107rpx;height:84rpx;" />
				<div class="mgt40 rgb16">{{ failText }}</div>
			</div>
		</div>
		<toastes :visibile="toastVisibile">{{ msg }}</toastes>
	</div>
</template>

<script>
import { actRefillCard } from '@/api';
import store from '@/store';
export default {
	data() {
		return {
			activateCode: '', //输入的内容
			dialogShow: false, //弹窗可见性
			status: '', //提交结果
			failText: '',
			toastVisibile: false,
			msg: '',
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
	computed:{
		staticImg() { return this.$store.state.staticImg } ,
	},
	// #endif
	onShow() {
		this.activateCode = '';
		this.dialogShow = false;
		this.status = '';
	},
	methods: {
		//激活二维码
		async actRefillCard() {
			var that = this;
			if (that.activateCode) {
				const { data } = await actRefillCard({
					recActCode: that.activateCode,
					istrue: true
				});
				if (data.code == 1) {
					if (data.obj.code == 0) {
						//激活成功
						wx.showToast({
							title: '恭喜你，激活成功',
							icon: 'none'
						});
						setTimeout(function() {
							wx.navigateTo({
								url: '/personal/wallet/index'
							});
						}, 2000);
					} else if (data.obj.code == 1) {
						//激活已激活，请不要重复激活
						wx.showToast({
							title: '您的激活码已激活，重复激活无效',
							icon: 'none'
						});
					} else if (data.obj.code == 2) {
						//激活码不存在
						wx.showToast({
							title: '激活码错误',
							icon: 'none'
						});
					} else {
						wx.showToast({
							title: '激活错误',
							icon: 'none'
						});
					}
				} else {
					this.toastVisibile = true;
					this.msg = data.msg;
					setTimeout(() => {
						this.toastVisibile = false;
						this.msg = '';
					}, 1000);
				}
			} else {
				wx.showToast({
					title: '请输入激活码',
					icon: 'none'
				});
			}
		}
	},
}
</script>

<style lang="stylus">
.page
	position absolute
	width 100%
	height 100%
.input
	width 100%
	height 92rpx
	box-sizing border-box
	border 1rpx solid rgb(226, 226, 226)
	border-radius 10rpx
.btn
	width 100%
	height 80rpx
	line-height 80rpx
	background-size cover
	background-position center center
	background-image url('~@/assets/activate_btn.png')
	text-align center
.explain_top
	width 185rpx
	height 21rpx
	margin 0 auto 35rpx
	line-height 21rpx
	background-size cover
	background-position center center
	background-image url('~@/assets/activate_title.png')
	text-align center
.explain
	background-size 100% 100%
	background-position center center
	background-image url('~@/assets/activate_card.png')
	background-repeat no-repeat
.dialog
	width 560rpx
	height 290rpx
	position absolute
	top 50%
	left 50%
	transform translate(-50%, -80%)
	border-radius 10rpx
	box-sizing border-box
</style>

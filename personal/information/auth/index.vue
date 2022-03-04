<template>
	<div>
		<div class="title  pdt60 ">
			<div class="ft50 ftweight rgb51 pdl40">实名认证</div>
			<div class="secondTitle ft24 gray-a mgt20 pdb20 pdl40">
				<p>为了保障你和其他用户更好的体验</p>
				<p>需要您完成实名认证</p>
			</div>
			<div class="bar"></div>
		</div>

		<div v-if="!isValidation">
			<div class="pd40-x mgt80 mgb100">
				<div class="name fst">
					<div class="word ft28 rgb119">姓名&emsp;&emsp;&emsp;</div>
					<input
						class="ft30 ftweight rgb51"
						:disabled="disabled"
						v-model="form.realName"
						type="text"
						maxlength="20"
						placeholder-class="ft24 ftnormal grat-a"
						placeholder-style="color: #aaa"
						placeholder="请输入您的真实姓名"
					/>
				</div>
				<div class="idCard fst mgt70">
					<div class="word ft28 rgb119">身份证号码</div>
					<input
						class="ft30 ftweight rgb51"
						:disabled="disabled"
						v-model="form.IDCard"
						type="idcard"
						maxlength="18"
						placeholder-class="ft24 ftnormal grat-a"
						placeholder-style="color: #aaa"
						placeholder="请输入您的身份证号码"
					/>
				</div>
			</div>
			<div class="btn ft30 ftweight" @click="onClick" :loading="loading">提交</div>
			<!-- <div class="footer tac mgt20">
				<text class="ft24 rgb119">无中国身份证或实名认证失败请点击</text>
				<text class="ft24 ftweight rgb243 underline" @click="manual">手动认证</text>
			</div> -->
		</div>

		<div v-if="isValidation" class="fcy pdt300">
			<img :src="staticImg + 'static/img/authentication-pair.png'" alt="" style="width:100rpx;height:100rpx;" />
			<div class="ft32 mgt20">已实名认证</div>
			<div class="ft28 mgt110">{{ form.realName }}</div>
			<div class="ft26 mgt60">
				<text>{{ showIDcard }}</text>
				<img :src="staticImg + 'static/img/authentication-img.png'" alt="" style="width:21rpx;height:21rpx;padding-left:8rpx" />
			</div>
		</div>
	</div>
</template>

<script>
import { validateIdCard } from '@/utils/validate';
import { validation, getUsersidCard } from '@/api';
import store from '@/store';
export default {
	data() {
		return {
			form: {
				realName: '',
				IDCard: ''
			},
			loading: false,
			modalVisible: false,
			disabled: false,
			showIDcard: []
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
		// 身份认证
		async onClick() {
			if (!this.isValid.ok) {
				wx.showToast({
					title: this.isValid.msg,
					icon: 'none'
				});
				return;
			}
			this.loading = true;
			const { data } = await validation(this.form);
			var a = data.msg;
			this.loading = false;
			if (data.code === '1') {
				store.dispatch('getUsersInfo');
				wx.showToast({
					title: '实名认证成功'
				});
				setTimeout(() => {
					wx.navigateBack({
						delta: 1
					});
				}, 1200);
			} else {
				if (data.msg) {
					wx.showmodal({
						title: data.msg
					});
				} else {
					wx.showToast({
						title: '用户姓名和身份证号码不匹配'
					});
				}	
			}
		},
		// 表单字段转中文
		en2cn(k) {
			let char = '';
			switch (k) {
				case 'realName':
					char = '姓名';
					break;
				case 'IDCard':
					char = '身份证号码';
					break;
				default:
					break;
			}
			return char;
		},
		// 获取身份证信息
		async getUsersidCard() {
			const { data } = await getUsersidCard();
			if (data.code == '1') {
				this.disabled = true;
				this.form.realName = data.obj.realName;
				this.form.IDCard = data.obj.idCard;
				this.showIDcard = data.obj.idCard.substring(0, 3) + '************' + data.obj.idCard.substring(15);
			}
		},
		//实名认证成功
		ok() {
			this.modalVisible = false;
			wx.navigateBack({
				delta: 1
			});
		}
	},
	computed: {
		isValid() {
			for (let k in this.form) {
				if (!this.form[k]) {
					return { msg: `${this.en2cn(k)}不能为空`, ok: false };
				}
			}
			if (!validateIdCard(this.form.IDCard)) {
				return { msg: '请输入正确的身份证号码', ok: false };
			}
			return { msg: 'ok', ok: true };
		},
		isValidation() {
			return store.state.userInfo.isValidation;
		},
		staticImg() { return store.state.staticImg } ,
	},
	onShow() {
		if (this.isValidation) {
			this.getUsersidCard();
		}
	}
};
</script>

<style lang="stylus">
@import '../../../styles/color.styl'

page
	background-color #fff
	width 100%
	height 100%
.title
	/* box-shadow:0 0 20rpx 0 rgba(27,25,33,0.2) */
.word
	width 180rpx
.btn
	width 670rpx
	height 100rpx
	line-height 100rpx
	background #fe3535
	border-radius 10px
	color #ffffff
	margin 100rpx auto 0
	text-align center
</style>

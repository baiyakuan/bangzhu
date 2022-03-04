<template>
	<div class="page">
		<div class="title pdl40 pdt60 pdb100 ft50 ftweight rgb51">添加银行卡</div>
		<div class="bar"></div>
		<div class="pd40-x mgt60">
			<div class="form_item mgt30">
				<view class="rgb119 ft24 mgb20">姓名</view>
				<input class="bte6 rgb51 ft28 pdb14" autofocus placeholder-class="ftnormal ft22 gray-a" placeholder="请输入真实姓名" :disabled="true" v-model="form.realName" />
			</div>
			<div class="form_item mgt30">
				<view class="rgb119 ft24 mgb20">身份证</view>
				<input
					class="bte6 rgb51 ft28 pdb14"
					type="idcard"
					v-model="form.identityID"
					:disabled="true"
					maxlength="18"
					placeholder-class="ftnormal ft22 gray-a"
					placeholder="请输入身份证号码"
				/>
			</div>
			<div class="form_item mgt30">
				<view class="rgb119 ft24 mgb20">银行卡卡号</view>
				<input class="bte6 rgb51 ft28 pdb14" type="number" maxlength="19" v-model="form.bankNumber" placeholder-class="ftnormal ft22 gray-a" placeholder="请输入银行卡号" />
			</div>
			<div class="form_item mgt30">
				<view class="rgb119 ft24 mgb20">所属银行</view>
				<input class="bte6 rgb51 ft28 pdb14" type="text" maxlength="20" v-model="form.bankName" placeholder-class="ftnormal ft22 gray-a" placeholder="请输入所属银行" />
			</div>
			<div class="form_item mgt30">
				<view class="rgb119 ft24 mgb20">所属支行</view>
				<input class="bte6 rgb51 ft28 pdb14" type="text" maxlength="20" v-model="form.branchName" placeholder-class="ftnormal ft22 gray-a" placeholder="请输入所属支行" />
			</div>
		</div>

		<div class="footer mg40-x mgt200 ft30 pd40-y ftw tac" @click="addBank">添加</div>
		<div class="fc protocol-box mgb60">
			<view>提交即视为同意</view>
			<!-- <a class="protocol-link" href="/personal/law/index?type=2">“用户授权服务协议”</a> -->
			<text class="protocol-link" @click="tolaw">“用户授权服务协议”</text>
		</div>
		<div>
			<Modal v-if="modalVisible" ok-css="color:#f73c3c;font-size:30rpx;font-weight:bold;" :show-cancel="false" ok-text="好的" @ok="modalVisible = false">
				<view class="img-box mgt80"><img class="failTips" :src="staticImg + 'static/img/failTips.png'" alt="" /></view>
				<view class="mgt30 ft28 ftweight rgb51">添加失败</view>
				<view class="mgt20 $gray-t ft24 ftweight mgb30">卡号有误，请输入正确的号码</view>
			</Modal>
			<!-- <i-modal
        :visible="modalVisible"
        cancel-text="好的"
        :show-ok="false"
        cancel-text-style="color:#f73c3c !important;font-size:30rpx;font-weight:bold;"
        @cancel="modalVisible = false">
          <view class="img-box mgt80">
            <img class="failTips" :src="staticImg + 'static/img/failTips.png'" alt="">
          </view>
          <view class="mgt30 ft28 ftweight rgb51">添加失败</view>
          <view class="mgt20 $gray-t ft24 ftweight mgb30">卡号有误，请输入正确的号码</view>
      </i-modal> -->
		</div>
		<div>
			<Modal v-if="visibleauth" ok-css="color:#f73c3c;font-size:30rpx;font-weight:bold;" :show-cancel="false" ok-text="确认" @ok="okauth">
				<view class="pd40-y">请实名认证</view>
			</Modal>
			<!-- <i-modal 
        :visible="visibleauth"
        :show-cancel="false"
        ok-text="确认"
        ok-text-style="color:#FA4242 !important;font-size:30rpx;font-weight:bold;"
        @ok="okauth">
        <view class="pd40-y">请实名认证</view>
      </i-modal> -->
		</div>
	</div>
</template>

<script>
import Modal from '@/components/Modal/index.vue';
import { addBank, getUsersInfo } from '@/api';
import { validatePhone, validateIdCard, validateEMoji } from '@/utils/validate';
export default {
	components: {
		Modal
	},
	data() {
		return {
			form: {
				realName: '',
				phoneNumber: '',
				identityID: '',
				bankNumber: '',
				bankName: '',
				branchName: ''
			},
			modalVisible: false,
			visibleauth: false, // 实名认证提示
			canTap: true
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
		bindChange(e) {
			let { value } = e.mp.detail;
			this.area = `${value[0]} ${value[1]} ${value[2]}`;
		},
		onChange(e) {
			let { current } = e.mp.detail;
			this.checked = current;
		},
		//获取身份信息
		async getUsersInfo() {
			var that = this;
			const { data } = await getUsersInfo({ istrue: true });
			if (data.code == '1') {
				if (data.obj.isValidation) {
					that.form.phoneNumber = data.obj.usersPhone;
					that.form.realName = data.obj.realName;
					that.form.identityID = data.obj.idCard;
				} else {
					that.visibleauth = true;
				}
			}
		},
		// 新增银行卡
		async addBank() {
			if (this.canTap) {
				this.canTap = false;
				setTimeout(() => {
					this.canTap = true;
				}, 3000);
				if (!this.isValid.ok) {
					wx.showToast({
						title: this.isValid.msg,
						icon: 'none'
					});
					return;
				}
				if (validateEMoji(this.form.bankName)) {
					wx.showToast({
						title: '银行名称不允许输入emoji',
						icon: 'none'
					});
					return;
				}
				if (validateEMoji(this.form.branchName)) {
					wx.showToast({
						title: '支行名称不允许输入emoji',
						icon: 'none'
					});
					return;
				}
				const { data } = await addBank({ ...this.form, istrue: true });
				if (data.code == '1') {
					wx.showToast({
						title: '新增成功',
						icon: 'none'
					});
					setTimeout(() => {
						wx.navigateBack({
							delta: 1
						});
					}, 1200);
				} else if (data.code == '-808') {
					//添加银行卡已超出10次
					wx.showToast({
						title: '今日添加已达上限，可明日添加!',
						icon: 'none'
					});
					setTimeout(() => {
						wx.navigateBack({
							delta: 1
						});
					}, 1200);
				} else {
					wx.showToast({
						title: data.msg,
						icon: 'none'
					});
				}
			}
		},
		//提示实名认证
		okauth() {
			wx.navigateTo({
				url: `/personal/information/auth/index`
			});
		},
		// 表单字段转中文
		en2cn(k) {
			let char = '';
			switch (k) {
				case 'realName':
					char = '姓名';
					break;
				case 'phoneNumber':
					char = '手机号';
					break;
				case 'identityID':
					char = '身份证号';
					break;
				case 'bankNumber':
					char = '银行卡号';
					break;
				case 'bankName':
					char = '所属银行';
					break;
				case 'branchName':
					char = '所属支行';
					break;
				default:
					break;
			}
			return char;
		},
		// 跳转授权服务协议
		tolaw() {
			uni.navigateTo({
				url: '/personal/law/index?type=2'
			});
		}
	},
	computed: {
		staticImg() { return this.$store.state.staticImg } ,
		isValid() {
			for (let k in this.form) {
				if (!this.form[k]) {
					return { msg: `${this.en2cn(k)}不能为空`, ok: false };
				}
			}
			if (!validatePhone(this.form.phoneNumber)) {
				console.log('this.form.phoneNumber=============================================' + this.form.phoneNumber);
				return { msg: '手机号码格式不正确', ok: false };
			}
			if (!validateIdCard(this.form.identityID)) {
				return { msg: '身份证号码格式不正确', ok: false };
			}
			return { msg: 'ok', ok: true };
		}
	},
	onShow() {
		this.form.bankNumber = '';
		this.form.bankName = '';
		this.form.branchName = '';
		this.getUsersInfo();
	}
};
</script>

<style scoped lang="stylus">
.page
	background #fff
	height 100%
.title
	/* box-shadow:0 0 20rpx 0 rgba(27,25,33,0.2); */
.form_item
	display flex
	flex-direction column
	justify-content flex-start
	align-items flex-start
	input
		font-weight bold
		width 100%
.ck
	display flex
	align-items center
.footer
	background #f33535
	border-radius 10rpx
.protocol-box
	margin-top 30rpx
	color #aaa
.protocol-link
	color #f33535
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

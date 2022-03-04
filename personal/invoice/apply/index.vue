<template>
	<div class="container">
		<div v-if="defaultInvoice" class="fi pd40-x bgw mgt20" @click="invoiceAddress">
			<div><img class="icon" :src="staticImg + 'static/img/icon_address.png'" /></div>
			<div style="width:100%">
				<div class="fs mgt30 mgl20">
					<div class="fi">
						<div class="ft30 ftweight">收货人:</div>
						<div class="mgl10 ft30 ftweight" style="width:250rpx;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">{{ defaultInvoice.contactName }}</div>
					</div>
					<div class="ft30 ftweight">{{ defaultInvoice.contactPhone }}</div>
				</div>
				<div class="gray mgb30 mgt30 mgl20" style="text-align: justify;">收货地址：{{ defaultInvoice.contactAddress }}</div>
			</div>
		</div>
		<div v-else class="fs bgw pd40-x mgt20 pd20-y" @click="invoiceAddress">
			<div class="fi">
				<div class="mgt10"><img class="icon" :src="staticImg + 'static/img/icon_address.png'" /></div>
				<div class="ft32 ftweight mgl20">请添加收货地址</div>
			</div>
			<div><img class="icon-more" :src="staticImg + 'static/img/icon_exchange_more.png'" /></div>
		</div>
		<div class="mgt20 bgw">
			<div class="fi pd30-y pd40-x btb">
				<label class="ft30 ftweight">主体类型</label>
				<radio-group class="fs" @change="radioChange">
					<label v-for="item in radioList" :key="item.name">
						<div class="fi mgl50 mgr30">
							<radio color="#f44a3e" :value="item.name" :checked="item.isActive" />
							<div class="mgl20">{{ item.name }}</div>
						</div>
					</label>
				</radio-group>
			</div>
			<div v-if="form.companyType == 2" class="fi pd30-y pd40-x btb">
				<div class="ft30 ftweight width180">名称</div>
				<div class="w75"><input placeholder="请输入名称" type="text" maxlength="50" v-model="form.companyName" /></div>
			</div>
			<div v-if="form.companyType == 1" class="fi pd30-y pd40-x btb">
				<div class="ft30 ftweight width180">企业名称</div>
				<div class="w75"><input placeholder="请输入企业名称" type="text" maxlength="50" v-model="form.companyName" /></div>
			</div>
			<div v-if="form.companyType == 1" class="fi pd30-y pd40-x btb">
				<div class="ft30 ftweight width180">税务号</div>
				<div class="w75"><input placeholder="请输入税务号" type="number" maxlength="50" v-model="form.taxNum" /></div>
			</div>
			<div class="fs pd30-y pd40-x btb">
				<div class="ft30 ftweight">开票金额</div>
				<div class="ft30 rgb243">{{ sum }}元</div>
			</div>
			<div class="fs pd30-y pd40-x">
				<div class="fi">
					<div class="ft30 ftweight">配送方式</div>
					<div class="gray ft28 pdl50">（开票金额满{{ content }}元包邮）</div>
				</div>
				<div class="gray ft28">{{ isFree ? '0元' : postage + '元' }}</div>
			</div>
		</div>
		<div class="footer bgw fs">
			<div class="fi pd40">
				<div class="ft50 ftweight">{{ isFree ? '0' : postage }}</div>
				<div class="ft30 mgl20 mgt15">元</div>
			</div>
			<div class="mg40"><button class="btn-b white-t ft30" @click="submit">申请开票</button></div>
		</div>
		<Pay :visible="payVisible" :amount="wallet.amount" :payamount="postage" @cancel="payVisible = false" @enterPay="pay"></Pay>
	</div>
</template>

<script>
import { getInvoiceList, addBill, getNewPortInfoDetails, payBill } from '@/api';
import { validateEMoji } from '@/utils/validate';
import store from '@/store';
export default {
	data() {
		return {
			payVisible: false,
			radioList: [{ name: '个人', isActive: true, type: 2 }, { name: '公司企业', isActive: false, type: 1 }],
			defaultInvoice: null,
			form: {
				orderId: '',
				invoiceId: '',
				companyName: '',
				companyType: 2,
				taxNum: ''
			},
			bill: {},
			sum: 0,
			isFree: false,
			postage: 0,
			content: 0,
			clickbtn: false // 确认支付按钮是否可点击,
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
		async getNewPortInfo() {
			const { data } = await getNewPortInfoDetails({
				newPortId: 'XY12345681'
			});
			if (data.code == 1) {
				this.postage = data.obj.postage;
				this.content = data.obj.newPort.content;
				if (this.sum) {
					if (Number(this.sum) >= Number(this.content)) {
						this.isFree = true;
					} else {
						this.isFree = false;
					}
				}
			}
		},

		// 支付
		async pay(payType) {
			let that = this;
			const { data } = await payBill({
				billId: that.bill.billId,
				payType: payType,
				istrue: true
			});
			if (data.code == '1') {
				// 余额支付
				if (payType == 'BALANCE') {
					wx.showToast({
						title: '申请成功，工作人员会尽快为您处理。',
						icon: 'none'
					});
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						});
					}, 1200);
				} else {
					// 微信支付宝支付
					let { appId, ...query } = data.obj;
					uni.requestPayment({
						...query,
						orderInfo: query.data,
						success: res => {
							// #ifdef MP-ALIPAY
							if (res.resultCode != 9000) {
								wx.showToast({
									title: '申请失败！',
									icon: 'none'
								});
								return;
							}
							// #endif
							uni.showToast({
								title: '申请成功，工作人员会尽快为您处理。',
								icon: 'none'
							});
							setTimeout(() => {
								ui.navigateBack({
									delta: 1
								});
							}, 1200);
						},
						fail: res => {
							wx.showToast({
								title: '申请失败！',
								icon: 'none'
							});
						}
					});
				}
			}
		},
		radioChange({ mp }) {
			let val = mp.detail.value;
			this.radioList = this.radioList.map(item => {
				if (item.name == val) {
					return {
						...item,
						isActive: true
					};
				} else {
					return {
						...item,
						isActive: false
					};
				}
			});
			this.form.companyType = this.radioList.filter(item => item.isActive)[0].type;
		},
		invoiceAddress() {
			wx.navigateTo({
				url: '/personal/invoice/index?select=1'
			});
		},
		// 申请
		async submit() {
			let that = this;
			if (!that.form.companyName && that.form.companyType == 1) {
				wx.showToast({
					title: '请输入企业名称',
					icon: 'none'
				});
				return false;
			} else if (!that.form.companyName) {
				wx.showToast({
					title: '请输入名称',
					icon: 'none'
				});
				return false;
			} else if (validateEMoji(this.form.companyName)) {
				wx.showToast({
					title: '名称不允许输入emoji',
					icon: 'none'
				});
				return false;
			}
			if (this.form.companyType == 1 && !this.form.taxNum) {
				wx.showToast({
					title: '请输入税务号',
					icon: 'none'
				});
				return false;
			}
			if (that.defaultInvoice == null) {
				wx.showToast({
					title: '请输入收票人地址',
					icon: 'none'
				});
				return false;
			}
			that.form.orderId = that.orderId;
			const { data } = await addBill({ ...that.form, istrue: true });
			if (data.code == 1) {
				that.bill = data.obj.bill;
				if (!data.obj.isPay) {
					wx.showToast({
						title: '申请成功，工作人员会尽快为您处理。',
						icon: 'none'
					});
					setTimeout(function() {
						wx.navigateBack({
							delta: 1
						});
					}, 1200);
				} else {
					that.payVisible = true;
				}
			}
		},
		//获取发票地址
		async invoiceList() {
			const { data } = await getInvoiceList();
			if (data.code == '1') {
				let temp = data.obj.invoiceList;
				let defaultInvoice = temp.filter(item => item.isDefualt)[0];
				if (defaultInvoice) {
					this.defaultInvoice = defaultInvoice;
				} else {
					this.defaultInvoice = temp[0];
				}
				this.form.invoiceId = this.defaultInvoice.invoiceId;
			}
		}
	},
	onShow() {
		this.isFree = false;
		if (this.invoice) {
			this.defaultInvoice = this.invoice;
			this.form.invoiceId = this.invoice.invoiceId;
		} else {
			this.invoiceList();
		}
		this.sum = this.$root.$mp.query.sum;
		this.getNewPortInfo();
		this.payVisible = false;
		store.dispatch('wallet');
	},
	computed: {
		invoice() {
			return store.state.invoice;
		},
		orderId() {
			return store.state.applyOrderId;
		},
		wallet() {
			store.state.wallet.amount = parseFloat(store.state.wallet.amount).toFixed(2);
			return store.state.wallet;
		},
		staticImg() { return store.state.staticImg } ,
	}
};
</script>

<style scope lang="scss">
.container {
	padding: 0;
	width: 100%;
}
page {
	background: #eff4f8;
}
.icon {
	width: 40rpx;
	height: 40rpx;
}
.icon-more {
	width: 30rpx;
	height: 30rpx;
}
radio-group {
	radio {
		transform: scale(0.7);
	}
}
.footer {
	position: fixed;
	bottom: 0;
	width: 100%;
}
.btn-b {
	width: 176rpx;
	text-align: center;
	height: 80rpx;
	line-height: 80rpx;
	background-color: rgb(27, 25, 33);
	border-radius: 10rpx;
}
.rgb243 {
	color: rgb(243, 53, 53);
}
.d_mask {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(25, 25, 25, 0.3);
}

.d_modal_content {
	background-color: #fff;
	position: absolute;
	bottom: 0;
	width: 100%;
}

.icon_pay {
	width: 50rpx;
	height: 50rpx;
}

.height {
	height: 120rpx;
}
.width180 {
	width: 180rpx;
}
.w75 {
	width: 75%;
}
.pfb {
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	background: #fff;
}
.h120 {
	height: 120rpx;
	line-height: 120rpx;
}
</style>

<template>
	<div>
		<div class="bgw">
			<div class="title pdl40 pdt60 pdb80"><div class="ft50 ftweight rgb51">新增地址</div></div>
			<div class="bar"></div>
			<div class="pd40-x pdt10 pdb50">
				<div class="form_item">
					<div class="gray">姓名&emsp;&emsp;</div>
					<input placeholder-class="placeholder" type="text" auto-focus placeholder="请输入姓名" v-model="form.contactName" />
				</div>
				<div class="form_item">
					<div class="gray">手机号码</div>
					<input placeholder-class="placeholder" type="number" maxlength="11" v-model="form.contactPhone" placeholder="请输入收货人手机号" />
				</div>
				<picker
					mode="multiSelector"
					@click="hideKeyboard"
					:range="rigionArr"
					range-key="NAME"
					:value="multiIndex"
					@columnchange="bindMultiPickerColumnChange"
					@change="bindMultiPickerChange"
				>
					<div class="form_item">
						<div class="gray">所在地区</div>
						<input placeholder-class="placeholder" type="text" :value="rigion" disabled placeholder="请选择收货地区" />
						<!-- <i-icon type="enter" size="22" color="#777"></i-icon> -->
						<!-- <icon :type="value" size="26"/> -->
					</div>
				</picker>
				<div class="form_item mgb100">
					<div class="gray">详细地址</div>
					<input placeholder-class="placeholder" type="textarea" v-model="form.contactAddress" placeholder="请输入详细地址(最多50字)" maxlength="50" />
				</div>
				<div class="fst" @click="form.isDefualt = form.isDefualt == 0 ? '1' : '0'">
					<img class="icon" :src="staticImg + 'static/img/checked.png'" v-if="form.isDefualt == 1" alt="" />
					<img class="icon" :src="staticImg + 'static/img/uncheck.png'" v-else alt="" />
					<div class="ft24 mgl20 rgb51">默认地址</div>
				</div>
			</div>
		</div>

		<div class="footer mgt20 ft28 rgb243 tac" @click="addInvoice">确定</div>
	</div>
</template>

<script>
import { addInvoice, getArea, getInvoiceInfo, updateInvoice } from '@/api';
import { validatePhone, validatePhone1, validateEMoji } from '@/utils/validate';
export default {
	data() {
		return {
			title: '新增地址', // 标题栏文字
			area: '',
			form: {
				provice: '',
				city: '',
				area: '',
				contactAddress: '',
				isDefualt: '0',
				contactName: '',
				contactPhone: ''
			},
			rigionArr: [['请选择'], ['请选择'], ['请选择']],
			multiIndex: [0, 0, 0],
			rigion: '',
			provice: [],
			city: [],
			area: [],
			p: '',
			c: '',
			a: '',
			invoiceId: '' // 编辑地址所属ID
		};
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
		bindMultiPickerColumnChange(e) {
			if (e.mp.detail.column == 0) {
				this.p = this.rigionArr[e.mp.detail.column][e.mp.detail.value];
				this.getArea(this.p.AREA_ID, 1);
				this.multiIndex[0] = e.mp.detail.value;
				this.multiIndex[1] = 0;
				this.multiIndex[2] = 0;
				this.c = {};
				this.a = {};
			} else if (e.mp.detail.column == 1) {
				this.c = this.rigionArr[e.mp.detail.column][e.mp.detail.value];
				this.getArea(this.c.AREA_ID, 2);
				this.multiIndex[1] = e.mp.detail.value;
				this.multiIndex[2] = 0;
				this.a = {};
			} else if (e.mp.detail.column == 2) {
				this.a = this.rigionArr[e.mp.detail.column][e.mp.detail.value];
				this.multiIndex[2] = e.mp.detail.value;
			}
		},
		bindMultiPickerChange() {
			var rigionArray = [];
			if (this.p.AREA_ID >= 0) {
				rigionArray.push(this.p.NAME);
				if (this.c.AREA_ID >= 0) {
					rigionArray.push(this.c.NAME);
					if (this.a.AREA_ID >= 0) {
						rigionArray.push(this.a.NAME);
					}
				}
			}
			this.rigion = rigionArray.join(',');
		},
		// 点击确定按钮
		async addInvoice() {
			this.form.provice = this.p.AREA_ID ? this.p.AREA_ID:-1;
			this.form.city = this.c.AREA_ID ? this.c.AREA_ID:-1;
			this.form.area = this.a.AREA_ID ? this.a.AREA_ID:-1;
			if (!this.form.contactName) {
				wx.showToast({
					title: '请填写姓名',
					icon: 'none'
				});
				return;
			}
			if (!this.form.contactPhone) {
				wx.showToast({
					title: '请填写正确的手机号码',
					icon: 'none'
				});
				return;
			}
			if (!validatePhone1(this.form.contactPhone)) {
				wx.showToast({
					title: '手机号码格式有误',
					icon: 'none'
				});
				return;
			}
			if (this.form.provice < 0 || this.form.city < 0 || this.form.area < 0) {
				wx.showToast({
					title: '请选择省市区',
					icon: 'none'
				});
				return;
			}
			if (!this.form.contactAddress) {
				wx.showToast({
					title: '请填写详细地址',
					icon: 'none'
				});
				return;
			}
			if (validateEMoji(this.form.contactAddress)) {
				wx.showToast({
					title: '详细地址不允许输入emoji',
					icon: 'none'
				});
				return;
			}
			if (this.invoiceId) {
				const { data } = await updateInvoice({ ...this.form, istrue: false });
				if (data.code == '1') {
					wx.showToast({
						icon: 'none',
						title: '编辑成功'
					});
					setTimeout(() => {
						wx.navigateBack({
							delta: 1
						});
					}, 1200);
				} else {
					wx.showToast({
						icon: 'none',
						title: data.msg
					});
				}
			} else {
				const { data } = await addInvoice({ ...this.form, istrue: false });
				if (data.code == '1') {
					wx.showToast({
						icon: 'none',
						title: '新增成功'
					});
					setTimeout(() => {
						wx.navigateBack({
							delta: 1
						});
					}, 1200);
				} else {
					wx.showToast({
						icon: 'none',
						title: data.msg
					});
				}
			}
		},
		// 获取省、市、区
		async getArea(FID = 0, type = 0) {
			const { data } = await getArea({
				FID,
				istrue: true
			});
			if (data.code == '1') {
				if (type == 0) {
					this.provice = data.obj.area;
					this.rigionArr[0] = data.obj.area;
					this.rigionArr[1] = [{ NAME: '请选择' }];
					this.rigionArr[2] = [{ NAME: '请选择' }];
				} else if (type == 1) {
					this.city = data.obj.area;
					this.rigionArr[1] = data.obj.area;
					this.rigionArr[2] = [{ NAME: '请选择' }];
				} else {
					this.area = data.obj.area;
					this.rigionArr[2] = data.obj.area;
				}
			}
			return data;
		},
		// 获取地址详情
		async getInvoiceInfo(invoiceId) {
			var that = this;
			const { data } = await getInvoiceInfo({
				invoiceId
			});
			if (data.code == '1') {
				let tmp = data.obj.invoice;
				this.form = Object.assign({}, this.form, tmp);
				this.provice.map((item, index) => {
					if (item.AREA_ID == tmp.provice) {
						this.multiIndex.push(index);
					}
				});
				const res = await Promise.all([this.getArea(tmp.provice, 1), this.getArea(tmp.city, 3)]);
				res[0].obj.area.map((item, index) => {
					if (item.AREA_ID == tmp.city) {
						this.multiIndex.push(index);
					}
				});
				res[1].obj.area.map((item, index) => {
					if (item.AREA_ID == tmp.area) {
						this.multiIndex.push(index);
					}
				});
				var rigionArray = [];
				rigionArray.push(this.provice[this.multiIndex[0]].NAME);
				rigionArray.push(this.city[this.multiIndex[1]].NAME);
				rigionArray.push(this.area[this.multiIndex[2]].NAME);
				this.rigion = rigionArray.join(',');
				that.p = this.provice[this.multiIndex[0]];
				that.c = this.city[this.multiIndex[1]];
				that.a = this.area[this.multiIndex[2]];
			}
		},
		//picker弹出隐藏input键盘
		hideKeyboard() {
			wx.hideKeyboard();
		}
	},
	onShow() {
		var that = this;
		that.multiIndex = [];
		(that.form = {
			provice: '',
			city: '',
			area: '',
			contactAddress: '',
			isDefualt: '0',
			contactName: '',
			contactPhone: ''
		}),
			(that.rigion = ''),
			(that.invoiceId = that.$root.$mp.query.invoiceId);
		if (that.invoiceId) {
			// that.title = '编辑地址';
			that.getArea().then(() => {
				that.getInvoiceInfo(that.invoiceId);
			});
		} else {
			// that.title = '新增地址';
			that.getArea();
		}
		this.p = '';
		this.c = '';
		this.a = '';
	}
};
</script>

<style lang="stylus">
page
	background-color #6f8f b
.title
	/* box-shadow:0 0 20rpx 0 rgba(27,25,33,0.2) */
.form_item
	display flex
	justify-content space-between
	align-items center
	margin-top 70rpx
	.gray
		width 112rpx
		font-size 28rpx
		font-weight 500
		color #777
	input
		font-size 30rpx
		font-weight bold
		color #333
		margin-left 40rpx
		flex 1
.placeholder
	font-size 24rpx
	font-weight normal
	color #aaa
	text-align left
.icon
	width 32rpx
	height 32rpx
.footer
	height 100rpx
	line-height 100rpx
	font-weight 500
	background #fff
</style>

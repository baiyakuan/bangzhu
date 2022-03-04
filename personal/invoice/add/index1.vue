<template>
	<div>
		<div class="bgw">
			<div class="title pdl40 pdt60 pdb80"><div class="ft50 ftweight rgb51">新增地址</div></div>
			<div class="bar"></div>
			<div class="pd40-x pdt10 pdb50">
				<div class="fst mgt70">
					<div class="gray">姓名</div>
					<input placeholder-class="placeholder" type="text" auto-focus placeholder="请输入姓名" v-model="form.contactName" />
				</div>
				<div class="fst mgt70">
					<div class="gray">手机号码</div>
					<input placeholder-class="placeholder" type="number" maxlength="11" v-model="form.contactPhone" placeholder="请输入收货人手机号" />
				</div>
				<picker :range="province" range-key="NAME" @change="provinceChange">
					<view class="fst mgt70">
						<label class="gray">所在省</label>
						<button class="btn ft28 " :class="p ? 'btnBlack' : 'btnGray'" hover-class="none">{{ p ? p : '请选择收货省份' }}</button>
					</view>
				</picker>

				<picker :range="city" range-key="NAME" @change="cityChange">
					<view class="fst mgt70">
						<view class="gray">所在市</view>
						<button class="btn ft28" :class="c ? 'btnBlack' : 'btnGray'" hover-class="none">{{ c ? c : '请选择收货城市' }}</button>
					</view>
				</picker>

				<picker :range="area" range-key="NAME" @change="areaChange">
					<view class="fst mgt70">
						<view class="gray">所在区</view>
						<button class="btn ft28 " :class="a ? 'btnBlack' : 'btnGray'" hover-class="none">{{ a ? a : '请选择收货地区' }}</button>
					</view>
				</picker>

				<div class="fst mgb100 mgt70">
					<div class="gray">详细地址</div>
					<input placeholder-class="placeholder" type="text" v-model="form.contactAddress" placeholder="请输入详细地址(最多50字)" maxlength="50" />
				</div>
				<div class="fst" @click="setDefault">
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
			form: {
				provice: '',
				city: '',
				area: '',
				contactAddress: '',
				isDefualt: '0',
				contactName: '',
				contactPhone: ''
			},
			province: [],
			city: [],
			area: [],
			p: '',
			c: '',
			a: '',
			invoiceId: '', // 编辑地址所属ID
			isClick: false
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
		setDefault() {
			this.form.isDefualt = this.form.isDefualt == 0 ? 1 : 0;
		},
		async getArea(FID = 0, type = 0) {
			const { data } = await getArea({
				FID,
				type
			});
			if (data.code == '1') {
				if (type == 0) {
					this.province = data.obj.area;
				} else if (type == 1) {
					this.city = data.obj.area;
				} else {
					this.area = data.obj.area;
				}
			}
			return data;
		},
		provinceChange(e) {
			let value = e.detail.value;
			let p = this.province[value];
			if (p.AREA_ID >= 0) {
				this.p = p.NAME;
			} else {
				this.p = '';
			}
			this.form.provice = p.AREA_ID;
			this.c = '';
			this.a = '';
			this.getArea(p.AREA_ID, 1);
		},
		cityChange(e) {
			let value = e.detail.value;
			let c = this.city[value];
			if (c.AREA_ID >= 0) {
				this.c = c.NAME;
			} else {
				this.c = '';
			}
			this.a = '';
			this.form.city = c.AREA_ID;
			this.getArea(c.AREA_ID, 2);
		},
		areaChange(e) {
			let value = e.detail.value;
			let a = this.area[value];
			if (a.AREA_ID >= 0) {
				this.a = a.NAME;
			} else {
				this.a = '';
			}
			this.form.area = a.AREA_ID;
		},
		async addInvoice() {
			if (this.isClick) {
				return false;
			}
			this.isClick = true;
			setTimeout(() => {
				this.isClick = false;
			}, 2000);
			if (!this.form.contactName) {
				wx.showToast({
					title: '请填写姓名',
					icon: 'none'
				});
				return;
			}
			if (validateEMoji(this.form.contactName)) {
				wx.showToast({
					title: '姓名不允许输入emoji',
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
			if (!this.form.provice || !this.form.city || !this.form.area) {
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
				const { data } = await updateInvoice({ ...this.form, istrue: true });
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
				const { data } = await addInvoice({ ...this.form, istrue: true });
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
		// 获取地址详情
		async getInvoiceInfo(invoiceId) {
			var that = this;
			await that.getArea(); //查询所有的省
			const { data } = await getInvoiceInfo({
				invoiceId
			});
			if (data.code == '1') {
				let tmp = data.obj.invoice;
				that.form = Object.assign({}, that.form, tmp);
				that.province.map((item, index) => {
					if (item.AREA_ID == tmp.provice) {
						that.p = this.province[index].NAME;
					}
				});
				const res = await Promise.all([that.getArea(tmp.provice, 1), that.getArea(tmp.city, 3)]);
				res[0].obj.area.map((item, index) => {
					if (item.AREA_ID == tmp.city) {
						that.c = that.city[index].NAME;
					}
				});
				res[1].obj.area.map((item, index) => {
					if (item.AREA_ID == tmp.area) {
						that.a = that.area[index].NAME;
					}
				});
			}
		}
	},
	onShow() {
		var that = this;
		(that.form = {
			provice: '',
			city: '',
			area: '',
			contactAddress: '',
			isDefualt: '0',
			contactName: '',
			contactPhone: ''
		}),
			(this.p = '');
		this.c = '';
		this.a = '';
		that.invoiceId = that.$root.$mp.query.invoiceId;
		if (that.invoiceId) {
			// that.title = '编辑地址';
			that.getInvoiceInfo(that.invoiceId);
		} else {
			// that.title = '新增地址';
			that.getArea();
		}
	}
};
</script>

<style lang="stylus">
page
	background-color #6f8f b
.title
	/* box-shadow:0 0 20rpx 0 rgba(27,25,33,0.2) */
.gray
	font-size 28rpx
	width 120rpx
	font-weight 500
	color #777
input
	font-size 30rpx
	font-weight bold
	color #333
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
// .ck
// display flex
// align-items center
// .footer
// margin 120rpx auto 0
// width 600rpx
.btn
	border none
	line-height 25px
	padding 2px 5px
	display inline-block
	background-color rgb(255, 255, 255)
	color rgb(0, 0, 0)
	height 25px
	box-sizing content-box
.btnGray
	padding 2px 8px
	color rgba(170, 170, 170, 1)
	font-size 24rpx
.btnBlack
	font-size 30rpx
	font-weight bold
	color rgba(51, 51, 51, 1)
</style>

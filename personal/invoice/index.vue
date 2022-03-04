<template>
	<div>
		<div class="title pdl40 pdt60 pdb80"><div class="ft50 ftweight rgb51">地址管理</div></div>
		<div class="fcy" v-if="!list.length && pageVisible">
			<img class="bg" :src="staticImg + 'static/img/noaddress.png'" alt="" />
			<div class="ft28 rgb51">暂无收货地址信息，去添加吧</div>
			<div class="toAdd ft30 tac" @click="goAdd">新增地址</div>
		</div>
		<div v-if="list.length && pageVisible">
			<div class="bar"></div>
			<div class="item" v-for="item in list" :key="item.invoiceId" @click="selectAdd(item)">
				<div class="mgt60 pd40-x fs ft28 ftweight rgb51">
					<view class="over">{{ item.contactName }}</view>
					<view>{{ item.contactPhone }}</view>
				</div>
				<div class="pd40-x mgt30 ft28 rgb51 over" style="width: 100%;box-sizing: border-box;">{{ item.contactAddress }}</div>
				<div class="pd40-x mgt50 mgb30 fs">
					<div class="fst" @click.stop="defualtInvoice(item)">
						<img class="icon" :src="staticImg + 'static/img/checked.png'" v-if="item.isDefualt" alt="" />
						<img class="icon" :src="staticImg + 'static/img/uncheck.png'" v-else alt="" />
						<view class="ft24 mgl20">设为默认</view>
					</div>
					<div class="fst ft24">
						<!-- <view class="rgb243"  @click.stop="onEdit(item)">编辑</view> -->
						<view class="rgb119 mgl40" @click.stop="onOk(item)">删除</view>
					</div>
				</div>
				<div class="line"></div>
			</div>
			<div class="zhan"></div>
			<div class="btn-box"><div class="btn ft30 ftweight tac" @click="goAdd">新增地址</div></div>
		</div>
		<Modal v-if="visible" ok-css="color:#f73c3c;font-size:30rpx;font-weight:bold;" ok-text="是" cancel-text="否" @ok="delInvoiceById" @cancel="visible = false">
			<view class="pd40-y">是否删除此收货地址?</view>
		</Modal>
	</div>
</template>

<script>
import Modal from '@/components/Modal/index.vue';
import { getInvoiceList, defualtInvoice, delInvoiceById, getInvoiceInfo, updateInvoice } from '@/api';
import store from '@/store';
export default {
	components: {
		Modal
	},
	data() {
		return {
			list: [],
			visible: false,
			pageVisible: false,
			invoiceId: '',
			select: 0 // 是否从申请发票页面条状过来 默认0 不是
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
		goAdd() {
			// #ifdef MP-WEIXIN
			wx.navigateTo({
				url: '/personal/invoice/add/index'
			});
			// #endif
			// #ifdef MP-ALIPAY
			wx.navigateTo({
				url: '/personal/invoice/add/index1'
			});
			// #endif
		},
		onEdit(item) {
			// #ifdef MP-WEIXIN
			wx.navigateTo({
				url: '/personal/invoice/add/index?invoiceId=' + item.invoiceId
			});
			// #endif
			// #ifdef MP-ALIPAY
			wx.navigateTo({
				url: '/personal/invoice/add/index1?invoiceId=' + item.invoiceId
			});
			// #endif
		},

		// 发票列表
		async getInvoiceList() {
			const { data } = await getInvoiceList();
			if (data.code == '1') {
				this.list = data.obj.invoiceList;
				this.pageVisible = true;
			}
		},
		// 获取地址详情
		async getInvoiceInfo(invoiceId) {
			var that = this;
			const { data } = await getInvoiceInfo({
				invoiceId
			});
			if (data.code == '1') {
				this.form = data.obj.invoice;
				this.form.isDefualt = 0;
				this.updateInvoice();
			}
		},
		// 取消默认地址
		async updateInvoice() {
			const { data } = await updateInvoice(this.form);
			if (data.code == '1') {
				this.getInvoiceList();
			}
		},
		// 设为默认地址
		async defualtInvoice(item) {
			if (item.isDefualt == 1) {
				this.getInvoiceInfo(item.invoiceId);
			} else {
				const { data } = await defualtInvoice({
					invoiceId: item.invoiceId
				});
				if (data.code == '1') {
					this.getInvoiceList();
				}
			}
		},
		onOk(item) {
			if (item.isDefualt == 1) {
				wx.showToast({
					title: '默认地址不可删除',
					icon: 'none'
				});
				return;
			}
			this.visible = true;
			this.invoiceId = item.invoiceId;
		},
		// 删除发票
		async delInvoiceById() {
			const { data } = await delInvoiceById({
				invoiceId: this.invoiceId
			});
			if (data.code == '1') {
				wx.showToast({
					title: '删除成功',
					icon: 'none'
				});
				this.getInvoiceList();
			}
			this.visible = false;
		},
		// 发票页面选择地址
		selectAdd(item) {
			if (this.select) {
				store.commit('set_invoice', item);
				wx.navigateBack({
					delta: 1
				});
			}
		}
	},
	onShow() {
		this.pageVisible = false;
		let { select } = this.$root.$mp.query;
		if (select) {
			this.select = select;
		}
		this.getInvoiceList();
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
.over
	width 50%
	white-space nowrap
	overflow hidden
	text-overflow ellipsis
</style>

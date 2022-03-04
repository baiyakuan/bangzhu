<template>
	<div>
		<div class="title pdl40 pdt60 pdb150 ft50 ftweight rgb51">提现</div>
		<div class="body pdt310 pr">
			<swiper
				class="swiper pa"
				indicator-color="rgba(170,170,170,1)"
				indicator-active-color="rgba(243,53,53,1)"
				:indicator-dots="true"
				:previous-margin="previous"
				:next-margin="previous"
				:current="current"
				duration="300"
				:circular="true"
				@change="swiperChange"
			>
				<swiper-item v-for="(item, index) in list" :key="index" class="item-box">
					<div class="item pd50" :class="current == index ? 'active' : ''">
						<!-- <image src="/assets/bank3.png" v-if="index == 2" class="image"></image> -->
						<img class="chip" src="/static/img/chip.png" alt="" />
						<div class="fr ft38 ftw ftweight">{{ item.abbreviations }}</div>
						<div class="mg20-y fs">
							<div class="ft46 ftw">****</div>
							<div class="ft46 ftw">****</div>
							<div class="ft46 ftw">****</div>
							<div class="ft46 ftw">{{ item.bankNumber }}</div>
						</div>
						<div class="fs">
							<div class="fcyst">
								<div class="ft22 ftw">所属银行</div>
								<div class="ft28 ftw ftweight">{{ item.bankName }}</div>
							</div>
							<div class="fcyen">
								<div class="ft22 ftw">持卡人</div>
								<div class="ft28 ftw ftweight">{{ item.realName }}</div>
								<!-- <div class="ft22 ftw">支行</div>
                <div class="ft28 ftw ftweight">{{item.branchName}}</div> -->
							</div>
						</div>
					</div>
				</swiper-item>
				<swiper-item class="pd10" style="box-sizing:border-box;">
					<div class="item add-box fcy" :class="current == list.length ? 'active' : ''" @click="addBank">
						<img class="add-bank" src="/static/img/add-bank.png" alt="" />
						<div class="ft28 rgb51">ADD BANK CARD</div>
						<div class="ft22 rgb119">添加银行卡</div>
					</div>
				</swiper-item>
			</swiper>
			<div class="pd40-x">
				<div>
					<div class="ft26 ftweight rgb51">到账银行</div>
					<div v-if="current != list.length && list.length" class="mgt30 bank fst">
						<div class="icon mgl30"><img :src="Imgpath + bankDetail.icon" style="width:100%;height:100%;" alt="" /></div>
						<div class="mgl25">
							<div class="ft24 rgb51">{{ bankDetail.bankName }}({{ bankDetail.bankNumber }})</div>
							<div class="ft22 gray-a">提交申请请仔细核对信息</div>
						</div>
					</div>
					<div v-else class="mgt30 bank fst"><div class="mgl30 ft24 rgb51">暂无银行卡信息</div></div>
				</div>
				<div v-if="current != list.length && list.length" class="mgt60">
					<div class="ft26 ftweight rgb51">提现金额</div>
					<div class="ipt-box fs mgt40 pdb20">
						<!-- <view>￥</view> -->
						<div>
							<text class="pr rgb51 ft36 ftweight" style="top:-8rpx;">￥</text>
							<input
								class="rgb51 ft38 ftweight"
								style="display:inline-block;"
								placeholder-class="rgb187 ft28"
								type="number"
								v-model="money"
								placeholder="请输入金额"
							/>
						</div>
						<view class="ft22 ftweight rgb243" @click="all">全部提现</view>
					</div>
					<div class="mgt20 fs">
						<view class="ft22 rgb119">可提现￥{{ walletText }}</view>
						<view class="ft22 ftweight rgb243" @click="helpVisible = true">查看原因</view>
					</div>
				</div>
				<div v-if="current != list.length && list.length" class="btn ft30 white-t tac" @click="frontAddWithdrawCash">提现</div>
			</div>
		</div>

		<div>
			<Modal v-if="helpVisible" ok-css="color:#f73c3c;font-size:30rpx;font-weight:bold;" ok-text="知道了" :show-cancel="false" @ok="helpVisible = false">
				<view class="mgt90 rgb51 ft24 ftweight">通过礼品卡激活获得的钱包余额</view>
				<view class="mg10-y rgb51 ft24 ftweight">为不可提现余额</view>
				<view class="mgb70 rgb51 ft24 ftweight">可用于停车消费、购物消费等</view>
			</Modal>
		</div>

		<div>
			<Modal
				v-if="addVisible"
				ok-css="color:#FA4242;font-size:30rpx;font-weight:bold;"
				cancel-css="color:#aaa;font-size:30rpx;font-weight:bold;"
				ok-text="是"
				cancel-text="否"
				@ok="addBank"
				@cancel="addVisible = false"
			>
				<view class="img-box mgt80"><img class="failTips" src="/static/img/failTips.png" alt="" /></view>
				<view class="mgt30 ft28 ftweight rgb51">未绑定银行卡</view>
				<view class="mgt20 $gray-t ft24 ftweight mgb30">无法提现,是否绑定银行卡</view>
			</Modal>
		</div>

		<div>
			<Modal v-if="visibleauth" ok-css="color:#FA4242;font-size:30rpx;font-weight:bold;" ok-text="知道了" :show-cancel="false" @ok="okauth">
				<view class="pd40-y">请实名认证</view>
			</Modal>
		</div>
	</div>
</template>

<script>
import { getBankLists, getBankLists2, frontAddWithdrawCash, getNewPortInfoDetails, getUsersInfo } from '@/api';
import Modal from '@/components/Modal/index.vue';
import store from '@/store';
export default {
	data() {
		return {
			current: -1,
			wallet: '',
			walletText: '',
			query: {
				pageNo: 1,
				pageSize: 20
			},
			list: [],
			money: '',
			moneylist: {},
			visible: false,
			visibleauth: false,
			isValidation: -1,
			bankDetail: {},
			helpVisible: false,
			addVisible: false,
			previous: '80rpx'
		};
	},
	components: {
		Modal
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
		// 点击全部提现
		all() {
			this.money = this.wallet;
		},
		// swiper切换
		swiperChange(e) {
			const that = this;
			this.current = e.mp.detail.current;
			this.bankDetail = this.list[e.mp.detail.current];
		},
		//提示添加银行卡
		addBank() {
			wx.navigateTo({
				url: '/personal/bank/add/index'
			});
		},
		//提示实名认证
		okauth() {
			wx.navigateTo({
				url: `/personal/information/auth/index`
			});
		},
		//获取实名认证信息
		async getUsersInfo() {
			const { data } = await getUsersInfo();
			this.isValidation = data.obj.isValidation;
			if (data.obj.isValidation == 0) {
				this.visibleauth = true;
			} else {
				this.visibleauth = false;
			}
		},

		// 获取银行卡列表
		async getBankLists() {
			const { data } = await getBankLists2(this.query);
			if (data.code == '1') {
				this.wallet = data.obj.balance;
				this.walletText = (data.obj.balance * 1).toFixed(2);
				if (data.obj.pageInfo.list.length == 0) {
					this.addVisible = true;
				} else {
					this.addVisible = false;
				}
				this.list = data.obj.pageInfo.list.map(card => {
					return {
						...card,
						bankNumber: card.bankNumber.substring(card.bankNumber.length - 4)
					};
				});
				this.bankDetail = this.list[0];
			}
		},
		// 获取最低提现金额
		async getlowmoney() {
			const { data } = await getNewPortInfoDetails({
				newPortId: 'XY12345680'
			});
			this.moneylist = data;
		},
		// 提现
		async frontAddWithdrawCash() {
			console.log('this.money = >' + this.money);
			if (!this.money) {
				wx.showToast({
					title: '请输入提现金额',
					icon: 'none'
				});
				return;
			}
			if (Number(this.money) < Number(this.moneylist.obj.newPort.content)) {
				wx.showToast({
					title: '最低提现金额为' + this.moneylist.obj.newPort.content + '元',
					icon: 'none'
				});
				return;
			}
			if (Number(this.money) > Number(this.wallet)) {
				wx.showToast({
					title: '输入的金额大于可提金额',
					icon: 'none'
				});
				return;
			}
			if (this.isValidation != 1) {
				wx.showToast({
					title: '请先实名认证',
					icon: 'none'
				});
				setTimeout(() => {
					wx.navigateTo({
						url: `/personal/information/auth/index`
					});
				}, 1200);
				return;
			}
			if (!this.list.length) {
				wx.showToast({
					title: '暂无银行卡，请先添加银行卡',
					icon: 'none'
				});
				setTimeout(() => {
					wx.navigateTo({
						url: '/personal/bank/add/index'
					});
				}, 1200);
				return;
			}
			const { data } = await frontAddWithdrawCash({
				bankId: this.bankDetail.bankId,
				money: this.money
			});
			if (data.code == '1') {
				wx.showToast({
					title: '申请提现成功',
					icon: 'none'
				});
				setTimeout(() => {
					wx.navigateBack({
						delta: 1
					});
				}, 1200);
			}
		}
	},
	onShow() {
		this.visibleauth = false;
		this.current = 0;
		this.bankDetail = {};
		this.getBankLists();
		// #ifdef  MP-ALIPAY
		this.previous = 40 + 'rpx';
		// #endif
		this.getlowmoney();
		this.getUsersInfo();
	},
	computed: {
		// wallet () {
		//   return store.state.wallet.amount
		// },
		Imgpath() {
			return store.state.Imgpath;
		}
	}
};
</script>

<style lang="stylus">
page
	background #fff
.title
	/* box-shadow:0 0 20rpx 0 rgba(27,25,33,0.2) */
.swiper
	height 380rpx !important
	width 100%
	top -90rpx
	.item-box
		.item
			width 100%
			height 300rpx
			border-radius 20rpx
			transform scale(0.9)
			box-sizing border-box
			position relative
			&.active
				transform scale(1)
				transitionall 0.2s ease-in 0s
				z-index 20
		
		&:nth-child(3n+1)
			.item
				background url('~@/assets/bank1.png') 100%
		&:nth-child(3n+2)
			.item
				background url('~@/assets/bank2.png') 100%
		&:nth-child(3n+3)
			.item
				background url('~@/assets/bank3.png') 100%
			
			// 
	.add-box
		height 300rpx
		border-radius 20rpx
		transform scale(0.9)
		background #fff
		box-shadow 1rpx 1rpx 10rpx 2rpx rgba(119, 119, 119, 0.2)
		.add-bank
			width 112rpx
			height 112rpx

	  
// .image
// 	position absolute
// 	left 0
// 	top 0
// 	height 300rpx
// 	width 100%
// 	z-index -1


.bank
	width 670rpx
	height 110rpx
	box-shadow 0 8rpx 16rpx 0 rgba(119, 119, 119, 0.1)
.chip
	width 50rpx
	height 46rpx
.icon
	width 50rpx
	height 50rpx
.ipt-box
	border-bottom 1px solid #e6e6e6
.btn
	width 670rpx
	height 100rpx
	line-height 100rpx
	margin 80rpx auto 70rpx
	background #f33535
	border-radius 10rpx
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
.fss
	display flex
	justify-content flex-start
	align-items center
.header
	padding 30rpx 50rpx
.footer
	position fixed
	bottom 0
	width 100%
	height 120rpx
	button
		width 600rpx
	
</style>

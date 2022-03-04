<template>
	<div>
		<div class="title pd40-x">
			<div class="pdt60 ft50 ftweight rgb51">零钱提现</div>
			<div class="mgt40 ft26 rgb119">提现金额：{{ orderInfo.amount }}元</div>
			<div class="fs ft24 gray-a mgt10 pdb20">
				<div>服务费：0.00 元</div>
				<div class="fst">
					<div>到账银行卡：{{ orderInfo.bankName }}</div>
					<div class="mgl10">尾号{{ orderInfo.bankNumber }}</div>
				</div>
			</div>
		</div>
		<!--  <div class="mgt70 pdl90" v-if="current == 1">
      <i-steps :current="current" direction="vertical" >
        <i-step :i-step-class="0<current?'finish':0==current?'progress':'wait'">
          <view slot="title">发起提现申请</view>
        </i-step>
        <i-step icon-src="/static/img/withdrawLoading.png" :i-step-class="1<current?'finish':1==current?'progress':'wait'">
          <view slot="title" class="ftweight ft30 rgb51">工作人员处理中</view>
          <view slot="content">预计2个工作日之内到账</view>
        </i-step>
        <i-step :i-step-class="2<current?'finish':2==current?'progress':'wait'">
          <view slot="title">到账成功</view>
        </i-step>
      </i-steps>
    </div>
    <div class="mgt70 pdl90" v-if="current == 2">
      <i-steps :current="current" direction="vertical" >
        <i-step :i-step-class="0<current?'finish':0==current?'progress':'wait'">
          <view slot="title">发起提现申请</view>
        </i-step>
        <i-step  :i-step-class="1<current?'finish':1==current?'progress':'wait'">
          <view slot="title">工作人员处理中</view>
          <view slot="content">预计2个工作日之内到账</view> -->
		<!-- </i-step>
        <i-step :icon-src="status?'/static/img/withdrawSuccess.png':'/static/img/withdrawFail.png'" :i-step-class="2<current?'finish':2==current?'progress':'wait'">
          <view slot="title" class="ft30 ftweight rgb51 pr" style="top:16rpx;">{{status?'到账成功':'提现失败，请联系客服'}}</view>
        </i-step>
      </i-steps>
    </div>-->
		<!-- 纵向排列 -->
		<div style="padding-top: 120rpx;">
			<uni-steps
				:options="options"
				direction="column"
				:activeColor="activeColor"
				:deactiveColor="deactiveColor"
				:cicleActiveColor="cicleActiveColor"
				:cicleDeactiveColor="cicleDeactiveColor"
				:iconSrc="iconSrc"
				:active="current"
			></uni-steps>
		</div>
		<div class=" btn tac ft30 ftweight rgb245" @click="finish">完成</div>
	</div>
</template>

<script>
import { orderInfo } from '@/api';
import uniSteps from '@/components/uni-steps/uni-steps.vue';
export default {
	components: { uniSteps },
	data() {
		return {
			current: 1, // 当前步骤
			orderInfo: {}, // 订单信息
			options: [{ title: '发起提现申请' }, { title: '工作人员处理中', desc: '预计2个工作日之内到账' }, { title: '到账成功' }],
			activeColor: '#333333',
			deactiveColor: '#777777',
			cicleActiveColor: '#F33535',
			cicleDeactiveColor: '#AAAAAA',
			iconSrc: '/static/img/withdrawLoading.png'
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
		index(i) {
			if (i > this.current) {
				return 'wait';
			} else if (i == this.current) {
				return 'progress';
			} else if (i < this.current) {
				return 'finish';
			}
		},
		async getOrderInfo() {
			const { data } = await orderInfo(this.query);
			if (data.code === '1') {
				data.obj.bankNumber = data.obj.bankNumber.substring(data.obj.bankNumber.length - 4);
				this.orderInfo = data.obj;
				// this.orderInfo.status = "8";
				switch (this.orderInfo.status) {
					case '1':
						// this.current = "审核中";
						this.current = 1;
						this.iconSrc = '/static/img/withdrawLoading.png';
						break;
					case '2':
						// this.presentstatus = "通过";
						this.current = 2;
						this.iconSrc = '/static/img/withdrawalSuccess.png';
						this.options = [{ title: '发起提现申请' }, { title: '工作人员处理中' }, { title: '到账成功' }];
						break;
					case '3':
						// this.presentstatus = "驳回";
						this.current = 2;
						this.iconSrc = '/static/img/withdrawFail.png';
						this.options = [{ title: '发起提现申请' }, { title: '工作人员处理中' }, { title: '提现失败，请联系客服' }];
						// this.status = 1;
						break;
					case '6':
						// this.presentstatus = "提现处理中";
						this.current = 1;
						this.iconSrc = '/static/img/withdrawLoading.png';
					case '8':
						// this.presentstatus = "已完成";
						this.current = 2;
						// this.status = 0;
						this.options = [{ title: '发起提现申请' }, { title: '工作人员处理中' }, { title: '到账成功' }];
						this.iconSrc = '/static/img/withdrawalSuccess.png';
						break;
				}
			}
		},
		finish() {
			wx.navigateBack({
				delta: 1
			});
		}
	},
	onShow() {
		this.query = this.$root.$mp.query;
		this.getOrderInfo();
	}
};
</script>

<style lang="stylus">
page
	background #fff
.title
	/* box-shadow:0 0 20rpx 0 rgba(27,25,33,0.2); */
.finish
	width 30rpx !important
	height 30rpx !important
	border-radius 50% !important
	background #f33535 !important
	border none !important
.wait
	width 30rpx !important
	height 30rpx !important
	border-radius 50% !important
	background #aaa !important
	border none !important
.btn
	width 250rpx
	height 80rpx
	line-height 80rpx
	border 1px solid rgba(243, 53, 53, 1)
	border-radius 10rpx
	margin 200rpx auto 0
</style>

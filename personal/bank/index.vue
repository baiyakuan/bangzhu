<template>
	<div>
		<div class="title pdl40 pdt60 pdb80 mgb16"><div class="ft50 ftweight rgb51">银行卡</div></div>
		<div class="bar"></div>
		<div class="fcy" v-if="nocard">
			<img class="bg" :src="staticImg + 'static/img/nobank.png'" alt="" />
			<div class="ft28 rgb51">暂无银行卡，去添加吧</div>
			<div class="toAdd ft30 tac" @click="addbank">添加银行卡</div>
		</div>
		<div v-else class="card-box pd40-x pdt10">
			<div class="mgt40 pd40-x pdt50 card" v-for="(card, index) in list" :key="index" @longpress="toDelete(card.bankId, card.bankNumber)">
				<!-- <image :src="staticImg + 'assets/bank3.png'" v-if="index == 2" class="image"></image> -->
				<img class="chip" :src="staticImg + 'static/img/chip.png'" alt="" />
				<div class="fr ft38 ftw ftweight">{{ card.abbreviations }}</div>
				<div class="mg20-y fs">
					<div class="ft46 ftw">****</div>
					<div class="ft46 ftw">****</div>
					<div class="ft46 ftw">****</div>
					<div class="ft46 ftw">{{ card.bankNumber }}</div>
				</div>
				<div class="fs">
					<div class="fcyst" style="width: 50%;">
						<div class="ft22 ftw">所属银行</div>
						<div class="ft28 ftw ftweight" style="width: 100%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{ card.bankName }}</div>
					</div>
					<div class="fcyen" style="width: 50%;">
						<div class="ft22 ftw">持卡人</div>
						<div class="ft28 ftw ftweight" style="width: 100%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;text-align: right;">{{ card.realName }}</div>
					</div>
				</div>
			</div>
			<div class="zhan"></div>
			<div class="footer-box"><div class="footer ft30 ftweight tac" @click="addbank">添加银行卡</div></div>
		</div>
		<div class="delete-mask" v-if="deleteVisible">
			<div class="btn-group">
				<div class="delete ft30 ftweight rgb243 tac" @click="visible = true">删除</div>
				<div class="cancel mgt10 ft30 ftweight rgb51 tac" @click="deleteVisible = false">取消</div>
			</div>
		</div>
		<div>
			<Modal
				v-if="visible"
				ok-css="color:#FA4242;font-size:30rpx;font-weight:bold;"
				cancel-css="color:#aaa;font-size:30rpx;font-weight:bold;"
				cancel-text="否"
				ok-text="是"
				@ok="onOk"
				@cancel="
					visible = false;
					deleteVisible = false;
				"
			>
				<view class="img-box mgt80"><img class="failTips" :src="staticImg + 'static/img/failTips.png'" alt="" /></view>
				<view class="mgt30 ft28 ftweight rgb51">删除银行卡</view>
				<view class="mgt20 rgb153 ft24 ftweight mgb30">再次确认,是否删除银行卡</view>
			</Modal>
		</div>
		<Modal
			v-if="addbankvisible"
			ok-css="color:#f44a3e;font-size:30rpx;font-weight:bold;"
			cancel-css="color:#aaa;font-size:30rpx;font-weight:bold;"
			cancel-text="取消"
			ok-text="去认证"
			@ok="addbankok"
			@cancel="addbankvisible = false"
		>
			<view class="pd40-y">添加银行卡需要实名认证！</view>
		</Modal>
		<!-- <i-modal :visible="addbankvisible" :actions='actions' @iclick='addbankok'>
      <view class="pd40-y">添加银行卡需要实名认证！</view>
    </i-modal> -->
		<div>
			<Modal v-if="maxVisible" ok-css="color:#f73c3c;font-size:30rpx;font-weight:bold;" :show-cancel="false" ok-text="确定" @ok="maxVisible = false">
				<view class="img-box mgt80"><img class="failTips" :src="staticImg + 'static/img/failTips.png'" alt="" /></view>
				<view class="mgt30 ft28 ftweight rgb51">我也是有限度的</view>
				<view class="mgt20 rgb153 ft24 ftweight mgb30">添加已满请删除后重试</view>
			</Modal>
			<!-- <i-modal
        :visible="maxVisible"
        cancel-text="确定"
        :show-ok="false"
        cancel-text-style="color:#f73c3c !important;font-size:30rpx;font-weight:bold;"
        @cancel="maxVisible = false">
          <view class="img-box mgt80">
            <img class="failTips" :src="staticImg + 'static/img/failTips.png'" alt="">
          </view>
          <view class="mgt30 ft28 ftweight rgb51">我也是有限度的</view>
          <view class="mgt20 $gray-t ft24 ftweight mgb30">添加已满请删除后重试</view>
      </i-modal> -->
			<!-- <Modal
	   v-if="modalVisible"
	   ok-css="color:#f73c3c;font-size:30rpx;font-weight:bold;"
	   :show-cancel="false"
	   ok-text="确定"
	   @ok="modalVisible = false"
	   >
	  	<view class="img-box mgt80">
	  	  <img class="failTips" :src="staticImg + 'static/img/successTips.png'" alt="">
	  	</view>
	  	<view class="mgt30 ft28 ftweight rgb51">提交成功</view>
	  	<view class="mgt20 rgb153 ft24 ftweight mgb30">恭喜您提交完成，辛苦啦 </view>
	  </Modal> -->
		</div>
	</div>
</template>

<script>
import Modal from '@/components/Modal/index.vue';
import { getBankLists, deleteBankByKey, getUsersInfo } from '@/api';
export default {
	components: {
		Modal
	},
	data() {
		return {
			actions: [
				{
					name: '取消'
				},
				{
					name: '去认证 ',
					color: '#f44a3e'
				}
			],
			addbankvisible: false,
			visible: false,
			nocard: false,
			list: [],
			query: {
				pageNo: 1,
				pageSize: 20
			},
			bankId: '',
			bankNumber: '',
			deleteVisible: false,
			maxVisible: false,
			modalVisible: false
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
	methods: {
		// 获取银行卡列表
		async getBankLists() {
			const { data } = await getBankLists({ ...this.query, istrue: true });
			if (data.code == '1') {
				this.list = data.obj.bankLists.map(card => {
					return {
						...card,
						bankNumber: card.bankNumber.substring(card.bankNumber.length - 4, card.bankNumber.length)
					};
				});
				if (this.list.length) {
					this.nocard = false;
				} else {
					this.nocard = true;
				}
			}
		},
		//添加银行卡判断是否实名认证
		async addbank() {
			const { data } = await getUsersInfo({
				istrue: true
			});
			if (data.obj.isValidation == 0) {
				this.addbankvisible = true;
			} else if (data.obj.isValidation == 1) {
				if (this.list.length == 3) {
					this.maxVisible = true;
				} else {
					wx.navigateTo({
						url: `/personal/bank/add/index`
					});
				}
			}
		},
		//实名认证显示
		addbankok() {
			this.addbankvisible = false;
			wx.navigateTo({
				url: `/personal/information/auth/index`
			});
		},
		// 确认删除
		onOk() {
			this.deleteBankByKey();
		},
		// 长按事件
		toDelete(id, number) {
			this.bankId = id;
			this.bankNumber = number;
			this.deleteVisible = true;
		},
		// 删除银行卡
		async deleteBankByKey() {
			const { data } = await deleteBankByKey({
				bankId: this.bankId,
				istrue: true
			});
			if (data.code == '1') {
				this.visible = false;
				this.deleteVisible = false;
				wx.showToast({
					icon: 'none',
					title: '删除成功'
				});
				setTimeout(() => {
					this.getBankLists({
						istrue: true
					});
				}, 1200);
			}
		}
	},
	onShow() {
		this.nocard = false;
		this.maxVisible = false;
		this.deleteVisible = false;
		this.getBankLists();
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
.card
	height 300rpx
	border-radius 20rpx
	box-sizing border-box
	position relative
.card:nth-child(3n+1)
	background url('~@/assets/bank1.png') 100%
.card:nth-child(3n+2)
	background url('~@/assets/bank2.png') 100%
.card:nth-child(3n+3)
	background url('~@/assets/bank3.png') 100%
.image
	position absolute
	left 0
	top 0
	height 300rpx
	width 100%
	z-index -1
.chip
	width 50rpx
	height 46rpx
.zhan
	width 670rpx
	height 200rpx
.footer-box
	width 750rpx
	height 175rpx
	position fixed
	left 0
	bottom 0
	background #F6F8FB
.footer
	width 670rpx
	height 100rpx
	line-height 100rpx
	margin 30rpx auto 0
	background #f33535
	border-radius 10rpx
	color #fff
.delete-mask
	position fixed
	top 0
	left 0
	right 0
	bottom 0
	background rgba(0, 0, 0, 0.6)
.btn-group
	width 750rpx
	position fixed
	bottom 0
	background #f6f8fb
	border-radius 20rpx 20rpx 0 0
.delete
	height 100rpx
	line-height 100rpx
	background #fff
	border-radius 20rpx 20rpx 0 0
.cancel
	height 150rpx
	padding-top 30rpx
	box-sizing border-box
	background #fff
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

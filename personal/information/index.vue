<template>
	<div>
		<div class="title pdl40 pdt60 pdb80 ft50 ftweight rgb51">个人资料</div>

		<div class="bar"></div>
		<div class="bgw mgt20">
			<uni-list>
				<uni-list-item i-class="user-cell" title="头像" is-link>
					<template v-slot:right="">
						<img
							class="user_avatar"
							:src="userInfo.usersPic ? baseUrl + '/file/downloadImg?path=' + userInfo.usersPic : staticImg + 'static/img/admin.png'"
							@click="uploadImg"
							slot="footer"
						/>
					</template>
				</uni-list-item>
			</uni-list>
		</div>
		<div class="bar"></div>
		<div class="bgw pdt30">
			<uni-list>
				<uni-list-item @click="nickname" title="昵称" :rightText="userInfo.usersNickName" is-link></uni-list-item>
				<uni-list-item i-right-class="right-class" i-class="cell" title="电话" :showArrow="false" :rightText="userInfo.usersPhone"></uni-list-item>
				<uni-list-item
					@click="auth"
					i-right-class="right-class"
					i-class="cell"
					title="实名认证"
					:rightText="userInfo.isValidation ? '已认证' : '未认证'"
					is-link
				></uni-list-item>
				<uni-list-item @click="invoice" i-right-class="right-class" i-class="cell" title="收货地址" is-link></uni-list-item>
				<!-- <uni-list-item @click="bank" i-right-class="right-class" i-class="cell" title="我的银行卡" is-link></uni-list-item> -->
			</uni-list>
		</div>
	</div>
</template>

<script>
import store from '@/store';
import { updateUserInfo } from '@/api';
import uniList from '@/components/uni-list/uni-list.vue';
import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
export default {
	components: {
		uniList,
		uniListItem
	},
	data() {
		return {
			// unphone:store.state.userInfo.usersPhone,
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
		// 昵称
		async nickname() {
			wx.navigateTo({
				url: '/personal/information/nickname/index'
			});
		},
		// 实名认证
		async auth() {
			wx.navigateTo({
				url: '/personal/information/auth/index'
			});
		},
		// 收货地址
		async invoice() {
			wx.navigateTo({
				url: '/personal/invoice/index'
			});
		},
		// 我的银行卡
		async bank() {
			wx.navigateTo({
				url: '/personal/bank/index'
			});
		},
		// 选择图片
		uploadImg() {
			wx.chooseImage({
				count: 1, // 默认9
				sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
				success: res => {
					// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
					var filePath = res.tempFilePaths[0];
					this.chooseImage(filePath);
				}
			});
		},
		//上传图片
		async chooseImage(filePath) {
			wx.showLoading({
				title: '上传中',
				mask: true
			});
			wx.uploadFile({
				url: this.uploadUrl,
				filePath,
				name: 'file',
				method: 'POST',
				dataType: 'json',
				formData: {
					type: 'user_img'
				},
				success: res => {
					let data = JSON.parse(res.data);
					if (data.code == 1) {
						this.updateUserInfo(data.obj.fliePath);
					}
				},
				fail: err => {
					console.log(err);
				},
				complete: () => {
					wx.hideLoading();
				}
			});
		},
		//更换头像
		async updateUserInfo(usersPic) {
			const { data } = await updateUserInfo({
				usersPic,
				updateType: '1'
			});
			if (data.code == '1') {
				store.dispatch('getUsersInfo');
				wx.showToast({
					title: data.msg,
					icon: 'none'
				});
			}
		}
	},
	onShow() {
		store.dispatch('getUsersInfo');
	},
	computed: {
		userInfo() {
			return store.state.userInfo;
		},
		uploadUrl() {
			return store.state.BASE_URL + '/message/upload/image';
		},
		baseUrl() {
			return store.state.BASE_URL;
		},
		staticImg() { return store.state.staticImg },
	}
};
</script>

<style lang="stylus">
page
	background #fff
.title
	/* box-shadow:0 0 20rpx 0 rgba(27,25,33,0.2) */
.bar
	width 750rpx
	height 16rpx
	background #f6f8fb
.user-cell
	padding 10rpx 40rpx 30rpx !important
	line-height 1 !important
	font-weight bold
.user_avatar
	width 62rpx
	height 62rpx
	border-radius 50%
.cell
	padding 10rpx 40rpx 60rpx !important
	line-height 1 !important
	font-weight bold
	font-size 24rpx
	color #333
.right-class
	color #aaa !important
.cell::after
	border none !important
.uni-list-item__container::after
	background-color #FFFFFF !important
.uni-list-item__content-title
	font-size 28rpx
	font-weight bold
	color rgba(51, 51, 51, 1)
.uni-list-item__extra-text
	font-size 24rpx
	font-weight 500
	color rgba(170, 170, 170, 1)
</style>

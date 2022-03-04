<script>
// const mtjwxsdk = require("./utils/mtj-wx-sdk.js");
import store from '@/store'
export default {
	// #ifdef MP-ALIPAY
		globalData: {  
				options: {},
		},
		onLaunch:function(options) {
			this.$scope.globalData = options
		},
	// #endif
	onLaunch() {
		console.log('onLaunch')
		uni.getSystemInfo({
			complete: res => {
				store.commit('setSystemInfo', res);
			}
		});
	}
}
</script>

<style lang='scss'>
	@import "uview-ui/index.scss";
	@import "./styles/index.styl";
	page{
		background: #F6F8FB;
	}
	.no_data{
		text-align: center;
		margin-top: 20rpx;
		font-size: 30rpx;
		color: #bbb;		
	}
</style>

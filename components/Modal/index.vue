<template>
	<view class="mask">
		<view :class="showCancel || showOk ? 'dialog tac' : 'dialog2 tac'">
			<slot></slot>
			<view class="dia-footer"  v-if="showCancel || showOk">
				<view v-if="showCancel" class="dia-cancel" :style="cancelCss" @click="handleClickCancel">{{cancelText}}</view>
				<view v-if="showOk" class="dia-ok" :style="okCss" @click="handleClickOk">{{okText}}</view>
			</view>	
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		props:{
			showOk:{
				type: Boolean,
				default:true
			},
			showCancel:{
				type: Boolean,
				default:true
			},
			cancelCss:{
				type: String
			},
			okCss:{
				type: String
			},
			okText:{
				type: String,
				default:'确定'
			},
			cancelText:{
				type: String,
				default:'取消'
			}	
		},
		methods: {
			handleClickOk () {
				this.$emit('ok');
			},
			handleClickCancel () {
				this.$emit('cancel');
			},
		}
	}
</script>

<style scoped>
	.mask{
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 1000;
		background: rgba(0,0,0,0.5);
	}
	.dialog{
		min-width: 520rpx;
		background: #fff;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		border-radius: 40rpx;
	}
	.dialog2{
		min-width: 520rpx;
		/* background: #fff; */
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		/* border-radius: 20rpx; */
	}
	.dia-footer{
		height: 90rpx;
		border-top: 1px solid #EEF3F7;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
	.dia-cancel{
		width: 50%;
		height: 100%;
		line-height: 90rpx;
		box-sizing: border-box;
		border-right: 1px solid #EEF3F7;
	}
	.dia-ok{
		width: 50%;
		height: 100%;
		line-height: 90rpx;
		box-sizing: border-box;
	}
</style>

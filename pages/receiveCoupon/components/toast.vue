<template>
	<view class="maskWrapper" >
		<view class="mask" @click="close" :style="{'background':maskColor}">
			
		</view>
		<view class="top">
			<slot name="top"></slot>
		</view>
		<view class="bottom" @click.stop=''>
			<slot name="bottom"></slot>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false
			}
		},
		props: {
			maskColor:{
				type:String,
				// default:'rgba(0, 0, 0, 0.5)'
			}
		},
		methods: {
			close() {
				this.$emit('cancel')
			},
		}
	}
</script>

<style scoped>
	.maskWrapper {
		width: 100%;
		height: 100%;
	}
	.mask{
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 1000;
		background: rgba(0, 0, 0, 0.5);
	}

	.top {
		width: 100%;
		position: fixed;
		top: 0;
		z-index: 1001;
	}

	.bottom {
		width: 100%;
		position: fixed;
		bottom: 0;
		z-index: 1001;
	}
</style>

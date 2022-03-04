<template>
	<div>
		<web-view style="width:100%;height:50%;" :src="linkUrl"></web-view>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				linkUrl: ''
			}
		},
		onLoad(options) {
			this.linkUrl = decodeURIComponent(options.url)
		},
	}
</script>

<style>
	.btn{
		width: 100%;
		position: fixed;
		bottom: 0;
		left:0;
		text-align: center;
		padding-bottom: 20px;
	}
</style>

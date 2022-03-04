<template>
	<div>
		<div class="img fcy">
			<image :src="Imgpath + imgSrc"></image>
		</div>
		
	</div>
</template>

<script>
	import store from '@/store';
	export default {
		data(){
			return {
				imgSrc: ''
			}
		},
		computed: {
			Imgpath() {
				return store.state.Imgpath;
			},
		},
		onLoad(options){
			this.imgSrc = options.imgpath
		}
	}
	
</script>

<style lang="stylus">
	.img{
		width: 100%;
		height 100vh;
		image{
			width: 100%;
		}
	}
</style>

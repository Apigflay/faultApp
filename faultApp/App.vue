<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			console.log(this.$store.state)
			var that = this;
			uni.getStorage({
				key: 'storage_state_fault',
				success: function (res) {
					var vuexData = JSON.parse(res.data);
					Object.keys(vuexData).map(item => {
						that.$store.state[item] = vuexData[item]
					});
				}
			});
			var isLogin=this.$store.getters['AllallIsLogin'];
			if(isLogin){
				uni.reLaunch({//navigateTo redirectTo reLaunch
				    url: '/pages/qa/qa'
				});
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
			
			uni.setStorage({
				key: 'storage_state_fault',
				data: JSON.stringify(this.$store.state),
				success: function () {
				}
			});
			
		}
		
	}
</script>

<style>
	/*每个页面公共css */
	 @import url("./iconfont/iconfont.css");
</style>

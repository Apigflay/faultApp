<template>
	<view class="content">
		<view class="topBtn">
			<text class="backBtn" @click="goPages(0)">取消</text>
			<text class="publishBtn" @click="goPages(1)">发表</text>
		</view>
		<view class="textArea">
			 <textarea placeholder="请输入您的原因..." v-model.trim="textStr" confirm-type="完成" maxlength="50" class="textInput"  />
		</view>
	</view>
</template>

<script>
	import Global_ from '@/lib/js/GlobalObj.js';//全局对象
	import md5 from '@/lib/md5/md5.js'; //md5加密
	export default {
		data() {
			return {
				boInfoId:'',
				loginMsg:{},
				userMsg:{}, 
				textStr:'',//原因
			};
		},
		onLoad(option) {
			this.loginMsg=this.$store.getters['AllallLoginInfo'];
			this.userMsg=this.$store.getters['AllallUserInfo'];
			this.boInfoId=option.boId;
			console.log(option)
			console.log(this.$store.getters['AllallLoginInfo'])
			console.log(this.$store.getters['AllallUserInfo'])
		},
		methods:{
			goPages:function(pageId){
				if(pageId==0){
					// uni.reLaunch({//navigateTo redirectTo reLaunch
					//     url: '/pages/qa/qa'
					// });
					uni.navigateBack({
					    delta: 1
					});
				}else if(pageId){
					this.goRelease()
				}
			},
			goRelease:function(){
				if(this.textStr==''){//
					uni.showToast({
					    title: '不能输入空消息',
					    duration: 2000,
						icon:"none"
					});
				}else{
					console.log(encodeURIComponent(this.textStr))
					console.log(this.boInfoId)
					// -------------------
					uni.request({
					    url: Global_.urlPoint+'/H5/BhGzSome.aspx', //仅为示例，驳回
						method:"GET",
					    data: {
							uid:this.$store.getters['AllallLoginInfo'].Name,//	是	string	登陆名
							gidx:this.boInfoId,//	是	string	故障编号  
							ntype:'2',
							nContent:encodeURIComponent(this.textStr),//
							md5:md5(this.$store.getters['AllallLoginInfo'].Name+this.boInfoId+'2'+Global_.md5key),//	是	String	规则md5(uidx + ntype + gidx + keys)示例：
					    },
					    success: (res) => {
							console.log(res.data)
							if(res.data.code==100){
								uni.showToast({
								    title: '驳回成功',
								    duration: 2000,
									icon:"none",
									complete:function(com){
										uni.reLaunch({//navigateTo redirectTo reLaunch
										    url: '/pages/qa/qa'
										});
									}
								});
							}else{
								uni.showToast({
								    title: '驳回失败',
								    duration: 2000,
									icon:"none"
								});
							}  
					    },
						fail: (err) => {
							// uni.hideLoading();
						}
					});
					// -------------------
				}
			}
		}
	}
</script>

<style lang="scss">
page{
	width: 100%;
	height: 100%;
	background: #F2F6FA;
}
.content{
	width: 100%;
	.topBtn{
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 100rpx;
		padding-top: 100rpx;
		padding-bottom: 40rpx;
		.backBtn{
			font-size: 32rpx;
			font-weight: bold;
			color: #000000;
			padding: 10rpx 18rpx;
			border-radius: 7rpx;
			margin-left: 32rpx;
		}
		.publishBtn{
			font-size: 32rpx;
			color: #FFFFFF;
			padding: 13rpx 28rpx;
			background: linear-gradient(90deg, #2B5BD1, #3868DF);
			border-radius: 7rpx;
			margin-right: 32rpx;
		}
	}
	.textArea{
		.textInput{
			width: 600rpx;
			height: 300rpx;
			margin: auto;
			border-radius: 10rpx;
		}
	}
}
</style>

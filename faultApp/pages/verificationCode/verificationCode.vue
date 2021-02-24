<template>
	<!-- 蓝湖地址 https://lanhuapp.com/web/#/item/project/detailDetach?pid=b752da94-c224-4060-a37a-226112e51879&project_id=b752da94-c224-4060-a37a-226112e51879&image_id=038a5835-70c9-49b6-b8ea-efba9d7a092c -->
	<view class="content">
		<!-- <view class="wifiTipWrap"></view> -->
		<view class="logoArea">
			<img class="icon" src="static/images/icon.png" alt="">
		</view>
		<view class="accountArea">
			<image class="phonoIcon" src="../../static/images/phone.png" mode=""></image>
			<text class="name">输入手机验证码</text>
		</view>
		<!-- 手机验证码区域 -->
		<view class="regCodeArea">
			<wakary-input type="box" @finish="getComponent"></wakary-input>
		</view>
		<view class="tipsArea" v-if="quId==0">已发送验证至+86{{accountStr}}</view>
		<view class="tipsArea" v-if="quId==1">已发送验证至+{{accountStr}}</view>
		<view class="loginBtnArea" @click="goRegCode">
			重新发送({{initNum}})
		</view>
	</view>
</template>

<script>
	// import {Get,Post} from "@/lib/js/GlobalFunction.js";//公共方法
	import Global_ from '@/lib/js/GlobalObj.js';//全局对象
	import md5 from '@/lib/md5/md5.js'; //md5加密
	import wakaryInput from '@/components/wakary-input/wakary-input.vue'
	export default {
		components: {
			wakaryInput
		},
		data() {
			return {
				accountStr:'',//手机号
				quId:'',//区号
				initNum:60,//60s重新发送
				timer:null,//定时器
			}
		},
		onLoad(option) {
			this.accountStr=option.phone;
			this.quId=option.qu;
			this.reSend()
		},
		methods: {
			goRegCode:function(){
				var that = this;
				if(this.initNum==0){
					
					uni.request({
						url: Global_.urlPoint+'/H5/SendTell.aspx', //仅为示例，并非真实接口地址。
						method:"GET",
						data: {
							uid:'0',//	是	string	登陆名  传 0
							ntype:'1',//	是	string	平台编号 1.泰喵 2.越南 3.猫印 4.印尼  获取 传 随便传
							tells:this.accountStr,//	是	String	手机号码
							ltype:this.quId,// 0：国内短信 1：国外短信
							Md5:md5('0'+this.accountStr+Global_.md5key),//	是	string	规则md5(uid+ tells)示例：
							stype:'0',//	是	string	0,登陆，1，发布故障
						},
						success: (res) => {
							if(res.data.code==100){
								that.initNum=60;
								uni.showToast({
									title: '发送成功',
									duration: 2000,
									icon:"none"
								});
							}else{
								uni.showToast({
									title: '发送失败',
									duration: 2000,
									icon:"none"
								});
							}  
						},
						fail: (err) => {
							// uni.hideLoading();
						}
					});
				}else{
					uni.showToast({
						title: '请稍等一会',
						duration: 2000,
						icon:"none"
					});
				}
			},
			reSend:function(){
				var that = this;
				this.timer = setInterval(function(){
					if(that.initNum<=0){
						that.initNum=0;
					}else{
						that.initNum--;
					}
				},1000)
			},
			getComponent:function(phoneCode){//获取code
				console.log(phoneCode)
				uni.showLoading({
				    title: '加载中'
				});
				uni.request({
				    url: Global_.urlPoint+'/H5/GetLogin.aspx', //仅为示例，并非真实接口地址。
					method:"GET",
				    data: {
						uID:this.accountStr,//	是	string	Ntype1时登陆名，2时手机号
						Upwd:phoneCode,//	是	string	Ntype1时账户的密码，2时手机验证码
						ntype:'2',//	是	String	登陆类型1.账户密码登陆 2.手机验证码登陆
						Md5:md5(this.accountStr+phoneCode+Global_.md5key),//	是	string	规则md5(uid+upwd+key)示例：：
				    },
				    success: (res) => {
						uni.hideLoading();
						if(res.data.code==100){
							this.$store.dispatch('SET_allLoginInfo',res.data.msg[0]);
							this.$store.dispatch('SET_allUserInfo',{"account":this.accountStr,"password":phoneCode});
							this.$store.dispatch('SET_allIsLogin',true)
							uni.reLaunch({//navigateTo redirectTo reLaunch
							    url: '/pages/qa/qa'
							});
						}else{
							uni.showToast({
							    title: '验证码错误',
							    duration: 2000,
								icon:"none"
							});
						}  
				    },
					fail: (err) => {
						uni.hideLoading();
					}
				});
			}
		},
		onUnload(){
			clearInterval(this.timer)
		}
	}
</script>

<style lang="scss">
page{
	width: 100%;
	height: 100%;
	background: #fff;
}
.content{
	height: 100%;
	width: 100%;
	.wifiTipWrap{//wifi 电量 显示行
		height: 70rpx;
		width: 100%;
	}
	.logoArea{//logo 
		height: 421rpx;
		width: 100%;
		background-image: url(../../static/images/bg.png);
		background-size: 1680rpx;
		background-position: center -448rpx;
		background-repeat: no-repeat;
		position: relative;
		.icon{
			position: absolute;
			width: 300rpx;
			height: 300rpx;
			top: 251rpx;
			left:225rpx;
		}
	}
	.accountArea{//账号
		width: 540rpx;
		height: 86rpx;
		margin: auto;
		margin-top: 130rpx;
		display: flex;
		align-items: center;
		.phonoIcon{
			width: 32rpx;
			height: 44rpx;
		}
		.name{
			margin-left: 28rpx;
			font-size: 32rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #000000;
		}
	}
	.regCodeArea{//验证码
		margin-top: 40rpx;
		margin-bottom: 25rpx;
	}
	.tipsArea{
		text-align: center;
		font-size: 24rpx;
		font-family: PingFang SC;
		color: #BDBDBD;
	}
	.loginBtnArea{
		width: 268rpx;
		height: 94rpx;
		background: linear-gradient(90deg, #2B5BD1, #3868DF);
		border-radius: 47rpx;
		margin: auto;
		margin-top: 160rpx;
		font-size: 32rpx;
		color: #FFFFFF;
		line-height: 94rpx;
		text-align: center;
	}
	
	
}


</style>

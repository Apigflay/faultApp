<template>
	<!-- 蓝湖地址 https://lanhuapp.com/web/#/item/project/detailDetach?pid=b752da94-c224-4060-a37a-226112e51879&project_id=b752da94-c224-4060-a37a-226112e51879&image_id=038a5835-70c9-49b6-b8ea-efba9d7a092c -->
	<view class="content">
		<!-- <view class="wifiTipWrap"></view> -->
		<view class="logoArea">
			<img class="icon" src="static/images/icon.png" alt="">
		</view>
		<view class="accountArea">
			<input class="account" v-model="accountStr" type="text" value="" placeholder="请输入账号" />
		</view>
		<view class="passwordArea">
			<input class="password" v-model="passwordStr" :password="isPassword" type="text" value="" placeholder="请输入密码" />
			<text class="iconfont icon-yanjing3" @click="changePasswordStatus(false)" v-if="isPassword==true"></text>
			<text class="iconfont icon-eye" @click="changePasswordStatus(true)" v-if="isPassword==false"></text>
		</view>
		<view class="loginBtnArea" @click="goLogin">
			<text class="iconfont icon-iconfontjiantou-copy-copy"></text>
		</view>
		<view class="swithLoginArea">
			<text class="text" @click="goPages">用短信验证码登录</text>
		</view>
	</view>
</template>

<script>
	// import {Get,Post} from "@/lib/js/GlobalFunction.js";//公共方法
	import Global_ from '@/lib/js/GlobalObj.js';//全局对象
	import md5 from '@/lib/md5/md5.js'; //md5加密
	export default {
		data() {
			return {
				isPassword:true,
				accountStr:'',//
				passwordStr:'',//
			}
		},
		onLoad() {
			// this.$store.dispatch('SET_allLoginInfo',{"Name":"yao123456","Job":"","phone":"15713801628",level:'0'});
			// this.$store.dispatch('SET_allUserInfo',{"account":"yao123456","password":"123456"});
			// uni.reLaunch({//navigateTo redirectTo reLaunch
			//     url: '/pages/qa/qa'
			// });
		},
		methods: {
			changePasswordStatus:function(status){
				this.isPassword=status
			},
			goLogin:function(){
				uni.showLoading({
				    title: '加载中'
				});
				uni.request({
				    url: Global_.urlPoint+'/H5/GetLogin.aspx', //仅为示例，并非真实接口地址。
					method:"GET",
				    data: {
						uID:this.accountStr,//	是	string	Ntype1时登陆名，2时手机号
						Upwd:this.passwordStr,//	是	string	Ntype1时账户的密码，2时手机验证码
						ntype:'1',//	是	String	登陆类型1.账户密码登陆 2.手机验证码登陆
						Md5:md5(this.accountStr+this.passwordStr+Global_.md5key),//	是	string	规则md5(uid+upwd+key)示例：：
				    },
				    success: (res) => {
						uni.hideLoading();
						if(res.data.code==100){
							console.log(res.data)
							this.$store.dispatch('SET_allLoginInfo',res.data.msg[0]);
							this.$store.dispatch('SET_allUserInfo',{"account":this.accountStr,"password":this.passwordStr});
							uni.reLaunch({//navigateTo redirectTo reLaunch
							    url: '/pages/qa/qa'
							});
						}else{
							uni.showToast({
							    title: '账号密码错误',
							    duration: 2000,
								icon:"none"
							});
						}  
				    },
					fail: (err) => {
						uni.hideLoading();
					}
				});
			},
			goPages:function(){
				uni.navigateTo({//navigateTo redirectTo reLaunch 规则  登录成功销毁所有页面堆栈 之后 页面堆栈保存
				    url: '/pages/loginByPhone/loginByPhone'
				});
			}
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
		width: 586rpx;
		height: 116rpx;
		border-radius: 58rpx;
		margin: auto;
		background: #f2f3f7;
		margin-top: 130rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.account{
			height: 60rpx;
			margin-left:40rpx ;
		}
	}
	.passwordArea{//密码
		width: 586rpx;
		height: 116rpx;
		border-radius: 58rpx;
		margin: auto;
		background: #f2f3f7;
		margin-top: 27rpx;
		margin-bottom: 60rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.password{
			height: 60rpx;
			margin-left:40rpx ;
		}
		.iconfont{
			font-size: 40rpx;
			width: 80rpx;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			margin-right:40rpx ;
		}
	}
	.loginBtnArea{
		height: 150rpx;
		width: 150rpx;
		border-radius: 50%;
		background-image: -moz-linear-gradient(45deg, #00cafc, #3757fa,#00cafc); /* Firefox */
		background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #00cafc), color-stop(1, #3757fa)); /* Saf4+, Chrome */
		filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#00cafc', endColorstr='#129ef6', GradientType='0'); /* IE*/
		margin: auto;
		text-align: center;
		line-height: 150rpx;
		.iconfont{
			font-size: 46rpx;
			color: #fff;
		}
	}
	.swithLoginArea{//其他登录方式
		margin-top: 30rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		.text{
			margin-left: 30rpx;
			font-size: 30rpx;
			color: #007AFF;
		}
	}
	
}


</style>

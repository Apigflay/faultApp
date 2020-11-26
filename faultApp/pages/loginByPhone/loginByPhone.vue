<template>
	<!-- 蓝湖地址 https://lanhuapp.com/web/#/item/project/detailDetach?pid=b752da94-c224-4060-a37a-226112e51879&project_id=b752da94-c224-4060-a37a-226112e51879&image_id=038a5835-70c9-49b6-b8ea-efba9d7a092c -->
	<view class="content">
		<!-- <view class="wifiTipWrap"></view> -->
		<view class="logoArea">
			<img class="icon" src="static/images/icon.png" alt="">
		</view>
		<view class="accountArea">
			<image class="phonoIcon" src="../../static/images/phone.png" mode=""></image>
			<text class="name">手机号码</text>
		</view>
		<view class="passwordArea">
			<text class="areaCode">+86</text>
			<text class="triangle"></text>
			<input class="password" v-model="accountStr" type="number" value="" placeholder="请输入手机号码" />
			<image @click="clearPhone" class="closeIcon" src="../../static/images/close.png" mode=""></image>
		</view>
		<view class="loginBtnArea" @click="goRegCode">
			获取验证码
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
				accountStr:'',//手机号码 即账号
			}
		},
		onLoad() {

		},
		methods: {
			goRegCode:function(){
				uni.showLoading({
				    title: '加载中'
				});
				uni.request({
				    url: Global_.urlPoint+'/H5/SendTell.aspx', //仅为示例，并非真实接口地址。
					method:"GET",
				    data: {
						uid:'0',//	是	string	登陆名  传 0
						ntype:'1',//	是	string	平台编号 1.泰喵 2.越南 3.猫印 4.印尼  获取 传 随便传
						tells:this.accountStr,//	是	String	手机号码
						Md5:md5('0'+this.accountStr+Global_.md5key),//	是	string	规则md5(uid+ tells)示例：
						stype:'0',//	是	string	0,登陆，1，发布故障
				    },
				    success: (res) => {
						uni.hideLoading();
						console.log(res.data)
						if(res.data.code==100){
							uni.navigateTo({//navigateTo redirectTo reLaunch
							    url: '/pages/verificationCode/verificationCode?phone='+this.accountStr
							});
						}else{
							uni.showToast({
							    title: '请检查手机号',
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
			clearPhone:function(){
				this.accountStr='';
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
	.passwordArea{//密码
		width: 540rpx;
		height: 86rpx;
		border-bottom: 2rpx solid rgba(0,0,0,0.2);
		margin: auto;
		margin-top: 27rpx;
		margin-bottom: 200rpx;
		display: flex;
		align-items: center;
		font-size: 26rpx;
		justify-content: space-between;
		.areaCode{
			
		}
		.triangle{
			  width:0;
			  height:0;   
			  border-left: 10rpx solid transparent;   
			  border-right: 10rpx solid transparent;   
			  border-top: 18rpx solid #000;
		}
		.password{
			height: 60rpx;
			text-indent: 20rpx;
		}
		.closeIcon{
			padding: 10rpx;
			width: 37rpx;
			height: 37rpx;
		}
	}
	.loginBtnArea{
		width: 268rpx;
		height: 94rpx;
		background: linear-gradient(90deg, #2B5BD1, #3868DF);
		border-radius: 47rpx;
		margin: auto;
		font-size: 32rpx;
		color: #FFFFFF;
		line-height: 94rpx;
		text-align: center;
	}
	
	
}


</style>

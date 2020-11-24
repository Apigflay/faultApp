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
			<input class="password" type="text" value="" placeholder="请输入手机号码" />
			<image class="closeIcon" src="../../static/images/close.png" mode=""></image>
		</view>
		<view class="loginBtnArea" @click="goRegCode">
			获取验证码
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {


			}
		},
		onLoad() {

		},
		methods: {
			goRegCode:function(){
				uni.navigateTo({
				    url: '/pages/verificationCode/verificationCode'
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

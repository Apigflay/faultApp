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
			<wakary-input type="box"></wakary-input>
		</view>
		<view class="tipsArea">已发送验证至</view>
		<view class="loginBtnArea" @click="goRegCode">
			重新发送
		</view>
	</view>
</template>

<script>
	import wakaryInput from '@/components/wakary-input/wakary-input.vue'
	export default {
		components: {
			wakaryInput
		},
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

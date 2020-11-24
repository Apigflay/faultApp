<template>
	<!-- 蓝湖地址 https://lanhuapp.com/web/#/item/project/detailDetach?pid=b752da94-c224-4060-a37a-226112e51879&project_id=b752da94-c224-4060-a37a-226112e51879&image_id=038a5835-70c9-49b6-b8ea-efba9d7a092c -->
	<view class="content">
		<!-- <view class="wifiTipWrap"></view> -->
		<view class="logoArea">
			<img class="addIcon" src="static/images/add.png" alt="">
			<img class="photo" src="static/images/icon.png" alt="">
		</view>
		<view class="mainArea">
			<view class="swichBar">
				<text class="qBtn">问答</text>
				<text class="sBtn">统计</text>
			</view>
			<!-- per 问答 -->
			<view class="per">
				<image class="photo" src="../../static/images/icon.png" mode=""></image>
				<view class="infoArea">
					33
				</view>
			</view>
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
	background: #F2F6FA;
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
		background-image: url(../../static/images/bg1.png);
		background-size: 750rpx;
		background-position: top right;
		background-repeat: no-repeat;
		position: relative;
		.addIcon{
			position: absolute;
			width: 45rpx;
			height: 45rpx;
			top: 123rpx;
			left:37rpx;
			padding: 10rpx;
		}
		.photo{
			position: absolute;
			width: 72rpx;
			height: 72rpx;
			border-radius: 50%;
			top: 111rpx;
			right:37rpx;
			padding: 10rpx;
			background: #FFCB25;
		}
	}
	.mainArea{
		width: 710rpx;
		position: relative;
		min-height: 400rpx;
		border-radius: 53rpx 53rpx 0px 0px;
		top: -200rpx;
		padding: 45rpx 20rpx;
		background: #F2F6FA;
		.swichBar{
			height: 70rpx;
			display: flex;
			align-items: center;
			.qBtn{
				width: 145rpx;
				height: 63rpx;
				background: #D7E1F3;
				border-radius: 13rpx;
				font-size: 32rpx;
				font-weight: bold;
				color: #3D6DCF;
				text-align: center;
				line-height: 63rpx;
			}
			.sBtn{
				width: 145rpx;
				height: 63rpx;
				background: #D7E1F3;
				border-radius: 13rpx;
				font-size: 32rpx;
				font-weight: bold;
				color: #ACACAC;
				text-align: center;
				line-height: 63rpx;
				margin-left: 32rpx;
			}
		}
		.per{
			padding: 27rpx 35rpx;
			margin-top: 24rpx;
			min-height: 500rpx;
			background: #fff;
			border-radius: 20rpx;
			position: relative;
			.photo{
				position: absolute;
				width: 72rpx;
				height: 72rpx;
				border-radius: 50%;
				background: red;
			}
			.infoArea{
				width: 550rpx;
				background:blue;
				margin-left: 90rpx;
			}
		}
	}
	
	
	
	
	
	
}


</style>

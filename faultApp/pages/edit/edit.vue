<template>
	<view class="content">
		<view class="topBtn">
			<text class="backBtn">取消</text>
			<text class="publishBtn">发表</text>
		</view>
		<view class="textArea">
			 <textarea placeholder="请输入您的问题..." confirm-type="完成" maxlength="200" class="textInput"  />
		</view>
		<view class="uploadImgArea">
			<image v-for="(item,index) in 1" :key="index" class='perImg img' src="../../static/images/sex.jpg" mode=""></image>
			<image class="addImg img" src="../../static/images/add.png" mode=""></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
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
	.uploadImgArea{
		height: 420rpx;
		width: 630rpx;
		margin: auto;
		.img{
			width: 200rpx;
			height: 200rpx;
			margin-right: 10rpx;
			margin-bottom: 10rpx;
		}
	}
}
</style>

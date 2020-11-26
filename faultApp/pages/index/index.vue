<template>
	<view class="content">
		<view class="wifiTipWrap"></view>
		<view class="logoArea">
			<text class="iconfont icon-guzhang"></text>
			<text class="text">FAULT APP</text>
		</view>
		<view class="accountArea">
			<input class="aInput" v-model="accountStr" type="text" value="" />
		</view>
		<view class="passwordArea">
			<input class="pInput" v-model="passwordStr" type="text" value="" />
		</view>
		<view class="passwordArea">
			<input class="pInput" v-model="phoneStr" type="text" value="" />
		</view>
		<view class="loginBtnArea" @click="goRegister">
			<text class="iconfont icon-iconfontjiantou-copy-copy"></text>
			
		</view>
	</view>
</template>

<script>
	import md5 from '@/lib/md5/md5.js';
	export default {
		data() {
			return {
				accountStr:'',
				passwordStr:'',
				phoneStr:'',
			}
		},
		onLoad() {
			this.textMd5()
		},
		methods: {
			textMd5:function(){
				// console.log(md5('123'))
			},
			goRegister:function(){
				//yao123456 123456   yao12345678 12345678
				console.log(this.accountStr)
				console.log(this.passwordStr)
				console.log(this.phoneStr)
				console.log({
						uID:this.accountStr,//	是	string	登陆名
						Upwd:this.passwordStr,//	是	string	账户的密码
						Tells:this.phoneStr,//	是	String	用户电话号码
						Jobs:'boss',//	否	String	职位
						ntype:'0',//	是	String	所属平台，0.全部 1.泰喵 2.越南 3.猫印 4.印尼
						Md5:md5(this.accountStr+this.passwordStr+this.phoneStr+'0'+'HASn-71AS-K812'),//	是	string	规则md5(uid+upwd+tells+ntype+key)示例：
						key:'HASn-71AS-K812',//	否	string	用于md5加密使用，检验秘钥: HASn-71AS-K812
				    })
				uni.request({//http://173.248.234.215:86
				    url: 'http://173.248.234.215:86'+'/H5/InsertUser.aspx', //仅为示例，并非真实接口地址。
					method:"GET",
				    data: {
						uID:this.accountStr,//	是	string	登陆名
						Upwd:this.passwordStr,//	是	string	账户的密码
						Tells:this.phoneStr,//	是	String	用户电话号码
						Jobs:'boss',//	否	String	职位
						ntype:'0',//	是	String	所属平台，0.全部 1.泰喵 2.越南 3.猫印 4.印尼
						Md5:md5(this.accountStr+this.passwordStr+this.phoneStr+'0'+'HASn-71AS-K812'),//	是	string	规则md5(uid+upwd+tells+ntype+key)示例：
						key:'HASn-71AS-K812',//	否	string	用于md5加密使用，检验秘钥: HASn-71AS-K812
				    },
				    success: (res) => {
				        console.log(res.data);
				        
				    }
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
	/* background: red; */
}
.content{
	height: 100%;
	width: 100%;
	.wifiTipWrap{//wifi 电量 显示行
		height: 70rpx;
		width: 100%;
	}
	.logoArea{//logo 
		height: 104rpx;
		margin-top: 226rpx;
		margin-bottom: 70rpx;
		line-height: 104rpx;
		text-align: center;
		display: flex;
		align-items: cennter;
		justify-content: center;
		.iconfont{
			font-size: 80rpx;	
			background-image:-webkit-linear-gradient(45deg,#00cafc,#129ef6,#129ef6); 
			-webkit-background-clip:text; 
			-webkit-text-fill-color:transparent; 
		}
		.text{
			font-size: 38rpx;
			margin-left: 20rpx;
			background-image:-webkit-linear-gradient(66deg,#00cafc,#129ef6,#129ef6);
			-webkit-background-clip:text; 
			-webkit-text-fill-color:transparent;
		}
	}
	.accountArea{//账号
		width: 586rpx;
		height: 116rpx;
		border-radius: 58rpx;
		margin: auto;
		background: #f2f3f7;
		.aInput{
			border: 1px solid #000;
		}
	}
	.passwordArea{//密码
		width: 586rpx;
		height: 116rpx;
		border-radius: 58rpx;
		margin: auto;
		background: #f2f3f7;
		margin-top: 27rpx;
		margin-bottom: 120rpx;
		.pInput{
			border: 1px solid #000;
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
	
}


</style>

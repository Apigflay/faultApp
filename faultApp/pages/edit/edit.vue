<template>
	<view class="content">
		<view class="topBtn">
			<text class="backBtn" @click="goPages(0)">取消</text>
			<text class="publishBtn" @click="goPages(1)">发表</text>
		</view>
		<view class="textArea">
			 <textarea placeholder="请输入您的问题..." v-model="textStr" confirm-type="完成" maxlength="200" class="textInput"  />
		</view>
		<view class="uploadImgArea">
			<image v-for="(item,index) in 1" :key="index" class='perImg img' src="../../static/images/sex.jpg" mode=""></image>
			<image @click="uploadImg" class="addImg img" src="../../static/images/add.png" mode=""></image>
		</view>
		{{picData}}
	</view>
</template>

<script>
	import {sendData,Get,Post} from "@/lib/js/GlobalFunction.js";//公共方法
	import Global_ from '@/lib/js/GlobalObj.js';//全局对象
	import md5 from '@/lib/md5/md5.js'; //md5加密
	export default {
		data() {
			return {
				loginInfo:null,//
				userInfo:null,//
				textStr:'',
				imgData:['','',''],//上传图片  最多3张
				picData:null,
			};
		},
		onLoad() {
			this.loginInfo=this.$store.getters['AllallLoginInfo'];
			this.userInfo=this.$store.getters['AllallUserInfo'];
			console.log(this.$store.getters['AllallLoginInfo'])
			console.log(this.$store.getters['AllallUserInfo'])
		},
		methods:{
			goPages:function(pageId){
				if(pageId==0){
					uni.reLaunch({//navigateTo redirectTo reLaunch
					    url: '/pages/qa/qa'
					});
				}else if(pageId){
					this.goRelease()
				}
			},
			goRelease:function(){//发布故障
				uni.showLoading({
				    title: '发布中'
				});
				uni.request({
				    url: Global_.urlPoint+'/H5/InsertGZSome.aspx', //仅为示例，并非真实接口地址。
					method:"GET",
				    data: {
						uid:this.userInfo.account,//	是	string	登陆名
						ntype:this.userInfo.password,//	是	string	账户的密码
						ncount:this.textStr,//	是	String	提交的故障内容
						pho:'',//	是	String	故障图片1，图片Url地址 
						pho1:'',//	是	String	故障图片2，图片Url地址，如没有，可以为””
						pho2:'',//	是	string	故障图片3，图片Url地址
						Md5:md5(this.userInfo.account+this.userInfo.password+Global_.md5key),//	是	string	规则md5(uid+ ntype +key)示例：：
				    },
				    success: (res) => {
						uni.hideLoading();
						if(res.data.code==100){
							console.log(res.data)
							this.noticeAll()
							
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
			uploadImg:function(){
				var that = this;
				uni.chooseImage({
				    count: 3, //默认9
				    sizeType: ['original'], //original 原图 compressed 压缩图 可以指定是原图还是压缩图，默认二者都有
				    sourceType: ['album'], //album 从相册选图，camera 使用相机
				    success: function (res) {
						console.log(res)
						
						var fileObj={file:null};
						var tempFiles =res.tempFiles;
						fileObj.file=tempFiles;
						console.log(fileObj)
						// --------------------upload-----------
						uni.showLoading({
						    title: '上传中'
						});
						uni.request({
						    url: Global_.urlPoint+'/H5/PhoTest.aspx', //仅为示例，并非真实接口地址。GetPho.aspx
							method:"POST",
						    data: fileObj,
						    success: (res) => {
								uni.hideLoading();
								console.log(res.data)
								if(res.data.code==100){
									console.log(res.data)
									// this.$store.dispatch('SET_allLoginInfo',res.data.msg[0]);
									// uni.reLaunch({//navigateTo redirectTo reLaunch
									//     url: '/pages/qa/qa'
									// });
								}else{
									uni.showToast({
									    title: '上传失败',
									    duration: 2000,
										icon:"none"
									});
								}  
						    },
							fail: (err) => {
								uni.hideLoading();
							}
						});
						// --------------------upload-----------
				    }
				});
			},
			noticeAll:function(){//通知
				uni.showLoading({
				    title: '故障通知中'
				});
				uni.request({
				    url: Global_.urlPoint+'/H5/SendTell.aspx', //仅为示例，并非真实接口地址。
					method:"GET",
				    data: {
						uid:this.loginInfo.Name,//	是	string	登陆名  传 0
						ntype:this.loginInfo.level,//	是	string	平台编号 1.泰喵 2.越南 3.猫印 4.印尼  获取 传 随便传
						tells:this.loginInfo.phone,//	是	String	手机号码
						Md5:md5(this.loginInfo.Name+this.loginInfo.phone+Global_.md5key),//	是	string	规则md5(uid+ tells)示例：
						stype:'1',//	是	string	0,登陆，1，发布故障
				    },
				    success: (res) => {
						uni.hideLoading();
						console.log(res.data)
						if(res.data.code==100){
							uni.reLaunch({//navigateTo redirectTo reLaunch
							    url: '/pages/qa/qa'
							});
						}else{
							uni.showToast({
							    title: '故障通知失败',
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

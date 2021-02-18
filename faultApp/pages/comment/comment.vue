<template>
	<view class="content">
		<view class="topBtn">
			<text class="backBtn" @click="goPages(0)">取消</text>
			<text class="publishBtn" @click="goPages(1)">发表</text>
		</view>
		<view class="textArea">
			 <textarea placeholder="请输入解答内容..." v-model.trim="textStr" confirm-type="完成" maxlength="200" class="textInput"  />
		</view>
		<view class="uploadImgArea">
			<image v-for="(item,index) in picData" :key="index" @click="priviewImg(item)" class='perImg img' :src="item" mode=""></image>
			<image v-if="uploadAddBtnStatus" @click="uploadImg" class="addImg img" src="../../static/images/add.png" mode=""></image>
		</view>
	</view>
</template>

<script>
	import {sendData,Get,Post} from "@/lib/js/GlobalFunction.js";//公共方法
	import Global_ from '@/lib/js/GlobalObj.js';//全局对象
	import md5 from '@/lib/md5/md5.js'; //md5加密
	import axios from '@/lib/axios/axios.js'; //请求
	export default {
		data() {
			return {
				loginInfo:null,// 当前账户登录信息
				userInfo:null,// 当前账户
				textStr:'',//
				pushUid:'',//发布者登陆名
				pushGidx:'',//故障id
				imgData:['','',''],//上传图片  最多3张
				picData:[],//回调显示图片
				uploadAddBtnStatus:true,//加号显示   默认显示
				uploadInClickStatus:false,//点击发布是否在上传中 默认不是
			};
		},
		onLoad(option) {
			this.loginInfo=this.$store.getters['AllallLoginInfo'];
			this.userInfo=this.$store.getters['AllallUserInfo'];
			console.log(this.$store.getters['AllallLoginInfo'])
			console.log(this.$store.getters['AllallUserInfo'])
			this.pushUid=option.name;
			this.pushGidx=option.id;
		},
		methods:{
			priviewImg:function(picSrc){
				uni.previewImage({
					urls: [picSrc],
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			goPages:function(pageId){
				if(pageId==0){
					uni.reLaunch({//navigateTo redirectTo reLaunch
					    url: '/pages/qa/qa'
					});
				}else if(pageId==1){
					this.goRelease()
				}
			},
			goRelease:function(){//发布故障
				console.log(this.uploadInClickStatus)
				if(this.uploadInClickStatus==true){//上传中无法发布
					
				}else if(this.textStr==''){
					uni.showToast({
					    title: '不能发送空的消息',
					    duration: 2000,
						icon:"none"
					});
				}else{
					uni.showLoading({
					    title: '发布中'
					});
					uni.request({
					    url: Global_.urlPoint+'/H5/EditGzSome.aspx', //仅为示例，并非真实接口地址。
						method:"POST",
						header:{'content-type':'application/x-www-form-urlencoded'},
					    data: {
							uid:this.pushUid,//	是	string	故障提交者登陆名
							gidx:this.pushGidx,//	是	string	故障编号
							ncount:encodeURIComponent(this.textStr),//	是	String	处理的内容
							cpho:this.imgData[0],//	是	String	图片地址1
							Cpho1:this.imgData[1],//	是	String	图片地址1
							Cpho2:this.imgData[2],//	是	String	图片地址1，没有就传””
							cidx:this.$store.getters['AllallLoginInfo'].Name,//	是	string	处理者登陆名
							Md5:md5(this.pushUid+this.pushGidx+this.$store.getters['AllallLoginInfo'].Name+Global_.md5key),//	是	string	规则md5(uidx + gidx + cidx +key)示例：D8D69FAE8B23D18B753C18558D09FAB8
							
					    },
					    success: (res) => {
							uni.hideLoading();
							if(res.data.code==100){
								console.log(res.data)
								uni.reLaunch({//navigateTo redirectTo reLaunch
								    url: '/pages/qa/qa'
								});
								// this.noticeAll()
								
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
				}
				
			},
			uploadImg:function(){
				
				var that = this;
				uni.chooseImage({
				    count: 3, //默认9
				    sizeType: ['original'], //original 原图 compressed 压缩图 可以指定是原图还是压缩图，默认二者都有
				    sourceType: ['album'], //album 从相册选图，camera 使用相机
				    success: function (res) {
						uni.showLoading({
						    title: '上传中'
						});
						var tempFilesList = res.tempFiles;
						var tempFilePathsList = res.tempFilePaths;
						var imgLength = res.tempFiles.length;
						var filelist = [];
						for(var i = 0 ; i < imgLength ; i ++){
							var obj = {};
							obj.name = "file" + i;
							obj.file = tempFilesList[i];
							obj.uri = tempFilePathsList[i];
							filelist.push(obj)
						}
						console.log(filelist)
						// --------uploadfile------新版 h5 iOS Android 兼容
						var url =Global_.urlPoint+'/H5/GetPho.aspx';// GetPho.aspx
						uni.uploadFile({
							url: url, //仅为示例，非真实的接口地址
							files:filelist,
							success: (res1) => {
								uni.hideLoading();
								if(res1.statusCode==200){
									console.log(res1.data)
									var response = JSON.parse(res1.data);
									console.log(response)
									if(response.code==100){
										that.picData=response.msg.split(',');
										console.log(that.picData)
										console.log(response.msg.split(',').length)
										if(response.msg.split(',').length==1){
											that.imgData[0]=response.msg.split(',')[0];
										}else if(response.msg.split(',').length==2){
											that.imgData[0]=response.msg.split(',')[0];
											that.imgData[1]=response.msg.split(',')[1];
										}else if(response.msg.split(',').length==3){
											that.imgData[0]=response.msg.split(',')[0];
											that.imgData[1]=response.msg.split(',')[1];
											that.imgData[2]=response.msg.split(',')[2];
										}else{
											that.imgData[0]=response.msg.split(',')[0];
											that.imgData[1]=response.msg.split(',')[1];
											that.imgData[2]=response.msg.split(',')[2];
										}
										// that.uploadAddBtnStatus=false;
									}else{
										uni.showToast({
											title: '上传失败,系统错误',
											duration: 2000,
											icon:"none"
										});
									}
								}else{
									uni.showToast({
										title: '上传失败,请再次尝试',
										duration: 2000,
										icon:"none"
									});
								}
								var response = JSON.parse(res1.data);
								console.log(response)
								if(response.code==100){
									that.picData=response.msg.split(',');
									console.log(that.picData)
									console.log(response.msg.split(',').length)
									if(response.msg.split(',').length==1){
										that.imgData[0]=response.msg.split(',')[0];
									}else if(response.msg.split(',').length==2){
										that.imgData[0]=response.msg.split(',')[0];
										that.imgData[1]=response.msg.split(',')[1];
									}else if(response.msg.split(',').length==3){
										that.imgData[0]=response.msg.split(',')[0];
										that.imgData[1]=response.msg.split(',')[1];
										that.imgData[2]=response.msg.split(',')[2];
									}else{
										that.imgData[0]=response.msg.split(',')[0];
										that.imgData[1]=response.msg.split(',')[1];
										that.imgData[2]=response.msg.split(',')[2];
									}
								}
								
							},
							fail: (err1) => {
								console.log(err1)
								uni.hideLoading();
								uni.showToast({
									title: '上传失败',
									duration: 2000,
									icon:"none"
								});
							},
							complete(com) {
								console.log(com)
								that.uploadInClickStatus=false;
							}
						});
						console.log(222)
						// --------uploadfile------
						
						
						
						
						// --------------upload--------
						// var formData = new FormData();
						// if(res.tempFilePaths.length==1){
						// 	formData.append('file',res.tempFiles[0]);
						// }else if(res.tempFilePaths.length==2){
						// 	formData.append('file',res.tempFiles[0]);
						// 	formData.append('file1',res.tempFiles[1]);
						// }else if(res.tempFilePaths.length==3){
						// 	formData.append('file',res.tempFiles[0]);
						// 	formData.append('file1',res.tempFiles[1]);
						// 	formData.append('file2',res.tempFiles[2]);
						// }else{
						// 	formData.append('file',res.tempFiles[0]);
						// 	formData.append('file1',res.tempFiles[1]);
						// 	formData.append('file2',res.tempFiles[2]);
						// }
						// console.log(formData)
						
						// var url =Global_.urlPoint+'/H5/GetPho.aspx';// GetPho.aspx
						// axios.post(url,formData,{headers: {'Content-Type': 'multipart/form-data'}})
						// .then(function (response) {
						// 	uni.hideLoading();
						// 	if(response.data.code==100){//上传成功  回调显示图片
						// 		console.log(response.data.msg)
						// 		console.log(response.data.msg.split(','))
						// 		that.picData=response.data.msg.split(',');
						// 		console.log(response.data.msg.split(',').length)
						// 		if(response.data.msg.split(',').length==1){
						// 			that.imgData[0]=response.data.msg.split(',')[0];
						// 		}else if(response.data.msg.split(',').length==2){
						// 			that.imgData[0]=response.data.msg.split(',')[0];
						// 			that.imgData[1]=response.data.msg.split(',')[1];
						// 		}else if(response.data.msg.split(',').length==3){
						// 			that.imgData[0]=response.data.msg.split(',')[0];
						// 			that.imgData[1]=response.data.msg.split(',')[1];
						// 			that.imgData[2]=response.data.msg.split(',')[2];
						// 		}else{
						// 			that.imgData[0]=response.data.msg.split(',')[0];
						// 			that.imgData[1]=response.data.msg.split(',')[1];
						// 			that.imgData[2]=response.data.msg.split(',')[2];
						// 		}
						// 	}
						// })
						// .catch(function (error) {
						// 	console.log(error);
						// 	uni.hideLoading();
						// 	uni.showToast({
						// 		title: '上传失败',
						// 		duration: 2000,
						// 		icon:"none"
						// 	});
						// });
						// --------------------upload-----------

				    }
				});
			},
			noticeAll:function(){//通知  发表评论不通知
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

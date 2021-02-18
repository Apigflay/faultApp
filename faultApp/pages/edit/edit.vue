<template>
	<view class="content">
		<view class="topBtn">
			<text class="backBtn" @click="goPages(0)">取消</text>
			<text class="publishBtn" @click="goPages(1)">发表</text>
		</view>
<!-- 		<view class="pidArea">
			<radio-group class="list" @change="radioChange">
				<label class="lable uni-list-cell uni-list-cell-pd" v-for="(item, index) in items" :key="item.value">
					<view>
						<radio :value="item.value" :checked="index === current" />
					</view>
					<view>{{item.name}}</view>
				</label>
			</radio-group>
		</view> -->
		<view class="pidArea1">
			<radio-group class="list" @change="radioChange1">
				<label :class="'lable'+index" class="lable uni-list-cell uni-list-cell-pd" v-for="(item, index) in itemsV" :key="item.value">
					<view>
						<radio :value="item.value" :checked="index === currentV" />
					</view>
					<view>{{item.name}}</view>
				</label>
			</radio-group>
		</view>
		<view class="textArea">
			 <textarea placeholder="请输入您的问题..." v-model.trim="textStr" confirm-type="完成" maxlength="200" class="textInput"  />
		</view>
		<view class="uploadImgArea">
			<template v-if="picData.length>0&&currentV==0">
			<image  v-for="(item,index) in picData" :key="index" class='perImg img' @click="priviewImg(item)" :src="item" mode=""></image>
			</template>
			<video class="perImg img video" :src="picData[0]" controls v-if="picData.length>0&&currentV==1"></video>
			<image v-if="uploadAddBtnStatus" @click="uploadFile" class="addImg img" src="../../static/images/add.png" mode=""></image>
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
				loginInfo:null,//
				userInfo:null,//
				textStr:'',
				imgData:['','',''],//上传图片  最多3张
				picData:[],//回调显示图片
				// ---平台id选择---
				items: [{value: 'USA',name: '泰喵'},
				        {value: 'CHN',name: '越南',checked: 'true'},
						{value: 'BRA',name: '猫印'},
				        {value: 'JPN',name: '印尼'}
				        ],
				current: 0,//默认平台
				// 图片视频选择
				itemsV: [{value: 'USA',name: '图片',checked: 'true'},
				        {value: 'CHN',name: '视频'},
				        ],
				currentV: 0,//图片 0 视频 1
				uploadAddBtnStatus:true,//加号显示   默认显示  
				uploadInClickStatus:false,//点击发布是否在上传中 默认不是
				
			};
		},
		onLoad() {
			this.loginInfo=this.$store.getters['AllallLoginInfo'];
			this.userInfo=this.$store.getters['AllallUserInfo'];
			console.log(this.$store.getters['AllallLoginInfo'])
			console.log(this.$store.getters['AllallUserInfo'])
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
				}else if(pageId){
					this.goRelease()
				}
			},
			radioChange: function(evt) {
				for (let i = 0; i < this.items.length; i++) {
					if (this.items[i].value === evt.target.value) {
						this.current = i;
						break;
					}
				}
				console.log(this.current)
			},
			radioChange1: function(evt) {
				for (let i = 0; i < this.items.length; i++) {
					if (this.items[i].value === evt.target.value) {
						this.currentV = i;
						console.log(this)
						this.imgData=['','',''];
						this.picData=[];
						break;
					}
				}
				console.log(this.currentV)
			},
			goRelease:function(){//发布故障
				var that = this;
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
					console.log(this.imgData)
					console.log(this.loginInfo.level)
					uni.request({
					    url: Global_.urlPoint+'/H5/InsertGZSome.aspx', //仅为示例，并非真实接口地址。
						method:"POST",
						// header:{'content-type':'application/json'},
						header:{'content-type':'application/x-www-form-urlencoded'},
					    data: {
							uid:this.loginInfo.Name,//	是	string	登陆名
							ntype:this.loginInfo.level,//	是	string	平台id  1.泰喵 2.越南 3.猫印 4.印尼   //(this.current+1).toString() no use
							ncount:encodeURIComponent(this.textStr),//	是	String	提交的故障内容
							pho:this.imgData[0],//	是	String	故障图片1，图片Url地址 
							pho1:this.imgData[1],//	是	String	故障图片2，图片Url地址，如没有，可以为””
							pho2:this.imgData[2],//	是	string	故障图片3，图片Url地址
							Md5:md5(this.loginInfo.Name+this.loginInfo.level+Global_.md5key),//	是	string	规则md5(uid+ ntype +key)示例：：
					    },
					    success: (res) => {
							uni.hideLoading();
							if(res.data.code==100){
								console.log(res.data)
								this.noticeAll()
								this.uploadInClickStatus=true;
								
							}else{
								uni.showToast({
								    title: '发布失败',
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
			uploadFile:function(){//上传
				this.uploadInClickStatus=true;
				// console.log(encodeURI(this.textStr))
				// console.log(encodeURIComponent(this.textStr))
				// console.log(decodeURIComponent())
				if(this.currentV==0){
					this.uploadImg()
				}else if(this.currentV==1){
					this.uploadVideo()
				}
			},
			uploadImg:function(){
				console.log('开始选择图片')
				var that = this;
				uni.chooseImage({
				    count: 3, //默认9
				    sizeType: ['compressed'], //original 原图 compressed 压缩图 可以指定是原图还是压缩图，默认二者都有
				    sourceType: ['album'], //album 从相册选图，camera 使用相机
				    success: function (res) {
						console.log('1quexiao')
						// console.log(res)
						// console.log(res.tempFiles)
						// console.log(res.tempFilePaths)
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
							complete:function(com){
								that.uploadInClickStatus=false;
							}
						});
						console.log(222)
						// --------uploadfile------
						
						// --------------upload--------
						// ------原h5上传图片视频方法可用
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

				    },
					fail:function(fa){
						console.log(fa)
						that.uploadInClickStatus=false;
					},
					complete(com) {
						console.log(com)
						// that.uploadInClickStatus=false;
					}
				});
			},
			// --------video-------
			uploadVideo:function(){
				
				var that = this;
				uni.chooseVideo({
				    count: 3,
				    sourceType: ['camera', 'album'], //album 从相册选视频，camera 使用相机拍摄，默认为：['album', 'camera']
				    success: function (res) {
						console.log(res)
						uni.showLoading({
						    title: '上传中'
						});
						
						//  iOS h5 android -----
						var filelist = [];
						var obj = {};
						obj.name = "file1";
						obj.file = res.tempFile;
						obj.uri = res.tempFilePath;
						filelist.push(obj)
						console.log(filelist)
						var url =Global_.urlPoint+'/H5/GetPho.aspx';// GetPho.aspx
						uni.uploadFile({
							url: url, //仅为示例，非真实的接口地址
							files:filelist,
							success: (res1) => {
								uni.hideLoading();
								if(res1.statusCode==200){
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
										title: '上传失败,文件过大',
										duration: 2000,
										icon:"none"
									});
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
							complete:function(com){
								that.uploadInClickStatus=false;
							}
						});
						console.log(222)
						// --ios h5  android ----
						
						// --------------upload--------原h5 上传视频 
						// var formData = new FormData();
						// formData.append('file',res.tempFile);
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
			
				    },
					fail:function(fa){
						console.log(fa)
						// that.uploadInClickStatus=false;
					}
					
				});
			},
			// ---------video------
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
						ltype:this.loginInfo.phoneType,// 0：国内短信 1：国外短信
						Md5:md5(this.loginInfo.Name+this.loginInfo.phone+Global_.md5key),//	是	string	规则md5(uid+ tells)示例：
						stype:'1',//	是	string	0,登陆，1，发布故障
				    },
				    success: (res) => {
						console.log(res.data)
						if(res.data.code==100){
							uni.hideLoading();
							uni.reLaunch({//navigateTo redirectTo reLaunch
							    url: '/pages/qa/qa'
							});
						}else{
							uni.showToast({
							    title: '故障通知失败',
							    duration: 2000,
								icon:"none",
								complete:function(com){
									uni.hideLoading();
									uni.reLaunch({//navigateTo redirectTo reLaunch
									    url: '/pages/qa/qa'
									});
								}
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
	.pidArea{//平台id选择
		height: 100rpx;
		display: flex;
		// margin-bottom: 40rpx;
		.list{
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: space-around;
			.lable{
				display: flex;
			}
		}
	}
	.pidArea1{//视频 图片选择
		height: 100rpx;
		display: flex;
		margin-bottom: 40rpx;
		.list{
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			// justify-content: space-around;
			.lable{
				display: flex;
			}
			.lable0{
				margin-left: 30rpx;
			}
			.lable1{
				margin-left: 30rpx;
			}
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
		.video{
			width: 100%;
		}
	}
}
</style>

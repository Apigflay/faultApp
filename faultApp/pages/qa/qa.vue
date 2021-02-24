<template>
	<view class="content">
		<!-- <view class="wifiTipWrap"></view> -->
		<view class="logoArea">
			<img class="addIcon" @click="goPages(0)" src="static/images/add.png" alt="">
			<img class="photo" src="static/images/icon.png" alt="">
		</view>
		<view class="mainArea">
			<view class="swichBar">
				<text class="qBtn">问答</text>
				<text class="sBtn" @click="goPages(1)">统计</text>
				<text @click="goPages(3)" class="iconfont icon-tuichu1"></text>
			</view>
			<!-- 时间选择 -->
			<view class="dateArea">
				<picker class="picker1" mode="date" :value="date1" :start="startDate" :end="endDate" @change="bindDateChange1">
					<view class="uni-input">{{date1}}</view>
				</picker>
				<text class="zhi">至</text>
				<picker class="picker2" mode="date" :value="date2" :start="startDate" :end="endDate" @change="bindDateChange2">
					<view class="uni-input">{{date2}}</view>
				</picker>
				<text @click="goRefeashList" class="iconfont icon-f14"></text>
			</view>
			<!-- 平台区域选择 -->
			<view class="platformArea" v-if="userLoginPwer==0">
				<span @click="swichPlatformaId(index)" class="span" v-for="(item,index) in platformaStr" :key="index" :class="index==platformId?'acSpan':''">{{item}}</span>
			</view>
			<!-- 故障处理情况选择 -->
			<view class="pidArea">
				<radio-group class="list" @change="radioChange">
					<label class="lable uni-list-cell uni-list-cell-pd" v-for="(item, index) in items" :key="item.value">
						<view>
							<radio :value="item.value" :checked="index === current" />
						</view>
						<view>{{item.name}}</view>
					</label>
				</radio-group>
			</view>
			<!-- per 问答 -->
			<view class="per" v-for="(item,index) in faultInitMsg" :key="index">
				<image class="photo" src="../../static/images/sex.jpg" mode=""></image>
				<view class="infoArea">
					<view @click="goDelAndBo(1,item)" v-if="item.Name==loginMsg.Name&&item.nState==0" class="delBtn">删除</view>
					<view class="bohuiBtn" v-if="item.nState==0" @click="goDelAndBo(2,item)">驳回</view>
					<view class="name">
						{{item.Name}}
					</view>
					<view class="sayText">
						<!-- {{item.nContent}} -->
						{{decodeURIComponent(item.nContent)}}
					</view>
					<template v-if="item.isVideo==1">
						<view class="videoArea">
							<video class='video' :src="item.pho" controls></video>
						</view>
					</template>
					<template v-if="item.isVideo==0">
						<view class="imgArea" v-if="item.pho!=''||item.pho1!=''||item.pho2!=''">
							<image class="img img1" v-if="item.pho!=''" @click="priviewImg(item.pho)" :src="item.pho" mode=""></image>
							<image class="img img2" v-if="item.pho1!=''" @click="priviewImg(item.pho1)" :src="item.pho1" mode=""></image>
							<image class="img img3" v-if="item.pho2!=''" @click="priviewImg(item.pho2)" :src="item.pho2" mode=""></image>
						</view>
					</template>
					<view class="timeArea">
						<text class="time">{{item.newNtime}}</text>
						<!-- <text class="time">{{new Date(item.ntime).getFullYear()}}-{{new Date(item.ntime).getMonth()+1}}-{{new Date(item.ntime).getDate()}} {{new Date(item.ntime).getHours()}}:{{new Date(item.ntime).getMinutes()}}</text> -->
						<view class="more">
							<image @click="goCommet(item)" class="moreImg" src="../../static/images/msg.png" mode=""></image>
						</view>
					</view>
					<view class="commentArea" >
						<!-- v-if="item.param!=''" -->
						<text class="comName">{{item.param}}</text>
						<text v-if="item.param!=''"> ： </text>
						{{item.DescriptNew}}
						<!-- {{item.Descript}} -->
						{{decodeURIComponent(item.Descript)}}
					</view>
					<view class="imgArea" v-if="item.cpho!=''||item.cpho1!=''||item.cpho2!=''">
						<image class="img img1" v-if="item.cpho!=''" @click="priviewImg(item.cpho)" :src="item.cpho" mode=""></image>
						<image class="img img2" v-if="item.cpho1!=''" @click="priviewImg(item.cpho1)" :src="item.cpho1" mode=""></image>
						<image class="img img3" v-if="item.cpho2!=''" @click="priviewImg(item.cpho2)" :src="item.cpho2" mode=""></image>
					</view>
				</view>
			</view>
			<!-- per 问答 -->
			
			<!-- per 问答 -->
		</view>
		
		
		<!-- 驳回输入 -->
		<cover-view class="boAreaTip" v-if="boTipBtnStatus">
			<div class="boArea">
				<textarea placeholder="请输入驳回原因..." v-model.trim="textStr" confirm-type="完成" maxlength="50" class="botextInput"  />
				<div class="btnArea">
					<span class="span1 span" @click="goBoCC(0)">取消</span>
					<span class='span2 span' @click="goBoCC(1)">确定</span>
				</div>
				
			</div>
		</cover-view>
	</view>
</template>

<script>
	// import {Get,Post} from "@/lib/js/GlobalFunction.js";//公共方法
	import Global_ from '@/lib/js/GlobalObj.js';//全局对象
	import md5 from '@/lib/md5/md5.js'; //md5加密
	export default {
		components: {
		},
		data() {
			var time1 = (new Date).getTime() - 24 * 60 * 60 * 1000*7;
			var sevenD1 = new Date(time1); // 获取的是前一天日期
			// var currentDate1=sevenD1.getFullYear()+"-"+(sevenD1.getMonth()+1)+"-"+sevenD1.getDate();
			var currentDate1=sevenD1.getFullYear()+"-"+((sevenD1.getMonth()+1)<10?('0'+(sevenD1.getMonth()+1)):(sevenD1.getMonth()+1))+"-"+(sevenD1.getDate()<10?('0'+sevenD1.getDate()):sevenD1.getDate());
			
			// var currentDate2 = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate();
			var currentDate2 = new Date().getFullYear()+"-"+((new Date().getMonth()+1)<10?('0'+(new Date().getMonth()+1)):(new Date().getMonth()+1))+"-"+(new Date().getDate()<10?('0'+new Date().getDate()):new Date().getDate());
			return {
				faultInitMsg:[],//初始故障信息
				
				date1: currentDate1,
				date2: currentDate2,
				
				items: [{value: 'USA',name: '全部',checked: 'true'},
				        {value: 'CHN',name: '刚提交'},
						{value: 'BRA',name: '驳回'},
				        {value: 'JPN',name: '处理完成'}
				        ],
				current: 0,//默认平台 -1，全部，0，刚提交的，1驳回的，2处理完成的
				loginMsg:{},
				userMsg:{}, 
				userLoginPwer:'',//用户权限 0.全部 1.泰喵 2.越南 3.猫印 4.印尼 
				boTipBtnStatus:false,//驳回输入
				textStr:'',//驳回信息
				boTipID:'',
				platformaStr:['全部','泰喵','越南','猫印','印尼'],
				platformId:0,//0.全部 1.泰喵 2.越南 3.猫印 4.印尼 初始默认 0  
				
			}
		},
		onLoad() {
			this.loginMsg=this.$store.getters['AllallLoginInfo'];
			this.userMsg=this.$store.getters['AllallUserInfo'];
			this.userLoginPwer=this.$store.getters['AllallLoginInfo'].level;
			console.log(this.$store.getters['AllallLoginInfo'])
			console.log(this.$store.getters['AllallUserInfo'])
			this.getInitMsg()
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods: {
			swichPlatformaId:function(id){
				console.log(id)
				this.platformId=id;
				this.getInitMsg()
			},
			goDelAndBo:function(id,item){
				var that = this;
				console.log(item)
				if(id==1){//删除
				// uid:账户
				// gidx:故障编号
				// ntype:删除或者驳回操作，1，删除，2，驳回
				// md5: md5(uidx + gidx + ntype + keys)
					console.log(item.ID)
					uni.showModal({
						title: '提示',
						content: '确定删除吗',
						success: function (res) {
							if (res.confirm) {
								uni.request({
								    url: Global_.urlPoint+'/H5/BhGzSome.aspx', //仅为示例，并非真实接口地址。
									method:"GET",
								    data: {
										uid:that.$store.getters['AllallLoginInfo'].Name,//	是	string	登陆名
										gidx:item.ID,//	是	string	故障编号  
										ntype:'1',
										md5:md5(that.$store.getters['AllallLoginInfo'].Name+item.ID+'1'+Global_.md5key),//	是	String	规则md5(uidx + ntype + gidx + keys)示例：
								    },
								    success: (res) => {
										uni.hideLoading();
										console.log(res)
										if(res.data.code==100){
											uni.showToast({
											    title: '删除成功',
											    duration: 2000,
												icon:"none"
											});
											that.getInitMsg()
										}else{
											uni.showToast({
											    title: '删除失败',
											    duration: 2000,
												icon:"none"
											});
										}  
								    },
									fail: (err) => {
										console.log(err)
										uni.hideLoading();
									}
								});
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
					
				}else if(id==2){//驳回
					uni.navigateTo({
					    url: '/pages/boInput/boInput?boId='+item.ID
					});
					
					// this.boTipBtnStatus=true;
					// this.boTipID=item.ID;
					// uni.showModal({
					//     title: '提示',
					//     content: '确定驳回吗',
					//     success: function (res) {
					//         if (res.confirm) {
					//             uni.request({
					//                 url: Global_.urlPoint+'/H5/BhGzSome.aspx', //仅为示例，驳回
					//             	method:"GET",
					//                 data: {
					//             		uid:that.$store.getters['AllallLoginInfo'].Name,//	是	string	登陆名
					//             		gidx:item.ID,//	是	string	故障编号  
					//             		ntype:'2',
					//             		md5:md5(that.$store.getters['AllallLoginInfo'].Name+item.ID+'2'+Global_.md5key),//	是	String	规则md5(uidx + ntype + gidx + keys)示例：
					//                 },
					//                 success: (res) => {
					//             		uni.hideLoading();
					//             		console.log(res.data)
					//             		if(res.data.code==100){
					//             			uni.showToast({
					//             			    title: '驳回成功',
					//             			    duration: 2000,
					//             				icon:"none"
					//             			});
					//             			that.getInitMsg()
					//             		}else{
					//             			uni.showToast({
					//             			    title: '驳回失败',
					//             			    duration: 2000,
					//             				icon:"none"
					//             			});
					//             		}  
					//                 },
					//             	fail: (err) => {
					//             		uni.hideLoading();
					//             	}
					//             });
					//         } else if (res.cancel) {
					//             console.log('用户点击取消');
					//         }
					//     }
					// });
					// --------------
				}
			},
			goBoCC:function(id){//驳回
				var that = this;
				if(id==0){//取消
					this.boTipBtnStatus=false;
					this.textStr='';
				}else if(id==1){//确定
					if(this.textStr==''){//
						uni.showToast({
						    title: '不能输入空消息',
						    duration: 2000,
							icon:"none"
						});
					}else{
						console.log(encodeURIComponent(this.textStr))
						console.log(this.boTipID)
						// -------------------
						uni.request({
						    url: Global_.urlPoint+'/H5/BhGzSome.aspx', //仅为示例，驳回
							method:"GET",
						    data: {
								uid:this.$store.getters['AllallLoginInfo'].Name,//	是	string	登陆名
								gidx:this.boTipID,//	是	string	故障编号  
								ntype:'2',
								nContent:encodeURIComponent(this.textStr),//
								md5:md5(this.$store.getters['AllallLoginInfo'].Name+this.boTipID+'2'+Global_.md5key),//	是	String	规则md5(uidx + ntype + gidx + keys)示例：
						    },
						    success: (res) => {
								uni.hideLoading();
								console.log(res.data)
								if(res.data.code==100){
									uni.showToast({
									    title: '驳回成功',
									    duration: 2000,
										icon:"none"
									});
									that.getInitMsg()
									that.boTipBtnStatus=false;
									that.textStr='';
								}else{
									uni.showToast({
									    title: '驳回失败',
									    duration: 2000,
										icon:"none"
									});
								}  
						    },
							fail: (err) => {
								uni.hideLoading();
							}
						});
						// -------------------
					}
					
				}
			},
			goPages:function(pageId){//0 edit 1 statistics
				var that = this;
				if(pageId==0){//navigateTo redirectTo reLaunch
					uni.reLaunch({
					    url: '/pages/edit/edit'
					});
				}else if(pageId==1){
					uni.reLaunch({
					    url: '/pages/statistics/statistics'
					});
				}else if(pageId==3){
					uni.showModal({
					    title: '  ',
					    content: '确定切换账号',
					    success: function (res) {
					        if (res.confirm) {
								that.$store.dispatch('SET_allIsLogin',false)
					            uni.reLaunch({
					                url: '/pages/login/login'
					            });
					        } else if (res.cancel) {
					            console.log('用户点击取消');
					        }
					    }
					});
					// uni.reLaunch({
					//     url: '/pages/login/login'
					// });
				}
			},
			radioChange: function(evt) {//选择 故障情况
				for (let i = 0; i < this.items.length; i++) {
					if (this.items[i].value === evt.target.value) {
						this.current = i;
						break;
					}
				}
				this.getInitMsg()
				console.log(this.current)
			},
			goCommet:function(item){//评论
				if(item.nState==0){
					uni.reLaunch({
					    url: '/pages/comment/comment?name='+item.Name+'&id='+item.ID
					});
				}else{
					uni.showToast({
					    title: '已处理',
					    duration: 2000,
						icon:"none"
					});
				}
				
			},
			goRefeashList:function(){//刷新数据
				this.getInitMsg()
			},
			getInitMsg:function(){//获取故障信息
				uni.showLoading({
				    title: '获取故障信息中'
				});
				var that = this;
				if(this.userLoginPwer==0){//全平台
					var newPlatformId=this.platformId;
				}else{
					var newPlatformId=this.$store.getters['AllallLoginInfo'].level;
				}
				console.log(newPlatformId)
				// console.log(this.userLoginPwer)
				// console.log(this.platformId)
				// console.log(this.date1)
				// console.log(this.date2)
				// console.log(this.$store.getters['AllallLoginInfo'].level)
				// var time = (new Date).getTime() - 24 * 60 * 60 * 1000*7;
				// var sevenD = new Date(time); // 获取的是前一天日期
				// var sevenStr=sevenD.getFullYear()+"-"+((sevenD.getMonth()+1)<10?('0'+(sevenD.getMonth()+1)):(sevenD.getMonth()+1))+"-"+(sevenD.getDate()<10?('0'+sevenD.getDate()):sevenD.getDate());
				// console.log(sevenStr)
				// var d = new Date();
				// var nowStr = d.getFullYear()+"-"+((d.getMonth()+1)<10?('0'+(d.getMonth()+1)):(d.getMonth()+1))+"-"+(d.getDate()<10?('0'+d.getDate()):d.getDate());
				// console.log(nowStr)
				uni.request({
				    url: Global_.urlPoint+'/H5/GetGzSome.aspx', //仅为示例，并非真实接口地址。
					method:"GET",
				    data: {
						uid:this.$store.getters['AllallLoginInfo'].Name,//	是	string	登陆名
						ntype:newPlatformId,//	是	string	平台编号 //原始采用当前注册平台id 后采用 this.$store.getters['AllallLoginInfo'].level   this.platformId
						gidx:'0',//	是	string	故障编号   0,查询时间内全部，不为0查询当前故障信息
						ndate:this.date1,//	是	String	开始时间，2020-11-11
						edate:this.date2,//	是	String	结束时间
						Scorer:'0',//	是	String	是否查询当前用户 默认0，不查 ，1.当前用户提交的故障 2.当前用户回复的故障
						nstate:this.current-1,//处理状态，-1，全部，0，刚提交的，1驳回的，2处理完成的
						md5:md5(this.$store.getters['AllallLoginInfo'].Name+newPlatformId+'0'+Global_.md5key),//	是	String	规则md5(uidx + ntype + gidx + keys)示例：
				    },
				    success: (res) => {
						uni.hideLoading();
						console.log(res.data)
						console.log(this)
						if(res.data.code==100){
							if(res.data.msg=='暂无数据'){
								uni.showToast({
								    title: res.data.msg,
								    duration: 2000,
									icon:"none"
								});
								this.faultInitMsg=[];
							}else{
								var newInitData=res.data.msg;
								newInitData.forEach(function(item,index){
									item.newNtime=item.ntime.substr(0, 10)+' '+item.ntime.substr(11,5);
									// item.nContentNew=decodeURIComponent(item.nContent)
									// item.DescriptNew=decodeURIComponent(item.Descript)
									if(item.pho.split('.')[item.pho.split('.').length-1]=='mp4'||item.pho.split('.')[item.pho.split('.').length-1]=='mov'){
										item.isVideo=1;
									}else{
										item.isVideo=0;
									}
								})
								this.faultInitMsg=newInitData;
								console.log(newInitData)
							}
							

						}else{
							uni.showToast({
							    title: '获取故障信息失败',
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
			priviewImg:function(picSrc){
				console.log(picSrc)
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
			bindDateChange1: function(e) {
				console.log(e.target.value)
				this.date1 = e.target.value
			},
			bindDateChange2: function(e) {
				console.log(e.target.value)
				this.date2 = e.target.value
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				
				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
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
	.boAreaTip{//驳回弹层
		height: 100%;
		width: 100%;
		position: fixed;
		// z-index: 9999;
		// background: red;
		background: rgba(0,0,0,0.4);
		top: 0;
		.boArea{
			padding-top: 50rpx;
			width: 500rpx;
			height: 500rpx;
			background:#FFFFFF;
			border-radius: 20rpx;
			position: absolute;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			margin: auto;
			.botextInput{
				width: 400rpx;
				height: 300rpx;
				margin-left: 50rpx;
			}
			.btnArea{
				width: 500rpx;
				height: 100rpx;
				display: flex;
				align-items: center;
				justify-content: space-around;
				margin-top: 50rpx;
				.span{
					font-size: 40rpx;
					padding: 20rpx 40rpx;
					border-radius: 10rpx;
				}
				.span1{
					background:#66A8CC;
				}
				.span2{
					background:#007AFF;
				}
			}
		}
	}
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
			position: relative;
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
			.iconfont{
				font-size: 50rpx!important;
				width: 50rpx;
				height: 50rpx;
				margin-left: 30rpx;
				position: absolute;
				right: 32rpx;
				top: -12rpx;
			}
		}
		.dateArea{//日期选择
			background:#fff;
			display: flex;
			padding: 20rpx 0rpx;
			justify-content: center;
			.picker1,.picker2{
				border:1px solid #cecece;
				padding: 5rpx 10rpx;
				border-radius: 5rpx;
				margin: 0rpx 5rpx;
				background: #F5F5F5;
			}
			.zhi{
				margin:0rpx 25rpx;
			}
			.iconfont{
				font-size: 60rpx!important;
				width: 60rpx;
				height: 60rpx;
				margin-left: 30rpx;
			}
		}
		.platformArea{//平台
			display: flex;
			background: #fff;
			justify-content: space-around;
			.span{
				padding: 16rpx 28rpx;
				background: #E7ECF5;
				border-radius: 13rpx;
				font-size: 28rpx;
			}
			.acSpan{
				color: #3D6DCF;
			}
		}
		.pidArea{//平台id选择
			height: 100rpx;
			display: flex;
			// margin-bottom: 40rpx;
			background: #fff;
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
		.per{
			padding: 27rpx 35rpx;
			margin-top: 24rpx;
			// min-height: 500rpx;
			background: #fff;
			border-radius: 20rpx;
			position: relative;
			.photo{
				position: absolute;
				width: 72rpx;
				height: 72rpx;
				border-radius: 50%;
				background: #cecece;
			}
			.infoArea{
				width: 550rpx;
				margin-left: 90rpx;
				padding-top: 6rpx;
				position: relative;
				.delBtn{
					position: absolute;
					right: 140rpx;
					font-size: 32rpx;
					background: #55aaff;
					padding: 8rpx 20rpx;
					border-radius: 8rpx;
				}
				.bohuiBtn{
					position:absolute;
					right: 0;
					font-size: 32rpx;
					background: #55aaff;
					padding: 8rpx 20rpx;
					border-radius: 8rpx;
				}
				.name{
					width: 50%;
					height: 32rpx;
					font-size: 32rpx;
					font-weight: bold;
					color: #576996;
					line-height: 32rpx;
					margin-bottom: 40rpx;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
				}
				.sayText{//说说内容
					font-size: 28rpx;
					color: #000000;
					line-height: 40rpx;
				}
				.imgArea{//说说图片
					width: 100%;
					height: 170rpx;
					margin-top: 20rpx;
					margin-bottom: 20rpx;
					display: flex;
					align-items: center;
					.img{
						width: 174rpx;
						height: 174rpx;
						margin-right: 8rpx;
					}
				}
				.videoArea{
					width: 100%;
					height: 170rpx;
					margin-top: 20rpx;
					margin-bottom: 20rpx;
					display: flex;
					align-items: center;
					.video{
						// width: 174rpx;
						height: 174rpx;
						margin-right: 8rpx;
					}
				}
				.timeArea{//说说时间
					display: flex;
					align-items: center;
					justify-content: space-between;
					height: 34rpx;
					margin-bottom: 15rpx;
					.time{
						font-size: 20rpx;
						font-weight: bold;
						color: #AFAFAF;
					}
					.more{
						width: 52rpx;
						height: 33rpx;
						.moreImg{
							width: 52rpx;
							height: 33rpx;
						}
					}
				}
				.commentArea{
					line-height: 40rpx;
					background: #F7F7F7;
					border-radius: 7rpx;
					font-size: 24rpx;
					// padding: 10rpx 10rpx;
					color: #000;
					.comName{
						font-weight: bold;
						color: #576996;
					}
				}
			}
		}
	}
	
	
	
	
	
	
}


</style>

<template>
	<!-- 蓝湖地址 https://lanhuapp.com/web/#/item/project/detailDetach?pid=b752da94-c224-4060-a37a-226112e51879&project_id=b752da94-c224-4060-a37a-226112e51879&image_id=038a5835-70c9-49b6-b8ea-efba9d7a092c -->
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
			</view>
			<!-- per 问答 -->
			<view class="per" v-for="(item,index) in faultInitMsg">
				<image class="photo" src="../../static/images/sex.jpg" mode=""></image>
				<view class="infoArea">
					<view class="name">
						{{item.Name}}
					</view>
					<view class="sayText">
						{{item.nContent}}
					</view>
					<view class="imgArea" v-if="item.pho!=''&&item.pho1!=''&&item.pho2!=''">
						<image class="img img1" v-if="item.pho!=''" :src="item.pho" mode=""></image>
						<image class="img img2" v-if="item.pho1!=''" :src="item.pho1" mode=""></image>
						<image class="img img3" v-if="item.pho2!=''" :src="item.pho2" mode=""></image>
					</view>
					<view class="timeArea">
						<text class="time">{{item.ntime}}</text>
						<view class="more">
							<image @click="goCommet(item)" class="moreImg" src="../../static/images/msg.png" mode=""></image>
						</view>
					</view>
					<view class="commentArea" v-if="item.Descript!=''">
						<text class="comName">{{item.param}}：</text>
						{{item.Descript}}
					</view>
					<view class="imgArea" v-if="item.cpho!=''&&item.cpho1!=''&&item.cpho2!=''">
						<image class="img img1" v-if="item.cpho!=''" :src="item.cpho" mode=""></image>
						<image class="img img2" v-if="item.cpho1!=''" :src="item.cpho1" mode=""></image>
						<image class="img img3" v-if="item.cpho2!=''" :src="item.cpho2" mode=""></image>
					</view>
				</view>
			</view>
			<!-- per 问答 -->
			<view class="per">
				<image class="photo" src="../../static/images/sex.jpg" mode=""></image>
				<view class="infoArea">
					<view class="name">
						哈哈哈哈哈
					</view>
					<view class="sayText">
						夫卡了时间分厘卡时间奥斯陆冬季法律实践地方十六点就罚款了世界东方
					</view>
					<view class="imgArea">
						<image @click="priviewImg" class="img img1" src="../../static/images/sex.jpg" mode=""></image>
						<image class="img img2" src="../../static/images/sex.jpg" mode=""></image>
						<image class="img img3" src="../../static/images/sex.jpg" mode=""></image>
					</view>
					<view class="timeArea">
						<text class="time">23分钟前</text>
						<view class="more">
							<image class="moreImg" src="../../static/images/msg.png" mode=""></image>
						</view>
					</view>
					<view class="commentArea">
						<text class="comName">狂人：</text>
						云真白数据分类算法上了飞机阿拉斯加方式slid附加赛决定。
					</view>
				</view>
			</view>
			<!-- per 问答 -->
		</view>
		
		
		
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
			return {
				faultInitMsg:[],//初始故障信息

			}
		},
		onLoad() {
			console.log(this.$store.getters['AllallLoginInfo'])
			console.log(this.$store.getters['AllallUserInfo'])
			this.getInitMsg()
		},
		methods: {
			goPages:function(pageId){//0 edit 1 statistics
				if(pageId==0){//navigateTo redirectTo reLaunch
					uni.reLaunch({
					    url: '/pages/edit/edit'
					});
				}else if(pageId==1){
					uni.reLaunch({
					    url: '/pages/statistics/statistics'
					});
				}
			},
			goCommet:function(item){//评论
				console.log(item)
				uni.reLaunch({
				    url: '/pages/comment/comment?name='+item.Name+'&id='+item.ID
				});
			},
			getInitMsg:function(){//获取故障信息
				uni.showLoading({
				    title: '获取故障信息中'
				});
				var time = (new Date).getTime() - 24 * 60 * 60 * 1000*7;
				var sevenD = new Date(time); // 获取的是前一天日期
				var sevenStr=sevenD.getFullYear()+"-"+(sevenD.getMonth()+1)+"-"+sevenD.getDate();
				console.log(sevenStr)
				var d = new Date();
				var nowStr = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
				console.log(nowStr)
				uni.request({
				    url: Global_.urlPoint+'/H5/GetGzSome.aspx', //仅为示例，并非真实接口地址。
					method:"GET",
				    data: {
						uid:this.$store.getters['AllallLoginInfo'].Name,//	是	string	登陆名
						ntype:this.$store.getters['AllallLoginInfo'].level,//	是	string	平台编号
						gidx:'0',//	是	string	故障编号   0,查询时间内全部，不为0查询当前故障信息
						ndate:sevenStr,//	是	String	开始时间，2020-11-11
						edate:nowStr,//	是	String	结束时间
						Scorer:'0',//	是	String	是否查询当前用户 默认0，不查 ，1.当前用户提交的故障 2.当前用户回复的故障
						md5:md5(this.$store.getters['AllallLoginInfo'].Name+this.$store.getters['AllallLoginInfo'].level+'0'+Global_.md5key),//	是	String	规则md5(uidx + ntype + gidx + keys)示例：
				    },
				    success: (res) => {
						uni.hideLoading();
						console.log(res.data)
						if(res.data.code==100){
							this.faultInitMsg=res.data.msg;

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
			priviewImg:function(){
				uni.previewImage({
					urls: ['https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1830914723,3154965800&fm=26&gp=0.jpg'],
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
				.name{
					width: 100%;
					height: 32rpx;
					font-size: 32rpx;
					font-weight: bold;
					color: #576996;
					line-height: 32rpx;
					margin-bottom: 26rpx;
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
					padding: 10rpx 10rpx;
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

<template>
	<!-- 蓝湖地址 https://lanhuapp.com/web/#/item/project/detailDetach?pid=b752da94-c224-4060-a37a-226112e51879&project_id=b752da94-c224-4060-a37a-226112e51879&image_id=038a5835-70c9-49b6-b8ea-efba9d7a092c -->
	<view class="content">
		<!-- <view class="wifiTipWrap"></view> -->
		<view class="logoArea">
			<!-- <img class="addIcon" src="static/images/add.png" alt=""> -->
			<img class="photo" src="static/images/icon.png" alt="">
		</view>
		<view class="mainArea">
			<view class="swichBar">
				<text class="qBtn" @click="goPaes">问答</text>
				<text class="sBtn">统计</text>
			</view>
			<view class="dateArea">
				<picker class="picker1" mode="date" :value="date1" :start="startDate" :end="endDate" @change="bindDateChange1">
					<view class="uni-input">{{date1}}</view>
				</picker>
				<text class="zhi">至</text>
				<picker class="picker2" mode="date" :value="date2" :start="startDate" :end="endDate" @change="bindDateChange2">
					<view class="uni-input">{{date2}}</view>
				</picker>
			</view>
			<view class="platformArea">
				<span @click="swichPlatformaId(index)" class="span" v-for="(item,index) in platformaStr" :key="index" :class="index==platformId?'acSpan':''">{{item}}</span>
			</view>
			<view class="reFreashArea">
				<span @click="goReFreash" class="reFreash" >获取数据</span>
			</view>
			<!-- 折线图 -->
			<view class="echartArea qiun-charts">
				<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts" @touchstart="touchLineA"></canvas>
			</view>

			<!-- 折线图 -->
		</view>
		
		
		
	</view>
</template>

<script>
	// import {Get,Post} from "@/lib/js/GlobalFunction.js";//公共方法
	import Global_ from '@/lib/js/GlobalObj.js';//全局对象
	import md5 from '@/lib/md5/md5.js'; //md5加密
	import uCharts from '@/components/u-charts/u-charts.js';
	var _self;
	var canvaLineA=null;
	export default {
		data() {
			// const currentDate1 = this.getDate({
			// 	format: true
			// })
			// const currentDate2 = this.getDate({
			// 	format: true
			// })
			var time1 = (new Date).getTime() - 24 * 60 * 60 * 1000*7;
			var sevenD1 = new Date(time1); // 获取的是前一天日期
			// var currentDate1=sevenD1.getFullYear()+"-"+(sevenD1.getMonth()+1)+"-"+sevenD1.getDate();
			var currentDate1=sevenD1.getFullYear()+"-"+((sevenD1.getMonth()+1)<10?('0'+(sevenD1.getMonth()+1)):(sevenD1.getMonth()+1))+"-"+(sevenD1.getDate()<10?('0'+sevenD1.getDate()):sevenD1.getDate());
			
			// var currentDate2 = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate();
			var currentDate2 = new Date().getFullYear()+"-"+((new Date().getMonth()+1)<10?('0'+(new Date().getMonth()+1)):(new Date().getMonth()+1))+"-"+(new Date().getDate()<10?('0'+new Date().getDate()):new Date().getDate());
			
			// ((d.getMonth()+1)<10?('0'+(d.getMonth()+1)):(d.getMonth()+1))+"-"+(d.getDate()<10?('0'+d.getDate()):d.getDate());
			return {
				cWidth:'',
				cHeight:'',
				pixelRatio:1,
				
				date1: currentDate1,
				date2: currentDate2,
				platformaStr:['泰喵','越南','猫印','印尼'],
				platformId:0,//0.全部 1.泰喵 2.越南 3.猫印 4.印尼 初始默认 1  当前没有0
				
			}
		},
		onLoad() {
			console.log(this.$store.getters['AllallLoginInfo'])
			console.log(this.$store.getters['AllallUserInfo'])
			_self = this;
			this.cWidth=uni.upx2px(710);
			this.cHeight=uni.upx2px(670);
			// this.getServerData();
			this.getInitMsg((this.platformId+1).toString(),this.date1,this.date2)
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
			goPaes:function(){
				uni.navigateTo({
				    url: '/pages/qa/qa'
				});
			},
			swichPlatformaId:function(id){
				console.log(id)
				this.platformId=id;
			},
			goReFreash:function(){
				this.getInitMsg((this.platformId+1).toString(),this.date1,this.date2)
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
			getInitMsg:function(pId,sTime,eTime){//获取故障折现数据
				uni.showLoading({
				    title: '获取故障信息中'
				});
				uni.request({
				    url: Global_.urlPoint+'/H5/GetGzCount.aspx', //仅为示例，并非真实接口地址。
					method:"GET",
				    data: {
						uID:this.$store.getters['AllallLoginInfo'].Name,//	是	string	登陆名
						ntype:pId,//	是	string	当前平台编号
						Stype:'0',//	是	string	查询分类0，当前平台时间内汇总  1.当前用户时间内汇总
						ndate:sTime,//	是	string	开始时间：2020-11-11
						edate:eTime,//	是	string	结束时间：2020-11-11
						Md5:md5(this.$store.getters['AllallLoginInfo'].Name+pId+'0'+Global_.md5key),//	是	string	规则md5(uid+ ntype +stype+key)示例：

				    },
				    success: (res) => {
						uni.hideLoading();
						console.log(res.data)
						if(res.data.code==100){
							var LineA={
									categories: ['2012', '2013', '2014', '2015', '2016', '2017'],
									series: [{
										name: '已解决',
										data: [35, 20, 25, 37, 4, 20],
										color: 'green'
									}, {
										name: '故障数量',
										data: [70, 40, 65, 100, 44, 68],
										color:'red'
									}]
								};
								// console.log(res.data.Time.split(','))
									LineA.categories=res.data.Time.split(',');
									LineA.series[0].data=res.data.CNum.split(',');
									LineA.series[1].data=res.data.GNum.split(',');
									_self.showLineA("canvasLineA",LineA);
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
			getServerData(){
				let LineA={
						categories: ['2012', '2013', '2014', '2015', '2016', '2017'],
						series: [{
							name: '已解决',
							data: [35, 20, 25, 37, 4, 20],
							color: 'green'
						}, {
							name: '故障数量',
							data: [70, 40, 65, 100, 44, 68],
							color:'red'
						}]
					};
				_self.showLineA("canvasLineA",LineA);
				// uni.request({
				// 	url: 'https://www.ucharts.cn/data.json',
				// 	data:{
				// 	},
				// 	success: function(res) {
				// 		console.log(res.data.data)
				// 		let LineA={categories:[],series:[]};
				// 		//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
				// 		LineA.categories=res.data.data.LineA.categories;
				// 		LineA.series=res.data.data.LineA.series;
				// 		_self.showLineA("canvasLineA",LineA);
				// 	},
				// 	fail: () => {
				// 		_self.tips="网络错误，小程序端请检查合法域名";
				// 	},
				// });
			},
			showLineA(canvasId,chartData){
				// console.log(_self.cHeight)
				// console.log(_self.pixelRatio)
				canvaLineA=new uCharts({
					$this:_self,
					canvasId: canvasId,
					type: 'line',
					fontSize:11,
					legend:{show:true},
					dataLabel:false,
					dataPointShape:true,
					background:'#FFFFFF',
					pixelRatio:_self.pixelRatio,
					categories: chartData.categories,
					series: chartData.series,
					animation: true,
					xAxis: {
						type:'grid',
						gridColor:'#CCCCCC',
						gridType:'dash',
						dashLength:8
					},
					yAxis: {
						gridType:'dash',
						gridColor:'#CCCCCC',
						dashLength:8,
						splitNumber:5,
						min:10,
						max:50,
						format:(val)=>{return val.toFixed(0)+'个'}
					},
					width: _self.cWidth*_self.pixelRatio,
					height: _self.cHeight*_self.pixelRatio,
					extra: {
						line:{
							type: 'straight'
						}
					}
				});
				
			},
			touchLineA(e) {
				canvaLineA.showToolTip(e, {
					format: function (item, category) {
						return category + ' ' + item.name + ':' + item.data 
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
			margin-bottom: 32rpx;
			.qBtn{
				width: 145rpx;
				height: 63rpx;
				background: #D7E1F3;
				border-radius: 13rpx;
				font-size: 32rpx;
				font-weight: bold;
				color: #ACACAC;
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
				color: #3D6DCF;
				text-align: center;
				line-height: 63rpx;
				margin-left: 32rpx;
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
		.reFreashArea{//获取数据
			display: flex;
			background: #fff;
			justify-content: space-around;
			padding: 30rpx 0rpx;
			.reFreash{
				background:#007AFF;
				padding: 10rpx 150rpx;
				border-radius: 10rpx;
			}
		}
		// 折线图
		.echartArea{
			background: red;
			width: 710rpx;
			height: 670rpx;
			.charts{
				width: 710rpx;
				height: 670rpx;
				background-color: #FFFFFF;
			}
		}
	}
	
	
	
	
	
	
}


</style>

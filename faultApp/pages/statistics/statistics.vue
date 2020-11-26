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
				<text class="qBtn" @click="goPaes">问答</text>
				<text class="sBtn">统计</text>
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
	import uCharts from '@/components/u-charts/u-charts.js';
	var _self;
	var canvaLineA=null;
	export default {
		data() {
			return {
				cWidth:'',
				cHeight:'',
				pixelRatio:1,
			}
		},
		onLoad() {
			_self = this;
			this.cWidth=uni.upx2px(710);
			this.cHeight=uni.upx2px(670);
			this.getServerData();
		},
		methods: {
			goPaes:function(){
				uni.navigateTo({
				    url: '/pages/qa/qa'
				});
			},
			getServerData(){
				let LineA={
							categories: ['2012', '2013', '2014', '2015', '2016', '2017'],
							series: [{
								name: '成交量A',
								data: [35, 20, 25, 37, 4, 20],
								color: '#000000'
							}, {
								name: '成交量B',
								data: [70, 40, 65, 100, 44, 68]
							}, {
								name: '成交量C',
								data: [100, 80, 95, 150, 112, 132]
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
				console.log(_self.cHeight)
				console.log(_self.pixelRatio)
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
						max:180,
						format:(val)=>{return val.toFixed(0)+'元'}
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

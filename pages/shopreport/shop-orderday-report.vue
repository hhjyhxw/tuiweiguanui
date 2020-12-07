<template>
	<gracePage :customHeader="false">
		<view slot="gBody" class="grace-body"  >
			<view class="content">
				<view class="ls-grid-3">
					<view class="ls-cell" @click="prePage">《</view>
					<view class="ls-cell ls-cell-rborder ls-cell-lborder">{{queryData.formatdatetime}}</view>
					<view class="ls-cell" @click="nextPage">》</view>
				</view>
				<view class="ls-grid-3">
					<view class="ls-cell">日期</view>
					<view class="ls-cell ls-cell-rborder ls-cell-lborder">订单数量</view>
					<view class="ls-cell">订单金额</view>
				</view>
				<view class="ls-grid-3" v-for="(item,index) in list">
					<view class="ls-cell">{{item.orderday}}</view>
					<view class="ls-cell ls-cell-rborder ls-cell-lborder">{{item.countNum}}</view>
					<view class="ls-cell">¥{{item.totalAmount}}</view>
				</view>
			</view>
		</view>
	</gracePage>
</template>
<script>
import gracePage from "../../graceUI/components/gracePage.vue";
import { mapState } from 'vuex';  
	export default {
		components:{gracePage},
		data() {
			return {
				list:[],
				queryData:{
					direct:0,//方向 -1 向后 1 先前 0 查询当前输入多日期
					datetime:'',//查询日期 yyyy-MM-dd
					formatdatetime:'',
					pageNum:1,
					pageSize:30,
					totalPage:0,
				}
			}
		},
		onShow(){
			this.getOrderReportList(this.queryData);
		},
		methods: {
			//前一天
			prePage(){
				this.queryData.direct=-1;
				this.queryData.pageNum=1;
				this.queryData.pageSize=30;
				this.queryData.totalPage=0;
				this.list=[];
				this.getOrderReportList(this.queryData);
			},
			//后一天
			nextPage(){
				this.queryData.direct=1;
				this.queryData.pageNum=1;
				this.queryData.pageSize=30;
				this.queryData.totalPage=0;
				this.list=[];
				this.getOrderReportList(this.queryData);
			},
			async getOrderReportList (querData,first) {
				let result = await this.$api.request('shopkeeper/shopStatistic', 'orderMonthList',querData);
				console.log(JSON.stringify(result));
				if(result.code == 0){
					this.queryData.datetime=result.shopOrderDayreportdto.datetime;
					this.queryData.formatdatetime=result.shopOrderDayreportdto.formatdatetime;
				}
				if(result.code != 0 || result.page.list==null || result.page.list.length==0){
					this.hasdata = false;//没有数据展示空页
					return;
				} 
				this.queryData.totalPage = result.page.totalPage;
			   if(first) {//是否是刷新 或者第一次加载
				   this.list =  result.page.list ;
			   } else {
				   this.list = this.list.concat(result.page.list);
			   }
			},
		},
		
		onPullDownRefresh() {
			 this.queryData.pageNum = 1;
			 this.queryData.totalPage = 0;
			 this.getOrderReportList()(this.queryData,true);
			   uni.stopPullDownRefresh();
		 },
		 onReachBottom(){//页面滚动到底部的事件
			if (this.queryData.pageNum > this.queryData.totalPage) {
				return false;
			}
			 this.queryData.pageNum = this.queryData.pageNum + 1;
			 if (this.queryData.pageNum > this.queryData.totalPage) {
				 return false;
			 }
			 this.getOrderReportList(this.queryData,false);
		 }
	}
</script>

<style>
	page{
		/* background-color: #F2F2F2; */
		background-color: lightblue;
		
	}
	.content{
		padding:3px;
		background-color: white;
		margin-top: 10px;
		border-radius: 5px;
		padding-bottom: 10px;
	}
	.ls-grid-3{
		display: flex;
		justify-content: space-around;
		align-items: center;
		border: 1px solid black;
		text-align: center;
		/* padding: 5px; */
	}
	.ls-cell{
		flex: 1;
		height: 2rem;
		line-height: 2rem;
	}
	.ls-cell-rborder{
		border-right: 1px solid black;
	}
	.ls-cell-lborder{
		border-left: 1px solid black;
	}
</style>

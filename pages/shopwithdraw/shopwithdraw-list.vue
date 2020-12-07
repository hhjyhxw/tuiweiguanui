<template>
	<gracePage :customHeader="false">
		<view slot="gBody" class="grace-body" v-show="!hasdata">
			<graceEmptyNew>
				<view slot="img" class="empty-view">
					<!-- 请根据您的项目要求制作并更换为空图片 -->
					<image class="empty-img" mode="widthFix" src="https://staticimgs.oss-cn-beijing.aliyuncs.com/empty.png"></image>
				</view>
				<text slot="text" class="grace-text-small grace-gray">抱歉，暂时没有数据</text>
			</graceEmptyNew>
		</view>
		<view slot="gBody" class="grace-body"  v-show="hasdata">
			<!-- 提现记录列表start -->
			<view class="ls-column-list" v-show="showlist" >
				<view class="list-item" v-for="(item,index) in drawList">
					<view class="ls-row-list">
						<view class="label-text">结算金额</view>
						<view class="money">￥{{item.totalAmout}}</view>
					</view>
					<view class="ls-row-list">
						<view class="label-text">结算交易金额</view>
						<view class="money">￥{{item.amount}}</view>
					</view>
					<view class="ls-row-list">
						<view class="label-text">结算交易手续费</view>
						<view class="money">￥{{item.handlingFee}}</view>
					</view>
					<view class="ls-row-list">
						<view class="time">{{item.approveTime!=null?item.approveTime:''}}</view>
						<view class="senk-btn" @click="seeDetail(item)">查看</view>
					</view>
				</view>
			</view>
			<!-- 提现记录列表end -->
			
			<!-- 明细弹窗 start-->
			<!-- 遮罩组件 @closeShade="closeShade" 实现点击关闭自身，如果不需要次功能则不绑定此事件即可 -->
			<graceShade @closeShade="closeShade" ref="graceShade">
				<view class="demo-msg grace-relative" @tap.stop="">
					<!-- 表单 -->
					<view class="ls-form">
						<view class="ls-form-item">
							<view class="ls-form-label">结算单号</view>
							<view class="ls-form-input-box">{{drawData.orderNo}}</view>
						</view>
						<view class="ls-form-item">
							<view class="ls-form-label">银行流水号</view>
							<view class="ls-form-input-box">{{drawData.transactionId!=null?drawData.transactionId:''}}</view>
						</view>
						<view class="ls-form-item">
							<view class="ls-form-label">结算金额</view>
							<view class="ls-form-input-box">￥{{drawData.totalAmout}}</view>
						</view>
						<view class="ls-form-item">
							<view class="ls-form-label">结算交易金额</view>
							<view class="ls-form-input-box">￥{{drawData.amount}}</view>
						</view>
						<view class="ls-form-item">
							<view class="ls-form-label">结算交易手续费</view>
							<view class="ls-form-input-box">￥{{drawData.handlingFee}}</view>
						</view>
						<view class="ls-form-item">
							<view class="ls-form-label">结算银行</view>
							<view class="ls-form-input-box">{{drawData.bankName}}</view>
						</view>
						<view class="ls-form-item">
							<view class="ls-form-label">结算账号</view>
							<view class="ls-form-input-box">{{drawData.cardNo}}</view>
						</view>
						<view class="ls-form-item">
							<view class="ls-form-label">用户名</view>
							<view class="ls-form-input-box">{{drawData.userName}}</view>
						</view>
						<view class="ls-form-item">
							<view class="ls-form-label">手机号</view>
							<view class="ls-form-input-box">{{drawData.mobile}}</view>
						</view>
						<view class="ls-form-item">
							<view class="ls-form-label">交易时间</view>
							<view class="ls-form-input-box">{{drawData.approveTime!=null?drawData.approveTime:''}}</view>
						</view>
						<view class="ls-form-item">
							<view class="ls-form-label">交易状态</view>
							<view class="ls-form-input-box ls-cl-purple">{{drawData.approveFlag}}</view>
						</view>
						<view class="ls-btn-box">
							<button class="ls-btn ls-btn-blue" @tap.stop="closeShade">关闭</button>
						</view>
						
					</view>
					<!-- 表单数据end -->
					<view class="close-btn grace-icons icon-close3 grace-white grace-absolute-rt" @tap.stop="closeShade"></view>
				</view>
			</graceShade>
			<!--  明细弹窗end-->
		</view>
	</gracePage>
</template>

<script>
	import gracePage from "../../graceUI/components/gracePage.vue";
	import graceShade from "../../graceUI/components/graceShadeShopdrawlist.vue";
	import graceEmptyNew from "../../graceUI/components/graceEmptyNew.vue";
	import { mapState } from 'vuex';  
		export default {
			components:{gracePage,graceShade,graceEmptyNew},
			data() {
				return {
					showlist:true,
					hasdata:true,
					drawList:[],
					drawData:{},						
					queryData:{
						page: 1,//页码
						limit:10,//每页记录数
						totalPage: 0,//总页数
					},
				}
				
			},
			onShow(){
				this. getDrawList(this.queryData);
			},
			onLoad(option){
				
			},
			computed: {
				...mapState(['hasLogin','userInfo'])
			},
			methods: {
				async getDrawList (querData,first) {
					console.log(JSON.stringify(querData));
					let result = await this.$api.request('shopkeeper/shopWithdraw', 'drawList',querData);
					console.log(JSON.stringify(result));
					if(result.code != 0 || result.page.list==null || result.page.list.length==0){
						this.hasdata = false;//没有数据展示空页
						return;
					} 
					this.queryData.totalPage = result.page.totalPage;
				   if(first) {//是否是刷新 或者第一次加载
					   this.drawList =  result.page.list ;
				   } else {
					   this.drawList = this.drawList.concat(result.page.list);
				   }
				},
				//查看详细
				seeDetail(item){
					this.drawData = item;
					this.showShade();
				},
				
				showShade : function () {
					this.$refs.graceShade.showIt();
				},
				closeShade : function () {
					this.$refs.graceShade.hideIt();
				},
				
			},
			onPullDownRefresh() {
				 this.queryData.page = 1;
				 this.queryData.totalPage = 0;
				 this.getDrawList()(this.queryData,true);
				   uni.stopPullDownRefresh();
			 },
			 onReachBottom(){//页面滚动到底部的事件
				if (this.queryData.page > this.queryData.totalPage) {
					return false;
				}
				 this.queryData.page = this.queryData.page + 1;
				 if (this.queryData.page > this.queryData.totalPage) {
					 return false;
				 }
				 this.getDrawList(this.queryData,false);
			 }
			
		}
</script>

<style>
	page{
		/* background-color: #F2F2F2; */
		background-color: white;
	}
	/*  通用竖向列表*/
	.ls-column-list{
		display: flex;
		flex-direction: column;
		padding:2px;
		background-color: white;
		margin-top: 0.3rem;
		border-radius: 5px;
	}
	.list-item{
		margin-bottom: 0.5rem;
	}
	/*  通用横向列表*/
	.ls-row-list{
		display: flex;
		flex-direction: row;
		padding: 0.2rem 1rem;
		justify-content: space-between;
		background-color: #F0F8FF;
	}
	.label-text{
		color: #33ccff;
	}
	.money{
		color: blue;
	}
	.senk-btn{
		color: #33ccff;
	}
	
	
	.ls-form{
		padding:3px;
		background-color: white;
		/* margin-top: 45px; */
		border-radius: 5px;
		padding-bottom: 10px;
		height: 100%;
	}
	.ls-form-item{
		display: flex;
		justify-content: space-around;
		align-items: center;
		border-bottom: 1px solid #EDEDED;
		height: 2.5rem;
		line-height: 2.8rem;	
	}
	.ls-form-label{
		flex: 1.5;
		padding-left: 15px;
	}
	.ls-form-input-box{
		flex: 3;
		text-align: right;
		padding-right: 15px;
	}
	.ls-cl-purple{
		color: purple;
	}
	.ls-btn-box{
		margin-top: 5rem;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
	}
	.ls-btn{
		width: 100%;
		font-size:30rpx; line-height:88rpx; padding:0; border-radius:6rpx;
		background:linear-gradient(to right, #00FFD5 ,#008CFF) !important; color:#FFFFFF !important;
	}
	.ls-btn::after{border-radius:5rpx !important; border:none;}
	
	.grace-shade-in {
	    width: 100% !important;
	    height: 100% !important;
	}
	.grace-relative{
		height: 100% !important;
	}
</style>

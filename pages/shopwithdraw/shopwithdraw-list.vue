<template>
	<gracePage :customHeader="false">
		<view slot="gBody" class="grace-body"  >
			<!-- 提现记录列表start -->
			<view class="ls-column-list" v-show="showlist">
				<view class="list-item">
					<view class="ls-row-list">
						<view class="label-text">结算金额</view>
						<view class="money">￥200.00</view>
					</view>
					<view class="ls-row-list">
						<view class="label-text">结算交易金额</view>
						<view class="money">￥197.00</view>
					</view>
					<view class="ls-row-list">
						<view class="label-text">结算交易手续费</view>
						<view class="money">￥3.00</view>
					</view>
					<view class="ls-row-list">
						<view class="time">2020/11/20 16:50:00</view>
						<view class="senk-btn">查看</view>
					</view>
				</view>
				<view class="list-item">
					<view class="ls-row-list">
						<view class="label-text">结算金额</view>
						<view class="money">￥200.00</view>
					</view>
					<view class="ls-row-list">
						<view class="label-text">结算交易金额</view>
						<view class="money">￥197.00</view>
					</view>
					<view class="ls-row-list">
						<view class="label-text">结算交易手续费</view>
						<view class="money">￥3.00</view>
					</view>
					<view class="ls-row-list">
						<view class="time">2020/11/20 16:50:00</view>
						<view class="senk-btn" @tap="showShade">查看</view>
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
							<view class="ls-form-input-box">JY202011221525262525</view>
						</view>
						<view class="ls-form-item">
							<view class="ls-form-label">结算金额</view>
							<view class="ls-form-input-box">￥200.00</view>
						</view>
						<view class="ls-form-item">
							<view class="ls-form-label">结算交易金额</view>
							<view class="ls-form-input-box">￥197.00</view>
						</view>
						<view class="ls-form-item">
							<view class="ls-form-label">结算交易手续费</view>
							<view class="ls-form-input-box">￥3.00</view>
						</view>
						<view class="ls-form-item">
							<view class="ls-form-label">结算银行</view>
							<view class="ls-form-input-box">工商银行</view>
						</view>
						<view class="ls-form-item">
							<view class="ls-form-label">结算账号</view>
							<view class="ls-form-input-box">2568587895685878956</view>
						</view>
						<view class="ls-form-item">
							<view class="ls-form-label">用户名</view>
							<view class="ls-form-input-box">哈哈哈</view>
						</view>
						<view class="ls-form-item">
							<view class="ls-form-label">手机号</view>
							<view class="ls-form-input-box">15025685878</view>
						</view>
						<view class="ls-form-item">
							<view class="ls-form-label">交易时间</view>
							<view class="ls-form-input-box">2020/11/20 15:35:56</view>
						</view>
						<view class="ls-form-item">
							<view class="ls-form-label">交易状态</view>
							<view class="ls-form-input-box">交易完成</view>
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
	import { mapState } from 'vuex';  
		export default {
			components:{gracePage,graceShade},
			data() {
				return {
					showlist:true,
					hasdata:true,
					shopId:null,
					orderlist:[],
					queryData:{
						shopId:null,
						pageNum: 1,//商品列表 页码
						pageSize:5,
						totalPage: 0,//商品列表总页数
					},
					 title: 'picker',
					array: ['中国银行', '中国人民银行', '中国工商银行', '中国邮政银行'],
					index: 0,
				}
				
			},
			onShow(){
			
			},
			onLoad(option){
				console.log('option===='+JSON.stringify(option)); //打印出上个页面传递的参数。
				if(option.shopId!=null && typeof(option.shopId) != "undefined"){
					this.shopId = option.shopId;
					this.queryData.shopId = option.shopId;
				}
			},
			computed: {
				...mapState(['hasLogin','userInfo'])
			},
			methods: {
				 bindPickerChange: function(e) {
					console.log('picker发送选择改变，携带值为', e.target.value)
					this.index = e.target.value
				},
				showShade : function () {
					this.$refs.graceShade.showIt();
				},
				closeShade : function () {
					this.$refs.graceShade.hideIt();
				}
			},
			
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
		margin-top: 10px;
		border-radius: 5px;
		padding-bottom: 10px;
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
	}
	.ls-btn-box{
		margin-top: 5rem;
	}
	.ls-btn{
		font-size:30rpx; line-height:88rpx; padding:0; border-radius:6rpx;
		background:linear-gradient(to right, #00FFD5 ,#008CFF) !important; color:#FFFFFF !important;
	}
	.ls-btn::after{border-radius:5rpx !important; border:none;}
	
	.grace-shade-in {
	    width: 100% !important;
	    height: 100% !important;
	}
</style>

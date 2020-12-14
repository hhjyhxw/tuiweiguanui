<template>
	<gracePage :customHeader="false">
		<view slot="gBody" class="grace-body"  >
			<!-- 表单 -->
			<view class="ls-form">
				<view class="ls-form-item">
					<view class="ls-form-label">银行名称</view>
					<view class="ls-form-input-box">
						<picker mode="selector" :value="bankCardIndex" :range-key="'bankName'" :range="bankCardList" @change="bankCardChange">
							  <view>{{bankCardList[bankCardIndex].bankName}}</view>
						 </picker>
					</view>
				</view>
				<view class="ls-form-item">
					<view class="ls-form-label">支行名称</view>
					<view class="ls-form-input-box">{{bankCard.subBranch}}</view>
				</view>
				<view class="ls-form-item">
					<view class="ls-form-label">用户名称</view>
					<view class="ls-form-input-box">{{bankCard.userName}}</view>
				</view>
				<view class="ls-form-item">
					<view class="ls-form-label">手机号</view>
					<view class="ls-form-input-box">{{bankCard.mobile}}</view>
				</view>
				<view class="ls-form-item">
					<view class="ls-form-label">卡号</view>
					<view class="ls-form-input-box">{{bankCard.cardNo}}</view>
				</view>
				<view class="ls-form-item">
					<view class="ls-form-label">用户余额</view>
					<view class="ls-form-input-box"><text>￥{{shop.balance}}</text></view>
				</view>
				<view class="ls-form-item">
					<view class="ls-form-label">最大可提现金额</view>
					<view class="ls-form-input-box">{{ableAmount}}</view>
				</view>
				<view class="ls-form-item">
					<view class="ls-form-label">提现金额</view>
					<view class="ls-form-input-box"><input class="ls-form-input" v-model="shopDrawdto.amount" placeholder="请输入提现金额"/></view>
				</view>
				<view class="ls-form-item">
					<view class="ls-form-label">手续费率</view>
					<view class="ls-form-input-box"><text>￥{{withdrawFee}}</text></view>
				</view>
				<view class="ls-btn-box">
					<button class="ls-btn ls-btn-blue" @click="save">提现</button>
				</view>
				
			</view>
			<!-- 表单数据end -->
		</view>
	</gracePage>
</template>
<script>
import gracePage from "../../graceUI/components/gracePage.vue";
import { mapState } from 'vuex';  
	export default {
		components:{gracePage,},
		data() {
			return {
				bankCardList:[],//
				bankCardIndex:0,//
				bankCard:{
					
				},
				
				shop:{
					
				},
				ableAmount:null,//可以体现的金额
				withdrawFee:null,//体现手续费率
				shopDrawdto:{
					shopId:null,
					bankId:null,
					amount:null,
				},
				subflag:false,
				
			}
			
		},
		onShow(){
			this.getBankCardList();
			this.getShop();
		},
		onLoad(option){
			
		},
		computed: {
			...mapState(['hasLogin','userInfo'])
		},
		methods: {
			//店铺银行卡列表
			getBankCardList(){
				var that = this;
				that.$api.requestGet('shopkeeper/shopBank', 'bankList',{},failres => {
					that.$api.msg(failres.msg)
				}).then(res => {
					that.bankCardList = res.list;
					if(that.bankCardList!=null && that.bankCardList.length>0){
						that.bankCard = that.bankCardList[that.bankCardIndex];
						that.shopDrawdto.bankId = that.bankCardList[that.bankCardIndex].id;
						that.shopDrawdto.shopId = that.bankCardList[that.bankCardIndex].shopId;
					}
				});
			},
			//
			getShop(){
				var that = this;
				that.$api.requestGet('shopkeeper/shopWithdraw', 'shopblance',{},failres => {
					that.$api.msg(failres.msg)
				}).then(res => {
					that.shop = res.shop;
					that.ableAmount = res.ableAmount;
					that.withdrawFee = res.withdrawFee;
				});
			},
			 bankCardChange: function(e) {
				this.bankCardIndex = e.target.value;
				if(this.bankCardList!=null && this.bankCardList.length>0){
					this.bankCard = this.bankCardList[this.bankCardIndex];
					this.shopDrawdto.bankId = this.bankCardList[this.bankCardIndex].id;
					this.shopDrawdto.shopId = this.bankCardList[this.bankCardIndex].shopId;
				}
			},
		
			//保存
			save(){
				var that = this;
				if(!that.subflag){
					that.subflag = true;
					if(that.bankCardIndex==-1){
						that.$api.msg('请选择银行卡')
						return;
					}
					if(that.shopDrawdto.shopId==null || that.shopDrawdto.shopId==''){
						that.$api.msg('店铺ID参数错误')
						return;
					}
					if(that.shopDrawdto.bankId==null || that.shopDrawdto.bankId==''){
						that.$api.msg('请选择银行卡')
						return;
					}
					if(that.shopDrawdto.amount==null || that.shopDrawdto.amount==''){
						that.$api.msg('请输入提现金额')
						return;
					}
					if(that.shopDrawdto.amount==null || that.shopDrawdto.amount==''){
						that.$api.msg('请输入提现金额')
						return;
					}
					
					if(Number(that.shopDrawdto.amount)>Number(that.ableAmount)){
						that.$api.msg('提现金额不能大于:'+that.ableAmount)
						return;
					}
					that.$api.request('shopkeeper/shopWithdraw', 'applyDraw',that.shopDrawdto, failres => {
						uni.showToast({
							title: failres.msg,
							icon: "none"
						});
					}).then(res => {
						uni.showToast({
							title: '提交成功',
							icon: "none"
						});
						setTimeout(function () {
							that.goback()
						}, 1000);
					})
				}
			},
			goback(){
				uni.navigateBack({
					animationType: 'pop-in',animationDuration: 200
				})
			}
			
			
		},
		
	}
</script>

<style lang='scss'>
	page{
		background-color: #F2F2F2;
		
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
	flex: 1;
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

@import "../../graceUI/animate.css";
.grace-accordion-show{height:auto; animation:fadeIn 300ms linear;visibility:visible;padding: 1rem 0rem; }
.grace-accordion-hide{height:0; animation:fadeOut 300ms linear;visibility:hidden;padding:0;}
</style>

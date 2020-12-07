<template>
<gracePage :customHeader="false">
	<!-- 页面主体 -->
	<view slot="gBody" class="grace-body">
				<view class="user-section">
						<view class="user-info-box">
							<view class="portrait-box" @click="topanel">
								<image class="portrait" :src="shop.shopImg"></image>
							</view>
							<view class="info-box" @click="topanel">
								<text  class="username">{{shop.shopName}}</text>
								<text  class="username">余额:{{shop.balance || 0}}元</text>
							</view>
							<view class="info-btn">
								<view v-show="shop.id">
									<button type="default" v-show="shop.status=='0'"  class="grace-button" size="mini" style="margin-bottom: 10px;" @click="updateShopSatus('1')">开店</button>
									<button type="default" v-show="shop.status=='1'"  class="grace-button" size="mini" style="margin-bottom: 10px;" @click="updateShopSatus('0')">关闭</button>
								</view>
								<view>
									<button type="default" class="grace-button" size="mini">提现</button>
								</view>
							</view>
						</view>
				</view>
				<view class="ucenter-line"></view>
				<!--  -->
				<view class="tihuoaddress">
					<label class="address-label">提货地址:</label>
					<input type="text" class="tihuoaddress-input"  placeholder="编辑自提地址" :value="shopStore.address"></input>
					<view class="btndiv" @tap="showShade">
						<image class="img" src="../../static/addressedit.png"></image>
					</view>
				</view>
				<!-- 遮罩组件 @closeShade="closeShade" 实现点击关闭自身，如果不需要次功能则不绑定此事件即可 -->
				<graceShade @closeShade="closeShade" ref="graceShade">
					<view class="demo-msg grace-relative" @tap.stop="">
						<view  style="padding:20rpx 0;background-color: white;border-radius: 10px;height: 8rem;">
							<textarea class="grace-textarea" v-model="selfaddress" placeholder="提货地址" >{{selfaddress}}</textarea>
						</view>
							<view class="addresssave">
								<button type="primary" style="width: 100%;" class="grace-button" size="mini" @click="saveaddress">保存</button>
							</view>
						<view class="close-btn grace-icons icon-close3 grace-white grace-absolute-rt" @tap.stop="closeShade"></view>
					</view>
				</graceShade>
				<!--  -->
				<view class="ucenter-line"></view>
				<view class="grace-list grace-margin-top">
					<view class="grace-list-items" @click="navigo('/pages/shoppanel/shoppanel')">
						<text class="grace-list-icon grace-icons icon-article grace-blue-sky"></text>
						<view class="grace-list-body grace-border-b">
							<view class="grace-list-title">
								<text class="grace-list-title-text">功能面板</text>
							</view>
						</view>
						<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
					</view>
						<view class="grace-list-items" @click="navigo('/pages/shopcategory/shopcategory')">
							<text class="grace-list-icon grace-icons icon-article grace-blue-sky"></text>
							<view class="grace-list-body grace-border-b">
								<view class="grace-list-title">
									<text class="grace-list-title-text">商品分类</text>
								</view>
							</view>
							<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
						</view>
						<view class="grace-list-items" @click="navigo('/pages/upgoods/upgoods')">
							<text class="grace-list-icon grace-icons icon-wallet grace-green"></text>
							<view class="grace-list-body grace-border-b">
								<view class="grace-list-title">
									<text class="grace-list-title-text">商品维护</text>
								</view>
							</view>
							<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
						</view>
						<view class="grace-list-items" @click="navigo('/pages/upgoods/upsku')">
							<text class="grace-list-icon grace-icons icon-article grace-blue-sky"></text>
							<view class="grace-list-body grace-border-b">
								<view class="grace-list-title">
									<text class="grace-list-title-text">商品上架</text>
								</view>
							</view>
							<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
						</view>
						<view class="grace-list-items" @click="navigo('/pages/shopadd/shopadd')">
							<text class="grace-list-icon grace-icons icon-user grace-red"></text>
							<view class="grace-list-body">
								<view class="grace-list-title">
									<text class="grace-list-title-text">广告维护</text>
								</view>
							</view>
							<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
						</view>
						<view class="grace-list-items" @click="navigo('/pages/shopcoupon/shopcoupon')">
							<text class="grace-list-icon grace-icons icon-article grace-blue-sky"></text>
							<view class="grace-list-body grace-border-b">
								<view class="grace-list-title">
									<text class="grace-list-title-text">优惠券</text>
								</view>
							</view>
							<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
						</view>
						<view class="grace-list-items" @click="navigo('/pages/shopbankcard/shopbankcardlist')">
							<text class="grace-list-icon grace-icons icon-article grace-blue-sky"></text>
							<view class="grace-list-body grace-border-b">
								<view class="grace-list-title">
									<text class="grace-list-title-text">银行卡</text>
								</view>
							</view>
							<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
						</view>
						<view class="grace-list-items" @click="navigo('/pages/shopwithdraw/shopcash-list')">
							<text class="grace-list-icon grace-icons icon-article grace-blue-sky"></text>
							<view class="grace-list-body grace-border-b">
								<view class="grace-list-title">
									<text class="grace-list-title-text">资金明细</text>
								</view>
							</view>
							<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
						</view>
						<view class="grace-list-items" @click="navigo('/pages/shopwithdraw/shopwithdraw-list')">
							<text class="grace-list-icon grace-icons icon-article grace-blue-sky"></text>
							<view class="grace-list-body grace-border-b">
								<view class="grace-list-title">
									<text class="grace-list-title-text">提现记录</text>
								</view>
							</view>
							<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
						</view>
						<view class="grace-list-items" @click="navigo('/pages/shopreport/shop-gooodsday-report')">
							<text class="grace-list-icon grace-icons icon-article grace-blue-sky"></text>
							<view class="grace-list-body grace-border-b">
								<view class="grace-list-title">
									<text class="grace-list-title-text">商品日报</text>
								</view>
							</view>
							<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
						</view>
						<view class="grace-list-items" @click="navigo('/pages/shopreport/shop-orderday-report')">
							<text class="grace-list-icon grace-icons icon-article grace-blue-sky"></text>
							<view class="grace-list-body grace-border-b">
								<view class="grace-list-title">
									<text class="grace-list-title-text">订单日报</text>
								</view>
							</view>
							<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
						</view>
						<view class="grace-list-items" @click="navigo('/pages/shoptoday_order/shoptoday_order')">
							<text class="grace-list-icon grace-icons icon-article grace-blue-sky"></text>
							<view class="grace-list-body grace-border-b">
								<view class="grace-list-title">
									<text class="grace-list-title-text">今日订单</text>
								</view>
							</view>
							<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
						</view>
						<view class="grace-list-items" @click="navigo('/pages/shoptoday_order/shophistory_order')">
							<text class="grace-list-icon grace-icons icon-article grace-blue-sky"></text>
							<view class="grace-list-body grace-border-b">
								<view class="grace-list-title">
									<text class="grace-list-title-text">历史订单</text>
								</view>
							</view>
							<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
						</view>
				</view>
			</view>
</gracePage>
</template>
<script>
import gracePage from "../../graceUI/components/gracePage.vue";
import graceShade from "../../graceUI/components/graceShadeShopcenter.vue";
	import {
	    mapState 
	} from 'vuex'; 
	export default {
		components:{gracePage,graceShade},
		data() {
			return {
				selfaddress:'',
				shopId:null,
				shop:{
					shopName:'大萝卜店铺',
					shopImg:'/static/missing-face.png',
					status:'0', //0 关闭 1开启
				},
				shopStore:{
					address:''
				}
			}
		},
		onShow(){
			if(this.shopId==null || typeof(this.shopId) == "undefined"){
				try {
				    const value = uni.getStorageSync('shopMainId');
				    if (value) {
				        console.log("value======"+value);
						this.shopId = value;
				    }
				} catch (e) {
				    // error
				}
			}
			this.init();
			
		},
		onLoad(option){
			console.log('option===='+JSON.stringify(option)); //打印出上个页面传递的参数。
			this.shopId = option.shopId;
		},
		computed: {
			...mapState(['hasLogin','userInfo'])
		},
		methods: {
			init(){
				//
				this.getShopinfo();
			},
			navigo(url){
				uni.navigateTo({
					url: url
				})
			},
			//获取店铺信息
			getShopinfo(){
				var that = this;
				that.$api.requestGet('shopkeeper/shopcenter', 'shopinfo',null,failres => {
					that.$api.msg(failres.msg)
				}).then(res => {
					that.shop = res.shop;
					if(res.shopStore!=null){
						that.shopStore = res.shopStore;
					}
				});
			},
			//开启或者关闭店铺
			updateShopSatus(status){
				var that = this;
				var content = status=='1'?'确定开启店铺':'确定关闭店铺'
				uni.showModal({
					title: '提示',
					content: content,
					showCancel: true,
					confirmText: '确定',
					success: (e) => {
						if (e.confirm) {
							that.$api.request('shopkeeper/shopcenter', 'updateShopSatus',{
								id:that.shop.id,
								status:status
							}, failres => {
								uni.showToast({
									title: failres.errmsg,
									icon: "none"
								});
							}).then(res => {
								that.shop.status=status;
								uni.showToast({
									title: '操作成功',
									icon: "none"
								});
							})
						}
					},
					fail: () => {},
					complete: () => {
						
					}
				})
				
			},
			//店铺功能面板
			topanel(){
				const that = this;
				uni.navigateTo({
					url: '/pages/shoppanel/shoppanel?shopId='+that.shopId
				})
			},
			showShade : function () {
				this.selfaddress = this.shopStore.address;
				this.$refs.graceShade.showIt();
			},
			closeShade : function () {
				this.$refs.graceShade.hideIt();
			},
			//保存自提地址
			saveaddress(){
				var that = this;
				if(that.selfaddress==null || that.selfaddress==''){
					that.$api.msg('地址不能为空')
				}else{
					that.shopStore.address = that.selfaddress;
					that.shopStore.shopId = that.shop.id;
					that.shopStore.titile = that.selfaddress;
					that.closeShade();
					that.$api.request('shopkeeper/shopcenter', 'saveStoreAddress',that.shopStore, failres => {
						uni.showToast({
							title: failres.errmsg,
							icon: "none"
						});
					}).then(res => {
						uni.showToast({
							title: '操作成功',
							icon: "none"
						});
					})
				}
				
			},
			getLatestOrder(){
				const that = this;
				if(that.shopId==null){
					try {
					    const value = uni.getStorageSync('shopMainId');
					    if (value) {
							that.shopId = value;
					    }
					} catch (e) {
					    // error
					}
				}
				if(that.shopId==null){
					return;
				}
				let param ={
					'shopId':that.shopId
				};
				that.$api.requestGet('order', 'latesOrder',param,failres => {
					that.$api.msg(failres.msg)
				}).then(res => {
					if(res.code==0 && res.order!=null){
						console.log('res===='+JSON.stringify(res)); //打印出上个页面传递的参数。
						that.order = res.order;
					}else{
						this.hasdata=false;
					}
				});
			},
			//继续支付
			gotopay(item){
				uni.navigateTo({
					 url: '/pages/pay/pay?price='+item.actualPrice+'&orderNo='+item.orderNo+'&shopId='+item.shopId
				})
			},
			toLogin() {
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/public/login'
					})
				}
			},
		}
	}
</script>

<style lang='scss'>

	%flex-center {
	 display:flex;
	 flex-direction: column;
	 justify-content: center;
	 align-items: center;
	}
	%section {
	  display:flex;
	  justify-content: space-around;
	  align-content: center;
	  background: #fff;
	  border-radius: 10upx;
	}
	.user-section{
		height: 200upx;
	    padding: 21px 15px 15px 28px;
		background-image: linear-gradient(#00CED1, #66ffff);
		left: 0;
		top: 0;
		
	}
	.user-info-box{
		height: 180upx;
		display:flex;
		align-items:center;
		position:relative;
		z-index: 1;
		.portrait{
			width: 80px;
			height: 80px;
			border:5upx solid #fff;
			border-radius: 50%;
		}
		.info-box{
			display: flex;
			flex-direction: column;
		}
		.info-btn{
			display: flex;
			flex-direction: column;
			margin-left: 3rem;
			padding: 0.2px;
		}
		.username{
			font-size: 33rpx;
			color: $font-color-dark;
			margin-left: 20upx;
		}
	}
	
		.vip-card-box{
			display:none;
			flex-direction: column;
			color: #f7d680;
			height: 240upx;
			background: linear-gradient(left, rgba(0,0,0,.7), rgba(0,0,0,.8));
			border-radius: 16upx 16upx 0 0;
			overflow: hidden;
			position: relative;
			padding: 20upx 24upx;
			.card-bg{
				position:absolute;
				top: 20upx;
				right: 0;
				width: 380upx;
				height: 260upx;
			}
			.b-btn{
				position: absolute;
				right: 20upx;
				top: 16upx;
				width: 132upx;
				height: 40upx;
				text-align: center;
				line-height: 40upx;
				font-size: 22upx;
				color: #36343c;
				border-radius: 20px;
				background: linear-gradient(left, #f9e6af, #ffd465);
				z-index: 1;
			}
			.tit{
				font-size: $font-base+2upx;
				color: #f7d680;
				margin-bottom: 28upx;
				.yticon{
					color: #f6e5a3;
					margin-right: 16upx;
				}
			}
			.e-b{
				font-size: $font-sm;
				color: #d8cba9;
				margin-top: 10upx;
			}
		}
	
	
	.tihuoaddress{
		display: flex;
		justify-content: space-around;
		align-items: center;
		position:relative;
		.grace-form-input{
			flex: 2;
		}
		.address-label{
			position: absolute;
			left: 7px;
		}
		.tihuoaddress-input{
			margin-left: -1.5rem;
		}
		.btndiv{
			    background-image: '/pages/static/addressedit.png';
			    display: flex;
			    justify-content: center;
			    align-items: center;
				position: absolute;
				right: 7px;
				.img{
					width: 2rem;
					height: 2rem;
				}
		}
	}
	.addresssave{
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.desc{
	/* 	display: flex;
		line-height: 2rem;
		text-align: center;
		padding-left: 2rem;
		color: red;
		padding: 1rem; */
		
		display: flex;
		line-height: 2rem;
		text-align: center;
		padding-left: 1rem;
		color: red;
		padding: 1rem;
		background:#F5F5F5;
		justify-content: space-around;
		color: black;
		margin: 1px;
		.time{
			color: black;
		}
		.peyed{
			color: black;
		}
		.gopay{
			display: block;
			border: 1px solid lightgray;
			background-color: red;
			border-radius: 7px;
			font-size: 0.8rem;
			padding: 0rem 0.3rem;
			color: white;
		}
	}

.ucenter-face{width:100rpx !important; height:100rpx !important;}
.ucenter-face-image{width:100rpx !important; height:100rpx !important;}
.ucenter-line{height:12rpx; background-color:#F4F5F6; margin:16rpx 0;}

.demo-msg{padding:3px;
		background-color: white;
		/* margin-top: 45px; */
		border-radius: 5px;
		padding-bottom: 10px;
		height: 100%;width:19rem; font-size:0;}
.demo-msg-in{width:500rpx; height:800rpx;}
.close-btn{width:80rpx; height:80rpx; line-height:80rpx; text-align:center; font-size:40rpx; z-index:7;}
.grace-relative{
		height: 100% !important;
	}
</style>

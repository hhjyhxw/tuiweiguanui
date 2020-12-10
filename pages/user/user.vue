<template>  
   <gracePage :customHeader="false">
		<view slot="gBody" class="grace-body">
		<view class="user-section">
			<view class="user-info-box">
				<view class="portrait-box">
					<image class="portrait" :src="user.headimgurl || '/static/missing-face.png'"></image>
				</view>
				<view class="info-box">
					<text @click="toLogin" class="username">{{ user.nickname? (user.nickname || '未设置昵称') : '立即登录' }}</text>
				</view>
			</view>
		</view>
		
		<view 
			class="cover-container"
			:style="[{
				transform: coverTransform,
				transition: coverTransition
			}]"
			@touchstart="coverTouchstart"
			@touchmove="coverTouchmove"
			@touchend="coverTouchend"
		>
		<!-- 	<image class="arc" src="/static/arc.png"></image> -->
			
			<!-- <view class="tj-sction">
				<view class="tj-item">
					<text class="num">128.8</text>
					<text>余额</text>
				</view>
				<view class="tj-item">
					<text class="num">0</text>
					<text>优惠券</text>
				</view>
				<view class="tj-item">
					<text class="num">20</text>
					<text>积分</text>
				</view>
			</view> -->
			<!-- 订单 -->
			<!-- <view class="order-section">
				<view class="order-item" @click="navTo('/pages/order/list?state=0')" hover-class="common-hover"  :hover-stay-time="50">
					<text class="yticon icon-shouye"></text>
					<text>全部订单</text>
				</view>
				<view class="order-item" @click="navTo('/pages/order/list?state=10')"  hover-class="common-hover" :hover-stay-time="50">
					<text class="yticon icon-daifukuan"></text>
					<text>待付款</text>
				</view>
				<view class="order-item" @click="navTo('/pages/order/list?state=30')" hover-class="common-hover"  :hover-stay-time="50">
					<text class="yticon icon-yishouhuo"></text>
					<text>待收货</text>
				</view>
				<view class="order-item" @click="navTo('/pages/order/list?state=60')" hover-class="common-hover"  :hover-stay-time="50">
					<text class="yticon icon-shouhoutuikuan"></text>
					<text>退款/售后</text>
				</view>
			</view>
			 -->
			 <view class="history-section icon">
				<view v-if="footprintList.length > 0" class="sec-header">
					<text class="yticon icon-lishijilu"></text>
					<text>浏览历史</text>
				</view>
				<scroll-view v-if="footprintList.length > 0" scroll-x class="h-list">
					<image v-for="(item, index ) in footprintList" :key="index" @longpress="deleteFootprint(item)" @click="navTo('/pages/product/detail?id=' + item.spuId)" :src="item.spuImg" mode="aspectFill"></image>
				</scroll-view>
				<list-cell icon="icon-shoucang_xuanzhongzhuangtai" iconColor="#54b4ef"  title="最近订单" @eventClick="golatestorder"></list-cell>
				<list-cell icon="icon-iconfontweixin" iconColor="#EEEE00" title="优惠券" @eventClick="gotoMycoupon"></list-cell>
				<list-cell icon="icon-shoucang_xuanzhongzhuangtai" iconColor="#54b4ef"  title="历史订单" @eventClick="goorderList"></list-cell>
				<list-cell icon="icon-zuoshang" iconColor="#e07472" title="退出登录" border="" @eventClick="logout()"></list-cell>
				<list-cell icon="icon-gouwuche_" iconColor="#EEEE00" title="店铺中心" @eventClick="gotoShopcenter"></list-cell>
			</view> 
		</view>
			
		
		 <view v-if="isbind==0"  id="bgbox" class="bgbox">
		        <view class="contentbox">
		            <view class="ls-form"  style="margin-top:4.5rem;">
							<image src="../../static/x.png" class="ls-close-btn" @click="closewin"></image>
							<view class="ls-form-item">
							    <view class="ls-form-label">店铺编号</view>
							    <view class="ls-form-input-box"><input id="pwd" v-model="shopman.shopCode" class="ls-form-input"/></view>
							</view>
		                    <view class="ls-form-item">
		                        <view class="ls-form-label">账号</view>
		                        <view class="ls-form-input-box"><input id="account" v-model="shopman.accountNo" class="ls-form-input"/></view>
		                    </view>
							<view class="ls-form-item">
							    <view class="ls-form-label">密码</view>
							    <view class="ls-form-input-box"><input id="pwd" v-model="shopman.pwd" class="ls-form-input"/></view>
							</view>
		                <view class="ls-btn-box">
		                    <button class="ls-btn ls-btn-blue" @click.stop="gobind">绑定</button>
		                </view>
		            </view>
		        </view>
		    </view>
    </view>  
	</gracePage>
</template>
<script>
import gracePage from "../../graceUI/components/gracePage.vue";
	import listCell from '@/components/mix-list-cell';
    import {   mapState  } from 'vuex';  
       
   
	let startY = 0, moveY = 0, pageAtTop = true;
    export default {
		components: {
			listCell
		},
		data(){
			return {
				coverTransform: 'translateY(0px)',
				coverTransition: '0s',
				moving: false,
				footprintList: [],
				isVip: false,
				shopId:null,
				isbind:1, //用户是否的绑定该店铺店主
				user:{
					headimgurl:'',
					nickname:''
				},
				shopman:{
					accountNo:'',
					pwd:'',
					shopCode:''
				}
			}
		},
		onShow() {
			this.initShopId();
			this.isVip = this.$api.isVip()
			this.userinfo();
			// this.loadFootprint()
		},
		onLoad(option){
			// console.log('option===='+JSON.stringify(option)); //打印出上个页面传递的参数。
			// this.shopId = option.shopId;
			// this.userinfo();
		},
		// #ifndef MP
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if (index === 0) {
				this.navTo('/pages/set/set');
			}else if(index === 1){
				// #ifdef APP-PLUS
				const pages = getCurrentPages();
				const page = pages[pages.length - 1];
				const currentWebview = page.$getAppWebview();
				currentWebview.hideTitleNViewButtonRedDot({
					index
				});
				// #endif
				uni.navigateTo({
					url: '/pages/notice/notice'
				})
			}
		},
		// #endif
        computed: {
			...mapState(['hasLogin','userInfo'])
		},
        methods: {
			
			initShopId(){
				var that =this;
				try {
					const value = uni.getStorageSync('shopId');
					console.log('this.shopId1==='+(value))
					if (value) {
						that.shopId = value;
					}
				} catch (e) {
				}
				if(that.shopId==null){
					uni.navigateTo({
						url: '/pages/index/index'
					})
				}
			},
			async loadFootprint() {
				const that = this
				that.$api.request('footprint', 'getAllFootprint').then(res => {
					that.footprintList = res.data
				})
			},
			
			deleteFootprint(item) {
				const that = this
				uni.showModal({
					title: '删除？',
					content: '您确定要删除此足迹吗？',
					success : (e) => {
						if (e.confirm) {
							that.$api.request('footprint', 'deleteFootprint', {
								footprintId: item.id
							}).then(res => {
								that.loadFootprint()
							})
						}
					}
				})
			},
			//我的代金券
			userinfo(){
				var that = this;
				that.$api.requestGet('user', 'info',failres => {
						that.$api.msg(failres.msg)
				}).then(res => {
					if(res.code==0){
						that.user = res.user;
					}
				});
			},
			//我的代金券
			gotoMycoupon(){
				const that = this;
				uni.navigateTo({
					url: '/pages/mycoupon/mycoupon?shopId='+that.shopId
				})
			},
			//店铺中心
			gotoShopcenter(){
				const that = this;
				let param ={
					'shopId':that.shopId,
				};
				that.$api.requestGet('shopkeeper/shopcenter', 'checkShopkeeper',param,failres => {
					if(failres.code==6000){
						that.isbind = 0;
					}else{
						that.$api.msg(failres.msg)
					}
				}).then(res => {
					if(res.code==0){
						uni.navigateTo({
							url: '/pages/shopcenter/shopcenter?shopId='+that.shopId
						})
					}
				});
				
			},
			toLogin() {
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/public/login'
					})
				}
			},
			
			logout() {
				const that = this
				uni.showModal({
					title: '询问',
					content: '您确定要退出吗？',
					cancelText: '取消',
					confirmText: '确定',
					success: (e) => {
						if (e.confirm) {
							that.$store.commit('logout')
							that.$api.logout()
							that.user=null
						}
					}
				})
			},

			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			navTo(url){
				if(!this.hasLogin){
					url = '/pages/public/login';
				}
				uni.navigateTo({  
					url
				})
			}, 
			golatestorder(){
				var that = this;
				var url = '/pages/order/latestorder?shopId='+that.shopId;
				uni.navigateTo({
					url
				})
			},
			goorderList(){
				var that = this;
				var url = '/pages/order/order?shopId='+that.shopId;
				uni.navigateTo({
					url
				})
			},
			//关闭店主绑定弹窗
			closewin(){
				this.isbind=1;
			},
			//绑定店主
			gobind(){
				var that = this;
				if(that.shopman.accountNo==null || that.shopman.accountNo==''){
					that.$api.msg("账号不能为空")
					return;
				}
				if(that.shopman.shopCode==null || that.shopman.shopCode==''){
					that.$api.msg("店铺编号不能为空")
					return;
				}
				if(that.shopman.pwd==null || that.shopman.pwd==''){
					that.$api.msg("密码不能为空")
					return;
				}
				that.$api.request('shopkeeper/shopcenter', 'shopmanBind',{
					accountNo:that.shopman.accountNo,
					pwd:that.shopman.pwd,
					shopCode:that.shopman.shopCode
					
				}, failres => {
					uni.showToast({
						title: failres.errmsg,
						icon: "none"
					});
				}).then(res => {
					uni.showToast({
						title: '绑定成功',
						icon: "none"
					});
					that.isbind=1
				})
				//event.stopPropagation(); 
				//this.isbind=1;
			},
			/**
			 *  会员卡下拉和回弹
			 *  1.关闭bounce避免ios端下拉冲突
			 *  2.由于touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的时候会有掉帧的感觉
			 *    transition设置0.1秒延迟，让css来过渡这段空窗期
			 *  3.回弹效果可修改曲线值来调整效果，推荐一个好用的bezier生成工具 http://cubic-bezier.com/
			 */
			coverTouchstart(e){
				if(pageAtTop === false){
					return;
				}
				this.coverTransition = 'transform .1s linear';
				startY = e.touches[0].clientY;
			},
			coverTouchmove(e){
				moveY = e.touches[0].clientY;
				let moveDistance = moveY - startY;
				if(moveDistance < 0){
					this.moving = false;
					return;
				}
				this.moving = true;
				if(moveDistance >= 80 && moveDistance < 100){
					moveDistance = 80;
				}
		
				if(moveDistance > 0 && moveDistance <= 80){
					this.coverTransform = `translateY(${moveDistance}px)`;
				}
			},
			coverTouchend(){
				if(this.moving === false){
					return;
				}
				this.moving = false;
				this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)';
				this.coverTransform = 'translateY(0px)';
			}
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
	    padding: 30px 15px 15px 28px;
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
		.username{
			font-size: $font-lg + 6upx;
			color: $font-color-dark;
			margin-left: 20upx;
		}
	}

	.vip-card-box{
		display:flex;
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
	.cover-container{
		background: $page-color-base;
		/* margin-top: -150upx; */
		/* padding: 0 30upx; */
		position:relative;
		background: #f5f5f5;
		padding-bottom: 20upx;
		.arc{
			position:absolute;
			left: 0;
			top: -34upx;
			width: 100%;
			height: 36upx;
		}
	}
	.tj-sction{
		@extend %section;
		.tj-item{
			@extend %flex-center;
			flex-direction: column;
			height: 140upx;
			font-size: $font-sm;
			color: #75787d;
		}
		.num{
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 8upx;
		}
	}
	.order-section{
		@extend %section;
		padding: 28upx 0;
		margin-top: 20upx;
		.order-item{
			@extend %flex-center;
			width: 120upx;
			height: 120upx;
			border-radius: 10upx;
			font-size: $font-sm;
			color: $font-color-dark;
		}
		.yticon{
			font-size: 48upx;
			margin-bottom: 18upx;
			color: #fa436a;
		}
		.icon-shouhoutuikuan{
			font-size:44upx;
		}
	}
	.history-section{
		padding: 30upx 0 0;
		margin-top: 20upx;
		background: #fff;
		border-radius:10upx;
		.sec-header{
			display:flex;
			align-items: center;
			font-size: $font-base;
			color: $font-color-dark;
			line-height: 40upx;
			margin-left: 30upx;
			.yticon{
				font-size: 44upx;
				color: #5eba8f;
				margin-right: 16upx;
				line-height: 40upx;
			}
		}
		.h-list{
			white-space: nowrap;
			padding: 30upx 30upx 0;
			image{
				display:inline-block;
				width: 160upx;
				height: 160upx;
				margin-right: 20upx;
				border-radius: 10upx;
			}
		}
	}
	
	   .ls-form{
			padding:3px;
			background-color: white;
			margin-top: 10px;
			border-radius: 5px;
			padding-bottom: 10px;
			position: relative;
		}
		.ls-close-btn{
			position: absolute;
			height: 2rem;
			width: 2rem;
			top: -4.5rem;
			right: 0;
		}
		.ls-form-item{
			display: flex;
			justify-content: space-around;
			align-items: center;
			height: 2.5rem;
			line-height: 2.8rem;
		}
		.ls-form-label{
			flex: 1;
			text-align:center;
		}
		.ls-form-input-box{
			flex: 3;
		}
		.ls-form-input{
			width:89%;
			border-bottom: 1px solid lightgray;
		}
		.ls-btn-box{
			margin-top: 3rem;
			display: flex;
			justify-content: space-around;
			align-items: center;
		}
		.ls-btn{
			font-size: 30rpx;
			line-height: 2.5rem;
			height:2.5rem;
			padding: 0;
			border-radius: 1rem;
			background: linear-gradient(to right, #00FFD5 ,#008CFF) !important;
			color: #FFFFFF !important;
			width: 86%;
			display: block;
		}
		.ls-btn::after{border-radius:5px !important; border:none;}

		.bgbox{
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			bottom: 0;
			eft: 0;
			right: 0;
			background:rgba(0, 0, 0,0.7);
			overflow: hidden;
		}
		.bgbox .contentbox{
			display:flex;
			flex-direction: column;
			width: 65%;
			height: 43%;
			background: white;
			border-radius: 0.5rem;
			margin: 50% auto auto auto;
			overflow: hidden;
		}
</style>
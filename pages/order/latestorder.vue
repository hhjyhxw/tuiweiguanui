<template>
<gracePage :customHeader="false">
	<!-- 页面主体 -->
	<view slot="gBody" class="grace-body" v-show="!hasdata">
		<graceEmptyNew>
			<view slot="img" class="empty-view">
				<!-- 请根据您的项目要求制作并更换为空图片 -->
				<image class="empty-img" mode="widthFix" src="https://staticimgs.oss-cn-beijing.aliyuncs.com/empty.png"></image>
			</view>
			<text slot="text" class="grace-text-small grace-gray">抱歉，暂时没有数据</text>
		</graceEmptyNew>
	</view>
	<view slot="gBody" class="grace-body" v-show="hasdata">
			<view class="user-section">
				<view class="user-info-box">
					<view class="portrait-box">
						<image class="portrait" :src="userInfo.headimgurl || '/static/missing-face.png'"></image>
					</view>
					<view class="info-box">
						<text @click="toLogin" class="username">{{ hasLogin? (userInfo.nickname || '未设置昵称') : '立即登录' }}</text>
					</view>
				</view>
			</view>
			
			<!-- 描述 -->
			<view class="desc" v-if="order!=null">
				<text>时间：{{order.createTime}}</text>
				<text v-if="order.payStatus===2"  class="peyed">已支付</text>
				<text v-if="order.payStatus!=2" class="gopay" @click="gotopay(order)">去支付</text>
			</view>
			
			<!-- 商品列表 -->
			<view class="goods-list">
				<view class="goods-item" v-for="(item,index) in order.detaillist" :key="index">
					<image class="goods-img" :src="item.spuImg"></image>
					<view class="goods-info">
						<view class="goods-name">{{item.skuTitle}}</view>
						<view class="price-amount">
							<view class="price">￥{{item.price}}</view>
							<view class="num">{{item.num}}份</view>
							<view class="total-amount">￥{{item.price*item.num}}</view>
						</view>
					</view>
					<view class="add" v-if="order.payStatus==0 || order.payStatus==1" >未支付</view>
					<view class="add" v-if="order.payStatus==2" >已支付</view>
				</view>
			</view>
		</view>
</gracePage>
</template>
<script>
import gracePage from "../../graceUI/components/gracePage.vue";
import graceEmptyNew from "../../graceUI/components/graceEmptyNew.vue";
	import {
	    mapState 
	} from 'vuex'; 
	export default {
		components:{gracePage,graceEmptyNew},
		data() {
			return {
				hasdata:true,//页面是否有数据
				shopId:null,
				order:null
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
			this.getLatestOrder();
		},
		onLoad(option){
			console.log('option===='+JSON.stringify(option)); //打印出上个页面传递的参数。
			this.shopId = option.shopId;
		},
		computed: {
			...mapState(['hasLogin','userInfo'])
		},
		methods: {
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
				if(that.shopId==null  || typeof(that.shopId) == "undefined" || that.shopId=='null' ){
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
.goods-item{
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding: 1rem 0.5rem;
		border-bottom: 1px solid #F5F5F5;
		margin: 0.1rem 0.3rem;
		.minus{
			width:1.5rem;
			height: 1.5rem;
			margin: 0.1rem 1rem;
		}
		.goods-img{
			height: 3.5rem;
			width: 3.5rem;
		}
		.goods-info{
			display: flex;
			flex-direction:column ;
			justify-content: space-around;
			flex: 1;
			text-align: center;
			padding: 0.2rem;
			.goods-name{
				padding-left: 1rem;
				text-align: left;
				font-weight:bold;
			}
			.price-amount{
				display: flex;
				justify-content: space-around;
				flex-direction:row ;
				.price{
					font-size: 0.8rem;
					color: 	#90EE90;
					padding: 0.1rem 0.3rem;

				}
				.num{
					font-size: 0.8rem;
					color: 	#FFD700;
					padding: 0.1rem 0.3rem;

				}
				.total-amount{
					font-size: 0.8rem;
					color: 	red;
					padding: 0.1rem 0.3rem;

				}
			}
		}
		.add{
			margin: 0.1rem 1rem;
		}
	}

	.empty-view{width:280rpx; height:280rpx; border-radius:280rpx; background-color:#F6F7F8; margin-top:300rpx;}
	.empty-img{width:220rpx; height:200rpx; margin:40rpx; border-radius:200rpx;}
	.grace-text-small{margin-top:10px;}
</style>

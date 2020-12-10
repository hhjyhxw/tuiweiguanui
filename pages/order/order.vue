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
			<view class="totalAmout">
				<view>总下单金额 <text class="money">￥{{totalAmount}}</text></view>
			</view>
			<view class="grace-accordion grace-margin-top" style="margin-top:0px;">
				<!-- 项目1 -->
				<view class="grace-accordion-items" v-for="(item,index) in orderlist" :key="index" >
					<view class="grace-accordion-title grace-border-b" :id="'grace-accordion-'+index"  @tap="showorHide(item,index)" hover-stay-time="100" hover-class="grace-opacity">
						<text class="grace-icons">{{item.createTime}}</text><text class="money" style="color:red;">￥{{item.actualPrice}}</text>
						<text class="grace-icons icon-arrow-up" v-if="item.show==true"></text>
						<text class="grace-icons icon-arrow-down" v-else></text>
					</view>
					<view :class="['grace-accordion-body', item.show==true ? 'grace-accordion-show' : 'grace-accordion-hide']" style="font-size:0;">
						<view  class="goods-item" v-for="(item1,index1) in item.detaillist" :key="index1">
							<image class="goods-img" :src="item1.spuImg"></image>
							<view class="goods-info">
								<view class="goods-name">{{item1.skuTitle}}</view>
								<view class="price-amount">
									<view class="price">￥{{item1.price}}</view>
									<view class="num">{{item1.num}}份</view>
									<view class="total-amount">￥{{item1.price*item1.num}}</view>
								</view>
							</view>
							<view class="add" v-if="item.payStatus==0 || item.payStatus==1" >未支付</view>
							<view class="add" v-if="item.payStatus==2" >已支付</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</gracePage>
</template>
<script>
import gracePage from "../../graceUI/components/gracePage.vue";
import graceEmptyNew from "../../graceUI/components/graceEmptyNew.vue";
import { mapState } from 'vuex';  
	export default {
		components:{gracePage,graceEmptyNew},
		data() {
			return {
				hasdata:true,
				shopId:null,
				orderlist:[],
				queryData:{
					shopId:null,
					pageNum: 1,//商品列表 页码
					pageSize:5,
					totalPage: 0,//商品列表总页数
				},
				totalAmount:0,//总下单金额
				accordionActive: "grace-accordion-1"
			}
			
		},
		onShow(){
			this.initShopId();
			this.init();
		},
		onLoad(option){
			
		},
		computed: {
			...mapState(['hasLogin','userInfo'])
		},
		methods: {
			initShopId(){
				try {
					const value = uni.getStorageSync('shopId');
					if (value) {
						this.shopId = value;
						this.queryData.shopId=value;
					}
				} catch (e) {
				}
				if(this.shopId==null){
					uni.navigateTo({
						url: '/pages/index/index'
					})
				}
			},
			changeAccordion : function(e){
						var accordionIndex = e.currentTarget.id;
						if (this.accordionActive == accordionIndex){accordionIndex = '';}
						this.accordionActive = accordionIndex;
					},
			init(){
				this.getTotalAmount();
				this.getOrderList(this.queryData,true);
			},
			getTotalAmount(){
				const that = this
				let param ={
					'shopId':that.shopId
				};
				that.$api.requestGet('order', 'getTotalOrderAmount',param,failres => {
					that.$api.msg(failres.msg)
				}).then(res => {
					if(res.code==0){
					console.log('res===='+JSON.stringify(res)); //打印出上个页面传递的参数。
						that.totalAmount = res.totalAmount;
					}
				});
			},
			//获取店铺商品列表
			async getOrderList (querData,first) {
				console.log(JSON.stringify(querData));
			    let result = await this.$api.requestGet('order', 'orderlist',querData);
				console.log(JSON.stringify(result));
			    if(result.code != 0 || result.page.list==null || result.page.list.length==0){
			    	this.hasdata = false;//没有数据展示空页
			    	return;
			    } 
			    this.queryData.totalPage = result.page.totalPage;
			   if(first) {//是否是刷新 或者第一次加载
			       this.orderlist =  result.page.list ;
			   } else {
			       this.orderlist = this.orderlist.concat(result.page.list);
			   }
			},
			
			showorHide(item0,index0){
				if(item0.show==true){
					// item0.show = false;
					this.orderlist[index0].show=false;
				}else{
					// item.show = true;
					this.orderlist[index0].show=true;
				}
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
		},
		
		onPullDownRefresh() {
			 this.queryData.pageNum = 1;
			 this.queryData.totalPage = 0;
			 this.getOrderList(this.queryData,true);
			   uni.stopPullDownRefresh();
		 },
		 onReachBottom(){//页面滚动到底部的事件
		 	if (this.queryData.pageNo > this.queryData.totalPage) {
		 		return false;
		 	}
		     this.queryData.pageNum = this.queryData.pageNum + 1;
		 	 console.log("pageNum==="+this.queryData.pageNum);
		 	  console.log("totalPage==="+this.queryData.totalPage);
		     if (this.queryData.pageNum > this.queryData.totalPage) {
		         return false;
		     }
		     this.getOrderList(this.queryData,false);
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

	.totalAmout{
		display: flex;
		line-height: 2rem;
		text-align: center;
		padding-left: 1rem;
		color: red;
		padding: 0.5rem;
		background:white;
		/* justify-content: space-around; */
		margin: 1px;
		
		.money{
			padding-left: 1rem;
			font-size:1rem;
		}
	}
	.goods-list{
		/* background:#F5F5F5; */
	}
	.desc{
		display: flex;
		line-height: 2rem;
		text-align: center;
		padding-left: 1rem;
		color: red;
		padding: 1rem;
		background:#F5F5F5;
		justify-content: space-around;
		margin: 1px;
		
		.time{
			color: black;
		}
		.money{
			color: red;
		}
		.peyed{
			color: black;
		}
		.gopay{
			isplay: block;
			border: 1px solid lightgray;
			background-color: lightblue;
			border-radius: 7px;
			font-size: 0.8rem;
			padding: 0rem 0.3rem;

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
		.activeClass{
			display: block;
		}
		.noActive{
			display:none;
		}
	}


@import "../../graceUI/animate.css";
.grace-accordion-show{height:auto; animation:fadeIn 300ms linear;}
.grace-accordion-hide{height:0; animation:fadeOut 300ms linear;}
.grace-accordion-title{color:#323232; background:#F8F8F8;}
.grace-accordion-title .grace-icons:before{margin-right:15rpx; font-size:36rpx !important;}

/* 空白数据页面  */
.empty-view{width:280rpx; height:280rpx; border-radius:280rpx; background-color:#F6F7F8; margin-top:300rpx;}
.empty-img{width:220rpx; height:200rpx; margin:40rpx; border-radius:200rpx;}
.grace-text-small{margin-top:10px;}
</style>

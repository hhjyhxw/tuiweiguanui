<template>
	<gracePage :customHeader="false">
		<view slot="gBody" class="grace-body"  >
			<view class="SegmentedControlIn">
				<graceSegmentedControl :items="tabs" :current="tabCurrentIndex" @change="onChange"></graceSegmentedControl>
			</view>
			<graceEmptyNew>
				<view slot="img" class="empty-view" v-show="!hasdata">
					<!-- 请根据您的项目要求制作并更换为空图片 -->
					<image class="empty-img" mode="widthFix" src="https://staticimgs.oss-cn-beijing.aliyuncs.com/empty.png"></image>
				</view>
				<text slot="text" class="grace-text-small grace-gray"  v-show="!hasdata">抱歉，暂时没有数据</text>
			</graceEmptyNew>
			<view class="order-list" v-show="hasdata">
				<!-- 订单信息start -->
				<view class="order" v-for="(item,index) in orderlist">
					<view class="order-top-info">
						<view class="order-user-info">
							<image class="user-img" :src="item.user.headimgurl"></image>
							<view class="user-text">
								<view class="nickname">{{item.user.nickname}}</view>
								<!-- <view class="phone">15077144027</view> -->
							</view>
						</view>
						<view class="order-pay-info">
							<view class="money">￥{{item.actualPrice}}</view>
							<view class="paystatus" v-if="item.payStatus==0 || item.payStatus==1" >未支付</view>
							<view class="paystatus" v-if="item.payStatus==2" >已支付</view>
						</view>
					</view>
					<view class="border-bottom-info">
						<view class="orderno">{{item.orderNo}}</view>
						<view class="ordertime">{{item.createTime}}</view>
						<view class="seek-order" @click="showorHide(item,index)">查看</view>
					</view>
					<!-- 订单详情列表 -->
					<view  :class="['order-detail-list', item.show==true ? 'grace-accordion-show' : 'grace-accordion-hide']" v-for="(item2,inex2) in item.detaillist">
						<image class="goods-img" :src="item2.spuImg"></image>
						<view class="goods-info">
							<view class="goods-name">{{item2.skuTitle}}</view>
							<view class="price-amount">
								<view class="price">￥{{item2.price}}</view>
								<view class="num">{{item2.num}}</view>
							</view>
						</view>
						<view class="total-amount">￥{{item2.totalAmout}}</view>
					</view>
					<!-- 订单详情列表end -->
					
				</view>
					<!-- 订单信息end -->
				
			</view>
		</view>
	</gracePage>
</template>
<script>
import gracePage from "../../graceUI/components/gracePage.vue";
import graceEmptyNew from "../../graceUI/components/graceEmptyNew.vue";
import graceSegmentedControl from '../../graceUI/components/graceSegmentedControl.vue';
import { mapState } from 'vuex';  
	export default {
		components:{gracePage,graceEmptyNew,graceSegmentedControl},
		data() {
			return {
				hasdata:true,
				orderlist:[],
				queryData:{
					page: 1,//商品列表 页码
					limit:10,
					totalPage: 0,//商品列表总页数
					payStatus:''
				},
				accordionActive: "grace-accordion-1",
				tabCurrentIndex : 0,
				tabs: ['全部','已支付','未支付'],
				show:false,
			}
			
		},
		onShow(){
			
			this.getOrderList(this.queryData);
		},
		onLoad(option){
			
		},
		computed: {
			...mapState(['hasLogin','userInfo'])
		},
		methods: {
			
			onChange(index){
				this.tabCurrentIndex = index;
				if(index==0){
					this.queryData.payStatus='';
				}else if(index==1){
					this.queryData.payStatus='2';
				}else if(index==2){
					this.queryData.payStatus='0';
				}
				this.orderlist=[];
				this.queryData.page=0;
				this.queryData.totalPage=0;
				this.getOrderList(this.queryData)
			},
			showorHide(item,index){
				if(item.show==true){
					this.orderlist[index].show=false;
				}else{
					this.orderlist[index].show=true;
				}
			},
			
			//获取店铺商品列表
			async getOrderList (querData,first) {
				console.log(JSON.stringify(querData));
			    let result = await this.$api.request('shopkeeper/shopOrder', 'todayOrderlist',querData);
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
			
		},
		
		onPullDownRefresh() {
			 this.queryData.page = 1;
			 this.queryData.totalPage = 0;
			 this.getOrderList(this.queryData,true);
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
	
/* 空白数据页面  */
.empty-view{width:280rpx; height:280rpx; border-radius:280rpx; background-color:#F6F7F8; margin-top:300rpx;}
.empty-img{width:220rpx; height:200rpx; margin:40rpx; border-radius:200rpx;}
.grace-text-small{margin-top:10px;}

/* 订单列表样式 */
.order-list{
	display: flex;
	flex-direction: column;
	background-color: #EDEDED;
	width: 100%;
	margin-top: 0.2rem;
	color: lightblue;
}
.order{
	display: flex;
	flex-direction: column;
	width: 100%;
	background-color: white;
	/* margin-bottom: 0.2rem; */
}
.order-top-info{
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding: 0.1rem;
	align-items: center;
}
.order-user-info{
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
}
.user-img{
	width: 3rem;
	height: 3rem;
	border-radius: 50%;
}
.user-text{
	padding: 1rem;
}
.order-pay-info{
	
}
.order-pay-info .money{
	color: blue;
}
.ordertime{
	color: black;
}
.border-bottom-info{
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: 0.5rem;
	font-size: 0.7rem;
	overflow: hidden;
	border-bottom: 1px solid lightgray;
}
.seek-order{
	color: red;
	font-size: 0.8rem;
	
}

.order-detail-list{
	display: flex;
	justify-content: space-around;
	align-items: center;
	padding: 1rem 0.5rem;
	/* border-top: 1px solid #F5F5F5; */
	border-bottom: 1px solid lightgray;
	margin: 0.1rem 0.3rem;
	background-color: white;
	color: black;
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
				/* padding-left: 1rem;
				text-align: left; */
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
				
			}
			.total-amount{
				font-size: 0.8rem;
				color: 	red;
				padding: 0.1rem 0.3rem;
				
			}
		}
		.add{
			margin: 0.1rem 1rem;
		}
}

@import "../../graceUI/animate.css";
.grace-accordion-show{height:auto; animation:fadeIn 300ms linear;visibility:visible;padding: 1rem 0rem; }
.grace-accordion-hide{height:0; animation:fadeOut 300ms linear;visibility:hidden;padding:0;}
</style>

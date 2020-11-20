<template>
	<gracePage :customHeader="false">
		<view slot="gBody" class="grace-body"  >
			<view class="SegmentedControlIn">
				<graceSegmentedControl :items="tabs" :current="current" @change="onChange"></graceSegmentedControl>
			</view>
			<graceEmptyNew>
				<view slot="img" class="empty-view" v-show="!hasdata">
					<!-- 请根据您的项目要求制作并更换为空图片 -->
					<image class="empty-img" mode="widthFix" src="https://staticimgs.oss-cn-beijing.aliyuncs.com/empty.png"></image>
				</view>
				<text slot="text" class="grace-text-small grace-gray"  v-show="!hasdata">抱歉，暂时没有数据</text>
			</graceEmptyNew>
			<view class="order-list" v-show="hasdata">
				<view class="order">
					<view class="order-top-info">
						<view class="order-user-info">
							<image class="user-img" src="/static/yonghu.png"></image>
							<view class="user-text">
								<view class="nickname">阿木木</view>
								<view class="phone">15077144027</view>
							</view>
						</view>
						<view class="order-pay-info">
							<view class="money">￥200</view>
							<view class="paystatus">已支付</view>
						</view>
					</view>
					<view class="border-bottom-info">
						<view class="orderno">DD58ki933kka20903893</view>
						<view class="ordertime">2020-11-20 21:25:20</view>
						<view class="seek-order">查看</view>
					</view>
				</view>
				
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
				shopId:null,
				orderlist:[],
				queryData:{
					shopId:null,
					pageNum: 1,//商品列表 页码
					pageSize:5,
					totalPage: 0,//商品列表总页数
				},
				totalAmount:0,//总下单金额
				accordionActive: "grace-accordion-1",
				
				current : 0,
				tabs: ['全部','已支付','已完成','未支付'],
			}
			
		},
		onShow(){
			if(this.queryData.shopId==null || typeof(this.queryData.shopId) == "undefined"){
				try {
				    const value = uni.getStorageSync('shopMainId');
				    if (value) {
				        console.log("value======"+value);
						//this.queryData.shopId = value;
				    }
				} catch (e) {
				    // error
				}
			}
			this.init();
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
			init(){
				
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
	
/* 空白数据页面  */
.empty-view{width:280rpx; height:280rpx; border-radius:280rpx; background-color:#F6F7F8; margin-top:300rpx;}
.empty-img{width:220rpx; height:200rpx; margin:40rpx; border-radius:200rpx;}
.grace-text-small{margin-top:10px;}

/* 订单列表样式 */
.order-list{
	display: flex;
	background-color: #F0FFF0;
	width: 100%;
	margin-top: 0.2rem;
	color: #4876FF;
}
.order{
	display: flex;
	flex-direction: column;
	width: 100%;
	background-color: ligh;
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
.border-bottom-info{
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: 0.5rem;
}
.seek-order{
	color: rgba(45, 89, 218, 0.51);
}

</style>

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
		<!-- 页面主体 -->
		<view slot="gBody" class="grace-body" v-show="hasdata">
			<view  v-for="(item, index) in list" :key="index" :data-number="item.id" :data-btn="item.btn" style="margin:15px 0;" @tap="getIt(item.id,index)">
				<graceCoupons :coupon="item"></graceCoupons>
			</view>
		</view>
	</gracePage>
</template>

<script>
	import gracePage from "../../graceUI/components/gracePage.vue";
	import graceCoupons from "../../graceUI/components/graceCoupons.vue";
	import graceEmptyNew from "../../graceUI/components/graceEmptyNew.vue";
	export default {
		data() {
			return {
				hasdata:true,//页面是否有数据
				show:false,
				shopId:null,
				queryData:{
					shopId:null,
					pageNum: 1,//页码
					pageSize:15,
					totalPage: 0,//总页数
					
				},
				list  : [
						
					]
			}
		},
		onShow() {
			this.initShopId();
			this.getCouponlist(this.queryData,true);
		},
		onLoad(option){
			
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
			getIt : function(id,index){
					var receivedStatus = this.list[index].receivedStatus;
					if(receivedStatus!=0){
						return;
					}
					this.getCoupon(id);
					// 点击数据可用通过 data- 方式设置及获取
					// 点击代码请自行完善
			},
			//领取优惠券
			getCoupon(couponId){
				const that = this
				var data = {
					shopId:that.shopId,
					couponId:couponId
				};
				that.$api.requestGet('coupon', 'getCoupon',data, failres => {
						that.$api.msg(failres.msg)
					}).then(res => {
						if(res.code==0){
							uni.showToast({
							    title: '领取成功',
							    duration: 2000
							});
							
							this.queryData.pageNum = 1;
							this.queryData.totalPage = 0;
							this.getCouponlist(this.queryData,true);
							this.list = [];
							this.getCouponlist(this.queryData,true);
						}
					});
					
			},
			//获取店铺代金券列表
			async getCouponlist (querData,first) {
				if(this.queryData.shopId==null  || typeof(this.queryData.shopId) == "undefined" || this.queryData.shopId=='null' ){
					return;
				}
				console.log(JSON.stringify(querData));
			    let result = await this.$api.requestGet('coupon', 'shopcouponList',querData);
				console.log(JSON.stringify(result));
			    if(result.code != 0 || result.page.list==null || result.page.list.length==0){
					this.hasdata = false;//没有数据展示空页
					return;
				} 
			    this.queryData.totalPage = result.page.totalPage;
				let list = result.page.list;
				list.forEach(p=>{
					p.show = false;
				});
			   if(first) {//是否是刷新 或者第一次加载
			       this.list =  list;
			   } else {
			       this.list = this.list.concat(list);
			   }
			},
		},
		onPullDownRefresh() {
			 this.queryData.pageNum = 1;
			 this.queryData.totalPage = 0;
			 this.getCouponlist(this.queryData,true);
			   uni.stopPullDownRefresh();
		 },
		 onReachBottom(){//页面滚动到底部的事件
		 	if (this.queryData.pageNo > this.queryData.totalPage) {
		 		return false;
		 	}
		     this.queryData.pageNum = this.queryData.pageNum + 1;
		     if (this.queryData.pageNum > this.queryData.totalPage) {
		         return false;
		     }
		     this.getCouponlist(this.queryData,false);
		 },
		 components:{
			gracePage, graceCoupons,graceEmptyNew
		 }
	}
</script>

<style lang="scss">
	page{background:#F9F9F9;}
	.empty-view{width:280rpx; height:280rpx; border-radius:280rpx; background-color:#F6F7F8; margin-top:300rpx;}
	.empty-img{width:220rpx; height:200rpx; margin:40rpx; border-radius:200rpx;}
	.grace-text-small{margin-top:10px;}
</style>

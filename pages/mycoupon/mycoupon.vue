<template>
	<gracePage :customHeader="false">
		<!-- 页面主体 -->
	<!-- 	<view slot="gBody" class="grace-body" v-show="!hasdata">
			<graceEmptyNew>
				<view slot="img" class="empty-view">
					<image class="empty-img" mode="widthFix" src="https://staticimgs.oss-cn-beijing.aliyuncs.com/empty.png"></image>
				</view>
				<text slot="text" class="grace-text-small grace-gray">抱歉，暂时没有数据</text>
			</graceEmptyNew>
		</view> -->
		<!-- 页面主体 -->
		<view slot="gBody" class="grace-body">
			<!-- 外面套的这层view，是用来给tabs定位的 -->
			<!-- <view class="wyb-tabs">
			    <wyb-tabs :tabs="tabs" @change="onChange" 
				:tab-box-style="tabBoxStyle"
			/>
			</view> -->
			<view class="SegmentedControlIn">
				<graceSegmentedControl :items="tabs" :current="current" @change="onChange"></graceSegmentedControl>
			</view>
			<view  v-for="(item, index) in list" :key="index" :data-number="item.id" :data-btn="item.btn" style="margin:15px 0;" @tap="getIt(item.id,index)">
				<graceCoupons :coupon="item"></graceCoupons>
			</view>
			<graceEmptyNew v-show="!hasdata">
				<view slot="img" class="empty-view">
					<!-- 请根据您的项目要求制作并更换为空图片 -->
					<image class="empty-img" mode="widthFix" src="https://staticimgs.oss-cn-beijing.aliyuncs.com/empty.png"></image>
				</view>
				<text slot="text" class="grace-text-small grace-gray">抱歉，暂时没有数据</text>
			</graceEmptyNew>
		</view>
	</gracePage>
</template>

<script>
	import wybTabs from '@/components/wyb-tabs/wyb-tabs.vue'
	import gracePage from "../../graceUI/components/gracePage.vue";
	import graceCoupons from "../../graceUI/components/graceCoupons.vue";
	import graceEmptyNew from "../../graceUI/components/graceEmptyNew.vue";
	import graceSegmentedControl from '../../graceUI/components/graceSegmentedControl.vue';
	export default {
		 components: {
		        wybTabs,gracePage, graceCoupons,graceEmptyNew,graceSegmentedControl
		    },
		data() {
			return {
				hasdata:true,//页面是否有数据
				show:false,
				current : 0,
				swiperCurrent: 0,
				swiperLength: 0,
				// tabs: [{
				// 	  label: '未使用'
				//   }, {
				// 	  label: '已使用'
				//   }, {
				// 	  label: '已过期'
				//   }],
				  tabs: ['未使用','已使用','已过期'],
				tabBoxStyle: {
					width: '100%',
					boxShadow: '3px 3px 7px rgba(0, 0, 0, 0.3)',
					borderRadius: '5px',
					marginTop: '10rpx',
					padding: '5rpx 0'
				},
				
				list:[],
				shopId:null,
				queryData:{
					status:'unreceived',
					shopId:null,
					pageNum: 1,//页码
					pageSize:15,
					totalPage: 0,//总页数
					
				},
			}
		},
		onShow() {
			this.getCouponlist(this.queryData,true);
		},
		onLoad(option){
			console.log('option===='+JSON.stringify(option)); //打印出上个页面传递的参数。
			this.shopId = option.shopId;
			this.queryData.shopId = option.shopId;
		},
		methods: {
			//切换tab
			 onChange(e) {
				 this.current = e;
				let index = e; // 选项卡索引值
				const that = this;
				if(index===0){
					that.queryData.status='unreceived';
				}
				if(index===1){
					that.queryData.status='received';
				}
				if(index===2){
					that.queryData.status='overtimed';
				}
				that.list = [];
				that.queryData.pageNum=1;
				that.queryData.pageSize=15;
				that.queryData.totalPage=0;
				that.getCouponlist(this.queryData,true);
			},
			getIt : function(id,index){
					this.toIndex();
			},
			async getCouponlist (querData,first) {
					if(this.queryData.shopId==null  || typeof(this.queryData.shopId) == "undefined" || this.queryData.shopId=='null' ){
						return;
					}
					console.log(JSON.stringify(querData));
				    let result = await this.$api.requestGet('coupon', 'mycouponList',querData);
					console.log(JSON.stringify(result));
					if(result.code != 0 || result.page.list==null || result.page.list.length==0){
						this.hasdata = false;//没有数据展示空页
						return;
					} 
					this.hasdata = true;
				    // if(result.code != 0 || result.page.list==null || result.page.list.length==0) return;
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
			toIndex(){
				var that = this;
				var url = '/pages/index/index?shopId='+that.shopId;
				uni.navigateTo({
					url
				})
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
		 }
	}
</script>

<style lang="scss">
	page{background:#F9F9F9;}
	.SegmentedControlIn{width:500rpx; padding:0 125rpx; margin-top:38rpx;}
	
	.empty-view{width:280rpx; height:280rpx; border-radius:280rpx; background-color:#F6F7F8; margin-top:300rpx;}
	.empty-img{width:220rpx; height:200rpx; margin:40rpx; border-radius:200rpx;}
	.grace-text-small{margin-top:10px;}
</style>

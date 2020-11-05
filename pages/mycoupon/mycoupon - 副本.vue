<template>
	<view>
		<!-- 外面套的这层view，是用来给tabs定位的 -->
			<view class="wyb-tabs">
			    <wyb-tabs :tabs="tabs" @change="onChange" 
				:tab-box-style="tabBoxStyle"
			/>
			</view>
		
		<view class="item-list" v-for="(item,index) in list" :key="index">
			<view class="coupon-info">
				<view class="coupon-info-left">
					<view class="coupon-amout">￥{{item.discount}}</view>
					<view class="coupon-de">满{{item.min}}减{{item.discount}}</view>
				</view>
				<view class="coupon-info-right">
					<view class="coupon-info-right-child1">
						<view class="child1-reft">
							<view class="name">{{item.title}}</view>
							<view class="time">{{item.startTimeStr}}-{{item.endTimeStr}}</view>
						</view>
						<view class="receve_btn" v-if="item.status===0" @click="toIndex"><text class="btn" >去使用</text></view>
						<view class="receve_btn" v-if="item.status===1"><text class="btn" >已使用</text></view>
						<view class="receve_btn" v-if="item.status===2"><text class="btn" >已过期</text></view>
					</view>
					<view  class="coupon-info-right-child2">
						<view class="show-detail" @click="showdetail(item,index)">查看详情</view>
						<view class="hide-detail" @click="hidetail(item,index)">收起</view>
					</view>
				</view>
			</view>
			<view class="coupon-detail" v-show="item.show">
				  <rich-text :nodes="item.description"></rich-text>
			</view>
		</view>
		
	</view>
</template>

<script>
	import wybTabs from '@/components/wyb-tabs/wyb-tabs.vue'
	export default {
		 components: {
		        wybTabs
		    },
		data() {
			return {
				show:false,
				swiperCurrent: 0,
				swiperLength: 0,
				tabs: [{
					  label: '未使用'
				  }, {
					  label: '已使用'
				  }, {
					  label: '已过期'
				  }],
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
				let label = e.label // 选项卡名
				let index = e.index // 选项卡索引值
				console.log("index===="+index)
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
			showdetail(item,index){
				item.show = true;
				this.list[index] = item;
			},
			hidetail(item,index){
				item.show = false;
				this.list[index] = item;
			},
			async getCouponlist (querData,first) {
					console.log(JSON.stringify(querData));
				    let result = await this.$api.requestGet('coupon', 'mycouponList',querData);
					console.log(JSON.stringify(result));
				    if(result.code != 0 || result.page.list==null || result.page.list.length==0) return;
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
	.item-list{
		.coupon-info{
			display: flex;
			flex-direction: row;
			border: 1px solid lightgrey;
			.coupon-info-left{
				flex: 1;
				background-color: #FF8C00;
				color: white;
				padding: 0.5rem;
				.coupon-amout{
					font-size: 1.5rem;
					text-align: center;
				}
				.coupon-de{
					font-size: 0.8rem;
					text-align: center;
				}
			}
			.coupon-info-right{
				flex: 5;
				display: flex;
				flex-direction: column;
				padding: 0.8rem;
				.coupon-info-right-child1{
					display: flex;
					flex-direction: row;
					.child1-reft{
						flex: 3;
						display: flex;
						flex-direction: column;
						justify-content: space-around;
						// text-align: center;
						// padding: 0.3rem 0.3rm 0.3rem 1rem;
						.name{
							padding-left: 1rem;
							font-weight: bold;
						}
						.time{
							padding-left: 1rem;
							font-size: 0.7rem;
						}
					}
					.receve_btn{
						flex: 1;
						// display: flex;
						// justify-content: space-around;
						// text-align: center;
						// border: 1px solid lightgrey;
						padding-right: 0.8rem;
						
						.btn{
							      -webkit-box-flex: 1;
							      -webkit-flex: 1;
							      flex: 1;
							      display: -webkit-box;
							      display: -webkit-flex;
							      display: flex;
							      -webkit-justify-content: space-around;
							      justify-content: space-around;
							      text-align: center;
							      border: 1px solid lightgrey;
							      -webkit-box-align: center;
							      -webkit-align-items: center;
							      align-items: center;
							      border-radius: 5px;
							      padding: 0.2rem 0.2rem 0.3rem 0.2rem;
							      color: orange;
							      font-size: 0.8rem;
						}
					}
				}
				.coupon-info-right-child2{
					display: flex;
					flex-direction: row;
					justify-content: space-around;
					margin: 0.5rem 0 0 0;
					border-top: 1px solid lightgrey;
					padding-top: 0.5rem;
					font-size: 0.8rem;
					.show-detail{
					}
					.hide-detail{
						
					}
				}
			}
		}
		
		.coupon-detail{
			background:#F5F5F5;
			padding: 1rem
		}
	}

</style>

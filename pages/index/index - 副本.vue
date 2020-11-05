<template>
	<view class="container">
		<!-- 头部 -->
		<view class="hearder">
			<view class="hearder-inner">
				<view class="hearder-left"> 
					<image class="img" src="../../static/location.png"></image>
					<view class="address-box"><text class="address">{{address}}</text></view>
					<image class="arr" src="../../static/lower-triangle .png"></image>
				</view>
				<view class="hearder-right" @click="navTo('/pages/user/user')">
					<image class="hearder-right-img" src="../../static/yonghu.png"></image>
				</view>
			</view>
		</view>
		
		<view class="searchbox">
			<view class="searchboxinner">
				<input  class="searchboxinput" placeholder="请输入关键字搜索" @click="navTo('/pages/goods-search/goods-search')"/>
			</view>
		</view>
		
		<!-- 头部轮播 -->
		<view class="carousel-section">
			<swiper autoplay="true" interval="3000" duration="500" class="carousel" circular @change="swiperChange">
				<swiper-item v-for="(item, index) in adlist" :key="index" class="carousel-item" @click="naviageToPage(item.url)">
					<image :src="item.adImgurl" />
				</swiper-item>
			</swiper>
			<!-- 自定义swiper指示器 -->
			<view class="swiper-dots">
				<text class="num">{{swiperCurrent+1}}</text>
				<text class="sign">/</text>
				<text class="num">{{swiperLength}}</text>
			</view>
		</view>
		
		<!-- 菜馆分类 -->
	<!-- 	<view class="quanquan">
			<view class="quan-item"><text class="name name1">明日菜谱</text></view>
			<view  class="quan-item"><text class="name name2">揭阳馆</text></view>
			<view  class="quan-item"><text class="name name3">梅州馆</text></view>
		</view> -->
		<view class="cate-section">
			<view v-for="(item, index) in shopList" :key="index" @click="changeShop(item.id,item,index)" class="cate-item">
				<image :src="item.shopImg"></image>
				<text v-if="item.active" class="shopName">{{item.shopName}}</text>
				<text v-if="!item.active">{{item.shopName}}</text>
			</view>
		</view>
		
		<!-- 外面套的这层view，是用来给tabs定位的 -->
	<!-- 	<view class="wyb-tabs">
		    <wyb-tabs :tabs="tabs" @change="onChange" 
			:tab-box-style="tabBoxStyle"
		/>
		</view> -->
		<view class="mytab">
			<view class="join-member">加入会员</view>
			<view class="join-coupon" @click="navTo('/pages/coupon/coupon')">领券中心</view>
		</view>
		
		<view class="goods-list">
			<view class="goods-item" v-for="(item,index) in goodsList" :key="index">
				<view class="goods-item-left">
					<image class="goods-img" :src="item.img"></image>
					<view class="goods-info">
						<view class="goods-name"><text class="text">{{item.title}}</text></view>
						<view class="goods-groupprice"><text class="text">团购价:￥{{item.price}}元</text></view>
						<view class="goods-origineprice"><text class="text">原价:￥{{item.originalPrice}}元</text></view>
					</view>
				</view>
				<view class="goods-item-right" @click="addCart(item)">
					<image class="add" src="../../static/add-fill.png"></image>
				<!-- 	<view class="num"><text>{{cartNum}}</text></view> -->
				</view>
			</view>
		</view>
		
		<view class="footer">
			<view class="left">
				<image class="cart" src="../../static/cart.png"></image>
				<view class="num"><text>{{cartNum}}</text></view>
			</view>
		<!-- 	<view  class="right" @click="gotocart"><text class="gopay">去结算</text></view> -->
			<view v-if="cartNum!=0 && cartNum!='0'" class="right" @click="gotocart"><text class="gopay">去结算</text></view>
		</view>
	</view>
</template>
	
<script>
	import {
	    mapState 
	} from 'vuex'; 
	import wybTabs from '@/components/wyb-tabs/wyb-tabs.vue'
	export default {
		 components: {
		        wybTabs
		    },
		data() {
			return {
				address:'星光之约一期',
				title:'hahh',
				swiperCurrent: 0,
				swiperLength: 0,
				shopId:null,
				shopList:[
					
				],
				adlist:[
					{
						adImgurl:'../../static/user-bg.jpg'
					},
					{
						adImgurl:'../../static/vip-card-bg.png'
					}
				],
				//
				 tabs: [{
					  label: '加入会员'
				  }, {
					  label: '领券中心'
				  }],
				tabBoxStyle: {
					width: '100%',
					boxShadow: '3px 3px 7px rgba(0, 0, 0, 0.3)',
					borderRadius: '5px',
					marginTop: '10rpx',
					padding: '5rpx 0'
				},
				goodsList:[
					
				],
				queryData:{
					shopId:null,
					pageNum: 1,//商品列表 页码
					pageSize:15,
					totalPage: 0,//商品列表总页数
					keyword:'',//商品名称关键字搜索
				},
				cartNum:2,//购物车商品数量
				shopMainId:null,//分享的店铺id
				shopMainName:'',//分享标题
				shopImg:'',//分享图片
				
				
			}
		},
		onShow() {
			this.loadShopData(this.queryData);
			this.getAddress();
		},
		onLoad(option) {
			console.log("index_option===="+JSON.stringify(option));
			if(option!=null && option.shopId!=undefined){
				console.log("option.shopId!=undefined===="+JSON.stringify(option.shopId!=undefined));
				this.shopId = option.shopId;
				this.shopMainId = option.shopId;
				this.queryData.shopId = option.shopId;
				uni.setStorageSync('shopMainId', option.shopId)
			}
		},
		//分享
		onShareAppMessage() {
			return {
				title: this.shopMainName,
				imageUrl: this.shopImg,
				path: '/pages/index/index?shopId=' + this.shopMainId
			}
		},
		computed: {
			...mapState(['hasLogin','userInfo'])
		},
		methods: {
			//获取当前位置信息
			getAddress(){
				var that = this;
				uni.getLocation({
				    type: 'wgs84',
				    success: function (res) {
				        console.log('当前位置的经度：' + res.longitude);
				        console.log('当前位置的纬度：' + res.latitude);
						that.$api.requestGet('user', 'getNowAddress',{'longitude':res.longitude,'latitude':res.latitude},failres => {
							that.$api.msg(failres.msg)
						}).then(result => {
							if(result.code==0){
								that.address = result.address;
							}
						});
				    }
				});
			},
			//根据关键字搜索商品
			searchGoods(event){
				var keyword = event.detail.value;
				if(keyword==null || keyword==''){
					return;
				}
				this.queryData = {
					shopId:this.shopId,
					pageNum: 1,//商品列表 页码
					pageSize:15,
					totalPage: 0,//商品列表总页数
					keyword:keyword
				},
				this.goodsList = [];
				this.getGoodlist(this.queryData,true);
			},
			//切换滚动图
			swiperChange(e) {
				const index = e.detail.current;
				this.swiperCurrent = index;
				// this.titleNViewBackground = this.carouselList[index].color;
			},
			//点击店铺
			changeShop(shopId,item,index) {
				this.shopId = shopId;
				console.log("shopId===="+shopId);
				this.queryData = {
					shopId:shopId,
					pageNum: 1,//商品列表 页码
					pageSize:15,
					totalPage: 0,//商品列表总页数
				},
				this.shopList.forEach(p=>{
					if(p.id==shopId){
						p.active = true;
					}else{
						p.active = false;
					}
				})
				uni.setStorageSync('shopMainId',shopId)
				this.shopImg = item.shopImg;
				this.shopMainId = shopId;
				this.shopMainName = item.shopName;
				this.cartNum=0;//购物车商品数量
				this.goodsList = [];
				this.getGoodlist(this.queryData,true);
				this.getCartNum();
			},
			//切换tab
			 onChange(e) {
				let label = e.label // 选项卡名
				let index = e.index // 选项卡索引值
				if(index==1){
					this.navTo('/pages/coupon/coupon');
				}
			},
			//加载店铺广告、店铺及分店
			loadShopData(data) {
				if(data.shopId==null || data.shopId==undefined || data.shopId=='null' || data.shopId==''){
					try {
					    const value = uni.getStorageSync('shopMainId');
					    if (value) {
					        console.log("value======"+value);
							data.shopId = value;
					    }
					} catch (e) {
					    // error
					}
				}
				data.shopIds = data.shopId;
				const that = this
				uni.showLoading({
					title: '正在加载'
				})
				that.$api.requestGet('shop', 'shoplist',data, failres => {
					that.$api.msg(failres.msg)
					uni.hideLoading()
				}).then(res => {
					if(res.code==0){
						that.shopList = res.shoplist;
						console.log('shopLis======'+JSON.stringify(res.shoplist));
						if(res.adlist!=null){
							that.adlist = res.adlist;
						}
						that.shopId = res.shopId;
						that.shopMainId = res.shopMainId;//分享的店铺id
						that.shopMainName = res.shopMainName;//分享标题
						that.shopImg = res.shopImg;//分享图片
						that.queryData.shopId = res.shopId;
						
						that.getCartNum();
						//加载商品
						that.getGoodlist(that.queryData,true);
						uni.hideLoading();
					}
				});
				
			},
			//加载购物车数量
			getCartNum(){
				var that = this;
				if (this.hasLogin) {
					that.$api.requestGet('cart', 'countCart',{'shopId':that.shopId},failres => {
						that.$api.msg(failres.msg)
					}).then(res => {
						if(res.code==0){
							that.cartNum = res.totalNum;
						}
					});
				}
			},
			//获取店铺商品列表
			async getGoodlist (querData,first) {
				console.log(JSON.stringify(querData));
			    let result = await this.$api.requestGet('shop', 'goodsList',querData);
				console.log(JSON.stringify(result));
			    if(result.code != 0 || result.page.list==null || result.page.list.length==0) return;
			    this.queryData.totalPage = result.page.totalPage;
			   if(first) {//是否是刷新 或者第一次加载
			       this.goodsList =  result.page.list ;
			   } else {
			       this.goodsList = this.goodsList.concat(result.page.list);
			   }
			},
			//加入购物车
			addCart(item){
				const that = this
				let param ={
					'shopId':that.shopId,
					'skuId':item.skuId,
					'groupId':item.id
				};
				that.$api.requestGet('cart', 'addCart',param,failres => {
					that.$api.msg(failres.msg)
				}).then(res => {
					if(res.code==0){
						that.cartNum = that.cartNum +1;
					}
				});
			},
			
			
			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			navTo(url){
				var that = this;
				url = url+'?shopId='+that.shopId;
				uni.navigateTo({  
					url
				})
			},
			gotocart(){
				const that = this;
				uni.navigateTo({
					 url: '/pages/cart/cart?shopId='+that.shopId
				})
			},
			
		},
		onPullDownRefresh() {
			 this.queryData.pageNum = 1;
			 this.queryData.totalPage = 0;
			 this.getGoodlist(this.queryData,true);
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
		     this.getGoodlist(this.queryData,false);
		 }
		
		
	}
</script>

<style lang="scss">
	.container{
		border: 0.1px solid lightgrey;
	}
	.hearder{
		display: flex;
		padding: 0.5rem 1rem;
		font-size: 1rem;
	}
	.hearder-inner{
		display: flex;
	}
	.hearder-left{
		display: flex;
		justify-content: space-around;
	}
	.hearder-left .img{
		height:1.5rem ;
		width: 1.5rem;
	}
	.hearder-left .address-box{
		text-align: center;
		line-height: 1.5rem;
	}
	.hearder-left .address{
		text-align: center;
	}
	.hearder-left .arr {
		height: 1.5rem;
		width: 1.5rem;
		margin-top: 0.1rem;
	  }
	.hearder-right{
		position: absolute;
		right: 1rem;
	}
	.hearder-right-img{
		height:1.5rem ;
		width: 1.5rem;
	}

.searchbox{
	
}

.searchboxinner{
	border: 1px solid lightgrey;
	margin: 0.5rem 1rem;
	border-radius: 2px;
	background-color: 	#F5F5F5;
	padding: 0.2rem 0.3rem;
}
.searchboxinner .searchboxinput{
	/* background-color: white; */
	background:url(../../static/sousuo.png) white;
	background-size:1.5rem;
	background-repeat:no-repeat;
	padding-left: 1.5rem;
	font-size: 0.8rem;
	height: 1.5rem;
	line-height: 1.5rem;
}

	/* #ifdef MP */
/* 	page{
		.carousel-section{
			padding: 0;
			.titleNview-placing {
				padding-top: 0;
				height: 0;
			}
			.carousel{
				.carousel-item{
					padding: 0;
				}
			}
			.swiper-dots{
				left:45upx;
				bottom:40upx;
			}
		}
	} */
	/* #endif */
	

	/* 头部 轮播图 */
	.carousel-section {
		position: relative;
		padding-top: 10px;

		.titleNview-placing {
			height: var(--status-bar-height);
			padding-top: 44px;
			box-sizing: content-box;
		}

		.titleNview-background {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 426upx;
			transition: .4s;
		}
	}
	.carousel {
		width: 100%;
		height: 320upx;

		.carousel-item {
			width: 100%;
			height: 100%;
			padding: 0 28upx;
			overflow: hidden;
		}

		image {
			width: 100%;
			height: 100%;
			border-radius: 10upx;
		}
	}
	.swiper-dots {
		display: flex;
		position: absolute;
		left: 60upx;
		bottom: 15upx;
		width: 72upx;
		height: 36upx;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk4MzlBNjE0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTk4MzlBNjA0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0E3RUNERkE0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0E3RUNERkI0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Gh5BPAAACTUlEQVR42uzcQW7jQAwFUdN306l1uWwNww5kqdsmm6/2MwtVCp8CosQtP9vg/2+/gY+DRAMBgqnjIp2PaCxCLLldpPARRIiFj1yBbMV+cHZh9PURRLQNhY8kgWyL/WDtwujjI8hoE8rKLqb5CDJaRMJHokC6yKgSCR9JAukmokIknCQJpLOIrJFwMsBJELFcKHwM9BFkLBMKFxNcBCHlQ+FhoocgpVwwnv0Xn30QBJGMC0QcaBVJiAMiec/dcwKuL4j1QMsVCXFAJE4s4NQA3K/8Y6DzO4g40P7UcmIBJxbEesCKWBDg8wWxHrAiFgT4fEGsB/CwIhYE+AeBAAdPLOcV8HRmWRDAiQVcO7GcV8CLM8uCAE4sQCDAlHcQ7x+ABQEEAggEEAggEEAggEAAgQACASAQQCCAQACBAAIBBAIIBBAIIBBAIABe4e9iAe/xd7EAJxYgEGDeO4j3EODp/cOCAE4sYMyJ5cwCHs4rCwI4sYBxJ5YzC84rCwKcXxArAuthQYDzC2JF0H49LAhwYUGsCFqvx5EF2T07dMaJBetx4cRyaqFtHJ8EIhK0i8OJBQxcECuCVutxJhCRoE0cZwMRyRcFefa/ffZBVPogePihhyCnbBhcfMFFEFM+DD4m+ghSlgmDkwlOgpAl4+BkkJMgZdk4+EgaSCcpVX7bmY9kgXQQU+1TgE0c+QJZUUz1b2T4SBbIKmJW+3iMj2SBVBWz+leVfCQLpIqYbp8b85EskIxyfIOfK5Sf+wiCRJEsllQ+oqEkQfBxmD8BBgA5hVjXyrBNUQAAAABJRU5ErkJggg==);
		background-size: 100% 100%;

		.num {
			width: 36upx;
			height: 36upx;
			border-radius: 50px;
			font-size: 24upx;
			color: #fff;
			text-align: center;
			line-height: 36upx;
		}

		.sign {
			position: absolute;
			top: 0;
			left: 50%;
			line-height: 36upx;
			font-size: 12upx;
			color: #fff;
			transform: translateX(-50%);
		}
	}
	/* 分类 */
	.cate-section {
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-wrap:wrap;
		padding: 30upx 22upx; 
		background: #fff;
		.cate-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
		}
		.shopName{
			text-decoration:underline;
		}
		/* 原图标颜色太深,不想改图了,所以加了透明度 */
		image {
			width: 88upx;
			height: 88upx;
			margin-bottom: 14upx;
			border-radius: 50%;
			opacity: .7;
			box-shadow: 4upx 4upx 20upx rgba(250, 67, 106, 0.3);
		}
	}
	/* 菜谱分类 */
	.quanquan{
		display: flex;
		justify-content: space-around;
		padding: 1rem 1rem;
		// border-bottom: 1px solid lightgrey;
		border-top: 1px solid lightgrey;
		border-radius: 23px;
		margin-top: 1rem;
		.quan-item{
			// flex: 1;
			display: block;
			height: 4.5rem;
			width: 4.5rem;
			/* border: solid 1px #A9A9A9; */
			border-radius: 50%;
			align-items: center;
			
			.name{
				line-height: 4.5rem;
				display: flex;
				justify-content: space-around;
			}
			.name1{
				border-radius: 50%;
				background: -moz-linear-gradient(top, 	#EE82EE 0%, 	#FFC0CB 100%);
				background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,	#EE82EE), color-stop(100%,	#FFC0CB));
				background: -webkit-linear-gradient(top, 	#EE82EE 0%,#FFC0CB 100%);
				background: -o-linear-gradient(top, 	#EE82EE 0%,	#FFC0CB 100%);
				background: -ms-linear-gradient(top, 	#EE82EE 0%,#FFC0CB 100%);
				background: linear-gradient(to bottom, 	#EE82EE 0%,#FFC0CB 100%);
			}
			.name2{
				border-radius: 50%;
				background: -moz-linear-gradient(top, #87CEFA 0	#6495ED 100%);
				background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#87CEFA), color-stop(100%,	#6495ED));
				background: -webkit-linear-gradient(top, #87CEFA 0%,	#6495ED 100%);
				background: -o-linear-gradient(top, #87CEFA 0%,		#6495ED 100%);
				background: -ms-linear-gradient(top,#87CEFA 0%,	#6495ED 100%);
				background: linear-gradient(to bottom, #87CEFA 0%,	#6495ED 100%);
			}
			.name3{
				border-radius: 50%;
				background: -moz-linear-gradient(top, 	#FFFF00 0%, 	#FFDEAD 100%);
				background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,	#FFFF00), color-stop(100%,	#FFDEAD));
				background: -webkit-linear-gradient(top, 	#FFFF00 0%,	#FFDEAD 100%);
				background: -o-linear-gradient(top, 	#FFFF00 0%,		#FFDEAD 100%);
				background: -ms-linear-gradient(top, 	#FFFF00 0%,	#FFDEAD 100%);
				background: linear-gradient(to bottom, 	#FFFF00 0%,	#FFDEAD 100%);
			}
		}
	}
	
		/* 加入会员 领券中心 */
		.mytab{
			display: flex;
			justify-content: space-around;
			padding: 0.6rem;
			background-color: 	#AFEEEE;
		}
		
		
		/* 商品列表 */
		.goods-list{
			margin-bottom: 5rem;
		}
		.goods-item{
			display: flex;
			justify-content: space-around;
			// border-bottom: 1px solid lightgrey;
			padding: 2rem 0.2rem;
			.goods-item-left{
				display: flex;
				flex: 2;
				justify-content: space-around;
				.goods-img{
					height: 4.0rem;
					width: 4.0rem;
					margin: 0rem 2rem;


				}
				.goods-info{
					display: flex;
					flex:1;
					flex-direction:column ;
					justify-content: space-around;
					.goods-name{
						.text{
							font-size: 1rem;
							font-weight:bold;
						}
					}
					.goods-groupprice{
						font-size: 0.8rem;
						color: red;

					}	
					.goods-origineprice{
						font-size: 0.7rem;
						text-decoration:line-through;

					}					
				}
			}
			.goods-item-right{
				position: relative;
				line-height: 3.5rem;
				display: flex;
				justify-content: space-around;
				flex: 1;
				// justify-content: center;
				align-items: center;
				.add{
					width:1.5rem;
					height: 1.5rem;
				}
				.num{
					position: absolute;
					right: -6px;
					top: 7px;
					text{
						    background-color: #1E90FF;
						    color: white;
						    width: 1rem;
						    height: 1rem;
						    display: block;
						    light-height: 1.5rem;
						    line-height: 1rem;
						    text-align: center;
					}
				}
			}
		}
		
		/* 购物车 */
		.footer{
			width: 100%;
			background-color: #F5F5F5;
			border-top: 1px solid lightgrey;
			display: flex;
			position: fixed;
			padding: 0.3rem 1rem;
			bottom: 0.01rem;
			// #ifdef H5
			// bottom: 2.5rem;
			// #endif
			z-index: 99999;
			.left{
				flex: 2;
				position: relative;
				.cart{
					width: 2rem;
					height: 2.2rem;
				}
				.num{
					position: absolute;
					background-color: #1E90FF;
					color: white;
					width: 1rem;
					height: 1rem;
					display: block;
					light-height: 1.5rem;
					line-height: 1rem;
					text-align: center;
					top: 0;
					left: 1.5rem;
					
				}
			}
			.right{
				right: 1rem;
				background-color: #7FFFAA;
				border-radius: 20px 20px 20px 20px;
				width: 5rem;
				text-align: center;
				font-size: 0.9rem;
				display: flex;
				justify-content: space-around;
				align-items: center;
				.gopay{
					text-align: center;
				}
			}
		}
</style>

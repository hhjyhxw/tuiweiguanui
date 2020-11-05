<template>
	<gracePage borderColor="#E1FFFF" :customHeader="true">
		<view slot="gHeader"  :headerIndex="199" >
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
		</view>
		<view slot="gBody" class="grace-body" style="padding-top: 1rem;">
			<!-- 搜索组件宽度自适应于外层 -->
			<view style="padding:30rpx; background-color:#F6F7F8;">
				<graceSearch :disabled="true" @tapme="navTo('/pages/goods-search/goods-search')" placeholder="请输入关键字搜索"></graceSearch>
			</view>
			<!-- 广告 -->
			<view style="padding-bottom:50rpx;" v-show="adlist!=null && adlist.length>0">
				<graceSwiper :swiperItems="adlist" :width="700" :height="315" @taped="taped"></graceSwiper>
			</view>
			<!-- 店铺 -->
			
			<scroll-view class="grace-scroll-x grace-scroll-cards" scroll-x :show-scrollbar="false">
				<view class="grace-scroll-x-items grace-columns grace-flex-vcenter grace-scroll-x-items-shop" v-for="(item, index) in shopList" :key="index"  @click="changeShop(item.id,item,index)" >
					<image class="grace-scroll-cards-image" :src="item.shopImg" mode="widthFix"></image>
					<view v-if="item.active" class="grace-scroll-cards-txt shopName">{{item.shopName}}</view>
					<view v-if="!item.active" class="grace-scroll-cards-txt">{{item.shopName}}</view>
				</view>
			</scroll-view>
			
			<!-- tab -->
			<view class="SegmentedControlIn">
				<graceSegmentedControl :items="cates" :current="current" @change="change"></graceSegmentedControl>
			</view>
			<!-- 商品列表 -->
			<view class="product-list">
				<view class="product-item" v-for="(item,index) in goodsList" :key="index">
					<view class="product-img">
						<image class="img" :src="item.img"></image>
					</view>
					<view class="product-info">
						<view class="product-name"><text class="text">{{item.title}}</text></view>
						<view class="product-groupprice"><text class="text">团购价:￥{{item.price}}元</text></view>
						<view class="product-origineprice"><text class="text">原价:￥{{item.originalPrice}}元</text></view>
					</view>
					<view class="product-item-right" @click="addCart(item)">
						<image class="add" src="../../static/add-fill.png"></image>
					</view>
				</view>
			</view>
			
			
		</view>
		<!-- 底部导航 -->
		<view class="grace-footer grace-grids grace-nowrap footer" slot="gFooter">
			<view class="left">
					<image class="cart" src="../../static/cart.png"></image>
					<view class="num"><text>{{cartNum}}</text></view>
				</view>
				<view v-if="cartNum!=0 && cartNum!='0'" class="right" @click="gotocart"><text class="gopay">去结算</text></view>
			</view>
		</view>
	</gracePage>
</template>
<script>
import graceHeader from '../../graceUI/components/graceHeadermy.vue';
import graceSearch from '../../graceUI/components/graceSearch.vue';
import gracePage from "../../graceUI/components/gracePagemy.vue";
import graceSwiper from "../../graceUI/components/graceSwiper.vue";
import graceSegmentedControl from '../../graceUI/components/graceSegmentedControl.vue';
import {mapState} from 'vuex'; 
export default{
	data() {
		return {
			
			adlist : [
				{
					img : 'https://graceui.oss-cn-beijing.aliyuncs.com/swiperimgs/3.png',
					url : '',
					title:"测试",
					opentype : 'click'
				},
				{
					img : 'https://graceui.oss-cn-beijing.aliyuncs.com/swiperimgs/4.png',
					url : '',
					title:"测试标题04",
					opentype : 'click'
				},
				{
					img : 'https://graceui.oss-cn-beijing.aliyuncs.com/swiperimgs/5.png',
					url : '',
					title:"测试标题05",
					opentype : 'click'
				},
			],
			cates : ["会员中心", "领券中心"],
			current : 0,
			
			address:'星光之约一期',
			title:'hahh',
			shopId:null,
			shopList:[
			],
			goodsList:[
			],
			queryData:{
				shopId:null,
				pageNum: 1,//商品列表 页码
				pageSize:15,
				totalPage: 0,//商品列表总页数
				keyword:'',//商品名称关键字搜索
			},
			cartNum:0,//购物车商品数量
			shopMainId:null,//分享的店铺id
			shopMainName:'',//分享标题
			shopImg:'',//分享图片
		}
	},
	onShow() {
		this.loadShopData(this.queryData);
		this.getAddress();
		this.getCartNum();
	},
	onLoad(option) {
		console.log("index_option===="+JSON.stringify(option));
		if(option!=null && option.shopId!=undefined && typeof(option.shopId) != "undefined"){
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
	methods:{
		
		
		taped : function(url){
			var that = this;
			url = url+'?shopId='+that.shopId;
			uni.navigateTo({  
				url
			})
		},
		//跳转搜索页面
		tapme:function(){
			uni.showToast({
				title:"被点了...."
			});
		},
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
				this.getCartNum();
				this.getGoodlist(this.queryData,true);
				
			},
			//切换tab
			change : function(e){
				console.log("change==="+JSON.stringify(e))
				this.current = e;
				if(this.current==1){
					this.navTo('/pages/coupon/coupon');
				}
				if(this.current==0){
					this.navTo('/pages/user/user');
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
				if (that.hasLogin) {
					let shopId =  null;
					try {
						shopId = Number(that.shopId);
					}
					catch(err){
						return;
					}
					if(shopId==null)return;
					that.$api.requestGet('cart', 'countCart',{'shopId':shopId},failres => {
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
	 },
	components: {
		gracePage, graceSwiper,
		graceHeader,
		graceSearch,
		graceSegmentedControl
				
	}
}
</script>
<style lang="scss">

	.hearder{
		z-index : 100;
		display: flex;
		padding: 0.5rem 1rem;
		font-size: 1rem;
		// position: relative;
		// top: 0;
		// border: 0.1px solid lightgrey;
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

	
	
.grace-scroll-cards{background-color:#F6F7F8; padding:0;}
.grace-scroll-x-items{width:150rpx; margin:10rpx; padding:20rpx; height:300rpx; font-size:0;}
.grace-scroll-x-items-shop{height:200rpx;}
.grace-scroll-cards-image{width:150rpx; height:150rpx; border-radius:150rpx; flex-shrink:0;}
.grace-scroll-cards-txt{text-align:center; color:#333333; font-size:26rpx; margin-top:20rpx; line-height:36rpx;}
.grace-scroll-cards-smallTxt{text-align:center; font-size:22rpx; margin-top:8rpx; line-height:36rpx; color:#898989;}
.grace-scroll-cards-btn{text-align:center; font-size:22rpx; width:88rpx; border-radius:40rpx; line-height:40rpx; padding:0 15rpx; margin-top:8rpx;}
.shopName{
	text-decoration:underline;
}
.SegmentedControlIn{padding:0 85rpx; margin-top:38rpx;}	
	
	/* 商品列表 new */
.product-list{
	margin-top: 1rem;
	margin-bottom: 5rem;
	background-color: white;
	border-top: 1px solid #DCDCDC;
	.product-item{
		display: flex;
		justify-content: space-around;
		border-bottom: 1px solid #DCDCDC;
		background-color: white;
		flex-direction: row;
		// background-color: #F6F7F8;
		background-color: white;
		margin-top: 0.2rem;
		.product-img{
			flex: 1.5;
			.img{
				display: block;
				height: 8rem;
				width: 8rem;
				border: 10px solid white;
			}
		}
		.product-info{
			display: flex;
			flex:1.5;
			flex-direction:column ;
			justify-content: space-around;
			padding-left: 1rem;
			.product-name{
				.text{
					font-size: 0.9rem;
					font-weight:bold;
				}
			}
			.product-groupprice{
				font-size: 0.8rem;
				color: red;

			}	
			.product-origineprice{
				font-size: 0.7rem;
				text-decoration:line-through;

			}					
		}
		.product-item-right{
			position: relative;
			line-height: 3.5rem;
			display: flex;
			justify-content: space-around;
			flex: 1;
			// justify-content: center;
			align-items: center;
			.add{
				    position: absolute;
				    width: 1.5rem;
				    height: 1.5rem;
				    top: 7rem;
				    right: 0.8rem;
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
}


		/* 商品列表 */
		.goods-list{
			margin-top: 1rem;
			margin-bottom: 5rem;
			background-color: white;
		}
		.goods-item{
			display: flex;
			justify-content: space-around;
			// border-bottom: 1px solid lightgrey;
			background-color: #F6F7F8;
			padding: 1.5rem 0.2rem;
			margin-top: 0.2rem;
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
		/* width: 100%;
		background-color: #F6F7F8;
		border-top: 1px solid lightgrey;
		display: flex;
		position: fixed;
		padding: 0.3rem 1rem;
		bottom: 0.01rem;
		// #ifdef H5
		// bottom: 2.5rem;
		// #endif
		z-index: 99999; */
		padding: 0.5rem;
		.left{
			flex: 4;
			position: relative;
			padding-left: 1rem;
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
				left: 2.5rem;

				
			}
		}
		.right{
			flex: 2;
			right: 1rem;
			// background-color: #7FFFAA;
			border-radius: 20px 20px 20px 20px;
			width: 5rem;
			text-align: center;
			font-size: 0.9rem;
			display: flex;
			justify-content: space-around;
			align-items: center;
			.gopay{
				text-align: center;
				background-color: #7FFFAA;
				border-radius: 20px 20px 20px 20px;
				display: block;
				width: 200rpx;
				height: 80rpx;
				line-height: 80rpx;
				margin-right: 1rem;

				
			}
		}
	}
			
/* 调整宫格大小 */
/* .grace-grids-items{width:150rpx;}
.grace-grids-icon{height:60rpx; line-height:60rpx; font-size:50rpx; color:#6B7375;}
.grace-grids-text{line-height:30rpx; font-size:20rpx; margin-top:2px; color:#6B7375;}
.grace-footer-active{color:#3688FF !important;}

.grace-grids-items2{padding:6rpx 0; width:120rpx;}
.grace-grids-icon2{height:50rpx; line-height:50rpx; font-size:40rpx; color:#6B7375;}
.grace-grids-text2{line-height:28rpx; font-size:20rpx; margin-top:2px; color:#6B7375;} */			
</style>
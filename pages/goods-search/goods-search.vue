<template>
	<gracePage :customHeader="false">
			<!-- 页面主体 -->
			<view slot="gBody" class="grace-body">
				<!-- 搜索组件宽度自适应于外层 -->
				<view style="padding:30rpx; background-color:#F6F7F8;">
					<graceSearch @inputting="inputting" @confirm="confirm" :kwd="keyword" @clear="clear"  @blur="blur" ></graceSearch>
				</view>
				
				<view class="search-keyword" v-show="shSearchbox">
					<scroll-view class="keyword-list-box" v-show="isShowKeywordList">
						<block v-for="(row,index) in keywordList" :key="index">
							<view class="keyword-entry" hover-class="keyword-entry-tap" >
								<view class="keyword-text" @tap.stop="confirm(keywordList[index].keyword)">
									<rich-text :nodes="row.htmlStr"></rich-text>
								</view>
								<view class="keyword-img" @tap.stop="setKeyword(keywordList[index].keyword)">
									<image src="/static/HM-search/back.png"></image>
								</view>
							</view>
						</block>
						
					</scroll-view>
					<scroll-view class="keyword-box" v-show="!isShowKeywordList">
						<view class="keyword-block" v-if="oldKeywordList.length>0">
							<view class="keyword-list-header">
								<view>历史搜索</view>
								<view>
									<image @tap="oldDelete" src="/static/HM-search/delete.png"></image>
								</view>
							</view>
							<view class="keyword">
								<view v-for="(keyword,index) in oldKeywordList" @tap="confirm(keyword)" :key="index">{{keyword}}</view>
							</view>
						</view>
						<view class="keyword-block">
							<view class="keyword-list-header">
								<view>热门搜索</view>
								<view>
									<image @tap="hotToggle" :src="'/static/HM-search/attention'+forbid+'.png'"></image>
								</view>
							</view>
							<view class="keyword" v-if="forbid==''">
								<view v-for="(keyword,index) in hotKeywordList" @tap="confirm(keyword)" :key="index">{{keyword}}</view>
							</view>
							<view class="hide-hot-tis" v-else>
								<view>当前搜热门搜索已隐藏</view>
							</view>
						</view>
					</scroll-view>
				</view>
				
				<!-- <view class="goods-list" v-show="goodslistbox" v-if="goodsList!=null || goodsList.length>0">
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
						</view>
					</view>
				</view> -->
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
				<view v-show="goodslistbox" v-if="goodsList==null || goodsList.length==0" class="nonegoods">~暂无搜索结果哦，请换个关键词试试看吧~</view>
				
				<!-- <view class="footer" v-show="goodslistbox">
					<view class="left">
						<image class="cart" src="../../static/cart.png"></image>
						<view class="num"><text>{{cartNum}}</text></view>
					</view>
					<view v-if="cartNum!=0 && cartNum!='0'" class="right" @click="gotocart"><text class="gopay">去结算</text></view>
				</view>
				 -->
			</view>
			<!-- 底部导航 -->
			<view class="grace-footer grace-grids grace-nowrap footer" slot="gFooter"  v-show="goodslistbox">
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
	//引用mSearch组件，如不需要删除即可
	import mSearch from '@/components/mehaotian-search-revision/mehaotian-search-revision.vue';
	import gracePage from "../../graceUI/components/gracePage.vue";
	import graceFlex from "../../graceUI/components/graceFlex.vue";
	import graceSearch from "../../graceUI/components/graceSearch.vue";
	export default {
		data() {
			return {
				shopId:null,
				defaultKeyword: "",
				keyword: "",
				oldKeywordList: [],
				hotKeywordList: [],
				keywordList: [],
				forbid: '',
				isShowKeywordList: false,
				goodslistbox:false,
				shSearchbox:true,
				
				cartNum:0,//购物车商品数量
				goodsList:[{"id":32,"skuId":1,"spuId":1,"title":"农夫山泉\\饮用天然水1","img":"https://shequ-mall.oss-cn-shenzhen.aliyuncs.com//20200902/29052556fc5f48f29d0dbc80e4b1d16d.png","originalPrice":121,"price":1,"remainStock":1132,"shopId":1,"shopName":null,"commonFlag":null},{"id":34,"skuId":4,"spuId":4,"title":"红外电弧打火机","img":"https://shequ-mall.oss-cn-shenzhen.aliyuncs.com//20200902/67412f0d2aaf4dd4876fc4d60cdb6568.jpg","originalPrice":50,"price":30,"remainStock":91,"shopId":1,"shopName":null,"commonFlag":null},{"id":35,"skuId":5,"spuId":3,"title":"小米手机","img":"https://shequ-mall.oss-cn-shenzhen.aliyuncs.com//20201008/f370a60cc4704232aa708934f6368d5e.jpg","originalPrice":2500,"price":0.01,"remainStock":18,"shopId":1,"shopName":null,"commonFlag":null}],
				queryData:{
					shopId:null,
					pageNum: 1,//商品列表 页码
					pageSize:15,
					totalPage: 0,//商品列表总页数
					keyword:'',//商品名称关键字搜索
				},
			}
		},
		onShow() {
			this.getCartNum();
		},
		onLoad(option) {
			this.init();
			console.log("index_option===="+JSON.stringify(option));
			if(option!=null && option.shopId!=undefined){
				this.queryData.shopId = option.shopId;
				this.shopId = option.shopId;
			}
		},
		components: {
			//引用mSearch组件，如不需要删除即可
			mSearch,gracePage, graceFlex, graceSearch
		},
		methods: {
			init() {
				this.loadDefaultKeyword();//默认搜索
				this.loadOldKeyword();//历史搜索
				this.loadHotKeyword();//热门搜索

			},
			//清空关键字
			clear(){
				console.log("clear=========")
				uni.hideKeyboard()//隐藏keyboard
				this.goodslistbox = false;
				this.shSearchbox = true;
			},
			//搜索框获取焦点
			blur(){
				console.log("blur=========")
				uni.hideKeyboard()//隐藏keyboard
				this.goodslistbox = false;
				this.shSearchbox = true;
				this.isShowKeywordList = true;
			},
			//加载默认搜索关键字
			loadDefaultKeyword() {
				//定义默认搜索关键字，可以自己实现ajax请求数据再赋值,用户未输入时，以水印方式显示在输入框，直接不输入内容搜索会搜索默认关键字
				this.defaultKeyword = "请输入商品名称";
			},
			//加载历史搜索,自动读取本地Storage
			loadOldKeyword() {
				uni.getStorage({
					key: 'OldKeys',
					success: (res) => {
						var OldKeys = JSON.parse(res.data);
						this.oldKeywordList = OldKeys;
					}
				});
			},
			//加载热门搜索
			loadHotKeyword() {
				//定义热门搜索关键字，可以自己实现ajax请求数据再赋值
				this.hotKeywordList = ['鸡蛋', '酸奶', '牛奶', '苹果', '草莓', '猕猴桃'];
			}, 
			//监听输入
			inputting(event) {
				this.goodslistbox = false;
				this.shSearchbox = true;
				this.isShowKeywordList = true;
				//兼容引入组件时传入参数情况
				var keyword = event.detail?event.detail.value:event;
				if (!keyword) {
					this.keywordList = [];
					this.isShowKeywordList = false;
					return;
				}
				this.isShowKeywordList = true;
				
				
				//以下示例截取淘宝的关键字，请替换成你的接口
				// uni.request({
				// 	url: 'https://suggest.taobao.com/sug?code=utf-8&q=' + keyword, //仅为示例
				// 	success: (res) => {
				// 		this.keywordList = [];
				// 		this.keywordList = this.drawCorrelativeKeyword(res.data.result, keyword);
						
				// 	}
				// });
			},
			//高亮关键字
			drawCorrelativeKeyword(keywords, keyword) {
				var len = keywords.length,
					keywordArr = [];
				for (var i = 0; i < len; i++) {
					var row = keywords[i];
					//定义高亮#9f9f9f
					var html = row[0].replace(keyword, "<span style='color: #9f9f9f;'>" + keyword + "</span>");
					html = '<div>' + html + '</div>';
					var tmpObj = {
						keyword: row[0],
						htmlStr: html
					};
					keywordArr.push(tmpObj)
				}
				return keywordArr;
			},
			//顶置关键字
			setKeyword(index) {
				this.keyword = this.keywordList[index].keyword;
			},
			//清除历史搜索
			oldDelete() {
				uni.showModal({
					content: '确定清除历史搜索记录？',
					success: (res) => {
						if (res.confirm) {
							console.log('用户点击确定');
							this.oldKeywordList = [];
							uni.removeStorage({
								key: 'OldKeys'
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			//热门搜索开关
			hotToggle() {
				this.forbid = this.forbid ? '' : '_forbid';
			},
			//执行搜索
			confirm(keyword) {
				keyword = keyword===false?this.keyword:keyword;
				this.keyword = keyword;
				this.saveKeyword(keyword); //保存为历史 
				// uni.showToast({
				// 	title: keyword,
				// 	icon: 'none',
				// 	duration: 2000
				// });
				//以下是示例跳转淘宝搜索，可自己实现搜索逻辑
				/*
				//#ifdef APP-PLUS
				plus.runtime.openURL(encodeURI('taobao://s.taobao.com/search?q=' + keyword));
				//#endif
				//#ifdef H5
				window.location.href = 'taobao://s.taobao.com/search?q=' + keyword
				//#endif
				*/
			   this.goodslistbox = true;
			   this.shSearchbox = false;
			   
			   this.goodsList = [];
			   this.queryData.pageNum = 1;
			   this.queryData.pageSize = 15;
			   this.queryData.totalPage = 0;
			   this.queryData.keyword = keyword;
			   this.getGoodlist(this.queryData,true);
			   
			},
			//保存关键字到历史记录
			saveKeyword(keyword) {
				const that = this;
				uni.getStorage({
					key: 'OldKeys',
					success: (res) => {
						var OldKeys = JSON.parse(res.data);
						var findIndex = OldKeys.indexOf(keyword);
						if (findIndex == -1) {
							OldKeys.unshift(keyword);
						} else {
							OldKeys.splice(findIndex, 1);
							OldKeys.unshift(keyword);
						}
						//最多10个纪录
						OldKeys.length > 10 && OldKeys.pop();
						uni.setStorage({
							key: 'OldKeys',
							data: JSON.stringify(OldKeys)
						});
						that.oldKeywordList = [];//更新历史搜索
						OldKeys.forEach(p=>{
							if(p!=null && p!=''){
								that.oldKeywordList.push(p);
							}
						});
					},
					fail: (e) => {
						var OldKeys = [keyword];
						uni.setStorage({
							key: 'OldKeys',
							data: JSON.stringify(OldKeys)
						});
						this.oldKeywordList = OldKeys; //更新历史搜索
					}
				});
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
	view{display:block;}
	.search-box {width:100%;background-color:rgb(242,242,242);padding:15upx 2.5%;display:flex;justify-content:space-between;}
	.search-box .mSearch-input-box{width: 100%;}
	.search-box .input-box {width:85%;flex-shrink:1;display:flex;justify-content:center;align-items:center;}
	.search-box .search-btn {width:15%;margin:0 0 0 2%;display:flex;justify-content:center;align-items:center;flex-shrink:0;font-size:28upx;color:#fff;background:linear-gradient(to right,#ff9801,#ff570a);border-radius:60upx;}
	.search-box .input-box>input {width:100%;height:60upx;font-size:32upx;border:0;border-radius:60upx;-webkit-appearance:none;-moz-appearance:none;appearance:none;padding:0 3%;margin:0;background-color:#ffffff;}
	.placeholder-class {color:#9e9e9e;}
	.search-keyword {width:100%;background-color:rgb(242,242,242);}
	.keyword-list-box {height:calc(100vh - 110upx);padding-top:10upx;border-radius:20upx 20upx 0 0;background-color:#fff;}
	.keyword-entry-tap {background-color:#eee;}
	.keyword-entry {width:94%;height:80upx;margin:0 3%;font-size:30upx;color:#333;display:flex;justify-content:space-between;align-items:center;border-bottom:solid 1upx #e7e7e7;}
	.keyword-entry image {width:60upx;height:60upx;}
	.keyword-entry .keyword-text,.keyword-entry .keyword-img {height:80upx;display:flex;align-items:center;}
	.keyword-entry .keyword-text {width:90%;}
	.keyword-entry .keyword-img {width:10%;justify-content:center;}
	.keyword-box {height:calc(100vh - 110upx);border-radius:20upx 20upx 0 0;background-color:#fff;}
	.keyword-box .keyword-block {padding:10upx 0;}
	.keyword-box .keyword-block .keyword-list-header {width:94%;padding:10upx 3%;font-size:27upx;color:#333;display:flex;justify-content:space-between;}
	.keyword-box .keyword-block .keyword-list-header image {width:40upx;height:40upx;}
	.keyword-box .keyword-block .keyword {width:94%;padding:3px 3%;display:flex;flex-flow:wrap;justify-content:flex-start;}
	.keyword-box .keyword-block .hide-hot-tis {display:flex;justify-content:center;font-size:28upx;color:#6b6b6b;}
	.keyword-box .keyword-block .keyword>view {display:flex;justify-content:center;align-items:center;border-radius:60upx;padding:0 20upx;margin:10upx 20upx 10upx 0;height:60upx;font-size:28upx;background-color:rgb(242,242,242);color:#6b6b6b;}
	
	
	
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
				width: 5rem;
				height: 2.3rem;
				line-height: 2.3rem;
				margin-right: 1rem;

				
			}
		}
	}
	
	.nonegoods{
		    text-align: center;
		    margin-top: 2rem;
		    font-size: 0.8rem;
		    display: block;
	}
	
	
</style>

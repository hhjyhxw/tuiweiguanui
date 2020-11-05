<template>
	<view>
		<!-- 描述 -->
		<view class="desc">
			<text>本次下单详情:</text>
		</view>
		
		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="goods-item" v-for="(item,index) in goodsList" :key="index">
				<image class="minus" src="../../static/minus2.png" @click="subCart(item,index)"></image>
				<image class="goods-img" :src="item.img"></image>
				<view class="goods-info">
					<view class="goods-name">{{item.title}}</view>
					<view class="price-amount">
						<view class="price">￥{{item.price}}</view>
						<view class="num">{{item.num}}份</view>
						<view class="total-amount">￥{{item.totalAmout}}</view>
					</view>
				</view>
				<image class="add" src="../../static/add-fill.png" @click="addCart(item,index)"></image>
			</view>
		</view>
		
		
	
		<!-- 优惠明细 -->
		<view class="yt-list">
			<view class="yt-list-cell b-b" @click="toggleMask('show')">
				<view class="cell-icon">
					券
				</view>
				<text class="cell-tit clamp">优惠券</text>
				<text class="cell-tip active">
					{{selectCouponItem?selectCouponItem.title : '选择优惠券'}}
				</text>
				<text class="cell-more wanjia wanjia-gengduo-d"></text>
			</view>
		</view>
				
		<!-- footer -->
		<view class="footer">
			<view class="left">总金额:<text class="total-amount">￥{{totalAmout}}</text></view>
			<view class="right" @click="gopay"><text class="gopay">去支付</text></view>
		</view>
		
		
		<!-- 优惠券面板 -->
		<view class="mask" :class="maskState===0 ? 'none' : maskState===1 ? 'show' : ''" @click="toggleMask">
			<view class="mask-content" @click.stop.prevent="stopPrevent">
				<!-- 优惠券页面，仿mt -->
				<view class="item-list" v-for="(item,index) in couponList" :key="index" >
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
								<view @click="selectCoupon(item)"  class="receve_btn" v-if="item.status===0"><text class="btn" >使用</text></view>
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
		</view>
	</view>
</template>

<script>
	 import util from '../../common/util.js';  
	export default {
		data() {
			return {
				shopId:null,
				goodsList:[
					
				],
				maskState: 0, //优惠券面板显示状态
				couponList: [],
				queryData:{
					status:'unreceived',
					shopId:null,
					pageNum: 1,//页码
					pageSize:15,
					totalPage: 0,//总页数
					
				},
				selectCouponItem:null,
				totalAmout:0,//总金额
			}
		},
		onShow() {
			console.log('this.shopId===='+JSON.stringify(this.shopId)); //打印出上个页面传递的参数。
			this.getCartList();
			// this.getCouponlist(this.queryData,true);
			
		},
		onLoad(option){
			console.log('option===='+JSON.stringify(option)); //打印出上个页面传递的参数。
			this.shopId = option.shopId;
			this.queryData.shopId = option.shopId;
		},
		methods: {
			//显示优惠券面板
			toggleMask(type) {
				let timer = type === 'show' ? 10 : 300;
				let state = type === 'show' ? 1 : 0;
				this.maskState = 2;
				setTimeout(() => {
					this.maskState = state;
				}, timer)
			},
			//cartlist
			getCartList(){
				const that = this
				let param ={
					'shopId':that.shopId
				};
				that.$api.requestGet('cart', 'cartList',param,failres => {
					that.$api.msg(failres.msg)
				}).then(res => {
					if(res.code==0){
						that.goodsList = res.list;
						that.totalAmout = res.totalAmout;
						//根据skuIds获取可用优惠券
						that.getMCouponlist();
					}
				});
			},
			//加入购物车
			addCart(item,index){
				console.log("item==="+JSON.stringify(item));
				const that = this
				let param ={
					'shopId':that.shopId,
					'skuId':item.skuId,
					'groupId':item.groupId
				};
				that.$api.requestGet('cart', 'addCart',param,failres => {
					that.$api.msg(failres.msg)
				}).then(res => {
					if(res.code==0){
						that.selectCouponItem = null;
						item.num = item.num+1;
						//item.totalAmout = item.totalAmout+item.price;
						//that.totalAmout = that.totalAmout+item.price;
						item.totalAmout = util.accAdd(item.totalAmout,item.price);
						that.totalAmout = util.accAdd(that.totalAmout,item.price);
						that.goodsList[index] = item;
						that.caculateAmount();
					}
				});
			},
			//购物车减一
			subCart(item,index){
				const that = this
				let param ={
					'shopId':that.shopId,
					'skuId':item.skuId,
					'groupId':item.groupId
				};
				that.$api.requestGet('cart', 'subCart',param,failres => {
					that.$api.msg(failres.msg)
				}).then(res => {
					if(res.code==0){
						that.selectCouponItem = null;
						item.num = item.num-1;
						item.totalAmout = util.accSub(item.totalAmout,item.price);
						//that.totalAmout = that.totalAmout-item.price;
						that.totalAmout = util.accSub(that.totalAmout,item.price);
						if(item.num<=0){
							that.goodsList.splice(index,1);
							//删除某一项商品后，重新读取可用优惠券
							that.getMCouponlist();
							// that.goodsList = goodslist;
						}else{
							that.goodsList[index] = item;
						}
						that.caculateAmount();
					}
				});
			},
			
			showdetail(item,index){
				item.show = true;
				this.couponList[index] = item;
			},
			hidetail(item,index){
				item.show = false;
				this.couponList[index] = item;
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
				       this.couponList =  list;
				   } else {
				       this.couponList = this.couponList.concat(list);
				   }
			},
			getMCouponlist(){
				const that = this;
				let groupId = new Array();
				let skuId = new Array();
				that.goodsList.forEach(p=>{
					skuId.push(p.skuId);
					groupId.push(p.groupId);
				});
				let param = {
					groupId:groupId,
					skuId:skuId,
					shopId:that.shopId,
				};
				that.$api.request('coupon', 'queryMycouponList',param,failres => {
					that.$api.msg(failres.msg)
				}).then(res => {
					if(res.code==0){
						let list = res.list;
						list.forEach(p=>{
							p.show = false;
						});
						that.couponList =  list;
					}
				});
			},
			
			//选择优惠券
			selectCoupon(couponitem) {
				const that = this;
				that.caculateAmount();
				that.maskState = 0
				if(couponitem.min>that.totalAmout){
					that.$api.msg('当前商品金额不满足使用优惠券条件')
					return;
				}
				that.selectCouponItem = couponitem
				//that.totalAmout = that.totalAmout - couponitem.discount;
				that.totalAmout = util.accSub(that.totalAmout,couponitem.discount);
			},
			stopPrevent() {},
			
			//重新计算金额
			caculateAmount(){
				const that = this;
				if(that.goodsList!=null &&that.goodsList.length>0){
					let totalAmout = 0;
					that.goodsList.forEach(p=>{
						// totalAmout=totalAmout+p.price*p.num;
						totalAmout = util.accAdd(totalAmout,p.price*p.num);
					});
					that.totalAmout = totalAmout;
				}
			},
			//got to pay
			gopay(){
				const that = this;
				let groupId = new Array();
				let skuId = new Array();
				let num = new Array();
				that.goodsList.forEach(p=>{
					groupId.push(p.groupId);
					skuId.push(p.skuId);
					num.push(p.num);
				});
				var mycouponId = that.selectCouponItem!=null?that.selectCouponItem.id:null;
				let param = {
					groupId:groupId,
					skuId:skuId,
					num:num,
					shopId:that.shopId,
					payType:1,
					mycouponId:mycouponId
				};
				that.$api.request('order', 'createOrder',param,failres => {
					that.$api.msg(failres.msg)
				}).then(res => {
					if(res.code==0){
						uni.navigateTo({
							 url: '/pages/pay/pay?price='+that.totalAmout+'&orderNo='+res.orderNo+'&shopId='+that.shopId
						})
					}
				});
				
			},
			
			//重新计算金额
		}
	}
</script>

<style lang="scss">
	.desc{
		display: flex;
		line-height: 2rem;
		text-align: center;
		padding-left: 2rem;
		color: red;
		padding: 1rem;

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
			width:1.5rem;
			height: 1.5rem;
			margin: 0.1rem 1rem;
		}
	}
	
	
	/* 优惠券面板 */
	.mask {
		display: flex;
		align-items: flex-end;
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0);
		z-index: 9995;
		transition: .3s;
	
		.mask-content {
			width: 100%;
			min-height: 30vh;
			max-height: 70vh;
			background: #f3f3f3;
			transform: translateY(100%);
			transition: .3s;
			overflow-y: scroll;
		}
	
		&.none {
			display: none;
		}
	
		&.show {
			background: rgba(0, 0, 0, .4);
	
			.mask-content {
				transform: translateY(0);
			}
		}
	}


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

	.yt-list {
		background: #fff;
	}

	.yt-list-cell {
		display: flex;
		align-items: center;
		padding: 10upx 30upx 10upx 40upx;
		line-height: 70upx;
		position: relative;

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		.cell-icon {
			height: 32upx;
			width: 32upx;
			font-size: 22upx;
			color: #fff;
			text-align: center;
			line-height: 32upx;
			background: #f85e52;
			border-radius: 4upx;
			margin-right: 12upx;

			&.hb {
				background: #ffaa0e;
			}

			&.lpk {
				background: #3ab54a;
			}

		}

		.cell-more {
			align-self: center;
			font-size: 24upx;
			color: $font-color-light;
			margin-left: 8upx;
			margin-right: -10upx;
		}

		.cell-tit {
			flex: 1;
			font-size: 26upx;
			color: $font-color-light;
			margin-right: 10upx;
		}

		.cell-tip {
			font-size: 26upx;
			color: $font-color-dark;

			&.disabled {
				color: $font-color-light;
			}

			&.active {
				color: $base-color;
			}

			&.red {
				color: $base-color;
			}
		}

		&.desc-cell {
			.cell-tit {
				max-width: 90upx;
			}
		}

		.desc {
			flex: 1;
			font-size: $font-base;
			color: $font-color-dark;
		}
	}
	
	
	.footer{
		width: 100%;
		background-color: #F5F5F5;
		border-top: 1px solid #F5F5F5;
		display: flex;
		position: fixed;
		padding: 0.5rem 1rem;
		bottom: 0.01rem;
		// #ifdef H5
		// bottom: 2.5rem;
		// #endif
		z-index: 99999;
		line-height: 2.2rem;
		.left{
			color: red;
			.total-amount{
				padding-left: 0.5rem;
			}
		}
		.right{
			/* position: absolute;
			right: 1rem;
			background-color: #7FFFAA;
			border-radius: 20px 20px 20px 20px;
			width: 5rem;
			text-align: center;
			font-size: 0.9rem; */
			right: 1rem;
			background-color: #7FFFAA;
			border-radius: 20px 20px 20px 20px;
			width: 5rem;
			text-align: center;
			font-size: 0.9rem;
			display: flex;
			justify-content: space-around;
			align-items: center;
			right: 1rem;
			position: absolute;
			.gopay{
				text-align: center;
			}
		}
	}
	
	
	
	
	
</style>

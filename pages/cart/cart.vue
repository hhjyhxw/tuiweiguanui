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
		<!-- 使用自定义底部导航时为主体增加底部 padding 避免遮盖 -->
		<view slot="gBody" class="grace-body" style="padding-bottom:150rpx;" v-show="hasdata">
			<!-- 描述 -->
			<view class="desc">
				<text>本次下单详情:</text>
			</view>
			<!-- 购物车为空 -->
			<view v-if="goodsList==null || goodsList.length < 1" style="margin-top:150px;">
				<graceEmpty>
					<view slot="img" class="empty-view">
						<!-- 请根据您的项目要求制作并更换为空图片 -->
						<image class="empty-img" mode="widthFix" src="https://staticimgs.oss-cn-beijing.aliyuncs.com/empty.png"></image>
					</view>
					<text slot="text" class="grace-text-small grace-gray">您的购物车空空如也~</text>
				</graceEmpty>
			</view>
			<!-- 购物车主结构  -->
			<view class="grace-shoppingcard">
				<view class="grace-shoppingcard-goods" v-for="(goods, indexItem) in goodsList" :key="indexItem">
					<image :src="goods.img" class="grace-shoppingcard-goods-image" mode="widthFix"></image>
					<view class="grace-shoppingcard-goods-body">
						<view class="grace-shoppingcard-goods-title">{{goods.title}}</view>
						<view class="grace-space-between">
							<text class="grace-shoppingcard-goods-price">￥{{goods.price}}</text>
							<view class="grace-shoppingcard-goods-number">
								<graceNumberBox :disabled="true" :index="indexItem" :datas="index+''" inputPadding="5rpx" 
								:value="goods.num" :maxNum="100" :minNum="1" v-on:change="numberChange"></graceNumberBox>
							</view>
						</view>
						<text class="grace-shoppingcard-remove grace-icons icon-remove" 
						@tap="removeGoods" :id="'removeIndex_' + indexItem">删除</text>
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
					
				<!-- 优惠券面板 -->
				<view class="mask" :class="maskState===0 ? 'none' : maskState===1 ? 'show' : ''" @click="toggleMask">
					<view class="mask-content" @click.stop.prevent="stopPrevent">
						<!-- 优惠券页面，仿mt -->
						<view  v-for="(item, index) in couponList" :key="index" :data-number="item.id" :data-btn="item.btn" style="margin:15px 0;" @tap="getIt(item.id,index)">
							<graceCoupons :coupon="item"></graceCoupons>
						</view>
					</view>
				</view>
				<!-- 优惠券面板 -->
				
			</view>
			
		</view>
		
		<view slot="gFooter" class="grace-nowrap grace-flex-vcenter grace-border-t" style="background-color:#FFFFFF;">
			<view class="grace-shoppingcard-count grace-nowrap grace-flex-vcenter" style="padding-left: 1rem;">
				<text class="grace-text" style="font-size:32rpx; color:#F00;">总金额 :</text>
				<text style="font-size:32rpx; color:#F00;">￥{{totalAmout}}</text>
			</view>
			<view class="grace-shoppingcard-checkout" @tap="checkout" style="display:flex;justify-content:space-around;align-items:center;">
				<view  class="self-grace-shoppingcard-checkout"  @click="gopay">	
				去支付
				</view>
			</view>
		</view>
		
		
		
	</gracePage>
</template>
<script>
import gracePage from "../../graceUI/components/gracePage.vue";
import graceEmpty from "../../graceUI/components/graceEmptyNew.vue";
import graceCheckBtn from '../../graceUI/components/graceCheckBtn.vue';
import graceNumberBox from '../../graceUI/components/graceNumberBox.vue';
import graceCoupons from "../../graceUI/components/graceCoupons.vue";
import graceEmptyNew from "../../graceUI/components/graceEmptyNew.vue";
import util from '../../common/util.js';
	export default {
		data() {
			return {
				hasdata:true,//页面是否有数据
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
					if(result.code != 0 || result.page.list==null || result.page.list.length==0){
						this.hasdata = false;//没有数据展示空页
						return;
					} 
				    // if(result.code != 0 || result.page.list==null || result.page.list.length==0) return;
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
					if(res.code==0 && res.list!=undefined && res.list!=null){
						let list = res.list;
						list.forEach(p=>{
							p.show = false;
						});
						that.couponList =  list;
					}
				});
			},
			
			getIt : function(id,index){
					var status = this.couponList[index].status;
					if(status!=0){
						return;
					}
					this.selectCoupon(this.couponList[index]);
					// 点击数据可用通过 data- 方式设置及获取
					// 点击代码请自行完善
			},
			//选择优惠券
			selectCoupon(couponitem) {
				const that = this;
				that.caculateAmount();
				that.maskState = 0
				if(Number(couponitem.min)>that.totalAmout){
					that.$api.msg('当前商品金额不满足使用优惠券条件')
					return;
				}
				that.selectCouponItem = couponitem
				//that.totalAmout = that.totalAmout - couponitem.discount;
				that.totalAmout = util.accSub(that.totalAmout,Number(couponitem.number));
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
			
			//修改数量
			numberChange:function(data){
				//[0,1,2]// 三个元素数组 0位是num 1位是子项下标 2 是父列下标，当前不用父项
				console.log("data===="+JSON.stringify(data))
				var olditem = this.goodsList[data[1]];
				if(olditem.num>data[0]){//购物车减
					this.subCart(olditem,data[1]);
				}else if(olditem.num<data[0]){//购物车加
					this.addCart(olditem,data[1]);
				}
			},
			removeGoods : function(e){
				const that = this;
				var index = e.currentTarget.id.replace('removeIndex_', '');
				index = Number(index);
				console.log("index==="+index);
				uni.showModal({
					title: '确认提醒',
					content: '您确定要移除此商品吗？',
					success:(e)=>{
						if (e.confirm) {
							var param = {
								id:that.goodsList[index].id
							};
							that.$api.requestGet('cart', 'deletCart',param,failres => {
								that.$api.msg(failres.msg)
							}).then(res => {
								if(res.code==0){
									that.goodsList.splice(index,1);
									//计算总价
									//删除某一项商品后，重新读取可用优惠券
									that.getMCouponlist();
									//that.caculateAmount();
								}
							});
						}
					}
				})
			},
			checkout:function(){
				// uni.showToast({
				// 	title: '计算的数据保存在 shoppingCard 变量内 ^_^',
				// 	icon : "none"
				// })
			},
		
		},
		components:{
				gracePage,
				graceNumberBox,
				graceEmpty,
				graceCheckBtn,
				graceCoupons,
				graceEmptyNew
			}
	}
</script>

<style lang="scss">
	page{background:#F8F8F8;}
	
	.desc{
		display: flex;
		line-height: 2rem;
		text-align: center;
		padding-left: 2rem;
		color: red;
		padding: 1rem;
		background-color: white;
		margin-top: 0.8rem;

	
	}
	.empty-view{width:280rpx; height:280rpx; border-radius:280rpx; background-color:#F6F7F8; margin-top:30rpx;}
	.empty-img{width:220rpx; height:200rpx; margin:40rpx; border-radius:200rpx;}
	.grace-shoppingcard{background:#FFFFFF; border-radius:8rpx; padding:20rpx; margin-bottom:20rpx;}
	.grace-shopp-name{width:500rpx;}
	.grace-shopp-go{width:120rpx;}
	.grace-shoppingcard-goods{margin:10rpx 0; display:flex; flex-wrap:nowrap;}
	.grace-shoppingcard-goods-checkbtn{width:60rpx; flex-shrink:0;}
	.grace-shoppingcard-goods-image{width:120rpx; margin-right:20rpx; flex-shrink:0;}
	.grace-shoppingcard-goods-body{width:100%;}
	.grace-shoppingcard-goods-title{line-height:1.4em;}
	.grace-shoppingcard-goods-price{color:#F00; font-size:32rpx; display:flex; flex-wrap:nowrap; justify-content:space-between;}
	.grace-shoppingcard-goods-number{padding:2px 0;}
	.grace-shoppingcard-remove{display:block; text-align:right; line-height:50rpx; margin-top:30rpx; color:#CCCCCC; font-size:24rpx;}
	.grace-shoppingcard-checkbtn{width:200rpx; margin-left:50rpx; flex-shrink:0;}
	.grace-shoppingcard-count{width:600rpx;}
	.grace-shoppingcard-checkout{width:280rpx; height:100rpx; line-height:100rpx; font-size:28rpx; text-align:center; flex-shrink:0;}	
	.self-grace-shoppingcard-checkout{border-radius: 30px;background-color: #7FFFAA;width: 200rpx;height: 80rpx;line-height: 80rpx;font-size: 28rpx;text-align: center;}	
	
	
	
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
	/* 空数据页  */
	.empty-view{width:280rpx; height:280rpx; border-radius:280rpx; background-color:#F6F7F8; margin-top:300rpx;}
	.empty-img{width:220rpx; height:200rpx; margin:40rpx; border-radius:200rpx;}
	.grace-text-small{margin-top:10px;}
</style>

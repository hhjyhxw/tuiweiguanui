<template>
	<gracePage headerBG="#008AFF" statusBarBG="#008AFF" :bounding="false">
		<view class="grace-header-body" slot="gHeader">
			<view class="grace-header-leader grace-nowrap grace-space-between grace-flex-vcenter">
				<view class="grace-header-leader-btns grace-icons icon-arrow-left grace-white grace-bold" 
				hover-class="navigator-hover" style="padding-left: 11px;font-size: 28px;"  @tap="goback" ></view>
				<view class="grace-header-leader-line"></view>
				<!-- <view class="grace-header-leader-btns grace-icons icon-home2 grace-white" 
				hover-class="navigator-hover"  @tap="gohome"></view> -->
			</view>
			<view class="grace-header-content grace-flex-center" style="margin-right:180rpx;">
				<text class="grace-header-text grace-ellipsis grace-white" style="margin-left:53px;font-size:30rpx;">功能面板</text>
			</view>
		</view>
		<!-- 页面主体 -->
		<view slot="gBody" class="grace-body">
			<view class="grace-title grace-margin-top-my">订单报表</view>
			<view class="grace-icon-classes grace-wrap grace-space-between">
				<navigator :url="item.path" :open-type="item.openType" 
				class="grace-ic-item" :style="{background:item.bgColor}" v-for="(item, index) in orderclasses" :key="index">
					<image :src="item.icon" class="grace-ic-image" mode="widthFix"></image>
					<view class="grace-ic-content">
						<text class="grace-ic-title grace-white">{{item.txt}}</text>
						<text class="grace-text-small grace-white">{{item.smallTxt}}</text>
					</view>
					<image :src="item.icon" class="grace-ic-bg-image" mode="widthFix"></image>
				</navigator>
			</view>
			<!--  -->
			<view class="grace-title grace-margin-top-my">商品管理</view>
			<view class="grace-icon-classes grace-wrap grace-space-between">
				<navigator :url="item.path" :open-type="item.openType" 
				class="grace-ic-item" :style="{background:item.bgColor}" v-for="(item, index) in goodsclasses" :key="index">
					<image :src="item.icon" class="grace-ic-image" mode="widthFix"></image>
					<view class="grace-ic-content">
						<text class="grace-ic-title grace-white">{{item.txt}}</text>
						<text class="grace-text-small grace-white">{{item.smallTxt}}</text>
					</view>
					<image :src="item.icon" class="grace-ic-bg-image" mode="widthFix"></image>
				</navigator>
			</view>
			<!--  -->
			<view class="grace-title grace-margin-top-my">营销管理</view>
			<view class="grace-icon-classes grace-wrap grace-space-between">
				<navigator :url="item.path" :open-type="item.openType" 
				class="grace-ic-item" :style="{background:item.bgColor}" v-for="(item, index) in marketclasses" :key="index">
					<image :src="item.icon" class="grace-ic-image" mode="widthFix"></image>
					<view class="grace-ic-content">
						<text class="grace-ic-title grace-white">{{item.txt}}</text>
						<text class="grace-text-small grace-white">{{item.smallTxt}}</text>
					</view>
					<image :src="item.icon" class="grace-ic-bg-image" mode="widthFix"></image>
				</navigator>
			</view>
			<!--  -->
			<view class="grace-title grace-margin-top-my">资金管理</view>
			<view class="grace-icon-classes grace-wrap grace-space-between">
				<navigator :url="item.path" :open-type="item.openType" 
				class="grace-ic-item" :style="{background:item.bgColor}" v-for="(item, index) in fundclasses" :key="index">
					<image :src="item.icon" class="grace-ic-image" mode="widthFix"></image>
					<view class="grace-ic-content">
						<text class="grace-ic-title grace-white">{{item.txt}}</text>
						<text class="grace-text-small grace-white">{{item.smallTxt}}</text>
					</view>
					<image :src="item.icon" class="grace-ic-bg-image" mode="widthFix"></image>
				</navigator>
			</view>
			<!--  -->
			<view class="grace-title grace-margin-top-my">店铺设置</view>
			<view class="grace-icon-classes grace-wrap grace-space-between">
				<navigator :url="item.path" :open-type="item.openType" 
				class="grace-ic-item" :style="{background:item.bgColor}" v-for="(item, index) in shopclasses" :key="index">
					<image :src="item.icon" class="grace-ic-image" mode="widthFix"></image>
					<view class="grace-ic-content">
						<text class="grace-ic-title grace-white">{{item.txt}}</text>
						<text class="grace-text-small grace-white">{{item.smallTxt}}</text>
					</view>
					<image :src="item.icon" class="grace-ic-bg-image" mode="widthFix"></image>
				</navigator>
			</view>
		</view>
	</gracePage>
</template>
<script>
import gracePage from "../../graceUI/components/gracePage.vue";
export default {
    data() {
    	return {
			orderclasses : [
				{
					icon:'https://graceui.oss-cn-beijing.aliyuncs.com/classes/font.png', 
					txt:'今日订单', smallTxt:"", bgColor:"#6DCD70",
					path:"/pages/shoptoday_order/shoptoday_order", openType:"navigate"
				},
				{
					icon:'https://graceui.oss-cn-beijing.aliyuncs.com/classes/tmp.png', 
					txt:'历史订单', smallTxt:"", bgColor:"#F596DB",
					path:"/pages/shoptoday_order/shophistory_order", openType:"navigate"
				},
				{
					icon:'https://graceui.oss-cn-beijing.aliyuncs.com/classes/mall.png',
					txt:'统计报表', smallTxt:"", bgColor:"#F596DB",
					path:"./index?test=1", openType:"navigate"
				},
			],
			goodsclasses:[
				{
					icon:'https://graceui.oss-cn-beijing.aliyuncs.com/classes/msg.png', 
					txt:'商品上传', smallTxt:"", bgColor:"#F596DB",
					path:"/pages/upgoods/upgoods", openType:"navigate"
				},
				{
					icon:'https://graceui.oss-cn-beijing.aliyuncs.com/classes/card.png', 
					txt:'商品上架', smallTxt:"", bgColor:"#C4A6FB",
					path:"/pages/upgoods/upsku", openType:"navigate"
				},
				{
					icon:'https://graceui.oss-cn-beijing.aliyuncs.com/classes/lady.png', 
					txt:'商品分类', smallTxt:"", bgColor:"#9CDDEA",
					path:"/pages/shopcategory/shopcategory", openType:"navigate"
				}
			],
			marketclasses : [
				{
					icon:'https://graceui.oss-cn-beijing.aliyuncs.com/classes/font.png', 
					txt:'广告管理', smallTxt:"", bgColor:"#DCD64E",
					path:"/pages/shopadd/shopadd", openType:"navigate"
				},
				{
					icon:'https://graceui.oss-cn-beijing.aliyuncs.com/classes/tmp.png', 
					txt:'优惠券', smallTxt:"", bgColor:"#C4A6FB",
					path:"/pages/shopcoupon/shopcoupon", openType:"navigate"
				},
				{
					icon:'https://graceui.oss-cn-beijing.aliyuncs.com/classes/mall.png',
					txt:'店铺分享', smallTxt:"", bgColor:"#C4A6FB",
					path:"./index?test=1", openType:"navigate"
				},
			],
			fundclasses : [
				{
					icon:'https://graceui.oss-cn-beijing.aliyuncs.com/classes/font.png', 
					txt:'资金明细', smallTxt:"", bgColor:"#DCD64E",
					path:"../index/index?test=1", openType:"switchTab"
				},
				{
					icon:'https://graceui.oss-cn-beijing.aliyuncs.com/classes/tmp.png', 
					txt:'资金提现', smallTxt:"", bgColor:"#C4A6FB",
					path:"/pages/shopwithdraw/shopwithdraw", openType:"navigate"
				},
				{
					icon:'https://graceui.oss-cn-beijing.aliyuncs.com/classes/tmp.png', 
					txt:'提现记录', smallTxt:"", bgColor:"#C4A6FB",
					path:"/pages/shopwithdraw/shopwithdraw-list", openType:"navigate"
				},
				{
					icon:'https://graceui.oss-cn-beijing.aliyuncs.com/classes/mall.png',
					txt:'银行卡', smallTxt:"", bgColor:"#C4A6FB",
					path:"/pages/shopbankcard/shopbankcard", openType:"navigate"
				},
			],
			shopclasses : [
				{
					icon:'https://graceui.oss-cn-beijing.aliyuncs.com/classes/font.png', 
					txt:'提货地址', smallTxt:"", bgColor:"#DCD64E",
					path:"../index/index?test=1", openType:"switchTab"
				}
			],
		}
    },
	methods:{
		goback : function () { uni.navigateBack({}); },
	},
	components:{
		gracePage
	}
}
</script>
<style>
.grace-icon-classes{}
.grace-ic-item{width:210rpx; height:128rpx; font-size:0; border-radius:5px; position:relative; margin:10rpx 0; overflow:hidden; display:flex; flex-direction:column; justify-content:center;}
.grace-ic-image{width:60rpx; height:56rpx; margin-left:20rpx;}
.grace-ic-bg-image{width:70rpx; height:66rpx; position:absolute; opacity:0.1; right:6px; bottom:6px;}
.grace-ic-content{padding:10rpx 20rpx;}
.grace-ic-title{line-height:40rpx; font-size:28rpx; margin-right:3px;}
.grace-margin-top-my{
	margin-top: 1px;
}
.uni-page-head{
	background-color: #007AFF !important;
}
</style>
<template>
	<gracePage :customHeader="false">
		<view slot="gBody" class="grace-flex-v1" id="gBody">
			<!-- 数据区域 -->
			<view class="grace-cate-wrap grace-space-between">
				<button  class="grace-cate-left-item" style="position: fixed;width: 110px;top: 43px;left:0;z-index: 2;display: flex;justify-content: center;align-items: center;border: 1px solid lightgray;">添加分类</button>
				<scroll-view scroll-y scroll-with-animation class="grace-cate-left grace-scroll-y" :style="{height:mainHeight+'px'}" :scroll-into-view="leftTo">
					<view  :class="['category-item', currentCateIndex == index ? 'grace-cate-left-current' : '']" v-for="(item,index) in categorylist" :key="index">
						<view class="category-name">{{item.title}}</view>
						<view class="caategory-icon">x</view>
					</view>
				</scroll-view>
				<scroll-view :scroll-into-view="productListTo" scroll-with-animation 
					scroll-y class="grace-cate-right grace-scroll-y" :style="{height:mainHeight+'px'}" @scroll="rscroll">
					<view>
						<image :src="category.picUrl" class="category-main-img"></image>
					</view>
					<view class="category-title">
						{{category.title}}
					</view>
					<view class="appraise-body appraise-uploader">
						<view class="uni-uploader-body">
							<view class="uni-uploader__files">
								<block v-for="(item,index) in categorysonlist" :key="index">
									<view class="uni-uploader__file" style="position: relative;">
										<image class="uni-uploader__img" :src="item.picUrl" @tap="previewImage"></image>
										<view class="close-view" @click="close(item, index)">x</view>
										<view class="uni-uploader-title">{{item.title}}</view>
									</view>
								</block>
								<view class="uni-uploader__input-box" v-show="categorysonlist.length < 5">
									<view class="uni-uploader__input" @tap="chooseImg(item,index)"></view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</gracePage>
</template>
<script>
import gracePage from "../../graceUI/components/gracePage.vue";
var pageHeight = 500;
export default {
    data() {
    	return {
			mainHeight : 500,
			// 左侧分类
			currentCateIndex : 1,
			// 左侧滚动定位
			leftTo : 'cate1',
			// 延迟执行防止卡顿
			scrollTimer : null,
			category:{id:1,title:'新鲜蔬菜',picUrl:'../../static/emptyCart.jpg'},
			categorylist:[
				{id:1,title:'新鲜蔬菜',picUrl:''},
				{id:2,title:'新鲜肉类',picUrl:''},
				{id:2,title:'粮油米面',picUrl:''}
			],
			categorysonlist:[
				{id:1,title:'新鲜蔬菜',picUrl:'../../static/tab-cart.png'},
				{id:2,title:'新鲜肉类',picUrl:'../../static/tab-cart.png'},
				{id:2,title:'粮油米面',picUrl:'../../static/tab-cart.png'}
			],
		}
    },
	onReady:function(){
		uni.getSystemInfo({
			success: function(res) {
				pageHeight = res.windowHeight;
			}
		});
	},
	onLoad : function () {
		
	},
	methods:{
		rscroll : function(e){
			if(this.scrollTimer != null){
				clearTimeout(this.scrollTimer);
			}
			this.scrollTimer = setTimeout(()=>{this.getIndex();}, 100);
		},
		
		gotoinfo : function(e){
			console.log(e);
			uni.showToast({
				title:"商品id " + e
			});
		},
		chooseImg(item,index) { //选择图片
			const that = this
		    that.$api.uploadImg((res => {
				item.imgs.push(res)
			}))
		},
		previewImage() { //预览图片
		    uni.previewImage({
		        urls: this.imageList
		    });
		},
	},
	components:{gracePage}
}
</script>
<style>
.grace-cate-wrap{width:750rpx;}
.grace-cate-left{width:200rpx; background-color:#F6F7F8;}
.grace-cate-right{width:530rpx; overflow:hidden;}
.grace-cate-left-item{display:inline-flex; width:100%; line-height:40rpx; height:40rpx; padding:35rpx 0; font-size:26rpx; justify-content:center;}
.grace-cate-left-current{background-color:#FFFFFF; color:#FF0036;}
.right-cate-name{line-height:80rpx; font-size:28rpx; color:#666666; font-weight:bold; display:block; width:100%;}
.grace-product-list{padding:10rpx 0; margin-bottom:5px; font-size:0;}
.grace-product-list-body{width:355rpx; padding-right:10rpx;}
.grace-product-list-img{width:150rpx; height:150rpx;}
.grace-product-title{line-height:50rpx; font-size:28rpx; display:block; width:100%;}
.grace-product-price{line-height:60rpx; font-size:32rpx; color:#FF0036; display:block; width:100%;}
.grace-product-btn{line-height:60rpx; font-size:40rpx; color:#FF0036; padding-right:20rpx;}
.category-item{
	display: flex;
	justify-content:center ;
	position: relative;
	top: 41px;
	background: #FAFAFA;
	padding: 7px;
	border: 1px solid lightgray;
	border-radius: 5px;
}
.caategory-icon{
	position: absolute;
	top: -6px;
	right: 0px;
	border: 1px solid lightgray;
	border-radius: 2px;
	padding: 2px;
	z-index: 3;
	background: lightgray;
	color: red;
}
.category-main-img{
	display: flex;
	justify-content: center;
	align-items: center;
	align-self: center;
	border: 1px solid lightgray;
	border-radius: 5px;
	width: 97%;
	right: 0;
}
.category-title{
	display: flex;
	justify-content:center;
	text-align: center;
	align-items: center;
	padding-top: 16px;
	padding-bottom: 5px;
}

  .appraise-body {
    	background: #fff;
    }
    .appraise-textare {
    	height: 200upx;
    	font-size: 28upx;
    	line-height: 34upx;
    	width: 100%;
    	box-sizing: border-box;
    	padding: 20upx 30upx 0;
    }
    .appraise-input {
    	font-size: 34upx;
    	height: 50upx;
    	min-height: 50upx;
    	padding: 15upx 20upx;
    	line-height: 50upx;
    }
    .appraise-uploader {
    	/* padding: 22upx 20upx; */
		padding-left: 5px;
    }
    .appraise-star {
    	font-family: uniicons;
    	font-size: 40upx;
    	margin-left: 6upx;
    }
    .appraise-star-view {
    	margin-left: 20upx;
    }
    .appraise-star:after {
    	content: '\e408';
    }
    .appraise-star.active {
    	color: #FFB400;
    }
    .appraise-star.active:after {
    	content: '\e438';
    }
    .appraise-submit {
    	background: #007AFF;
    	color: #FFFFFF;
    	margin: 20upx;
    }
	.input-view {
	    font-size: 28upx;
	}
	.close-view{
	    text-align: center;line-height:14px;height: 16px;width: 16px;border-radius: 50%;background: #FF5053;color: #FFFFFF;position: absolute;top: -6px;right: -4px;font-size: 12px;
	}
	/* 上传 */
	.uni-uploader {
		flex: 1;
		flex-direction: column;
	}
	.uni-uploader-head {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	.uni-uploader-info {
		color: #B2B2B2;
	}
	.uni-uploader-body {
		margin-top: 16upx;
	}
	.uni-uploader__files {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}
	.uni-uploader__file {
		margin: 10upx;
		width: 80px;
		height: 108px;
	}
	.uni-uploader-title{
		display: flex;
		justify-content: center;
		text-align: center;
		align-items: center;
		padding: 2px;
		font-weight: bold;
	}
	.uni-uploader__img {
		display: block;
		width: 80px;
		height: 80px;
		border: 1px solid lightgray;
	}
	.uni-uploader__input-box {
		position: relative;
		margin:10upx;
		width: 80px;
		height: 80px;
		border: 2upx solid #D9D9D9;
	}
	.uni-uploader__input-box:before,
	.uni-uploader__input-box:after {
		content: " ";
		position: absolute;
		top: 50%;
		left: 50%;
		-webkit-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		background-color: #D9D9D9;
	}
	.uni-uploader__input-box:before {
		width: 4upx;
		height: 79upx;
	}
	.uni-uploader__input-box:after {
		width: 79upx;
		height: 4upx;
	}
	.uni-uploader__input-box:active {
		border-color: #999999;
	}
	.uni-uploader__input-box:active:before,
	.uni-uploader__input-box:active:after {
		background-color: #999999;
	}
	.uni-uploader__input {
		position: absolute;
		z-index: 1;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
	}
</style>
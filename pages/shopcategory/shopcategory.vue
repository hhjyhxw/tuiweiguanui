<template>
	<gracePage :customHeader="false">
		<view slot="gBody" class="grace-flex-v1" id="gBody">
			<!-- 数据区域 -->
			<view class="grace-cate-wrap grace-space-between">
				<button @click="showShade('P','add')" class="grace-cate-left-item addbtn" style="">添加分类</button>
				<scroll-view scroll-y scroll-with-animation class="grace-cate-left grace-scroll-y" :style="{height:mainHeight+'px'}" :scroll-into-view="leftTo">
					<view  :class="['category-item', currentCateIndex == index ? 'grace-cate-left-current' : '']" v-for="(item,index) in categorylist" :key="index"
					 @click="showCategory(item,index)">
						<view class="category-name">{{item.title}}</view>
						<view class="caategory-icon" @click.stop="deleteCategory(item.id)">x</view>
					</view>
				</scroll-view>
				<scroll-view  scroll-with-animation 
					scroll-y class="grace-cate-right grace-scroll-y" :style="{height:mainHeight+'px'}">
					<view @click="showShade('P','edit')">
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
										<view class="close-view" @click.stop="deleteCategory(item.id)">x</view>
										<view class="uni-uploader-title">{{item.title}}</view>
									</view>
								</block>
								<view class="uni-uploader__input-box" v-show="categorysonlist.length < 5">
									<view class="uni-uploader__input" @click="showShade('S','add')"></view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<!-- 遮罩组件 @closeShade="closeShade" 实现点击关闭自身，如果不需要次功能则不绑定此事件即可 -->
			<graceShade @closeShade="closeShade" ref="graceShade">
				<view class="addgoods-box addgoods-box-margintop grace-relative" @tap.stop="">
					<view class="category-box-title">{{selectcategorytitle}}</view>
					<view class="my-form-item">
						<text class="my-form-label">分类名称</text>
						<input class="my-form-input" v-model="addCategory.title"/>
					</view>
					<view class="my-form-item">
						<text class="my-form-label-start">分类图片</text>
						<!-- 图片选择  -->
						<view class="goods-imgbox">
							<button class="goods-imgbox-icon" v-if="addCategory.picUrl==''" @tap="chooseImg()">+添加图片</button>
							<image class="goods-msg-in" :src="addCategory.picUrl" @tap="chooseImg()"/>
						</view>
					</view>
					
					<view class="skufooter">
						<button class="btn"  @tap.stop="closeShade">关闭</button>
						<button class="btn" @tap="saveCategory">保存</button>
					</view>
				</view>
			</graceShade>
		</view>
	</gracePage>
</template>
<script>
import gracePage from "../../graceUI/components/gracePage.vue";
import graceShade from "../../graceUI/components/graceShade.vue";
var pageHeight = 500;
export default {
    data() {
    	return {
			mainHeight : 500,
			// 左侧分类
			currentCateIndex : 0,
			// 左侧滚动定位
			leftTo : 'cate1',
			// 延迟执行防止卡顿
			scrollTimer : null,
			selectcategorytitle:'添加一级分类',//根据被选择的分类动态修改
			category:{id:1,title:'新鲜蔬菜',picUrl:'../../static/emptyCart.jpg'},
			addCategory:{
				title:'',
				picUrl:'',
			},
			categorylist:[
				{id:1,title:'新鲜蔬菜',picUrl:''},
				{id:2,title:'新鲜肉类',picUrl:''},
				{id:2,title:'粮油米面',picUrl:''}
			],
			categorysonlist:[
				
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
	onShow() {
		this.init();
	},
	onLoad : function () {
		
	},
	methods:{
		
		init(){
			this.getCategoryList();
			//this.category = (this.categorylist!=null && this.categorylist.length>0)?this.categorylist[0]:null;
		},
		//获取商品分类列表
		getCategoryList(){
			var that = this;
			that.$api.requestGet('shopkeeper/shopCategory', 'categoryList',{},failres => {
				that.$api.msg(failres.msg)
			}).then(res => {
				that.categorylist = res.list;
				if (res.list!=null && res.list.length>0) {
					that.category = that.categorylist[0];
					if (that.category.childList!=null && that.category.childList.length>0) {
						that.categorysonlist = that.category.childList;
					}
				}
			});
		},
		//点击分类，查看分类
		showCategory(item,index){
			this.category = item;
			this.currentCateIndex = index;
			var that = this;
			if (that.category.childList!=null && that.category.childList.length>0) {
				that.categorysonlist = that.category.childList;
			}
		},
		//保存分类
		saveCategory(){
			var that = this;
			that.$api.request('shopkeeper/shopCategory', 'saveCategory',that.addCategory, failres => {
				uni.showToast({
					title: failres.errmsg,
					icon: "none"
				});
			}).then(res => {
				that.addCategory = res.smallCategory;
				uni.showToast({
					title: '保存成功',
					icon: "none"
				});
			})
		},
		//删除分类
		deleteCategory(id){
			
		},
		gotoinfo : function(e){
			console.log(e);
			uni.showToast({
				title:"商品id " + e
			});
		},
		
		previewImage() { //预览图片
		    uni.previewImage({
		        urls: this.imageList
		    });
		},
		/* 弹窗相关start */
		showShade : function (sp,type) {
			this.$refs.graceShade.showIt();
			//编辑父分类
			if('P'==sp && type=='edit' && this.category.id!=null){
				this.addCategory = this.category;
				this.selectcategorytitle = '编辑一级分类';
			}
			//添加新分类
			if('P'==sp && type=='add'){
				this.addCategory = {
					title:'',
					picUrl:'',
				};
				this.selectcategorytitle = '添加一级分类';
			}
			//添加子分类
			if('S'==sp && type=='add' && this.category.id!=null){
				this.addCategory = {
					parentId:this.category.id,
					title:'',
					picUrl:'',
				};
				this.selectcategorytitle = '添加二级分类';
			}
		},
		closeShade : function () {
			this.$refs.graceShade.hideIt();
		},
		/* 弹窗相关end */
		
		/* 选择图片 */
		chooseImg() { //选择图片
			const that = this
			that.$api.uploadImg((res => {
				that.addCategory.picUrl = res;
				console.log("addCategory==="+JSON.stringify(that.addCategory))
			}))
		},
	},
	components:{gracePage,graceShade}
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

/* #ifdef MP-WEIXIN */
	.addbtn{
		position: fixed;width: 100px;
		top: 0px;
		left:0;z-index: 2;display: flex;justify-content: center;align-items: center;border: 1px solid lightgray;
	} 
/* #endif */

/* #ifdef H5 */
	.addbtn{
		position: fixed;width: 100px;
		top: 43px;
		left:0;z-index: 2;display: flex;justify-content: center;align-items: center;border: 1px solid lightgray;
	}  
/* #endif */

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
		/* padding-left: 5px; */
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
		width: 73px;
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
	
	
	.grace-shade{
		background: rgba(0, 0, 0, 0.5) !important;
		z-index: 5 !important;
	}
	.addgoods-box{
	    background: white !important;
		width: 25.8rem;
		height: 43.2rem;
	}
	/* #ifdef H5 */
		.addgoods-box-margintop{
			margin-top: 2.8rem;
		}
	/* #endif */
	.my-form-item{
		display: flex;
		justify-content: space-around;
		padding:10rpx;
		align-items: center;
		position: relative;
		z-index: 6;
		font-size: 12px;
	}
	.my-form-label{
		text-align: right;
		width: 18%;
		padding: 10rpx;
	}
	.my-form-label-start{
		text-align: right;
		width: 18%;
		padding: 10rpx;
		position:absolute;
		top: 0;
		left: 0;
		z-index: 7;
	}
	
	.my-form-input{
		flex: 3;
		border: 1px solid lightgray;
		border-radius: 5px;
		padding: 10rpx;
		margin-right: 22px;
	}
	
	.goods-add-icon{
		font-size: 44px;
		height: 44px;
		line-height: 44px;
		margin-bottom: 11px;
		color: #999999;
	}
	.goods-imgbox{
		position: relative;
		background: lavender;
		padding: 1rem;
		display: flex;
		justify-content: center;
		align-items: center;
		align-self: center;
		border: 1px solid lightgray;
		border-radius: 5px;
		width: 65%;
		right: 0;
		left: 8%;
	}
	.goods-imgbox-icon{
		position: absolute;
		top: 6rem;
		left: 37%;
	}
	.goods-msg-in{
		    width: 100%;
		    height: 240px;
		    display: block;
		    overflow: hidden;
		    position: relative;
		    margin: auto;
			border-bottom: 1px solid lightgray;
	}
	
	.category-box-title{
		display: flex;
		justify-content: center;
		text-align: center;
		align-items: center;
		padding: 10px;
		border: 1px solid lightgray;
	}
	
	.skufooter{
		position: fixed;
		display: flex;justify-content: space-around;
		text-align: center;
		align-items: center;
		border-top: 1px solid;
		background: white !important;
		bottom: 2.2rem;
		right: 0;
		left: 0;
	}
	.skufooter .btn{
			width: 80%;
			flex: 1;
			background: #white !important;
		}
</style>
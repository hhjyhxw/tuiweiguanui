<template>
	
	<gracePage :customHeader="false" :bounding="false">
		<!-- <view class="grace-header-body" slot="gHeader">
			<view class="myhearder">
				<image class="myhearder-goback" src="../../static/goback.png" @click="goback"></image>
				<text class="myhearder-text">广告维护</text>
				<image class="myhearder-add" src="../../static/add.png" @click="showShade"></image>
			</view>	
		</view> -->
		
		<!-- 页面主体 -->
		<view slot="gBody" style="padding: 0 2rem;">
			<!-- <view class="myhearder">
				<view>
					<button type="primary" class="grace-button" style="right: 3rem;" size="mini"  @click="showShade" >添加</button>
				</view>
			</view>	 -->
			
			<view class="grace-nowrap grace-flex-vcenter grace-border-b grace-flex-vcenter grace-bg-white" 
			>
				<view class="graceSelectMenuItem">
					<graceSelectMenu 
					:show="show1" :items="selectMenu1" @showMenu="showMenu1" @close="closeMenu1" @select="select1"></graceSelectMenu>
				</view>
				<view class="graceSelectMenuItem">
					<!-- 此处演示数据来自后端 api，将后端的复杂数组转换为简单数组使用并适配 -->
					<graceSelectMenu 
					:show="show2" :height="300" :selectIndex="selectIndex2" :items="selectMenu2" 
					@showMenu="showMenu2" @close="closeMenu2" @select="select2"></graceSelectMenu>
				</view>
				<view class="graceSelectMenuItem">
						<button type="default" class="grace-button grace-bg-light-blue" size="mini"  @click="showShade" >添加</button>
				</view>
			</view>
			<view  class="shopcoupon" v-for="(item,index) in adslist" :key="index" :data-index="index" :data-number="item.number" :data-btn="item.btn" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend">
				<image :src="item.adImgurl" style="width: 100%;height: 12.2rem;"></image>
				<view class="btngroup" v-show="item.isshowbtn">
					<button type="default" class="btngroup-btn" size="" @click="upone($event,index)">向上</button>
					<button type="default" class="btngroup-btn" size="" @click="downone($event,index)">向下</button>
					<button type="default" class="btngroup-btn" size="" v-show="item.status==1"  @click="toupdatestatus($event,index,'0')">关闭</button>
					<button type="default" class="btngroup-btn" size="" v-show="item.status!=1"  @click="toupdatestatus($event,index,'1')">开启</button>
					<button type="default" class="btngroup-btn" size=""  @click="toedite($event,index)">编辑</button>
					<button type="default" class="btngroup-btn" size=""  @click="todel($event,index)">删除</button>
				</view>
			</view>
			
			<!-- 遮罩组件 @closeShade="closeShade" 实现点击关闭自身，如果不需要次功能则不绑定此事件即可 -->
			<graceShade @closeShade="closeShade" ref="graceShade">
				<view class="addgoods-box grace-relative" @tap.stop="">
					<view class="tan-box-titile">广告维护</view>
					<form class="grace-form">
								<view class="grace-form-item grace-border-b">
									<text class="grace-form-label">广告名称</text>
									<view class="grace-form-body">
										<input type="text" class="grace-form-input" name="adName" v-model="ads.adName" placeholder="请输入优惠券名称" />
									</view>
								</view>
								<view class="grace-form-item">
									<text class="grace-form-label">广告图片</text>
									<!-- 图片选择  -->
									<view class="goods-imgbox">
										<button class="goods-imgbox-icon grace-bg-light-blue" v-if="ads.adImgurl==''" @tap="chooseImg()">+添加图片</button>
										<image class="goods-msg-in" :src="ads.adImgurl" @tap="chooseImg()"/>
									</view>
								</view>
							</form>
					<view class="skufooter">
						<button class="btn grace-bg-light-blue"  @tap.stop="closeShade">关闭</button>
						<button class="btn grace-bg-light-blue" @tap="saveads">保存</button>
					</view>
				</view>
			</graceShade>
		</view>
	</gracePage>
</template>
<script>
import gracePage from "../../graceUI/components/gracePage.vue";
import graceSelectMenu from "../../graceUI/components/graceSelectMenu.vue";
import graceCoupons from "../../graceUI/components/graceShopCoupons.vue";
import graceShade from "../../graceUI/components/graceShade.vue";
import graceDateTime from "../../graceUI/components/graceDateTime.vue";
export default {
	data(){
		return {
			// 第 1 个菜单
			show1               : false,
			selectMenu1         : ['名称排序', '倒序', '正序'],
			selectIndex1        : 0,
			// 第 2 个菜单
			show2               : false,
			selectIndex2        : 1,
			selectMenu2         : ['全部','开启','关闭'],
			adslist:[],
			
			/* 移动所需参数 */
			startX: 0,
			startY: 0,
			endX: 0,
			endY: 0,
			status: false,
			isshowbtn:false,
			gender : ['选择使用对象', '男', '女'],
			genderIndex : 0,
			demo1Val:"请选择具体时间",
			demo2Val:"请选择具体日期",
			queryData:{
				sidx:'',
				order:'',
				status:'',
			},
			ads:{
				adName:'',
				adImgurl:'',
				status:1,
			},
			
		}
	},
	onLoad : function () {
		
	},
	onShow() {
		this.getAdsList(this.queryData);	
	},
	components:{
		gracePage, graceSelectMenu,graceCoupons,graceShade,graceDateTime
	},
	methods:{
		
		//获取广告列表列表
		getAdsList(data){
			var that = this;
			that.$api.request('shopkeeper/shopAds','adsList',data,failres => {
				that.$api.msg(failres.msg)
			}).then(res => {
				that.adslist = res.list;
				if(that.adslist!=null && that.adslist.length>0){
					that.adslist.forEach(p=>{
						p.isshowbtn = false;
					})
				}
			});
		},
		//保存广告
		saveads(){
			var that = this;
			that.$api.request('shopkeeper/shopAds','saveAds',that.ads,failres => {
				that.$api.msg(failres.msg)
			}).then(res => {
				that.$api.msg('保存成功');
				that.closeShade();
				that.getAdsList(that.queryData);
			});
		},
		/* 选择图片 */
		chooseImg() { //选择图片
			const that = this
			that.$api.uploadImg((res => {
				that.ads.adImgurl = res;
			}))
		},
		goback : function () { uni.navigateBack({}); },
		showMenu1  : function () {this.show1 = true;},
		closeMenu1 : function () {this.show1 = false;},
		select1    : function (index) {
			if(index==0){
				this.queryData.sidx = '';
				this.queryData.order = '';
			}else if(index==1){
				this.queryData.sidx = 'ad_name';
				this.queryData.order = 'asc';
			}else{
				this.queryData.sidx = 'ad_name';
				this.queryData.order = 'desc';
			}
			this.getAdsList(this.queryData);
		},
		showMenu2  : function () {this.show2 = true;},
		closeMenu2 : function () {this.show2 = false;},
		select2    : function (index) {
			if(index==0){
				this.queryData.status = '';
			}else if(index==1){
				this.queryData.status = '1';
			}else{
				this.queryData.status = '0';
			}
			this.getAdsList(this.queryData);
		},
		// 第三个菜单
		getIt : function(e){
			console.log(JSON.stringify(e));
			// 点击数据可用通过 data- 方式设置及获取
			// 点击代码请自行完善
		},
		
		/* 监听滑动开始 */
			touchstart(e) {
				e.preventDefault();
				this.startX = e.touches[0].pageX;
				this.startY = e.touches[0].pageY;
					// console.log("touchstart====="+JSON.stringify(e));
			},
			/* 监听滑动移动 */
			touchmove(e) {
				// console.log("touchmove====="+JSON.stringify(e));
				this.status = true;
				this.endX = e.touches[0].pageX;
				this.endY = e.touches[0].pageY;
			},
			/* 监听滑动结束 */
			touchend(e) {
				
				/* 判断移动方向 */
				let X = this.endX - this.startX,
					Y = this.endY - this.startY;
				/* 判断是否移动还是点击 */
				if (this.status) {
					if (X > 0 && Math.abs(X) > Math.abs(Y)) {
						//向右
						console.log('向右');
						var index = e.currentTarget.dataset.index;
						this.adslist[index].isshowbtn=false;
					} else if (X < 0 && Math.abs(X) > Math.abs(Y)) {
						//向左
						this.isshowbtn = true;
						var index = e.currentTarget.dataset.index;
						this.adslist.forEach(p=>{
							p.isshowbtn = false;
						})
						this.adslist[index].isshowbtn=true;
						console.log('向左');
					} else if (Y > 0 && Math.abs(Y) > Math.abs(X)) {
						//向下
						console.log('向下');
					} else if (Y < 0 && Math.abs(Y) > Math.abs(X)) {
						//向上
						console.log('向上');
					} else {
						//没有
						console.log('没有');
					}
				} else {
					console.log('没有');
				}
			},
			//往上移动
			upone(event,index){
				event.stopPropagation();
				console.log("index==="+index)
				if(index==0){
					return;
				}
				var temp = this.adslist[index];
				temp.isshowbtn=false;
				this.adslist[index]=this.adslist[index-1];
				this.adslist[index].isshowbtn	 = false;
				this.adslist[index-1]=temp;
				
				this.updateSort();
			},
			//往下移动
			downone(event,index){
				event.stopPropagation();
				console.log("index==="+index)
				if(index==this.adslist.length-1){
					return;
				}
				var temp = this.adslist[index];
				temp.isshowbtn=false;
				this.adslist[index]=this.adslist[index+1];
				this.adslist[index].isshowbtn = false;
				this.adslist[index+1]=temp;
				
				this.updateSort();
			},
			updateSort(){
				var ids = [];
				var sortNum = [];
				for (var i = 0; i < this.adslist.length; i++) {
					ids.push(this.adslist[i].id);
					sortNum.push(i);
				}
				var data ={
					ids:ids,
					sortNum:sortNum
				};
				var that = this;
				that.$api.request('shopkeeper/shopAds','updateSortBatch',data,failres => {
					that.$api.msg(failres.msg)
				}).then(res => {
					that.getAdsList(that.queryData);
				});
			},
			//去编辑
			toedite(event,index){
				event.stopPropagation();
				this.ads = this.adslist[index];
				this.showShade();
				
			},
			//去开启或者关闭
			toupdatestatus(event,index,status){
				event.stopPropagation();
				var ads = this.adslist[index];
				ads.status = status;
				var that = this;
				that.$api.request('shopkeeper/shopAds','saveAds',ads,failres => {
					that.$api.msg(failres.msg)
				}).then(res => {
					that.adslist[index].status=status;
				});
			},
			//去删除
			todel(event,index){
				event.stopPropagation();
				var that = this;
				var id = that.adslist[index].id;
				that.$api.requestGet('shopkeeper/shopAds','delAds',{id,id},failres => {
					that.$api.msg(failres.msg)
				}).then(res => {
					that.adslist.splice(index,1);
				});
				
			},
			/* 弹窗相关start */
			showShade : function () {
				this.$refs.graceShade.showIt();
			},
			closeShade : function () {
				this.$refs.graceShade.hideIt();
			},
			chang1:function (e) {
				console.log(e);
			},
			confirm1:function (res) {
				this.demo1Val = res[0]+'-'+res[1]+'-'+res[2]+' '+res[3]+':'+res[4]+':'+res[5];
			},
			confirm2:function (res) {
				this.demo2Val = res[0]+'-'+res[1]+'-'+res[2]+' '+res[3]+':'+res[4]+':'+res[5];
			}
	}
}
</script>
<style>
	.myhearder{
		display: flex;
		padding: 0.5rem;
		justify-content:flex-end;
		align-items: center;
		width: 100%;
	}
	.myhearder-goback{
		height: 1.5rem;
		width: 1.5rem;
	}
	.myhearder-add{
		height: 2rem;
		width: 2rem;
		display: block;
		position: relative;
		right: 0px;
	}
.graceSelectMenuItem{
	width: 216rpx;
	line-height: 90rpx;
	display: flex;
	padding-left: 1rem;
	justify-content: space-around;
}

.shopcoupon{
	position: relative;
	border-bottom: 1px solid lightgray;
}
.btngroup{
	position: absolute;
	top: 0;
	right: 0;
	z-index: 2;
}
.btngroup-btn{
	   width: 5.5rem;
	   height: 2.5rem;
	   text-align: center;
	   line-height: 2.5rem;
	   font-size: 12px;
}

.grace-shade{
	background: rgba(0, 0, 0, 0.5) !important;
	/* width: 85% !important; */
}
.addgoods-box{
    z-index: 2;
    background: white !important;
    /* width: 25.8rem; */
    height: 43.2rem;
    width: 82%;
    margin: auto;
	overflow: auto;
	/* margin-top: 2.8rem; */
}
.tan-box-titile{
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    padding: 0.8rem;
    -webkit-justify-content: space-around;
    justify-content: space-around;
    border-bottom: 1px solid lightgray;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    padding-top: 1.3rem;
}
.grace-form-item{
	padding: 0px 3rem !important;
}
.grace-form-label{
	height: 41px !important;
	line-height: 41px !important;
}
.skufooter{
	display: -webkit-box;
	display: -webkit-flex;
	display: flex;
	-webkit-justify-content: space-around;
	justify-content: center;
	text-align: center;
	-webkit-box-align: center;
	-webkit-align-items: center;
	align-items: self-start;
	background: white !important;
	right: 0;
	left: 0;
	width: 60%;
	align-self: center;
	margin: auto;
	margin-top: 3rem;
}
.skufooter .btn{
		width: 80%;
		flex: 1;
		background: #white !important;
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
	    padding: 1rem;
	    width: 100%;
	    border: 1px solid lightgray;
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
		/* border-bottom: 1px solid lightgray; */
}
.goods-title{
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 1rem;
	background-color: white;
	padding-top: 0px;
}
.grace-form-input{
	text-align: center !important;
}
</style>
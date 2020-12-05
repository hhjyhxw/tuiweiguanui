<template>
	
	<gracePage :customHeader="false" :bounding="false">
		<!-- <view class="grace-header-body" slot="gHeader">
			<view class="myhearder">
				<image class="myhearder-goback" src="../../static/goback.png" @click="goback"></image>
				<text class="myhearder-text">优惠券</text>
				<image class="myhearder-add" src="../../static/add.png" @click="showShade"></image>
			</view>	
		</view> -->
		<!-- 页面主体 -->
		<view slot="gBody">
			<view class="grace-nowrap grace-flex-vcenter grace-border-b" 
			style="background:#F6F7F8;">
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
			
			<view class="shopcoupon" v-for="(item, index) in coupons" :key="index" :data-index="index" :data-number="item.number" :data-btn="item.btn" style="margin:15px 0;" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend">
				<graceCoupons :coupon="item"></graceCoupons>
				<view class="btngroup" v-show="item.isshowbtn">
					<button type="default" class="btngroup-btn" size="" @click="upone($event,index)">向上</button>
					<button type="default" class="btngroup-btn" size="" @click="downone($event,index)">向下</button>
					<button type="default" class="btngroup-btn" size=""  @click="toupdatestatus($event,index)">开启</button>
					<button type="default" class="btngroup-btn" size=""  @click="toedite($event,index)">编辑</button>
					<button type="default" class="btngroup-btn" size=""  @click="todel($event,index)">删除</button>
				</view>
			</view>
			
			
			<!-- 遮罩组件 @closeShade="closeShade" 实现点击关闭自身，如果不需要次功能则不绑定此事件即可 -->
			<graceShade @closeShade="closeShade" ref="graceShade">
				<view class="addgoods-box grace-relative" @tap.stop="">
					<view class="tan-box-titile">优惠券</view>
					<form class="grace-form">
								<view class="grace-form-item grace-border-b">
									<text class="grace-form-label">优惠券名称</text>
									<view class="grace-form-body">
										<input type="text" class="grace-form-input" v-model="smallCoupon.title" placeholder="请输入优惠券名称" />
									</view>
								</view>
								<view class="grace-form-item grace-border-b">
									<text class="grace-form-label">使用限制</text>
									<view class="grace-form-body" style="padding:20rpx 0;">
										<radio-group name="danxuan">
											<label class="grace-check-item-v"><radio value="1" v-model="smallCoupon.surplus"></radio>新用户</label>
											<label class="grace-check-item-v"><radio value="0" v-model="smallCoupon.surplus"></radio>不限</label>
										</radio-group>
									</view>
								</view>
								<view class="grace-form-item grace-border-b">
									<text class="grace-form-label">优惠券类型</text>
									<view class="grace-form-body" style="padding:20rpx 0;">
										<radio-group name="danxuan">
											<label class="grace-check-item-v"><radio value="1" v-model="smallCoupon.coupType"></radio>满减券</label>
											<label class="grace-check-item-v"><radio value="0" v-model="smallCoupon.coupType"></radio>折扣券</label>
										</radio-group>
									</view>
								</view>
								<view class="grace-form-item grace-border-b">
									<text class="grace-form-label">每人限领</text>
									<view class="grace-form-body">
										<input type="number" class="grace-form-input" v-model="smallCoupon.limits" placeholder="每人限领" />
									</view>
								</view>
								<view class="grace-form-item grace-border-b">
									<text class="grace-form-label">投放数量</text>
									<view class="grace-form-body">
										<input type="number" class="grace-form-input" v-model="smallCoupon.total" placeholder="请输入投放数量" />
									</view>
								</view>
								<view class="grace-form-item grace-border-b">
									<text class="grace-form-label">最低消费</text>
									<view class="grace-form-body">
										<input type="number" class="grace-form-input" v-model="smallCoupon.min" placeholder="请输入最低消费" />
									</view>
								</view>
								<view class="grace-form-item grace-border-b">
									<text class="grace-form-label">优惠金额</text>
									<view class="grace-form-body">
										<input type="number" class="grace-form-input" v-model="smallCoupon.discount" placeholder="请输优惠金额" />
									</view>
								</view>
								<view class="grace-form-item grace-border-b">
									<text class="grace-form-label">使用分类</text>
									<view class="grace-form-body">
										<picker class="grace-form-picker" @change="bindPickerChange" :value="genderIndex" :range="gender" name="gender">
											<text class="grace-text">{{gender[genderIndex]}}</text>
											<text class="grace-icons icon-arrow-down" style="margin-left:5px;"></text>
										</picker>
									</view>
								</view>
								<view class="grace-form-item grace-border-b">
									<text class="grace-form-label">开始日期</text>
									<view class="grace-form-body">
										<graceDateTime @confirm="confirm1" :value="smallCoupon.startTime" @change="chang1">
											<text class="demo grace-border-radius">{{smallCoupon.startTime}}<text class="grace-icons icon-date icon-left-margin"></text></text>
										</graceDateTime>
									</view>
								</view>
								<view class="grace-form-item grace-border-b">
									<text class="grace-form-label">结束日期</text>
									<view class="grace-form-body">
										<!-- <graceDateTime @confirm="confirm2" :value="demo2Val" @change="chang1">
											<text class="demo grace-border-radius">{{demo2Val}}<text class="grace-icons icon-date icon-left-margin"></text></text>
										</graceDateTime> -->
										<graceDateTime @confirm="confirm2" :value="smallCoupon.endTime" @change="chang1">
											<text class="demo grace-border-radius">{{smallCoupon.endTime}}<text class="grace-icons icon-date icon-left-margin"></text></text>
										</graceDateTime>
									</view>
								</view>
														
								<view class="grace-form-item">
									<text class="grace-form-label">详情</text>
									<view class="grace-form-body" style="padding:20rpx 0;">
										<textarea class="grace-textarea" value="" placeholder="详情" v-model="smallCoupon.description"/>
									</view>
								</view>
							</form>
					<view class="skufooter">
						<button class="btn grace-bg-light-blue"  @tap.stop="closeShade">关闭</button>
						<button class="btn grace-bg-light-blue" @tap="save">保存</button>
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
			coupons: [
				{
					color : '#9F6DFA', ltBg : "#FFFFFF", height : '180rpx',
					unit:"￥", number:5, txt:"满50元可用", title:"全场通用券", desc:"有效期至 2018-05-20",
					btn : "领取", drawed : "已抢2100张" ,"isshowbtn":false
				},
				{
					color : '#FF3456', ltBg : "#FFFFFF", height : '180rpx',
					unit:"￥", number:10, txt:"满50元可用", title:"电器专场用券", desc:"有效期至 2018-05-28",
					btn : "已领取", drawed : "已抢2800张" ,"isshowbtn":false
				},
				{
					color : '#FF8830', ltBg : "#FFFFFF", height : '180rpx',
					unit:"￥", number:100, txt:"满500元可用", title:"服饰专场用券", desc:"有效期至 2018-05-28",
					btn : "领券","isshowbtn":false
				}
			],
			
			/* 移动所需参数 */
			startX: 0,
			startY: 0,
			endX: 0,
			endY: 0,
			status: false,
			isshowbtn:false,
			gender : ['选择使用对象', '男', '女'],
			genderIndex : 0,
			
			smallCoupon:{
				title:'',
				coupType:1,//0折扣卷 1 满减卷
				description:'',//详细描述
				total:50,//头发量
				freezeStore:0,//已使用量
				surplus:0,//0 不限用户 1新用户
				limits:1,//没人限领
				min:0,//最低消费金额
				discount:0,//优惠金额
				status:1,//0停用 1使用
				categoryId:null,//分类可用
				validateType:1,//有效期类型（0 领取后开始有效天数，1设置自定义有效期范围）
				startTime:"请选择开始日期",//有效开始日期
				endTime:"请选择结束日期",//有效结束日期
				
			}
			
		}
	},
	onLoad : function () {
		
	},
	components:{
		gracePage, graceSelectMenu,graceCoupons,graceShade,graceDateTime
	},
	methods:{
		
		//保存优惠卷
		save(){
			var that = this;
			that.$api.request('shopkeeper/shopCoupon','saveCoupon',that.smallCoupon,failres => {
				that.$api.msg(failres.msg)
			}).then(res => {
				that.$api.msg('保存成功');
				// that.closeShade();
				that.smallCoupon = res.smallCoupon;
				// that.getAdsList(that.queryData);
			});
		},
		
		goback : function () { uni.navigateBack({}); },
		showMenu1  : function () {this.show1 = true;},
		closeMenu1 : function () {this.show1 = false;},
		select1    : function (index) {
			console.log("选择了 " + this.selectMenu1[index]);
		},
		showMenu2  : function () {this.show2 = true;},
		closeMenu2 : function () {this.show2 = false;},
		select2    : function (index) {
			console.log("选择了 " + this.selectMenu2[index]);
			// 如何对应获取后端 api 的值
			console.log(this.selectMenu2FromApi[index]);
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
						this.coupons[index].isshowbtn=false;
					} else if (X < 0 && Math.abs(X) > Math.abs(Y)) {
						//向左
						this.isshowbtn = true;
						var index = e.currentTarget.dataset.index;
						this.coupons[index].isshowbtn=true;
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
				var temp = this.coupons[index];
				temp.isshowbtn=false;
				this.coupons[index]=this.coupons[index-1];
				this.coupons[index].isshowbtn	 = false;
				this.coupons[index-1]=temp;
			},
			//往下移动
			downone(event,index){
				event.stopPropagation();
				console.log("index==="+index)
				if(index==this.coupons.length-1){
					return;
				}
				var temp = this.coupons[index];
				temp.isshowbtn=false;
				this.coupons[index]=this.coupons[index+1];
				this.coupons[index].isshowbtn = false;
				this.coupons[index+1]=temp;
			},
			//去编辑
			toedite(event,index){
				event.stopPropagation();
				
			},
			//去开启或者关闭
			toupdatestatus(event,index){
				event.stopPropagation();
				
			},
			//去删除
			todel(event,index){
				event.stopPropagation();
				
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
				this.smallCoupon.startTime = res[0]+'-'+res[1]+'-'+res[2]+' '+res[3]+':'+res[4]+':'+res[5];
			},
			confirm2:function (res) {
				this.smallCoupon.endTime = res[0]+'-'+res[1]+'-'+res[2]+' '+res[3]+':'+res[4]+':'+res[5];
			}
	}
}
</script>
<style>
	.myhearder{
		display: flex;
		padding: 0.5rem;
		justify-content:space-between;
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
}
.btngroup{
	position: absolute;
	top: -13px;
	right: 0;
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
	margin-top: 2rem;
}
.skufooter .btn{
		width: 80%;
		flex: 1;
		background: #white !important;
	}
.skufooter .btn{
		width: 80%;
		flex: 1;
		background: #white !important;
	}
.grace-coupons .left{
	height: 12rem !important;
	border-bottom: 1px solid lightgray;
}
</style>
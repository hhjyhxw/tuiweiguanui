<template>
	<gracePage :customHeader="false">
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
		</view>
	</gracePage>
</template>
<script>
import gracePage from "../../graceUI/components/gracePage.vue";
import graceSelectMenu from "../../graceUI/components/graceSelectMenu.vue";
import graceCoupons from "../../graceUI/components/graceShopCoupons.vue";
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
		}
	},
	onLoad : function () {
		
	},
	components:{
		gracePage, graceSelectMenu,graceCoupons
	},
	methods:{
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
	}
}
</script>
<style>
.graceSelectMenuItem{width:200rpx; line-height:90rpx;}

.shopcoupon{
	position: relative;
}
.btngroup{
	position: absolute;
	top: 0;
	right: 0;
}
.btngroup-btn{
	    width: 3.5rem;
	    height: 1.5rem;
	    text-align: center;
	    line-height: 1.5rem;
	    font-size: 12px;
}
</style>
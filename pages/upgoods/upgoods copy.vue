<template>
	<gracePage :customHeader="false">
		<!-- 页面主体 -->
		<view slot="gBody">
			<view class="grace-nowrap grace-fixed-top grace-flex-vcenter grace-bg-white">
				<!-- 名称排序 -->
				<view class="graceSelectMenuItem">
					<graceSelectMenu :show="show1" :items="selectMenu1" @showMenu="showMenu1" 
					@close="closeMenu1" @select="select1" :height="500" :selectIndex="selectVal1"></graceSelectMenu>
				</view>
				<!-- 价格排序 -->
				<view class="graceSelectMenuItem">
					<graceSelectMenu 
					:show="show2" :height="500" :items="selectMenu2" :selectIndex="selectVal2" 
					@showMenu="showMenu2" @close="closeMenu2" @select="select2"></graceSelectMenu>
				</view>
				<!-- 分类排序 -->
				<view class="graceSelectMenuItem grace-nowrap grace-flex-center grace-flex-vcenter">
					<graceSelectMenu
					:show="show3" :height="500" :items="selectMenu3" :selectIndex="selectVal3" 
					@showMenu="showMenu3" @close="closeMenu3" @select="select3"></graceSelectMenu>
				</view>
			<!-- 	<view class="graceSelectMenuItem grace-nowrap grace-flex-center grace-flex-vcenter" @tap="openFilter">
					<text style="font-size:26rpx;">条件筛选</text>
					<text class="grace-icons icon-filter" style="font-size:26rpx; margin:5rpx 0 0 5rpx;"></text>
				</view> -->
			</view>
			<!-- 这个 view 是用于占位的 避免吸顶元素遮住下面的内容 -->
			<view style="height:100rpx;"></view>
			<!-- 页面数据展示 -->
			<view class="grace-text-center">
				<view class="">
					<graceSwipeList :msgs="msgs" @itemTap="itemTap" @btnTap="btnTap"></graceSwipeList>
				</view>
			</view>
			
			
			<!-- 遮罩组件 @closeShade="closeShade" 实现点击关闭自身，如果不需要次功能则不绑定此事件即可 -->
			<graceShade @closeShade="closeShade" ref="graceShade">
				<view class="addgoods-box grace-relative" @tap.stop="">
					<!-- 图片选择  -->
					<view class="goods-imgbox">
						<button class="goods-imgbox-icon" v-if="spu.img==''" @tap="chooseImg()">+添加图片</button>
						<image class="goods-msg-in" :src="spu.img" @tap="chooseImg()"/>
					</view>
					<view class="goods-title">
						<input value="" placeholder="商品名称" style="text-align: center;"/>
					</view>
					<view class="goods-tab">
						<view class="uni-list-cell-db">
							<picker @change="bindPickerChange" :value="index" :range="category">
								<view class="uni-input">{{category[index].title}}</view>
							</picker>
						</view>
						<view class="unite">
							<input type="number" placeholder="请输入计量单位(份)"/>
						</view>
					</view>
					<view class="skulist">
						<view class="skuitem">
							<text class="skucell">规格名称</text>
							<text class="skucell">单位</text>
							<text class="skucell">原价</text>
							<text class="skucell">团购价</text>
							<text class="skucell">库存</text>
							<text class="skucell">+</text>
						</view>
						<view class="skuitem" v-for="(item,index) in skulist" :key="index">
							<input class="skucell" :value="item.title" />
							<input class="skucell" :value="item.unit"/>
							<input class="skucell" :value="item.originalPrice"/>
							<input class="skucell" :value="item.price"/>
							<input class="skucell" :value="item.stock"/>
							<text class="skucell">-</text>
						</view>
					</view>
					<view class="release-content">
						<view>
							<textarea name="content" placeholder="请输入商品详情......" class="release-content-input" value="" v-model="spu.detail"/>
						</view>
					</view>
					<view class="skufooter">
						<button class="btn"  @tap.stop="closeShade">关闭</button>
						<button class="btn" @tap="save">保存</button>
					</view>
				</view>
			</graceShade>
		</view>
		<!-- 底部 -->
		<view slot="gFooter" style="z-index: 0;">
			<view class="footer">
				<view class="footertext">共20个商品</view>
				<button class="btn" @tap="showShade">上传商品</button>
			</view>
		</view>
	</gracePage>
</template>
<script>
import gracePage from "../../graceUI/components/gracePageUpgoods.vue";
import graceSelectMenu from "../../graceUI/components/graceSelectMenu.vue";
import graceDrawer from '../../graceUI/components/graceDrawer.vue';
import graceSelectTags from '../../graceUI/components/graceSelectTags.vue';
import graceSwipeList from "../../graceUI/components/graceSwipeListmy.vue";
import graceShade from "../../graceUI/components/graceShade.vue";
import uniSection from '@/components/uni-section/uni-section.vue';
import uniGrid from '@/components/uni-grid/uni-grid.vue';
import uniGridItem from '@/components/uni-grid-item/uni-grid-item.vue';
import uniBadge from '@/components/uni-badge/uni-badge.vue';

var systemInfo = require('../../graceUI/jsTools/systemInfo.js');

export default {
	data(){
		return {
			// 第1个菜单
			selectVal1 : 0,
			show1 : false,
			selectMenu1 : ['综合排序', '价格排序', '评价排序', '人气排序'],
			// 第2个菜单
			selectVal2 : 0,
			show2 : false,
			selectMenu2 : ['不限价格', '100 - 1000', '1000 - 10000', '10000 +'],
			// 第3个菜单
			selectVal3 : 0,
			show3 : false,
			selectMenu3 : ['商品分类', '黑色', '蓝色', '红色'],
			
			// 侧边抽屉
			filterHeight : 300,
			scrollHeight : 300,
			showFilter : false,
			filterVal1 : 0, // 用于保存选中值、参与表单提交
			filterItems1: [
				{ name: '条件1', value: '0', checked: true },
				{ name: '条件2', value: '1', checked: false },
				{ name: '条件3', value: '2', checked: false },
				{ name: '条件4', value: '3', checked: false },
				{ name: '条件5', value: '4', checked: false },
				{ name: '条件6', value: '5', checked: false }
			],
			msgs : [],//
			goodsimg:'',
			category:[{id:1,title:'蔬菜'},{id:2,title:'水果'}],
			index: 0,
			spu:{
				title:'新鲜蔬菜',
				img:'',
				detail:''
			},
			skulist:[{id:1,title:'番茄',unit:'克',originalPrice:25,price:20,stock:20}]	
			
			// 上传按钮名称
		}
	},
	onShow() {
		this.init();	
	},
	onLoad : function () {
		var system = systemInfo.info();
		this.filterHeight = system.windowHeight;
		this.scrollHeight = system.windowHeight - 80;
	},
	components:{
		gracePage, graceSelectMenu, graceDrawer, graceSelectTags,graceSwipeList,graceShade,
		uniSection,
		uniGrid,
		uniGridItem,
		uniBadge
	},
	methods:{
		init(){
			//获取商品列表数据
			this.getSpuList();
		},
		//获取店铺信息
		getSpuList(){
			var that = this;
			that.$api.request('shopkeeper/shopgoods', 'goodsSpuList',{},failres => {
				that.$api.msg(failres.msg)
			}).then(res => {
				if (res.list!=null && res.list.length>0) {
					var newData = [];
					// 遍历数据 转换对象格式
					res.list.forEach((item)=>{
						item.img    = item.img;
						item.msgnumber      = item.id;
						item.title      = item.title;
						item.price      = "现价：¥ "+item.price;
						item.originalPrice  = "原价：¥ "+item.originalPrice;
						newData.push(item);
					})
					// 转换后将数据赋值到组件
					this.msgs = newData;
				}else{
					that.msgs=[];
				}
			});
		},
		// 下拉选择
		showMenu1  : function () {this.show1 = true;},
		closeMenu1 : function () {this.show1 = false;},
		select1    : function (index) {
			console.log("选择了 " + this.selectMenu1[index]);
		},
		showMenu2  : function () {this.show2 = true;},
		closeMenu2 : function () {this.show2 = false;},
		select2    : function (index) {
			console.log("选择了 " + this.selectMenu2[index]);
		},
		showMenu3  : function () {this.show3 = true;},
		closeMenu3 : function () {this.show3 = false;},
		select3    : function (index) {
			console.log("选择了 " + this.selectMenu3[index]);
		},
		// 条件筛选
		openFilter : function () {
			this.showFilter = true;
		},
		closeFilter : function () {
			this.showFilter = false;
		},
		// 可选标签事件
		filterChange1 : function (val) {
			this.filterVal1 = val;
		},
		filterSubmit : function () {
			// 收集相关数据,如:
			console.log(this.filterVal1);
			// 关闭筛选
			this.showFilter = false;
		},
		filterReset : function () {
			// 将筛选的值恢复初始即可，如:
			//this.*** = ***;
			this.$refs.graceSelectTags1.graceSelectChange(0);
		},
		
		btnTap : function(index, btnIndex){
			console.log(index, btnIndex);
			// 第一个按钮被点击 [ 标记已读 ]
			if(btnIndex == 0){
				uni.showModal({
					title:"确定要删除吗?",
					success: (e) => {
						if(e.confirm){this.msgs.splice(index, 0);}
					}
				});
			}
		},
		// 列表本身被点击
		itemTap : function (e) {
			console.log(e);
			uni.showToast({title:"索引"+e});
		},
		/* 弹窗相关start */
		showShade : function () {
			this.$refs.graceShade.showIt();
		},
		closeShade : function () {
			this.$refs.graceShade.hideIt();
		},
		/* 弹窗相关end */
		
		/* 选择图片 */
		chooseImg() { //选择图片
			const that = this
			that.$api.uploadImg((res => {
				that.spu.img = res;
			}))
		},
		 bindPickerChange: function(e) {
			console.log('picker发送选择改变，携带值为', e.target.value)
			this.index = e.target.value
		},
	}
}
</script>
<style>
.grace-bg-white{
	background: white !important;
}
/* #ifdef H5 */
.grace-fixed-top{
	top:44px;
	display:flex;
	justify-content:center;
}
/* #endif */
.graceSelectMenuItem{width:187rpx; line-height:90rpx;}

.grace-filter-buttons{position:absolute; z-index:9999; width:680rpx; left:0; bottom:0; height:50px; box-sizing:border-box;}
.grace-filter-button{width:600rpx; height:50px; line-height:50px; text-align:center; font-size:28rpx; display:block;}
.footer{
	display: flex;justify-content: space-around;
    text-align: center;
    align-items: center;
    border-top: 1px solid;
	background: white !important;
}
.grace-page-footer{
	z-index: 0 !important;
}
.footer .footertext{
	flex: 1;
}
.footer .btn{
	width: 100%;
	flex: 1;
	background: #white !important;
}

.grace-shade{
	background: rgba(0, 0, 0, 0.5) !important;
	/* width: 85% !important; */
}
.addgoods-box{
    z-index: 2;
    background: white !important;
	width: 25.8rem;
	height: 43.2rem;
	margin-top: 2.8rem;
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
.goods-title{
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 1rem;
	background-color: white;
	padding-top: 0px;
}
.goods-tab{
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0.5rem;
	background-color: white;
	border-top:1px solid lightgrey;
	border-bottom:1px solid lightgrey;
	text-align: center;
	
}
.uni-list-cell-db{
	flex: 1;
}
.unite{
	flex: 1;
}
.grace-add-list-items-my {
    width: 100% !important; 
    height: 243px !important; 
    overflow: hidden;
    margin-bottom: 5px !important; 
    margin-right: 0px !important; 
    background: #F6F7F8;
    font-size: 0;
    position: relative;
    border-radius: 5px;
}
.close-btn{width:80rpx; height:80rpx; line-height:80rpx; text-align:center; font-size:40rpx; z-index:7;}

.skulist{
	display: flex;
	flex-direction: column;
	padding: 0 	25px;
	font-size: 12px;
}
.skuitem{
	    display: flex;
	    -webkit-box-orient: vertical;
	    -webkit-box-direction: normal;
	    -webkit-flex-direction: column;
	    flex-direction: row;
	    -webkit-justify-content: space-around;
	    justify-content: center;
		width: 100%;

}
.skucell{
	flex: 1;
	text-align: center;
	border: 1px solid lightgray;
	height: 2rem;
	line-height: 2rem;
}

.release-content{
	padding: 10px 25px;
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
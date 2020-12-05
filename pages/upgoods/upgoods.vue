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
						<button class="goods-imgbox-icon grace-bg-light-blue" v-if="spu.img==''" @tap="chooseImg()">+添加图片</button>
						<image class="goods-msg-in" :src="spu.img" @tap="chooseImg()"/>
					</view>
					<view class="goods-title">
						<input  placeholder="商品名称" style="text-align: center;" v-model="spu.title"/>
					</view>
					<view class="goods-tab">
						<view class="uni-list-cell-db">
							<picker @change="bindPickerChange" :value="categoryIndex" :range="categoryTitle">
								<view class="uni-input">{{categoryTitle[categoryIndex]}}</view>
							</picker>
						</view>
						<view class="unite">
							<input type="number" v-model="spu.unit"  placeholder="请输入计量单位(份)"/>
						</view>
					</view>
					<view class="skulist">
						<view class="skuitem">
							<text class="skucell">规格名称</text>
							<text class="skucell">单位</text>
							<text class="skucell">原价</text>
							<text class="skucell">团购价</text>
							<text class="skucell">库存</text>
							<text class="skucell">剩余库存</text>
							<text class="skucell" @click="addSkuItem">+</text>
						</view>
						<view class="skuitem" v-for="(item,index) in skulist" :key="index" >
							<input class="skucell" v-model="item.title" />
							<input class="skucell" v-model="item.unit"/>
							<input class="skucell" v-model="item.originalPrice"/>
							<input class="skucell" v-model="item.price"/>
							<input class="skucell" v-model="item.stock"/>
							<input  class="skucell" v-model="item.remainStock" disabled="true"/>
							<text class="skucell" @click="deletSku(index)">-</text>
						</view>
					</view>
					<view class="release-content">
						 <view class="uni-common-mt" style="background:#FFF; padding:20rpx;">
							<rich-text :nodes="spu.detail"></rich-text>
						</view>
						<!-- <view>
							<textarea name="content" placeholder="请输入商品详情......" class="release-content-input" value="" v-model="spu.detail"/>
						</view> -->
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
				<button class="btn" @tap="addSpu">上传商品</button>
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
// 模拟个 api 请求的数据

export default {
	data(){
		return {
			// 第1个菜单
			selectVal1 : 0,
			show1 : false,
			selectMenu1 : ['综合排序', '价格降序', '价格升序', '人气排序'],
			// 第2个菜单
			selectVal2 : 0,
			show2 : false,
			selectMenu2 : ['不限价格', '0-100','100-1000', '1000-10000', '10000+'],
			// 第3个菜单
			selectVal3 : 0,
			show3 : false,
			selectMenu3 : [],//分类列表
			
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
			
			categoryIndex:0,
			categoryTitle:[],
			categoryList:[],
			index: 0,
			spu:{
				title:'',
				img:'',
				detail:'',
				unit:'',
				categoryId:null,
				price:0,
				originalPrice:0
			},
			skulist:[],
			
			queryData:{
				sidx:"",//排序字段
				order:"",//asc desc
				categoryTitle:"",//商品分类名称
				miniPrice:null,//最新商品价格
				maxPrice:null//最新商品价格
			},
		}
	},
	onShow() {
		this.init();	
	},
	onLoad : function () {
		var system = systemInfo.info();
		this.filterHeight = system.windowHeight;
		this.scrollHeight = system.windowHeight - 80;
		
		// 模拟 api 请求，因为请求数据里没有按钮信息我们利用js进行按钮补充
		// setTimeout(() => {
		// 	for(let i = 0; i < msgsFromApi.length; i++){
		// 		// 具体几个按钮及按钮文本根据项目需求来，格式 {name:按钮文本, bgColor:按钮背景色}
		// 		msgsFromApi[i].btns = [{'name':'删除', bgColor:'#FF0036'}];
		// 	}
		// 	this.msgs = msgsFromApi;
		// }, 500);
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
			this.getSpuList(this.queryData);//获取商品列表数据
			this.getCategoryList();//商品分类列表
		},
		//获取店铺信息
		getSpuList(data){
			var that = this;
			that.$api.request('shopkeeper/shopgoods', 'goodsSpuList',data,failres => {
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
						item.btns = [{'name':'编辑', bgColor:'#333333'},{'name':'删除', bgColor:'#FF0036'}];
						newData.push(item);
					})
					// 转换后将数据赋值到组件
					this.msgs = newData;
				}else{
					that.msgs=[];
				}
			});
		},
		//获取店铺分类列表信息
		getCategoryList(){
			var that = this;
			that.$api.requestGet('shopkeeper/shopCategory', 'getGategoryList',null,failres => {
				that.$api.msg(failres.msg)
			}).then(res => {
				if (res.list!=null && res.list.length>0) {
					that.categoryList = res.list;
					var newData = [];
					var newData1 = [];
					// 遍历数据 转换对象格式
					newData.push('全部');
					res.list.forEach((item)=>{
						newData.push(item.title);
						newData1.push(item.title);
					})
					// 转换后将数据赋值到组件
					that.selectMenu3 = newData;
					that.categoryTitle = newData1;
					that.categoryTitle.splice(0,1);
					
				}else{
					that.selectMenu3=[];
					that.categoryTitle = [];
				}
			});
		},
		// 下拉选择
		showMenu1  : function () {this.show1 = true;},
		closeMenu1 : function () {this.show1 = false;},
		select1    : function (index) {
			if(index==1){//价格降序
				this.queryData.sidx="price";
				this.queryData.order="desc";
			}else if(index==2){//价格升序
				this.queryData.sidx="price";
				this.queryData.order="asc";
			}
			this.getSpuList(this.queryData);
			//console.log("选择了 " + this.selectMenu1[index]);
		},
		showMenu2  : function () {this.show2 = true;},
		closeMenu2 : function () {this.show2 = false;},
		select2    : function (index) {
			if(index==0){//不限价格
				this.queryData.miniPrice="";
				this.queryData.maxPrice=""
			}else if(index==this.selectMenu2.length-1){
				this.queryData.miniPrice=this.selectMenu2[index].split("+")[0];
				this.queryData.maxPrice=""
			}else{
				let pricearry = this.selectMenu2[index].split("-");
				this.queryData.miniPrice=pricearry[0];
				this.queryData.maxPrice=pricearry[1];
			}
			this.getSpuList(this.queryData);
			//console.log("选择了 " + this.selectMenu2[index]);
		},
		showMenu3  : function () {this.show3 = true;},
		closeMenu3 : function () {this.show3 = false;},
		select3    : function (index) {
			if(index==0){
				this.queryData.categoryTitle="";
			}else{
				this.queryData.categoryTitle=this.selectMenu3[index];
			}
			this.getSpuList(this.queryData);
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
		
		//删除商品
		btnTap : function(index, btnIndex){
			console.log(index, btnIndex);
			// 第一个按钮被点击 [ 标记已读 ]
			var that = this;
			if(btnIndex == 1){
				uni.showModal({
					title:"确定要删除吗?",
					success: (e) => {
						if(e.confirm){
							var id = that.msgs[index].msgnumber;
							that.$api.requestGet('shopkeeper/shopgoods', 'delSpu',{id:id},failres => {
								that.$api.msg(failres.msg)
							}).then(res => {
								that.msgs.splice(index,1);
							});
						}
					}
				});
			}else{
				var that = this;
				var id = that.msgs[index].msgnumber;
				that.$api.requestGet('shopkeeper/shopgoods', 'spuInfo',{id:id},failres => {
					that.$api.msg(failres.msg)
				}).then(res => {
					that.spu =res.smallSpu;
					that.skulist = res.smallSpu.skulist;
					if(that.skulist!=null && that.skulist.length>0){
						that.skulist.forEach(p=>{
							let freezeStock = p.freezeStock;
							freezeStock = freezeStock!=null?freezeStock:0;
							p.remainStock = p.stock -freezeStock;
						})
					}
					//编辑商品的时候设置 商品分类名称
					if(that.categoryList!=null && that.categoryList.length>0){
						for (var i = 0; i < that.categoryList.length; i++) {
							if(that.categoryList[i].id==that.spu.categoryId){
								that.categoryIndex = i;
							}
						}
					}
					
				});
				this.showShade();
			}
		},
		// 商品项列表本身被点击
		itemTap : function (e) {
			// console.log(e);
			// uni.showToast({title:"索引"+e});
		},
		//上传商品
		addSpu(){
			this.spu = {
				title:'',
				img:'',
				detail:'',
				unit:'',
				categoryId:null,
				price:0,
				originalPrice:0
			},
			this.skulist=[],
			this.showShade();
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
		//编辑商品 选择分类
		 bindPickerChange: function(e) {
			//console.log('picker发送选择改变，携带值为', JSON.stringify(e.target.value))
			this.categoryIndex = e.target.value;
			//this.spu.categoryId = this.categoryTitle[this.categoryIndex].id;
		},
		//添加商品sku
		addSkuItem(){
			let item = {
				id:null,
				title:'',
				unit:'',
				originalPrice:null,
				price:null,
				stock:20,
				remainStock:0
			}
			if(this.skulist!=null && this.skulist.length>3){
				return;
			}
			this.skulist.push(item);
			//skulist:[{id:1,title:'番茄',unit:'克',originalPrice:25,price:20,stock:20}],
		},
		//保存商品级子商品
		save(){
			var that = this;
			if(that.spu.title==null || that.spu.title==''){
				that.$api.msg('商品名称不能为空')
				return;
			}
			if(that.spu.img==null || that.spu.img==''){
				that.$api.msg('商品图片不能为空')
				return;
			}
			if(that.skulist==null || that.skulist.length==0){
				that.$api.msg('请添加商品规格')
				return;
			}
			that.skulist.forEach(p=>{
				if(p.title==null || p.title==''){
					that.$api.msg('规格名称不能为空')
					return;
				}
				if(p.price==null || p.price==''){
					that.$api.msg('规格现价不能为空')
					return;
				}
				if(p.originalPrice==null || p.originalPrice==''){
					that.$api.msg('规格原价不能为空')
					return;
				}
				if(p.stock==null || p.stock=='' || p.stock<p.remainStock){
					that.$api.msg('规格库存不能为空，并且不能小于剩余库存')
					return;
				}
			});
			that.spu.price = that.skulist[0].price;
			that.spu.originalPrice = that.skulist[0].originalPrice;
			that.spu.skulist = that.skulist;
			that.spu.categoryId = that.categoryList[that.categoryIndex].id;
			console.log("spu==="+JSON.stringify(that.spu));
			that.$api.request('shopkeeper/shopgoods', 'saveSpu',that.spu,failres => {
				that.$api.msg(failres.msg)
			}).then(res => {
				that.spu = res.smallSpu;
				that.skulist = res.smallSpu.skulist;
				that.$api.msg("保存成功")
			});
			
		},
		//删除商品sku
		deletSku(index){
			var that = this;
			var item = that.skulist[index];
			if(item.id!=null){
				that.$api.requestGet('shopkeeper/shopgoods', 'delSku',{id:item.id},failres => {
					that.$api.msg(failres.msg)
				}).then(res => {
					that.skulist.splice(index,1);
				});
			}else{
				that.skulist.splice(index,1);
			}
		}
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
.graceSelectMenuItem{width:245rpx !important; line-height:90rpx;}

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
	border-right: 1px solid;
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
	overflow: hidden;
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
	 bottom: 4.2rem;
	right: 0;
	left: 0;
	
	
}
.skufooter .btn{
		width: 80%;
		flex: 1;
		background: #white !important;
	}

</style>
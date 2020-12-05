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
				<!-- 分类排序 -->
				<!-- <view class="graceSelectMenuItem grace-nowrap grace-flex-center grace-flex-vcenter">
					<graceSelectMenu
					:show="show4" :height="500" :items="selectMenu4" :selectIndex="selectVal4" 
					@showMenu="showMenu4" @close="closeMenu4" @select="select4"></graceSelectMenu>
				</view> -->
			</view>
			<!-- 这个 view 是用于占位的 避免吸顶元素遮住下面的内容 -->
			<view style="height:100rpx;"></view>
			<!-- 页面数据展示 -->
			<view class="grace-text-center">
				<view class="">
					 <view class="uni-list">
						<checkbox-group @change="checkboxChange">
							<label class="uni-list-cell uni-list-cell-pd groupGoodslist" v-for="(item,index) in groupGoodsList" :key="index">
								<!-- <view>
									<checkbox  :checked="item.checked" />
								</view> -->
								<view><image :src="item.img" class="groupgoods-img"></image></view>
								<view class="groupgoods-info">
									<view class="groupgoods-title">【{{item.title}}】</view>
									<view class="groupgoods-price">团购价:￥{{item.price}}</view>
									<view class="groupgoods-originalPrice">原价:￥{{item.originalPrice}}</view>
								</view>
								<view v-show="item.upstatus==0" @click="addGroupGoods(item,index)"><button type="default" class="grace-button grace-bg-red" size="mini">去发布</button></view>
								<view v-show="item.upstatus==1" @click="addGroupGoods(item,index)"><button type="default" class="grace-button" size="mini">已发布</button></view>
							</label>
						</checkbox-group>
					</view>
				</view>
			</view>
			
			<!-- 遮罩组件 @closeShade="closeShade" 实现点击关闭自身，如果不需要次功能则不绑定此事件即可 -->
			<graceShade @closeShade="closeShade" ref="graceShade">
				<view class="addgoods-box grace-relative" @tap.stop="">
					<!-- 图片选择  -->
					<view class="goods-imgbox">
						<image class="goods-msg-in" :src="smallGroupShop.img"/>
					</view>
					<view class="goods-title">
						<text style="text-align: left;">{{smallGroupShop.title}}</text>
					</view>
					<view class="goods-tab">
						<view class="unite">
							<text class="doller">团购价¥：</text><input type="text" style="color: red;" v-model="smallGroupShop.minPrice"  placeholder="团购价"/>
						</view>
					</view>
					<view class="goods-tab">
						<view class="unite">
							<text class="doller">原价¥：</text><input type="text"  style="color: black;" v-model="smallGroupShop.maxPrice"  placeholder="单买价"/>
						</view>
					</view>
					<view class="goods-tab">
						<view class="unite">
							<text class="doller">库存：</text><input type="text"  style="color: black;" v-model="smallGroupShop.maxPrice"  placeholder="单买价"/>
						</view>
					</view>
					<view class="skufooter">
						<button class="btn grace-bg-light-blue"  @tap.stop="closeShade">关闭</button>
						<button class="btn grace-bg-light-blue" @tap="save">保存</button>
					</view>
				</view>
			</graceShade>
		</view>
		<!-- 底部 -->
		<!-- <view slot="gFooter" style="z-index: 0;">
			<view class="footer">
				<button class="btn" @click="selectChexkbox">全选</button>
				<button class="btn" @click="updateStatusBatch(0)">下架</button>
				<button class="btn" @click="updateStatusBatch(1)">上架</button>
				<button class="btn" @tap="showShade">发布</button>
			</view>
		</view> -->
	</gracePage>
</template>
<script>
import gracePage from "../../graceUI/components/gracePageUpgoods.vue";
import graceSelectMenu from "../../graceUI/components/graceSelectMenu.vue";
import graceDrawer from '../../graceUI/components/graceDrawer.vue';
import graceSelectTags from '../../graceUI/components/graceSelectTags.vue';
import graceSwipeList from "../../graceUI/components/graceSwipeListmy.vue";
import graceShade from "../../graceUI/components/graceShade.vue";

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
			selectMenu3 : ['商品类型', '自营商品', '公共商品'],
			selectVal4 : 0,
			// show4 : false,
			// selectMenu4 : ['已上架', '为上架'],
			
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
			groupGoodsList:[],
			smallGroupShop:{
				img:'',
				minPrice:'',
				maxPrice:'',
				title:'',
				commonFlag:'',
				skuId:null,
				spuId:null,
				status:1,
				
			},
			// 上传按钮名称
			queryData:{
				sidx:"",//排序字段
				order:"",//asc desc
				categoryTitle:"",//商品分类名称
				miniPrice:null,//最新商品价格
				maxPrice:null,//最新商品价格
				commonFlag:'全部',//1公共商品 0自营商品
				page:1,		//页码
				limit:200, //每页显示记录数
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
		
	},
	components:{
		gracePage, graceSelectMenu, graceDrawer, graceSelectTags,graceSwipeList,graceShade
	},
	methods:{
		init(){
			this.listSkuForgroup(this.queryData);//获取商品列表数据
		},
		//获取sku列表，用于上架到 团购商品列表中
		listSkuForgroup(data){
			var that = this;
			that.$api.request('shopkeeper/shopgoods', 'listForgroup',data,failres => {
				// that.$api.msg(failres.msg)
			}).then(res => {
				if (res.page.list!=null && res.page.list.length>0) {
					var newData = [];
					// 遍历数据 转换对象格式
					res.page.list.forEach((item)=>{
						item.id    = item.id;
						item.title      = item.title;
						item.price      = item.price;
						item.originalPrice  = item.originalPrice;
						item.img = item.img;
						item.upstatus = item.upstatus;
						item.commonFlag = item.commonFlag;
						item.checked = false;
						newData.push(item);
					})
					// 转换后将数据赋值到组件
					that.groupGoodsList = newData;
				}else{
					that.groupGoodsList=[];
				}
			});
		},
		//商品groupSku上下架
		updateStatus(item,status,index){
			var that = this;
			var data = {
				ids:[item.id],
				status:status
			}
			that.$api.request('shopkeeper/shopgoods', 'updateSatusBatch',data,failres => {
				that.$api.msg(failres.msg)
			}).then(res => {
				that.groupGoodsList[index].status=status;
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
			this.listSkuForgroup(this.queryData);
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
			this.listSkuForgroup(this.queryData);
			//console.log("选择了 " + this.selectMenu2[index]);
		},
		showMenu3  : function () {this.show3 = true;},
		closeMenu3 : function () {this.show3 = false;},
		select3    : function (index) {
			if(index==0){
				this.queryData.commonFlag="";
			}else if(index==1){
				this.queryData.commonFlag="0";
			}else{
				this.queryData.commonFlag="1";
			}
			this.listSkuForgroup(this.queryData);
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
		//全选 或者反选
		selectChexkbox(){
			if(this.groupGoodsList!=null && this.groupGoodsList.length>0){
				var checked = this.groupGoodsList[0].checked;
				if(checked){
					checked =false;
				}else{
					checked = true;
				}
				this.groupGoodsList.forEach(p=>{
					p.checked=checked;
				});
			}
		},
		//添加团购商品
		addGroupGoods(item,index){
			// this.smallGroupShop=item;
			this.smallGroupShop.skuId = item.id;
			this.smallGroupShop.spuId = item.spuId;
			this.smallGroupShop.commonFlag = item.commonFlag;
			this.smallGroupShop.minPrice = item.price;
			this.smallGroupShop.title = item.title;
			this.smallGroupShop.img = item.img;
			this.smallGroupShop.maxPrice = item.originalPrice;

			this.showShade();
		},
		//保存团购商品
		save(){
			var that = this;
			if(that.smallGroupShop.minPrice==null || that.smallGroupShop.minPrice==''){
				that.$api.msg('团购价不能为空')
				return;
			}
			if(that.smallGroupShop.maxPrice==null || that.smallGroupShop.maxPrice==''){
				that.$api.msg('原价不能为空')
				return;
			}
			if(Number(that.smallGroupShop.minPrice)>Number(that.smallGroupShop.maxPrice)){
				that.$api.msg('团购价不能大于原价')
				return;
			}
			
			console.log("smallGroupShop==="+JSON.stringify(that.smallGroupShop));
			that.$api.request('shopkeeper/shopgoods', 'saveGroupgoods',that.smallGroupShop,failres => {
				that.$api.msg(failres.msg)
			}).then(res => {
				that.$api.msg("保存成功")
				that.listSkuForgroup(that.queryData);
				that.closeShade();
			});
		},
		/* 弹窗相关start */
		showShade : function () {
			this.$refs.graceShade.showIt();
		},
		closeShade : function () {
			this.$refs.graceShade.hideIt();
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
	background: rgba(0, 0, 0, 0.5) !important
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
	    font-weight: bold;
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
	    -webkit-box-flex: 1;
	    -webkit-flex: 1;
	    flex: 1;
	    display: flex;
	    justify-content: space-around;
		position: relative;
}
.doller{
	    display: -webkit-box;
	    display: -webkit-flex;
	    display: block;
	    -webkit-box-pack: right;
	    -webkit-justify-content: right;
	    align-items: right;
	    position: absolute;
	    left: 25%;
	    top: 0.1rem;
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

.groupGoodslist{
	display: flex;
	justify-content: space-around;
	flex-direction: row;
	align-items: center;
	padding: 1rem 1.5rem;
}
.groupGoodslist .groupgoods-img{
	display: flex;
	width: 3rem;
	height: 3rem;
}
.groupgoods-title{
	font-weight: bold;
	padding: 0.1rem
}
.groupgoods-price{
	color:red;
	padding: 0.1rem
}
.groupgoods-originalPrice{
	padding: 0.1rem
}
.groupgoods-info{
	flex: 2;
}

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

</style>
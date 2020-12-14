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
				<view class="graceSelectMenuItem grace-nowrap grace-flex-center grace-flex-vcenter">
					<graceSelectMenu
					:show="show4" :height="500" :items="selectMenu4" :selectIndex="selectVal4" 
					@showMenu="showMenu4" @close="closeMenu4" @select="select4"></graceSelectMenu>
				</view>
			</view>
			<!-- 这个 view 是用于占位的 避免吸顶元素遮住下面的内容 -->
			<view style="height:100rpx;"></view>
			<!-- 页面数据展示 -->
			<view class="grace-text-center">
				<view class="">
					 <view class="uni-list">
						<checkbox-group @change="checkboxChange">
							<label class="uni-list-cell uni-list-cell-pd groupGoodslist" v-for="(item,index) in groupGoodsList" :key="index">
								<view>
									<checkbox :value="item.id" :checked="item.checked" />
								</view>
								<view><image :src="item.img" class="groupgoods-img"></image></view>
								<view class="groupgoods-info">
									<view class="groupgoods-title">【{{item.title}}】</view>
									<view class="groupgoods-price">团购价:￥{{item.price}}</view>
									<view class="groupgoods-originalPrice">原价:￥{{item.originalPrice}}</view>
								</view>
								<view v-show="item.status==0" @click="updateStatus(item,'1',index)"><button type="default" class="grace-button" size="mini">上架</button></view>
								<view v-show="item.status==1" @click="updateStatus(item,'0',index)"><button type="default" class="grace-button" size="mini">下架</button></view>
							</label>
						</checkbox-group>
					</view>
				</view>
			</view>
			
		</view>
		<!-- 底部 -->
		<view slot="gFooter" style="z-index: 0;">
			<view class="footer">
				<button class="btn" @click="selectChexkbox">全选</button>
				<button class="btn" @click="updateStatusBatch(0)">下架</button>
				<button class="btn" @click="updateStatusBatch(1)">上架</button>
				<button class="btn" @click="gogroupskulist">发布</button>
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

var systemInfo = require('../../graceUI/jsTools/systemInfo.js');
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
			selectMenu3 : [],
			selectVal4 : 0,
			show4 : false,
			selectMenu4 : ['全部','上架', '下架'],
			
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
			index: 0,
			
			groupGoodsList:[
				{id:1,title:'小白菜',img:'https://fudezao.oss-cn-qingdao.aliyuncs.com/statics/uper/201909/23/5d882ce3900b7.png',
			originalPrice:6,price:5,checked:true}],
			
			queryData:{
				sidx:"",//排序字段
				order:"",//asc desc
				categoryTitle:"",//商品分类名称
				miniPrice:null,//最新商品价格
				maxPrice:null,//最新商品价格
				status:'',//上架状态
			},
			selectGroupId:[],//单选选中到ID数组
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
			this.getGroupGoodsList(this.queryData);//获取商品列表数据
			this.getCategoryList();//商品分类列表
		},
		//获取上架商品信息
		getGroupGoodsList(data){
			var that = this;
			that.$api.request('shopkeeper/shopgoods', 'goodsGroupList',data,failres => {
				that.$api.msg(failres.msg)
			}).then(res => {
				if (res.list!=null && res.list.length>0) {
					var newData = [];
					// 遍历数据 转换对象格式
					res.list.forEach((item)=>{
						item.id    = item.id;
						item.title      = item.sku.title;
						item.price      = item.minPrice;
						item.originalPrice  = item.maxPrice;
						item.img = item.sku.img;
						item.status = item.status;
						item.checked = false;
						newData.push(item);
					})
					// 转换后将数据赋值到组件
					this.groupGoodsList = newData;
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
		//批量上下架
		updateStatusBatch(status){
			var ids = [];
			var indexs = [];
			var that = this;
			that.groupGoodsList.forEach(p=>{
				if(p.checked)ids.push(p.id);
			});
			if(ids.length==0){
				console.log("that.selectGroupId=="+JSON.stringify(that.selectGroupId));
				if(that.selectGroupId!=null && that.selectGroupId.length>0){
					ids = that.selectGroupId;
				}else{
					return;
				}
			}
			var data = {
				ids:ids,
				status:status
			}
			that.$api.request('shopkeeper/shopgoods', 'updateSatusBatch',data,failres => {
				that.$api.msg(failres.msg)
			}).then(res => {
				that.getGroupGoodsList();
			});
		},
		//跳转添加团购商品列
		gogroupskulist(){
			var url = '/pages/upgoods/groupskulist';
			uni.navigateTo({
				url
			})
		},
		//获取店铺分类列表信息
		getCategoryList(){
			var that = this;
			that.$api.requestGet('shopkeeper/shopCategory', 'getGategoryList',null,failres => {
				that.$api.msg(failres.msg)
			}).then(res => {
				if (res.list!=null && res.list.length>0) {
					var newData = [];
					// 遍历数据 转换对象格式
					newData.push('全部');
					res.list.forEach((item)=>{
						newData.push(item.title);
					})
					// 转换后将数据赋值到组件
					that.selectMenu3 = newData;
				}else{
					that.selectMenu3=[];
				}
			});
		},
		// 下拉选择
		showMenu1  : function () {this.show1 = true;},
		closeMenu1 : function () {this.show1 = false;},
		select1    : function (index) {
			if(index==1){//价格降序
				this.queryData.sidx="min_price";
				this.queryData.order="desc";
			}else if(index==2){//价格升序
				this.queryData.sidx="min_price";
				this.queryData.order="asc";
			}
			this.getGroupGoodsList(this.queryData);
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
			this.getGroupGoodsList(this.queryData);
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
			this.getGroupGoodsList(this.queryData);
		},
		showMenu4  : function () {this.show4 = true;},
		closeMenu4 : function () {this.show4 = false;},
		select4    : function (index) {
			if(index==0){
				this.queryData.status="";
			}else if(index==1){
				this.queryData.status='1';
			}else{
				this.queryData.status='0';
			}
			this.getGroupGoodsList(this.queryData);
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
		//单选
		checkboxChange(e){
			this.selectGroupId = e.detail.value;
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
			that.$api.uploadfile((res => {
				console.log("url=="+res)
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
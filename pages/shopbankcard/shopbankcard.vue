<template>
	<gracePage :customHeader="false">
		<view slot="gBody" class="grace-body"  >
			<!-- 表单 -->
			<view class="ls-form">
				<view class="ls-form-item">
					<view class="ls-form-label">银行名称</view>
					<view class="ls-form-input-box">
						<!-- <input class="ls-form-input" value="" placeholder="请输入支行名称"/> -->
						<picker @change="bindPickerChange" :value="index" :range="array">
							<view class="ls-form-input-box">{{array[index]}}</view>
						</picker>
						<!-- <picker @change="bindPickerChange" :value="index" :range="array">
							<view class="uni-input">{{array[index]}}</view>
						</picker> -->
					</view>
				</view>
				<view class="ls-form-item">
					<view class="ls-form-label">支行名称</view>
					<view class="ls-form-input-box"><input class="ls-form-input" value="" placeholder="请输入支行名称"/></view>
				</view>
				<view class="ls-form-item">
					<view class="ls-form-label">用户名称</view>
					<view class="ls-form-input-box"><input class="ls-form-input" value="" placeholder="请输入用户名称"/></view>
				</view>
				<view class="ls-form-item">
					<view class="ls-form-label">手机号</view>
					<view class="ls-form-input-box"><input class="ls-form-input" value="" placeholder="请输入手机号"/></view>
				</view>
				<view class="ls-form-item">
					<view class="ls-form-label">卡号</view>
					<view class="ls-form-input-box"><input class="ls-form-input" value="" placeholder="请输入卡号"/></view>
				</view>
				<view class="ls-btn-box">
					<button class="ls-btn ls-btn-blue">保存</button>
				</view>
				
			</view>
			<!-- 表单数据end -->
		</view>
	</gracePage>
</template>
<script>
import gracePage from "../../graceUI/components/gracePage.vue";
import { mapState } from 'vuex';  
	export default {
		components:{gracePage,},
		data() {
			return {
				hasdata:true,
				shopId:null,
				orderlist:[],
				queryData:{
					shopId:null,
					pageNum: 1,//商品列表 页码
					pageSize:5,
					totalPage: 0,//商品列表总页数
				},
				 title: 'picker',
				array: ['中国', '美国', '巴西', '日本'],
				index: 0,
			}
			
		},
		onShow(){
		
		},
		onLoad(option){
			console.log('option===='+JSON.stringify(option)); //打印出上个页面传递的参数。
			if(option.shopId!=null && typeof(option.shopId) != "undefined"){
				this.shopId = option.shopId;
				this.queryData.shopId = option.shopId;
			}
		},
		computed: {
			...mapState(['hasLogin','userInfo'])
		},
		methods: {
			 bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.index = e.target.value
			},
		},
		
	}
</script>

<style lang='scss'>
	page{
		background-color: #F2F2F2;
		
	}
.ls-form{
	padding:3px;
	background-color: white;
	margin-top: 10px;
	border-radius: 5px;
	padding-bottom: 10px;
}
.ls-form-item{
	display: flex;
	justify-content: space-around;
	align-items: center;
	border-bottom: 1px solid #EDEDED;
	height: 2.5rem;
	line-height: 2.8rem;	
}
.ls-form-label{
	flex: 1;
	padding-left: 15px;
}
.ls-form-input-box{
	flex: 3;
}
.ls-btn-box{
	margin-top: 5rem;
}
.ls-btn{
	font-size:30rpx; line-height:88rpx; padding:0; border-radius:6rpx;
	background:linear-gradient(to right, #00FFD5 ,#008CFF) !important; color:#FFFFFF !important;
}
.ls-btn::after{border-radius:5rpx !important; border:none;}

@import "../../graceUI/animate.css";
.grace-accordion-show{height:auto; animation:fadeIn 300ms linear;visibility:visible;padding: 1rem 0rem; }
.grace-accordion-hide{height:0; animation:fadeOut 300ms linear;visibility:hidden;padding:0;}
</style>

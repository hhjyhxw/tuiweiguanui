<template>
	<gracePage :customHeader="false">
		<!-- 页面主体 -->
		<view class="grace-body" slot="gBody">
			<view class="grace-list">
				<view class="grace-list-items" v-for="(item,index) in bankCardList" @click="toedit(item)">
					<view class="grace-list-body grace-border-b">
						<view class="grace-list-title">
							<text class="grace-list-title-text">{{item.bankName}}</text>
						</view>
						<view class="grace-list-body-desc">{{item.cardNo}}</view>
					</view>
					<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
				</view>
			</view>
		</view>
		
		<!-- 明细弹窗 start-->
		<!-- 遮罩组件 @closeShade="closeShade" 实现点击关闭自身，如果不需要次功能则不绑定此事件即可 -->
		<graceShade @closeShade="closeShade" ref="graceShade">
			<view class="demo-msg grace-relative" @tap.stop="">
				<!-- 表单 -->
				<view class="ls-form">
					<view class="ls-form-item">
						<view class="ls-form-label">银行名称</view>
						<view class="ls-form-input-box">
							<!-- <input class="ls-form-input" value="" placeholder="请输入支行名称"/> -->
							<picker @change="bindPickerChange" :value="bankIndex" :range="bankList">
								<view class="ls-form-input-box">{{bankList[bankIndex]}}</view>
							</picker>
						</view>
					</view>
					<view class="ls-form-item">
						<view class="ls-form-label">支行名称</view>
						<view class="ls-form-input-box"><input class="ls-form-input" v-model="shopBank.bankName" placeholder="请输入支行名称"/></view>
					</view>
					<view class="ls-form-item">
						<view class="ls-form-label">用户名称</view>
						<view class="ls-form-input-box"><input class="ls-form-input" v-model="shopBank.userName" placeholder="请输入用户名称"/></view>
					</view>
					<view class="ls-form-item">
						<view class="ls-form-label">手机号</view>
						<view class="ls-form-input-box"><input class="ls-form-input" v-model="shopBank.mobile" placeholder="请输入手机号"/></view>
					</view>
					<view class="ls-form-item">
						<view class="ls-form-label">卡号</view>
						<view class="ls-form-input-box"><input class="ls-form-input" v-model="shopBank.cardNo" placeholder="请输入卡号"/></view>
					</view>
					<view class="ls-form-item">
						<view class="ls-form-label">开户行编号</view>
						<view class="ls-form-input-box"><input class="ls-form-input" v-model="shopBank.bankCode" placeholder="请输入卡号"/></view>
					</view>
					<view class="ls-form-item">
						<view class="ls-form-label">卡号状态</view>
						<view class="ls-form-input-box"><text>{{statusMsg}}</text></view>
					</view>
					<view class="ls-form-item">
						<view class="ls-form-label">审核状态</view>
						<view class="ls-form-input-box"><text>{{approveFlagMsg}}</text></view>
					</view>
					<view class="ls-form-item">
						<view class="ls-form-label">审核结果</view>
						<view class="ls-form-input-box"><text>{{shopBank.msg}}</text></view>
					</view>
					<view class="ls-btn-box">
						<button class="ls-btn ls-btn-blue">保存</button>
					</view>
					
				</view>
				<!-- 表单数据end -->
				<view class="close-btn grace-icons icon-close3 grace-white grace-absolute-rt" @tap.stop="closeShade"></view>
			</view>
		</graceShade>
		<!--  明细弹窗end-->
	</gracePage>
</template>
<script>
import gracePage from "../../graceUI/components/gracePage.vue";
import graceFlex from "../../graceUI/components/graceFlex.vue";
export default {
	data() {
		return {
			bankCardList:[],
			shopBank:{
				 id:null,
				 bankName:'',
				 subBranch:'',
				 cardNo:'',
				 userName:'',
				 mobile:'',
				 status:'0',
				 bankCode:'',//银行卡开户行编号不能为空	   	  
				 approveFlag:'0',//审核状态0未审核 1提交审核 2审核通过 3审核不通过
				 msg:'',//描述
			},
			statusMsg:'',
			approveFlagMsg:'',
			
			bankList:[],
			bankIndex:0,
			
		}
	},
	onLoad:function(){},
	onShow() {
		this.getBankCardList();
		this.getBankList();
	},
	methods:{
		//店铺银行卡列表
		getBankCardList(){
			var that = this;
			that.$api.requestGet('shopkeeper/shopBank', 'bankList',{},failres => {
				that.$api.msg(failres.msg)
			}).then(res => {
				that.bankCardList = res.list;
			});
		},
		//银行列表
		getBankList(){
			var that = this;
			that.$api.requestGet('commonBank', 'bankList',{},failres => {
				that.$api.msg(failres.msg)
			}).then(res => {
				if(res.list!=null && res.list.length>0){
					var newData = [];
					res.list.forEach(p=>{
						newData.push(p.bankName);
					})
					that.bankList = newData;
				}
				
			});
		},
		//查询编辑
		toedit(item){
			var that = this;
			that.shopBank = item;
			if(item.status=='1')that.statusMsg='正常';
			else that.statusMsg='已禁用';
			
			if(item.approveFlag=='0')that.approveFlagMsg='未审核';
			else if(item.approveFlag=='1') that.approveFlagMsg='审核中';
			else if(item.approveFlag=='2') that.approveFlagMsg='审核通过';
			else if(item.approveFlag=='3') that.approveFlagMsg='审核不通过';
			else that.approveFlagMsg='未审核';
			
			if(that.bankList!=null && that.bankList.length>0){
				for (var i = 0; i < that.bankList.length; i++) {
					if(that.bankList[i].bankName==that.shopBank.bankName){
						that.bankIndex = i;
					}
				}
			}
		},
		//编辑 选择银行卡
		 bindPickerChange: function(e) {
			this.bankIndex = e.target.value;
		},
		/* 弹窗相关start */
		showShade : function () {
			this.$refs.graceShade.showIt();
		},
		closeShade : function () {
			this.$refs.graceShade.hideIt();
		},
		
		save(){
			var that = this;
			if(that.bankIndex==0){
				that.$api.msg('请选择银行');
				return;
			}
			that.shopBank.bankName = that.bankList[that.bankName].id;
			that.$api.request('shopkeeper/shopBank','saveBank',that.shopBank,failres => {
				that.$api.msg(failres.msg)
			}).then(res => {
				that.$api.msg('保存成功');
				that.shopBank = res.shopBank;
				that.getBankCardList();
				that.closeShade();
			});
		},
		//去删除
		todel(event,index){
			event.stopPropagation();
			var that = this;
			var id = that.coupons[index].id;
			that.$api.requestGet('shopkeeper/shopBank','delBank',{id,id},failres => {
				that.$api.msg(failres.msg)
			}).then(res => {
				that.bankCardList.splice(index,1);
			});
		},
		
		
		
		
	},
	components:{
		gracePage, graceFlex
	}
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

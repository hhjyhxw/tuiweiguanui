<template>
<gracePage :customHeader="false">
	<!-- 页面主体 -->
	<view slot="gBody" class="grace-body">
		<!-- 表单 -->
		<view class="ls-form grace-margin grace-margin-top">
			<view class="ls-form-item-column">
				<view class="ls-form-label">提货地址</view>
				<view class="ls-form-input-box">
					<textarea class="ls-form-textarea" v-model="shopStore.address">
						
					</textarea>
				</view>
			</view>
			<view class="ls-btn-box">
				<button class="ls-btn ls-btn-blue" @click="saveaddress()">保存</button>
			</view>
		</view>
		<!-- 表单数据end -->
	</view>
</gracePage>
</template>

<script>
	import gracePage from "../../graceUI/components/gracePage.vue";
	export default {
		components:{gracePage},
		data() {
			return {
				shop:{},
				shopStore:{
					address:''
				}
			}
		},
		onShow() {
			this.getShopinfo();	
		},
		methods: {
			//获取店铺信息
			getShopinfo(){
				var that = this;
				that.$api.requestGet('shopkeeper/shopcenter', 'shopinfo',null,failres => {
					that.$api.msg(failres.msg)
				}).then(res => {
					that.shop = res.shop;
					if(res.shopStore!=null){
						that.shopStore = res.shopStore;
					}
				});
			},
			//保存自提地址
			saveaddress(){
				var that = this;
				if(that.shopStore.address==null || that.shopStore.address===''){
					that.$api.msg('地址不能为空')
				}else{
					that.shopStore.shopId = that.shop.id;
					that.shopStore.titile = that.shopStore.address;
					that.$api.request('shopkeeper/shopcenter', 'saveStoreAddress',that.shopStore, failres => {
						uni.showToast({
							title: failres.errmsg,
							icon: "none"
						});
					}).then(res => {
						uni.showToast({
							title: '操作成功',
							icon: "none"
						});
					})
				}
				
			},
		}
	}
</script>

<style>

</style>

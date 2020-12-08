<template>
<gracePage :customHeader="false">
	<!-- 页面主体 -->
	<view slot="gBody" class="grace-body">
		<!-- 表单 -->
		<view class="ls-form grace-margin grace-margin-top">
			<view class="ls-form-item">
				<view class="ls-form-label"></view>
				<view class="ls-form-input-box">
					<text>{{shop.titile}}</text>
				</view>
			</view>
			<view class="ls-form-item-column">
				<view class="ls-form-label"></view>
				<view class="ls-form-input-box">
					<image :src="shop.shopImg"></image>
				</view>
			</view>
			<view class="ls-btn-box">
				<button class="ls-btn ls-btn-blue" open-type="share">分享</button>
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
			}
		},
		onShow() {
			this.getShopinfo();	
		},
		onShareAppMessage(res) {
			return {
			  title: that.shop.titile,
			  path: '/pages/index/index?shopId='+that.shop.id
			}
		},
		methods: {
			//获取店铺信息
			getShopinfo(){
				var that = this;
				that.$api.requestGet('shopkeeper/shopcenter', 'shopinfo',null,failres => {
					that.$api.msg(failres.msg)
				}).then(res => {
					that.shop = res.shop;
				});
			},
			
		}
	}
</script>

<style>

</style>

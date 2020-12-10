<template>
	<view class="content">
		<text class="success-icon yticon icon-xuanzhong2"></text>
		<text class="tit">支付成功</text>
		
		<view class="btn-group">
			<view @click="toLatestOrder" class="mix-btn">查看订单</view>
			<view  @click="toIndex" class="mix-btn hollow">返回首页</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				shopId:null,
			}
		},
		onShow() {
			this.initShopId();
		},
		onLoad(options) {
			// this.shopId = options.shopId
		},
		methods: {
			initShopId(){
				try {
					const value = uni.getStorageSync('shopId');
					if (value) {
						this.shopId = value;
					}
				} catch (e) {
				}
				if(this.shopId==null){
					uni.navigateTo({
						url: '/pages/index/index'
					})
				}
			},
			toIndex(){
				var that = this;
				var url = '/pages/index/index?shopId='+that.shopId;
				uni.navigateTo({
					url
				})
			},
			toLatestOrder(){
				var that = this;
				var url = '/pages/order/latestorder?shopId='+that.shopId;
				uni.navigateTo({
					url
				})
			},
		}
	}
</script>

<style lang='scss'>
	.content{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.success-icon{
		font-size: 160upx;
		color: #fa436a;
		margin-top: 100upx;
	}
	.tit{
		font-size: 38upx;
		color: #303133;
	}
	.btn-group{
		padding-top: 100upx;
	}
	.mix-btn {
		margin-top: 30upx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 600upx;
		height: 80upx;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		&.hollow{
			background: #fff;
			color: #303133;
			border: 1px solid #ccc;
		}
	}
</style>

<template>
	<view class="app">
		<view class="price-box">
			<text>支付金额</text>
			<text class="price">{{price}}</text>
		</view>

		<view class="pay-type-list">

			<view class="type-item b-b" @click="changePayType(1)">
				<text class="icon yticon icon-weixinzhifu"></text>
				<view class="con">
					<text class="tit">微信支付</text>
				<!-- 	<text>推荐使用微信支付</text> -->
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 1' />
					</radio>
				</label>
			</view>
			<!-- <view class="type-item b-b">
				<text class="icon yticon icon-alipay"></text>
				<view class="con">
					<text class="tit">支付宝（敬请期待）</text>
				</view>
				<label class="radio">
					<radio disabled="true" value="" color="#fa436a" :checked='payType == 2' />
					</radio>
				</label>
			</view>
			<view class="type-item" @click="changePayType(3)">
				<text class="icon yticon icon-erjiye-yucunkuan"></text>
				<view class="con">
					<text class="tit">线下支付（到付）</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 3' />
					</radio>
				</label>
			</view> -->
		</view>

		<text :disabled="submiting" class="mix-btn" @click="confirm">确认支付</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				payType: 1,
				price: 0,
				orderNo: '',
				submiting: false,
				shopId:null,
			};
		},
		computed: {

		},
		onLoad(options) {
			this.initShopId();
			this.price = options.price
			this.orderNo = options.orderNo
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
			//选择支付方式
			changePayType(type) {
				this.payType = type;
			},
			//确认支付
			confirm: async function() {
				const that = this
				if (that.payType === 1) {
					that.submiting = true
					that.$api.requestPost('pay', 'wxPrepay', {
						orderNo : that.orderNo
					}, failres => {
						that.submiting = false
						that.$api.msg(failres.errmsg)
					}).then(res => {
						var prepayRes = res.payparam;
						that.submiting = false
						//#ifdef MP-WEIXIN
						const payParam = {
							appId: prepayRes.appId,
							nonceStr: prepayRes.nonceStr,
							package: prepayRes.packageValue,
							timeStamp: prepayRes.timeStamp,
							signType: prepayRes.signType,
							paySign: prepayRes.paySign,
						}
						//#endif
						//#ifdef APP-PLUS
						const payParam = {
							appid: prepayRes.appId,
							noncestr: prepayRes.nonceStr,
							package: prepayRes.packageValue,
							partnerid: prepayRes.partnerId,
							prepayid: prepayRes.prepayId,
							timestamp: parseInt(prepayRes.timeStamp),
							sign: prepayRes.sign,
							signType: 'MD5'
						}
						//#endif
						//#ifdef MP-WEIXIN || APP-PLUS
						uni.requestPayment({
							provider: 'wxpay',
							//#ifdef MP-WEIXIN
							...payParam,
							//#endif
							//#ifdef APP-PLUS
							orderInfo: payParam,
							//#endif
							success: function(res) {
								uni.redirectTo({
									url: '/pages/pay/success?shopId='+that.shopId
								})
							},
							fail: function(res) {
								console.log(res);
								// that.$api.msg(JSON.stringify(res))
								that.$api.msg("支付失败")
							},
							complete: function(res) {
								console.log("支付过程结束")
							}
						});
						//#endif
						//#ifdef H5
						that.$jweixin.chooseWXPay({
							nonceStr: prepayRes.nonceStr,
							timestamp: prepayRes.timeStamp,
							package: prepayRes.packageValue,
							signType: prepayRes.signType,
							paySign: prepayRes.paySign,
							success: (e) => {
								//支付成功
								uni.redirectTo({
									url: '/pages/pay/success?shopId='+that.shopId
								})
							},
							fail: function(res) {
								console.log("支付过程失败");
								that.$api.msg(JSON.stringify(res))
							},
							complete: function(res) {
								console.log("支付过程结束")
							}
						})
						//#endif
					})
					
				} else if (that.payType === 3) {
					that.submiting = true
					that.$api.requestPost('pay', 'offlinePrepay', {
						orderNo : that.orderNo
					}, failres => {
						that.submiting = false
						that.$api.msg(failres.errmsg)
					}).then(res => {
						uni.redirectTo({
							url: '/pages/pay/success?shopId='+that.shopId
						})
					})
				}
				
			}
		}
	}
</script>

<style lang='scss'>
	.app {
		width: 100%;
	}

	.price-box {
		background-color: #fff;
		height: 265upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		color: #909399;

		.price {
			font-size: 50upx;
			color: #303133;
			margin-top: 12upx;

			&:before {
				content: '￥';
				font-size: 40upx;
			}
		}
	}

	.pay-type-list {
		margin-top: 20upx;
		background-color: #fff;
		padding-left: 60upx;

		.type-item {
			height: 120upx;
			padding: 20upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 60upx;
			font-size: 30upx;
			position: relative;
		}

		.icon {
			width: 100upx;
			font-size: 52upx;
		}

		.icon-erjiye-yucunkuan {
			color: #fe8e2e;
		}

		.icon-weixinzhifu {
			color: #36cb59;
		}

		.icon-alipay {
			color: #01aaef;
		}

		.tit {
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 4upx;
		}

		.con {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-sm;
			color: $font-color-light;
		}
	}

	.mix-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630upx;
		height: 80upx;
		margin: 80upx auto 30upx;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>

<template>
	<gracePage :customHeader="false">
		<view slot="gBody" class="grace-body">
			<!-- <view class="grace-margin-top" style="padding:20rpx 0;text-align: center;">
				<text class="grace-h4 grace-bold">个人中心</text>
			</view> -->
			<view class="grace-list">
				<view class="grace-list-items">
					<view class="grace-list-image ucenter-face grace-relative">
						<image class="grace-list-image ucenter-face-image" src="https://graceui.oss-cn-beijing.aliyuncs.com/faces/1.png" mode="widthFix"></image>
					</view>
					<view class="grace-list-body">
						<view class="grace-list-title">
							<text class="grace-list-title-text">标题信息</text>
						</view>
						<view class="grace-list-body-desc">描述信息</view>
					</view>
					<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
				</view>
			</view>
			<view class="ucenter-line"></view>
		<!-- 	<view>
				<graceBoxBanner :items="items"></graceBoxBanner>
			</view> -->
			<view class="ucenter-line"></view>
			<view class="grace-list grace-margin-top">
				<view class="grace-list-items">
					<text class="grace-list-icon grace-icons icon-friend grace-blue"></text>
					<view class="grace-list-body grace-border-b">
						<view class="grace-list-title">
							<text class="grace-list-title-text">好友动态</text>
							<text class="grace-badge grace-bg-red">12</text>
						</view>
					</view>
					<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
				</view>
				<view class="grace-list-items">
					<text class="grace-list-icon grace-icons icon-wallet grace-green"></text>
					<view class="grace-list-body grace-border-b">
						<view class="grace-list-title">
							<text class="grace-list-title-text">我的钱包</text>
						</view>
					</view>
					<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
				</view>
				<view class="grace-list-items">
					<text class="grace-list-icon grace-icons icon-article grace-blue-sky"></text>
					<view class="grace-list-body grace-border-b">
						<view class="grace-list-title">
							<text class="grace-list-title-text">我的文章</text>
						</view>
					</view>
					<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
				</view>
				<view class="grace-list-items">
					<text class="grace-list-icon grace-icons icon-user grace-red"></text>
					<view class="grace-list-body">
						<view class="grace-list-title">
							<text class="grace-list-title-text">身份认证</text>
						</view>
					</view>
					<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
				</view>
			</view>
			<view class="ucenter-line"></view>
			<view class="grace-list grace-margin-top">
				<view class="grace-list-items">
					<text class="grace-list-icon grace-icons icon-set grace-yellow"></text>
					<view class="grace-list-body grace-border-b">
						<view class="grace-list-title">
							<text class="grace-list-title-text">账户设置</text>
						</view>
					</view>
					<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
				</view>
				<view class="grace-list-items">
					<text class="grace-list-icon grace-icons icon-phone grace-red"></text>
					<view class="grace-list-body">
						<view class="grace-list-title">
							<text class="grace-list-title-text">手机密保</text>
						</view>
					</view>
					<text class="grace-list-arrow-right grace-icons icon-arrow-right"></text>
				</view>
			</view>
		</view>
	</gracePage>
</template>
<script>
import gracePage from "../../graceUI/components/gracePage.vue";
import graceBoxBanner from "../../graceUI/components/graceBoxBanner.vue";

    import {  
        mapState 
    } from 'vuex';  
	let startY = 0, moveY = 0, pageAtTop = true;
    export default {
		components: {
			gracePage, graceBoxBanner
		},
		data(){
			return {
				coverTransform: 'translateY(0px)',
				coverTransition: '0s',
				moving: false,
				footprintList: [],
				isVip: false,
				shopId:null,
			}
		},
		onShow() {
			this.isVip = this.$api.isVip()
			// this.loadFootprint()
		},
		onLoad(option){
			console.log('option===='+JSON.stringify(option)); //打印出上个页面传递的参数。
			this.shopId = option.shopId;
		},
		// #ifndef MP
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if (index === 0) {
				this.navTo('/pages/set/set');
			}else if(index === 1){
				// #ifdef APP-PLUS
				const pages = getCurrentPages();
				const page = pages[pages.length - 1];
				const currentWebview = page.$getAppWebview();
				currentWebview.hideTitleNViewButtonRedDot({
					index
				});
				// #endif
				uni.navigateTo({
					url: '/pages/notice/notice'
				})
			}
		},
		// #endif
        computed: {
			...mapState(['hasLogin','userInfo'])
		},
        methods: {
			async loadFootprint() {
				const that = this
				that.$api.request('footprint', 'getAllFootprint').then(res => {
					that.footprintList = res.data
				})
			},
			
			deleteFootprint(item) {
				const that = this
				uni.showModal({
					title: '删除？',
					content: '您确定要删除此足迹吗？',
					success : (e) => {
						if (e.confirm) {
							that.$api.request('footprint', 'deleteFootprint', {
								footprintId: item.id
							}).then(res => {
								that.loadFootprint()
							})
						}
					}
				})
			},
			//我的代金券
			gotoMycoupon(){
				const that = this;
				uni.navigateTo({
					url: '/pages/mycoupon/mycoupon?shopId='+that.shopId
				})
			},
			toLogin() {
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/public/login'
					})
				}
			},
			
			logout() {
				const that = this
				uni.showModal({
					title: '询问',
					content: '您确定要退出吗？',
					cancelText: '取消',
					confirmText: '确定',
					success: (e) => {
						if (e.confirm) {
							that.$store.commit('logout')
							that.$api.logout()
						}
					}
				})
			},

			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			navTo(url){
				if(!this.hasLogin){
					url = '/pages/public/login';
				}
				uni.navigateTo({  
					url
				})
			}, 
			golatestorder(){
				var that = this;
				var url = '/pages/order/latestorder?shopId='+that.shopId;
				uni.navigateTo({
					url
				})
			},
			goorderList(){
				var that = this;
				var url = '/pages/order/order?shopId='+that.shopId;
				uni.navigateTo({
					url
				})
			},
			/**
			 *  会员卡下拉和回弹
			 *  1.关闭bounce避免ios端下拉冲突
			 *  2.由于touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的时候会有掉帧的感觉
			 *    transition设置0.1秒延迟，让css来过渡这段空窗期
			 *  3.回弹效果可修改曲线值来调整效果，推荐一个好用的bezier生成工具 http://cubic-bezier.com/
			 */
			coverTouchstart(e){
				if(pageAtTop === false){
					return;
				}
				this.coverTransition = 'transform .1s linear';
				startY = e.touches[0].clientY;
			},
			coverTouchmove(e){
				moveY = e.touches[0].clientY;
				let moveDistance = moveY - startY;
				if(moveDistance < 0){
					this.moving = false;
					return;
				}
				this.moving = true;
				if(moveDistance >= 80 && moveDistance < 100){
					moveDistance = 80;
				}
		
				if(moveDistance > 0 && moveDistance <= 80){
					this.coverTransform = `translateY(${moveDistance}px)`;
				}
			},
			coverTouchend(){
				if(this.moving === false){
					return;
				}
				this.moving = false;
				this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)';
				this.coverTransform = 'translateY(0px)';
			}
        }  
    }  
</script>  
<style lang='scss'>
	.ucenter-face{width:100rpx !important; height:100rpx !important;}
	.ucenter-face-image{width:100rpx !important; height:100rpx !important;}
	.ucenter-line{height:12rpx; background-color:#F4F5F6; margin:16rpx 0;}
</style>
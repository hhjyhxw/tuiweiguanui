<template>
	<gracePage :customHeader="false">
		<!-- 页面主体 -->
		<view slot="gBody" class="grace-body">
			<view class="grace-margin-top">
				<text class="grace-title">请选择照片</text>
			</view>
			<!-- 如果没有默认值则不需要 -->
			<graceSelectImg :maxFileNumber="9" @removeImg="removeImg" @change="imgsChange" :items="defaultItems"></graceSelectImg>
		</view>
	</gracePage>
</template>
<script>
import gracePage from "../../graceUI/components/gracePage.vue";
import graceSelectImg from "../../graceUI/components/graceSelectImg.vue";
export default {
	data() {
		return {
			// 如果不需要默认值 请将此变量设置为 [] 
			// 或者 组件不设置 items 属性
			defaultItems : []
		}
	},
	onLoad:function(){
		// 模拟 api 加载默认图片
		// 不需要默认值删除此函数即可
		setTimeout(()=>{
			this.defaultItems = [
				'https://img-cdn-qiniu.dcloud.net.cn/uploads/article/20190906/3eb1d2195dbf3c64efae3843c6dcea6f.png',
				'https://img-cdn-qiniu.dcloud.net.cn/uploads/article/20190415/b82b568d66e1080a7235701969c4c082.png',
				'https://img-cdn-qiniu.dcloud.net.cn/uploads/article/20190906/44d741c79b2a3096c04af3b5037cbd52.png'
			];
		}, 1000)
	},
	methods:{
		imgsChange : function (imgs){
			console.log('选择的图片数据变化了');
			console.log(imgs);
			// 数据格式
			// { progress : 0/100, url:图片地址 }
			// progress : 100 代表图片来自默认值不需要上传
		},
		removeImg : function (e) {
			console.log('被删除的图片信息');
			console.log(e);
		}
	},
	components:{
		gracePage, graceSelectImg
	}
}
</script>
<style>
</style>
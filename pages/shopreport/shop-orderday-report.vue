<template>
	<gracePage :customHeader="false">
		<view slot="gBody" class="grace-body"  >
			<view class="content">
				<view class="ls-grid-3">
					<view class="ls-cell"><<</view>
					<view class="ls-cell ls-cell-rborder ls-cell-lborder">2020年10月</view>
					<view class="ls-cell">>></view>
				</view>
				<view class="ls-grid-3">
					<view class="ls-cell">日期</view>
					<view class="ls-cell ls-cell-rborder ls-cell-lborder">订单数量</view>
					<view class="ls-cell">订单金额</view>
				</view>
				<view class="ls-grid-3">
					<view class="ls-cell">10/01</view>
					<view class="ls-cell ls-cell-rborder ls-cell-lborder">100</view>
					<view class="ls-cell">359.00</view>
				</view>
				<view class="ls-grid-3">
					<view class="ls-cell">10/01</view>
					<view class="ls-cell ls-cell-rborder ls-cell-lborder">100</view>
					<view class="ls-cell">359.00</view>
				</view>
			</view>
		</view>
	</gracePage>
</template>
<script>
import gracePage from "../../graceUI/components/gracePage.vue";
import { mapState } from 'vuex';  
	export default {
		components:{gracePage},
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	page{
		/* background-color: #F2F2F2; */
		background-color: lightblue;
		
	}
	.content{
		padding:3px;
		background-color: white;
		margin-top: 10px;
		border-radius: 5px;
		padding-bottom: 10px;
	}
	.ls-grid-3{
		display: flex;
		justify-content: space-around;
		align-items: center;
		border: 1px solid black;
		text-align: center;
		/* padding: 5px; */
	}
	.ls-cell{
		flex: 1;
		height: 2rem;
		line-height: 2rem;
	}
	.ls-cell-rborder{
		border-right: 1px solid black;
	}
	.ls-cell-lborder{
		border-left: 1px solid black;
	}
</style>

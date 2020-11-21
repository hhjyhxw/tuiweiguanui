<template>
	<gracePage :customHeader="false">
		<view slot="gBody" class="grace-body"  >
			<view class="ls-grid-3">
				<view class="ls-cell">《</view>
				<view class="ls-cell">2020年10月</view>
				<view class="ls-cell">》</view>
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

</style>

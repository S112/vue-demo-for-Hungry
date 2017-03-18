<template>
<div class='cartcontrol'>
	<div class='cart-decrease ' v-show='food.count>0' @click='decreaseCart($event)' transition='move'>
		<span class='inner icon-remove_circle_outline'></span>
	</div>
	<div class='cart-count' v-show='food.count>0' v-text='food.count'>	</div>
	<div class='cart-add icon-add_circle' @click='addCart($event)'></div>
</div>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue';
export default {
	created() {
		// console.log(JSON.parse(JSON.stringify(this.food)));
	},
	props: {
		food: {
			type: Object
		}
	},
	methods: {
		addCart(event) {
			if (!event._constructed) {  // 解决pc端点击出现两次bug,_constructed是better-scroll自带的,原生不存在
				return;
			}
			if (!this.food.count) {
				Vue.set(this.food, 'count', 1);
			} else {
				this.food.count++;
			}
			this.$parent.$emit('cart.add', event.target);
		},
		decreaseCart(event) {
			if (!event._constructed) {  // 解决pc端点击出现两次bug,_constructed是better-scroll自带的,原生不存在
				return;
			}
			if (this.food.count) {
				this.food.count--;
			}
		}
	}
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.cartcontrol
	font-size: 0  //解决inline-block问题
	.cart-decrease
		display: inline-block
		padding: 6px //增加被点击面积
		cursor: pointer
		transition: all .4s linear
		&.move-transition
			opacity: 1
			transform: translate3d(0, 0, 0)
			.inner
				display: inline-block
				line-height: 24px
				font-size: 24px
				color: rgb(0, 160, 220)
				transition: all .4s linear
				transform: rotate(0)
		&.move-enter, &.move-leave
			opacity: 0
			transform: translate3d(24px, 0, 0)
			.inner
				transform: rotate(180deg)
	.cart-count
		display: inline-block
		vertical-align: top
		width: 12px
		padding-top: 6px
		line-height: 24px
		text-align: center
		font-size: 10px
		color: rgb(147, 153, 159);
	.cart-add
		display: inline-block
		padding: 6px //增加被点击面积
		line-height: 24px
		font-size: 24px
		color: rgb(0, 160, 220)
		cursor: pointer
</style>
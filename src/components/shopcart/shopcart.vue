<template>
<div class='shopcart'>
	<div class='content' @click='toggleList'>
		<div class='content-left'>
			<div class='logo-wrapper'>
				<div class='logo' :class="{'highlight': totalCount>0}">
					<i class='icon-shopping_cart' :class="{'highlight': totalCount>0}"></i>
				</div>
				<div class='num' v-text='totalCount' v-show='totalCount>0'></div>
			</div>
			<div class='price' :class="{'highlight': totalPrice>0}" v-text="'￥' + totalPrice + '元'"></div>
			<div class='desc' v-text="'另需配送费￥' + deliveryPrice + '元'"></div>
		</div>
		<div class='content-right' @click.stop.prevent='pay'> <!-- 阻止事件冒泡 -->
			<div class='pay not-enough' :class="totalPrice!==0&&totalPrice>=minPrice ? 'enough': 'not-enough'" v-text="payDesc" ></div>
		</div>
	</div>

	<div class='ball-container'><!-- 小球 -->
		<div v-for='(idx,ball) in balls' v-show='ball.show' class='ball' transition='drop'>
			<div class='inner inner-hook'></div>
		</div>
	</div>

	<div v-show='listShow' class='shopcart-list' transition='fold'><!-- 商品详情页 -->
		<div class='list-header'>
			<h1 class='title'>购物车</h1>
			<span class='empty' @click='empty'>清空</span>
		</div>
		<div class='list-content' v-el:list-content>
			<ul>
				<li class='food' v-for='food in selectFoods'>
					<span class='name' v-text='food.name'></span>
					<div class='price'>
						<span v-text="'￥' + food.price*food.count"></span>
					</div>
					<div class='cartcontrol-wrapper'>
						<cartcontrol :food='food'></cartcontrol>
					</div>
				</li>
			</ul>  
		</div>
	</div>
</div>
<div class='list-mask' @click='hideList' v-show='listShow' transition='fade'>
	
</div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll';
import cartcontrol from 'components/cartcontrol/cartcontrol';
export default {
	props: {
		selectFoods: {
			type: Array,
			default() {
				return [
				// {
				// 	price: 10,
				// 	count: 2
				// }
				];
			}
		},
		deliveryPrice: {
			type: Number,
      default: 0
		},
		minPrice: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			balls: [{
				show: false
			}, {
				show: false
			}, {
				show: false
			}, {
				show: false
			}, {
				show: false
			}],
			dropBalls: [],
			fold: true,
			scroll: null
		};
	},
	computed: {
		totalPrice() {
			let total = 0;
			this.selectFoods.forEach((food) => {
				total += food.price * food.count;
			});
			return total;
		},
		totalCount() {
			let count = 0;
			this.selectFoods.forEach((food) => {
				count += food.count;
			});
			return count;
		},
		payDesc() {
			if (this.totalPrice === 0) {
				return 	`￥${this.minPrice}元起送`;
			} else if (this.totalPrice < this.minPrice) {
				let diff = this.minPrice - this.totalPrice;
				return 	`还差￥${diff}元起送`;
			} else {
				return 	'去结算';
			}
		},
		listShow() {
			if (!this.totalCount) {
				this.fold = true;
				return false;
			}
			if (this.fold) {
				this.$nextTick(() => {
					if (this.scroll) {
						this.scroll.refresh();
					} else {
						this.scroll = new BScroll(this.$els['listContent'], {
							click: true
						});
					}
				});
			}
			return !this.fold;
		}
	},
	methods: {
		drop(el) {
			for (let i = 0; i < this.balls.length; i++) {
				let ball = this.balls[i];
				if (!ball.show) {
					ball.show = true;
					ball.el = el;
					this.dropBalls.push(ball);
					return;
				}
			}
		},
		toggleList() {
			if (!this.totalCount) {
				return;
			}
			this.fold = !this.fold;
		},
		empty() {
			this.selectFoods.forEach(food => {
				food.count = 0;
			});
		},
		hideList() {
			this.fold = true;
		},
		pay() {
			if (this.totalPrice < this.minPrice) {
				return;
			}
			window.alert(`支付${this.totalPrice}`);
		}
	},
	components: {
		cartcontrol
	},
	transitions: {
		drop: {
			beforeEnter(el) {
				// let self = this;
				this.balls.filter((ball) => {
					return ball.show;
				}).forEach((ball) => {
					let rect = ball.el.getBoundingClientRect();
					let x = rect.left - 32;
					let y = -(window.innerHeight - rect.top - 22);
					el.style.display = '';
					el.style.webkitTransform = `translate3d(0, ${y}px, 0)`;
					el.style.transform = `translate3d(0, ${y}px, 0)`;
					let inner = el.querySelectorAll('.inner-hook')[0];
					inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
					inner.style.transform = `translate3d(${x}px, 0, 0)`;
				});
			},
			enter(el) {
				/* eslint-disable no-unused-vars */
				let rf = el.offsetHeight;   // 让浏览器重绘, important！！！
				this.$nextTick(() => {
					el.style.webkitTransform = 'translate3d(0, 0, 0)';
					el.style.transform = 'translate3d(0, 0, 0)';
					let inner = el.querySelectorAll('.inner-hook')[0];
					inner.style.webkitTransform = 'translate3d(0, 0, 0)';
					inner.style.transform = 'translate3d(0, 0, 0)';
				});
			},
			afterEnter(el) {
				let dropBall = this.dropBalls.shift();
				if (dropBall) {
					dropBall.show = false;
					el.style.display = 'none';
				}
			}
		}
	}
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl'
.shopcart
	position: fixed
	left: 0
	bottom: 0
	z-index: 50
	width: 100%
	height: 48px
	.content
		display: flex
		background-color: #141d27
		color: rgba(255, 255, 255, 0.4)
		.content-left
			flex: 1
			font-size: 0  //inline-block问题
			.logo-wrapper
				display: inline-block
				vertical-align: top
				position: relative
				top: -10px
				margin: 0 12px
				padding: 6px
				width: 56px
				height: 56px
				box-sizing: border-box				
				border-radius: 50%
				background-color: #141d27
				.logo
					width: 100%
					height: 100%
					border-radius: 50%
					text-align: center
					background-color: #2d343c
					&.highlight
						background-color: rgb(0, 160, 220)
					.icon-shopping_cart
						line-height: 44px
						font-size: 24px
						color: #80858a
						&.highlight
							color: #fff
				.num
					position: absolute;
					top: 0
					right: 0
					width: 24px
					height: 16px
					line-height: 16px
					text-align: center
					border-radius: 16px
					font-size: 9px
					font-weight: 700
					color: #fff
					background-color: rgb(240, 20, 20)
					box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4)
			.price
				display: inline-block
				vertical-align: top
				margin-top: 12px
				line-height: 24px
				padding-right: 12px
				box-sizing: border-box
				border-right: 1px solid rgba(255, 255, 255, 0.1 )
				font-size: 16px
				font-weight: 700
				&.highlight
					color: #fff;
			.desc
				display: inline-block
				vertical-align: top
				margin: 12px 0 0 12px
				line-height: 24px
				font-size: 12px
		.content-right
			flex: 0 0 105px
			width: 105px
			.pay
				height: 48px
				line-height: 48px
				text-align: center
				font-size: 12px
				font-weight: 700
				&.not-enough
					background-color: #2b333b
				&.enough
					background-color: #00b43c
					color: #fff;
	.ball-container
		.ball
			position: fixed
			left: 32px
			bottom: 22px
			z-index: 200
			&.drop-transition
				transition: all .4s cubic-bezier(0.49,-0.29,0.75,0.41)
				.inner
					width: 16px
					height: 16px
					border-radius: 50%
					background-color: rgb(0, 160, 220)
					transition: all .4s linear
	.shopcart-list
		position: absolute
		top: 0
		left: 0
		z-index: -1
		width: 100%
		&.fold-transition
			transition: all .5s
			transform: translate3d(0, -100%, 0)
		&.fold-enter, &.fold-leave
			transform: translate3d(0, 0, 0)		
		.list-header
			height: 40px
			line-height: 40px
			padding: 0 18px
			background-color: #f3f5f7
			border-1px(rgba(7, 17, 27, 0.5))
			.title
				float: left
				font-size: 14px
				color: rgb(7, 17, 27)
			.empty
				float: right	
				font-size: 12px
				color: rgb(0, 160, 220)
		.list-content
			padding: 0 18px
			max-height: 217px
			overflow: hidden
			background-color: #fff
			.food
				position: relative
				padding: 12px 0
				box-sizing: border-box
				border-1px(rgba(7, 17, 27, 0.1))
				.name
					line-height: 24px
					font-size: 14px
					color: rgb(7, 17, 27)
				.price
					position: absolute
					right: 90px
					bottom: 12px
					line-height: 24px
					font-size: 14px
					font-weight: 700
					color: rgb(240, 20, 20)
				.cartcontrol-wrapper
					position: absolute
					right: 0
					bottom: 6px
.list-mask
	position: fixed
	top: 0
	left: 0
	width: 100%
	height: 100%
	z-index: 40
	backdrop-filter: 10px
	&.fade-transition
		transition: all 0.5s
		opacity: 1
		background-color: rgba(7, 17, 27, 0.6)
	&.fade-enter, &.fade-leave
		opacity: 0
		background-color: rgba(7, 17, 27, 0)
</style>
<template>
<div class='goods'>
	<div class='menu-wrapper' v-el:menu-wrapper>
		<ul v-show='goods.length'>
			<li v-for='(idx,item) in goods' class='menu-item' :class="{current: currentIndex===idx}" @click='selectMenu(idx,$event)'>
				<span class='text border-1px'>
					<span v-show='item.type > 0' class='icon' :class='classMap[item.type]'></span>{{item.name}}
				</span>
			</li>
		</ul>
	</div>
	<div class='foods-wrapper' v-el:foods-wrapper>
		<ul>
			<li v-for='item in goods' class='food-list food-list-hook'>
				<h1 class='title' v-text='item.name'></h1>
				<ul>
					<li @click='selectFood(v, $event)' v-for='v in item.foods' class='food-item border-1px'>
						<div class='icon'>
							<img width='57' :src="v.icon">
						</div>
						<div class='content'>
							<h2 class='name' v-text='v.name'></h2>
							<p class='desc' v-text='v.description'></p>
							<div class='extra'>
								<span class='count' v-text="'月售'+v.sellCount+'份'"></span><!--
								--><span v-text="'好评率'+v.rating+'%'"></span>
							</div>
							<div class='price'>
								<span class='now' v-text="'￥'+v.price"></span>
								<span class='old' v-show='v.oldPrice' v-text="'￥'+v.oldPrice"></span>
							</div>
							<div class='cartcontrol-wrapper'>
								<cartcontrol :food='v'></cartcontrol>
							</div>	
						</div>
					</li>
				</ul>
			</li>
		</ul>
	</div>
	<shopcart :select-foods='selectFoods' :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" v-ref:shop-cart></shopcart>
	<food :food='selectedFood' v-ref:food></food>
</div>
</template>

<script type="text/ecmascript-6">
import {axios} from 'common/js/global';
import BScroll from 'better-scroll';
import shopcart from 'components/shopcart/shopcart';
import cartcontrol from 'components/cartcontrol/cartcontrol';
import food from 'components/food/food';
const ERR_OK = 0;

export default {
	name: 'goods',
	props: {
		seller: {
			type: Object
		}
	},
	created() {
		this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
		axios.get('api/goods', {
		}).then((rsp) => {
			if (rsp.errno === ERR_OK) {
				this.goods = rsp.data;
				this.$nextTick(() => {
					this._initScroll();
					this._calculateHeight();
				});
			}
		}).catch((err) => {
			console.log(err);
		});
	},
	data() {
		return {
			goods: [],
			listHeight: [],
			scrollY: 0,
			menuScroll: null,
			foodsScroll: null,
			selectedFood: {}
		};
	},
	computed: {
		currentIndex() {
			for (let i = 0; i < this.listHeight.length; i++) {
				let height1 = this.listHeight[i];
				let height2 = this.listHeight[i + 1];
				if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
					return i;
				}
			}
			return 0;
		},
		selectFoods() {
			let foods = [];
			this.goods.forEach((good) => {
				good.foods.forEach((food) => {
					if (food.count) {
						foods.push(food);
					}
				});
			});
			return foods;
		}
	},
	methods: {
		_drop(target) {
			// 异步动画
			this.$nextTick(() => {
				this.$refs['shopCart'].drop(target);
			});
		},
		selectMenu(index, event) {
			if (!event._constructed) {  // 解决pc端点击出现两次bug,_constructed是better-scroll自带的,原生不存在
				return;
			}
			let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook');
			let el = foodList[index];
			this.foodsScroll.scrollToElement(el, 300);
		},
		selectFood(food, event) {
			if (!event._constructed) {  // 解决pc端点击出现两次bug,_constructed是better-scroll自带的,原生不存在
				return;
			}
			this.selectedFood = food;
			this.$refs['food'].show();
		},
		_initScroll() {
			this.menuScroll = new BScroll(this.$els.menuWrapper, {
				probeType: 3,
				click: true
			});
			this.foodsScroll = new BScroll(this.$els.foodsWrapper, {
				probeType: 3,
				click: true // cartcontrol.vue
			});
			this.foodsScroll.on('scroll', (pos) => {
				this.scrollY = Math.abs(Math.round(pos.y));
			});
		},
		_calculateHeight() {
			let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook');
			let height = 0;
			this.listHeight.push(height);
			for (let i = 0; i < foodList.length; i++) {
				let item = foodList[i];
				height += item.clientHeight;
				this.listHeight.push(height);
			}
		}
	},
	events: {
		'cart.add'(target) {
			this._drop(target);
		}
	},
	components: {
		shopcart,
		cartcontrol,
		food
	}
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl';
.goods
	display: flex
	position: absolute
	top: 174px
	width: 100%
	height: 100%
	overflow: hidden
	.menu-wrapper
		flex: 0 0 80px
		width: 80px //兼容andorid浏览器
		background-color: #f3f5f7
		.menu-item
			display: table //垂直居中
			width: 56px
			height: 54px
			line-height: 14px
			padding: 0 12px
			&.current
				position: relative
				margin-top: -1px
				z-index: 10
				background-color: #fff
				font-weight: 700
				.text
					border-none()
			.icon
				display: inline-block
				vertical-align: top
				width: 12px
				height: 12px
				margin-right: 2px
				background-size: 12px 12px
				background-repeat: no-repeat
				&.decrease
					bg-image('decrease_3')
				&.discount
					bg-image('discount_3')
				&.guarantee
					bg-image('guarantee_3')
				&.invoice
					bg-image('invoice_3')
				&.special
					bg-image('special_3')
			.text
				display: table-cell //垂直居中
				width: 56px
				vertical-align: middle
				font-size: 12px
				border-1px(rgba(7, 17, 27, 0.1))			
	.foods-wrapper
		flex: 1
		.title
			padding-left: 14px
			height: 26px
			line-height: 26px
			border-left: 2px solid #d9dde1
			font-size: 12px
			color: rgb(147, 153, 159)
			background-color: #f3f5f7
		.food-item
			display: flex
			margin: 18px 18px 0 18px
			padding-bottom: 18px
			border-1px(rgba(7, 17, 27, 0.1)) 
			&:last-child
				border-none()
				// margin-bottom: 0
				// padding-bottom: 0
			.icon
				flex: 0 0 57px
				margin-right: 10px
			.content
				flex: 1
				.name
					margin: 2px 0 8px 0
					height: 14px
					line-height: 14px
					font-size: 14px 
					color: rgb(7, 17, 27)
				.desc, .extra
					line-height: 10px
					font-size: 10px
					color: rgb(147, 153, 159)
				.desc
					margin-bottom: 8px
					line-height: 12px
				.extra
					.count
						margin-right: 12px
				.price
					font-weight: 700
					line-height: 24px
					font-size: 0
					.now
						margin-right: 8px
						font-size: 14px
						color: rgb(240, 20, 20)
					.old
						text-decoration: line-through
						font-size: 10px
						color: rgb(147, 153, 159)
				.cartcontrol-wrapper  //for cartcontrol.vue
					position: absolute
					right: 0
					bottom: 12px;	
</style>
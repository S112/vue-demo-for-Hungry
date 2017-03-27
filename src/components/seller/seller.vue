<template>
<div class='seller' v-el:seller>
	<div class='seller-content'>
		<div class='overview'>
			<h1 class='title' v-text='seller.name'></h1>
			<div class='desc border-1px'>
				<star :size='36' :score='seller.score'></star>
				<span class='text' v-text="'(' + seller.ratingCount + ')'"></span>
				<span class='text' v-text="'月售' + seller.sellCount + '单'"></span>
			</div>
			<ul class='remark'>
				<li class='block'>
					<h2>起送价</h2>
					<div class='content'>
						<span class='stress' v-text='seller.minPrice'></span>元
					</div>
				</li>
				<li class='block'>
					<h2>商家配送</h2>
					<div class='content'>
						<span class='stress' v-text='seller.deliveryPrice'></span>元
					</div>
				</li>
				<li class='block'>
					<h2>平均配送时间</h2>
					<div class='content'>
						<span class='stress' v-text='seller.deliveryTime'></span>分钟
					</div>
				</li>
			</ul>
			<div class="favorite" @click='toggleFavorite($event)'>
				<span class="icon-favorite" :class="{'acitve': favorite}"></span>
				<span class="text" v-text="favoriteText"></span>
			</div>
		</div>
		<split></split>
		<div class="bulletin">
			<h1 class="title">公告与活动</h1>
			<div class="content-wrapper border-1px">
				<p class="content" v-text="seller.bulletin"></p>
			</div>
			<ul v-if='seller.supports' class='supports'>
				<li v-for='(idx, item) in seller.supports' class='support-item border-1px'>
					<span class='icon' :class='classMap[item.type]'></span>
					<span class='text' v-text='item.description'></span>
				</li>
			</ul>
		</div>
		<split></split>
		<div class="pics">
			<h1 class="title">商家实景</h1>
			<div class="pic-wrapper" v-el:pic-wrapper>
				<ul class="pic-list" v-el:pic-list>
					<li class="pic-item" v-for="pic in seller.pics">
						<img width="120" height="90" :src="pic">
					</li>
				</ul>
			</div>
		</div>
		<split></split>
		<div class="info">
			<h1 class="title border-1px">商家信息</h1>
			<ul>
				<li class="info-item border-1px" v-for="info in seller.infos" v-text="info"></li>
			</ul>
		</div>
	</div>
</div>
</template>

<script type="text/ecmascript-6">
import star from 'components/star/star';
import split from 'components/split/split';
import BScroll from 'better-scroll';
import {saveToLocal, loadFromLocal} from 'common/js/stroe';

export default {
	created() {
		this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
	},
	ready() {
		this._initScroll();
		this._initPicScroll();
	},
	props: {
		seller: {
			type: Object
		}
	},
	data() {
		return {
			scroll: null,
			picScroll: null,
			classMap: [],
			favorite: loadFromLocal(this.seller.id, 'favorite', false)
		};
	},
	computed: {
		favoriteText() {
			return this.favorite ? '已收藏' : '收藏';
		}
	},
	watch: {
		seller() {
			this._initScroll();
			this._initPicScroll();
		}
	},
	methods: {
		toggleFavorite(event) {
			if (!event._constructed) {  // 解决pc端点击出现两次bug,_constructed是better-scroll自带的,原生不存在
				return;
			}
			this.favorite = !this.favorite;
			saveToLocal(this.seller.id, 'favorite', this.favorite);
		},
		_initScroll() {
			if (this.scroll) {
				this.scroll.refresh();
			} else {
				this.scroll = new BScroll(this.$els['seller'], {
					click: true
				});
			}
		},
		_initPicScroll() {
			if (this.seller && this.seller.pics) {
				let picWidth = 120;
				let margin = 6;
				let len = this.seller.pics.length;
				let width = (picWidth + margin) * len - margin; // 最后一张图片是没有margin的
				this.$els['picList'].style.width = width + 'px';
				this.$nextTick(() => {
					if (this.picScroll) {
						this.picScroll.refresh();
					} else {
						this.picScroll = new BScroll(this.$els['picWrapper'], {
							scrollX: true,
							eventPassthrough: 'vertical'
						});
					}
				});
			}
		}
	},
	components: {
		star,
		split
	}
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl';
.seller
	position: absolute
	top: 174px
	bottom: 0
	left: 0
	width: 100%
	overflow: hidden
	.overview
		position: relative
		padding: 18px
		.title
			margin-bottom: 8px
			line-height: 14px
			font-size: 14px
			color: rgb(7, 17, 27)
		.desc
			padding-bottom: 18px
			font-size: 0
			border-1px(rgba(7, 17, 27, 0.1))
			.star
				display: inline-block
				margin-right: 8px
			.text
				display: inline-block
				margin-right: 12px
				line-height: 18px
				vertical-align: top
				font-size: 10px
				color: rgb(77, 85, 93)
		.remark
			display: flex
			padding-top: 18px
			.block
				flex: 1
				text-align: center
				border-right: 1px solid rgba(7, 17, 27, 0.1)
				&:last-child
					border: none
				h2
					margin-bottom: 4px
					line-height: 10px
					font-size: 10px
					color: rgb(147, 153, 159)
				.content
					line-height: 24px
					font-size: 10px
					color: rgb(7, 17, 27)
					.stress
						font-size: 24px
		.favorite
			position: absolute
			top: 18px
			right: 11px
			width: 50px
			text-align: center
			.icon-favorite
				display: block
				margin-bottom: 4px
				line-height: 24px
				font-size: 24px
				color: #d4d6d9
				&.acitve
					color: rgb(240, 20, 20)
			.text
				line-height: 10px
				font-size: 10px
				color: rgb(77, 85, 93)			
	.bulletin
		padding: 18px 18px 0 18px
		.title
			margin-bottom: 8px
			line-height: 14px
			font-size: 14px
			color: rgb(7, 17, 27)
		.content-wrapper
			padding: 0 12px 16px 12px
			border-1px(rgba(7, 17, 27, 0.1))
			.content
				line-height: 24px
				font-size: 12px
				color: rgb(240, 20, 20)
		.supports
			width: 80%
			margin: 0 auto
			.support-item
				padding: 16px 12px
				border-1px(rgba(7, 17, 27, 0.1))
				font-size: 0
				&:last-child
					border-none()
				.icon
					display: inline-block
					width: 16px;
					height: 16px;
					vertical-align: top
					margin-right: 6px
					background-size: 16px 16px
					background-repeat: no-repeat
					&.decrease
						bg-image('decrease_4')
					&.discount
						bg-image('discount_4')
					&.guarantee
						bg-image('guarantee_4')
					&.invoice
						bg-image('invoice_4')
					&.special
						bg-image('special_4')	
				.text
					line-height: 16px;
					font-size: 12px
				color: rgb(7, 17, 27)
	.pics
		padding: 18px
		.title
			margin-bottom: 12px
			line-height: 14px
			font-size: 14px
			color: rgb(7, 17, 27)
		.pic-wrapper
			width: 100%
			overview: hidden
			white-space: nowrap
			.pic-list
				font-size: 0
				.pic-item
					display: inline-block
					margin-right: 6px
					width: 120px
					height: 90px
					&:last-child
						margin-right: 0px
	.info
		padding: 18px 18px 0 18px
		color: rgb(7, 17, 27)
		.title
			padding-bottom: 12px
			line-height: 14px
			border-1px(rgba(7, 17, 27, 0.1))
			font-size: 14px
		.info-item
			padding: 16px 12px
			line-height: 16px
			border-1px(rgba(7, 17, 27, 0.1))
			font-size: 12px
			&:last-child
				border-none()
</style>
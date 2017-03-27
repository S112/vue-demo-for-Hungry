<template>
<div class='split border-1px border-top-1px'></div>
</template>

<script type="text/ecmascript-6">
export default {
	name: 'split'
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl';
.split
	width: 100%
	height: 16px
	border-top-1px(rgba(7, 17, 27, 0.1))
	border-1px(rgba(7, 17, 27, 0.1))
	background-color: #f3f5f7;
</style>
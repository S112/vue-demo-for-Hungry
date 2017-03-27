<template>
<div>
  <v-header :seller='seller'></v-header>
  <div class='tab border-1px'>
    <div class='tab-item'>
      <a v-link="{ path: '/goods' }">商品</a>  
    </div>
    <div class='tab-item'>
      <a v-link="{ path: '/ratings' }">评价</a>
    </div>
    <div class='tab-item'>
      <a v-link="{ path: '/seller' }">商家</a>
    </div>      
  </div>

  <router-view :seller='seller' keep-alive></router-view>
</div>
</template>

<script type="text/ecmascript-6">
import header from 'components/header/header';
import {axios} from 'common/js/global';
import {urlParse} from 'common/js/ultis';
const ERR_OK = 0;

export default {
  created() {
    axios.get(`api/seller?id=${this.seller.id}`, {
    }).then((rsp) => {
      if (rsp.errno === ERR_OK) {
        // console.log(this.seller.id);
        // console.log(JSON.parse(JSON.stringify(this.seller)));
        this.seller = Object.assign({}, this.seller, rsp.data);
        // console.log(this.seller.id);
        // console.log(JSON.parse(JSON.stringify(this.seller)));
      }
    }, (err) => {
      console.log(err);
    });
  },
  data() {
    return {
      seller: {
        id: (() => {
          urlParse();
          let queryParam = urlParse();
          return queryParam.id;
        })()
      }
    };
  },
  components: {
    'v-header': header
  }
};
</script>
 
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import './common/stylus/mixin.styl'
.tab
  display: flex
  width: 100%
  height: 40px
  line-height: 40px
  // border-bottom: 1px solid rgba(7,17,27,0.1)
  border-1px(rgba(7,17,27,0.1))
  .tab-item
    flex: 1
    text-align: center
    & > a
      display: block
      font-size: 14px
      color: rgb(77, 85, 93)
      &.active
        color: rgb(240, 20, 20)
</style>

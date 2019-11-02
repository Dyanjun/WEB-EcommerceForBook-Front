<template>
  <div>
    <div>
      <div >
        <div class="nav-sub ">
          <div class="nav-sub-wrapper">
            <div class="container">
              <ul class="nav-list">
                <li><router-link :to="{path: '/home'}" >首页</router-link></li>
                <li><router-link :to="{path: '/books'}" v-show="this.$cookie.get('role')=='user'">浏览图书</router-link></li>
                <li><router-link :to="{path: '/cart'}" v-show="this.$cookie.get('role')=='user'">我的购物车</router-link></li>
                <li><router-link :to="{path: '/order'}" v-show="this.$cookie.get('role')=='user'">我的订单</router-link></li>
                <li><router-link :to="{path: '/books_admin'}" v-show="this.$cookie.get('role')=='admin'">图书</router-link></li>
                <li><router-link :to="{path: '/order_admin'}" v-show="this.$cookie.get('role')=='admin'">订单</router-link></li>
                <li><router-link :to="{path: '/users'}" v-show="this.$cookie.get('role')=='admin'">用户权限管理</router-link></li>
                <li><router-link :to="{path: '/login'}">登陆/注册</router-link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  <div class="sku-box store-content">
    <div class='main'>
      <div class="sku-box store-content ">
        <div class="sort-option">
          <ul class="line clear">
            <li><button @click="orderBySale">销量排序{{bookname111}}</button></li>
            <li><button @click="orderByPriceDown">价格低到高</button></li>
            <li><button @click="orderByPriceUp">价格高到低</button></li>
          </ul>
          <div align="left">
          <input type="search" id="bookname" class="form-control" placeholder="输入书籍名或作者" @keyup.enter="search" v-on:input="search"/>
          <button @click="search">搜索</button>
          </div>
        </div>
      </div>
      <ul>
      <li class="store-content ng-scope" v-for="(book,index) in list" :key="book.id" v-show="book.inventory>0">
        <div class="sku-box " >
          <div class="gray-box " >
            <div class="cover">
                <img :src="book.image"/>
            </div>
            <div class="story-content" align="left">
              <div class="share" >
                <h2   ng-if="item.subtitle" class="ng-binding ng-scope"   >{{book.bookname}}</h2>
                <h4  >作者：&nbsp;{{book.author}}<br />ISBN：{{book.isbn}}<br />库存：&nbsp;{{book.inventory}}<br />月售：&nbsp;{{book.sale}}<br /> 出版时间：{{book.publishtime}}</h4>
              </div>
              <div class="story">
                <p class="ng-scope">
                  <span class="ng-binding ng-scope"  style="text-align: justify">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{book.brief}}
                  </span>
                </p>
              </div>
              <div class="info">
                <div class="price discount ng-scope">
                  <span class="highlight">&nbsp;  ¥ <i class="ng-binding">{{book.price}}</i></span>
                </div>
                <span class="jianguo-blue-main-btn big-main-btn">
                    <button  class="ng-scope" @click="jump(book.id)">了解详情</button>
                </span>
              </div>
            </div>
          </div>
        </div>
       </li>
      </ul>
    </div>
  </div>
</div>
</template>

<script>
  import '../assets/css/header.css'
  import '../assets/css/reset.css'

  export default {
    name: 'books',
    data () {
      return {
        role:this.$store.role,
        list: [],
        listcopy: [],
        bookname111:"",
      }
    },
    methods: {
      orderBySale: function () {
        this.list = this.list.sort((a, b) => b.sale - a.sale);
      },
      orderByPriceUp: function () {
        this.list = this.list.sort((a, b) => b.price - a.price);
      },
      orderByPriceDown: function () {
        this.list = this.list.sort((a, b) => a.price - b.price);
      },
      getUrl:function(index){
        if(typeof(index)==="number")
        return require("../assets/images/book"+index+".jpg");
      },
      search: function () {

        let name = document.getElementById("bookname");
        let nameStr = name.value;
        let list = this.listcopy;

        if (!nameStr) {
          this.list = list;
          return;
        }
        nameStr = nameStr.trim().toLowerCase();
        this.list = list.filter(function (item) {
          return item.bookname.trim().toLowerCase().match(nameStr) || item.author.trim().toLowerCase().match(nameStr);
        })

      },
      jump: function (id) {
        this.$router.push('/details/' + id);
      },
    },

   created: function () {
      this.$axios.get('http://localhost:8088/books/list')
        .then((response) => {
          this.list=response.data;
          this.listcopy=this.list;

        })
        .catch(error => {
          alert('hhhh')
        })
    },





  }
</script>

<style scoped>
  .red{
    color:red;
  }

  .main {
    min-height: calc(100vh - 454px);
    background: #ededed;
    overflow: hidden;
    width: 100%;
  }

  .store-content {
    clear: both;
    width: 1220px;
    padding: 0 0 25px;
    margin: 0 auto;
  }

  .gray-box {

    overflow: hidden;
    margin-bottom: 20px;
    padding: 30px 0 30px;

    background: #fff;
    border-radius: 8px;
    border: 1px solid #dcdcdc;
    border-color: rgba(0,0,0,.14);
    -webkit-box-shadow: 0 3px 8px -6px rgba(0,0,0,.1);
    box-shadow: 0 3px 8px -6px rgba(0,0,0,.1);
  }

  .gray-box .cover {
    float: left;
    margin: 0 0 0 28px;
  }

  .story-content {
    float: right;
    width: 640px;
    margin: 30px 60px 0 23px;
  }

  .story-content .share {
    padding-bottom: 18px;
    overflow: hidden;
  }

  .story-content h2 {
    font-size: 24px;

  }

   a {
    color: #000;
  }

  .story-content h4 {
    color: #999;
    float: left;
    margin-top: 14px;
  }

  .story-content .story {
    padding: 26px 0;
    line-height: 24px;
    border-top: 1px solid #EEE;
    border-bottom: 1px solid #EEE;
  }

  .discount span {
    color: #d44d44;
  }

  .story-content .info {
    padding: 26px 0 0 0;
    overflow: hidden;
    line-height: 40px;
  }

  .story-content .price {
    float: left;
    margin-top: 5px;
  }

  .story-content .price .normal {
    margin-right: 7px;
  }

  .story-content .story a {
    margin-left: 6px;
    color: #5079d9;
    cursor: pointer;
  }

  .story-content .price .highlight {
    font-weight: 700;
    margin-left: -3px;
    color: #d44d44;
    font-size: 18px;
  }

  .story-content .price i {
    font-size: 26px;
  }

  .story-content .price.discount .origin {
    position: relative;
    margin-left: 8px;
    font-size: 18px;
    color: #999;
  }

  .story-content .price.discount .origin i {
    font-size: 18px;
  }
  .story-content .price.discount .origin:after {
    position: absolute;
    content: '';
    border-top: 2px solid #d44d44;
    width: 100%;
    top: 46%;
    left: 0;
  }


  .info .big-main-btn {
    float: right;
    width: 139px;
  }

  .big-main-btn {
    height: 48px;
    background: linear-gradient(#799CEA,#567CE6);
    box-shadow: 0 1px 3px rgba(0,0,0,.1), inset 0 -1px 2px rgba(0,0,0,.2);
    display: block;
    padding: 1px;
    margin: 0 auto;
    border-radius: 9px;
    background: #015e94;
    background: linear-gradient(#5598c9,#2a6da2);
    text-align: center;
    text-shadow: rgba(255,255,255,.496094) 0 1px 0;
    cursor: pointer;
    color: #ffffff;
  }

  .info .big-main-btn a {
    font-size: 16px;
    height: 44px;
    line-height: 45px;
    font-size: 18px;
    color: #FFF;
  }

  .sku-box {
    position: relative;
  }

  .sort-option {
    border-top: 1px solid #D8D8D8;
    color: #999;
  }

  .sort-option ul {
    height: 60px;
    line-height: 60px;
  }

  .sort-option li {
    position: relative;
    float: left;
    padding-left: 42px;
  }

  .sort-option li:first-child {
    padding-left: 9px;
  }

  .sort-option li:before {
    content: ' ';
    display: block;
    position: absolute;
    left: 20px;
    top: 50%;
    width: 2px;
    height: 2px;
    margin-top: -1px;
    background: #C7C7C7;
  }

  .sort-option li:first-child:before {
    display: none;
  }

  .sort-option a {
    display: block;
    font-size: 12px;
    color: #999;
  }

  .sort-option a.active, .sort-option a:hover {
    color: #5683EA;
  }

  .gray-box {
    overflow: hidden;
    background: #fff;
    border-radius: 8px;
    border: 1px solid #dcdcdc;
    border-color: rgba(0,0,0,.14);
    box-shadow: 0 3px 8px -6px rgba(0,0,0,.1);
  }

  .sku-box .item-box {
    clear: both;
    overflow: hidden;
    margin: 0 -1px -1px -1px;
  }

  .sku-box .item {
    position: relative;
    float: left;
    border-right: 1px solid #efefef;
    border-bottom: 1px solid #efefef;
    width: 25%;
    height: 429px;
    background: #fff;
    box-sizing: border-box
  }

  .sku-box .item:hover {
    box-shadow: 0 0 38px rgba(0,0,0,.08) inset;
    transition: all .15s ease;
  }

  .sku-box .item .item-img img {
    display: block;
    width: 206px;
    height: 206px;
    margin: 50px auto 10px;
  }

  .sku-box .item h3, .sku-box .item h6 {
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sku-box .item h6 {
    line-height: 1.2;
    font-size: 16px;
    color: #424242;
    margin: 0 auto;
    padding: 0 14px;
  }

  .sku-box .item h3 {
    line-height: 1.2;
    font-size: 12px;
    color: #d0d0d0;
    margin: 8px auto 14px;
  }

  .sku-box .item .params-colors {
    margin-top: 23px;
    text-align: center;
  }

  .sku-box .item .colors-list {
    display: inline-block;
    overflow: hidden;
  }

  .sku-box .item .colors-list li {
    float: left;
    margin: 0 5px;
  }

  .sku-box .item .colors-list > li a {
    width: 8px;
    height: 8px;
    border: 1px solid #e5e5e5;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    padding: 2px;
    display: block;
  }

  .sku-box .item .colors-list > li a.active {
    box-shadow: inset 0 0 0 1px #b2b2b2;
    border-color: #b2b2b2;
  }

  .sku-box .item .colors-list > li img {
    width: inherit;
    height: inherit;
    border-radius: 50%;
    display: block;
  }

  .sku-box .item .item-btns {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 29px;
    text-align: center;
    opacity: 0;
    z-index: 10;
  }

  .sku-box .item:hover .item-btns {
    opacity: 1;
    transition: all .2s ease-in;
  }

  .sku-box .item .item-btns .item-blue-btn, .sku-box .item .item-btns .item-disabled-btn, .sku-box .item .item-btns .item-gray-btn, .sku-box .item .item-btns .item-green-btn {
    display: inline-block;
    box-sizing: border-box;
    width: 100px;
    height: 30px;
    font-size: 12px;
    line-height: 28px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 200;
    transition: all .1s ease;
  }

  .sku-box .item .item-btns .item-gray-btn {
    border: 1px solid #d5d5d5;
    color: #646464;
  }

  .sku-box .item .item-btns .item-gray-btn a {
    display: block;
    color: #a1a1a1;
  }

  .sku-box .item .item-btns .item-gray-btn:hover {
    background-image: linear-gradient(#f6f6f6,#ededed);
  }

  .sku-box .item .item-btns .item-blue-btn {
    background-color: #5c85e5;
    background-image: linear-gradient(#779ae9,#5078df);
    border: 1px solid #5c81e3;
    color: #fff;
    margin-left: 10px;
  }

  .sku-box .item .item-btns .item-blue-btn:hover {
    border: 1px solid #5374c8;
    background-color: #5074db;
    background-image: linear-gradient(#6e8ed5,#4769c2);
  }

  .sku-box .item .item-btns .item-blue-btn:active {
    border: 1px solid #3e61d7;
    background-color: #5c85e5;
    background-image: linear-gradient(#4d72de,#6189e6);
  }

  .sku-box .item .item-price {
    font-family: Arial;
    color: #c30a18;
    margin-top: 24px;
    text-align: center;
    opacity: 1;
  }

  .sku-box .item .item-price i {
    font-size: 16px;
  }

  .sku-box .item .item-price span {
    font-size: 18px;
    padding-left: 4px;
  }

  .sku-box .item:hover .item-price {
    opacity: 0;
    transition: all .1s ease-out;
  }

  .sku-box .item .discount-icon {
    display: none;
  }

  .sku-box .item .item-cover a {
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 20;
    width: 100%;
    height: 310px;
  }
  .form-control {

    width: 120px;
    height: 25px;
    padding: 3px 6px;
    font-size: 10px;
    line-height: 1;
    align-content  :center;
    color: #555;
    background-color: #FFF;
    background-image: none;
    border: 1px solid #EAE9E9;
    border-radius: 4px;
    box-shadow: 0px 1px 1px rgba(179, 179, 179, 0.1) inset;
    transition: border-color 0.15s ease-in-out 0s, box-shadow 0.15s ease-in-out 0s;
  }

</style>

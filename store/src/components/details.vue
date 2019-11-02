<template>
  <div id="main">
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
    <div class="store-content item">
      <div class="item-box" v-for="(book,index) in list" :key="book.id" v-show="id == book.id">
        <div class="gallery-wrapper" >
          <div class="gallery">
            <div class="thumbnail">
              <img :src="book.image"/>
            </div>
          </div>
        </div>
        <div class="banner">
          <div class="sku-custom-title">
            <div class="params-price">
              <span><em>¥</em><i>{{book.price}}</i></span>
            </div>
            <div class="params-info">
              <h4>{{book.bookname}}</h4>
              <h5 >作者：{{book.author}}<br/>ISBN:{{book.isbn}}<br/>库存：{{book.inventory}}</h5>
              <h6 >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{book.brief}}</h6>
            </div>
          </div>
          <div class="sku-dynamic-params-panel">
            <div class="sku-dynamic-params clear">
              <div class="params-name">数量</div>
              <div class="params-detail clear">
                <div class="item-num js-select-quantity">
                  <button @click="handleReduce" :disabled="count===1">-</button>
                  {{count}}
                  <button @click="handleAdd">+</button>
                </div>
              </div>
            </div>
          </div>
          <div class="sku-status">
            <div class="cart-operation-wrapper clearfix">
              <button class="blue-title-btn js-add-cart" v-on:click="addtocart(book.price,book.bookname)">加入购物车</button>
              <button class="gray-title-btn" v-on:click="payforbook(book.price,book.bookname)"><a>现在购买</a></button>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>

</template>

<script>
  import '../assets/css/header.css'
  import '../assets/css/reset.css'

  export default {
    name: 'details',
    data(){
      return {
        role:this.$store.role,
        list:[],
        id:this.$route.params.id,
        count: 1,
        username:""
      }
    },
    methods:{
      handleReduce:function () {
        if(this.count===1) return;
        this.count--;
      },
      handleAdd:function () {
        this.count++;
      },
      getUrl:function(index){
        return require("../assets/images/book"+index+".jpg");
      },
      payforbook:function(price,bookname){
          this.username=this.$cookie.get('username')
          console.log(this.username)
          if(this.username!=="") {
            this.$axios.post('http://localhost:8088/payforbook', {
              "bookId": this.id,
              "count": this.count,
              "username": this.username,
              "bookprice": price,
              "bookname": bookname,
            }).then((response) => {
              console.log(response.data)
              if (response.data === "u") {
                alert("库存不足，请重新选择数量")
              } else {
                if (response.data === "r") {
                  this.count = 1;
                  alert("请前往订单中查看！");
                  this.$router.replace({path: '/order'})
                } else {
                    alert("失败！")
                }
              }
            })
          }
          else
          {
            alert("请先登录")
          }
        },

      addtocart:function(price,bookname){
        this.username=this.$cookie.get('username')
        console.log(this.username)
        if(this.username!=="") {
          this.$axios.post('http://localhost:8088/addtocart', {
            "bookId": this.id,
            "count": this.count,
            "username": this.username,
            "bookprice": price,
            "bookname": bookname,
          }).then((response) => {
            console.log(response.data)
            if (response.data === "u") {
              alert("库存不足，请重新选择数量")
            } else {
              if (response.data === "r") {
                this.count = 1;
                alert("添加成功！");
                this.$router.replace({path: '/books'})
              } else {
                if (response.data === "w") {
                  alert("添加失败！")
                } else {
                  alert("购物车中已存在，且最多还能添加" + response.data + "本")
                }
              }
            }
          })
        }
        else
        {
          alert("请先登录")
        }
      }
    },
    created: function () {
      this.$axios.get('http://localhost:8088/books/list')
        .then((response) => {
          this.list=response.data;
          console.log(response.data)
        })
        .catch(error => {
          alert('hhhh')
        })
    },
  }
</script>

<style scoped>


  .item .item-box {
    width: 1098px;
    padding: 60px;
    margin-bottom: 20px;
    display: table;
    overflow: hidden;
    background: #fff;
    border-radius: 8px;
    border: 1px solid #dcdcdc;
    border-color: rgba(0,0,0,.14);
    box-shadow: 0 3px 8px -6px rgba(0,0,0,.1);
  }

  .banner, .gallery-wrapper {
    display: table-cell;
  }

  .gallery-wrapper {
    vertical-align: top;
  }

  .gallery {
    float: left;
    width: 540px;
    display: table-cell;
  }

  .thumb, .thumbnail {
    display: table-cell;
    vertical-align: middle;
  }

  .thumbnail li {
    width: 54px;
    height: 54px;
    margin-top: 10px;
    padding: 12px;
    border: 1px solid rgba(0,0,0,.06);
    border-radius: 5px;
    cursor: pointer;
  }

  .thumbnail li:first-child {
    margin-top: 0;
  }

  .thumbnail li.on {
    padding: 10px;
    border: 3px solid #ccc;
    border: 3px solid rgba(0,0,0,.2);
  }

  item-box img {
    max-width: 100%;
    height: auto;
  }

  .thumb > ul {
    margin-left: 20px;
    width: 440px;
    height: 440px;
    position: relative;
  }

  .thumb li {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: none;
    opacity: 0;
    text-align: center;
    user-select: none;
  }

  .thumb li.on {
    animation: thumb-change .35s ease-out 1;
    position: relative;
    display: block;
    z-index: 1;
    opacity: 1;
  }

  .item-box .banner {
    vertical-align: middle;
    width: 450px;
    margin-left: 10px;
  }

  .item-box .banner .sku-custom-title {
    overflow: hidden;
    padding: 8px 8px 18px 10px;
    position: relative;
  }

  .item-box .banner .params-price {
    position: absolute;
    right: 8px;
    bottom: 19px;
  }

  .item-box .banner .params-price span {
    display: block;
    color: #de4037;
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    text-align: right;
  }

  .item-box .banner .params-price span i {
    padding-left: 2px;
    font-size: 24px;
  }

  .item-box .banner .sku-custom-title .params-info {
    width: 360px;
  }

  .item-box .banner .sku-custom-title h4 {
    font-size: 24px;
    line-height: 1.25;
    color: #000;
    margin-bottom: 13px;
  }

  .item-box .banner .sku-custom-title h6 {
    font-size: 14px;
    line-height: 1.5;
    color: #bdbdbd;
  }

  .item-box .banner .sku-dynamic-params-panel {
    padding: 29px 0 8px 10px;
    border-top: 1px solid #ebebeb;
  }

  .item-box .banner .sku-dynamic-params {
    margin-bottom: 19px;
  }

  .item-box .banner .params-name {
    float: left;
    padding-right: 20px;
    font-size: 14px;
    color: #8d8d8d;
    line-height: 36px;
  }

  .item-box .banner .sku-dynamic-params .params-colors {
    float: left;
    line-height: 36px;
    margin: -10px 0 0 -10px;
    width: 402px;
  }

  .item-box .banner .sku-dynamic-params .params-colors > li {
    float: left;
    margin: 10px 0 0 10px;
  }

  .item-box .banner .sku-dynamic-params .params-colors > li a {
    display: block;
    width: 26px;
    height: 26px;
    border: 2px solid #E5E5E5;
    padding: 3px;
    text-align: center;
    color: #757575;
    border-radius: 50%;
  }

  .item-box .banner .sku-dynamic-params .params-colors > li.cur a {
    border-color: #B2B2B2;
    box-shadow: inset 0 0 0 1px #B2B2B2;
  }

  .item-box .banner .sku-dynamic-params .params-colors > li i, .item-box .banner .sku-dynamic-params .params-colors > li img {
    position: relative;
    display: block;
    width: 100%;
    border-radius: 50%;
  }

  .item-box .banner .sku-dynamic-params {
    margin-bottom: 19px;

  }

  .item-box .banner .params-detail {
    line-height: 36px;
    float: left;
    width: 392px;
  }

  .item-box .item-num {
    float: left;
    width: 128px;
  }

  .item-box .item-num .down:before, .item-box .item-num .up:before {
    content: '';
    position: absolute;
    left: -4px;
    right: -4px;
    top: 0;
    height: 45px;
    background-size: 100% auto;
  }
  .item-box .item-num .down:before {
    content: " ";
    background-position: 0 -60px;
  }

  .item-box .item-num .down:hover:before {
    content: " ";
    background-position: 0 -180px;
  }

  .item-box .item-num .down.down-disabled:before, .item-box .item-num .down.down-disabled:hover:before {
    content: " ";
    background-position: 0 -300px;
  }

  .item-box .item-num .down, .item-box .item-num .up {
    position: relative;
    float: left;
    display: inline-block;
    width: 36px;
    height: 36px;
    line-height: 40px;
    text-indent: -9999em;
    cursor: pointer;
    user-select: none;
  }

  .item-box .item-num .down.down-disabled, .item-box .item-num .up.up-disabled {
    cursor: not-allowed;
  }

  .item-box .item-num .up:before {
    background-position: 0 0;
  }

  .item-box .item-num .up:hover:before {
    background-position: 0 -120px;
  }

  .item-box .item-num .up.up-disabled:before, .item-box .item-num .up.up-disabled:hover:before {
    content: " ";
    background-position: 0 -240px;
  }

  .item-box .item-num .num {
    position: relative;
    overflow: hidden;
    float: left;
    display: inline-block;
    width: 56px;
    height: 18px;
    margin: 7px 0 0;
    border: none;
    border-radius: 3px;
    line-height: 18px;
    text-align: center;
    font-size: 14px;
  }

  .item-box .item-num input {
    width: 56px;
    height: 18px;
    background-color: transparent;
    border: none;
    border-radius: 3px;
    text-align: center;
    font-size: 14px;
    line-height: 18px;
    padding: 0;
  }

  .item-box .item-num ul {
    position: absolute;
    left: 0;
    top: 0;
    width: 56px;
  }

  .item-box .item-num ul li {
    width: 56px;
    height: 18px;
  }

  .item-box .sku-status {
    position: relative;
    border-top: 1px solid #ebebeb;
    padding: 30px 0 0 10px;
  }

  .item-box .blue-title-btn {
    float: left;
    display: inline-block;
    width: 143px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    border-radius: 7px;
    border: 1px solid #5c81e3;
    background-color: #5c85e5;
    background-image: linear-gradient(#779ae9,#5078df);
    color: #fff;
    cursor: pointer;
  }

  .item-box .blue-title-btn:hover {
    transition: all .15s ease-out;
    box-shadow: inset 0 1px 1px #7696DE, inset 0 0 2px #627DCA, inset 0 -2px 3px #5A77C7, inset 0 0 100px rgba(48,77,147,.4);
  }

  .item-box .blue-title-btn a, .item-box .green-title-btn a {
    color: #fff;
  }

  .item-box .cart-operation-wrapper .gray-title-btn {
    margin-left: 20px;
  }

  .item-box .gray-title-btn {
    display: inline-block;
    width: 143px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    background: linear-gradient(#fff,#fafafa);
    border: 1px solid #e0e0e0;
    border-radius: 7px;
    color: #8c8c8c;
    cursor: pointer;
  }

  .item-box .gray-title-btn:hover {
    transition: all .15s ease-out;
    background: linear-gradient(#f6f6f6,#ededed);
  }

</style>

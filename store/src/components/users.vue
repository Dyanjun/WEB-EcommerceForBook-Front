<template>
  <div id="main">
    <div>
        <div class="nav-sub ">
          <div class="nav-sub-wrapper">
            <div class="container">
              <ul class="nav-list">
                <li><router-link :to="{path: '/home'}" >首页</router-link></li>
                <li><router-link :to="{path: '/books'}" v-show="this.$cookie.get('role')=='user'">浏览图书</router-link></li>
                <li><router-link :to="{path: '/cart'}" v-show="this.$cookie.get('role')=='user'">我的购物车</router-link></li>
                <li><router-link :to="{path: '/order'}" v-show="this.$cookie.get('role')=='user'">我的订单</router-link></li>
                <li><router-link :to="{path: '/books_admin'}" v-show="this.$cookie.get('role')=='admin'">图书</router-link></li>
                <li>
                  <router-link :to="{path: '/order_admin'}" v-show="this.$cookie.get('role')=='admin'">订单</router-link>
                </li>

                <li><router-link :to="{path: '/users'}" v-show="this.$cookie.get('role')=='admin'">用户权限管理</router-link></li>
                <li><router-link :to="{path: '/login'}">登陆/注册</router-link></li>
              </ul>
            </div>
          </div>
        </div>
    </div>
    <div class="sku-box store-content ">
      <div class="gray-box">
        <div class="title-header">
          <h5 class="title">用户名单</h5>
        </div>
        <div class="item-box"  >
          <div class="item" v-for="user in list" :key="user.id" v-show="user.role=='user'">
            <div>
              <br/>
              <h6>{{user.username}}</h6>
              <h3>序号：{{user.id}}</h3>
              <h3 >邮箱：{{user.email}}</h3>
              <br/>
              <h4 v-show="user.able=='no'">已禁用</h4>
              <div class="item-btns clearfix">
                <button class="item-gray-btn" @click="ban(user.id)" v-show="user.able=='yes'">禁用</button>
                <button class="item-blue-btn" @click="unban(user.id)" v-show="user.able=='no'">解禁</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'users',
    inject:['reload'],
    data(){
      return{
        list:[],
      }
    },
    methods:{
      ban:function (id) {
        this.$axios.post('http://localhost:8088/ban_user',{
          "id":id
        }).then((response) => {
          if(response.data=="r"){
            alert("操作成功")
            this.reload()
          }
        })
      },
      unban:function (id) {
        this.$axios.post('http://localhost:8088/unban_user',{
          "id":id
        }).then((response) => {
          if(response.data=="r"){
            alert("操作成功")
            this.reload()
          }
        })
      }
    },
    created: function () {
      this.$axios.get('http://localhost:8088/users')
        .then((response) => {
          this.list=response.data;
        })
        .catch(error => {
          alert('获取名单失败')
        })
    },
  }
</script>

<style scoped>
  .nav-goods-list li{
    position: relative;
    display: inline-block;
    vertical-align: top;
    height: 100px;
    font-size: 14px;
  }
  .sku-box{
    position: relative;
  }
  .gray-box{
    overflow: hidden;
    background: #fff;
    border-radius: 8px;
    border: 1px solid #dcdcdc;
    border-color: rgba(0,0,0,.14);
    box-shadow: 0 3px 8px -6px rgba(0,0,0,.1);
  }
  .sku-box .item-box{
    clear: both;
    overflow: hidden;
    margin: 0 -1px -1px -1px;
  }
  .sku-box .item{
    position: relative;
    float: left;
    border-right: 1px solid #efefef;
    border-bottom: 1px solid #efefef;
    width: 25%;
    height: 200px;
    background: #fff;
    box-sizing: border-box
  }
  .sku-box .item:hover{
    box-shadow: 0 0 38px rgba(0,0,0,.08) inset;
    transition: all .15s ease;
  }
  .sku-box .item .item-img img{
    display: block;
    width: 206px;
    height: 206px;
    margin: 50px auto 10px;
  }
  .sku-box .item h3, .sku-box .item h6{
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .sku-box .item h6{
    line-height: 1.2;
    font-size: 16px;
    color: #424242;
    margin: 0 auto;
    padding: 0 14px;
  }
  .sku-box .item h3{
    line-height: 1.2;
    font-size: 12px;
    color: #d0d0d0;
    margin: 8px auto 14px;
  }
  .sku-box .item .params-colors{
    margin-top: 23px;
    text-align: center;
  }
  .sku-box .item .colors-list{
    display: inline-block;
    overflow: hidden;
  }
  .sku-box .item .colors-list li{
    float: left;
    margin: 0 5px;
  }
  .sku-box .item .colors-list>li a{
    width: 8px;
    height: 8px;
    border: 1px solid #e5e5e5;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    padding: 2px;
    display: block;
  }
  .sku-box .item .colors-list>li a.active{
    box-shadow: inset 0 0 0 1px #b2b2b2;
    border-color: #b2b2b2;
  }
  .sku-box .item .colors-list>li img{
    width: inherit;
    height: inherit;
    border-radius: 50%;
    display: block;
  }
  .sku-box .item .item-btns{
    position: absolute;
    left: 0;
    right: 0;
    bottom: 29px;
    text-align: center;

    z-index: 10;
  }
  .sku-box .item:hover .item-btns{
    opacity: 1;
    transition: all .2s ease-in;
  }
  .sku-box .item .item-btns .item-blue-btn, .sku-box .item .item-btns .item-disabled-btn, .sku-box .item .item-btns .item-gray-btn, .sku-box .item .item-btns .item-green-btn{
    display: inline-block;
    box-sizing: border-box;
    width: 100px;
    height: 30px;
    font-size: 12px;
    line-height: 28px;
    border-radius: 4px;
    font-weight: 200;

  }
  .sku-box .item .item-btns .item-gray-btn{
    border: 1px solid #d5d5d5;
    color: #646464;
  }
  .sku-box .item .item-btns .item-gray-btn a{

    color: #a1a1a1;
  }
  .sku-box .item .item-btns .item-gray-btn:hover{
    background-image: linear-gradient(#f6f6f6,#ededed);
  }
  .sku-box .item .item-btns .item-blue-btn{
    background-color: #5c85e5;
    background-image: linear-gradient(#779ae9,#5078df);
    border: 1px solid #5c81e3;
    color: #fff;
    margin-left: 10px;
  }
  .sku-box .item .item-btns .item-blue-btn:hover{
    border: 1px solid #5374c8;
    background-color: #5074db;
    background-image: linear-gradient(#6e8ed5,#4769c2);
  }
  .sku-box .item .item-btns .item-blue-btn:active{
    border: 1px solid #3e61d7;
    background-color: #5c85e5;
    background-image: linear-gradient(#4d72de,#6189e6);
  }
  .sku-box .item .item-price{
    font-family: Arial;
    color: #c30a18;
    margin-top: 24px;
    text-align: center;
    opacity: 1;
  }
  .sku-box .item .item-price i{
    font-size: 16px;
  }
  .sku-box .item .item-price span{
    font-size: 18px;
    padding-left: 4px;
  }


  .sku-box .item .item-cover a{
    position:relative;
    left: 0;
    top: 0;
    z-index: 20;
    width: 100%;
    height: 310px;
  }
</style>

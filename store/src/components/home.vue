<template>
  <div>
    <div>
      <div id="header">
        <br/>
        <br/>
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
  <div class="slide" v-on:mouseover="stop()" v-on:mouseout="move()">
    <div class="slideshow">
      <transition-group tag="ul" name="image">
        <li v-for="(item, index) in imgArray" v-show="index===mark" :key="item.id">
            <img :src='item.image'>
        </li>
      </transition-group>
    </div>
    <div class="bullet">
      <span v-for="(item, index) in imgArray" :class="{ 'active':index===mark }"
            @click="change(index)" :key="index"></span>
    </div>
  </div>
  </div>
</template>

<script>
  import '../assets/css/header.css'
  import '../assets/css/reset.css'

  export default {
    name: 'home',

    data () {
      return {
        role:this.$store.role,
        timer: null, //定时器
        mark: 0, //比对图片索引的变量
        imgArray: [
          {
            image:require('../assets/images/bookback1.jpg'),
            id:1
          },{
            image:require('../assets/images/bookback2.jpg'),
            id:2
          },{
            image:require('../assets/images/bookback3.jpg'),
            id:3
          },{
            image:require('../assets/images/bookback4.jpg'),
            id:4
          },


        ]
      }
    },
    methods: {
      autoPlay () {
        this.mark++;
        if (this.mark === 4) {
          this.mark = 0
        }
      },
      play () {
        this.timer = setInterval(this.autoPlay, 2500)
      },
      change (i) {
        this.mark = i
      },
      stop () {
        clearInterval(this.timer)
      },
      move () {
        this.timer = setInterval(this.autoPlay, 2500)
      }
    },
    created () {
      this.play()
    }

  }
</script>

<style scoped>
  * {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .slide {
    width: 1024px;
    height: 320px;
    margin: 0 auto;
    margin-top: 0px;
    overflow: hidden;
    position: relative;
  }
  .slideshow {
    width: 1024px;
    height: 320px;
  }
  li {
    position: absolute;
  }
  img {
    width: 1024px;
    height: 320px;
  }

  .bar span {
    width: 20px;
    height: 5px;
    border: 1px solid;
    background: white;
    display: inline-block;
    margin-right: 10px;
  }



</style>

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

    <el-date-picker
      v-model="filters.column.create_start_date"
      type="date"
      :picker-options="pickerBeginDateBefore"
      format="yyyy-MM-dd"
      value-format="yyyy-MM-dd"
      placeholder="起始">
    </el-date-picker>
    至
    <el-date-picker
      v-model="filters.column.create_end_date"
      type="date"
      format="yyyy-MM-dd"
      value-format="yyyy-MM-dd"
      :picker-options="pickerBeginDateAfter"
      placeholder="结束">
    </el-date-picker>
    <button class="blue-small-btn" v-on:click="search_order" >查询</button>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <button v-on:click="all" class="blue-small-btn js-payment-order" style="width: auto">查看全部订单</button>
    <br/>
    <br/>
    <br/>
    <div class="content clear" v-for="order in orders_re" :key="orders.id" v-show="(order.time>=time_start && order.done==='yes'&&order.time<=time_end)||order.done==='no' ">
      <div class="account-wrapper" >
        <div class="account-content">
          <div class="account-order">
            <div class="gray-box">
              <div class="js-list-inner">
                <div class="box-inner order-cart order-list-cart clear">
                  <div class="cart" v-for="item in order_item" :key="item.id" v-show="item.orderId===order.id">
                    <div class="cart-items clear">
                      <div class="prod-info clear" align="right">
                        《{{item.bookname}}》&nbsp;&nbsp;
                        单价：¥{{item.bookprice}}
                        &nbsp;&nbsp;&nbsp;数量：
                        {{item.count}}
                        <br/>
                        <br/>
                        &nbsp;
                      </div>
                    </div>
                  </div>
                  <div class="prod-operation">
                    <div class="status "  align="left" v-show="order.done==='yes'">订单日期：{{order.time}}</div>
                    <div class="status "  align="left"><label class=" js-payment-order" v-show="order.done==='yes'">已付款</label></div>&nbsp;&nbsp;&nbsp;
                    <div class="total">总价：¥{{order.totprice}}</div>
                    <div class="status"><button class="blue-small-btn js-payment-order" v-on:click="paynow(order.id,order.username)" v-show="order.done==='no'">现在付款</button></div>
                    <div class="status"><button class="blue-small-btn js-payment-order" v-on:click="delete_order(order.id)" >删除订单</button></div>
                  </div>
                </div>
              </div>
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

  let reload
  export default {
    name: 'order',
    inject:['reload'],
    data(){
      return{
        role:this.$store.role,
        orders:[],
        orders1:[],
        order_item:[],
        timenow:"0000-00-00 00:00:00",
        username:"",
        value1:"",
        filters: {
          column: {
            create_start_date: '',
            create_end_date: ''
          },
        },
        pickerBeginDateBefore:{
          disabledDate: (time) => {
            let beginDateVal = this.filters.column.create_end_date;
            if (beginDateVal) {
              return time.getTime()>beginDateVal;
            }
          }
        },
        pickerBeginDateAfter:{
          disabledDate: (time) => {
            let beginDateVal = this.filters.column.create_start_date;
            if (beginDateVal) {
              return time.getTime() < beginDateVal;
            }
          }
        },
        time_start:"0000-00-00 00:00:00",
        time_end:"3000-00-00 00:00:00"

      }
    },
    computed: {
      orders_re() {
        return this.orders.reverse();
      },
    },
    methods:{
      paynow:function (id,username) {
        this.$axios.post('http://localhost:8088/alreadypay',{
          "id": id,
          "username":username,
        }).then((response) => {
          if(response.data==="r") {
            alert("付款成功")
            this.$router.replace({path: '/order'})
            this.reload()
          }
          else{
            alert("库存不足,该订单将被删除" )
            this.reload()
          }
        })
      },
      getUrl:function(index){
        console.log(typeof(index))
        if(typeof(index)==="number")
          return require("../assets/images/book"+index+".jpg");
      },
      year:function(){
        this.$axios.get('http://localhost:8088/yeartime')
          .then((response) => {
            this.timenow=response.data;
            console.log(this.orders[0].time>=this.timenow)

          })
          .catch(error => {
            alert('操作失败')
          })
      },
      all:function () {
        this.time_start="0000-00-00 00:00:00"
        this.time_end="3000-00-00 00:00:00"


      },
      threemonth:function () {
        this.$axios.get('http://localhost:8088/threemonth')
          .then((response) => {
            this.timenow=response.data;
            console.log(this.orders[0].time>=this.timenow)
          })
          .catch(error => {
            alert('操作失败')
          })
      },
      clickBtn: function () {
        console.log(this.value1);
      },
      search_order:function(){
        this.time_start=this.filters.column.create_start_date
        this.time_end=this.filters.column.create_end_date

        this.time_start=this.time_start+" 00:00:00"
        this.time_end=this.time_end+" 23:59:59"

        console.log(this.time_start)
        console.log(this.time_end)
      },
      delete_order:function(id){
        this.$axios.post('http://localhost:8088/delete_order',{
          "id": id,
        }).then((response) => {
          if(response.data==="r") {
            alert("删除订单成功")
            this.$router.replace({path: '/order'})
            this.reload()
          }
          else{
            alert("删除订单失败")
          }
        })
      }
    },
    created:
      function () {
      this.username=this.$cookie.get("username")
        this.$axios.post('http://localhost:8088/order',{
          "username":this.username
        }).then((response) => {

            this.orders=response.data
            this.orders1=this.order
            console.log(this.order[0].username)



        })

        this.$axios.post('http://localhost:8088/order_item',{
          "username":this.username
        }).then((response) => {

            this.order_item=response.data
        })
      },

  }
</script>

<style scoped>
  .contentbutton{
    width: 20px;
    height: 20px;
  }

  .account-order .gray-box{
    margin-bottom: 20px;
  }
  .gray-box .columns-title h2{
    float: left;
  }
  button{
    border-radius: 15px;
  }
  .gray-btn-menu{
    display: inline-block;
    height: 36px;
    background: #F2F2F2;
    background: linear-gradient(#FFF,#F5F5F5);
    border: 1px solid #DBDDE2;
    border-radius: 4px;
    line-height: 36px;
    cursor: pointer;
    text-align: center;
    user-select: none;
  }
  .account-order .sort-status-menu{
    width: 112px;
  }
  .gray-box .title .gray-btn-menu, .gray-box .title span.gray-normal-btn{
    margin: 10px 0 0 10px;
  }
  .gray-box .title .gray-btn-menu{
    overflow: visible;
    float: right;
  }
  .gray-btn-menu .label{
    position: relative;
    z-index: 1;
    display: block;
    padding: 0 13px 0 16px;
    text-align: left;
    color: #666;
  }
  .gray-box .title .gray-btn-menu .label{
    overflow: visible;
    float: none;
    margin-top: 0;
  }
  .gray-btn-menu .label .arrow{
    float: right;
    width: 10px;
    height: 7px;
    margin: 16px 0 0 6px;
  }
  .gray-btn-menu .menu-list{
    display: none;
    position: absolute;
    right: -1px;
    top: -1px;
    width: 100%;
    padding: 38px 0 6px;
    background: #FFF;
    border: 1px solid #6189e6;
    border-radius: 4px;
    box-shadow: 0 1px 3px 0 #8cc5ff;
  }
  .gray-btn-menu-on .menu-list, .white-btn-menu-on .menu-list{
    display: block;
  }
  .gray-btn-menu .menu-list li{
    height: 24px;
    line-height: 24px;
    padding: 0 3px 3px;
    text-align: left;
    font-size: 12px;
  }
  .gray-btn-menu .menu-list li a{
    display: block;
    padding: 0 15px;
    border-radius: 3px;
    color: #d9ecff;
  }
  .gray-btn-menu .menu-list li a:hover{
    background: #8cc5ff;
    color: #FFF;
  }
  .gray-btn-menu .menu-list li.selected a{
    background: #6189e6;
    color: #FFF;
    cursor: default;
  }
  .account-order .sort-time-menu{
    width: 118px;
  }
  .gray-btn-menu-on .label .arrow, .white-btn-menu-on .label .arrow{
    margin-top: 15px;
    background-position: -15px -521px;
  }
  .gray-btn-menu-on, .white-btn-menu-on{
    position: relative;
    z-index: 10;
    height: auto;
    background: #FFF;
  }
  .gray-btn-menu-on{
    border: 1px solid #8cc5ff;
  }
  .gray-box, .gray-btn-menu-on:hover{
    background: #FFF;
  }
  .gray-box .gray-sub-title{
    height: 38px;
    padding: 0 24px;
    background: #8cc5ff;
    border-top: 1px solid #6189e6;
    border-bottom: 1px solid #6189e6;
    line-height: 38px;
    font-size: 12px;
    color: #666;
  }
  .account-order .gray-box .box-inner:first-child .gray-sub-title{
    border-top: none;
  }
  .order-list-cart .cart-title span{
    float: right;
    text-align: center;
  }
  .order-list-cart .cart-title .operation, .order-list-cart .cart-title .order-detail, .order-list-cart .cart-title .sub-total{
    float: right;
  }
  .order-list-cart .cart-title .date, .order-list-cart .cart-title .order-id{
    float: left;
    text-align: left;
  }
  .order-list-cart .cart-title .date{
    width: 108px;
    padding-left: 6px;
  }
  .order-list-cart .cart-title .order-detail{
    width: 82px;
    padding-left: 24px;
    text-align: center;
  }
  .order-list-cart .cart-title .sub-total{
    width: 102px;
    padding-right: 18px;
    border-left: 1px solid #DBDBDB;
    text-align: right;
  }
  .order-list-cart .cart-title .operation{
    width: 95px;
    height: 38px;
    padding-right: 23px;
  }
  .order-list-cart .cart-title .num{
    width: 70px;
  }
  .order-list-cart .cart-title .price{
    width: 85px;
    padding-right: 27px;
    text-align: right;
  }
  .gray-box .gray-sub-title a{
    color: #6989E0;
  }
  .order-list-cart .cart{
    float: left;
    width: 737px;
    padding: 0;
    border-right: 1px solid #DBDDE2;
    border-bottom: 1px solid #DBDDE2;
  }
  .order-cart .cart-items{
    position: relative;
    padding: 18px 0 28px;
    border-top: 1px solid #DBDDE2
  }
  .order-list-cart .cart-items{
    height: 110px;
    padding: 0;
  }
  .order-cart .cart-items:first-child{
    border-top: none;
  }
  .order-cart .prod-info{
    position: relative;
    margin-left: 138px;
  }
  .order-list-cart .prod-info{
    padding: 15px 0 15px 111px;
    margin-left: 0;
    position: relative;
  }
  .order-list-cart .items-thumb{
    position: absolute;
    left: 30px;
    top: 15px;
    width: 78px;
    height: 78px;
    border: 1px solid #EBEBEB;
    border-radius: 3px;
  }
  .order-list-cart .items-thumb img{
    width: 78px;
    height: 78px;
  }
  .order-list-cart .items-params{
    float: left;
    height: 50px;
    padding: 15px 0;
    margin-left: 29px;
    border-bottom: none;
    line-height: 25px;
  }
  .order-cart .items-params .name{
    overflow: hidden;
    float: left;
    color: #666;
    width: 435px;
    height: 44px;
    text-align: left;
  }
  .order-list-cart .prod-info .name{
    float: none;
    width: 220px;
    height: 25px;
    line-height: 25px;
  }
  .order-list-cart .prod-info .vh-center{
    height: auto;
    line-height: 50px;
  }
  .hide-row, .order-cart .items-params .name, .support-cart .items-detail .detail{
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .order-list-cart .prod-info .num, .order-list-cart .prod-info .operation, .order-list-cart .prod-info .price, .order-list-cart .prod-info .subtotal{
    float: right;
    line-height: 80px;
    text-align: center;
  }
  .order-list-cart .prod-info .operation{
    display: table;
    width: 95px;
    height: 80px;
    padding-right: 23px;
    line-height: 25px;
  }
  .order-list-cart .prod-info .num{
    width: 70px;
  }
  .order-list-cart .prod-info .price{
    width: 85px;
    padding-right: 27px;
    text-align: right;
  }
  .order-list-cart .prod-operation{
    float: right;
    display: table;
    height: 110px;
  }
  .order-list-cart .prod-operation .total{
    display: table-cell;
    padding-right: 18px;
    line-height: 14px;
    text-align: right;
    vertical-align: middle;
  }
  .order-list-cart .prod-operation .status{
    display: table-cell;
    width: 80px;
    padding: 0 24px;
    text-align: center;
    vertical-align: middle;
  }
  .blue-small-btn, .orange-small-btn, .white-gray-small-btn{
    display: inline-block;
    height: 30px;
    width: 90px;
    padding: 0 13px;
    border-radius: 4px;
    line-height: 30px;
    font-size: 12px;
    cursor: pointer;
  }
  .blue-small-btn{
    background: #6383C6;
    background: linear-gradient(#7EA3F5,#5A82F0);
    box-shadow: 0 1px 2px rgba(255,255,255,.1) inset, 0 0 0 1px rgba(0,0,0,.2) inset, 0 1px 3px rgba(0,0,0,.1);
    color: #FFF;
  }
  .blue-small-btn:hover{
    box-shadow: 0 1px 1px #7696DE inset, 0 0 2px #627DCA inset, 0 -2px 3px #5A77C7 inset, 0 0 100px rgba(48,77,147,.4) inset, 0 0 0 1px rgba(0,0,0,.3) inset, 0 1px 3px rgba(0,0,0,.1);
    color: #FFF;
  }


</style>


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

  <div id="main" style="background-image:url(../assets/images/bookback2.jpg)">
    <div align="right">
    <button v-on:click="unlogin()"  class="button1">退出登录&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button>
    </div>
    <div class="store-content item">
      <div class="item-box">
        <div class="box">
          <div class="box-for">
            <h2>New account : </h2>
            <form >
              <div>
                <label for="name">Name:</label>{{username}}
                <br />
                <input type="text" id="newname" class="form-control"  v-model="registerInfoVo.username"/>
              </div>
              <div>
                <label for="password">Password:</label>
                <br />
                <input type="password" class="form-control" v-model="registerInfoVo.password1" />
              </div>
              <div>
                <label for="password">Password again:</label>
                <br />
                <input type="password" class="form-control" v-model="registerInfoVo.password2"/>
              </div>
              <div>
                <label for="password">Email:</label>
                <br />
                <input type="text" class="form-control" v-model="registerInfoVo.email"/>
              </div>
              <br />
              <div>
                <button type="submit" class="button" v-on:click="register" v-show="islogin===false">Register</button>
                <label v-show="islogin">请退出登录后再注册</label>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="banner">
      <div class="box"  style=" height:225px">
        <div class="box-for" style=" height:200px">
          <h2>Login : </h2>
           <form>
             <div>
               <label for="name" >Name:</label>
               <br />
               <input type="text" class="form-control" id="name" v-model="loginInfoVo.username">
             </div>
             <div>
               <label for="password" >Password:</label>
               <br />
               <input type="password" class="form-control" id="password" v-model="loginInfoVo.password">
            </div>
            <br />
            <div>
               <button type="submit" class="button" v-on:click="login" v-show="islogin===false">login</button>
               <label v-show="islogin">已有用户登录</label>
           </div>
           </form>
           <br />
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
    name: 'login',

    data () {
      return {
        loginInfoVo: {username: '', password: ''},
        registerInfoVo: {username: '', password1: '', password2: '', email: ''},
        username:"",
        islogin:false,

      }
    },

      methods: {
        register: function () {
          console.log(this.loginInfoVo)
          let name = this.registerInfoVo.username;
          let pass1 = this.registerInfoVo.password1;
          let pass2=this.registerInfoVo.password2;
          let email=this.registerInfoVo.email;

          if(""==name||""==pass1||""==pass2||""==email) {
            alert("信息填写不完整")
            return
          }else{
            if(pass1!==pass2){alert("密码不一致");return}
            this.$axios.post('http://localhost:8088/register',{
              "username": this.registerInfoVo.username,
              "password": this.registerInfoVo.password1,
              "email": this.registerInfoVo.email,
            })
              .then((response) => {
              console.log(response.data)
              if(response.data.flag===true){
                this.username=response.data.username
                this.islogin=true
                this.$cookie.set('username', response.data.username)
                this.$cookie.set('role',response.data.role)

                this.username=this.$cookie.get('username')
                alert("注册成功！")
                this.$router.replace({path: '/home'})
              }else{
                alert(response.data.msg)
              }
            })
          }
        },
        unlogin:function () {
          if(this.$cookie.get("username")===""){
            alert("未登录")
          }
          else {
            this.$cookie.set('role',"")
            this.$cookie.set('username', "")
            this.username=""

            this.islogin=false
            alert("退出登录成功")
            this.$router.replace({path: '/home'})
           }
        },
        login:function(){ //方法
          console.log(this.loginInfoVo);
          let name = this.loginInfoVo.username;
          let pass = this.loginInfoVo.password ;
          if(name==""||pass==""){
            alert("信息填写不完整")
            return
          }
          if(""!==name&&""!==pass){
              this.$axios.post('http://localhost:8088/login',{
                "username": this.loginInfoVo.username,
                "password": this.loginInfoVo.password,
              }).then((response) => {
                console.log(response.data)
                if(response.data.flag===true){
                  if(response.data.able=="yes") {
                    this.islogin = true
                    this.$cookie.set('username', response.data.username)
                    this.$cookie.set('role', response.data.role)
                    this.username = this.$cookie.get('username')
                    alert("登陆成功！")
                    this.$router.replace({path: '/home'})
                  }
                  else{
                    alert("您的账号已被禁用")
                  }
                }else{
                  alert(response.data.msg)
                }
              })
          }

        }
      },


  }
</script>

<style scoped>
  .button1{
    background-color: rgba(212, 142, 110, 0.79);
  }



  .register-area {
    background-color: #ede8e8;
  }

  .container {
    border-radius: 25px;
    position: relative;
  }


  .box {
    border-radius: 25px;
    float: left;
    width: 50%;
    text-align: center;
    background-color: whitesmoke;
    height: 295px;
  }


  .box-for {
    border-radius: 25px;
    margin: 8px 10px 4px 10px;
    height:270px;
    align-self: center;
    background-color: rgba(221, 209, 209, 0.40);
  }


  h2 {
    font-family: 'Cordia New';
    font-size: 30px;
    font-weight :bold ;
    color: #000000;
    text-shadow: 10px, #ffffff;
    word-spacing: 5px;
  }

  h4 {
    font-family: 'Cordia New';
    font-size: 25px;
    color:#ede8e8;
    text-shadow: 10px,#ffffff;
    word-spacing: 5px;
  }

  .form-group {
    border-radius: 25px;
    background-color: aliceblue;
  }

  .form-control {

    width: 60%;
    height: 20px;
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

  label {
    width: 300px;
    color :#696161;
    box-shadow: rgb(176, 230, 233),15px,15px;
  }

  .button {
    border-radius: 5px;
    align-content: center;
    background-color: rgba(249, 209, 147, 0.95);
    border: none;
    color: white;
    padding: 6px 6px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
  }

</style>

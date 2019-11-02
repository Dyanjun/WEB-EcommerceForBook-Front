<template>
  <div id="pop">
    <div class="module-dialog-layer" style="display: block;"></div>
    <div class="module-dialog clear module-dialog-address module-dialog-show">
      <div class="dialog-panel">
        <div class="topbar">
          <div class="dialog-tit clear">
            <h4 class="js-dialog-title">添加图书</h4>
          </div>
          <button class="dialog-close" @click="giveup">x</button>
        </div>
        <div class="dialog-con js-dialog-container">
          <div class="animate-layer">
            <div class="dialog-inner js-address-add">
              <div class="save-address-box">
                <div class="address-form">
                  <div class="module-form-row">
                    <div class="form-item-v3">
                      <input type="text" class="js-verify" placeholder="书名" v-model="bookInfoVo.bookname">
                      <div class="verify-error"></div>
                    </div>
                  </div>
                  <div class="module-form-row">
                    <div class="form-item-v3">
                      <input type="text" class="js-verify" placeholder="作者"  v-model="bookInfoVo.author">
                      <div class="verify-error"></div>
                    </div>
                  </div>
                  <div class="module-form-row clear">
                    <div class="form-item-v3 area-code-w fn-left form-valid-item">
                      <input type="text" class="js-verify js-address-area-code" placeholder="价格"  v-model="bookInfoVo.price">
                      <div class="verify-error"></div>
                    </div>
                    <div class="form-item-v3 telephone-w fn-right form-valid-item">
                      <input type="text" class="js-verify js-address-telephone" placeholder="出版时间(xxxx-xx)"  v-model="bookInfoVo.publishtime">
                      <div class="verify-error"></div>
                    </div>
                  </div>
                  <div class="module-form-row">
                    <div class="form-item-v3">
                      <input type="text" class="js-verify" placeholder="ISBN"  v-model="bookInfoVo.isbn">
                      <div class="verify-error"></div>
                    </div>
                  </div>
                  <div class="module-form-row">
                    <div class="form-item-v3">
                      <input type="text" class="js-verify" placeholder="库存量"  v-model="bookInfoVo.inventory">
                      <div class="verify-error"></div>
                    </div>
                  </div>
                  <div class="module-form-row">
                    <div class="form-item-v3">
                      <input type="text" class="js-verify" placeholder="书籍简介（220字及以内）"  v-model="bookInfoVo.brief">
                      <div class="verify-error"></div>
                    </div>
                  </div>
                  <div>
                    <input type="file" @change="uploadFile($event)" multiple="multiple" />
                  </div>
                  <div>
                    <br/>
                  </div>
                  <div class="de_btn" >
                    <button style="color:white ;font-size:20px" @click="upload">确认添加</button>
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
  import '../assets/css/reset.css'
  export default {
    name: 'addbook',
    data() {
           return{
             newurl:"1",
             file:false,
             bookInfoVo:{bookname:"",author:"",price:"",inventory:"",publishtime:"",brief:"",isbn:""},
           }
    },
    methods:{
      uploadFile:function(event){
        this.file = event.target.files[0]; //获取input的图片file值
        let param = new FormData(); // 创建form对象
        param.append('image', this.file);//对应后台接收图片名
        this.$axios.post('http://localhost:8088/file/uploadImage',param)
          .then((response) => {
            console.log(response.data)
            if (response.data.flag === true) {
              alert("添加成功！")
              this.newurl=response.data.url
              this.file=true
            } else {
              alert(response.data.msc)
            }
          })
      },

      giveup:function(){
        if(confirm('确定要放弃添加吗')===true){
          this.bookInfoVo.bookname=""
          this.bookInfoVo.author=""
          this.bookInfoVo.price=""
          this.bookInfoVo.inventory=""
          this.bookInfoVo.publishtime=""
          this.bookInfoVo.brief=""
          this.bookInfoVo.isbn=""
          this.$router.replace({path: '/books_admin'})
        }
      },
      upload:function(){
        if(!this.file){
          alert("未上传图片")
          return
        }
        if(this.bookInfoVo.brief.length>220)
        {
          alert("简介超出220字")
          return
        }
        if(this.bookInfoVo.bookname!==""&&
          this.bookInfoVo.author!==""&&
          this.bookInfoVo.price!==""&&
          this.bookInfoVo.inventory!==""&&
          this.bookInfoVo.publishtime!==""&&
          this.bookInfoVo.brief!==""&&
          this.bookInfoVo.isbn!==""

        ){
          this.$axios.post('http://localhost:8088/addbook',{
            "bookname":this.bookInfoVo.bookname,
            "author": this.bookInfoVo.author,
            "price": this.bookInfoVo.price,
            "inventory":this.bookInfoVo.inventory,
            "publishtime":this.bookInfoVo.publishtime,
            "brief": this.bookInfoVo.brief,
            "isbn":this.bookInfoVo.isbn,
            "image":this.newurl
          })
            .then((response) => {
              console.log(response.data)
              if (response.data.flag === true) {
                alert("添加成功！")
                this.$router.replace({path: '/books_admin'})
              } else {
                alert(response.data.msc)
              }
            })
        }
        else{
          alert("信息填写不完整")
        }
      }
    }
  }
</script>

<style scoped>
  .upload_btn{
    height: 25px;
    width:30%;
    border: 2px solid #5F7ED7;
    border-radius:3px;
    text-align: center;
  }
  .de_btn{
    height: 40px;
    width: 100%;
    background: #5F7ED7;
    background: linear-gradient(#6F97E5,#527ED9);
    color: white;
    opacity: 4;
    border-radius:5px;
    text-align: center;
    vertical-align: center;
    font-size: 12px;

  }
  #pop .module-dialog-layer{
    display: none;
    position: fixed;
    _position: absolute;
    left: 0;
    top: 0;
    z-index: 1000;
    width: 100%;
    height: 500px;
    background-color: #000;
    opacity: .6;
  }
  #pop .module-dialog .dialog-panel, .module-dialog:after{
    display: inline-block;
    vertical-align: middle;
  }
  #pop .module-dialog:after{
    content: '';
    height: 100%;
    margin-left: -.25em;
  }
  #pop .module-dialog{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1001;
    text-align: center;
    opacity: 0;
    transition: opacity .2s ease-in;
  }
  #pop .module-dialog-show{
    opacity: 1;
  }
  #pop .blue-checkbox-on, .choose-checkbox-on .blue-checkbox{

  }
  #pop .module-dialog .dialog-panel{
    position: relative;
    width: 450px;
    min-width: 200px;
    border-radius: 10px;
    background: #FFF;
    box-shadow: 0 0 0 1px rgba(0,0,0,.1) inset, 1px 0 3px rgba(0,0,0,.1);
    text-align: left;
    height: 592px;
  }
  #pop .module-dialog .topbar{
    overflow: hidden;
    width: 100%;
    height: 60px;
    background: linear-gradient(#FFF,#F5F5F5);
    border-bottom: 1px solid #DCDCDC;
    border-radius: 10px 10px 0 0;
    box-shadow: 2px 0 5px rgba(0,0,0,.1);
  }
  #pop .module-dialog-address .topbar{
    position: relative;
    z-index: 10;
  }
  #pop .module-dialog .dialog-tit{
    height: 60px;
    padding: 0 15px;
    line-height: 60px;
  }
  #pop .module-dialog .dialog-tit h4{
    text-align: center;
    font-size: 18px;
    font-weight: 400;
    color: #666;
  }
  #pop .module-dialog .dialog-close{
    overflow: hidden;
    display: block;
    position: absolute;
    right: 10px;
    top: 15px;
    z-index: 20;
    width: 30px;
    height: 30px;
    line-height: 30px;
    font-size: 30px;
    color: #000;
    opacity: .2;
    cursor: pointer;
    transition: all .3s linear;
  }
  #pop .module-dialog .dialog-close:hover{
    opacity: .3;
  }
  #pop .module-dialog .animate-layer{
    position: relative;
  }
  #pop .module-dialog-address .save-address-box{
    width: 450px;
    padding-top: 29px;
  }
  #pop .address-form{
    width: 370px;
    margin: 0 auto;
  }
  #pop .account-address .address-form{
    padding: 30px;
    margin: 0;
  }
  #pop .module-form-row{
    position: relative;
    padding-bottom: 10px;
    margin: 0 auto;
  }
  #pop .address-form .module-form-row{
    padding-bottom: 15px;
  }
  #pop .module-form-row .form-item-v3{
    position: relative;
    height: 46px;
    background: #FFF;
    border: 1px solid #CCC;
    border-radius: 6px;
    box-shadow: 0 3px 5px -4px rgba(0,0,0,.4) inset, -1px 0 3px -2px rgba(0,0,0,.1) inset;
    line-height: 46px;
    font-size: 18px;
    opacity: .618;
    transition: opacity .3s ease;
  }
  #pop .module-form-row .form-item-v3 i{
    position: absolute;
    left: 15px;
    top: 0;
    font-size: 16px;
    color: #BEBEBE;
  }
  #pop .module-form-row .form-item-v3 input{
    padding: 0 15px;
    background-color: transparent;
    border: none;
    font-size: 16px;
  }
  #pop .address-form .form-item-v3 input{
    width: 330px;
  }
  #pop .address-form .area-code-w{
    width: 118px;
  }
  #pop .address-form .telephone-w{
    width: 238px;
  }
  #pop .module-form-row div.select-item{
    width: auto;
    height: auto;
    margin: 0;
    background: 0 0;
    border: none;
    box-shadow: none;
    opacity: 1;
  }
  #pop .module-form-row .form-item-v3 select{
    margin: 0 0 0 15px;
    background-color: transparent;
    border: none;
    font-size: 16px;
    color: #333;
  }
  #pop .address-form .select-province{
    width: 370px;
  }
  #pop .form-focus-item{
    z-index: 1;
    opacity: 1;
    border: 1px solid #6B93F2;
  }
  #pop .module-form-row div.select-item{
    width: auto;
    height: auto;
    margin: 0;
    background: 0 0;
    border: none;
    box-shadow: none;
    opacity: 1;
  }
  #pop .module-form-row .form-item-v3 select{
    height: 48px;
    padding: 0 15px;
    margin: 0;
    background: -webkit-linear-gradient(top,#FAFAFA,#F5F5F5);
    background: linear-gradient(#FAFAFA,#F5F5F5);
    border: 1px solid #CCC;
    border-radius: 6px;
    box-shadow: 2px 0 0 rgba(255,255,255,.4) inset, 1px 0 0 rgba(255,255,255,.3);
    line-height: 48px;
    text-indent: 0;
    outline: 0;
    -webkit-appearance: none;
    -moz-appearance: none;
    cursor: pointer;
  }
  #pop .address-form .select-city, .address-form .select-district{
    width: 180px;
  }
  #pop .blue-checkbox, .blue-checkbox-disable, .blue-checkbox-on{
    display: inline-block;
    position: relative;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
  #pop .address-form .blue-checkbox{
    top: 0;
    float: left;
    margin-right: 5px;
  }
  #pop .dialog-blue-btn{
    padding: 1px;
    background: #6383C6;
    background: linear-gradient(#6383C6,#4262AF);
    border-radius: 6px;
    text-align: center;
    color: #FFF;
  }
  #pop .disabled-btn{
    opacity: .4;
    background-color: #7EA1E8
  }

  #pop .dialog-blue-btn a{
    display: block;
    padding: 2px 0;
    background: #5F7ED7;
    background: linear-gradient(#6F97E5,#527ED9);
    border-radius: 5px;
    box-shadow: inset 0 1px 2px #7EA1E8;
    text-shadow: 0 -1px 0 #4F70B3;
    color: #FFF;
  }
  #pop .big-main-btn a{
    height: 42px;
    line-height: 42px;
    font-size: 18px;
  }
  #pop .module-form-row .form-invalid-item{
    opacity: 1;
    border: 1px solid #D16D62;
  }
  #pop .module-form-row .form-invalid-item:after{
    visibility: visible;
    opacity: 1;
  }


</style>

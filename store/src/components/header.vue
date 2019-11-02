<template>
  <div id="header">
    <div class="nav-global">
      <div class="container">
        <ul class="nav-list">
          <li style=" font-size :20px">Welcome to e-book</li>
        </ul>

      </div>
    </div>

  </div>
</template>

<script>
    import '../assets/css/header.css'
    import '../assets/css/reset.css'
    import '../router/index.js'

    export default {
        name: "header",
        data(){
          return {
              role:this.$store.role

          }
        },
      methods:{

      },


    }
</script>

<style scoped>

</style>

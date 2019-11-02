import Vue from 'vue'
import Router from 'vue-router'

import books from '../components/books.vue'
import login from '../components/login.vue'
import details from '../components/details.vue'
import cart from '../components/cart.vue'
import home from '../components/home.vue'
import order from '../components/order.vue'
import books_admin from '../components/books_admin.vue'
import order_admin from '../components/order_admin.vue'
import users from '../components/users.vue'
import addbook from '../components/addbook.vue'
Vue.use(Router)


export default new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'login',
      component: login,
    },
    {
      path: '/books',
      name: 'books',
      component: books,
    },
    {
      path: '/login',
      name: 'login',
      component: login,
    },
    {
      path: '/cart',
      name: 'cart',
      component: cart,
    },
    {
      path: '/home',
      name: 'home',
      component: home,
    },
    {
      path: '/index',
      name: 'home',
      component: home,
    },
    {
      path: '/details/:id',
      name: 'details',
      component: details
    },
    {
      path: '/order',
      name: 'order',
      component: order
    },
    {
      path: '/books_admin',
      name: 'books_admin',
      component:books_admin
    },
    {
      path: '/order_admin',
      name: 'order_admin',
      component: order_admin
    },
    {
      path: '/users',
      name: 'users',
      component: users
    },
    {
      path: '/addbook',
      name: 'addbook',
      component: addbook
    },

  ]
})

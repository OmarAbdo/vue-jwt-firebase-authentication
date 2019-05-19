<template>
  <div id="app">
    <app-header />
    <router-view></router-view>
  </div>
</template>

<script>
  import Header from './components/header/header.vue'
  export default {
    name: 'app',
    components: {
      'app-header': Header
    }, 
    /**
     * a created method by using a created lifecycle hook
     * to automaticcly check if user is loggedin when app 
     * starts
     */
    created () {
      this.$store.dispatch('tryAutoLogin')
    }
  }
</script>

<style>
  body, html {
    margin: 0;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  }
</style>
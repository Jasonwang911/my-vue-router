<template>
  <div id="app">
    <router-link to="/index">去首页</router-link>
    <router-link to="/about">去关于我们</router-link>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: "app",
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

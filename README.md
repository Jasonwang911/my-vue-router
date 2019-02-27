# vue-router 的实现
import VueTOuter from 'vue-router';    
  // VueRouter 是一个类，用来new 一个实例  

```
new VueRouter({  
    mode: 'hash',    // hash 或者是 history
    routes: [   
        {path: '/home', component: Home },  
    ]   
})  
``` 

```
<router-view></router-view>    // 用来显示路由组件的视图组件，需要注册  Vue.use(VueRouter); 
<router-link to="/home"></router-link>   // 链接全局组件，包括一些属性 eg： to
this.$route    属性集
this.$router   方法集    
```

## hash模式
基本原理： 在页面加载完和hash发生变化的时候获取 location.hash  

```
<body>
    <a href="#/home">首页</a>
    <a href="#/about">关于</a>
    <div id="html"></div>

<script>
    window.addEventListener('load', () => {
        html.innerHTML = location.hash.slice(1);
    })
    window.addEventListener('hashchange', () => {
        html.innerHTML = location.hash.slice(1);
    })
</script>
```

## history模式
使用浏览器的 history API  



## 注册插件 vue.use 
在插件上添加一个 install 的方法，这个方法接收两个参数，第一个参数是vue， 第二个参数是options
```
import Vue from 'vue';
import VueRouter from '@/router/vue-router.js';

// 注册组件
Vue.use(VueRouter, {name: 'jason', age: 18});


// VueRouter 的类  (/router/vue-router.js)
class VueRouter {

}

// 使用vue.use 就会调用 install 方法, 方法上有一个参数是vue实例
VueRouter.install = function(Vue, options) {
    console.log(Vue, options);
}

export default VueRouter;
```

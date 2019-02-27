import Vue from 'vue';
// 路由的history属性类
class HistoryRoute {
    constructor() {
        this.current = null;
    }
}

// VueRouter 的类
class VueRouter {
    // options 中包含 mode 和 routes
    constructor(options) {
        this.mode = options.mode || 'hash';
        this.routes = options.routes || [];
        // 把routes改成 路径:组件 的键值对对象，方便拿到路径直接渲染组件
        this.routesMap = this.createMap(this.routes);
        console.log('收敛后的路由表===>',this.routesMap);
        // 路由中history属性存放当前路径  创建一个history类，方便扩展属性  {currnet: null}
        this.history = new HistoryRoute;
        // 初始化操作
        this.init();
    }

    init() {
        console.log('执行了初始化的操作')
        // 判断路由模式
        if(this.mode === 'hash') {
            // 先判断用户打开时有没有hash，没有就跳转到 #/
            location.hash ? '' : location.hash = '/';
            // 页面加载完成当前路径写入this.history
            window.addEventListener('load', () => {
                this.history.current = location.hash.slice(1);
            });
            // 监听 hash 变化并把当前路径存入 this.history
            window.addEventListener('hashchange', () => {
                this.history.current = location.hash.slice(1);
            });
        }else if(this.mode === 'history'){
            // 判断用户打开页面的 pathname
            location.pathname ? '' : location.pathname = '/';
            // 页面加载完成当前路径写入this.history
            window.addEventListener('load', () => {
                this.history.current = location.pathname;
            });
            // 监听 history 变化并把当前路径存入 this.history
            window.addEventListener('popstate', () => {
                this.history.current = location.pathname;
            });
        }else {
            throw new Error(`vue-router mode error, can no font router mode: ${this.mode}`);
        }
    }

    // 收敛路由表 this.routes
    createMap(routes) {
        return routes.reduce((prev, next, index, arr) => {
            prev[next.path] = next.component;
            return prev;
        }, {});
    }
}

// 使用vue.use 就会调用 install 方法, 方法上有一个参数是vue实例
VueRouter.install = function(Vue) {
    // 混合到每个组件中路由属性和路由方法  每个组件都有 this.$router / this.$toute  this是当前的组件 组件中所有属性都在 this.$options上
    Vue.mixin({
        beforeCreate () {
            // this.$router 是 vue-router 的实例， 即 VueRouter， 在 main.js中实例化vue的时候传入的 vue-router 实例，需要在所有组件中拿到这个路由实例
            // vue 组件是从上到下渲染的 
            if(this.$options && this.$options.router) {
                // 根组件
                this._root = this;
                this._router = this.$options.router;
                // vue.util.defineReactive 是vue的一个核心库， 接收三个参数， 监听谁，第二个参数是一个别名，第三个参数如果是对象会深度监听,给对象中的每个属性加上set方法
                // hostoryzhong de current发生变化会令视图发生变化
                Vue.util.defineReactive(this, 'xxx' , this._router.history );
            }else {
                this._root = this.$parent._root;
            }
            Object.defineProperty(this, '$router', {
                    get() {
                        return this._root._router;
                    }
            });
            // this.$route 是路由实例的属性
            Object.defineProperty(this, '$route', {
                    get() {
                        return {
                            current: this._root.history.current
                        }
                    }
                });
        }
    });
    // 注册全局组件
    Vue.component('router-link', {
        props: {
            to: {
                type: String,
                default: ''
            },
            tag: String
        },
        methods: {
            // <tag on-click={this.handleClick.bind(this)}></tag>
            handleClick() {
                
            }
        },
        // h 表示 createElement 
        render(h) {
            let mode = this._self._root._router.mode;
            let tag = this.tag;
            // return h('a', {}, '首页');
            return <a href={mode === 'hash' ? `#${this.to}` : this.to}>{this.$slots.default}</a>
        }
    });
    // 根据当前的状态 history.current 匹配 收敛后的路由表
    Vue.component('router-view', { 
        // this 是 proxy   
        // h 表示 createElement 
        render(h) {
            // console.log(this);  先注册组件然后才页面加载完成执行 onload , 需要 currnet 变化 视图更新  --- vue 双向绑定  Object.defineProperty
             console.log('====>', this._root)
             let current = this._root._router.history.current;
             let routeMap = this._self._root._router.routesMap;
             console.log(current)
            return h(routeMap[current]);
        }
    });
}

export default VueRouter;
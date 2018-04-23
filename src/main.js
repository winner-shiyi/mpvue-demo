import Vue from 'vue';
import post from '@/utils/requestMethod';
import { PromiseAjax } from '@/utils/promiseAjax';
import App from './App';


Vue.config.productionTip = false;
App.mpType = 'app';

const app = new Vue(App);
app.$mount();
Vue.prototype.$post = post;
Vue.prototype.$PromiseAjax = PromiseAjax;


export default {
  // 这个字段走 app.json
    config: {
        // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
        pages: [
            'pages/index/main',
            'pages/logs/main',
            'pages/cart/main',
            'pages/my/main',
            '^pages/detail/main',
        ],
        window: {
            backgroundTextStyle: 'light',
            navigationBarBackgroundColor: '#fff',
            navigationBarTitleText: 'WeChat',
            navigationBarTextStyle: 'black',
        },
        tabBar: {
            list: [
                {
                    pagePath: 'pages/index/main',
                    // "iconPath":"imgs/toolbar/home.png",
                    // "selectedIconPath":"imgs/toolbar/home@selected.png",
                    text: '商品详情页',
                },
                {
                    pagePath: 'pages/cart/main',
                    text: '购物车',
                },
                {
                    pagePath: 'pages/my/main',
                    text: '我的',
                },
            ],
            backgroundColor: '#F5F5F5',
            selectedColor: '#AB956D',
            color: '#989898',
            borderStyle: 'red',
            position: 'bottom',
        },
    },
};

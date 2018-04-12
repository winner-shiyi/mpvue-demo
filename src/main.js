import Vue from 'vue';
import mpvueToastRegistry from 'mptoast/registry';
import post from '@/utils/requestMethod';
import App from './App';


Vue.config.productionTip = false;
App.mpType = 'app';

const app = new Vue(App);
app.$mount();
Vue.prototype.$post = post;

mpvueToastRegistry(Vue);

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: [
      'pages/index/main',
      'pages/logs/main',
      '^pages/demo/main',
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
          text: '主页',
        },
        {
          pagePath: 'pages/index/main',
          text: '分类',
        },
        {
          pagePath: 'pages/demo/main',
          text: '购物车',
        },
        {
          pagePath: 'pages/index/main',
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

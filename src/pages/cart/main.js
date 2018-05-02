import Vue from 'vue';
import App from './index';

const app = new Vue(App);
app.$mount();

export default {
    // 这个字段走 app.json
    config: {
        navigationBarTitleText: '购物车',
        usingComponents: {
            'slide-left': '/components/slider-left/index',
        },
    },
};

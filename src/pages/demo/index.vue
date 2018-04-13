<template>
  <div class="container" @click="clickHandle('传入的msg', $event)">

    <div class="userinfo" @click="bindViewTap">
      <img class="userinfo-avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" background-size="cover" />
      <div class="userinfo-nickname">
        <card :text="userInfo.nickName"></card>
      </div>
    </div>

    <div class="usermotto">
      <div class="user-motto" @click="wxtoast">
        <card :text="motto"></card>
      </div>
    </div>
    <mptoast></mptoast>

    <checkbox-group @change="checkboxChange($event)">
    <label class="checkbox" v-for="(item, index) in items" :key="index">
        <checkbox value="item.name" checked="item.checked"/>{{item.value}}
    </label>
    </checkbox-group>

  </div>
</template>

<script>

import card from '@/components/card';
import mptoast from 'mptoast';


export default {
  data() {
    return {
      motto: '我是购物车页面',
      userInfo: {},
      items: [
        { name: 'USA', value: '美国' },
        { name: 'CHN', value: '中国', checked: 'true' },
        { name: 'BRA', value: '巴西' },
        { name: 'JPN', value: '日本' },
        { name: 'ENG', value: '英国' },
        { name: 'TUR', value: '法国' },
      ],
    };
  },

  components: {
    card,
    mptoast,
  },

  methods: {
    checkboxChange(e) {
      console.log('checkbox发生change事件，携带value值为：', e);
    },
    wxtoast() {
      wx.showToast({
        title: '我是微信自带提示1234567',
        icon: 'none',
      });
    },
    showToast() {
      this.$mptoast('我是提示信息');
    },
    bindViewTap() {
      const url = '../logs/main';
      wx.navigateTo({ url });
    },
    getUserInfo() {
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: (res) => {
              this.userInfo = res.userInfo;
            },
          });
        },
      });
    },
    clickHandle(msg, ev) {
      console.log('clickHandle11:', msg);
      console.log('clickHandle33:', ev);
    },
  },

  created() {
    console.log('demo页面');
    // 调用应用实例的方法获取全局数据
    this.getUserInfo();
  },
};
</script>

<style scoped>
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 150px;
}

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}

.counter {
  display: inline-block;
  margin: 10px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}
</style>

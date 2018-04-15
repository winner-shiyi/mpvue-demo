<template>
  <div class="home-container" @click="onClick">
    点击跳转到商品详情页
  </div>
</template>

<script>
import card from '@/components/card';


export default {
  data() {
    return {
    };
  },

  components: {
    card,
  },

  methods: {
    onClick() {
      const url = '../detail/main';
      wx.navigateTo({ url });
    },
  },
};
</script>


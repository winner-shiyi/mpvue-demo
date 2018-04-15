<template>
  <view class="goods-detail-container">
    <view class="goods-detail-content" v-if="!loadingHidden">
       <swiper indicator-dots="true" autoplay="true" class="swiper">
            <block v-for="(item, index) in bannerArr" :key="index">
                <swiper-item class="banner-item" bindtap="onProductsItemTap" dataId="item.id">
                    <image class="item-image" :src="item.url" mode="aspectFill" />
                </swiper-item>
            </block>
        </swiper>
        <view class="desc-content">
            <view class="title">{{good.title}}</view>
            <view class="sub-title">{{good.subtittle}}</view>
            <view class="price-content">
                <div class="price-now">
                   <span class="rmb">￥</span> 
                   <span class="price">{{good.price}}</span>
                </div>
                <div class="price-old"></div>
            </view>
        </view>
        <split></split>
    </view>
    <loading v-if="loadingHidden">
        加载中...
    </loading>
  </view>
</template>

<script>
import card from '@/components/card';
import split from '@/components/split';


export default {
  data() {
    return {
      loadingHidden: false,
      bannerArr: [
        {
          id: '111',
          url: 'http://res.neosjyx.com/resource/images/photo/7043/20180409/201804090930192.jpg',
        },
        {
          id: '222',
          url: 'http://res.neosjyx.com/resource/images/photo/7043/20180409/201804090930180.jpg',
        },
      ],
      good: {
        title: '台湾树上熟是的根深蒂固十多个是的根深蒂固是的金钻ID房d间号凤梨1个装 单果约1150g',
        subtittle: '绵嫩无渣 鲜甜香滑',
        price: '29.8',
      },
    };
  },

  components: {
    card,
    split,
  },

  methods: {
    onProductsItemTap() {
      const url = '../logs/main';
      wx.navigateTo({ url });
    },
  },

  created() {
    // 调用应用实例的方法获取全局数据
    console.log('index页面');
    this.$post('user/login', { name: 'weina' }).then((res) => {
      console.log('res11111----', res);
    });
    // this.$PromiseAjax('user/login', { name: 'weina' }).then((res) => {
    //   console.log('res2222----', res);
    // });
  },
  onLoad() {
    console.log('onLoad');
  },
  onShow() {
    console.log('onShow');
  },
  mounted() {
    console.log('mounted');
  },
};
</script>

<style lang="scss" scoped>
.goods-detail-container{
    .swiper{
        height: 500rpx;
        width: 100%;
    }
    .swiper-box{
    overflow-x: hidden;
    }
    .banner-item{
    height: 100%;
    width: 100%;
    }
    .banner-item image{
    height: 100%;
    width: 100%;
    }
    .desc-content{
        .title, .sub-title{
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .title{
            font-size: 40rpx;
        }
        .sub-title{
            font-size: 28rpx;
        }
        .price-now{
            .rmb{
                font-size: 22rpx; 
            }
            .price{
                color: red;
                font-size: 40rpx; 
            }
        }
    }
}
</style>


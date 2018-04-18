<template>
  <view class="goods-detail-container">
    <view class="goods-detail-content" v-if="!loadingHidden">
       <swiper indicator-dots="true" autoplay="true" class="swiper">
            <block v-for="(item, index) in goodData.headImageList" :key="index">
                <swiper-item class="banner-item" bindtap="onProductsItemTap" dataId="item.id">
                    <image class="item-image" :src="item" mode="aspectFill" />
                </swiper-item>
            </block>
        </swiper>
        <view class="desc-content">
            <view class="title">{{goodData.spuName}}</view>
            <view class="sub-title">{{goodData.subTitle}}</view>
            <view class="price-content">
                <div class="price-now">
                   <span class="rmb">￥</span> 
                   <span class="price">{{goodData.sellingPrices}}</span>
                </div>
            </view>
        </view>
        <split>
            <!-- <h1 class="hh-slot" style="display: none">我是默认slot1111</h1> -->
        </split>
        <view class="cells-content" @click="showPanel">
            <div class="cells-title">规格数量选择：</div>
            <div class="single-cell-str" v-if="showSingleCel">
                已选择{{goodData.specList[0].valueList[0].specValue}}，{{goodCount}}件
            </div>
            <div class="multi-cell-content" v-if="!showSingleCel">
                <span>请选择规格</span>
            </div>
            <image class="r-arrow" src="http://m.neosjyx.com/res/right.7cbb4a37.png" mode="aspectFit"/>
        </view>
        <split></split>
        <view class="infos-content">
            <div class="infos-title">
                <span class="icon">=</span>
                <span class="title">商品详情</span>
                <span class="icon">=</span>
            </div>
            <ul class="infos-des-list">
                <li class="item" v-for="(desItem, desIndex) in goodData.goodsDetails" :key="desIndex">
                    <span class="key">{{desItem.key}}：</span>
                    <span class="value">{{desItem.value}}</span>
                </li>
            </ul>
            <div class="img-list">
                <image :src="imgItem" v-for="(imgItem, imgIndex) in goodData.detailImageList" :key="imgIndex" mode="aspectFit" />
            </div>
        </view>
        <view class="cart-bar-content">
            <div class="cart-bar">
                <div class="cart-icon" @click="goToCart">
                    <image class="icon" src="http://m.neosjyx.com/res/cart.9b748d5e.png" mode="aspectFit"/>
                    <div :class="calcCartClass" >{{calcCartCount}}</div>
                </div>
                <div class="cart-text" @click="addToCart">
                    <!-- <loading></loading> -->
                    <span>加入购物车</span>
                </div>
            </div>
        </view>
        <skupanel ref="skupanelaa" :fold="fold" v-show="showPanel" @close="closePanel"></skupanel>
    </view>
    <loading v-if="loadingHidden">
        加载中...
    </loading>
  </view>
</template>

<script>
import card from '@/components/card';
import split from '@/components/split';
import skupanel from '@/components/skupanel';


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
            goodData: {
                specList: [],
            },
            fold: true,
            goodCount: 1,
            cartCount: 100,
        };
    },
    components: {
        card,
        split,
        skupanel,
    },
    computed: {
        showSingleCel() {
            return this.goodData.specList.length === 1
                && this.goodData.specList[0].valueList.length === 1 ? 'true' : false;
        },
        calcCartCount() {
            return this.cartCount > 99 ? '99+' : this.cartCount;
        },
        calcCartClass() {
            return this.cartCount > 9 ? 'num max99' : 'num'
        },
    },
    methods: {
        onProductsItemTap() {
            const url = '../logs/main';
            wx.navigateTo({ url });
        },
        addToCart() {
            if (this.showSingleCel) {
                // 1、如果是单规格的话，直接调用接口，成功的话，toast提示加入购物车成功
            } else {
                 // 2、如果是多规格的话,总是弹起规格面板
                // this.fold = false;
                this.showPanel();
            }
            // console.log(this.$refs.skupanelaa);
            // this.$refs.skupanelaa.show();
        },
        goToCart() {
            const url = '../logs/main';
            wx.navigateTo({ url });
        },
        closePanel() {
            this.fold = true;
        },
        showPanel() {
            this.fold = false;
        },
    },

    created() {
        const param = {
            shopId: '',
            spuId: '',
        }
        console.log('detail页面');
        this.$post('spuDetail', param).then((data) => {
            console.log('resdetail----', data);
            this.goodData = data;
        });
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
        height: 250px;
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
        padding: 20px 15px;
        .title, .sub-title{
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .title{
            line-height: 24px;
            font-size: 20px;
        }
        .sub-title{
            line-height: 18px;
            margin: 5px 0 10px;
            font-size: 14px;
            color: #999;
        }
        .price-now{
            .rmb{
                font-size: 11px; 
            }
            .price{
                color: red;
                font-size: 20px; 
            }
        }
    }
    .cells-content{
        display: flex;
        justify-content: space-between;
        position: relative;
        height: 50px;
        line-height: 50px;
        padding: 0 25px 0 20px;
        .cells-title{
            font-size: 16px;
        }
        .single-cell-str{
            font-size: 12px;
            color: #999;
        }
        .multi-cell-content{
            font-size: 12px;
            color: #999;
        }
        .r-arrow{
            position: absolute;
            top: 20px;
            right: 15px;
            width: 7px;
            height: 13px;
        }
    }
    .infos-content{
        .infos-title{
            padding: 20px 0;
            text-align: center;
        }
        .infos-des-list{
            padding: 0 20px;
            .key, .value{
                font-size: 12px;
                color: #999;
            }
            .item{
                line-height: 22px;
                padding: 16px 0;
            }
        }
        .img-list{
            image{
                width: 100%;
            }
        }
    }
    .cart-bar-content{
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 55px;
        line-height: 55px;
        background: #fff;
        .cart-bar{
            display: flex;
        }
        .cart-icon{
            position: relative;
            width: 75px;
            height: 100%;
            flex: 0 0 75px;
            text-align: center;
            .icon{
                width: 30px;
                height: 30px;
            }
            .num{
                position: absolute;
                top: 0;
                right: 20px;
                width: 20px;
                height: 20px;
                line-height: 20px;
                border-radius: 50%;
                font-size: 12px;
                background:red;
            }
            .max99{
                padding: 0 10px;
                border-radius: 5px;
            }
        }
        .cart-text{
            flex: 1;
            text-align: center;
            background-color: #ca6
        }
    }
}
</style>


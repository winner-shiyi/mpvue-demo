<template>
  <view class="goods-detail-container">
    <view class="goods-detail-content" v-if="!loadingHidden">
       <swiper indicator-dots="true" autoplay="true" indicator-color="rgba(0, 0, 0, .2)" indicator-active-color="#FF6500" class="swiper">
            <block v-for="(item, index) in goodData.headImageList" :key="index">
                <swiper-item class="banner-item" bindtap="onProductsItemTap" dataId="item.id">
                    <image class="item-image" :src="item"/>
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
                   <!-- <test :list="list"></test> -->
                </div>
            </view>
        </view>
        <split></split>
        <view class="cells-content" @click="showPanel">
            <div class="cells-title">规格数量选择</div>
            <div class="single-cell-str" v-if="showSingleCel">
                已选择，{{goodData.specList[0].valueList[0].specValue}}{{singleSpecCount}}件
            </div>
            <div class="multi-cell-content" v-if="!showSingleCel">
                <span>{{specText}}</span>
            </div>
            <image class="r-arrow" src="/static/img/detail/arrow@3x.png"/>
        </view>
        <split></split>
        <view class="infos-content">
            <div class="infos-title">
                <image class="icon" src="/static/img/detail/line@3x.png"/>
                <span class="title">商品详情</span>
                <image class="icon" src="/static/img/detail/line@3x.png"/>
            </div>
            <ul class="infos-des-list">
                <li class="item" v-for="(desItem, desIndex) in goodData.goodsDetails" :key="desIndex">
                    <span class="key">{{desItem.key}}：</span>
                    <span class="value">{{desItem.value}}</span>
                </li>
            </ul>
            <div class="img-list">
                <image class="imgItem" :src="imgItem" v-for="(imgItem, imgIndex) in goodData.detailImageList" :key="imgIndex" mode="widthFix"/>
            </div>
        </view>
        <view class="cart-bar-content">
            <div class="cart-bar">
                <div class="cart-icon" @click="goToCart">
                    <image class="icon" src="/static/img/detail/shopcart@3x.png"/>
                    <div :class="calcCartClass">{{calcCartCount}}</div>
                </div>
                <div class="cart-text" @click="addToCart">
                    <!-- <loading></loading> -->
                    <span>加入购物车</span>
                </div>
            </div>
        </view>
        <view class="wrap-sku-panel">
            <template v-if="goodData.specList.length">
                <skupanel
                    v-model="showPanelStatus"
                    :specList="goodData.specList"
                    :skuList="goodData.skuList"
                    @add="selectGood"
                ></skupanel>
            </template>
        </view>
    </view>
    <loading v-if="loadingHidden">
        加载中...
    </loading>
  </view>
</template>

<script>
import split from '@/components/split';
import skupanel from '@/components/skupanel';
// import test from '@/components/test';

// 常量表示：商品下架
const STOCK = '1';

export default {
    components: {
        split,
        skupanel,
    },
    data() {
        return {
            loadingHidden: false,
            goodData: {
                specList: [],
                skuList: [],
            },
            singleSpecCount: 1, // 单规格选择数量
            cartCount: 0,
            // 显示或隐藏面板
            showPanelStatus: false,
            singleSpecText: '', // 单规格默认文案
            specText: '', // 多规格默认文案
        };
    },
    created() {
        const param = {
            shopId: '',
            spuId: '',
        }
        // 获取商品详情数据
        this.$post('spuDetail', param).then((data) => {
            // console.log('resdetail----', data);
            this.goodData = data;
            this.genSpecText();
        });
        // 获取购物车数量
        this.$post('getCartAmont').then((data) => {
            this.cartCount = data.count;
        })
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
        calcStore() {
            let totalStore = 0
            this.goodData.skuList.forEach((sku) => {
                totalStore += sku.quantity
            })
            console.log('this.totalStore---', totalStore)
            return totalStore
        },
    },
    methods: {
        addToCart() {
            if (this.showSingleCel) {
                // 1、如果是单规格的话，直接调用接口，成功的话，toast提示加入购物车成功
            } else {
                // 2、如果是多规格的话,总是弹起规格面板
                this.showPanel();
            }
        },
        goToCart() {
            const url = '../cart/main';
            wx.switchTab({ url });
        },
        showPanel() {
            // 如果商品下架 或 商品总库存为 0 则不弹出规格面板
            if (this.goodData.saleStatus === STOCK || !this.calcStore) return
            this.showPanelStatus = true
        },
        genSpecText() {
            this.specText = this.goodData.saleStatus === STOCK ? '商品已下架' : '请选择规格'
        },
        selectGood(value, num) {
            // 更新购物车数量
            this.cartCount += num;
            // 更新多规格规格选择文案
            const newVal = `已选择${value}，${num}件`
            this.specText = newVal.length > 24 ? `${newVal.slice(0, 13)}..` : newVal
            // 单规格选择文案
            this.singleSpecCount = num
        },
    },
};
</script>

<style lang="scss" scoped>
@import "../../style/base/mixin.scss";
$green: #77BA2C;
$orange: #FF6500;

.goods-detail-container{
    .swiper{
        width: 100%;
        height: 375px;
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
        padding: 7px 15px 11px;
        .title, .sub-title{
            @include ellipsisLn(2, 18);
        }
        .title{
            line-height: 25px;
            font-size: 17px;
            color: #333;
        }
        .sub-title{
            line-height: 16px;
            margin: 5px 0 10px;
            font-size: 12px;
            color: #959595;
        }
        .price-now{
            .rmb{
                font-size: 14px; 
                line-height: 26px;
                color: $orange;
            }
            .price{
                color: $orange;
                font-size: 24px; 
                line-height: 32px;
            }
        }
    }
    .cells-content{
        display: flex;
        justify-content: space-between;
        position: relative;
        height: 50px;
        line-height: 50px;
        padding: 0 26px 0 15px;
        .cells-title{
            font-size: 14px;
            color: #333;
        }
        .single-cell-str{
            font-size: 14px;
            color: #959595;
        }
        .multi-cell-content{
            font-size: 14px;
            color: #959595;
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
            height: 50px;
            line-height: 50px;
            text-align: center;
            font-size: 14px;
            color: #959595;
            .icon{
                width: 20px;
                height: 6px;
            }
        }
        .title{
            margin: 0 7px;
        }
        .infos-des-list{
            margin: 0 20px;
            padding-bottom: 5px;
            background: #fff;
            .item{
                font-size: 14px;
                color: #333;
                height: 44px;
                line-height: 44px;
                border-bottom: 1px solid #E5E5E5;
                &:last-child{
                    border: none;
                }
            }
        }
        .img-list{
            padding-bottom: 50px;
            .imgItem{
                display: block;
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
                top: 4px;
                left: 44px;
                width: 15px;
                height: 15px;
                line-height: 15px;
                border-radius: 50%;
                font-size: 10px;
                background: $orange;
                color: #fff;
            }
            .max99{
                padding: 0 3px;
                border-radius: 18px;
            }
        }
        .cart-text{
            flex: 1;
            text-align: center;
            background-color: $green;
            color: #fff;
            font-size: 17px;
        }
    }
}
</style>

